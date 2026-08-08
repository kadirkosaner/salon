import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2, Search, UserPlus, Users } from "lucide-react";
import { toast } from "sonner";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { AppShell, AuthGateSkeleton } from "@/components/layout/app-shell";
import { DiscoverPanel } from "@/components/discover-panel";
import { EmptyState, PageSection } from "@/components/ui/section";
import {
  followUser,
  searchUsers,
  unfollowUser,
  type PublicUserCard,
} from "@/lib/server/social";
import { useT } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/kesfet")({ component: DiscoverPage });

type Mode = "programs" | "people";

function DiscoverPage() {
  const { user, isPending } = useCurrentUserState();
  const navigate = useNavigate();
  const t = useT();
  const [mode, setMode] = useState<Mode>("programs");
  const [q, setQ] = useState("");
  const [results, setResults] = useState<PublicUserCard[]>([]);
  const [searching, setSearching] = useState(false);

  if (isPending) return <AuthGateSkeleton />;
  if (!user) return <RedirectToSignIn />;

  async function doSearch() {
    if (q.trim().length < 1) return;
    setSearching(true);
    try {
      setResults(await searchUsers({ data: q }));
    } catch {
      toast.error(t("common.error"));
    } finally {
      setSearching(false);
    }
  }

  async function toggleFollow(id: string, isFollowing: boolean) {
    try {
      if (isFollowing) {
        await unfollowUser({ data: id });
      } else {
        await followUser({ data: id });
      }
      setResults(await searchUsers({ data: q }));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t("common.error"));
    }
  }

  return (
    <AppShell title={t("discover.title")} subtitle={t("discover.subtitle")}>
      <div className="w-full min-w-0 space-y-4">
        <div className="grid grid-cols-2 gap-1 rounded-xl border border-line bg-surface p-1">
          <button
            type="button"
            onClick={() => setMode("programs")}
            className={cn(
              "h-10 rounded-lg text-sm font-semibold transition",
              mode === "programs" ? "bg-yellow text-bg" : "text-muted",
            )}
          >
            {t("discover.programs")}
          </button>
          <button
            type="button"
            onClick={() => setMode("people")}
            className={cn(
              "h-10 rounded-lg text-sm font-semibold transition",
              mode === "people" ? "bg-yellow text-bg" : "text-muted",
            )}
          >
            {t("discover.people")}
          </button>
        </div>

        {mode === "programs" ? (
          <DiscoverPanel
            onCloned={() => {
              void navigate({ to: "/program" });
            }}
          />
        ) : (
          <PageSection title={t("discover.people")}>
            <div className="flex gap-2">
              <div className="relative min-w-0 flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-dim" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") void doSearch();
                  }}
                  placeholder="…"
                  className="h-11 w-full rounded-lg border border-line bg-surface2 py-2 pl-10 pr-3 text-sm"
                  autoFocus
                />
              </div>
              <button
                type="button"
                disabled={searching}
                onClick={() => void doSearch()}
                className="h-11 shrink-0 rounded-lg bg-yellow px-4 text-sm font-semibold text-bg"
              >
                {searching ? <Loader2 className="size-4 animate-spin" /> : t("nav.search")}
              </button>
            </div>

            {results.length === 0 ? (
              <div className="mt-4">
                <EmptyState hint={t("profile.searchPeople")} />
              </div>
            ) : (
              <ul className="mt-3 space-y-2">
                {results.map((r) => (
                  <li
                    key={r.id}
                    className="flex items-center gap-3 rounded-xl border border-line bg-surface2/40 px-3 py-2.5"
                  >
                    <Link
                      to="/u/$userId"
                      params={{ userId: r.id }}
                      className="flex min-w-0 flex-1 items-center gap-3"
                    >
                      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-yellow/15 font-display text-sm text-yellow">
                        {r.name
                          .split(/\s+/)
                          .map((p) => p[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium">{r.name}</span>
                        <span className="text-[11px] text-muted">{r.followers}</span>
                      </span>
                    </Link>
                    <button
                      type="button"
                      onClick={() => void toggleFollow(r.id, r.is_following)}
                      className={cn(
                        "flex h-9 shrink-0 items-center gap-1 rounded-lg px-2.5 text-xs font-semibold",
                        r.is_following
                          ? "border border-line text-muted"
                          : "bg-yellow text-bg",
                      )}
                    >
                      {r.is_following ? (
                        "—"
                      ) : (
                        <>
                          <UserPlus className="size-3.5" /> +
                        </>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <p className="mt-4 flex items-center gap-1.5 text-xs text-dim">
              <Users className="size-3.5" />
              {t("profile.following")}
            </p>
          </PageSection>
        )}
      </div>
    </AppShell>
  );
}
