import * as THREE from "three";
import { hero, site, stages } from "@/lib/site";

/*
 * Every face of the 3D book is drawn here on a 2D canvas and handed to WebGL
 * as a texture. Nothing is hard-coded: the palette comes from the CSS custom
 * properties in globals.css and the typefaces from the next/font variables, so
 * the book restyles itself with the rest of the site.
 *
 * Text as a texture is the one real cost of the WebGL book — it cannot be
 * selected or read by a screen reader, and it has to be drawn at enough pixels
 * to stay sharp on a curved page. Both are handled: the loader is decorative
 * and its content is repeated as real text on the page underneath, and these
 * canvases are drawn at the page's on-screen size in device pixels.
 */

/* All drawing below works in a 900-wide coordinate space; superSample()
 * scales the real canvas up and the context with it, so the artwork gains
 * resolution without a single measurement changing. */
const TEX_W = 900;
const TEX_H = 1186; // 900 * (BOOK_H / HALF) keeps the page's real proportions

/**
 * Canvas pixels per layout unit, fitted to the screen. An open page stands
 * about 75% of the viewport tall; drawing it at that height in device pixels
 * (capped at 2x) is as sharp as it can look. It used to be a fixed 2x — 14
 * canvases of 1800 x 2372, ~240 MB of GPU memory — which cost seconds of
 * main-thread time before the intro could start, and far more than a phone
 * needs. Rounded up to quarter steps; never below 1 (the layout size).
 */
function superSample() {
  if (typeof window === "undefined") return 1;
  const pagePx = window.innerHeight * 0.75 * Math.min(window.devicePixelRatio || 1, 2);
  return Math.min(2, Math.max(1, Math.ceil((pagePx / TEX_H) * 4) / 4));
}

const css = (name: string, fallback: string) => {
  if (typeof window === "undefined") return fallback;
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
};

type Palette = {
  page: string;
  cover: string;
  ink: string;
  inkMuted: string;
  inkSubtle: string;
  accent: string;
  accentTint: string;
  inverseInk: string;
  display: string;
  sans: string;
};

function palette(): Palette {
  return {
    page: css("--color-book-page", "#f2efe9"),
    cover: css("--color-book-cover", "#1d1e22"),
    ink: css("--color-ink", "#1d1e22"),
    inkMuted: css("--color-ink-muted", "#52535a"),
    inkSubtle: css("--color-ink-subtle", "#616269"),
    accent: css("--color-accent", "#9e4606"),
    accentTint: css("--color-accent-tint", "#ff9d3d"),
    inverseInk: css("--color-inverse-ink", "#f9f7f3"),
    // next/font exposes the family through these variables.
    display: css("--font-playfair", "Georgia, serif"),
    sans: css("--font-roboto", "system-ui, sans-serif"),
  };
}

/** The webfonts must be loaded before anything is drawn, or the canvas silently
 *  falls back to a system face and the book ships in the wrong typeface. */
export async function ensureFonts() {
  if (typeof document === "undefined" || !document.fonts) return;
  const p = palette();
  const faces = [
    `400 96px ${p.display}`,
    `italic 400 96px ${p.display}`,
    `400 32px ${p.sans}`,
    `600 24px ${p.sans}`,
  ];
  await Promise.all(faces.map((f) => document.fonts.load(f).catch(() => undefined)));
  await document.fonts.ready;
}

type Ctx = CanvasRenderingContext2D;

function makeCanvas(): { canvas: HTMLCanvasElement; ctx: Ctx } {
  const canvas = document.createElement("canvas");
  const s = superSample();
  canvas.width = Math.round(TEX_W * s);
  canvas.height = Math.round(TEX_H * s);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("2D canvas unavailable");
  ctx.scale(s, s);
  ctx.textBaseline = "top";
  return { canvas, ctx };
}

