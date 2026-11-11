import { execFileSync, spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { setTimeout as sleep } from 'node:timers/promises';
import appJson from '../app.json' with { type: 'json' };

const ADB =
  process.env['ADB'] ??
  (process.env['ANDROID_HOME'] === undefined
    ? 'adb'
    : `${process.env['ANDROID_HOME']}/platform-tools/adb`);
const METRO_PORT = '8081';
const APK = 'android/app/build/outputs/apk/debug/app-debug.apk';
const PACKAGE = appJson.expo.android.package;
const METRO_URL = encodeURIComponent(`http://localhost:${METRO_PORT}`);

function adb(args: string[]): string {
  return execFileSync(ADB, args, { encoding: 'utf8' });
}

function findPhone(): string {
  if (process.env['PHONE'] !== undefined) return process.env['PHONE'];
  const lines = adb(['devices']).split('\n').slice(1);
  const phone = lines
    .map((line) => line.trim().split(/\s+/u))
    .find(([serial, state]) => state === 'device' && !serial?.startsWith('emulator'));
  if (phone?.[0] !== undefined) return phone[0];
  const unauthorized = lines.some((line) => line.includes('unauthorized'));
  throw new Error(
    unauthorized
      ? 'The phone did not allow USB debugging yet: unlock it and accept "Allow USB debugging".'
      : `${ADB} sees no phone: plug it in over USB with USB debugging on. On WSL2, set ADB to the adb.exe of Windows.`,
  );
}

function hostPath(path: string): string {
  if (!ADB.endsWith('.exe')) return path;
  return execFileSync('wslpath', ['-w', path], { encoding: 'utf8' }).trim();
}

function installApp(serial: string): void {
  if (adb(['-s', serial, 'shell', 'pm', 'path', PACKAGE]).includes('package:')) return;
  console.log(`Building the development build of ${PACKAGE}, once`);
  if (!existsSync('android')) {
    execFileSync('npx', ['expo', 'prebuild', '--platform', 'android'], { stdio: 'inherit' });
  }
  execFileSync('sh', ['gradlew', 'assembleDebug'], { cwd: 'android', stdio: 'inherit' });
  adb(['-s', serial, 'install', '-r', hostPath(APK)]);
}

async function waitForMetro(): Promise<void> {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    const status = await fetch(`http://localhost:${METRO_PORT}/status`)
      .then(async (response) => response.text())
      .catch(() => '');
    if (status.includes('packager-status:running')) return;
    await sleep(2000);
  }
  throw new Error(`Metro did not answer on port ${METRO_PORT} within two minutes.`);
}

try {
  const serial = findPhone();
  adb(['-s', serial, 'reverse', `tcp:${METRO_PORT}`, `tcp:${METRO_PORT}`]);
  installApp(serial);
  spawn('npx', ['expo', 'start', '--dev-client', '--localhost', '--port', METRO_PORT], {
    stdio: 'inherit',
  });
  await waitForMetro();
  const link = `${appJson.expo.scheme}://expo-development-client/?url=${METRO_URL}`;
  adb(['-s', serial, 'shell', 'am', 'start', '-a', 'android.intent.action.VIEW', '-d', link]);
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(
    message.includes('ENOENT')
      ? `${message}: set ANDROID_HOME, or ADB to the adb to use.`
      : message,
  );
  process.exitCode = 1;
}
