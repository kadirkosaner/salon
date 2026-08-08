import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { LOCALES, messages, type Locale } from "./messages";

const STORAGE_KEY = "salon.locale";
const VALID = new Set(LOCALES.map((l) => l.id));

type I18nValue = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
  locales: typeof LOCALES;
};

const I18nContext = createContext<I18nValue | null>(null);

function readStored(): Locale {
  if (typeof window === "undefined") return "tr";
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v && VALID.has(v as Locale)) return v as Locale;
  } catch {
    /* ignore */
  }
  // browser language hint
  try {
    const nav = (navigator.language || "tr").slice(0, 2).toLowerCase();
    if (VALID.has(nav as Locale)) return nav as Locale;
  } catch {
    /* ignore */
  }
  return "tr";
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("tr");
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
    }
  }, [locale, ready]);

  const setLocale = useCallback((l: Locale) => {
    if (VALID.has(l)) setLocaleState(l);
  }, []);

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>) => {
      const table = messages[locale] ?? messages.en;
      let s =
        table[key] ??
        messages.en[key] ??
        messages.tr[key] ??
        key;
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

export function useT() {
  return useI18n().t;
}
