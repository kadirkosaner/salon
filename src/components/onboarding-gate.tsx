import { useQuery } from "@tanstack/react-query";
import { Navigate, useRouterState } from "@tanstack/react-router";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { isOnboarded } from "@/lib/server/onboarding";
import { Spinner } from "@/components/ui/spinner";

const PUBLIC = new Set([
  "/login",
  "/register",
  "/welcome",
]);

/**
 * Redirects signed-in users with null onboarded_at to /welcome.
 * Skips public routes and the onboarding route itself.
 */
export function OnboardingGate({ children }: { children: React.ReactNode }) {
  const { user, isPending } = useCurrentUserState();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const skip =
    !user ||
    isPending ||
    PUBLIC.has(pathname) ||
    pathname.startsWith("/api/");

  const q = useQuery({
    queryKey: ["onboarding", "gate", user?.id] as const,
    queryFn: () => isOnboarded(),
    enabled: !!user?.id && !skip,
    staleTime: 30_000,
    retry: 1,
  });

  if (skip) return <>{children}</>;
  if (q.isLoading || q.isPending) {
    return (
      <div className="grid min-h-[100dvh] place-items-center bg-canvas">
        <Spinner className="size-6 text-accent" />
      </div>
    );
  }
  if (q.data && !q.data.onboarded && pathname !== "/welcome") {
    return <Navigate to="/welcome" />;
  }
  return <>{children}</>;
}
