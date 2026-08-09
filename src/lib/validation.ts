import { z } from "zod";

export const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "geçersiz tarih formatı")
  .refine(
    (s) => !Number.isNaN(Date.parse(s + "T12:00:00")),
    "geçersiz tarih",
  );

export const workoutStatus = z.enum([
  "planned",
  "in_progress",
  "completed",
  "skipped",
]);

export const loadTag = z.enum([
  "hafif",
  "orta_hafif",
  "orta",
  "orta_agir",
  "agir",
]);

export const positiveId = z.number().int().positive();

export const weightKg = z.number().min(0).max(1000).nullable();
export const reps = z.number().int().min(0).max(1000).nullable();
export const rir = z.number().int().min(0).max(10).nullable();

export const shareCode = z
  .string()
  .trim()
  .toUpperCase()
  .regex(/^[A-HJ-NP-Z2-9]{6}$/, "geçersiz paylaşım kodu");

export const shareCodeLoose = z
  .string()
  .trim()
  .toUpperCase()
  .regex(/^[A-HJ-NP-Z2-9]{4,8}$/, "geçersiz paylaşım kodu");

export const dow = z.number().int().min(1).max(7);
export const sets = z.number().int().min(1).max(20);
export const restSec = z.number().int().min(0).max(900);
export const repRange = z.number().int().min(1).max(500);

export const shortText = (max = 80) => z.string().trim().min(1).max(max);
export const optionalText = (max = 2000) =>
  z.string().trim().max(max).nullable().optional();
export const optionalString = (max = 2000) =>
  z.string().trim().max(max).optional();

export const userIdStr = z.string().trim().min(1).max(128);

/** Parse helper for createServerFn validators — throws friendly Error on Zod fail. */
export function parseOrThrow<T>(schema: z.ZodType<T>, data: unknown): T {
  const r = schema.safeParse(data);
  if (r.success) return r.data;
  const msg =
    r.error.issues.map((i) => i.message).join("; ") || "Geçersiz veri";
  throw new Error(msg);
}

export function v<T>(schema: z.ZodType<T>) {
  return (data: unknown) => parseOrThrow(schema, data);
}

/**
 * Server fns that take no client payload (GET/POST with auth-only context).
 * Accepts undefined / null / {} from the RPC layer and returns undefined.
 */
export function noInput(data?: unknown): undefined {
  if (
    data != null &&
    typeof data === "object" &&
    !Array.isArray(data) &&
    Object.keys(data as object).length > 0
  ) {
    // Soft-allow unexpected keys — never block no-arg endpoints on {}
  }
  return undefined;
}
