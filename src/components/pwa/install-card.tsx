import { useEffect, useState } from "react";
import { Download, Share2, Smartphone } from "@/components/icons";
import { useT } from "@/lib/i18n/provider";
import {
  getInstallPrompt,
  isAndroid,
  isIos,
  isStandalone,
  promptInstall,
  subscribeInstallAvailability,
} from "@/lib/pwa";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

/**
 * Compact install CTA for settings / empty states.
 * Android Chrome: native install prompt when available.
 * iOS Safari: Share → Add to Home Screen instructions.
 */
export function InstallCard({ className }: { className?: string }) {
  const t = useT();
  const [standalone, setStandalone] = useState(false);
  const [canPrompt, setCanPrompt] = useState(false);
  const [busy, setBusy] = useState(false);
  const [showIosHelp, setShowIosHelp] = useState(false);

  useEffect(() => {
    setStandalone(isStandalone());
    setCanPrompt(!!getInstallPrompt());
    return subscribeInstallAvailability(() => {
      setCanPrompt(!!getInstallPrompt());
      setStandalone(isStandalone());
    });
  }, []);

  if (standalone) {
    return (
      <div
        className={cn(
          "rounded-2xl border border-success/25 bg-success/10 px-4 py-3 text-sm text-success",
          className,
        )}
      >
        {t("pwa.installed")}
      </div>
    );
  }

  async function onInstall() {
    if (isIos()) {
      setShowIosHelp(true);
      return;
    }
    setBusy(true);
    try {
      const result = await promptInstall();
      if (result === "unavailable") {
        setShowIosHelp(true);
        toast.message(t("pwa.useBrowserMenu"));
      } else if (result === "accepted") {
        toast.success(t("pwa.installing"));
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-accent/25 bg-accent/8",
        className,
      )}
    >
      <div className="flex items-start gap-3 px-4 py-3.5">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent/15 text-accent">
          <Smartphone className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-text">{t("pwa.installTitle")}</p>
          <p className="mt-0.5 text-xs leading-relaxed text-text-2">
            {t("pwa.installHint")}
          </p>
          <button
            type="button"
            disabled={busy}
            onClick={() => void onInstall()}
            className="mt-3 inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-3.5 text-sm font-semibold text-on-primary disabled:opacity-60"
          >
            <Download className="size-4" />
            {canPrompt || isAndroid()
              ? t("pwa.installCta")
              : isIos()
                ? t("pwa.howOnIos")
                : t("pwa.installCta")}
          </button>
        </div>
      </div>

      {showIosHelp || isIos() ? (
        <ol className="space-y-2 border-t border-rule/60 bg-sunken/40 px-4 py-3 text-xs leading-relaxed text-text-2">
          <li className="flex gap-2">
            <span className="num shrink-0 font-semibold text-accent">1</span>
            <span>
              {t("pwa.iosStep1")}{" "}
              <Share2 className="inline size-3.5 align-text-bottom text-accent" />{" "}
              {t("pwa.iosShare")}
            </span>
          </li>
          <li className="flex gap-2">
            <span className="num shrink-0 font-semibold text-accent">2</span>
            <span>{t("pwa.iosStep2")}</span>
          </li>
          <li className="flex gap-2">
            <span className="num shrink-0 font-semibold text-accent">3</span>
            <span>{t("pwa.iosStep3")}</span>
          </li>
          {isAndroid() && !canPrompt ? (
            <li className="flex gap-2 pt-1 text-text-3">
              <span className="num shrink-0 font-semibold text-accent">·</span>
              <span>{t("pwa.androidMenu")}</span>
            </li>
          ) : null}
        </ol>
      ) : null}
    </div>
  );
}
