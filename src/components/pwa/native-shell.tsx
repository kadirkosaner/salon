import { useEffect } from "react";
import { isNativeApp } from "@/lib/native";

/**
 * Capacitor chrome: status bar, splash, keyboard, back button.
 * No-op on pure web / PWA.
 */
export function NativeShell() {
  useEffect(() => {
    if (!isNativeApp()) return;
    let cancelled = false;

    void (async () => {
      try {
        const { StatusBar, Style } = await import("@capacitor/status-bar");
        if (cancelled) return;
        await StatusBar.setStyle({ style: Style.Dark });
        await StatusBar.setBackgroundColor({ color: "#0c0c0b" }).catch(() => {
          /* iOS ignores backgroundColor */
        });
      } catch {
        /* plugin missing */
      }

      try {
        const { SplashScreen } = await import("@capacitor/splash-screen");
        if (!cancelled) await SplashScreen.hide().catch(() => {});
      } catch {
        /* ignore */
      }

      try {
        const { App } = await import("@capacitor/app");
        const sub = await App.addListener("backButton", ({ canGoBack }) => {
          if (canGoBack) {
            window.history.back();
          } else {
            void App.exitApp();
          }
        });
        if (cancelled) {
          void sub.remove();
          return;
        }
        // store cleanup on cancel
        (NativeShell as unknown as { _back?: { remove: () => void } })._back = sub;
      } catch {
        /* web */
      }
    })();

    return () => {
      cancelled = true;
      const back = (NativeShell as unknown as { _back?: { remove: () => Promise<void> | void } })
        ._back;
      void back?.remove?.();
    };
  }, []);

  return null;
}
