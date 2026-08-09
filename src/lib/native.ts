/**
 * Capacitor / native shell helpers.
 * Safe to import on web — no-ops when not running inside Capacitor.
 */

export function isNativeApp(): boolean {
  if (typeof window === "undefined") return false;
  const cap = (window as Window & { Capacitor?: { isNativePlatform?: () => boolean } })
    .Capacitor;
  try {
    return cap?.isNativePlatform?.() === true;
  } catch {
    return false;
  }
}

/** Platform string: ios | android | web */
export function nativePlatform(): "ios" | "android" | "web" {
  if (typeof window === "undefined") return "web";
  const cap = (
    window as Window & {
      Capacitor?: { getPlatform?: () => string; isNativePlatform?: () => boolean };
    }
  ).Capacitor;
  if (!cap?.isNativePlatform?.()) return "web";
  const p = cap.getPlatform?.() ?? "web";
  if (p === "ios" || p === "android") return p;
  return "web";
}
