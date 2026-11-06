import * as THREE from "three";
import { cloud, WHITE, ICE, HOT, TAU, R } from "../shapes";

/** Set 3: what the names mean. Sound made visible, the Jerid palm, an eye, a spiral of work, a city of data, a phone. */

/** Andalib AI: a Chladni figure, the pattern sand makes on a plate when a sound plays through it. */
function voice(n) {
  const f = (x, y) => Math.cos(3 * Math.PI * x) * Math.cos(7 * Math.PI * y) - Math.cos(7 * Math.PI * x) * Math.cos(3 * Math.PI * y);
  return cloud(n, (v, c) => {
    let x = 0; let y = 0;
    for (let t = 0; t < 60; t += 1) { // sand settles where the plate doesn't move
      x = R() * 2 - 1; y = R() * 2 - 1;
      if (Math.abs(f(x, y)) < .11) break;
    }
    const d = Math.hypot(x, y);
    v.set(x * 2.75, y * 2.75, Math.sin(d * 7) * .12);
    if (d < .3) c.copy(HOT); else c.copy(WHITE).lerp(ICE, Math.min(1, d * .85));
  });
}

/** JeridSchool: "jerid" is the palm frond, and Tozeur's oasis is made of them. */
function school(n) {
  const FRONDS = 15; const CROWN = new THREE.Vector3(.1, 1, 0);
  return cloud(n, (v, c, i) => {
    const pick = R();
    if (pick < .16) { // trunk, in rings
      const t = Math.floor(R() * 70) / 69; const a = R() * TAU; const r = .2 - t * .05;
      v.set(Math.cos(a) * r + (t * t - t) * -.5 + (t * .1), -2.5 + t * 3.5, Math.sin(a) * r);
      c.copy(ICE).multiplyScalar(.75);
    } else if (pick < .25) { // dates
      const a = Math.floor(R() * 5) * (TAU / 5); const r = Math.cbrt(R()) * .23; const u = R() * TAU; const w = R() * 2 - 1; const q = Math.sqrt(1 - w * w);
      v.set(CROWN.x + Math.cos(a) * .42 + Math.cos(u) * q * r, CROWN.y - .32 + w * r * 1.3, Math.sin(a) * .42 + Math.sin(u) * q * r);
      c.copy(HOT);
    } else { // one frond: a rising, drooping spine with leaflets hanging from it
      const k = i % FRONDS; const az = k * 2.399; const rise = .35 + ((k * 5) % FRONDS) / FRONDS * 1.5;
      const L = 2.05 + (k % 3) * .2;
      const s = Math.floor(R() * 40) / 39;
      const out = s * L; const up = rise * s * 1.5 - s * s * 2.2;
      const cx = Math.cos(az); const cz = Math.sin(az);
      if (R() < .24) { v.set(cx * out, up, cz * out); c.copy(WHITE); } else {
        const side = R() < .5 ? -1 : 1; const t = R(); const l = (1 - s * .72) * .62 * Math.sin(Math.min(1, s * 7 + .1) * Math.PI * .5);
        v.set(cx * (out + t * l * .3) - cz * side * t * l, up - t * l * .55, cz * (out + t * l * .3) + cx * side * t * l);
        c.copy(ICE).lerp(WHITE, 1 - t);
      }
      v.add(CROWN);
    }
    v.y -= .1;
  });
}

/** NEXT Vision: an eye, opening. */
function flow(n) {
  const WIDTH = 3.15;
  const lid = (x) => 1.55 * Math.pow(Math.max(0, 1 - (x * x) / (WIDTH * WIDTH)), 1.25);
  return cloud(n, (v, c) => {
    const pick = R();
    if (pick < .28) { // two lids, each a pair of fine lines
      const x = (R() * 2 - 1) * WIDTH; const up = R() < .6; const second = R() < .3;
      const y = lid(x) * (up ? 1 : -.72) + (second ? (up ? .24 : -.16) * (1 - (x * x) / (WIDTH * WIDTH)) : 0);
      v.set(x, y, Math.cos(x * .5) * .4);
      c.copy(WHITE);
    } else if (pick < .8) { // iris fibres
      const a = (Math.floor(R() * 110) / 110) * TAU + (R() - .5) * .012; const t = Math.pow(R(), .85); const r = .46 + t * .86;
      v.set(Math.cos(a) * r, Math.sin(a) * r, .85 - r * r * .22);
      c.copy(HOT).lerp(ICE, Math.min(1, t * 1.8)).lerp(WHITE, t * t * .7);
    } else if (pick < .92) { // pupil rim and iris rim
      const a = R() * TAU; const r = R() < .55 ? .45 : 1.33;
      v.set(Math.cos(a) * r, Math.sin(a) * r, .85 - r * r * .22);
      c.copy(r < 1 ? HOT : WHITE);
    } else { // a glint
      const a = R() * TAU; const r = Math.sqrt(R()) * .15;
      v.set(-.24 + Math.cos(a) * r, .24 + Math.sin(a) * r, .96);
      c.copy(WHITE);
    }
  });
}

