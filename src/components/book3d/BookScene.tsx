"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { buildTextures, type BookTextures } from "./pageTextures";

/*
 * The book as real geometry — the SOURCE of the homepage intro video.
 *
 * The site no longer runs this live. The intro studio (app/dev/intro-studio,
 * development only) drives it frame by frame and encodes the result as
 * video: see docs/INTERACTIONS.md §1 and scripts/render-intro.mjs. Change the
 * book here, then re-render the video.
 *
 * The book as real geometry.
 *
 * Each sheet is a subdivided plane hinged on the spine (x = 0). The turn is
 * done in a VERTEX SHADER rather than by rotating the mesh: the rotation angle
 * grows along the page, so the sheet curls as it lifts instead of staying a
 * flat board. The shader is patched into MeshStandardMaterial with
 * onBeforeCompile, so the bent page keeps normal lighting — writing the shader
 * from scratch would mean reimplementing all of it.
 *
 * Both faces live on one double-sided mesh: the fragment shader picks front or
 * back from gl_FrontFacing, with the back mirrored in u so its text reads the
 * right way round once turned.
 *
 * The meshes are built imperatively and added to a group, not described in
 * JSX. A scene like this is mutated every frame (uniforms, rotations), and
 * React's rules rightly forbid mutating values created during render — so the
 * sheets live outside React entirely and are reached through a ref.
 */

export const PAGE_W = 1;
export const PAGE_H = 1.317; // matches the old 410 x 540 page proportions
const LEAF_GAP = 0.004; // sheet separation on Z: the closed book's thickness

/** Resting state, mirroring the CSS book it replaces. */
const REST = { scale: 0.78, rotX: 0.2, rotY: -0.48, rotZ: -0.03 };
const OPEN = { scale: 1, rotX: 0.1, rotY: -0.1, rotZ: 0 };

/* The camera is pulled in until the book fills the screen, because it is the
 * only thing on it. Two distances: one framing the CLOSED book (half a spread
 * wide) and one framing the OPEN spread, blended as it opens. A single fixed
 * distance either wasted most of the screen when closed, or — on a phone, where
 * the screen is portrait and the spread is landscape — let the open spread run
 * off both edges. */
/* Leaves room for the intro's own furniture: Skip at the top, the label and
   progress bar along the bottom. */
const MARGIN = 1.26;
const HALF_SPREAD_W = PAGE_W * 1.02;
const HALF_CLOSED_W = PAGE_W * 0.58;
const HALF_H = PAGE_H / 2 + 0.04;

