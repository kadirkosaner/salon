export const THEMES = ["obsidian", "carbon"] as const;
export type ThemeId = (typeof THEMES)[number];

export const OBSIDIAN_ACCENTS = [
  { id: "pirinc", hex: "#B9A177", labelKey: "settings.accentPirinc" },
  { id: "bakir", hex: "#C08552", labelKey: "settings.accentBakir" },
  { id: "kemik", hex: "#E8E2D6", labelKey: "settings.accentKemik" },
] as const;

export const CARBON_ACCENTS = [
  { id: "volt", hex: "#D6FF3F", labelKey: "settings.accentVolt" },
  { id: "ates", hex: "#FF6A2B", labelKey: "settings.accentAtes" },
  { id: "buz", hex: "#42E3FF", labelKey: "settings.accentBuz" },
  { id: "neon", hex: "#FF3F86", labelKey: "settings.accentNeon" },
  { id: "kehribar", hex: "#FFC23F", labelKey: "settings.accentKehribar" },
  { id: "beyaz", hex: "#FFFFFF", labelKey: "settings.accentBeyaz" },
  { id: "ufuk", hex: "#7C5CFF", labelKey: "settings.accentUfuk" },
] as const;

export type AccentId =
  | (typeof OBSIDIAN_ACCENTS)[number]["id"]
  | (typeof CARBON_ACCENTS)[number]["id"];

export const DEFAULT_THEME: ThemeId = "obsidian";
export const DEFAULT_ACCENT: Record<ThemeId, AccentId> = {
  obsidian: "pirinc",
  carbon: "volt",
};

export const THEME_STORAGE_KEY = "salon.theme";
export const ACCENT_STORAGE_KEY = "salon.accent";

export function isTheme(v: string | null | undefined): v is ThemeId {
  return v === "obsidian" || v === "carbon";
}

export function accentsFor(theme: ThemeId) {
  return theme === "carbon" ? CARBON_ACCENTS : OBSIDIAN_ACCENTS;
}

export function isAccentForTheme(
  theme: ThemeId,
  accent: string | null | undefined,
): accent is AccentId {
  if (!accent) return false;
  return accentsFor(theme).some((a) => a.id === accent);
}

export function normalizeAccent(theme: ThemeId, accent: string | null | undefined): AccentId {
  if (isAccentForTheme(theme, accent)) return accent;
  return DEFAULT_ACCENT[theme];
}

export function applyThemeToDocument(theme: ThemeId, accent: AccentId) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.setAttribute("data-theme", theme);
  root.setAttribute("data-accent", accent);
}

export function readStoredTheme(): ThemeId {
  if (typeof window === "undefined") return DEFAULT_THEME;
  try {
    const v = localStorage.getItem(THEME_STORAGE_KEY);
    if (isTheme(v)) return v;
  } catch {
    /* ignore */
  }
  return DEFAULT_THEME;
}

export function readStoredAccent(theme: ThemeId): AccentId {
  if (typeof window === "undefined") return DEFAULT_ACCENT[theme];
  try {
    const v = localStorage.getItem(ACCENT_STORAGE_KEY);
    return normalizeAccent(theme, v);
  } catch {
    return DEFAULT_ACCENT[theme];
  }
}

/** Inline script source — inject in <head> to prevent FOUC. */
export const THEME_BOOT_SCRIPT = `(function(){try{var t=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)})||${JSON.stringify(DEFAULT_THEME)};if(t!=="obsidian"&&t!=="carbon")t=${JSON.stringify(DEFAULT_THEME)};var a=localStorage.getItem(${JSON.stringify(ACCENT_STORAGE_KEY)});var ok={obsidian:["pirinc","bakir","kemik"],carbon:["volt","ates","buz","neon","kehribar","beyaz","ufuk"]};if(!a||ok[t].indexOf(a)<0)a={obsidian:"pirinc",carbon:"volt"}[t];var d=document.documentElement;d.setAttribute("data-theme",t);d.setAttribute("data-accent",a);}catch(e){document.documentElement.setAttribute("data-theme","obsidian");document.documentElement.setAttribute("data-accent","pirinc");}})();`;
