import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n/provider";

/** Person row — avatar, name, activity, follow. Theme shapes the CTA form. */
export function PeopleRow({
  name,
  username,
  subtitle,
  avatarUrl,
  initials,
  isFollowing,
  onFollow,
  onClick,
  busy,
  className,
}: {
  name: string;
  username?: string;
  subtitle?: string;
  avatarUrl?: string | null;
  initials?: string;
  isFollowing?: boolean;
  onFollow?: () => void;
  onClick?: () => void;
  busy?: boolean;
  className?: string;
}) {
  const t = useT();
  const letters =
    initials ||
    name
      .split(/\s+/)
      .map((p) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  return (
    <div className={cn("flex items-center gap-3 py-2.5", className)}>
      <button
        type="button"
        onClick={onClick}
        className="flex min-w-0 flex-1 items-center gap-3 text-left"
      >
        <span className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-full bg-accent/15 text-sm font-semibold text-accent">
          {avatarUrl ? (
            <img src={avatarUrl} alt="" className="size-full object-cover" />
          ) : (
            letters
          )}
        </span>
        <span className="min-w-0">
          <span className="block truncate text-sm font-medium text-text">
            {name}
          </span>
          {subtitle || username ? (
            <span className="mt-0.5 block truncate text-xs text-text-2">
              {subtitle || (username ? `@${username}` : null)}
            </span>
          ) : null}
        </span>
      </button>
      {onFollow ? (
        <button
          type="button"
          disabled={busy}
          onClick={onFollow}
          className={cn(
            "shrink-0 text-sm font-semibold transition disabled:opacity-50",
            isFollowing
              ? "rounded-[var(--radius-btn)] border border-edge px-3 py-1.5 text-text-3"
              : "btn-primary-theme px-3 py-1.5",
          )}
        >
          {isFollowing ? t("profile.followingBtn") : t("profile.follow")}
        </button>
      ) : null}
    </div>
  );
}
