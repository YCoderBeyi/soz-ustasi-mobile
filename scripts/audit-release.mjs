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

const packageJson = JSON.parse(read('package.json'));
const gradle = read('android/app/build.gradle');
const manifest = read('android/app/src/main/AndroidManifest.xml');
const playerSaveSource = read('src/game/playerSave.ts');
const privacy = read('public/privacy.html');

const versionName = gradle.match(/versionName\s+"([^"]+)"/)?.[1];
const versionCode = gradle.match(/versionCode\s+(\d+)/)?.[1];
const applicationId = gradle.match(/applicationId\s+"([^"]+)"/)?.[1];

if (versionName !== packageJson.version) {
  errors.push(`Version mismatch: package.json=${packageJson.version}, Android=${versionName ?? 'missing'}`);
}
if (!versionCode || Number(versionCode) < 1) errors.push('Android versionCode must be at least 1.');
if (applicationId !== 'com.sozustasi.game') errors.push(`Unexpected applicationId: ${applicationId ?? 'missing'}`);

const forbiddenPermissions = [
  'android.permission.INTERNET',
  'android.permission.CAMERA',
  'android.permission.RECORD_AUDIO',
  'android.permission.ACCESS_FINE_LOCATION',
  'android.permission.READ_CONTACTS',
];
for (const permission of forbiddenPermissions) {
  if (manifest.includes(permission)) errors.push(`Unexpected permission: ${permission}`);
}
if (!manifest.includes('android:allowBackup="false"')) errors.push('Android backup must remain disabled for local-only save.');

for (const text of ['Reklam İzle', '2x Ödül Al', 'Günlük keşif ödülü']) {
  if (playerSaveSource.includes(text)) errors.push(`Unimplemented promise remains in UI: ${text}`);
}

if (!playerSaveSource.includes('window.localStorage.setItem')) errors.push('Persistent player save is missing.');
if (!privacy.includes('kişisel veya hassas kullanıcı verisi toplamaz')) errors.push('Privacy policy data collection statement is missing.');
if (existsSync(join(root, 'public/assets/themes/imported'))) errors.push('Raw imported theme assets must not be included in public build.');

requireFile(`artifacts/SozUstasi-${versionName}-release.apk`);
requireFile(`artifacts/SozUstasi-${versionName}-release.aab`);
requireFile('vault/07-Production/Data-Safety-v1.md');
requireFile('vault/07-Production/Google-Play-Listing-v1.md');
requireFile('vault/07-Production/Closed-Test-Checklist-v1.md');

for (const artifact of [`artifacts/SozUstasi-${versionName}-release.apk`, `artifacts/SozUstasi-${versionName}-release.aab`]) {
  const path = join(root, artifact);
  if (existsSync(path) && statSync(path).size > 40 * 1024 * 1024) {
    warnings.push(`${artifact} is larger than 40 MB; rebuild after asset cleanup.`);
  }
}

for (const warning of warnings) console.warn(`WARN ${warning}`);
for (const error of errors) console.error(`ERR ${error}`);

if (errors.length > 0) process.exit(1);
console.log(`Release audit OK: version ${versionName}, code ${versionCode}, ${warnings.length} warning.`);