/** Word-wrap, returning the y the next block should start at. */
function wrap(ctx: Ctx, text: string, x: number, y: number, maxW: number, lh: number) {
  const words = text.split(" ");
  let line = "";
  let cy = y;
  for (const w of words) {
    const next = line ? `${line} ${w}` : w;
    if (ctx.measureText(next).width > maxW && line) {
      ctx.fillText(line, x, cy);
      cy += lh;
      line = w;
    } else {
      line = next;
    }
  }
  if (line) {
    ctx.fillText(line, x, cy);
    cy += lh;
  }
  return cy;
}

function tracked(ctx: Ctx, text: string, x: number, y: number, spacing: number) {
  let cx = x;
  for (const ch of text) {
    ctx.fillText(ch, cx, y);
    cx += ctx.measureText(ch).width + spacing;
  }
}

/** Paper: a flat tint plus fine grain, so the page is not a dead flat colour. */
function paper(ctx: Ctx, p: Palette) {
  ctx.fillStyle = p.page;
  ctx.fillRect(0, 0, TEX_W, TEX_H);
  const grain = ctx.createLinearGradient(0, 0, TEX_W, TEX_H);
  grain.addColorStop(0, "rgba(0,0,0,0.02)");
  grain.addColorStop(0.5, "rgba(255,255,255,0.03)");
  grain.addColorStop(1, "rgba(0,0,0,0.025)");
  ctx.fillStyle = grain;
  ctx.fillRect(0, 0, TEX_W, TEX_H);
}

/** Darkening towards the spine, which is what sells a page as bound. */
function gutter(ctx: Ctx, side: "left" | "right") {
  const w = TEX_W * 0.16;
  const g =
    side === "left"
      ? ctx.createLinearGradient(0, 0, w, 0)
      : ctx.createLinearGradient(TEX_W, 0, TEX_W - w, 0);
  g.addColorStop(0, "rgba(22,20,18,0.20)");
  g.addColorStop(1, "rgba(22,20,18,0)");
  ctx.fillStyle = g;
  ctx.fillRect(side === "left" ? 0 : TEX_W - w, 0, w, TEX_H);
}

const M = 96; // page margin

function rectoPage(i: number): HTMLCanvasElement {
  const { canvas, ctx } = makeCanvas();
  const p = palette();
  const stage = stages[i];
  paper(ctx, p);
  gutter(ctx, "left"); // recto is bound on its left

  ctx.fillStyle = p.accent;
  ctx.font = `600 22px ${p.sans}`;
  tracked(ctx, `STAGE 0${i + 1}`, M, M, 3);

  ctx.fillStyle = p.ink;
  ctx.font = `400 104px ${p.display}`;
  ctx.fillText(stage.word, M - 4, M + 70);

  ctx.fillStyle = p.inkMuted;
  ctx.font = `400 30px ${p.sans}`;
  wrap(ctx, stage.note, M, M + 230, TEX_W - M * 2, 46);

  ctx.fillStyle = p.inkSubtle;
  ctx.font = `400 24px ${p.sans}`;
  const folio = String(i * 2 + 1);
  ctx.fillText(folio, TEX_W - M - ctx.measureText(folio).width, TEX_H - M);
  return canvas;
}

function versoPage(i: number): HTMLCanvasElement {
  const { canvas, ctx } = makeCanvas();
  const p = palette();
  const stage = stages[i];
  paper(ctx, p);
  gutter(ctx, "right"); // verso is bound on its right

  ctx.fillStyle = p.inkSubtle;
  ctx.font = `600 20px ${p.sans}`;
  tracked(ctx, stage.word.toUpperCase(), M, M, 5);

  ctx.fillStyle = p.ink;
  ctx.font = `400 32px ${p.sans}`;
  wrap(ctx, stage.detail, M, M + 120, TEX_W - M * 2, 54);

  ctx.fillStyle = p.inkSubtle;
  ctx.font = `400 24px ${p.sans}`;
  ctx.fillText(String((i + 1) * 2), M, TEX_H - M);
  return canvas;
}

