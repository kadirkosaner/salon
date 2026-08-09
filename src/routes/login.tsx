import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { useState } from "react";
import { Activity } from "@/components/icons";
import { authClient, authEnabled, GROK_PROVIDERS, signIn } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { useT } from "@/lib/i18n/provider";
import { Spinner } from "@/components/ui/spinner";

export const Route = createFileRoute("/login")({ component: LoginPage });

function LoginPage() {
  const { user, isPending } = useCurrentUserState();
  const t = useT();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);

  if (isPending) {
    return (
      <div className="grid min-h-[calc(100dvh-var(--grok-banner-h,0px))] place-items-center bg-canvas">
        <div className="w-full max-w-sm space-y-3 px-6">
          <div className="mx-auto size-14 animate-pulse rounded-xl bg-accent/20" />
          <div className="mx-auto h-8 w-32 animate-pulse rounded-lg bg-raised" />
          <div className="h-48 animate-pulse rounded-xl bg-raised" />
        </div>
      </div>
    );
  }
  if (user) return <Navigate to="/" />;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError(t("auth.passwordMin"));
      return;
    }
    setLoading(true);
    try {
      const { error: err } = await authClient.signIn.email({
        email: email.trim(),
        password,
      });
      if (err) {
        setError(
          err.message?.includes("Invalid") || err.message?.includes("credentials")
            ? t("auth.invalidCredentials")
            : err.message || t("auth.loginFailed"),
        );
        return;
      }
      window.location.href = "/";
    } catch {
      setError(t("auth.networkError"));
    } finally {
      setLoading(false);
    }
  }

  async function onForgot(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setForgotLoading(true);
    try {
      const client = authClient as {
        forgetPassword?: (opts: {
          email: string;
          redirectTo?: string;
        }) => Promise<{ error?: { message?: string } | null }>;
        requestPasswordReset?: (opts: {
          email: string;
          redirectTo?: string;
        }) => Promise<{ error?: { message?: string } | null }>;
      };
      const fn =
        client.forgetPassword?.bind(client) ??
        client.requestPasswordReset?.bind(client);
      if (fn) {
        const { error: err } = await fn({
          email: email.trim(),
          redirectTo: "/login",
        });
        if (err) {
          // Still show success-style message to avoid email enumeration
          setForgotSent(true);
          return;
        }
      }
      setForgotSent(true);
    } catch {
      setForgotSent(true);
    } finally {
      setForgotLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-[calc(100dvh-var(--grok-banner-h,0px))] max-w-md flex-col justify-center px-5 py-10">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 grid size-14 place-items-center rounded-xl bg-accent/15 text-accent">
          <Activity className="size-7" />
        </div>
        <h1 className="font-display text-4xl tracking-wide text-text">SALON</h1>
        <p className="mt-1 text-sm text-text-2">{t("auth.tagline")}</p>
      </div>

      {forgotMode ? (
        <form
          onSubmit={(e) => void onForgot(e)}
          className="space-y-3 rounded-xl border border-rule bg-sunken p-5"
        >
          <h2 className="font-display text-xl tracking-wide">
            {t("auth.forgotTitle")}
          </h2>
          <p className="text-sm text-text-2">{t("auth.forgotHint")}</p>
          <label className="block space-y-1.5">
            <span className="text-xs font-medium text-text-2">{t("auth.email")}</span>
            <input
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 w-full rounded-md border border-rule bg-raised px-3 text-text placeholder:text-text-3"
              placeholder={t("auth.emailPlaceholder")}
            />
          </label>
          {forgotSent ? (
            <p className="rounded-md border border-success/30 bg-success/10 px-3 py-2 text-sm text-success">
              {t("auth.forgotSent")}
            </p>
          ) : null}
          {error && (
            <p
              className="rounded-md border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger"
              role="alert"
            >
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={forgotLoading}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-md bg-primary font-semibold text-on-primary disabled:opacity-60"
          >
            {forgotLoading ? <Spinner className="size-4" /> : null}
            {t("auth.sendReset")}
          </button>
          <button
            type="button"
            onClick={() => {
              setForgotMode(false);
              setForgotSent(false);
              setError(null);
            }}
            className="w-full text-center text-sm font-medium text-accent"
          >
            {t("auth.backToLogin")}
          </button>
        </form>
      ) : (
        <form onSubmit={onSubmit} className="space-y-3 rounded-xl border border-rule bg-sunken p-5">
          <h2 className="font-display text-xl tracking-wide">{t("auth.login")}</h2>
          <label className="block space-y-1.5">
            <span className="text-xs font-medium text-text-2">{t("auth.email")}</span>
            <input
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 w-full rounded-md border border-rule bg-raised px-3 text-text placeholder:text-text-3"
              placeholder={t("auth.emailPlaceholder")}
            />
          </label>
          <label className="block space-y-1.5">
            <span className="text-xs font-medium text-text-2">{t("auth.password")}</span>
            <input
              type="password"
              autoComplete="current-password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 w-full rounded-md border border-rule bg-raised px-3 text-text placeholder:text-text-3"
              placeholder={t("auth.passwordPlaceholder")}
            />
          </label>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setForgotMode(true)}
              className="text-xs font-medium text-accent underline-offset-2 hover:underline"
            >
              {t("auth.forgotPassword")}
            </button>
          </div>
          {error && (
            <p
              className="rounded-md border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger"
              role="alert"
            >
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-md bg-primary font-semibold text-on-primary disabled:opacity-60"
          >
            {loading ? <Spinner className="size-4" /> : null}
            {t("auth.login")}
          </button>
          <p className="text-center text-sm text-text-2">
            {t("auth.noAccount")}{" "}
            <Link
              to="/register"
              className="font-medium text-accent underline-offset-2 hover:underline"
            >
              {t("auth.register")}
            </Link>
          </p>
        </form>
      )}

      {authEnabled && !forgotMode && (
        <div className="mt-5 space-y-2">
          <div className="flex items-center gap-3 text-xs text-text-3">
            <div className="h-px flex-1 bg-rule" />
            {t("auth.or")}
            <div className="h-px flex-1 bg-rule" />
          </div>
          {GROK_PROVIDERS.map((p) => (
            <button
              key={p.providerId}
              type="button"
              onClick={() => void signIn(p.providerId, { callbackURL: "/" })}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-md border border-rule bg-sunken text-sm font-medium text-text hover:bg-raised"
            >
              {t("auth.continueWith", { provider: p.label })}
            </button>
          ))}
        </div>
      )}
    </main>
  );
}
