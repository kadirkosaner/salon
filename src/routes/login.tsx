import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { useState } from "react";
import { Activity, Loader2 } from "lucide-react";
import { authClient, authEnabled, GROK_PROVIDERS, signIn } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

export const Route = createFileRoute("/login")({ component: LoginPage });

function LoginPage() {
  const { user, isPending } = useCurrentUserState();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (isPending) {
    return (
      <div className="grid min-h-[calc(100dvh-var(--grok-banner-h,0px))] place-items-center bg-bg">
        <Loader2 className="size-8 animate-spin text-yellow" />
      </div>
    );
  }
  if (user) return <Navigate to="/" />;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError("Şifre en az 8 karakter olmalı. Daha uzun bir şifre dene.");
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
            ? "E-posta veya şifre hatalı. Bilgileri kontrol edip tekrar dene."
            : err.message || "Giriş yapılamadı. Bilgileri kontrol edip tekrar dene.",
        );
        return;
      }
      window.location.href = "/";
    } catch {
      setError("Bağlantı hatası. İnternetini kontrol edip tekrar dene.");
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
        <p className="mt-1 text-sm text-muted">Antrenmanını kaydet, ilerlemeni gör</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-3 rounded-xl border border-line bg-surface p-5">
        <h2 className="font-display text-xl tracking-wide">Giriş yap</h2>
        <label className="block space-y-1.5">
          <span className="text-xs font-medium text-muted">E-posta</span>
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
          <span className="text-xs font-medium text-muted">Şifre</span>
          <input
            type="password"
            autoComplete="current-password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-12 w-full rounded-md border border-line bg-surface2 px-3 text-text placeholder:text-dim"
            placeholder="En az 8 karakter"
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
          {loading ? <Loader2 className="size-4 animate-spin" /> : null}
          Giriş yap
        </button>
        <p className="text-center text-sm text-muted">
          Hesabın yok mu?{" "}
          <Link to="/register" className="font-medium text-yellow underline-offset-2 hover:underline">
            Kayıt ol
          </Link>
        </p>
      </form>

      {authEnabled && (
        <div className="mt-5 space-y-2">
          <div className="flex items-center gap-3 text-xs text-dim">
            <div className="h-px flex-1 bg-line" />
            veya
            <div className="h-px flex-1 bg-line" />
          </div>
          {GROK_PROVIDERS.map((p) => (
            <button
              key={p.providerId}
              type="button"
              onClick={() => void signIn(p.providerId, { callbackURL: "/" })}
              className="h-12 w-full rounded-md border border-line bg-surface text-sm font-medium text-text hover:bg-surface2"
            >
              {p.label} ile devam et
            </button>
          ))}
        </div>
      )}
    </main>
  );
}
