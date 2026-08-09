# Salon — native iOS / Android (Capacitor)

Salon is a **social fitness app** with a real backend. The native apps are
**Capacitor shells** that open your **live server** (Vercel deploy) so login,
feed, follows, workouts and profiles all share the same database.

```
┌─────────────────┐         HTTPS          ┌──────────────────────┐
│  iOS / Android  │ ─────────────────────► │  Salon web + API     │
│  Capacitor app  │   auth, feed, social   │  (Vercel + Neon DB)  │
└─────────────────┘                        └──────────────────────┘
```

## 1. Point at your social server

```bash
cp .env.native.example .env.native
# edit:
# CAPACITOR_SERVER_URL=https://YOUR-DEPLOYED-SALON.example.com
```

Use the **production HTTPS URL** after deploy (same place the web app runs).
Without this, the APK still builds but only shows a local placeholder page.

## 2. Android APK (this environment)

```bash
npm run native:android:apk
# → native/dist/Salon-debug.apk
```

Install on a phone/emulator:

```bash
adb install -r native/dist/Salon-debug.apk
```

Release / Play Store signing is done in Android Studio (`npx cap open android`).

## 3. iOS (needs a Mac + Xcode)

```bash
npx cap sync ios
npx cap open ios
# Xcode → signing team → Archive → App Store / TestFlight
```

Details: `scripts/native-ios.md`

## 4. After changing the web app

```bash
npx cap sync
# then rebuild APK / re-open Xcode
```

If you only changed **server-side** code on the live URL, **no rebuild** is
needed — the installed app loads the remote server on every launch.

## App ID

- Package / bundle: `app.salon.fitness`
- Display name: `Salon`