function coverFace(opts: { front: boolean }): HTMLCanvasElement {
  const { canvas, ctx } = makeCanvas();
  const p = palette();
  ctx.fillStyle = p.cover;
  ctx.fillRect(0, 0, TEX_W, TEX_H);
  // Cloth-like sheen across the board.
  const sheen = ctx.createLinearGradient(0, 0, TEX_W, TEX_H);
  sheen.addColorStop(0, "rgba(255,255,255,0.06)");
  sheen.addColorStop(0.55, "rgba(255,255,255,0)");
  sheen.addColorStop(1, "rgba(0,0,0,0.18)");
  ctx.fillStyle = sheen;
  ctx.fillRect(0, 0, TEX_W, TEX_H);

  ctx.fillStyle = p.accentTint;
  ctx.font = `600 22px ${p.sans}`;
  tracked(ctx, site.name.toUpperCase(), M, M, 4);

  if (opts.front) {
    ctx.fillStyle = p.inverseInk;
    ctx.font = `400 76px ${p.display}`;
    const y = wrap(ctx, hero.title, M, TEX_H - M - 330, TEX_W - M * 2, 92);
    ctx.fillStyle = p.accentTint;
    ctx.fillRect(M, y + 40, 190, 3);
  } else {
    ctx.fillStyle = p.accentTint;
    ctx.fillRect(M, TEX_H - M - 150, 190, 3);
    ctx.fillStyle = "rgba(244,238,227,0.62)";
    ctx.font = `400 28px ${p.sans}`;
    wrap(ctx, site.tagline, M, TEX_H - M - 110, TEX_W - M * 2, 42);
  }
  return canvas;
}

function endpaper(text: string, sub: string, side: "left" | "right"): HTMLCanvasElement {
  const { canvas, ctx } = makeCanvas();
  const p = palette();
  paper(ctx, p);
  gutter(ctx, side);
  ctx.fillStyle = p.accent;
  ctx.font = `600 22px ${p.sans}`;
  tracked(ctx, "COLOPHON", M, M, 3);
  ctx.fillStyle = p.ink;
  ctx.font = `400 44px ${p.display}`;
  const y = wrap(ctx, text, M, M + 90, TEX_W - M * 2, 60);
  ctx.fillStyle = p.inkMuted;
  ctx.font = `400 28px ${p.sans}`;
  wrap(ctx, sub, M, y + 24, TEX_W - M * 2, 42);
  return canvas;
}

function toTexture(canvas: HTMLCanvasElement, maxAniso: number): THREE.CanvasTexture {
  const t = new THREE.CanvasTexture(canvas);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = maxAniso; // keeps text readable at a glancing angle mid-turn
  t.generateMipmaps = true;
  t.minFilter = THREE.LinearMipmapLinearFilter;
  t.magFilter = THREE.LinearFilter;
  return t;
}

export type BookTextures = {
  coverFront: THREE.Texture;
  coverInside: THREE.Texture;
  backOutside: THREE.Texture;
  backInside: THREE.Texture;
  leaves: { front: THREE.Texture; back: THREE.Texture }[];
  dispose: () => void;
};

export function buildTextures(maxAniso: number): BookTextures {
  const t = (c: HTMLCanvasElement) => toTexture(c, maxAniso);
  const coverFront = t(coverFace({ front: true }));
  const coverInside = t(endpaper("Publishing services for authors.", site.location, "right"));
  const backOutside = t(coverFace({ front: false }));
  const backInside = t(
    endpaper("Every right and every royalty stays with you.", site.email, "left"),
  );
  const leaves = stages.map((_, i) => ({ front: t(rectoPage(i)), back: t(versoPage(i)) }));

  return {
    coverFront,
    coverInside,
    backOutside,
    backInside,
    leaves,
    dispose: () => {
      [coverFront, coverInside, backOutside, backInside].forEach((x) => x.dispose());
      leaves.forEach((l) => {
        l.front.dispose();
        l.back.dispose();
      });
    },
  };
}

