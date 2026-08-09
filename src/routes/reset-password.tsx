import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Activity } from "@/components/icons";
import { authClient, authEnabled } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { useT } from "@/lib/i18n/provider";
import { Spinner } from "@/components/ui/spinner";

export const Route = createFileRoute("/reset-password")({
  validateSearch: (s: Record<string, unknown>) => ({
    token: typeof s.token === "string" ? s.token : undefined,
    error: typeof s.error === "string" ? s.error : undefined,
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const { user, isPending } = useCurrentUserState();
  const t = useT();
  const search = Route.useSearch();
  const token = search.token;
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState<string | null>(
    search.error ? t("auth.resetInvalid") : null,
  );
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const hasToken = useMemo(() => !!token && token.length > 8, [token]);

  if (isPending) {
    return (
      <div className="grid min-h-[calc(100dvh-var(--grok-banner-h,0px))] place-items-center bg-canvas">
        <Spinner className="size-8 text-accent" />
      </div>
    );
  }
  if (user) return <Navigate to="/" />;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!token) {
      setError(t("auth.resetInvalid"));
      return;
    }
    if (password.length < 8) {
      setError(t("auth.passwordMin"));
      return;
    }
    if (password !== password2) {
      setError(t("common.error"));
      return;
    }
    setLoading(true);
    try {
      const client = authClient as {
        resetPassword: (opts: {
          newPassword: string;
          token: string;
        }) => Promise<{ error?: { message?: string } | null }>;
      };
      const { error: err } = await client.resetPassword({
        newPassword: password,
        token,
      });
      if (err) {
        setError(err.message || t("auth.resetInvalid"));
        return;
      }
      setDone(true);
    } catch {
      setError(t("auth.networkError"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-[calc(100dvh-var(--grok-banner-h,0px))] max-w-md flex-col justify-center px-5 py-10">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 grid size-14 place-items-center rounded-xl bg-accent/15 text-accent">
          <Activity className="size-7" />
        </div>
        <h1 className="font-display text-4xl tracking-wide text-text">SALON</h1>
        <p className="mt-1 text-sm text-text-2">{t("auth.resetTitle")}</p>
      </div>

      {!authEnabled ? (
        <p className="rounded-md border border-rule bg-sunken p-4 text-sm text-text-2">
          {t("auth.resetUnavailable")}
        </p>
      ) : done ? (
        <div className="space-y-3 rounded-xl border border-rule bg-sunken p-5">
          <p className="rounded-md border border-success/30 bg-success/10 px-3 py-2 text-sm text-success">
            {t("auth.resetDone")}
          </p>
          <Link
            to="/login"
            className="flex h-12 w-full items-center justify-center rounded-md bg-primary font-semibold text-on-primary"
          >
            {t("auth.backToLogin")}
          </Link>
        </div>
      ) : !hasToken ? (
        <div className="space-y-3 rounded-xl border border-rule bg-sunken p-5">
          <p className="text-sm text-text-2">{t("auth.resetInvalid")}</p>
          <Link
            to="/login"
            className="flex h-12 w-full items-center justify-center rounded-md bg-primary font-semibold text-on-primary"
          >
            {t("auth.backToLogin")}
          </Link>
        </div>
      ) : (
        <form
          onSubmit={(e) => void onSubmit(e)}
          className="space-y-3 rounded-xl border border-rule bg-sunken p-5"
        >
          <label className="block space-y-1.5">
            <span className="text-xs font-medium text-text-2">
              {t("settings.newPassword")}
            </span>
            <input
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 w-full rounded-md border border-rule bg-raised px-3 text-text"
            />
          </label>
          <label className="block space-y-1.5">
            <span className="text-xs font-medium text-text-2">
              {t("settings.confirmPassword")}
            </span>
            <input
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              className="h-12 w-full rounded-md border border-rule bg-raised px-3 text-text"
            />
          </label>
          {error ? (
            <p
              className="rounded-md border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger"
              role="alert"
            >
              {error}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={loading}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-md bg-primary font-semibold text-on-primary disabled:opacity-60"
          >
            {loading ? <Spinner className="size-4" /> : null}
            {t("auth.resetSubmit")}
          </button>
          <Link
            to="/login"
            className="block w-full text-center text-sm font-medium text-accent"
          >
            {t("auth.backToLogin")}
          </Link>
        </form>
      )}
    </main>
  );
}
