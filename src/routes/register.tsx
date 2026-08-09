import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Activity } from "@/components/icons";
import { authClient } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { useT } from "@/lib/i18n/provider";
import { Spinner } from "@/components/ui/spinner";
import {
  claimRegisterUsername,
  checkUsernameAvailable,
} from "@/lib/server/social";
import {
  isValidUsername,
  normalizeUsername,
  slugFromIdentity,
  usernameError,
} from "@/lib/username";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/register")({ component: RegisterPage });

function RegisterPage() {
  const { user, isPending } = useCurrentUserState();
  const t = useT();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [usernameTouched, setUsernameTouched] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [avail, setAvail] = useState<{
    checking: boolean;
    available: boolean | null;
    suggestions: string[];
  }>({ checking: false, available: null, suggestions: [] });

  // Suggest username from display name until user edits it
  useEffect(() => {
    if (usernameTouched) return;
    const sug = slugFromIdentity(name, email);
    if (sug.length >= 3) setUsername(sug);
  }, [name, email, usernameTouched]);

  const normalized = useMemo(
    () => normalizeUsername(username),
    [username],
  );
  const localErr = usernameError(normalized, t);

  useEffect(() => {
    if (localErr || normalized.length < 3) {
      setAvail({ checking: false, available: null, suggestions: [] });
      return;
    }
    let cancelled = false;
    setAvail((s) => ({ ...s, checking: true }));
    const id = window.setTimeout(() => {
      void checkUsernameAvailable({ data: { username: normalized } })
        .then((r) => {
          if (cancelled) return;
          setAvail({
            checking: false,
            available: r.available,
            suggestions: r.suggestions ?? [],
          });
        })
        .catch(() => {
          if (!cancelled)
            setAvail({ checking: false, available: null, suggestions: [] });
        });
    }, 320);
    return () => {
      cancelled = true;
      window.clearTimeout(id);
    };
  }, [normalized, localErr]);

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
    if (name.trim().length < 2) {
      setError(t("auth.nameMin"));
      return;
    }
    if (password.length < 8) {
      setError(t("auth.passwordMin"));
      return;
    }
    const u = normalizeUsername(username);
    if (!isValidUsername(u)) {
      setError(localErr || t("profile.usernameInvalid"));
      return;
    }
    if (avail.available === false) {
      setError(t("profile.usernameTaken"));
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
      try {
        await claimRegisterUsername({ data: { username: u } });
      } catch (claimErr) {
        // Account exists; still land home — user can set username in settings
        console.warn(claimErr);
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
        <div className="mx-auto mb-4 grid size-14 place-items-center rounded-xl bg-accent/15 text-accent">
          <Activity className="size-7" />
        </div>
        <h1 className="font-display text-4xl tracking-wide text-text">SALON</h1>
        <p className="mt-1 text-sm text-text-2">{t("auth.tagline")}</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-3 rounded-xl border border-rule bg-sunken p-5">
        <h2 className="font-display text-xl tracking-wide">{t("auth.register")}</h2>
        <label className="block space-y-1.5">
          <span className="text-xs font-medium text-text-2">{t("auth.name")}</span>
          <input
            type="text"
            autoComplete="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-12 w-full rounded-md border border-rule bg-raised px-3 text-text placeholder:text-text-3"
          />
        </label>
        <label className="block space-y-1.5">
          <span className="text-xs font-medium text-text-2">{t("profile.username")}</span>
          <div className="flex items-center gap-2">
            <span className="text-text-2">@</span>
            <input
              type="text"
              autoComplete="username"
              required
              maxLength={20}
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              value={username}
              onChange={(e) => {
                setUsernameTouched(true);
                setUsername(e.target.value.toLowerCase());
              }}
              className={cn(
                "h-12 min-w-0 flex-1 rounded-md border bg-raised px-3 text-text placeholder:text-text-3",
                localErr || avail.available === false
                  ? "border-danger/50"
                  : avail.available
                    ? "border-success/50"
                    : "border-rule",
              )}
              placeholder={t("auth.usernamePlaceholder")}
            />
          </div>
          {localErr ? (
            <p className="text-xs text-danger">{localErr}</p>
          ) : avail.checking ? (
            <p className="text-xs text-text-3">{t("common.loading")}</p>
          ) : avail.available === true ? (
            <p className="text-xs text-success">{t("profile.usernameAvailable")}</p>
          ) : avail.available === false ? (
            <div className="space-y-1">
              <p className="text-xs text-danger">{t("profile.usernameTaken")}</p>
              {avail.suggestions.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {avail.suggestions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => {
                        setUsernameTouched(true);
                        setUsername(s);
                      }}
                      className="rounded-full border border-rule bg-raised px-2.5 py-1 text-[11px] font-medium text-accent"
                    >
                      @{s}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          ) : (
            <p className="text-xs text-text-3">3–20 · a-z, 0-9, _</p>
          )}
        </label>
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
            autoComplete="new-password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-12 w-full rounded-md border border-rule bg-raised px-3 text-text placeholder:text-text-3"
            placeholder={t("auth.passwordPlaceholder")}
          />
        </label>
        {error && (
          <p className="rounded-md border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger" role="alert">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={loading || !!localErr || avail.available === false}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-md bg-primary font-semibold text-on-primary disabled:opacity-60"
        >
          {loading ? <Spinner className="size-4" /> : null}
          {t("auth.register")}
        </button>
        <p className="text-center text-sm text-text-2">
          {t("auth.hasAccount")}{" "}
          <Link to="/login" className="font-medium text-accent underline-offset-2 hover:underline">
            {t("auth.login")}
          </Link>
        </p>
      </form>
    </main>
  );
}
