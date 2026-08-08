/** Username rules + reserved words (client + server safe). */

export const USERNAME_MIN = 3;
export const USERNAME_MAX = 20;
export const USERNAME_RE = /^[a-z0-9_]{3,20}$/;

export const RESERVED_USERNAMES = new Set([
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
  "www",
]);

export function normalizeUsername(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, USERNAME_MAX);
}

export function slugFromIdentity(name?: string | null, email?: string | null): string {
  const fromName = name ? normalizeUsername(name) : "";
  if (fromName.length >= USERNAME_MIN && !RESERVED_USERNAMES.has(fromName)) {
    return fromName;
  }
  const local = email?.split("@")[0] ?? "";
  const fromEmail = normalizeUsername(local);
  if (fromEmail.length >= USERNAME_MIN && !RESERVED_USERNAMES.has(fromEmail)) {
    return fromEmail;
  }
  return "sporcu";
}

export function isValidUsername(u: string): boolean {
  if (!USERNAME_RE.test(u)) return false;
  if (RESERVED_USERNAMES.has(u)) return false;
  return true;
}

export function usernameError(u: string, t?: (k: string) => string): string | null {
  const tr = t ?? ((k: string) => k);
  if (u.length < USERNAME_MIN) return tr("profile.usernameTooShort");
  if (u.length > USERNAME_MAX) return tr("profile.usernameTooLong");
  if (!USERNAME_RE.test(u)) return tr("profile.usernameInvalid");
  if (RESERVED_USERNAMES.has(u)) return tr("profile.usernameReserved");
  return null;
}
