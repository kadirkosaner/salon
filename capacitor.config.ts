import type { CapacitorConfig } from "@capacitor/cli";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

/**
 * Native shell (Capacitor) for iOS + Android.
 *
 * Social app mode: the WebView loads the **live server** URL so auth, feed,
 * follows, and workouts all hit the real backend (Vercel + Neon). Set:
 *
 *   CAPACITOR_SERVER_URL=https://your-salon.example.com
 *
 * Optional file: `/workspace/.env.native` (KEY=value lines).
 */

function readEnvFile(): Record<string, string> {
  const path = resolve(process.cwd(), ".env.native");
  if (!existsSync(path)) return {};
  const out: Record<string, string> = {};
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
    out[k] = v;
  }
  return out;
}

const fileEnv = readEnvFile();
const serverUrl = (
  process.env.CAPACITOR_SERVER_URL ||
  process.env.VITE_PUBLIC_APP_URL ||
  fileEnv.CAPACITOR_SERVER_URL ||
  fileEnv.VITE_PUBLIC_APP_URL ||
  ""
).trim();

const config: CapacitorConfig = {
  appId: "app.salon.fitness",
  appName: "Salon",
  webDir: "native/www",
  // Bundled fallback shell; remote URL takes over when set.
  ...(serverUrl
    ? {
        server: {
          url: serverUrl,
          cleartext: serverUrl.startsWith("http://"),
          // Allow OAuth redirects + API same host
          allowNavigation: [
            serverUrl,
            "https://*.vercel.app",
            "https://*.grok.me",
            "https://*.grok-sandbox.com",
          ],
        },
      }
    : {}),
  android: {
    allowMixedContent: true,
    backgroundColor: "#0c0c0b",
  },
  ios: {
    backgroundColor: "#0c0c0b",
    contentInset: "automatic",
    preferredContentMode: "mobile",
    scheme: "Salon",
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1200,
      launchAutoHide: true,
      backgroundColor: "#0c0c0b",
      showSpinner: false,
    },
    StatusBar: {
      style: "DARK",
      backgroundColor: "#0c0c0b",
    },
    Keyboard: {
      resize: "body",
      resizeOnFullScreen: true,
    },
  },
};

export default config;
