/** Compact relative time for feed cards (tr-friendly). */
export function relativeTime(iso: string, now = Date.now()): string {
  const t = Date.parse(iso.includes("T") ? iso : iso.replace(" ", "T") + "Z");
  if (Number.isNaN(t)) return "";
  const sec = Math.round((now - t) / 1000);
  if (sec < 45) return "şimdi";
  if (sec < 3600) return `${Math.floor(sec / 60)}dk`;
  if (sec < 86400) return `${Math.floor(sec / 3600)}sa`;
  if (sec < 86400 * 7) return `${Math.floor(sec / 86400)}g`;
  if (sec < 86400 * 30) return `${Math.floor(sec / (86400 * 7))}hf`;
  return `${Math.floor(sec / (86400 * 30))}ay`;
}
