// Installs the release APK of the version in package.json on the connected device (one source for the version number).
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

/* global console, process */

const { version } = JSON.parse(readFileSync('package.json', 'utf8'));
const apk = `artifacts/SozUstasi-${version}-release.apk`;
const adb = process.env.ADB ?? 'D:\Android\Sdk\platform-tools\adb.exe';
console.log(`Installing ${apk}`);
const result = spawnSync(adb, ['install', '-r', apk], { stdio: 'inherit' });
process.exit(result.status ?? 1);
