import * as THREE from "three";
import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler.js";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { WHITE, ICE, HOT } from "../shapes";

/** Set 1: the objects themselves. Microphone, graduation cap, network, panels, workstation, speech bubble. */
function bake(parts) {
  const geos = parts.map(({ geo, p = [0, 0, 0], r = [0, 0, 0], s = [1, 1, 1], q }) => {
    const g = geo.index ? geo.toNonIndexed() : geo.clone();
    Object.keys(g.attributes).forEach((k) => { if (k !== "position") g.deleteAttribute(k); });
    const quat = q || new THREE.Quaternion().setFromEuler(new THREE.Euler(...r));
    g.applyMatrix4(new THREE.Matrix4().compose(new THREE.Vector3(...p), quat, new THREE.Vector3(...s)));
    return g;
  });
  return mergeGeometries(geos);
}

function sample(parts, count, out, offset, paint) {
  const sampler = new MeshSurfaceSampler(new THREE.Mesh(bake(parts))).build();
  const v = new THREE.Vector3();
  const c = new THREE.Color();
  for (let i = 0; i < count; i += 1) {
    sampler.sample(v);
    paint(v, c);
    const j = (offset + i) * 3;
    out.pos[j] = v.x; out.pos[j + 1] = v.y; out.pos[j + 2] = v.z;
    out.col[j] = c.r; out.col[j + 1] = c.g; out.col[j + 2] = c.b;
  }
}

const gradient = (v, c) => c.copy(ICE).lerp(WHITE, THREE.MathUtils.clamp((v.y + 1.8) / 3.6, 0, 1));
const hot = (_, c) => c.copy(HOT);

function make(n, body, accent, share = .16) {
  const out = { pos: new Float32Array(n * 3), col: new Float32Array(n * 3) };
  const na = accent.length ? Math.floor(n * share) : 0;
  sample(body, n - na, out, 0, gradient);
  if (na) sample(accent, na, out, n - na, hot);
  return out;
}

const box = (w, h, d) => new THREE.BoxGeometry(w, h, d);
const sphere = (r) => new THREE.SphereGeometry(r, 24, 16);

function voice(n) {
  const bars = Array.from({ length: 72 }).map((_, i) => {
    const a = (i / 72) * Math.PI * 2;
    const h = .3 + Math.abs(Math.sin(i * .55) * Math.cos(i * .21)) * 1.25;
    const r = 2 + h / 2;
    return { geo: box(.075, h, .075), p: [Math.sin(a) * r, Math.cos(a) * r, 0], r: [0, 0, -a] };
  });
  const mic = [
    { geo: new THREE.CapsuleGeometry(.42, .8, 8, 22), p: [0, .36, 0] },
    { geo: new THREE.TorusGeometry(.72, .05, 8, 40, Math.PI), p: [0, .18, 0], r: [0, 0, Math.PI] },
    { geo: box(.09, .55, .09), p: [0, -.78, 0] },
    { geo: box(.75, .08, .18), p: [0, -1.05, 0] },
  ];
  return make(n, bars, mic, .32);
}

function school(n) {
  const body = [
    { geo: box(3.1, .09, 3.1), p: [0, .95, 0], r: [.32, Math.PI / 4, 0] },
    { geo: new THREE.CylinderGeometry(1.05, 1.15, .8, 32, 1, true), p: [0, .42, 0] },
    { geo: box(1.9, .1, 1.35), p: [-.98, -1.25, 0], r: [0, 0, .2] },
    { geo: box(1.9, .1, 1.35), p: [.98, -1.25, 0], r: [0, 0, -.2] },
    { geo: box(1.75, .03, 1.2), p: [-.97, -1.16, 0], r: [0, 0, .2] },
    { geo: box(1.75, .03, 1.2), p: [.97, -1.16, 0], r: [0, 0, -.2] },
  ];
  const tassel = [
    { geo: sphere(.1), p: [0, 1.04, 0] },
    { geo: box(.03, .03, 1.4), p: [.5, 1.02, .5], r: [0, Math.PI / 4, 0] },
    { geo: box(.03, .8, .03), p: [1, .62, 1] },
    { geo: new THREE.ConeGeometry(.1, .32, 12), p: [1, .15, 1] },
  ];
  return make(n, body, tassel, .13);
}

