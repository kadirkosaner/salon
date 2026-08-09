import { Link, useNavigate } from "@tanstack/react-router";
import { UserPlus } from "@/components/icons";
import { ActivityCard } from "@/components/feed/activity-card";
import type { FeedItem } from "@/lib/server/activity";

type Suggested = {
  id: string;
  name: string;
  username: string | null;
  image: string | null;
  followers: number;
  is_following: boolean;
};

type ProgramCard = {
  id: number;
  name: string;
  day_count: number;
  clone_count: number;
};

/**
 * Empty-feed discovery shelves — code-split from the home route so the
 * main feed path does not pay for suggested athletes / public programs.
 */
export function FeedEmptyDiscover({
  t,
  suggested,
  discoverItems,
  programs,
  onFollow,
  onComment,
}: {
  t: (k: string, p?: Record<string, string | number>) => string;
  suggested: Suggested[];
  discoverItems: FeedItem[];
  programs: ProgramCard[];
  onFollow: (id: string) => void;
  onComment: (item: FeedItem) => void;
}) {
  const navigate = useNavigate();

  return (
    <div className="space-y-5">
      {suggested.length > 0 && (
        <section>
          <h2 className="mb-2 px-0.5 text-[11px] font-semibold uppercase tracking-wider text-text-2">
            {t("feed.suggested")}
          </h2>
          <ul className="space-y-2">
            {suggested.map((u) => (
              <li
                key={u.id}
                className="flex items-center gap-3 rounded-xl border border-rule bg-raised/40 px-3 py-2.5"
              >
                <Link
                  to="/u/$username"
                  params={{ username: u.username || u.id }}
                  className="flex min-w-0 flex-1 items-center gap-3"
                >
                  <span className="grid size-10 place-items-center overflow-hidden rounded-full bg-accent/15 text-sm font-semibold text-accent">
                    {u.image ? (
                      <img src={u.image} alt="" className="size-full object-cover" />
                    ) : (
                      u.name
                        .split(/\s+/)
                        .map((p) => p[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()
                    )}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium">{u.name}</span>
                    <span className="text-[11px] text-text-2">
                      {u.username ? `@${u.username}` : ""} · {u.followers}{" "}
                      {t("profile.followers").toLowerCase()}
                    </span>
                  </span>
                </Link>
                {!u.is_following ? (
                  <button
                    type="button"
                    onClick={() => onFollow(u.id)}
                    className="flex h-9 items-center gap-1 rounded-lg bg-primary px-2.5 text-xs font-semibold text-on-primary"
                  >
                    <UserPlus className="size-3.5" />
                    {t("profile.follow")}
                  </button>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      )}

      {discoverItems.length > 0 && (
        <section className="space-y-3">
          <h2 className="px-0.5 text-[11px] font-semibold uppercase tracking-wider text-text-2">
            {t("feed.publicActivity")}
          </h2>
          {discoverItems.map((item) => (
            <ActivityCard
              key={item.id}
              item={item}
              t={t}
              onComment={onComment}
            />
          ))}
        </section>
      )}

      {programs.length > 0 && (
        <section>
          <h2 className="mb-2 px-0.5 text-[11px] font-semibold uppercase tracking-wider text-text-2">
            {t("feed.featuredPrograms")}
          </h2>
          <div className="scroll-fade-x flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {programs.slice(0, 8).map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => navigate({ to: "/discover" })}
                className="w-40 shrink-0 rounded-xl border border-rule bg-raised/50 p-3 text-left"
              >
                <p className="truncate text-sm font-semibold">{p.name}</p>
                <p className="mt-1 text-[11px] text-text-2">
                  {p.day_count} {t("feed.days")} · {t("feed.clones", { n: p.clone_count })}
                </p>
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
