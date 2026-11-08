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

if (versionName !== '1.1.0') {
  errors.push(`Android versionName must be 1.1.0, found ${versionName ?? 'missing'}.`);
}
if (!versionCode || Number(versionCode) !== 24) errors.push(`Android versionCode must be 24, found ${versionCode ?? 'missing'}.`);
if (applicationId !== 'com.sozustasi.game') errors.push(`Unexpected applicationId: ${applicationId ?? 'missing'}`);

if (releaseManifestVersionName !== '1.1.0') {
  errors.push(`Release manifest version name must be 1.1.0, found ${releaseManifestVersionName ?? 'missing'}.`);
}
if (releaseManifestVersionCode !== '24') {
  errors.push(`Release manifest version code must be 24, found ${releaseManifestVersionCode ?? 'missing'}.`);
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

for (const warning of warnings) console.warn(`WARN ${warning}`);
for (const error of errors) console.error(`ERR ${error}`);

if (errors.length > 0) process.exit(1);
console.log(`Release audit OK: version ${releaseManifestVersionName}, code ${releaseManifestVersionCode}, ${warnings.length} warning.`);
