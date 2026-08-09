import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ChevronLeft, Eye } from "@/components/icons";
import { toast } from "sonner";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { authClient } from "@/lib/auth/client";
import { AppShell, AuthGateSkeleton } from "@/components/layout/app-shell";
import { useI18n } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils";
import {
  getMyProfileHub,
  updateMyProfile,
  type ProfileHub,
} from "@/lib/server/social";
import { isValidUsername, normalizeUsername } from "@/lib/username";
import { Spinner } from "@/components/ui/spinner";

export const Route = createFileRoute("/profile/edit")({
  component: EditProfilePage,
});

type FieldErr = Partial<
  Record<"name" | "username" | "bio" | "birth_date" | "height_cm" | "sex", string>
>;

function EditProfilePage() {
  const { user, isPending } = useCurrentUserState();
  const { t } = useI18n();
  const navigate = useNavigate();
  const [hub, setHub] = useState<ProfileHub | null>(null);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [visibility, setVisibility] =
    useState<ProfileHub["visibility"]>("public");
  const [measuresPublic, setMeasuresPublic] = useState(false);
  const [birthDate, setBirthDate] = useState("");
  const [sex, setSex] = useState<"female" | "male" | "unspecified">("unspecified");
  const [heightCm, setHeightCm] = useState("");
  const [detailsPublic, setDetailsPublic] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<FieldErr>({});

  useEffect(() => {
    if (!user?.id) return;
    if (user.displayName) setName(user.displayName);
    void getMyProfileHub()
      .then((h) => {
        setHub(h);
        setUsername(h.username);
        setBio(h.bio ?? "");
        setVisibility(h.visibility);
        setMeasuresPublic(h.measures_public);
        setBirthDate(h.birth_date ?? "");
        setSex((h.sex as "female" | "male" | "unspecified") || "unspecified");
        setHeightCm(h.height_cm != null ? String(h.height_cm) : "");
        setDetailsPublic(h.details_public === true);
      })
      .catch(() => toast.error(t("common.error")));
  }, [user?.id, user?.displayName, t]);

  if (isPending) return <AuthGateSkeleton />;
  if (!user) return <RedirectToSignIn />;

  const initials = (name || user.displayName || "S")
    .split(/\s+/)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const avatarSrc = hub?.image || user.profileImageUrl;

  function fieldClass(key: keyof FieldErr) {
    return cn(
      "h-12 w-full rounded-xl bg-raised px-3 text-sm shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]",
      errors[key] && "shadow-[inset_0_0_0_1.5px_var(--color-danger)]",
    );
  }

  async function onAvatarFile(file: File | null) {
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Max 2MB");
      return;
    }
    if (!file.type.startsWith("image/")) {
      toast.error(t("common.error"));
      return;
    }
    try {
      const dataUrl = await compressImage(file, 256, 0.82);
      setSaving(true);
      const h = await updateMyProfile({ data: { avatar_url: dataUrl } });
      setHub(h);
      toast.success(t("common.saved"));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("common.error"));
    } finally {
      setSaving(false);
    }
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    const currentUser = user;
    const next: FieldErr = {};
    const n = name.trim();
    if (n.length > 0 && n.length < 2) {
      next.name = t("auth.nameMin");
    }
    const u = normalizeUsername(username);
    if (!isValidUsername(u)) {
      next.username = t("profile.usernameInvalid");
    }
    let heightNum: number | null | undefined = undefined;
    if (heightCm.trim() === "") {
      heightNum = null;
    } else {
      const parsed = Number(heightCm.replace(",", "."));
      if (Number.isNaN(parsed) || parsed < 80 || parsed > 250) {
        next.height_cm = t("profile.height");
      } else {
        heightNum = parsed;
      }
    }
    if (birthDate.trim()) {
      const d = new Date(birthDate + "T12:00:00");
      const age =
        (Date.now() - d.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
      if (Number.isNaN(d.getTime()) || age < 13 || age > 120) {
        next.birth_date = t("profile.birthDate");
      }
    }
    setErrors(next);
    if (Object.keys(next).length > 0) {
      requestAnimationFrame(() => {
        const el = document.querySelector<HTMLElement>("[data-field-error]");
        el?.scrollIntoView({ behavior: "smooth", block: "center" });
        el?.querySelector<HTMLElement>("input,textarea")?.focus();
      });
      return;
    }

    setSaving(true);
    try {
      if (n.length >= 2 && n !== currentUser.displayName) {
        const { error } = await authClient.updateUser({ name: n });
        if (error) {
          setErrors({ name: error.message || t("common.error") });
          setSaving(false);
          return;
        }
        await authClient.getSession();
      }
      await updateMyProfile({
        data: {
          username: u,
          visibility,
          measures_public: measuresPublic,
          details_public: detailsPublic,
          sex,
          bio: bio.trim() || null,
          birth_date: birthDate.trim() || null,
          height_cm: heightNum === undefined ? null : heightNum,
        },
      });
      toast.success(t("common.saved"));
      void navigate({ to: "/profile" });
    } catch (err) {
      const msg = err instanceof Error ? err.message : t("common.error");
      if (/username|taken|reserved/i.test(msg)) {
        setErrors({ username: msg });
      } else if (/birth|age|date/i.test(msg)) {
        setErrors({ birth_date: msg });
      } else if (/height/i.test(msg)) {
        setErrors({ height_cm: msg });
      } else {
        toast.error(msg);
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <AppShell
      title={t("profile.editProfile")}
      subtitle={hub ? `@${hub.username}` : undefined}
    >
      <div className="mb-3">
        <button
          type="button"
          onClick={() => void navigate({ to: "/profile" })}
          className="inline-flex h-10 items-center gap-1 text-sm font-medium text-text-2"
        >
          <ChevronLeft className="size-4" />
          {t("common.back")}
        </button>
      </div>

      <form onSubmit={(e) => void save(e)} className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="grid size-16 place-items-center overflow-hidden rounded-2xl bg-accent/15 font-display text-xl text-accent">
            {avatarSrc ? (
              <img src={avatarSrc} alt="" className="size-full object-cover" />
            ) : (
              initials
            )}
          </div>
          <label className="cursor-pointer text-sm font-semibold text-accent">
            {t("profile.avatar")}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              onChange={(e) => void onAvatarFile(e.target.files?.[0] ?? null)}
            />
          </label>
        </div>

        <label
          className="block space-y-1.5"
          data-field-error={errors.name ? "" : undefined}
        >
          <span className="text-xs font-medium text-text-2">
            {t("settings.displayName")}
          </span>
          <input
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setErrors((er) => ({ ...er, name: undefined }));
            }}
            className={fieldClass("name")}
          />
          {errors.name ? (
            <p className="text-xs text-danger">{errors.name}</p>
          ) : null}
        </label>

        <label
          className="block space-y-1.5"
          data-field-error={errors.username ? "" : undefined}
        >
          <span className="text-xs font-medium text-text-2">
            {t("profile.username")}
          </span>
          <input
            value={username}
            onChange={(e) => {
              setUsername(e.target.value.toLowerCase());
              setErrors((er) => ({ ...er, username: undefined }));
            }}
            maxLength={20}
            autoCapitalize="none"
            autoCorrect="off"
            className={fieldClass("username")}
          />
          {errors.username ? (
            <p className="text-xs text-danger">{errors.username}</p>
          ) : null}
        </label>

        <label className="block space-y-1.5">
          <span className="text-xs font-medium text-text-2">
            {t("profile.bio")} ({bio.length}/160)
          </span>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value.slice(0, 160))}
            rows={3}
            className="w-full resize-none rounded-xl bg-raised px-3 py-2.5 text-sm shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
          />
        </label>

        <fieldset className="space-y-2">
          <legend className="flex items-center gap-1.5 text-xs font-medium text-text-2">
            <Eye className="size-3.5" /> {t("profile.visibility")}
          </legend>
          {(
            [
              ["public", t("profile.visibilityPublic")],
              ["followers", t("profile.visibilityFollowers")],
              ["private", t("profile.visibilityPrivate")],
            ] as const
          ).map(([k, lab]) => (
            <label
              key={k}
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-xl px-3 py-3",
                visibility === k
                  ? "bg-accent/10 shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-accent)_35%,transparent)]"
                  : "bg-raised/50",
              )}
            >
              <input
                type="radio"
                name="vis"
                checked={visibility === k}
                onChange={() => setVisibility(k)}
                className="accent-primary"
              />
              <span className="text-sm">{lab}</span>
            </label>
          ))}
        </fieldset>

        <label
          className="block space-y-1.5"
          data-field-error={errors.birth_date ? "" : undefined}
        >
          <span className="text-xs font-medium text-text-2">
            {t("profile.birthDate")}
          </span>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => {
              setBirthDate(e.target.value);
              setErrors((er) => ({ ...er, birth_date: undefined }));
            }}
            max={new Date(
              new Date().setFullYear(new Date().getFullYear() - 13),
            )
              .toISOString()
              .slice(0, 10)}
            min="1905-01-01"
            className={fieldClass("birth_date")}
          />
          {errors.birth_date ? (
            <p className="text-xs text-danger">{errors.birth_date}</p>
          ) : null}
        </label>

        <fieldset className="space-y-2">
          <legend className="text-xs font-medium text-text-2">
            {t("profile.sexLabel")}
          </legend>
          {(
            [
              ["unspecified", t("profile.sex.unspecified")],
              ["female", t("profile.sex.female")],
              ["male", t("profile.sex.male")],
            ] as const
          ).map(([k, lab]) => (
            <label
              key={k}
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-xl px-3 py-3",
                sex === k
                  ? "bg-accent/10 shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-accent)_35%,transparent)]"
                  : "bg-raised/50",
              )}
            >
              <input
                type="radio"
                name="sex"
                checked={sex === k}
                onChange={() => setSex(k)}
                className="accent-primary"
              />
              <span className="text-sm">{lab}</span>
            </label>
          ))}
        </fieldset>

        <label
          className="block space-y-1.5"
          data-field-error={errors.height_cm ? "" : undefined}
        >
          <span className="text-xs font-medium text-text-2">
            {t("profile.height")} (cm)
          </span>
          <input
            type="number"
            inputMode="decimal"
            min={80}
            max={250}
            step={0.5}
            value={heightCm}
            onChange={(e) => {
              setHeightCm(e.target.value);
              setErrors((er) => ({ ...er, height_cm: undefined }));
            }}
            placeholder="170"
            className={fieldClass("height_cm")}
          />
          {errors.height_cm ? (
            <p className="text-xs text-danger">{errors.height_cm}</p>
          ) : null}
        </label>

        <label className="flex items-center justify-between gap-3 rounded-xl bg-raised/50 px-3 py-3">
          <span className="text-sm">{t("profile.detailsPublic")}</span>
          <input
            type="checkbox"
            checked={detailsPublic}
            onChange={(e) => setDetailsPublic(e.target.checked)}
            className="size-5 accent-primary"
          />
        </label>

        <label className="flex items-center justify-between gap-3 rounded-xl bg-raised/50 px-3 py-3">
          <span className="text-sm">{t("profile.measuresPublic")}</span>
          <input
            type="checkbox"
            checked={measuresPublic}
            onChange={(e) => setMeasuresPublic(e.target.checked)}
            className="size-5 accent-primary"
          />
        </label>

        <button
          type="submit"
          disabled={saving}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary font-semibold text-on-primary disabled:opacity-60"
        >
          {saving ? <Spinner className="size-4" /> : null}
          {t("common.save")}
        </button>
      </form>
    </AppShell>
  );
}

async function compressImage(
  file: File,
  maxSide: number,
  quality: number,
): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas");
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();
  return canvas.toDataURL("image/jpeg", quality);
}
