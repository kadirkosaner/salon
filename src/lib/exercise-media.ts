/**
 * Client-safe media helpers — NO dataset import (keeps bundle small).
 */

/** Prefer same-origin proxy so previews work inside restricted iframes. */
export function mediaSrc(
  url: string | null | undefined,
  preferProxy = true,
): string | null {
  if (!url) return null;
  if (!preferProxy) return url;
  try {
    const u = new URL(url);
    if (u.hostname.includes("jsdelivr") || u.hostname.includes("github")) {
      return `/api/ex-media?u=${encodeURIComponent(url)}`;
    }
  } catch {
    /* keep raw */
  }
  return url;
}
