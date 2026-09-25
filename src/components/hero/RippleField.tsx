"use client";

import { useEffect, useRef } from "react";
import { stages } from "@/lib/site";

/*
 * The hero's water surface: orionix's hero ripple, rebuilt for our hero.
 *
 * What ripples is only the background: a faint typeset spread (two columns of
 * our process copy, running heads and folios) drawn once into a 2D canvas. The
 * covers are NOT part of it — they stay ordinary DOM above the canvas, sharp
 * and still. Tuned to be felt more than seen: an earlier version painted the
 * covers into the surface at orionix's full strength, and it was too much.
 *
 * Two effects, the same technique orionix's shader uses:
 *   trail    a height field simulated with the 2D wave equation on a float
 *            texture, ping-ponged each frame. Moving the pointer stamps a
 *            ring into it; pressing makes the stamp stronger. The picture is
 *            displaced along the field's gradient.
 *   clicks   each press also launches an analytic expanding ring (up to 8 at
 *            once), summed in the display pass.
 * A small per-channel spread of the displacement gives the colour fringe.
 *
 * Runs only with a fine hover pointer, without reduced motion, and where the
 * browser can render to half-float textures (WebGL2 + EXT_color_buffer_float).
 * Anywhere else this renders nothing and the hero is simply still. The loop
 * sleeps when the hero is off screen, the tab is hidden, or the surface has
 * been still for a few seconds.
 */

/* ---- Tuning (orionix's Ripple, turned well down) --------------------------- */
const RADIUS = 0.1; // stamp radius, in units of sqrt(w*h)
const SOFTNESS = 0.5;
const CENTER_FADE = 0.25;
const STRENGTH = 0.4;
const DECAY = 0.5; // 0..1 → per-frame damping 0.95..0.99
const DISPLACE = 0.012;
const DISPERSION = 0.12;
const SIM_DETAIL = 800; // simulation cells along sqrt(w*h)
const CLICKS = 8;
/** Click-ring lifetime, from the same decay setting as the trail. */
const CLICK_LIFE = -3 / (Math.log10(0.9 + 0.05 * DECAY)) / 60;
/** Stop drawing after this long without input or live rings. */
const SLEEP_MS = 4000;

const VERT = `#version 300 es
in vec2 a_pos;
out vec2 v_uv;
void main() {
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}`;

const SIM = `#version 300 es
precision highp float;
in vec2 v_uv;
out vec4 o;
uniform sampler2D u_prev;
uniform vec2 u_px;      // one cell, in uv
uniform vec2 u_aspect;  // size / sqrt(w*h)
uniform vec4 u_mouse;   // xy: uv, zw: velocity (aspect units / s)
uniform float u_hover;
uniform float u_down;
uniform float u_dt;
void main() {
  vec4 d = texture(u_prev, v_uv);
  float cur = d.r;
  float prev = d.g;
  float l = texture(u_prev, v_uv - vec2(u_px.x, 0.0)).r;
  float r = texture(u_prev, v_uv + vec2(u_px.x, 0.0)).r;
  float dn = texture(u_prev, v_uv - vec2(0.0, u_px.y)).r;
  float up = texture(u_prev, v_uv + vec2(0.0, u_px.y)).r;
  float k = u_dt * 60.0;
  float decay = pow(mix(0.95, 0.99, ${DECAY.toFixed(3)}), k);
  float next = ((l + r + dn + up) * 0.5 - prev) * decay;

  float dist = distance(v_uv * u_aspect, u_mouse.xy * u_aspect);
  float stamp = 1.0 - smoothstep(${(RADIUS * (1 - SOFTNESS)).toFixed(4)}, ${RADIUS.toFixed(4)}, dist);
  float centerFade = smoothstep(0.0, ${(CENTER_FADE * 0.2).toFixed(4)}, dist);
  float speed = clamp(length(u_mouse.zw) * ${STRENGTH.toFixed(3)}, 0.0, 1.0);
  float press = 1.0 + u_down * 1.5;
  next += stamp * centerFade * u_hover * speed * press * min(k, 3.0);
  o = vec4(next, cur, 0.0, 1.0);
}`;

