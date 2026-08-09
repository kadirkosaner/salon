/** Compact relative time via Intl (locale-aware). */
export function relativeTime(
  iso: string,
  locale: string = "en",
  now = Date.now(),
): string {
  const t = Date.parse(iso.includes("T") ? iso : iso.replace(" ", "T") + "Z");
  if (Number.isNaN(t)) return "";
  const sec = Math.round((now - t) / 1000);
  const rtf = new Intl.RelativeTimeFormat(locale === "pt-BR" ? "pt-BR" : locale, {
    numeric: "auto",
    style: "narrow",
  });
  const abs = Math.abs(sec);
  if (abs < 45) return rtf.format(0, "second");
  if (abs < 3600) return rtf.format(-Math.floor(sec / 60), "minute");
  if (abs < 86400) return rtf.format(-Math.floor(sec / 3600), "hour");
  if (abs < 86400 * 7) return rtf.format(-Math.floor(sec / 86400), "day");
  if (abs < 86400 * 30) return rtf.format(-Math.floor(sec / (86400 * 7)), "week");
  return rtf.format(-Math.floor(sec / (86400 * 30)), "month");
}
