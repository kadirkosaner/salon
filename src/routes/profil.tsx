import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { AppShell, AuthGateSkeleton } from "@/components/layout/app-shell";
import { ProfileSkeleton } from "@/components/ui/skeleton";
import { ProfileView } from "@/components/profile/profile-view";
import { UsernameClaimSheet } from "@/components/profile/username-claim";
import { useI18n } from "@/lib/i18n/provider";
import { getMyProfileHub, type ProfileHub } from "@/lib/server/social";

export const Route = createFileRoute("/profil")({ component: ProfilePage });

function ProfilePage() {
  const { user, isPending } = useCurrentUserState();
  const userId = user?.id;
  const { t } = useI18n();
  const [hub, setHub] = useState<ProfileHub | null>(null);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setHub(await getMyProfileHub());
  }, []);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    setLoading(true);
    reload()
      .catch(() => {
        if (!cancelled) toast.error(t("common.error"));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [userId, reload, t]);

  if (isPending) return <AuthGateSkeleton />;
  if (!user) return <RedirectToSignIn />;

  return (
    <AppShell
      title={t("profile.title")}
      subtitle={hub ? `@${hub.username}` : t("profile.noProgram")}
    >
      {loading || !hub ? (
        <ProfileSkeleton />
      ) : (
        <>
          <ProfileView hub={hub} t={t} onChanged={() => void reload()} />
          {!hub.username_confirmed ? (
            <UsernameClaimSheet
              initial={hub.username}
              t={t}
              onDone={() => void reload()}
            />
          ) : null}
        </>
      )}
    </AppShell>
  );
}
