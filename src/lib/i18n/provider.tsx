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
  // BCP47 fallbacks: pt-BR → pt-BR only if present; else primary subtag
  const primary = v.split("-")[0]!.toLowerCase();
  if (VALID.has(primary)) return primary as Locale;
  // zh-CN → zh-Hans if ever added
  if (primary === "zh" && VALID.has("zh-Hans")) return "zh-Hans" as Locale;
  if (v.toLowerCase() === "pt-br" && VALID.has("pt-BR")) return "pt-BR" as Locale;
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
      document.documentElement.lang = locale;
      document.documentElement.dir = "ltr";
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
        for (const [k, v] of Object.entries(vars)) {
          s = s.replaceAll(`{${k}}`, String(v));
        }
      }
      return s;
    },
    [locale],
  );

  const value = useMemo(
    () => ({ locale, setLocale, t, locales: LOCALES }),
    [locale, setLocale, t],
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
