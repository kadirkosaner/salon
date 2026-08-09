import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/lib/auth/provider";
import { I18nProvider } from "@/lib/i18n/provider";
import { ThemeProvider } from "@/lib/theme/provider";
import { THEME_BOOT_SCRIPT } from "@/lib/theme/tokens";
import { CreatedWithGrokBanner } from "@/components/created-with-grok-banner";
import { Toaster } from "sonner";
import { createAppQueryClient } from "@/lib/query-client";
import appCss from "../styles.css?url";

const APP_NAME = "Salon — Workout Tracker";
const APP_DESCRIPTION =
  "Workout tracker — programs, set logging, measurements and progress.";
const host = import.meta.env.VITE_PUBLIC_HOSTNAME;
const ogImage = host
  ? `https://og.grok.me/v1/card.png?host=${encodeURIComponent(host)}&title=${encodeURIComponent(APP_NAME)}`
  : undefined;

// One client per browser session (module scope is fine for SPA)
const queryClient = createAppQueryClient();

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: APP_NAME },
      {
        name: "description",
        content: APP_DESCRIPTION,
      },
      ...(ogImage
        ? [
            { property: "og:image", content: ogImage },
            { property: "og:image:width", content: "1200" },
            { property: "og:image:height", content: "630" },
          ]
        : []),
    ],
    links: [
      { rel: "stylesheet", href: appCss },
    ],
    scripts: [
      {
        children: THEME_BOOT_SCRIPT,
      },
    ],
  }),
  component: () => (
    <html lang="en" data-theme="obsidian" data-accent="pirinc" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="bg-canvas text-text antialiased">
        <CreatedWithGrokBanner />
        <QueryClientProvider client={queryClient}>
          <I18nProvider>
            <ThemeProvider>
              <AuthProvider>
                <Outlet />
                <Toaster
                  theme="dark"
                  position="bottom-center"
                  offset={{ bottom: "5.5rem" }}
                  mobileOffset={{ bottom: "5.5rem" }}
                  toastOptions={{
                    className: "bg-sunken border-rule text-text",
                  }}
                />
              </AuthProvider>
            </ThemeProvider>
          </I18nProvider>
        </QueryClientProvider>
        <Scripts />
      </body>
    </html>
  ),
});
