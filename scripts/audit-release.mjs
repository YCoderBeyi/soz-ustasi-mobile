import { existsSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

/* global console, process */

const root = process.cwd();
const errors = [];
const warnings = [];

function read(relativePath) {
  return readFileSync(join(root, relativePath), 'utf8');
}

function requireFile(relativePath) {
  if (!existsSync(join(root, relativePath))) errors.push(`Missing file: ${relativePath}`);
}

function parseReleaseManifest(text) {
  const fields = new Map();
  for (const line of text.split(/\r?\n/)) {
    const match = line.match(/^- ([^:]+):\s*(.+)$/);
    if (match) {
      const value = match[2].trim().replace(/^`|`$/g, '');
      fields.set(match[1], value);
    }
  }
  return fields;
}

const gradle = read('android/app/build.gradle');
const manifest = read('android/app/src/main/AndroidManifest.xml');
const playerSaveSource = read('src/game/playerSave.ts');
const privacy = read('public/privacy.html');
const releaseManifestPath = 'vault/07-Production/Release-Manifest-v1.md';
const releaseManifestText = read(releaseManifestPath);
const releaseManifest = parseReleaseManifest(releaseManifestText);

const versionName = gradle.match(/versionName\s+"([^"]+)"/)?.[1];
const versionCode = gradle.match(/versionCode\s+(\d+)/)?.[1];
const applicationId = gradle.match(/applicationId\s+"([^"]+)"/)?.[1];
const releaseManifestVersionName = releaseManifest.get('Version name');
const releaseManifestVersionCode = releaseManifest.get('Version code');

function requireManifestValue(label, expected) {
  const actual = releaseManifest.get(label);
  if (actual !== expected) {
    errors.push(`Release manifest mismatch: ${label}=${actual ?? 'missing'} (expected ${expected})`);
  }
}

function requireResolvedManifestField(label, placeholder) {
  const actual = releaseManifest.get(label);
  if (!actual) {
    errors.push(`Release manifest field missing: ${label}`);
    return;
  }
  if (actual === placeholder) {
    errors.push(`Release manifest field unresolved: ${label}`);
  }
}

const packageVersion = JSON.parse(read('package.json')).version;
if (versionName !== packageVersion) {
  errors.push(`Android versionName (${versionName ?? 'missing'}) must equal package.json version (${packageVersion}).`);
}
if (!versionCode || !/^\d+$/.test(versionCode)) errors.push(`Android versionCode must be a number, found ${versionCode ?? 'missing'}.`);
if (applicationId !== 'com.sozustasi.game') errors.push(`Unexpected applicationId: ${applicationId ?? 'missing'}`);

if (releaseManifestVersionName !== packageVersion) {
  errors.push(`Release manifest version name (${releaseManifestVersionName ?? 'missing'}) must equal package.json version (${packageVersion}).`);
}
if (releaseManifestVersionCode !== versionCode) {
  errors.push(`Release manifest version code (${releaseManifestVersionCode ?? 'missing'}) must equal Android versionCode (${versionCode ?? 'missing'}).`);
}
requireManifestValue('Track', 'Closed test, then production after eligibility');
requireManifestValue('Data model', 'PlayerSave v3');
requireManifestValue('Network access', 'Internet (AdMob)');
requireManifestValue('Ads', 'Rewarded (AdMob)');
requireManifestValue('In-app purchases', 'None');
requireManifestValue('Account/login', 'None');
requireManifestValue('Supported locale', 'tr-TR');
requireManifestValue('Level catalog', '75 authored levels');

requireResolvedManifestField('Release owner', 'pending sign-off');
requireResolvedManifestField('AAB SHA-256', 'pending build');
requireResolvedManifestField('APK SHA-256', 'pending build');

const forbiddenPermissions = [
  'android.permission.CAMERA',
  'android.permission.RECORD_AUDIO',
  'android.permission.ACCESS_FINE_LOCATION',
  'android.permission.READ_CONTACTS',
];
for (const permission of forbiddenPermissions) {
  if (manifest.includes(permission)) errors.push(`Unexpected permission: ${permission}`);
}
if (!manifest.includes('android:allowBackup="false"')) errors.push('Android backup must remain disabled for local-only save.');

// Reklam etkinse AdMob SDK'sı ve kimliği zorunludur; reklamsız modda INTERNET
// izni yasaktır. Kapı "önce manifest, sonra SDK" felsefesini korur.
const adsValue = releaseManifest.get('Ads');
if (adsValue && adsValue !== 'None') {
  if (!manifest.includes('android.permission.INTERNET')) {
    errors.push('AdMob için android.permission.INTERNET bildirilmelidir.');
  }
  if (!manifest.includes('com.google.android.gms.ads.APPLICATION_ID')) {
    errors.push('AdMob APPLICATION_ID meta-data bildirilmelidir.');
  }
  const stringsXml = read('android/app/src/main/res/values/strings.xml');
  if (!stringsXml.includes('admob_app_id') || !stringsXml.includes('ca-app-pub-')) {
    errors.push('AdMob app id (admob_app_id) strings.xml içinde tanımlı olmalıdır.');
  }
  const pkgJson = read('package.json');
  if (!pkgJson.includes('@capacitor-community/admob')) {
    errors.push('@capacitor-community/admob bağımlılığı package.json içinde olmalıdır.');
  }
} else if (manifest.includes('android.permission.INTERNET')) {
  errors.push('Ads: None iken android.permission.INTERNET bildirilmemelidir.');
}

