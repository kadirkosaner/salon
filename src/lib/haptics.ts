const KEY = "salon.haptic";

/** Read haptic preference (local cache of server setting). Default on. */
export function isHapticEnabled(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const v = localStorage.getItem(KEY);
    if (v === "0") return false;
    if (v === "1") return true;
  } catch {
    /* ignore */
  }
  return true;
}

export function setHapticEnabled(on: boolean) {
  try {
    localStorage.setItem(KEY, on ? "1" : "0");
  } catch {
    /* ignore */
  }
}

type Pattern = number | number[];

function vibe(pattern: Pattern) {
  if (!isHapticEnabled()) return;

  // Native Capacitor haptics (iOS/Android)
  void (async () => {
    try {
      const cap = (
        window as Window & {
          Capacitor?: { isNativePlatform?: () => boolean };
        }
      ).Capacitor;
      if (cap?.isNativePlatform?.()) {
        const { Haptics, ImpactStyle } = await import("@capacitor/haptics");
        if (Array.isArray(pattern) && pattern.length > 2) {
          await Haptics.impact({ style: ImpactStyle.Heavy });
        } else {
          await Haptics.impact({ style: ImpactStyle.Light });
        }
        return;
      }
    } catch {
      /* fall through to vibrate */
    }
  })();

  if (typeof navigator === "undefined" || !navigator.vibrate) return;
  try {
    navigator.vibrate(pattern);
  } catch {
    /* ignore */
  }
}

export const haptic = {
  setComplete: () => vibe(12),
  pr: () => vibe([30, 40, 30, 40, 60]),
  like: () => vibe(8),
  follow: () => vibe(14),
  finish: () => vibe([20, 30, 40]),
  error: () => vibe([40, 60, 40]),
  soft: () => vibe(6),
};