const link = (a, b, thickness = .02) => {
  const A = new THREE.Vector3(...a); const B = new THREE.Vector3(...b);
  const d = B.clone().sub(A);
  return { geo: new THREE.CylinderGeometry(thickness, thickness, d.length(), 6, 1, true), p: A.clone().add(B).multiplyScalar(.5).toArray(), q: new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize()) };
};

function network(n) {
  const nodes = [[0, 0, 0], [-2.1, 1.35, .3], [2.15, 1.25, -.4], [-2.3, -1.2, -.3], [2.05, -1.4, .4], [0, 2.2, -.8], [0, -2.25, .7], [-3.2, .05, .9], [3.25, 0, .7]];
  const edges = [[0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [1, 5], [2, 5], [3, 6], [4, 6], [1, 7], [3, 7], [2, 8], [4, 8]];
  const body = [
    ...nodes.slice(1).map((p) => ({ geo: sphere(.3), p })),
    ...edges.map(([a, b]) => link(nodes[a], nodes[b])),
  ];
  const accent = [{ geo: sphere(.56), p: nodes[0] }, ...edges.slice(0, 4).map(([a, b]) => ({ geo: sphere(.075), p: new THREE.Vector3(...nodes[a]).lerp(new THREE.Vector3(...nodes[b]), .62).toArray() }))];
  const out = make(n, body, accent, .22);
  out.pos.forEach((x, i) => { out.pos[i] = x * .84; }); // keeps clear of the text beside it
  return out;
}

function gallery(n) {
  const panels = []; const accent = [];
  for (let row = 0; row < 5; row += 1) {
    for (let col = 0; col < 6; col += 1) {
      const a = ((col - 2.5) / 6) * 1.9;
      const part = { geo: box(.92, .62, .025), p: [Math.sin(a) * 3.3, (row - 2) * .78, Math.cos(a) * 3.3 - 3.2], r: [0, a, 0] };
      ((row * 6 + col) % 7 === 3 ? accent : panels).push(part);
    }
  }
  return make(n, panels, accent, .15);
}

function systems(n) {
  const body = [
    { geo: box(3.2, .1, 2.2), p: [-.75, -1.2, 0] },
    { geo: box(3.2, 2.05, .07), p: [-.75, -.1, -1.25], r: [-.14, 0, 0] },
    ...[0, 1, 2, 3].map((i) => ({ geo: box(1.5, .46, 1.3), p: [2.2, -1 + i * .58, -.2] })),
  ];
  const accent = [
    ...[0, 1, 2, 3].flatMap((i) => [0, 1, 2].map((d) => ({ geo: box(.09, .09, .02), p: [1.72 + d * .17, -1 + i * .58, .46] }))),
    ...[0, 1, 2, 3, 4].map((i) => ({ geo: box(.32, .3 + i * .2, .02), p: [-1.75 + i * .5, -.75 + (.3 + i * .2) / 2, -1.15], r: [-.14, 0, 0] })),
  ];
  return make(n, body, accent, .2);
}

function bubble(n) {
  const body = [
    { geo: new THREE.SphereGeometry(1, 48, 32), s: [2.5, 1.65, .52], p: [0, .3, 0] },
    { geo: new THREE.ConeGeometry(.42, 1.05, 16), p: [-1.25, -1.45, 0], r: [0, 0, -.55], s: [1, 1, .4] },
  ];
  const dots = [-.95, 0, .95].map((x) => ({ geo: sphere(.27), p: [x, .3, .55] }));
  return make(n, body, dots, .18);
}

export const build = (n) => [voice(n), school(n), network(n), gallery(n), systems(n), bubble(n)];