for (const text of ['Reklam İzle', '2x Ödül Al', 'Günlük keşif ödülü']) {
  if (playerSaveSource.includes(text)) errors.push(`Unimplemented promise remains in UI: ${text}`);
}

if (!playerSaveSource.includes('window.localStorage.setItem')) errors.push('Persistent player save is missing.');
if (!privacy.includes('kişisel veya hassas kullanıcı verisi toplamaz')) errors.push('Privacy policy data collection statement is missing.');
if (existsSync(join(root, 'public/assets/themes/imported'))) errors.push('Raw imported theme assets must not be included in public build.');

requireFile(`artifacts/SozUstasi-${releaseManifestVersionName}-release.apk`);
requireFile(`artifacts/SozUstasi-${releaseManifestVersionName}-release.aab`);
requireFile('vault/07-Production/Data-Safety-v1.md');
requireFile('vault/07-Production/Google-Play-Listing-v1.md');
requireFile('vault/07-Production/Closed-Test-Checklist-v1.md');

for (const artifact of [`artifacts/SozUstasi-${releaseManifestVersionName}-release.apk`, `artifacts/SozUstasi-${releaseManifestVersionName}-release.aab`]) {
  const path = join(root, artifact);
  if (existsSync(path) && statSync(path).size > 40 * 1024 * 1024) {
    warnings.push(`${artifact} is larger than 40 MB; rebuild after asset cleanup.`);
  }
}

// ---- Ads readiness (only when the release declares ads) -------------------------------------------------------
const adsMode = releaseManifest.get('Ads') ?? '';
if (adsMode && !/^none$/i.test(adsMode)) {
  const PUBLISHER = 'pub-2784764635828379';
  const APP_ADS_LINE = `google.com, ${PUBLISHER}, DIRECT, f08c47fec0942fa0`;
  const GOOGLE_TEST_ID = '3940256099942544';
  // AdMob ids registered for com.sozustasi.game (AdMob app "Söz Ustası - Kelime Oyunu"). The sibling "(Windows PC)" app is a different AdMob record.
  const ADMOB_APP_ID = 'ca-app-pub-2784764635828379~5793638649';
  const ADMOB_REWARDED_UNIT = 'ca-app-pub-2784764635828379/5235235447';

  // app-ads.txt must exist in both places with exactly the publisher line.
  for (const file of ['app-ads.txt', 'public/app-ads.txt']) {
    if (!existsSync(join(root, file))) { errors.push(`Missing ${file} (AdMob verification).`); continue; }
    const lines = read(file).split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
    if (lines.length !== 1 || lines[0] !== APP_ADS_LINE) errors.push(`${file} must contain exactly: ${APP_ADS_LINE}`);
  }
  if (read('app-ads.txt') !== read('public/app-ads.txt')) errors.push('app-ads.txt and public/app-ads.txt differ.');

  // Ad ids must be real, from this publisher, and never Google's sample ids.
  const adSource = read('src/services/admob.ts');
  const stringsForAds = read('android/app/src/main/res/values/strings.xml');
  const publisherDigits = PUBLISHER.replace('pub-', '');
  for (const [label, text] of [['admob.ts', adSource], ['strings.xml', stringsForAds]]) {
    if (text.includes(GOOGLE_TEST_ID)) errors.push(`${label} contains a Google sample ad id.`);
    for (const id of text.match(/ca-app-pub-\d+/g) ?? []) {
      if (id !== `ca-app-pub-${publisherDigits}`) errors.push(`${label}: ad id ${id} does not belong to ${PUBLISHER}.`);
    }
  }

  if (!stringsForAds.includes(`>${ADMOB_APP_ID}<`)) errors.push(`strings.xml admob_app_id must be ${ADMOB_APP_ID} (the AdMob app for com.sozustasi.game).`);
  if (!adSource.includes(`'${ADMOB_REWARDED_UNIT}'`)) errors.push(`admob.ts rewarded unit must be ${ADMOB_REWARDED_UNIT} (a unit of the same AdMob app).`);
  // The unit must belong to the same AdMob app as the app id: units of other apps are rejected above because only this one is allowed.

  // The audience declaration must exist and match the store listing (13+, not child-directed).
  if (!/tagForChildDirectedTreatment:\s*false/.test(adSource)) errors.push('admob.ts must declare tagForChildDirectedTreatment: false (13+ audience).');
  if (!/maxAdContentRating:\s*MaxAdContentRating\.ParentalGuidance/.test(adSource)) errors.push('admob.ts must cap ad content at ParentalGuidance.');
  if (!/13 yaş/.test(read('vault/07-Production/Google-Play-Listing-v1.md'))) errors.push('Store listing must state the 13+ target age.');
  if (!/13 yaşın altındaki çocuklara yönelik değildir/.test(privacy)) errors.push('Privacy policy must state that the app is not for children under 13.');
  if (/çocuklara yönelik reklam kurallarına uygun/.test(privacy)) errors.push('Privacy policy still claims child-directed ad settings the app does not use.');

  // Ads must never be requested without consent.
  if (!/adsAllowed/.test(adSource)) errors.push('admob.ts must gate ad requests on consent (adsAllowed).');

  // Production builds must not run in test mode.
  if (!/IS_TESTING\s*=\s*import\.meta\.env\.DEV/.test(adSource)) errors.push('admob.ts test mode must come from import.meta.env.DEV only.');
}

for (const warning of warnings) console.warn(`WARN ${warning}`);
for (const error of errors) console.error(`ERR ${error}`);

if (errors.length > 0) process.exit(1);
console.log(`Release audit OK: version ${releaseManifestVersionName}, code ${releaseManifestVersionCode}, ${warnings.length} warning.`);
