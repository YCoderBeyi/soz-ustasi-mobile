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
requireManifestValue('Network access', 'Internet (AdMob; optional Google Play Games)');
requireManifestValue('Ads', 'Rewarded + Interstitial + Map and LevelStart Banner (AdMob)');
requireManifestValue('In-app purchases', 'None');
requireManifestValue('Account/login', 'None (optional Play Games leaderboard opt-in)');
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
  if (!manifest.includes('com.google.android.gms.permission.AD_ID')) {
    errors.push('AdMob reklam kimliği kullanımı beyan ediliyorsa AD_ID izni Android manifestinde bulunmalıdır.');
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
if (!privacy.includes('Söz Ustası kendi sunucularında kullanıcı hesabı veya oyun profili tutmaz')) {
  errors.push('Privacy policy data collection statement is missing.');
}
if (existsSync(join(root, 'public/assets/themes/imported'))) errors.push('Raw imported theme assets must not be included in public build.');

const aabArtifact = `artifacts/SozUstasi-${releaseManifestVersionName}-release.aab`;
const apkArtifact = `artifacts/SozUstasi-${releaseManifestVersionName}-release.apk`;
requireFile(aabArtifact);
if (!existsSync(join(root, apkArtifact))) {
  warnings.push(`Optional sideload APK missing: ${apkArtifact} (Play upload uses AAB).`);
}
requireFile('vault/07-Production/Data-Safety-v1.md');
requireFile('vault/07-Production/Google-Play-Listing-v1.md');
requireFile('vault/07-Production/Closed-Test-Checklist-v1.md');

for (const artifact of [apkArtifact, aabArtifact]) {
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
  const GOOGLE_TEST_BANNER_UNIT = 'ca-app-pub-3940256099942544/9214589741';
  // AdMob ids registered for com.sozustasi.game (AdMob app "Söz Ustası - Kelime Oyunu"). The sibling "(Windows PC)" app is a different AdMob record.
  const ADMOB_APP_ID = 'ca-app-pub-2784764635828379~5793638649';
const ADMOB_REWARDED_UNIT = 'ca-app-pub-2784764635828379/5235235447';
  const ADMOB_INTERSTITIAL_UNIT_LOCKED = 'ca-app-pub-2784764635828379/3292115308';
  const ADMOB_BANNER_UNIT = process.env.VITE_ADMOB_BANNER_ID ?? readOptionalEnv('VITE_ADMOB_BANNER_ID');
  const ADMOB_INTERSTITIAL_UNIT = process.env.VITE_ADMOB_INTERSTITIAL_ID ?? readOptionalEnv('VITE_ADMOB_INTERSTITIAL_ID');
  const GOOGLE_TEST_INTERSTITIAL_UNIT = 'ca-app-pub-3940256099942544/1033173712';

  // app-ads.txt must exist in both places with exactly the publisher line.
  for (const file of ['app-ads.txt', 'public/app-ads.txt']) {
    if (!existsSync(join(root, file))) { errors.push(`Missing ${file} (AdMob verification).`); continue; }
    const lines = read(file).split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
    if (lines.length !== 1 || lines[0] !== APP_ADS_LINE) errors.push(`${file} must contain exactly: ${APP_ADS_LINE}`);
  }
  if (read('app-ads.txt') !== read('public/app-ads.txt')) errors.push('app-ads.txt and public/app-ads.txt differ.');

  // Production must use this publisher's real banner unit. The sole Google sample unit
  // allowed in source is the explicit development-only banner ID.
  const adSource = read('src/services/admob.ts');
  const stringsForAds = read('android/app/src/main/res/values/strings.xml');
  const publisherDigits = PUBLISHER.replace('pub-', '');
  for (const [label, text] of [['admob.ts', adSource], ['strings.xml', stringsForAds]]) {
    if (text.includes(GOOGLE_TEST_ID)) {
      const testIds = [...new Set(text.match(/ca-app-pub-3940256099942544\/\d+/g) ?? [])];
      const allowedDevUnits = new Set([GOOGLE_TEST_BANNER_UNIT, GOOGLE_TEST_INTERSTITIAL_UNIT]);
      if (label !== 'admob.ts' || testIds.length === 0 || testIds.some((id) => !allowedDevUnits.has(id))) {
        errors.push(`${label} contains an unexpected Google sample ad id.`);
      }
    }
    for (const id of text.match(/ca-app-pub-\d+/g) ?? []) {
      if (id !== `ca-app-pub-${publisherDigits}` && id !== 'ca-app-pub-3940256099942544') {
        errors.push(`${label}: ad id ${id} does not belong to ${PUBLISHER}.`);
      }
    }
  }

  if (!stringsForAds.includes(`>${ADMOB_APP_ID}<`)) errors.push(`strings.xml admob_app_id must be ${ADMOB_APP_ID} (the AdMob app for com.sozustasi.game).`);
  if (!adSource.includes(`'${ADMOB_REWARDED_UNIT}'`)) errors.push(`admob.ts rewarded unit must be ${ADMOB_REWARDED_UNIT} (a unit of the same AdMob app).`);
  if (!read('src/screens/ShopScreen.tsx').includes('showRewardedAd')) errors.push('C+: shop coin reward must use standard showRewardedAd (no RI).');
  if (read('src/screens/ShopScreen.tsx').includes('showRewardedInterstitialAd')) errors.push('Shop must not call showRewardedInterstitialAd after C+ migration.');
  if (/prepareRewardInterstitialAd|showRewardInterstitialAd|showRewardedInterstitialAd/.test(adSource)) {
    errors.push('C+: rewarded interstitial APIs must be removed from admob.ts.');
  }
  if (!/^ca-app-pub-2784764635828379\/\d+$/.test(ADMOB_BANNER_UNIT ?? '')) {
    errors.push('Set VITE_ADMOB_BANNER_ID in .env.production.local to a real banner unit from publisher pub-2784764635828379.');
  } else if (ADMOB_BANNER_UNIT === ADMOB_REWARDED_UNIT) {
    errors.push('VITE_ADMOB_BANNER_ID must be a separate AdMob banner unit, not the rewarded unit.');
  }
  if (!/VITE_ADMOB_BANNER_ID/.test(adSource) || !/showBanner\(/.test(adSource) || !/hideBanner\(/.test(adSource)) {
    errors.push('Map banner must use the configured unit and be shown/hidden through the shared AdMob service.');
  }
  if (ADMOB_INTERSTITIAL_UNIT !== ADMOB_INTERSTITIAL_UNIT_LOCKED) {
    errors.push(`Set VITE_ADMOB_INTERSTITIAL_ID in .env.production.local to ${ADMOB_INTERSTITIAL_UNIT_LOCKED}.`);
  } else if ([ADMOB_REWARDED_UNIT, ADMOB_BANNER_UNIT].includes(ADMOB_INTERSTITIAL_UNIT)) {
    errors.push('VITE_ADMOB_INTERSTITIAL_ID must be a dedicated interstitial unit.');
  }
  if (!/VITE_ADMOB_INTERSTITIAL_ID/.test(adSource) || !/prepareInterstitial/.test(adSource) || !/attemptLevelBreakInterstitial/.test(adSource)) {
    errors.push('Level-break interstitial must use VITE_ADMOB_INTERSTITIAL_ID via prepareInterstitial / attemptLevelBreakInterstitial.');
  }
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

function readOptionalEnv(name) {
  for (const file of ['.env.production.local', '.env.production', '.env.local', '.env']) {
    if (!existsSync(join(root, file))) continue;
    const line = read(file).split(/\r?\n/).find((item) => item.match(new RegExp(`^\\s*(?:export\\s+)?${name}\\s*=`)));
    if (!line) continue;
    const value = line.slice(line.indexOf('=') + 1).trim().replace(/^(['"])(.*)\1$/, '$2');
    if (value) return value;
  }
  return '';
}

for (const warning of warnings) console.warn(`WARN ${warning}`);
for (const error of errors) console.error(`ERR ${error}`);

if (errors.length > 0) process.exit(1);
console.log(`Release audit OK: version ${releaseManifestVersionName}, code ${releaseManifestVersionCode}, ${warnings.length} warning.`);
