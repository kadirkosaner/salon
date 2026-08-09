# Salon iOS build (requires macOS + Xcode)

Linux/this sandbox cannot compile IPA. The **Xcode project is already generated** under `ios/`.

## On a Mac

```bash
# 1. Point at your live social server
cp .env.native.example .env.native
# CAPACITOR_SERVER_URL=https://your-salon.vercel.app

# 2. Sync Capacitor
npm install
npx cap sync ios

# 3. Open Xcode
npx cap open ios

# 4. In Xcode: select team signing → product → Archive → Distribute
```

App ID: `app.salon.fitness`  
The WebView loads `CAPACITOR_SERVER_URL` so all social APIs hit production.
