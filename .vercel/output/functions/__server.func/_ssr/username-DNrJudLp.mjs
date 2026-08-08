//#region node_modules/.nitro/vite/services/ssr/assets/username-DNrJudLp.js
var USERNAME_RE = /^[a-z0-9_]{3,20}$/;
var RESERVED_USERNAMES = /* @__PURE__ */ new Set([
	"admin",
	"administrator",
	"api",
	"app",
	"auth",
	"ayarlar",
	"antrenman",
	"discover",
	"help",
	"kesfet",
	"login",
	"logout",
	"me",
	"null",
	"olculer",
	"profil",
	"profile",
	"program",
	"register",
	"root",
	"salon",
	"settings",
	"support",
	"system",
	"u",
	"undefined",
	"user",
	"users",
	"www"
]);
function normalizeUsername(raw) {
	return raw.trim().toLowerCase().replace(/[^a-z0-9_]/g, "_").replace(/_+/g, "_").replace(/^_+|_+$/g, "").slice(0, 20);
}
function slugFromIdentity(name, email) {
	const fromName = name ? normalizeUsername(name) : "";
	if (fromName.length >= 3 && !RESERVED_USERNAMES.has(fromName)) return fromName;
	const fromEmail = normalizeUsername(email?.split("@")[0] ?? "");
	if (fromEmail.length >= 3 && !RESERVED_USERNAMES.has(fromEmail)) return fromEmail;
	return "sporcu";
}
function isValidUsername(u) {
	if (!USERNAME_RE.test(u)) return false;
	if (RESERVED_USERNAMES.has(u)) return false;
	return true;
}
function usernameError(u, t) {
	const tr = t ?? ((k) => k);
	if (u.length < 3) return tr("profile.usernameTooShort");
	if (u.length > 20) return tr("profile.usernameTooLong");
	if (!USERNAME_RE.test(u)) return tr("profile.usernameInvalid");
	if (RESERVED_USERNAMES.has(u)) return tr("profile.usernameReserved");
	return null;
}
//#endregion
export { usernameError as i, normalizeUsername as n, slugFromIdentity as r, isValidUsername as t };
