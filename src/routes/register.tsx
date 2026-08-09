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
  RESERVED_USERNAMES,
  slugFromIdentity,
  usernameError,
} from "@/lib/username";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/register")({ component: RegisterPage });

type Sex = "female" | "male" | "unspecified";

function RegisterPage() {
  const { user, isPending } = useCurrentUserState();
  const t = useT();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [usernameTouched, setUsernameTouched] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [sex, setSex] = useState<Sex>("unspecified");
  const [heightCm, setHeightCm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [avail, setAvail] = useState<{
    checking: boolean;
    available: boolean | null;
    suggestions: string[];
  }>({ checking: false, available: null, suggestions: [] });

  const maxBirth = useMemo(
    () =>
      new Date(new Date().setFullYear(new Date().getFullYear() - 13))
        .toISOString()
        .slice(0, 10),
    [],
  );

  // Suggest username from display name until user edits it
  useEffect(() => {
    if (usernameTouched) return;
    const sug = slugFromIdentity(name, email);
    // Never prefill reserved fallback "user" — wait for real name/email
    if (sug.length >= 3 && !RESERVED_USERNAMES.has(sug)) {
      setUsername(sug);
    } else if (!name.trim() && !email.trim()) {
      setUsername("");
    }
  }, [name, email, usernameTouched]);

  const normalized = useMemo(
    () => normalizeUsername(username),
    [username],
  );
  // Hide validation until the user has typed something
  const localErr =
    usernameTouched || normalized.length > 0
      ? usernameError(normalized, t)
      : null;

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
    setUsernameTouched(true);
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
      setError(usernameError(u, t) || t("profile.usernameInvalid"));
      return;
    }
    if (avail.available === false) {
      setError(t("profile.usernameTaken"));
      return;
    }

    let heightNum: number | null = null;
    if (heightCm.trim() !== "") {
      heightNum = Number(heightCm.replace(",", "."));
      if (Number.isNaN(heightNum) || heightNum < 80 || heightNum > 250) {
        setError(t("profile.height"));
        return;
      }
    }

    if (birthDate) {
      const d = new Date(birthDate + "T12:00:00");
      const age =
        (Date.now() - d.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
      if (Number.isNaN(d.getTime()) || age < 13 || age > 120) {
        setError(t("profile.birthDate"));
        return;
      }
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
        await claimRegisterUsername({
          data: {
            username: u,
            birth_date: birthDate.trim() || null,
            sex,
            height_cm: heightNum,
          },
        });
      } catch (claimErr) {
        console.warn(claimErr);
      }
      window.location.href = "/hosgeldin";
    } catch {
      setError(t("auth.networkError"));
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "h-12 w-full rounded-md border border-rule bg-raised px-3 text-text placeholder:text-text-3";

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
            className={inputClass}
          />
        </label>

        <label className="block space-y-1.5">
          <span className="text-xs font-medium text-text-2">{t("profile.username")}</span>
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
              setUsername(
                e.target.value
                  .toLowerCase()
                  .replace(/@/g, "")
                  .replace(/[^a-z0-9_]/g, ""),
              );
            }}
            className={cn(
              inputClass,
              localErr || avail.available === false
                ? "border-danger/50"
                : avail.available
                  ? "border-success/50"
                  : "border-rule",
            )}
            placeholder={t("auth.usernamePlaceholder")}
          />
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
                      {s}
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
            className={inputClass}
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
            className={inputClass}
            placeholder={t("auth.passwordPlaceholder")}
          />
        </label>

        <label className="block space-y-1.5">
          <span className="text-xs font-medium text-text-2">{t("profile.birthDate")}</span>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            max={maxBirth}
            min="1905-01-01"
            className={inputClass}
          />
        </label>

        <fieldset className="space-y-2">
          <legend className="text-xs font-medium text-text-2">{t("profile.sexLabel")}</legend>
          <div className="grid grid-cols-3 gap-1.5">
            {(
              [
                ["female", t("profile.sex.female")],
                ["male", t("profile.sex.male")],
                ["unspecified", t("profile.sex.unspecified")],
              ] as const
            ).map(([k, lab]) => (
              <button
                key={k}
                type="button"
                onClick={() => setSex(k)}
                className={cn(
                  "rounded-md border px-2 py-2.5 text-center text-[11px] font-medium leading-tight",
                  sex === k
                    ? "border-accent/50 bg-accent/15 text-accent"
                    : "border-rule bg-raised text-text-2",
                )}
              >
                {lab}
              </button>
            ))}
          </div>
        </fieldset>

        <label className="block space-y-1.5">
          <span className="text-xs font-medium text-text-2">
            {t("profile.height")} (cm)
          </span>
          <input
            type="number"
            inputMode="decimal"
            min={80}
            max={250}
            step={0.5}
            value={heightCm}
            onChange={(e) => setHeightCm(e.target.value)}
            placeholder="170"
            className={inputClass}
          />
        </label>

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
          disabled={loading || (!!localErr && normalized.length > 0) || avail.available === false}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-md bg-primary font-semibold text-on-primary disabled:opacity-60"
        >
          {loading ? <Spinner className="size-4" /> : null}
          {t("auth.register")}
        </button>
        <p className="text-center text-sm text-text-2">
          {t("auth.hasAccount")}{" "}
          <Link
            to="/login"
            className="font-medium text-accent underline-offset-2 hover:underline"
          >
            {t("auth.login")}
          </Link>
        </p>
      </form>
    </main>
  );
}
