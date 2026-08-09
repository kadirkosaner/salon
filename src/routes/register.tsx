import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { useState } from "react";
import { Activity } from "lucide-react";
import { authClient } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { useT } from "@/lib/i18n/provider";
import { Spinner } from "@/components/ui/spinner";

export const Route = createFileRoute("/register")({ component: RegisterPage });

function RegisterPage() {
  const { user, isPending } = useCurrentUserState();
  const t = useT();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (isPending) {
    return (
      <div className="grid min-h-[calc(100dvh-var(--grok-banner-h,0px))] place-items-center bg-bg">
        <div className="w-full max-w-sm space-y-3 px-6">
          <div className="mx-auto size-14 animate-pulse rounded-xl bg-yellow/20" />
          <div className="mx-auto h-8 w-32 animate-pulse rounded-lg bg-surface2" />
          <div className="h-48 animate-pulse rounded-xl bg-surface2" />
        </div>
      </div>
    );
  }
  if (user) return <Navigate to="/" />;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (name.trim().length < 2) {
      setError(t("auth.nameMin"));
      return;
    }
    if (password.length < 8) {
      setError(t("auth.passwordMin"));
      return;
    }
    setLoading(true);
    try {
      const { error: err } = await authClient.signUp.email({
        email: email.trim(),
        password,
        name: name.trim(),
      });
      if (err) {
        setError(err.message || t("auth.registerFailed"));
        return;
      }
      window.location.href = "/";
    } catch {
      setError(t("auth.networkError"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-[calc(100dvh-var(--grok-banner-h,0px))] max-w-md flex-col justify-center px-5 py-10">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 grid size-14 place-items-center rounded-xl bg-yellow/15 text-yellow">
          <Activity className="size-7" strokeWidth={2.25} />
        </div>
        <h1 className="font-display text-4xl tracking-wide text-text">SALON</h1>
        <p className="mt-1 text-sm text-muted">{t("auth.tagline")}</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-3 rounded-xl border border-line bg-surface p-5">
        <h2 className="font-display text-xl tracking-wide">{t("auth.register")}</h2>
        <label className="block space-y-1.5">
          <span className="text-xs font-medium text-muted">{t("auth.name")}</span>
          <input
            type="text"
            autoComplete="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-12 w-full rounded-md border border-line bg-surface2 px-3 text-text placeholder:text-dim"
          />
        </label>
        <label className="block space-y-1.5">
          <span className="text-xs font-medium text-muted">{t("auth.email")}</span>
          <input
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12 w-full rounded-md border border-line bg-surface2 px-3 text-text placeholder:text-dim"
            placeholder="ornek@mail.com"
          />
        </label>
        <label className="block space-y-1.5">
          <span className="text-xs font-medium text-muted">{t("auth.password")}</span>
          <input
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-12 w-full rounded-md border border-line bg-surface2 px-3 text-text placeholder:text-dim"
            placeholder={t("auth.passwordPlaceholder")}
          />
        </label>
        {error && (
          <p className="rounded-md border border-red/30 bg-red/10 px-3 py-2 text-sm text-red" role="alert">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-md bg-yellow font-semibold text-bg disabled:opacity-60"
        >
          {loading ? <Spinner className="size-4" /> : null}
          {t("auth.register")}
        </button>
        <p className="text-center text-sm text-muted">
          {t("auth.hasAccount")}{" "}
          <Link to="/login" className="font-medium text-yellow underline-offset-2 hover:underline">
            {t("auth.login")}
          </Link>
        </p>
      </form>
    </main>
  );
}
