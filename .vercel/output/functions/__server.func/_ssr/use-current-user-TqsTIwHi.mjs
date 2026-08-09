import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { t as authClient } from "./client-Bm2YFrbd.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/use-current-user-TqsTIwHi.js
var import_react = /* @__PURE__ */ __toESM(require_react());
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
function useCurrentUserState() {
	const { data, isPending } = authClient.useSession();
	const id = data?.user?.id;
	const name = data?.user?.name;
	const email = data?.user?.email;
	const image = data?.user?.image;
	const user = (0, import_react.useMemo)(() => {
		if (!id) return null;
		return {
			id,
			displayName: name ?? null,
			primaryEmail: email ?? null,
			profileImageUrl: image ?? null,
			isDevFallback: false
		};
	}, [
		id,
		name,
		email,
		image
	]);
	return (0, import_react.useMemo)(() => {
		return {
			user,
			isPending
		};
	}, [user, isPending]);
}
/**
* Convenience view of `useCurrentUserState().user` for display (e.g.
* `user?.displayName ?? "Guest"`). NOTE: `null` means *loading OR signed out* —
* for redirects/guards use `useCurrentUserState()` and check `isPending`.
*/
function useCurrentUser() {
	return useCurrentUserState().user;
}
//#endregion
export { useCurrentUserState as n, useCurrentUser as t };
