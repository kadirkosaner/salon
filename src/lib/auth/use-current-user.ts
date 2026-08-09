import { useMemo } from "react";
import { authClient, authEnabled } from "./client";

/** Normalized user shape used across the app, auth on or off. */
export type AppUser = {
  id: string;
  displayName: string | null;
  primaryEmail: string | null;
  profileImageUrl: string | null;
  /** True when this is the sandbox/dev fallback (auth not configured). */
  isDevFallback: boolean;
};

/**
 * Stable fallback user, used ONLY when auth is explicitly disabled
 * (`VITE_AUTH_ENABLED=false`). By default auth is on — the sandbox live preview
 * does real sign-in via the baked preview client. Its id is
 * `"dev-user"` — the SAME id `verify.server.ts` returns server-side — so per-user
 * rows written in that mode belong to one consistent owner.
 */
export const DEV_USER: AppUser = {
  id: "dev-user",
  displayName: "Dev User",
  primaryEmail: "dev@example.com",
  profileImageUrl: null,
  isDevFallback: true,
};

/** `useCurrentUserState()` result: the user plus the session-loading flag. */
export type CurrentUserState = {
  /** The user — `null` BOTH while the session loads and when signed out. */
  user: AppUser | null;
  /** True while the session is still resolving — don't treat `user: null` as signed out yet. */
  isPending: boolean;
};

const DISABLED_STATE: CurrentUserState = {
  user: DEV_USER,
  isPending: false,
};

/**
 * Current user + loading state.
 *
 * IMPORTANT: `user` is memoized by primitive fields so putting it (or the whole
 * return value) in a React effect/query dependency array does not re-fire every
 * render. Previously a fresh object literal every render caused infinite
 * useEffect loops (e.g. notifications page calling listNotifications ~140/s).
 *
 * Hooks always run in the same order: when auth is disabled we still call
 * `useSession` (cheap no-op client) and ignore it, returning the stable
 * `DISABLED_STATE` singleton.
 */
export function useCurrentUserState(): CurrentUserState {
  const { data, isPending } = authClient.useSession();
  const id = data?.user?.id;
  const name = data?.user?.name;
  const email = data?.user?.email;
  const image = data?.user?.image;

  const user = useMemo<AppUser | null>(() => {
    if (!authEnabled) return DEV_USER;
    if (!id) return null;
    return {
      id,
      displayName: name ?? null,
      primaryEmail: email ?? null,
      profileImageUrl: image ?? null,
      isDevFallback: false,
    };
  }, [id, name, email, image]);

  return useMemo((): CurrentUserState => {
    if (!authEnabled) return DISABLED_STATE;
    return { user, isPending };
  }, [user, isPending]);
}

/**
 * Convenience view of `useCurrentUserState().user` for display (e.g.
 * `user?.displayName ?? "Guest"`). NOTE: `null` means *loading OR signed out* —
 * for redirects/guards use `useCurrentUserState()` and check `isPending`.
 */
export function useCurrentUser(): AppUser | null {
  return useCurrentUserState().user;
}
