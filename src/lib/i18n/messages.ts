import { en } from "./locales/en";
import { tr } from "./locales/tr";

/**
 * Supported locales. Only ship languages with full MessageTable coverage.
 * Add a locale file under ./locales and register here when complete.
 */
export type Locale = "en" | "tr";

export type MessageKey = keyof typeof en;
export type MessageTable = Record<MessageKey, string>;

export const LOCALES: { id: Locale; label: string; native: string }[] = [
  { id: "en", label: "English", native: "English" },
  { id: "tr", label: "Turkish", native: "Türkçe" },
];

export const BASE_LOCALE: Locale = "en";

/** Base language is English. Every table must satisfy MessageTable. */
export const messages = {
  en,
  tr: tr as MessageTable,
} as const satisfies Record<Locale, MessageTable>;
