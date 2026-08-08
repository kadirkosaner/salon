import { createFileRoute } from "@tanstack/react-router";

/**
 * Same-origin proxy for exercise GIF/images (jsDelivr / GitHub CDN).
 * Live preview iframes sometimes block third-party media; proxying fixes empty previews.
 */
export const Route = createFileRoute("/api/ex-media")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const src = new URL(request.url).searchParams.get("u");
        if (!src) {
          return new Response("missing u", { status: 400 });
        }
        let parsed: URL;
        try {
          parsed = new URL(src);
        } catch {
          return new Response("bad url", { status: 400 });
        }
        const host = parsed.hostname;
        const allowed =
          host === "cdn.jsdelivr.net" ||
          host === "raw.githubusercontent.com" ||
          host.endsWith(".jsdelivr.net");
        if (!allowed) {
          return new Response("host not allowed", { status: 403 });
        }

        try {
          const upstream = await fetch(src, {
            headers: { Accept: "image/*,*/*" },
          });
          if (!upstream.ok || !upstream.body) {
            return new Response("upstream fail", { status: 502 });
          }
          const ct =
            upstream.headers.get("content-type") || "application/octet-stream";
          return new Response(upstream.body, {
            status: 200,
            headers: {
              "Content-Type": ct,
              "Cache-Control": "public, max-age=86400, immutable",
              "Access-Control-Allow-Origin": "*",
            },
          });
        } catch {
          return new Response("proxy error", { status: 502 });
        }
      },
    },
  },
});
