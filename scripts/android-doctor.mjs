import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

/* global console, process */

const root = process.cwd();
const androidDir = join(root, 'android');
const localPropertiesPath = join(androidDir, 'local.properties');

function readSdkDirFromLocalProperties() {
  if (!existsSync(localPropertiesPath)) {
    return null;
  }

  const content = readFileSync(localPropertiesPath, 'utf8');
  const line = content
    .split(/\r?\n/)
    .map((entry) => entry.trim())
    .find((entry) => entry.startsWith('sdk.dir='));

  if (!line) {
    return null;
  }

  return line.slice('sdk.dir='.length).replace(/\\\\/g, '\\');
}

const sdkCandidates = [
  process.env.ANDROID_HOME,
  process.env.ANDROID_SDK_ROOT,
  readSdkDirFromLocalProperties(),
].filter(Boolean);

const sdkDir = sdkCandidates.find((candidate) => existsSync(candidate));
const hasAndroidProject = existsSync(join(androidDir, 'app', 'build.gradle'));
const hasGradleWrapper = existsSync(join(androidDir, 'gradlew.bat'));
const hasWebBuild = existsSync(join(root, 'dist', 'index.html'));

const checks = [
  ['Android project', hasAndroidProject],
  ['Gradle wrapper', hasGradleWrapper],
  ['Web build output', hasWebBuild],
  ['Android SDK', Boolean(sdkDir)],
];

for (const [label, ok] of checks) {
  console.log(`${ok ? 'OK ' : 'ERR'} ${label}`);
}

if (sdkDir) {
  console.log(`OK  SDK path: ${sdkDir}`);
}

if (!sdkDir) {
  console.error(
    'ERR Android SDK not found. Install Android Studio/SDK or create android/local.properties from android/local.properties.example.',
  );
  process.exit(1);
}

if (!hasAndroidProject || !hasGradleWrapper || !hasWebBuild) {
  process.exit(1);
}
