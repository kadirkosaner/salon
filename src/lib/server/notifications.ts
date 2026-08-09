import { createServerFn } from "@tanstack/react-start";
import { getSql, type Sql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";
import { v, noInput, positiveId } from "@/lib/validation";
import { z } from "zod";

export type NotificationType =
  | "like"
  | "comment"
  | "reply"
  | "follow"
  | "mention"
  | "comment_like";

export type NotificationRow = {
  id: number;
  type: NotificationType;
  subject_type: string;
  subject_id: string;
  read_at: string | null;
  created_at: string;
  actor: {
    id: string;
    name: string;
    username: string | null;
    image: string | null;
  };
  /** Grouped extras (same subject/type, other actors). */
  others: number;
};

/** Create a notification unless actor == recipient. Honors notifications_enabled. */
export async function notify(
  sql: Sql,
  opts: {
    userId: string;
    actorId: string;
    type: NotificationType;
    subjectType: "activity" | "comment" | "user" | "post";
    subjectId: string | number;
  },
): Promise<void> {
  if (opts.userId === opts.actorId) return;
  const pref = await sql<{ notifications_enabled: boolean }>`
    select coalesce(notifications_enabled, true) as notifications_enabled
    from user_settings
    where user_id = ${opts.userId}
    limit 1
  `;
  if (pref[0] && pref[0].notifications_enabled === false) return;

  await sql`
    insert into notifications (user_id, actor_id, type, subject_type, subject_id)
    values (
      ${opts.userId},
      ${opts.actorId},
      ${opts.type},
      ${opts.subjectType},
      ${String(opts.subjectId)}
    )
  `;
}

export const getUnreadNotificationCount = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(noInput)
  .handler(async ({ context }) => {
    const sql = await getSql();
    const rows = await sql<{ c: number }>`
      select count(*)::int as c
      from notifications
      where user_id = ${context.userId} and read_at is null
    `;
    return { count: rows[0]?.c ?? 0 };
  });

export const listNotifications = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(
    v(
      z.object({
        limit: z.number().int().min(1).max(50).optional(),
        cursor: z.string().optional(),
      }),
    ),
  )
  .handler(async ({ context, data }): Promise<{ items: NotificationRow[]; nextCursor: string | null }> => {
    const sql = await getSql();
    const limit = data.limit ?? 30;
    const cursor = data.cursor ?? null;

    const rows = await sql<{
      id: number;
      type: string;
      subject_type: string;
      subject_id: string;
      read_at: string | null;
      created_at: string;
      actor_id: string;
      actor_name: string;
      actor_image: string | null;
      username: string | null;
      avatar_url: string | null;
    }>`
      select
        n.id, n.type, n.subject_type, n.subject_id,
        n.read_at::text as read_at,
        n.created_at::text as created_at,
        u.id as actor_id, u.name as actor_name, u.image as actor_image,
        up.username, up.avatar_url
      from notifications n
      join "user" u on u.id = n.actor_id
      left join user_profiles up on up.user_id = n.actor_id
      where n.user_id = ${context.userId}
        and (
          ${cursor}::timestamptz is null
          or n.created_at < ${cursor}::timestamptz
        )
      order by n.created_at desc
      limit ${limit + 1}
    `;

    // Group consecutive same type+subject (simple client-friendly grouping)
    const grouped: NotificationRow[] = [];
    const seen = new Map<string, NotificationRow>();
    for (const r of rows.slice(0, limit)) {
      const key = `${r.type}:${r.subject_type}:${r.subject_id}`;
      const existing = seen.get(key);
      if (existing && !existing.read_at && !r.read_at) {
        existing.others += 1;
        continue;
      }
      const item: NotificationRow = {
        id: Number(r.id),
        type: r.type as NotificationType,
        subject_type: r.subject_type,
        subject_id: r.subject_id,
        read_at: r.read_at,
        created_at: r.created_at,
        actor: {
          id: r.actor_id,
          name: r.actor_name,
          username: r.username,
          image: r.avatar_url || r.actor_image,
        },
        others: 0,
      };
      seen.set(key, item);
      grouped.push(item);
    }

    const hasMore = rows.length > limit;
    const nextCursor =
      hasMore && rows.length > 0
        ? rows[Math.min(limit, rows.length) - 1]!.created_at
        : null;

    return { items: grouped, nextCursor };
  });

export const markNotificationsRead = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    v(
      z.object({
        ids: z.array(positiveId).max(100).optional(),
        all: z.boolean().optional(),
      }),
    ),
  )
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    if (data.all) {
      await sql`
        update notifications
        set read_at = now()
        where user_id = ${context.userId} and read_at is null
      `;
      return { ok: true };
    }
    if (data.ids?.length) {
      for (const id of data.ids) {
        await sql`
          update notifications
          set read_at = now()
          where id = ${id} and user_id = ${context.userId} and read_at is null
        `;
      }
    }
    return { ok: true };
  });
