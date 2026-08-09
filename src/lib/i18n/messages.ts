import { en } from "./locales/en";
import { tr } from "./locales/tr";
import { de } from "./locales/de";
import { es } from "./locales/es";
import { id } from "./locales/id";
import { ptBR } from "./locales/pt-BR";
import { ja } from "./locales/ja";
import { ko } from "./locales/ko";
import { vi } from "./locales/vi";
import { zhCN } from "./locales/zh-CN";
import { zhTW } from "./locales/zh-TW";
import { ar } from "./locales/ar";

/**
 * Supported locales. Only ship languages with full MessageTable coverage.
 * All 12 target languages shipped (roadmap complete).
 */
export type Locale =
  | "en"
  | "tr"
  | "de"
  | "es"
  | "id"
  | "pt-BR"
  | "ja"
  | "ko"
  | "vi"
  | "zh-CN"
  | "zh-TW"
  | "ar";

export type MessageKey = keyof typeof en;
export type MessageTable = Record<MessageKey, string>;

export const LOCALES: {
  id: Locale;
  label: string;
  native: string;
  dir?: "ltr" | "rtl";
}[] = [
  { id: "en", label: "English", native: "English" },
  { id: "tr", label: "Turkish", native: "Türkçe" },
  { id: "de", label: "German", native: "Deutsch" },
  { id: "es", label: "Spanish", native: "Español" },
  { id: "id", label: "Indonesian", native: "Bahasa Indonesia" },
  { id: "pt-BR", label: "Portuguese (Brazil)", native: "Português (Brasil)" },
  { id: "ja", label: "Japanese", native: "日本語" },
  { id: "ko", label: "Korean", native: "한국어" },
  { id: "vi", label: "Vietnamese", native: "Tiếng Việt" },
  { id: "zh-CN", label: "Chinese (Simplified)", native: "简体中文" },
  { id: "zh-TW", label: "Chinese (Traditional)", native: "繁體中文" },
  { id: "ar", label: "Arabic", native: "العربية", dir: "rtl" },
];

export const BASE_LOCALE: Locale = "en";

export function localeDir(locale: Locale): "ltr" | "rtl" {
  return LOCALES.find((l) => l.id === locale)?.dir ?? "ltr";
}

/** Base language is English. Every table must satisfy MessageTable. */
export const messages = {
  en,
  tr: tr as MessageTable,
  de: de as MessageTable,
  es: es as MessageTable,
  id: id as MessageTable,
  "pt-BR": ptBR as MessageTable,
  ja: ja as MessageTable,
  ko: ko as MessageTable,
  vi: vi as MessageTable,
  "zh-CN": zhCN as MessageTable,
  "zh-TW": zhTW as MessageTable,
  ar: ar as MessageTable,
} as const satisfies Record<Locale, MessageTable>;
