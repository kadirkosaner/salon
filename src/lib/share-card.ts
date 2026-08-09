/** Build a 1080×1920 story card as PNG blob. */

export type ShareCardInput = {
  kind: "pr" | "workout";
  title: string;
  subtitle?: string;
  stats: Array<{ label: string; value: string }>;
  username?: string | null;
  displayName?: string | null;
  dateLabel?: string;
};

export async function renderShareCard(input: ShareCardInput): Promise<Blob> {
  const W = 1080;
  const H = 1920;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  // Background
  const g = ctx.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, "#0c0c0e");
  g.addColorStop(0.55, "#141418");
  g.addColorStop(1, "#1a1408");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  // Accent glow
  const glow = ctx.createRadialGradient(W * 0.5, H * 0.28, 40, W * 0.5, H * 0.28, 520);
  glow.addColorStop(0, "color-mix(in oklab, var(--color-accent) 35%, transparent)");
  glow.addColorStop(1, "rgba(245,197,66,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  // Brand
  ctx.fillStyle = "#f5c542";
  ctx.font = "700 42px system-ui, sans-serif";
  ctx.fillText("SALON", 80, 120);

  ctx.fillStyle = "rgba(255,255,255,0.45)";
  ctx.font = "500 28px system-ui, sans-serif";
  const who =
    input.username
      ? `@${input.username}`
      : input.displayName || "";
  if (who) ctx.fillText(who, 80, 170);

  // Kind badge
  ctx.fillStyle =
    input.kind === "pr" ? "color-mix(in oklab, var(--color-accent) 35%, transparent)" : "rgba(255,255,255,0.08)";
  roundRect(ctx, 80, 260, input.kind === "pr" ? 280 : 320, 56, 28);
  ctx.fill();
  ctx.fillStyle = input.kind === "pr" ? "#f5c542" : "#e8e8ea";
  ctx.font = "700 26px system-ui, sans-serif";
  ctx.fillText(input.kind === "pr" ? "KİŞİSEL REKOR" : "ANTRENMAN", 108, 298);

  // Title
  ctx.fillStyle = "#f4f4f5";
  ctx.font = "800 72px system-ui, sans-serif";
  wrapText(ctx, input.title, 80, 420, W - 160, 84);

  if (input.subtitle) {
    ctx.fillStyle = "rgba(255,255,255,0.55)";
    ctx.font = "500 34px system-ui, sans-serif";
    ctx.fillText(input.subtitle, 80, 560);
  }

  // Stats
  let y = 680;
  for (const s of input.stats) {
    ctx.fillStyle = "rgba(255,255,255,0.06)";
    roundRect(ctx, 80, y, W - 160, 140, 28);
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.font = "600 26px system-ui, sans-serif";
    ctx.fillText(s.label.toUpperCase(), 110, y + 48);
    ctx.fillStyle = "#f5c542";
    ctx.font = "800 64px system-ui, sans-serif";
    ctx.fillText(s.value, 110, y + 112);
    y += 168;
  }

  // Footer
  ctx.fillStyle = "rgba(255,255,255,0.35)";
  ctx.font = "500 28px system-ui, sans-serif";
  ctx.fillText(input.dateLabel || new Date().toLocaleDateString("tr-TR"), 80, H - 140);
  ctx.fillText("salon · antrenman günlüğü", 80, H - 90);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("blob failed"))),
      "image/png",
      0.95,
    );
  });
}

export async function shareOrDownload(
  blob: Blob,
  filename: string,
  shareText: string,
): Promise<"shared" | "downloaded"> {
  const file = new File([blob], filename, { type: "image/png" });
  try {
    if (
      typeof navigator !== "undefined" &&
      navigator.canShare &&
      navigator.canShare({ files: [file] })
    ) {
      await navigator.share({ files: [file], text: shareText, title: "Salon" });
      return "shared";
    }
  } catch (e) {
    if ((e as Error).name === "AbortError") return "shared";
  }
  // Fallback download
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
  return "downloaded";
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxW: number,
  lineH: number,
) {
  const words = text.split(/\s+/);
  let line = "";
  let yy = y;
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > maxW && line) {
      ctx.fillText(line, x, yy);
      line = w;
      yy += lineH;
    } else {
      line = test;
    }
  }
  if (line) ctx.fillText(line, x, yy);
}
