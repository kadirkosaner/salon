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

export const Route = createFileRoute("/u/$username")({
  component: PublicProfilePage,
});

function PublicProfilePage() {
  const { username } = Route.useParams();
  const navigate = useNavigate();
  const { user, isPending } = useCurrentUserState();
  const me = user?.id;
  const { t } = useI18n();
  const [data, setData] = useState<ProfileHub | null>(null);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const hub = await getUserProfile({ data: username });
      setData(hub);
      // Canonical URL: rewrite id-based links to @username
      if (hub.username && hub.username.toLowerCase() !== username.toLowerCase()) {
        void navigate({
          to: "/u/$username",
          params: { username: hub.username },
          replace: true,
        });
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t("common.error"));
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [username, navigate, t]);

  useEffect(() => {
    if (!me) return;
    void reload();
  }, [me, reload]);

  if (isPending) return <AuthGateSkeleton />;
  if (!user) return <RedirectToSignIn />;

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
