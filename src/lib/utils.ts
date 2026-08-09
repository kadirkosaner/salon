import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateTR(date: string | Date): string {
  return formatDate(date, "tr");
}

export function formatDate(date: string | Date, locale: string = "tr"): string {
  const d =
    typeof date === "string"
      ? new Date(date + (date.length === 10 ? "T12:00:00" : ""))
      : date;
  const tag = locale === "en" ? "en-GB" : "tr-TR";
  return d.toLocaleDateString(tag, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function todayISO(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** ISO weekday: 1=Mon ... 7=Sun (matches program_days.dow) */
export function isoDow(dateStr: string): number {
  const d = new Date(dateStr + "T12:00:00");
  const js = d.getDay(); // 0=Sun
  return js === 0 ? 7 : js;
}

/** Add days to YYYY-MM-DD and return YYYY-MM-DD */
export function addDaysISO(dateStr: string, days: number): string {
  const d = new Date(dateStr + "T12:00:00");
  d.setDate(d.getDate() + days);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function roundToPlate(kg: number): number {
  return Math.round(kg / 2.5) * 2.5;
}

export function parseNum(v: string | number | null | undefined): number | null {
  if (v === null || v === undefined || v === "") return null;
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : null;
}

/** Remap program day DOWs so anchor lands on start weekday (rest days stay empty). */
export function remapDow(
  originalDow: number,
  anchorOriginalDow: number,
  startDateDow: number,
): number {
  const rel = (originalDow - anchorOriginalDow + 7) % 7;
  return ((startDateDow - 1 + rel) % 7) + 1;
}

/** Short chart tick: YYYY-MM-DD → DD.MM */
export function formatChartDate(iso: string): string {
  if (iso.length >= 10) {
    const [, m, d] = iso.slice(0, 10).split("-");
    return `${d}.${m}`;
  }
  if (iso.includes("-") && iso.length <= 5) {
    const [m, d] = iso.split("-");
    return `${d}.${m}`;
  }
  return iso;
}
