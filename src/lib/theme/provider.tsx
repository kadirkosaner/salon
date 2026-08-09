import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  ACCENT_STORAGE_KEY,
  type AccentId,
  applyThemeToDocument,
  DEFAULT_ACCENT,
  DEFAULT_THEME,
  isTheme,
  normalizeAccent,
  readStoredAccent,
  readStoredTheme,
  THEME_STORAGE_KEY,
  type ThemeId,
} from "./tokens";

type ThemeValue = {
  theme: ThemeId;
  accent: AccentId;
  setTheme: (t: ThemeId) => void;
  setAccent: (a: AccentId) => void;
  setThemeAndAccent: (t: ThemeId, a?: AccentId) => void;
  ready: boolean;
};

const ThemeContext = createContext<ThemeValue | null>(null);

export function ThemeProvider({
  children,
  serverTheme,
  serverAccent,
}: {
  children: React.ReactNode;
  serverTheme?: ThemeId | null;
  serverAccent?: AccentId | null;
}) {
  const [theme, setThemeState] = useState<ThemeId>(DEFAULT_THEME);
  const [accent, setAccentState] = useState<AccentId>(DEFAULT_ACCENT.obsidian);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let t = readStoredTheme();
    let a = readStoredAccent(t);
    if (serverTheme && isTheme(serverTheme)) {
      t = serverTheme;
      a = normalizeAccent(t, serverAccent ?? a);
    }
    setThemeState(t);
    setAccentState(a);
    applyThemeToDocument(t, a);
    setReady(true);
  }, [serverTheme, serverAccent]);

  useEffect(() => {
    if (!ready) return;
    applyThemeToDocument(theme, accent);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
      localStorage.setItem(ACCENT_STORAGE_KEY, accent);
    } catch {
      /* ignore */
    }
  }, [theme, accent, ready]);

  const setTheme = useCallback((t: ThemeId) => {
    setThemeState(t);
    setAccentState((prev) => normalizeAccent(t, prev));
  }, []);

  const setAccent = useCallback((a: AccentId) => {
    setAccentState(a);
  }, []);

  const setThemeAndAccent = useCallback((t: ThemeId, a?: AccentId) => {
    const nextA = normalizeAccent(t, a);
    setThemeState((prev) => (prev === t ? prev : t));
    setAccentState((prev) => (prev === nextA ? prev : nextA));
  }, []);

  const value = useMemo(
    () => ({ theme, accent, setTheme, setAccent, setThemeAndAccent, ready }),
    [theme, accent, setTheme, setAccent, setThemeAndAccent, ready],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme outside provider");
  return ctx;
}
