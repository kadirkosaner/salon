import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { AppShell, AuthGateSkeleton } from "@/components/layout/app-shell";
import { ProfileSkeleton } from "@/components/ui/skeleton";
import { ProfileView } from "@/components/profile/profile-view";
import { useI18n } from "@/lib/i18n/provider";
import { getUserProfile, type ProfileHub } from "@/lib/server/social";

/**
 * Public profile at /u/:username
 * Also accepts legacy /u/:userId links — loads by id, then replace-navigates
 * to the canonical @username URL.
 */
export const Route = createFileRoute("/u/$username")({
  component: PublicProfilePage,
});

function PublicProfilePage() {
  const { username: handle } = Route.useParams();
  const navigate = useNavigate();
  const { user, isPending } = useCurrentUserState();
  const me = user?.id;
  const { t } = useI18n();
  const [data, setData] = useState<ProfileHub | null>(null);
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState(false);

  const reload = useCallback(async () => {
    setLoading(true);
    setMissing(false);
    try {
      const hub = await getUserProfile({ data: handle });
      setData(hub);
      // Legacy /u/$userId → canonical /u/$username
      if (
        hub.username &&
        hub.username.toLowerCase() !== handle.toLowerCase()
      ) {
        void navigate({
          to: "/u/$username",
          params: { username: hub.username },
          replace: true,
        });
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : t("common.error");
      if (/bulunamad|not found|404/i.test(msg)) {
        setMissing(true);
        setData(null);
      } else {
        toast.error(msg);
        setData(null);
      }
    } finally {
      setLoading(false);
    }
  }, [handle, navigate, t]);

  useEffect(() => {
    if (!me) return;
    void reload();
  }, [me, reload]);

  if (isPending) return <AuthGateSkeleton />;
  if (!user) return <RedirectToSignIn />;

  if (missing) {
    return (
      <AppShell title={t("profile.title")} subtitle={t("common.error")}>
        <div className="rounded-2xl border border-line bg-surface p-6 text-center">
          <p className="text-sm text-muted">{t("profile.notFound")}</p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      title={t("profile.title")}
      subtitle={data ? `@${data.username}` : "…"}
    >
      {loading || !data ? (
        <ProfileSkeleton />
      ) : (
        <ProfileView hub={data} t={t} onChanged={() => void reload()} />
      )}
    </AppShell>
  );
}