const SHOW = `#version 300 es
precision highp float;
in vec2 v_uv;
out vec4 o;
uniform sampler2D u_image;
uniform sampler2D u_sim;
uniform vec2 u_px;
uniform vec2 u_aspect;
uniform vec3 u_clicks[${CLICKS}]; // xy: origin uv, z: age in s (< 0 = free)

vec2 ring(vec2 uv, vec2 origin, float age) {
  vec2 d = (uv - origin) * u_aspect;
  float dist = length(d);
  if (dist < 1e-5) return vec2(0.0);
  float life = ${CLICK_LIFE.toFixed(4)};
  float reach = ${(RADIUS * 3).toFixed(4)};
  float front = reach * clamp(age / life, 0.0, 1.0);
  float band = 0.25 * reach;
  float x = dist - front;
  float wave = cos(6.2831853 / band * x) * exp(-(x * x) / (band * band))
             * (1.0 - smoothstep(life * 0.6, life, age));
  return normalize((d / dist) / u_aspect) * wave * 0.004;
}

void main() {
  vec2 uv = v_uv;
  float hL = texture(u_sim, uv - vec2(u_px.x, 0.0)).r;
  float hR = texture(u_sim, uv + vec2(u_px.x, 0.0)).r;
  float hD = texture(u_sim, uv - vec2(0.0, u_px.y)).r;
  float hU = texture(u_sim, uv + vec2(0.0, u_px.y)).r;
  vec2 offset = vec2(hL - hR, hD - hU) * ${DISPLACE.toFixed(4)} / u_aspect;
  for (int i = 0; i < ${CLICKS}; i++) {
    vec3 c = u_clicks[i];
    if (c.z >= 0.0) offset += ring(uv, c.xy, c.z);
  }
  vec4 r = texture(u_image, uv + offset * ${(1 - DISPERSION * 0.5).toFixed(3)});
  vec4 g = texture(u_image, uv + offset);
  vec4 b = texture(u_image, uv + offset * ${(1 + DISPERSION * 0.5).toFixed(3)});
  o = vec4(r.r, g.g, b.b, max(max(r.a, g.a), b.a));
}`;

/* ---- The picture ---------------------------------------------------------- */

const SPREAD_INK = "rgba(29, 30, 34, 0.022)";

/** Two columns of justified-ish text, like an open book behind the headline. */
function drawSpread(ctx: CanvasRenderingContext2D, w: number, h: number, dpr: number, family: string) {
  const copy = stages
    .map((s) => `${s.word}. ${s.note} ${s.detail}`)
    .join(" ")
    .split(" ");
  const size = Math.max(14, Math.min(19, w / 80)) * dpr;
  const lead = size * 1.9;
  const spreadW = Math.min(w * 0.8, h * 1.7) * dpr;
  const gutter = spreadW * 0.08;
  const colW = (spreadW - gutter) / 2;
  const left = (w * dpr - spreadW) / 2;
  const top = h * dpr * 0.14;
  const bottom = h * dpr * 0.86;

  ctx.fillStyle = SPREAD_INK;
  ctx.textBaseline = "alphabetic";
  let word = 0;
  for (let col = 0; col < 2; col++) {
    const x0 = left + col * (colW + gutter);
    // Running head and folio.
    ctx.font = `italic 400 ${size * 0.8}px ${family}`;
    ctx.textAlign = "center";
    ctx.fillText(col === 0 ? "Publish Your Book" : "Chapter one", x0 + colW / 2, top);
    ctx.fillText(String(col + 12), x0 + colW / 2, bottom + lead);
    ctx.textAlign = "left";
    ctx.font = `400 ${size}px ${family}`;
    for (let y = top + lead * 1.6; y < bottom; y += lead) {
      let line = "";
      for (;;) {
        const next = copy[word % copy.length];
        const test = line ? `${line} ${next}` : next;
        if (ctx.measureText(test).width > colW && line) break;
        line = test;
        word++;
      }
      // Justify every line by spreading the spare width over the spaces.
      const gaps = line.split(" ");
      const spare = colW - ctx.measureText(line).width;
      const per = gaps.length > 1 ? spare / (gaps.length - 1) : 0;
      let x = x0;
      for (const g of gaps) {
        ctx.fillText(g, x, y);
        x += ctx.measureText(`${g} `).width + per;
      }
    }
  }

  // Thin the type behind the headline, so the page is felt at the edges and
  // the headline reads on clean paper.
  const cx = (w * dpr) / 2;
  const cy = h * dpr * 0.45;
  const clear = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * dpr * 0.42);
  clear.addColorStop(0, "rgba(0,0,0,0.75)");
  clear.addColorStop(1, "rgba(0,0,0,0)");
  ctx.globalCompositeOperation = "destination-out";
  ctx.fillStyle = clear;
  ctx.fillRect(0, 0, w * dpr, h * dpr);
  ctx.globalCompositeOperation = "source-over";
}

