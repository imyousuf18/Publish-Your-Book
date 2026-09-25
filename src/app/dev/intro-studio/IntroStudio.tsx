"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { BookScene } from "@/components/book3d/BookScene";
import { ensureFonts } from "@/components/book3d/pageTextures";
import { INTRO_TIMELINE } from "@/lib/intro";
import { stages } from "@/lib/site";

/*
 * The intro studio: the 3D book, rendered one frame at a time and encoded as
 * video in the browser (WebCodecs, muxed by mediabunny). Nothing here is
 * real-time — every frame is set exactly, rendered, then captured — so the
 * video is identical however slow the machine.
 *
 * scripts/render-intro.mjs opens this page in headless Chrome at each
 * variant's size and calls window.__studio. The canvas fills the window, so
 * the book is framed for that aspect ratio exactly as the live scene would be.
 */

const FLOW_MAX = stages.length + 2;

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOutQuad = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

/** Where the book is at time t (seconds) — the whole choreography. */
function pose(t: number) {
  const { enter, hold, play } = INTRO_TIMELINE;
  return {
    enter: easeOutCubic(clamp01(t / enter)),
    flow: easeInOutQuad(clamp01((t - enter - hold) / play)) * FLOW_MAX,
  };
}

type Studio = {
  /** Encode the intro. Resolves to the file as base64. */
  render: (opts: { container: "webm" | "mp4"; codec: string; fps: number; bitrate: number }) => Promise<string>;
  /** Frame 0 as a WebP still, base64. */
  poster: () => Promise<string>;
  /** Which codecs this browser can encode at the canvas size. */
  codecs: () => Promise<Record<string, boolean>>;
};

declare global {
  interface Window {
    __studio?: Studio;
    __studioReady?: boolean;
  }
}

function Driver({ flowRef, enterRef }: { flowRef: React.RefObject<number>; enterRef: React.RefObject<number> }) {
  const { gl, advance } = useThree();

  const frame = useCallback(
    (t: number) => {
      const p = pose(t);
      flowRef.current = p.flow;
      enterRef.current = p.enter;
      advance(t * 1000);
    },
    [advance, flowRef, enterRef],
  );

  useEffect(() => {
    const canvas = gl.domElement;
    const b64 = (buf: ArrayBuffer) => {
      let s = "";
      const bytes = new Uint8Array(buf);
      for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
      return btoa(s);
    };

    window.__studio = {
      async codecs() {
        const { canEncodeVideo } = await import("mediabunny");
        const out: Record<string, boolean> = {};
        for (const c of ["vp9", "avc", "av1", "hevc"] as const)
          out[c] = await canEncodeVideo(c, { width: canvas.width, height: canvas.height });
        return out;
      },
      async poster() {
        frame(0);
        const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/webp", 0.92));
        return b64(await blob!.arrayBuffer());
      },
      async render({ container, codec, fps, bitrate }) {
        const mb = await import("mediabunny");
        const format = container === "webm" ? new mb.WebMOutputFormat() : new mb.Mp4OutputFormat({ fastStart: "in-memory" });
        const output = new mb.Output({ format, target: new mb.BufferTarget() });
        const source = new mb.CanvasSource(canvas, {
          codec: codec as "vp9" | "avc",
          bitrate,
          keyFrameInterval: 1,
        });
        output.addVideoTrack(source, { frameRate: fps });
        await output.start();
        const total = Math.round(INTRO_TIMELINE.total * fps);
        for (let i = 0; i < total; i++) {
          frame(i / fps);
          await source.add(i / fps, 1 / fps);
        }
        await output.finalize();
        return b64((output.target as InstanceType<typeof mb.BufferTarget>).buffer!);
      },
    };
    // Two warm-up frames: texture upload and first draw happen here, not in
    // the first encoded frame.
    frame(0);
    frame(0);
    window.__studioReady = true;
  }, [gl, frame]);

  return null;
}

export function IntroStudio() {
  const flow = useRef(0);
  const enter = useRef(0);
  const [fonts, setFonts] = useState(false);
  const [compiled, setCompiled] = useState(false);

  useEffect(() => {
    ensureFonts().then(() => setFonts(true));
  }, []);

  return (
    <div className="fixed inset-0 z-[9999]" style={{ background: "var(--color-inverse)" }}>
      {fonts && (
        <Canvas
          frameloop="never"
          dpr={1}
          camera={{ fov: 32, position: [0, 0, 4.2], near: 0.1, far: 20 }}
          gl={{ antialias: true, alpha: false, preserveDrawingBuffer: true }}
          onCreated={({ gl }) => {
            gl.toneMapping = THREE.ACESFilmicToneMapping;
            gl.toneMappingExposure = 1.15;
            const bg = getComputedStyle(document.documentElement).getPropertyValue("--color-inverse").trim();
            gl.setClearColor(new THREE.Color(bg || "#1d1e22"), 1);
          }}
          style={{ position: "absolute", inset: 0 }}
        >
          {/* The same lights as the live book had. */}
          <ambientLight intensity={1.15} />
          <directionalLight position={[-2.4, 3.2, 3.4]} intensity={2.6} color="#fff3e2" />
          <directionalLight position={[3.2, -1.4, 2.2]} intensity={0.55} color="#cfd8ff" />
          <BookScene flow={flow} enter={enter} onReady={() => setCompiled(true)} />
          {compiled && <Driver flowRef={flow} enterRef={enter} />}
        </Canvas>
      )}
    </div>
  );
}
