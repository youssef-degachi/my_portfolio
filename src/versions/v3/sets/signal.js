import * as THREE from "three";
import { cloud, WHITE, ICE, HOT, TAU, R } from "../shapes";

/** Set 2: the work as lines. Waveform, open book, endless knot, wall of windows, stacked layers, ringing sphere. */

/** Andalib AI: a voice, drawn as layered waveforms. */
function voice(n) {
  const LINES = 26;
  return cloud(n, (v, c, i) => {
    const line = i % LINES; const u = line / (LINES - 1); const mid = 1 - Math.abs(u - .5) * 2;
    const x = (R() + R() - 1) * 3.3;
    const env = Math.exp(-x * x * .38) * (.3 + mid * .95);
    const y = env * 1.9 * (Math.sin(x * 3 + u * 3.4) * .68 + Math.sin(x * 7.1 - u * 6) * .32);
    v.set(x, y, (u - .5) * 1.5);
    if (line === 12 || line === 13) c.copy(HOT);
    else c.copy(ICE).lerp(WHITE, Math.min(1, Math.abs(y) * .9 + mid * .25));
  });
}

/** JeridSchool: an open book, its pages lifting off. */
function school(n) {
  const tilt = new THREE.Euler(.62, 0, 0);
  return cloud(n, (v, c) => {
    if (R() < .2) { // pages mid-turn
      const a = [.42, .78, 1.14][Math.floor(R() * 3)]; // all falling to the right, so none stands edge-on
      const s = R(); const reach = s * 2.2;
      v.set(.1 + Math.cos(a) * reach, .3 + Math.sin(a) * reach - s * s * .4, (R() * 2 - 1) * 1.5);
      c.copy(HOT).lerp(WHITE, s * .35);
    } else {
      const side = R() < .5 ? -1 : 1;
      const k = Math.floor(R() * 13) / 12; // one layer of paper
      const s = R();
      const w = R() < .4 ? (R() < .5 ? -1 : 1) : R() * 2 - 1; // bright page edges
      const y = .62 * Math.sin(Math.PI * Math.pow(s, .72)) * (1 - k * .82) - k * .62;
      v.set(side * (.08 + s * 2.4), y, w * 1.5);
      c.copy(ICE).lerp(WHITE, 1 - k * .75);
    }
    v.y -= .35;
    v.applyEuler(tilt).multiplyScalar(.86);
  });
}

/** NEXT Vision: automation as an endless loop, with work moving through it. */
function flow(n) {
  const at = (t, out) => { const r = (Math.cos(3 * t) + 2.1) * .86; return out.set(r * Math.cos(2 * t), r * Math.sin(2 * t), -Math.sin(3 * t) * .92); };
  const a = new THREE.Vector3(); const b = new THREE.Vector3(); const nrm = new THREE.Vector3(); const bin = new THREE.Vector3();
  return cloud(n, (v, c, i) => {
    const t = R() * TAU;
    at(t, v); at(t + .004, a); at(t - .004, b);
    a.sub(b).normalize();
    nrm.copy(v).normalize();
    bin.crossVectors(a, nrm).normalize();
    nrm.crossVectors(bin, a);
    const phi = ((i % 10) / 10) * TAU + t * 4;
    v.addScaledVector(nrm, Math.cos(phi) * .26).addScaledVector(bin, Math.sin(phi) * .26);
    if (Math.sin(t * 7) > .9) c.copy(HOT);
    else c.copy(ICE).lerp(WHITE, (Math.cos(phi) + 1) * .5);
  });
}