/* ---- WebGL plumbing ------------------------------------------------------- */

function program(gl: WebGL2RenderingContext, frag: string) {
  const make = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) ?? "shader");
    return s;
  };
  const p = gl.createProgram()!;
  gl.attachShader(p, make(gl.VERTEX_SHADER, VERT));
  gl.attachShader(p, make(gl.FRAGMENT_SHADER, frag));
  gl.bindAttribLocation(p, 0, "a_pos");
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p) ?? "link");
  const u = (name: string) => gl.getUniformLocation(p, name);
  return { p, u };
}

function simTarget(gl: WebGL2RenderingContext, w: number, h: number) {
  const tex = gl.createTexture()!;
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RG16F, w, h, 0, gl.RG, gl.HALF_FLOAT, null);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  const fb = gl.createFramebuffer()!;
  gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  const ok = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  return { tex, fb, ok };
}

export function RippleField() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const frame = canvas?.parentElement;
    if (!canvas || !frame) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const gl = canvas.getContext("webgl2", { alpha: true, premultipliedAlpha: true, antialias: false });
    if (!gl || !gl.getExtension("EXT_color_buffer_float")) return;

    let sim: ReturnType<typeof program>;
    let show: ReturnType<typeof program>;
    try {
      sim = program(gl, SIM);
      show = program(gl, SHOW);
    } catch {
      return;
    }

    const tri = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, tri);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    const image = gl.createTexture();
    const picture = document.createElement("canvas");

    let targets: ReturnType<typeof simTarget>[] = [];
    let simW = 1;
    let simH = 1;
    let aspect: [number, number] = [1, 1];
    let ready = false;
    let disposed = false;

    /* Input state, in uv (y up) and aspect units per second. */
    const mouse = { x: 0.5, y: 0.5, vx: 0, vy: 0, t: 0 };
    let hover = 0;
    let hoverTarget = 0;
    let down = 0;
    let downTarget = 0;
    const clicks: { x: number; y: number; age: number }[] = [];
    let lastInput = 0;
    let visible = true;
    let raf = 0;
    let last = 0;
    let cur = 0;

    const build = async () => {
      const w = frame.clientWidth;
      const h = frame.clientHeight;
      if (!w || !h) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      picture.width = canvas.width;
      picture.height = canvas.height;
      aspect = [w / Math.sqrt(w * h), h / Math.sqrt(w * h)];

      await document.fonts.ready;
      if (disposed) return;

      const ctx = picture.getContext("2d")!;
      ctx.clearRect(0, 0, picture.width, picture.height);
      const family = getComputedStyle(frame.querySelector("h1") ?? frame).fontFamily;
      drawSpread(ctx, w, h, dpr, family);

      gl.bindTexture(gl.TEXTURE_2D, image);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, picture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

      targets.forEach((t) => {
        gl.deleteTexture(t.tex);
        gl.deleteFramebuffer(t.fb);
      });
      simW = Math.max(2, Math.round(aspect[0] * SIM_DETAIL));
      simH = Math.max(2, Math.round(aspect[1] * SIM_DETAIL));
      targets = [simTarget(gl, simW, simH), simTarget(gl, simW, simH)];
      if (!targets.every((t) => t.ok)) {
        teardown();
        return;
      }

      draw(0);
      if (!ready) {
        ready = true;
        canvas.style.opacity = "1";
      }
    };

    const draw = (dt: number) => {
      // 1. Advance the wave.
      const src = targets[cur];
      const dst = targets[1 - cur];
      gl.bindFramebuffer(gl.FRAMEBUFFER, dst.fb);
      gl.viewport(0, 0, simW, simH);
      gl.useProgram(sim.p);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, src.tex);
      gl.uniform1i(sim.u("u_prev"), 0);
      gl.uniform2f(sim.u("u_px"), 1 / simW, 1 / simH);
      gl.uniform2f(sim.u("u_aspect"), aspect[0], aspect[1]);
      gl.uniform4f(sim.u("u_mouse"), mouse.x, mouse.y, mouse.vx, mouse.vy);
      gl.uniform1f(sim.u("u_hover"), hover);
      gl.uniform1f(sim.u("u_down"), down);
      gl.uniform1f(sim.u("u_dt"), dt);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      cur = 1 - cur;

      // 2. Draw the picture through it.
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.useProgram(show.p);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, image);
      gl.uniform1i(show.u("u_image"), 0);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, targets[cur].tex);
      gl.uniform1i(show.u("u_sim"), 1);
      gl.uniform2f(show.u("u_px"), 1 / simW, 1 / simH);
      gl.uniform2f(show.u("u_aspect"), aspect[0], aspect[1]);
      const packed = new Float32Array(CLICKS * 3).fill(-1);
      clicks.forEach((c, i) => packed.set([c.x, c.y, c.age], i * 3));
      gl.uniform3fv(show.u("u_clicks"), packed);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const tick = (now: number) => {
      raf = 0;
      if (!ready || !visible || document.hidden) return;
      const dt = Math.min(0.05, last ? (now - last) / 1000 : 1 / 60);
      last = now;
      // Ease the inputs the way orionix's springs do, and let velocity die
      // away when the pointer stops.
      hover += (hoverTarget - hover) * Math.min(1, dt * 10);
      down += (downTarget - down) * Math.min(1, dt * 12);
      const fade = Math.pow(0.001, dt);
      mouse.vx *= fade;
      mouse.vy *= fade;
      for (let i = clicks.length - 1; i >= 0; i--) {
        clicks[i].age += dt;
        if (clicks[i].age > CLICK_LIFE) clicks.splice(i, 1);
      }
      draw(dt);
      if (clicks.length || performance.now() - lastInput < SLEEP_MS) raf = requestAnimationFrame(tick);
      else last = 0;
    };
    const wake = () => {
      lastInput = performance.now();
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const toUv = (e: PointerEvent) => {
      const r = frame.getBoundingClientRect();
      return { x: (e.clientX - r.left) / r.width, y: 1 - (e.clientY - r.top) / r.height };
    };
    const onMove = (e: PointerEvent) => {
      const p = toUv(e);
      const now = e.timeStamp;
      const dt = Math.max(1, now - mouse.t) / 1000;
      if (mouse.t && dt < 0.1) {
        const vx = ((p.x - mouse.x) * aspect[0]) / dt;
        const vy = ((p.y - mouse.y) * aspect[1]) / dt;
        mouse.vx += (vx - mouse.vx) * 0.5;
        mouse.vy += (vy - mouse.vy) * 0.5;
      }
      mouse.x = p.x;
      mouse.y = p.y;
      mouse.t = now;
      hoverTarget = 1;
      wake();
    };
    const onDown = (e: PointerEvent) => {
      const p = toUv(e);
      mouse.x = p.x;
      mouse.y = p.y;
      downTarget = 1;
      if (clicks.length >= CLICKS) clicks.shift();
      clicks.push({ x: p.x, y: p.y, age: 0 });
      wake();
    };
    const onUp = () => {
      downTarget = 0;
      wake();
    };
    const onLeave = () => {
      hoverTarget = 0;
      downTarget = 0;
      mouse.t = 0;
      wake();
    };

    frame.addEventListener("pointermove", onMove);
    frame.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    frame.addEventListener("pointerleave", onLeave);

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) wake();
    });
    io.observe(frame);

    let resizeTimer = 0;
    const ro = new ResizeObserver(() => {
      clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => void build(), 150);
    });
    ro.observe(frame);

    const onLost = (e: Event) => {
      e.preventDefault();
      teardown();
    };
    canvas.addEventListener("webglcontextlost", onLost);

    void build();

    /** Stop everything and fade the surface out. */
    function teardown() {
      if (disposed) return;
      disposed = true;
      cancelAnimationFrame(raf);
      clearTimeout(resizeTimer);
      io.disconnect();
      ro.disconnect();
      frame!.removeEventListener("pointermove", onMove);
      frame!.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      frame!.removeEventListener("pointerleave", onLeave);
      canvas!.removeEventListener("webglcontextlost", onLost);
      canvas!.style.opacity = "0";
    }

    return teardown;
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 size-full opacity-0 transition-opacity duration-700"
    />
  );
}
