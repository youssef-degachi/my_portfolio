import * as THREE from "three";

/** Every shape is a cloud of exactly N points + colours, so any shape can morph into any other. The shapes after the portrait live in sets/. */
export const WHITE = new THREE.Color("#e9f1ff");
export const ICE = new THREE.Color("#7fb2ff");
export const HOT = new THREE.Color("#ff2d55");
const VIOLET = new THREE.Color("#8a5cff");
export const TAU = Math.PI * 2;
export const R = Math.random;

export function cloud(n, fill) {
  const pos = new Float32Array(n * 3); const col = new Float32Array(n * 3);
  const v = new THREE.Vector3(); const c = new THREE.Color();
  for (let i = 0; i < n; i += 1) {
    fill(v, c, i);
    pos.set([v.x, v.y, v.z], i * 3);
    col.set([c.r, c.g, c.b], i * 3);
  }
  return { pos, col };
}

export function nebula(n) {
  const pos = new Float32Array(n * 3); const col = new Float32Array(n * 3);
  const c = new THREE.Color();
  for (let i = 0; i < n; i += 1) {
    const r = Math.pow(Math.random(), .6) * 4.2;
    const a = (i % 3) * ((Math.PI * 2) / 3) + r * 1.15 + (Math.random() - .5) * .7;
    const spread = (1 - r / 4.2) * .5 + .08;
    pos[i * 3] = Math.cos(a) * r + (Math.random() - .5) * spread;
    pos[i * 3 + 1] = (Math.random() - .5) * spread * 1.2;
    pos[i * 3 + 2] = Math.sin(a) * r + (Math.random() - .5) * spread;
    c.copy(HOT).lerp(VIOLET, Math.min(1, r / 2.2)).lerp(ICE, Math.max(0, (r - 2.2) / 2));
    if (r < .35) c.copy(WHITE);
    col.set([c.r, c.g, c.b], i * 3);
  }
  return { pos, col };
}

// Hand-traced silhouette of the portrait in photo.png (963×933), so the backdrop isn't sampled.
const SILHOUETTE = [[470, 5], [560, 30], [640, 120], [668, 240], [640, 340], [622, 420], [592, 480], [590, 578], [720, 650], [875, 715], [830, 800], [700, 890], [560, 932], [420, 932], [250, 880], [130, 790], [80, 710], [230, 640], [360, 575], [362, 480], [330, 440], [290, 360], [262, 240], [290, 120], [370, 30]];

/** Portrait: particle density follows local contrast, so eyes, brows, nose and mouth read as features. */
export function portrait(n, image) {
  const W = 360; const H = Math.round((W * image.height) / image.width);
  const canvas = (w, h) => { const c = document.createElement("canvas"); c.width = w; c.height = h; return c; };
  const sharp = canvas(W, H).getContext("2d", { willReadFrequently: true });
  sharp.drawImage(image, 0, 0, W, H);
  // cheap, cross-browser blur: shrink hard, scale back up smoothed
  const tiny = canvas(26, Math.round((26 * H) / W)).getContext("2d");
  tiny.imageSmoothingQuality = "high";
  tiny.drawImage(image, 0, 0, tiny.canvas.width, tiny.canvas.height);
  const soft = canvas(W, H).getContext("2d", { willReadFrequently: true });
  soft.imageSmoothingEnabled = true; soft.imageSmoothingQuality = "high";
  soft.drawImage(tiny.canvas, 0, 0, W, H);
  const mask = canvas(W, H).getContext("2d", { willReadFrequently: true });
  mask.beginPath();
  SILHOUETTE.forEach(([x, y], i) => mask[i ? "lineTo" : "moveTo"]((x / 963) * W, (y / 933) * H));
  mask.closePath(); mask.fillStyle = "#fff"; mask.fill();
  const px = sharp.getImageData(0, 0, W, H).data;
  const bl = soft.getImageData(0, 0, W, H).data;
  const md = mask.getImageData(0, 0, W, H).data;
  const lum = (d, i) => (d[i] * .3 + d[i + 1] * .59 + d[i + 2] * .11) / 255;

  const pos = new Float32Array(n * 3); const col = new Float32Array(n * 3);
  const c = new THREE.Color();
  const scale = 5.45 / H;
  let placed = 0; let guard = 0;
  while (placed < n && guard < n * 90) {
    guard += 1;
    const x = Math.floor(Math.random() * W); const y = Math.floor(Math.random() * H);
    const i = (y * W + x) * 4;
    if (md[i] < 128) continue;
    const l = lum(px, i);
    const tone = Math.min(1, Math.max(0, .5 + (l - lum(bl, i)) * 3.6 + (l - .42) * 1.25));
    const body = y > H * .66 ? .4 : 1; // the white shirt shouldn't outshine the face
    if (Math.random() > Math.pow(tone, 2.7) * body + .012) continue;
    const X = (x - W / 2) * scale; const Y = (H / 2 - y) * scale;
    const hy = Y - .9; const r2 = (X * X) / 2 + (hy * hy) / 4.4;
    const depth = r2 < 1 ? Math.sqrt(1 - r2) * 1.1 : 0;
    pos[placed * 3] = X; pos[placed * 3 + 1] = Y; pos[placed * 3 + 2] = depth + tone * .18;
    c.copy(ICE).lerp(WHITE, Math.pow(tone, 1.4) * body);
    col.set([c.r, c.g, c.b], placed * 3);
    placed += 1;
  }
  for (; placed < n; placed += 1) { // any remainder settles as dim dust behind the head
    pos.set([(Math.random() - .5) * 6, (Math.random() - .5) * 6, -2 - Math.random() * 2], placed * 3);
    col.set([.12, .16, .3], placed * 3);
  }
  return { pos, col };
}
