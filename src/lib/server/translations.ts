import type { Sql } from "@/lib/db";

/** Resolve program name/description for locale with EN fallback. */
export async function translatePrograms(
  sql: Sql,
  rows: { id: number; name: string; description: string | null }[],
  locale: string,
): Promise<Map<number, { name: string; description: string | null }>> {
  const map = new Map<number, { name: string; description: string | null }>();
  for (const r of rows) {
    map.set(r.id, { name: r.name, description: r.description });
  }
  if (rows.length === 0) return map;
  const ids = rows.map((r) => r.id);
  const loc = locale === "tr" ? "tr" : "en";
  try {
    const tr = await sql<{
      program_id: number;
      name: string;
      description: string | null;
      locale: string;
    }>`
      select program_id, name, description, locale
      from program_translations
      where program_id = any(${ids}::int[])
        and locale in (${loc}, 'en')
    `;
    // prefer requested locale over en
    const byId = new Map<number, { en?: typeof tr[0]; pref?: typeof tr[0] }>();
    for (const row of tr) {
      const cur = byId.get(row.program_id) ?? {};
      if (row.locale === "en") cur.en = row;
      if (row.locale === loc) cur.pref = row;
      byId.set(row.program_id, cur);
    }
    for (const [id, pack] of byId) {
      const hit = pack.pref ?? pack.en;
      if (hit) {
        map.set(id, { name: hit.name, description: hit.description });
      }
    }
  } catch {
    /* table may not exist yet */
  }
  return map;
}
