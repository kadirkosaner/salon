import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  BASE_LOCALE,
  LOCALES,
  localeDir,
  messages,
  type Locale,
  type MessageKey,
} from "./messages";

const STORAGE_KEY = "salon.locale";
const VALID = new Set<string>(LOCALES.map((l) => l.id));

function normalizeLocale(raw: string | null | undefined): Locale | null {
  if (!raw) return null;
  const v = raw.trim();
  if (VALID.has(v)) return v as Locale;
  const lower = v.toLowerCase();
  if (lower === "pt-br" && VALID.has("pt-BR")) return "pt-BR";
  if (lower === "zh-cn" || lower === "zh-hans" || lower === "zh") {
    if (VALID.has("zh-CN")) return "zh-CN";
  }
  if (lower === "zh-tw" || lower === "zh-hant" || lower === "zh-hk") {
    if (VALID.has("zh-TW")) return "zh-TW";
  }
  const primary = v.split("-")[0]!.toLowerCase();
  if (VALID.has(primary)) return primary as Locale;
  return null;
}

function detectBrowserLocale(): Locale {
  if (typeof navigator === "undefined") return BASE_LOCALE;
  try {
    const list =
      navigator.languages?.length > 0
        ? navigator.languages
        : [navigator.language || BASE_LOCALE];
    for (const cand of list) {
      const hit = normalizeLocale(cand);
      if (hit) return hit;
    }
  } catch {
    /* ignore */
  }
  return BASE_LOCALE;
}

function readStored(): Locale {
  if (typeof window === "undefined") return BASE_LOCALE;
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    const hit = normalizeLocale(v);
    if (hit) return hit;
  } catch {
    /* ignore */
  }
  return detectBrowserLocale();
}

export type TranslateFn = (
  key: MessageKey | (string & {}),
  vars?: Record<string, string | number>,
) => string;

type I18nValue = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: TranslateFn;
  locales: typeof LOCALES;
  dir: "ltr" | "rtl";
};

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(BASE_LOCALE);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setLocaleState(readStored());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, locale);
    } catch {
      /* ignore */
    }
    if (typeof document !== "undefined") {
      const dir = localeDir(locale);
      document.documentElement.lang = locale;
      document.documentElement.dir = dir;
    }
  }, [locale, ready]);

  const setLocale = useCallback((l: Locale) => {
    if (VALID.has(l)) setLocaleState(l);
  }, []);

  const t = useCallback<TranslateFn>(
    (key, vars) => {
      const table = messages[locale] ?? messages[BASE_LOCALE];
      const k = key as MessageKey;
      let s: string =
        table[k] ?? messages[BASE_LOCALE][k] ?? String(key);
      if (vars) {
        for (const [vk, vv] of Object.entries(vars)) {
          s = s.replaceAll(`{${vk}}`, String(vv));
        }
      }
      return s;
    },
    [locale],
  );

  const dir = localeDir(locale);

  const value = useMemo(
    () => ({ locale, setLocale, t, locales: LOCALES, dir }),
    [locale, setLocale, t, dir],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n outside provider");
  return ctx;
}

export function useT(): TranslateFn {
  return useI18n().t;
}
