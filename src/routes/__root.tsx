import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/lib/auth/provider";
import { OnboardingGate } from "@/components/onboarding-gate";
import { I18nProvider } from "@/lib/i18n/provider";
import { ThemeProvider } from "@/lib/theme/provider";
import { THEME_BOOT_SCRIPT } from "@/lib/theme/tokens";
import { CreatedWithGrokBanner } from "@/components/created-with-grok-banner";
import { PwaBootstrap } from "@/components/pwa/pwa-bootstrap";
import { Toaster } from "sonner";
import { createAppQueryClient } from "@/lib/query-client";
import appCss from "../styles.css?url";

const APP_NAME = "Salon";
const APP_FULL_NAME = "Salon — Workout Tracker";
const APP_DESCRIPTION =
  "Workout tracker for iPhone and Android — programs, set logging, measurements and progress.";
const host = import.meta.env.VITE_PUBLIC_HOSTNAME;
const ogImage = host
  ? `https://og.grok.me/v1/card.png?host=${encodeURIComponent(host)}&title=${encodeURIComponent(APP_FULL_NAME)}`
  : undefined;

// One client per browser session (module scope is fine for SPA)
const queryClient = createAppQueryClient();

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content:
          "width=device-width, initial-scale=1, viewport-fit=cover, maximum-scale=1, user-scalable=no",
      },
      { title: APP_FULL_NAME },
      { name: "description", content: APP_DESCRIPTION },
      { name: "theme-color", content: "#0c0c0b" },
      { name: "color-scheme", content: "dark" },
      { name: "mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
      { name: "apple-mobile-web-app-title", content: APP_NAME },
      { name: "application-name", content: APP_NAME },
      { name: "format-detection", content: "telephone=no" },
      ...(ogImage
        ? [
            { property: "og:image", content: ogImage },
            { property: "og:image:width", content: "1200" },
            { property: "og:image:height", content: "630" },
            { property: "og:title", content: APP_FULL_NAME },
            { property: "og:description", content: APP_DESCRIPTION },
          ]
        : []),
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "icon", href: "/icons/icon-192.png", type: "image/png", sizes: "192x192" },
      { rel: "icon", href: "/icons/icon-512.png", type: "image/png", sizes: "512x512" },
      { rel: "apple-touch-icon", href: "/icons/apple-touch-icon.png", sizes: "180x180" },
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
                <PwaBootstrap />
                <OnboardingGate>
                  <Outlet />
                </OnboardingGate>
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
