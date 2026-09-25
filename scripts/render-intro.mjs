// Render the homepage intro video from the 3D book.
//
//   1. npm run dev                 (the studio route only exists in development)
//   2. node scripts/render-intro.mjs [--base http://localhost:3000]
//
// Opens app/dev/intro-studio in headless Chrome at each cut's size, renders
// every frame of the choreography in src/lib/intro.ts, encodes it in the
// browser (WebCodecs) and writes:
//   public/videos/intro-{landscape,portrait}.{webm,mp4}
//   public/images/intro/intro-{landscape,portrait}.webp   (frame 0, the still)
//
// Chrome is found at CHROME_PATH, or the usual Windows install path.
import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const arg = (name, fallback) => {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 ? process.argv[i + 1] : fallback;
};
const BASE = arg("base", "http://localhost:3000");
const CHROME = process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe";
const FPS = Number(arg("fps", 60));

/* The two cuts, and the files each is encoded into. Bitrates are modest on
 * purpose: most of every frame is a flat dark ground. */
const CUTS = [
  { name: "landscape", width: 1920, height: 1080 },
  { name: "portrait", width: 1080, height: 1920 },
];
const ENCODES = [
  { ext: "webm", container: "webm", codec: "vp9", bitrate: Number(arg("webm-bitrate", 2_500_000)) },
  { ext: "mp4", container: "mp4", codec: "avc", bitrate: Number(arg("mp4-bitrate", 3_500_000)) },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function withChrome(fn) {
  const port = 9500 + Math.floor(Math.random() * 400);
  const chrome = spawn(CHROME, [
    "--headless=new",
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${join(process.env.TEMP || "/tmp", `intro-render-${Date.now()}`)}`,
    "--enable-gpu",
    "--ignore-gpu-blocklist",
    "--no-first-run",
    "about:blank",
  ]);
  try {
    let targets;
    for (let i = 0; i < 150 && !targets?.some((t) => t.type === "page"); i++) {
      try {
        targets = await (await fetch(`http://127.0.0.1:${port}/json`)).json();
      } catch {
        await sleep(200);
      }
    }
    const ws = new WebSocket(targets.find((t) => t.type === "page").webSocketDebuggerUrl);
    await new Promise((r) => ws.addEventListener("open", r));
    let id = 0;
    const pending = new Map();
    ws.addEventListener("message", (m) => {
      const d = JSON.parse(m.data);
      if (d.id && pending.has(d.id)) {
        pending.get(d.id)(d);
        pending.delete(d.id);
      }
    });
    const send = (method, params = {}) =>
      new Promise((r) => {
        const i = ++id;
        pending.set(i, r);
        ws.send(JSON.stringify({ id: i, method, params }));
      });
    const evaluate = async (expression) => {
      const r = await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
      if (r.result?.exceptionDetails) throw new Error(r.result.exceptionDetails.exception?.description ?? "evaluate failed");
      return r.result?.result?.value;
    };
    return await fn({ send, evaluate });
  } finally {
    chrome.kill();
  }
}

for (const cut of CUTS) {
  await withChrome(async ({ send, evaluate }) => {
    await send("Page.enable");
    await send("Emulation.setDeviceMetricsOverride", {
      width: cut.width,
      height: cut.height,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await send("Page.navigate", { url: `${BASE}/dev/intro-studio` });
    for (let i = 0; i < 600 && !(await evaluate("window.__studioReady === true").catch(() => false)); i++) await sleep(200);
    if (!(await evaluate("window.__studioReady === true"))) throw new Error(`studio never became ready (${cut.name})`);

    const codecs = await evaluate("window.__studio.codecs()");
    console.log(`${cut.name}: encodable`, codecs);

    const still = await evaluate("window.__studio.poster()");
    const stillPath = join(ROOT, "public/images/intro", `intro-${cut.name}.webp`);
    mkdirSync(dirname(stillPath), { recursive: true });
    writeFileSync(stillPath, Buffer.from(still, "base64"));
    console.log(`  still  ${stillPath}  ${Math.round(Buffer.from(still, "base64").length / 1024)} KB`);

    for (const enc of ENCODES) {
      if (!codecs[enc.codec]) {
        console.log(`  SKIP ${enc.ext}: this Chrome cannot encode ${enc.codec}`);
        continue;
      }
      const t0 = Date.now();
      const data = await evaluate(
        `window.__studio.render(${JSON.stringify({ container: enc.container, codec: enc.codec, fps: FPS, bitrate: enc.bitrate })})`,
      );
      const out = join(ROOT, "public/videos", `intro-${cut.name}.${enc.ext}`);
      mkdirSync(dirname(out), { recursive: true });
      writeFileSync(out, Buffer.from(data, "base64"));
      console.log(`  video  ${out}  ${Math.round(Buffer.from(data, "base64").length / 1024)} KB  (${Date.now() - t0} ms)`);
    }
  });
}