/** Project gallery: 30 small windows on one rippling wall. */
function gallery(n) {
  const COLS = 6; const ROWS = 5; const W = .86; const H = .58; const GAP = .13;
  return cloud(n, (v, c, i) => {
    const col = i % COLS; const row = Math.floor(i / COLS) % ROWS;
    const seed = (row * 7 + col * 3) % 5;
    const pick = R();
    let x; let y;
    if (pick < .46) { // frame
      const e = R() * 2 * (W + H);
      if (e < W) { x = e - W / 2; y = H / 2; } else if (e < W + H) { x = W / 2; y = H / 2 - (e - W); } else if (e < 2 * W + H) { x = W / 2 - (e - W - H); y = -H / 2; } else { x = -W / 2; y = -H / 2 + (e - 2 * W - H); }
    } else if (pick < .62) { // title bar
      x = (R() - .5) * W; y = H / 2 - R() * H * .13;
    } else if (pick < .86) { // picture block
      const left = seed % 2 === 0;
      x = (left ? -W / 2 + .06 : .04) + R() * (W / 2 - .1); y = -H / 2 + .07 + R() * (H * .62);
    } else { // text lines
      const l = Math.floor(R() * 3);
      x = (seed % 2 === 0 ? .04 : -W / 2 + .06) + R() * (W / 2 - .1) * (1 - l * .2); y = H * .16 - l * .12;
    }
    const X = (col - (COLS - 1) / 2) * (W + GAP); const Y = ((ROWS - 1) / 2 - row) * (H + GAP);
    const wx = X + x; const wy = Y + y;
    v.set(wx, wy, -wx * wx * .08 + Math.sin(wx * 1.15 + wy * 1.3) * .2);
    if ((row * COLS + col) % 7 === 3) c.copy(HOT);
    else c.copy(ICE).lerp(WHITE, pick < .62 ? 1 : .35);
  });
}

/** Private client systems: an ERP seen as what it is, layers of a business wired together. */
function systems(n) {
  const iso = new THREE.Euler(.6, Math.PI / 4, 0, "XYZ");
  const LEVELS = 4; const S = 1.5; const STEP = .92;
  const MODULES = [[[-.8, -.8], [.3, -.8], [-.8, .3]], [[.3, .3], [-.8, .3]], [[-.8, -.8], [.3, .3], [.3, -.8]], [[-.25, -.25]]];
  return cloud(n, (v, c, i) => {
    const level = i % LEVELS; const h = (level - (LEVELS - 1) / 2) * STEP;
    const pick = R();
    if (pick < .12) { // data rising between layers
      const [a, b] = [[0, 0], [S, S], [-S, S], [S, -S], [-S, -S]][Math.floor(R() * 5)];
      v.set(a, (R() - .5) * STEP * (LEVELS - 1), b);
      if (a === 0) c.copy(HOT); else c.copy(ICE).multiplyScalar(.5);
    } else if (pick < .42) { // plate edge
      const e = R() * 4; const f = (e % 1) * 2 * S - S;
      if (e < 1) v.set(f, h, -S); else if (e < 2) v.set(S, h, f); else if (e < 3) v.set(-f, h, S); else v.set(-S, h, -f);
      c.copy(WHITE);
    } else if (pick < .72) { // grid on the plate
      const line = (Math.floor(R() * 9) / 8) * 2 * S - S; const along = (R() * 2 - 1) * S;
      if (R() < .5) v.set(line, h, along); else v.set(along, h, line);
      c.copy(ICE).multiplyScalar(.75);
    } else { // modules sitting on the plate
      const set = MODULES[level]; const [mx, mz] = set[Math.floor(R() * set.length)];
      v.set(mx + R() * .5, h + R() * .16, mz + R() * .5);
      c.copy(level === LEVELS - 1 ? HOT : WHITE);
    }
    v.applyEuler(iso);
  });
}

/** The call: a sphere of points sending rings out. */
function signal(n) {
  const golden = Math.PI * (3 - Math.sqrt(5));
  return cloud(n, (v, c, i) => {
    if (i % 10 < 7) {
      const y = 1 - ((i + .5) / n) * 2; const r = Math.sqrt(1 - y * y); const a = i * golden;
      v.set(Math.cos(a) * r, y, Math.sin(a) * r).multiplyScalar(1.62);
      c.copy(ICE).lerp(WHITE, (y + 1) / 2);
    } else {
      const ring = i % 3; const a = R() * TAU; const r = 2.05 + ring * .42 + (R() - .5) * .02;
      v.set(Math.cos(a) * r, Math.sin(a) * r, 0);
      c.copy(HOT).multiplyScalar(1 - ring * .28);
    }
  });
}

export const build = (n) => [voice(n), school(n), flow(n), gallery(n), systems(n), signal(n)];
