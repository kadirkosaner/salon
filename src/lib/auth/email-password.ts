/**
 * Local email/password sign-in (this app's Better Auth DB — not the broker).
 *
 * Off by default. To enable: set `emailAndPasswordEnabled` to `true` below,
 * then build sign-up / sign-in forms with `authClient.signUp.email` /
 * `authClient.signIn.email` from `@/lib/auth/client` (see the auth skill).
 *
 * Password reset emails: set `RESEND_API_KEY` (+ optional `EMAIL_FROM`).
 * Without a mail transport, reset requests still succeed (anti-enumeration)
 * and the reset URL is logged server-side for ops/dev.
 */
export const emailAndPasswordEnabled = true;

type ResetUser = { email: string; name?: string | null };

export const emailAndPasswordConfig = {
  enabled: true as const,
  /**
   * Better Auth calls this when `/request-password-reset` succeeds for a known user.
   * Requires `RESEND_API_KEY` in production to actually deliver mail.
   */
  async sendResetPassword(
    {
      user,
      url,
    }: {
      user: ResetUser;
      url: string;
      token: string;
    },
    _request?: Request,
  ): Promise<void> {
    const key = process.env.RESEND_API_KEY?.trim();
    const from =
      process.env.EMAIL_FROM?.trim() || "Salon <onboarding@resend.dev>";

    if (key) {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from,
          to: user.email,
          subject: "Reset your Salon password",
          html: [
            `<p>Hi${user.name ? ` ${escapeHtml(user.name)}` : ""},</p>`,
            `<p>Reset your Salon password with this link (expires soon):</p>`,
            `<p><a href="${url}">${url}</a></p>`,
            `<p>If you did not request this, you can ignore this email.</p>`,
          ].join(""),
        }),
      });
      if (!res.ok) {
        const body = await res.text().catch(() => "");
        console.error("[auth] Resend password-reset failed", res.status, body);
        throw new Error("Failed to send reset email");
      }
      return;
    }

    // No transport: keep API green; log so preview/dev can still reset.
    console.info(
      "[auth] password reset (set RESEND_API_KEY to email links)",
      user.email,
      url,
    );
  },
};

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&" + "amp;")
    .replace(/</g, "&" + "lt;")
    .replace(/>/g, "&" + "gt;")
    .replace(/"/g, "&" + "quot;");
}