/** Project gallery: 30 windows climbing a spiral. */
function gallery(n) {
  const COUNT = 30; const W = .94; const H = .5;
  return cloud(n, (v, c, i) => {
    const k = i % COUNT; const a = k * .42; const y = (k - (COUNT - 1) / 2) * .122 + .12; const rad = 2.1; // two turns, one continuous ribbon of windows
    const pick = R(); let x; let h;
    if (pick < .55) {
      const e = R() * 2 * (W + H);
      if (e < W) { x = e - W / 2; h = H / 2; } else if (e < W + H) { x = W / 2; h = H / 2 - (e - W); } else if (e < 2 * W + H) { x = W / 2 - (e - W - H); h = -H / 2; } else { x = -W / 2; h = -H / 2 + (e - 2 * W - H); }
    } else if (pick < .72) { x = (R() - .5) * W; h = H / 2 - R() * H * .15; } else { x = (R() - .5) * W * .8; h = -H / 2 + .06 + R() * H * .62; }
    v.set(Math.sin(a) * rad + Math.cos(a) * x, y + h, Math.cos(a) * rad - Math.sin(a) * x);
    const front = (Math.cos(a) + 1) * .5;
    if (k % 7 === 3) c.copy(HOT); else c.copy(ICE).lerp(WHITE, pick < .72 ? .9 : .25);
    c.multiplyScalar(.14 + front * .86);
  });
}

/** Private client systems: a business as a city of its own numbers. */
function systems(n) {
  const iso = new THREE.Euler(.6, Math.PI / 4, 0, "XYZ");
  const G = 7; const CELL = .62; const B = .22;
  const height = (x, z) => .22 + 1.95 * Math.pow(Math.max(0, 1 - Math.hypot(x - 2.2, z - 2.8) / 6), 2) + ((x * 7 + z * 13) % 5) * .09;
  return cloud(n, (v, c, i) => {
    const cx = i % G; const cz = Math.floor(i / G) % G;
    const h = height(cx, cz); const px = (cx - (G - 1) / 2) * CELL; const pz = (cz - (G - 1) / 2) * CELL;
    const tall = h > 1.45; const pick = R();
    if (pick < .5) { // roof
      v.set(px + (R() * 2 - 1) * B, h, pz + (R() * 2 - 1) * B);
      c.copy(tall ? HOT : WHITE);
    } else if (pick < .85) { // corner edges
      v.set(px + (R() < .5 ? -B : B), R() * h, pz + (R() < .5 ? -B : B));
      c.copy(WHITE).multiplyScalar(.8);
    } else { // ground
      const a = (R() * 2 - 1) * G * CELL * .5; const l = (Math.floor(R() * (G + 1)) - G / 2) * CELL;
      if (R() < .5) v.set(a, 0, l); else v.set(l, 0, a);
      c.copy(ICE).multiplyScalar(.45);
    }
    v.y -= .85;
    v.applyEuler(iso).multiplyScalar(.9);
  });
}

/** The call: a handset, sending rings out. */
function signal(n) {
  const roll = new THREE.Euler(0, 0, -.62);
  const RAD = 2.05; const SPAN = 1;
  return cloud(n, (v, c) => {
    const pick = R();
    if (pick < .42) { // the handle, a curved tube
      const a = (R() * 2 - 1) * SPAN; const u = R() * TAU; const t = .25;
      const r = RAD + Math.cos(u) * t;
      v.set(Math.sin(a) * r, Math.cos(a) * r - 1.55, Math.sin(u) * t * 1.15);
      c.copy(ICE).lerp(WHITE, (Math.cos(u) + 1) / 2);
    } else if (pick < .78) { // earpiece and mouthpiece
      const a = R() < .5 ? -SPAN : SPAN; const u = R() * TAU; const w = R() * 2 - 1; const q = Math.sqrt(1 - w * w);
      const ox = Math.sin(a) * (RAD - .24); const oy = Math.cos(a) * RAD - 1.55 - .28;
      v.set(ox + Math.cos(u) * q * .52, oy + w * .4, Math.sin(u) * q * .52);
      c.copy(WHITE).lerp(ICE, (1 - w) / 2);
    } else { // signal
      const ring = Math.floor(R() * 3); const a = (R() * 2 - 1) * (.62 - ring * .06); const r = 2.75 + ring * .46;
      v.set(Math.sin(a) * r, Math.cos(a) * r - 1.55, 0);
      c.copy(HOT).multiplyScalar(1 - ring * .22);
    }
    v.y -= .1;
    v.applyEuler(roll);
  });
}

export const build = (n) => [voice(n), school(n), flow(n), gallery(n), systems(n), signal(n)];
