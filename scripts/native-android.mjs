#!/usr/bin/env node
/**
 * Build Salon Android (debug APK) via Capacitor + Gradle.
 *
 * Requires:
 *   - CAPACITOR_SERVER_URL in env or .env.native (live social server)
 *   - Android SDK (auto-installs cmdline-tools if ANDROID_HOME unset)
 *
 * Usage:
 *   node scripts/native-android.mjs
 *   node scripts/native-android.mjs --apk
 *   CAPACITOR_SERVER_URL=https://… node scripts/native-android.mjs
 */
import { spawnSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
  chmodSync,
  copyFileSync,
  readdirSync,
} from "node:fs";
import { resolve, join } from "node:path";
import { homedir } from "node:os";

const root = resolve(process.cwd());
const wantApk = process.argv.includes("--apk") || true;

function loadNativeEnv() {
  const path = join(root, ".env.native");
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i < 0) continue;
    const k = t.slice(0, i).trim();
    let v = t.slice(i + 1).trim();
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      v = v.slice(1, -1);
    }
    if (!process.env[k]) process.env[k] = v;
  }
}

loadNativeEnv();

// Prefer JDK 21 (Capacitor 8 / AGP require source 21)
const jdkCandidates = [
  process.env.JAVA_HOME,
  "/opt/jdk-21",
  "/usr/lib/jvm/java-21-openjdk-amd64",
  "/usr/lib/jvm/java-17-openjdk-amd64",
].filter(Boolean);
for (const j of jdkCandidates) {
  if (existsSync(join(j, "bin", "java"))) {
    process.env.JAVA_HOME = j;
    process.env.PATH = `${join(j, "bin")}:${process.env.PATH || ""}`;
    break;
  }
}
console.log(`[native-android] JAVA_HOME=${process.env.JAVA_HOME}`);

const serverUrl = (process.env.CAPACITOR_SERVER_URL || "").trim();

if (!serverUrl) {
  console.error(`
[native-android] CAPACITOR_SERVER_URL is required so the social app hits your live server.

  cp .env.native.example .env.native
  # edit CAPACITOR_SERVER_URL=https://your-deployed-salon.example.com
  npm run native:android:apk
`);
  process.exit(1);
}

console.log(`[native-android] server → ${serverUrl}`);

function run(cmd, args, opts = {}) {
  console.log(`$ ${cmd} ${args.join(" ")}`);
  const r = spawnSync(cmd, args, {
    stdio: "inherit",
    cwd: opts.cwd || root,
    env: { ...process.env, ...opts.env },
    shell: opts.shell,
  });
  if (r.status !== 0) {
    process.exit(r.status ?? 1);
  }
}

// ── Android SDK bootstrap ────────────────────────────────────────────────────
const sdkRoot =
  process.env.ANDROID_HOME ||
  process.env.ANDROID_SDK_ROOT ||
  join(homedir(), "Android", "Sdk");

process.env.ANDROID_HOME = sdkRoot;
process.env.ANDROID_SDK_ROOT = sdkRoot;

const cmdlineLatest = join(sdkRoot, "cmdline-tools", "latest", "bin", "sdkmanager");

function ensureSdk() {
  if (existsSync(cmdlineLatest)) {
    console.log(`[native-android] SDK ok: ${sdkRoot}`);
    return;
  }
  console.log(`[native-android] Installing Android cmdline-tools → ${sdkRoot}`);
  mkdirSync(join(sdkRoot, "cmdline-tools"), { recursive: true });
  const zip = join("/tmp", "android-cmdline-tools.zip");
  const url =
    "https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip";
  run("curl", ["-fsSL", "-o", zip, url]);
  run("unzip", ["-qo", zip, "-d", join(sdkRoot, "cmdline-tools")]);
  // zip extracts as cmdline-tools/cmdline-tools → rename to latest
  const extracted = join(sdkRoot, "cmdline-tools", "cmdline-tools");
  const latest = join(sdkRoot, "cmdline-tools", "latest");
  if (existsSync(extracted) && !existsSync(latest)) {
    run("mv", [extracted, latest]);
  }
  if (!existsSync(cmdlineLatest)) {
    console.error("[native-android] sdkmanager missing after install");
    process.exit(1);
  }
  chmodSync(cmdlineLatest, 0o755);
}

function sdkmanager(packages) {
  const args = [
    cmdlineLatest,
    "--sdk_root=" + sdkRoot,
    ...packages,
  ];
  console.log(`$ sdkmanager ${packages.join(" ")}`);
  const r = spawnSync("bash", ["-lc", `yes | ${args.map((a) => JSON.stringify(a)).join(" ")}`], {
    stdio: "inherit",
    env: process.env,
  });
  if (r.status !== 0) process.exit(r.status ?? 1);
}

ensureSdk();
sdkmanager([
  "platform-tools",
  "platforms;android-35",
  "build-tools;35.0.0",
]);

// local.properties for Gradle
const localProps = join(root, "android", "local.properties");
writeFileSync(localProps, `sdk.dir=${sdkRoot.replace(/\\/g, "/")}\n`);

// Capacitor sync (picks up CAPACITOR_SERVER_URL via capacitor.config.ts)
run("npx", ["cap", "sync", "android"]);

// Gradle debug APK
const gradlew = join(root, "android", "gradlew");
if (!existsSync(gradlew)) {
  console.error("[native-android] android/gradlew missing — run npx cap add android");
  process.exit(1);
}
chmodSync(gradlew, 0o755);

run(gradlew, ["assembleDebug", "--no-daemon"], {
  cwd: join(root, "android"),
  env: {
    ANDROID_HOME: sdkRoot,
    ANDROID_SDK_ROOT: sdkRoot,
  },
});

const apkSrc = join(
  root,
  "android/app/build/outputs/apk/debug/app-debug.apk",
);
if (!existsSync(apkSrc)) {
  console.error("[native-android] APK not found at", apkSrc);
  process.exit(1);
}

const outDir = join(root, "native/dist");
mkdirSync(outDir, { recursive: true });
const apkOut = join(outDir, "Salon-debug.apk");
copyFileSync(apkSrc, apkOut);
console.log(`
[native-android] ✓ APK ready
  ${apkOut}

Install on a device:
  adb install -r ${apkOut}

The app WebView loads: ${serverUrl}
(Social, auth, feed, workouts all go to that server.)
`);

// list for convenience
try {
  console.log(
    "outputs:",
    readdirSync(join(root, "android/app/build/outputs/apk/debug")).join(", "),
  );
} catch {
  /* ignore */
}

void wantApk;
