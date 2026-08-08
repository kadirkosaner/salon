import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { useState } from "react";
import { Activity, Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

export const Route = createFileRoute("/register")({ component: RegisterPage });

function RegisterPage() {
  const { user, isPending } = useCurrentUserState();
  const [name, setName] = useState("");
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
    if (name.trim().length < 2) {
      setError("Ad en az 2 karakter olmalı.");
      return;
    }
    if (password.length < 8) {
      setError("Şifre en az 8 karakter olmalı. Daha güvenli bir şifre seç.");
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
        const msg = err.message?.toLowerCase() ?? "";
        if (msg.includes("already") || msg.includes("exists") || msg.includes("unique")) {
          setError("Bu e-posta zaten kayıtlı. Giriş sayfasından giriş yap.");
        } else {
          setError(err.message || "Kayıt tamamlanamadı. Bilgileri kontrol edip tekrar dene.");
        }
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
        <h1 className="font-display text-4xl tracking-wide text-text">KAYIT OL</h1>
        <p className="mt-1 text-sm text-muted">Programını Keşfet’ten seç, sonra özelleştir</p>

      </div>

      <form onSubmit={onSubmit} className="space-y-3 rounded-xl border border-line bg-surface p-5">
        <label className="block space-y-1.5">
          <span className="text-xs font-medium text-muted">Ad</span>
          <input
            type="text"
            autoComplete="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-12 w-full rounded-md border border-line bg-surface2 px-3 text-text"
            placeholder="Adın"
          />
        </label>
        <label className="block space-y-1.5">
          <span className="text-xs font-medium text-muted">E-posta</span>
          <input
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12 w-full rounded-md border border-line bg-surface2 px-3 text-text"
            placeholder="ornek@mail.com"
          />
        </label>
        <label className="block space-y-1.5">
          <span className="text-xs font-medium text-muted">Şifre</span>
          <input
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-12 w-full rounded-md border border-line bg-surface2 px-3 text-text"
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
          Hesap oluştur
        </button>
        <p className="text-center text-sm text-muted">
          Zaten hesabın var mı?{" "}
          <Link to="/login" className="font-medium text-yellow underline-offset-2 hover:underline">
            Giriş yap
          </Link>
        </p>
      </form>
    </main>
  );
}