function fitDistance(fovDeg: number, aspect: number, halfW: number) {
  const t = Math.tan((fovDeg * Math.PI) / 360);
  return Math.max(HALF_H / t, halfW / (t * aspect)) * MARGIN;
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

type Uniforms = { uP: { value: number }; uW: { value: number }; uCurl: { value: number } };
/* A sheet knows where it sits in BOTH stacks. Turning does not just rotate a
 * page, it moves it from the right-hand stack to the left-hand one, and the
 * page that turned last must end up on TOP of the left pile — nearest the
 * reader. Without this the turned pages kept their original depth, which put
 * them behind the opened cover, so the left page never changed. */
type Sheet = { mesh: THREE.Mesh; uniforms: Uniforms; zRight: number; zLeft: number };

/**
 * One sheet: a plane, two textures, bent by the shader.
 * `curl` is how far the page bows mid-turn — boards barely bow, paper does.
 */
function makeSheet(
  front: THREE.Texture,
  back: THREE.Texture,
  curl: number,
  segments: number,
  zRight: number,
  zLeft: number,
): Sheet {
  const geometry = new THREE.PlaneGeometry(PAGE_W, PAGE_H, segments, 2);
  geometry.translate(PAGE_W / 2, 0, 0); // hinge on the spine, not the centre

  const uniforms: Uniforms = { uP: { value: 0 }, uW: { value: PAGE_W }, uCurl: { value: curl } };

  const material = new THREE.MeshStandardMaterial({
    map: front,
    side: THREE.DoubleSide,
    roughness: 0.92,
    metalness: 0,
  });

  material.onBeforeCompile = (shader) => {
    shader.uniforms.uP = uniforms.uP;
    shader.uniforms.uW = uniforms.uW;
    shader.uniforms.uCurl = uniforms.uCurl;
    shader.uniforms.uBack = { value: back };

    shader.vertexShader = shader.vertexShader
      .replace(
        "#include <common>",
        `#include <common>
         uniform float uP; uniform float uW; uniform float uCurl;
         /* The page bows TOWARDS the reader as it lifts: the middle of the
            sheet is rotated LESS than its hinge, so it stays turned to the
            eye instead of going edge-on. Rotating the middle further (a plus
            here) put most of the page at ~90 degrees mid-turn and the turn
            all but vanished. The bow peaks mid-page and mid-turn, and is zero
            at both ends, so the page lands perfectly flat. */
         float sheetAngle(float x) {
           float t = clamp(x / uW, 0.0, 1.0);
           return uP * PI - uCurl * sin(PI * t) * sin(PI * uP);
         }`,
      )
      .replace(
        "#include <beginnormal_vertex>",
        `#include <beginnormal_vertex>
         {
           /* Rotate the normal the same way as the position below, so the lit
              side of the paper follows the page as it lifts. */
           float a = sheetAngle(position.x);
           float c = cos(a); float s = sin(a);
           objectNormal = vec3(
             objectNormal.x * c - objectNormal.z * s,
             objectNormal.y,
             objectNormal.x * s + objectNormal.z * c
           );
         }`,
      )
      .replace(
        "#include <begin_vertex>",
        `#include <begin_vertex>
         {
           /* +z, not -z: the page arcs TOWARDS the reader as it turns, the way
              a real page lifts off the spine. Sending it the other way swung it
              behind the unturned pages — the sheets are only 0.004 apart, and
              the turn displaced it 0.3 — so the turning page was hidden by the
              stack and the turn was invisible from the front. */
           float a = sheetAngle(transformed.x);
           float c = cos(a); float s = sin(a);
           transformed = vec3(transformed.x * c, transformed.y, transformed.x * s);
         }`,
      );

    shader.fragmentShader = shader.fragmentShader
      .replace("#include <common>", `#include <common>\n uniform sampler2D uBack;`)
      .replace(
        "#include <map_fragment>",
        `{
           // Which face you are looking at decides which side of the paper you read.
           vec4 sampled = gl_FrontFacing
             ? texture2D(map, vMapUv)
             : texture2D(uBack, vec2(1.0 - vMapUv.x, vMapUv.y));
           diffuseColor *= sampled;
         }`,
      );
  };

  /* ONE program for every sheet. onBeforeCompile runs per material, and three
     keeps each material's own uniforms (uP, uCurl, uBack) even when the
     compiled program is shared — so the sheets still turn independently.
     They used to carry a key per sheet (`sheet-${id}`), which compiled the
     same shader nine times over: ~4.5s of frozen main thread before the book
     could first appear. The key must stay constant, never per call. */
  material.customProgramCacheKey = () => "book-sheet";

  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.z = zRight;
  return { mesh, uniforms, zRight, zLeft };
}

export type BookParts = {
  leaves: Sheet[];
  cover: Sheet;
  back: Sheet;
  textures: BookTextures;
  dispose: () => void;
};

export function buildBook(maxAniso: number): BookParts {
  const textures = buildTextures(maxAniso);
  const n = textures.leaves.length;
  /* Right stack (unturned), front to back: cover, leaf 0 … leaf n-1, back board.
     Left stack (turned), nearest the reader first: leaf n-1 … leaf 0, cover —
     the cover turned first, so it lies at the bottom of that pile. */
  const leaves = textures.leaves.map((l, i) =>
    makeSheet(l.front, l.back, 0.55, 40, -(i + 1) * LEAF_GAP, -(n - i) * LEAF_GAP),
  );
  const cover = makeSheet(
    textures.coverFront,
    textures.coverInside,
    0.16,
    16,
    LEAF_GAP,
    -(n + 1) * LEAF_GAP,
  );
  const back = makeSheet(
    textures.backInside,
    textures.backOutside,
    0.16,
    16,
    -(n + 1) * LEAF_GAP,
    -(n + 1) * LEAF_GAP,
  );

  /* No solid "page block" for bulk: a box spanning the sheets' own z range
     enclosed them, so the whole right-hand page — and every page mid-turn —
     was hidden inside it. The stacked sheets give the edge its thickness. */
  const all = [...leaves, cover, back];
  return {
    leaves,
    cover,
    back,
    textures,
    dispose: () => {
      all.forEach((s) => {
        s.mesh.geometry.dispose();
        (s.mesh.material as THREE.Material).dispose();
      });
      textures.dispose();
    },
  };
}

/** The entrance: how the closed book arrives before it opens. At enter = 0
 *  it sits lower, turned further away and slightly smaller; it rises and
 *  settles into its resting pose by enter = 1. */
const ENTRANCE = { y: -0.14, rotY: -0.16, rotX: 0.06, scale: 0.93 };

/**
 * `flow`: 0 closed, 1 open, 1+n after leaf n, one more to close.
 * `enter`: 0..1, the entrance (defaults to 1, already arrived).
 * `onReady` fires once the book is built and its shader compiled — the caller
 * owns the frame loop (the studio renders frame by frame).
 */
export function BookScene({
  flow,
  enter,
  onReady,
}: {
  flow: React.RefObject<number>;
  enter?: React.RefObject<number>;
  onReady?: () => void;
}) {
  const { gl, camera, size, scene } = useThree();
  const readyCb = useRef(onReady);
  useEffect(() => {
    readyCb.current = onReady;
  }, [onReady]);
  const bookRef = useRef<THREE.Group>(null);
  const spreadRef = useRef<THREE.Group>(null);
  const parts = useRef<BookParts | null>(null);
  const fit = useRef({ closed: 4.2, open: 4.2 });

  /* Reframed whenever the canvas resizes, including a phone turning sideways. */
  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    const aspect = size.width / Math.max(1, size.height);
    fit.current = {
      closed: fitDistance(cam.fov, aspect, HALF_CLOSED_W),
      open: fitDistance(cam.fov, aspect, HALF_SPREAD_W),
    };
  }, [camera, size]);

  useEffect(() => {
    const bookGroup = bookRef.current;
    const spreadGroup = spreadRef.current;
    if (!bookGroup || !spreadGroup) return;

    const built = buildBook(gl.capabilities.getMaxAnisotropy?.() ?? 1);
    // Back to front: back board, leaves, front cover.
    spreadGroup.add(built.back.mesh);
    built.leaves.forEach((l) => spreadGroup.add(l.mesh));
    spreadGroup.add(built.cover.mesh);
    parts.current = built;

    /* Compile before the first frame (in parallel where the browser allows
     * it), so no frame ever blocks on a synchronous compile. */
    let live = true;
    gl.compileAsync(scene, camera)
      .catch(() => undefined)
      .then(() => live && readyCb.current?.());

    return () => {
      live = false;
      spreadGroup.remove(built.back.mesh, built.cover.mesh, ...built.leaves.map((l) => l.mesh));
      built.dispose();
      parts.current = null;
    };
  }, [gl, scene, camera]);

  useFrame((state) => {
    const built = parts.current;
    const bookGroup = bookRef.current;
    const spreadGroup = spreadRef.current;
    if (!built || !bookGroup || !spreadGroup) return;

    const f = flow.current ?? 0;
    const leafCount = built.leaves.length;
    const open = clamp01(f);
    const close = clamp01(f - (1 + leafCount));

    /* Closing: the cover and every turned leaf come back as one slab while the
     * book turns over, so it reads as one movement rather than a seventh page
     * turn. The back board never turns at all. */
    const shut = 1 - close;
    const place = (sheet: Sheet, p: number) => {
      sheet.uniforms.uP.value = p;
      // Travel between the two stacks with the turn, so a turned page lands on
      // top of the left pile instead of behind the cover.
      sheet.mesh.position.z = lerp(sheet.zRight, sheet.zLeft, p);
    };
    place(built.cover, open * shut);
    built.leaves.forEach((leaf, i) => place(leaf, clamp01(f - 1 - i) * shut));
    built.back.uniforms.uP.value = 0;

    /* Closing is now ONE movement: the covers shut and the book turns over to
     * show its back. It used to shrink back to resting size afterwards as well,
     * which read as an extra effect tacked on after the book had already
     * closed. Size and tilt now depend only on how open it is. */
    bookGroup.scale.setScalar(lerp(REST.scale, OPEN.scale, open));
    bookGroup.rotation.x = lerp(REST.rotX, OPEN.rotX, open);
    bookGroup.rotation.z = lerp(REST.rotZ, OPEN.rotZ, open);
    // + PI on close: the book turns over to land back cover up.
    bookGroup.rotation.y = lerp(REST.rotY, OPEN.rotY, open) + close * Math.PI;

    // The entrance, layered on top: nothing at enter = 1.
    const away = 1 - clamp01(enter?.current ?? 1);
    bookGroup.position.y = ENTRANCE.y * away;
    bookGroup.rotation.y += ENTRANCE.rotY * away;
    bookGroup.rotation.x += ENTRANCE.rotX * away;
    bookGroup.scale.multiplyScalar(lerp(1, ENTRANCE.scale, away));

    // The frame state's camera, not the one captured during render: values
    // created in render must not be mutated.
    state.camera.position.z = lerp(fit.current.closed, fit.current.open, open);

    /* A closed book fills only the right half of the spread, so it needs a
     * shift to sit centred. The turn mirrors X, so the shift inverts. */
    /* Back to the same offset it had when closed at the start — NOT mirrored.
     * Turning the book over already mirrors X, so a mirrored offset on top of
     * it counted twice and the closed book slid half out of frame. */
    spreadGroup.position.x = lerp(lerp(-PAGE_W / 2, 0, open), -PAGE_W / 2, close);
  });

  return (
    <group ref={bookRef}>
      <group ref={spreadRef} />
    </group>
  );
}
