import { useEffect, useRef } from "react";
import { prefersReduced } from "../shared";

/**
 * Tozeur-style brick relief, generated. Bricks lay themselves row by row when first seen.
 * pattern: "diamond" (lozenges) | "chevron" (zigzag) | "weave" (stepped crosses).
 */
// Coordinates are in half-bricks, so running-bond rows stay aligned and the motif reads cleanly.
const lattice = (c, r, p) => {
  const X = c * 2 - (r % 2); const P = p * 2;
  const dx = Math.abs(((X % (P * 2)) + P * 2) % (P * 2) - P);
  const dy = Math.abs((r % (p * 2)) - p);
  return { dx, dy, d: dx / 2 + dy };
};
const PATTERNS = {
  diamond: (c, r, p) => { const { d } = lattice(c, r, p); return Math.abs(d - p) < .6 || d < 1.1 || (p > 4 && Math.abs(d - (p - 3)) < .6); },
  chevron: (c, r, p) => { const { dx } = lattice(c, r, p); const v = (r + dx / 2) % p; return v < 1; },
  weave: (c, r, p) => { const { dx, dy } = lattice(c, r, p); return (dx <= 1 && dy <= 3) || (dy <= 0 && dx <= 5) || (dy === p && dx === p * 2); },
};

export default function Brickwork({ pattern = "diamond", period = 6, brick = 26, base = "#d9ad7c", raised = "#9a5230", gap = 3, className, from = "bottom" }) {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    const test = PATTERNS[pattern];
    let raf = 0; let started = false; let progress = prefersReduced() ? 1 : 0;
    const paint = () => {
      const w = canvas.clientWidth; const h = canvas.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (canvas.width !== Math.round(w * dpr)) { canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr); }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const bh = Math.round(brick * .42); const rows = Math.ceil(h / (bh + gap)) + 1; const cols = Math.ceil(w / (brick + gap)) + 2;
      for (let r = 0; r < rows; r += 1) {
        const fromBottom = from === "bottom" ? rows - r : r;
        for (let c = 0; c < cols; c += 1) {
          const order = (fromBottom + c * .28) / (rows + cols * .28);
          const t = Math.min(1, Math.max(0, (progress - order * .82) / .18));
          if (t <= 0) continue;
          const on = test(c, r, period);
          const x = c * (brick + gap) - (r % 2 ? (brick + gap) / 2 : 0);
          const y = r * (bh + gap);
          ctx.globalAlpha = t * (on ? 1 : .55);
          ctx.fillStyle = on ? raised : base;
          ctx.fillRect(x, y - (1 - t) * 10, brick, bh);
          if (on) { ctx.fillStyle = "rgba(255,240,215,.28)"; ctx.fillRect(x, y - (1 - t) * 10, brick, 1.5); }
        }
      }
      ctx.globalAlpha = 1;
    };
    const run = () => {
      const start = performance.now();
      const step = (now) => {
        progress = Math.min(1, (now - start) / 1900);
        paint();
        if (progress < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    };
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started) { started = true; if (progress < 1) run(); else paint(); }
    }, { threshold: .1 });
    io.observe(canvas);
    const ro = new ResizeObserver(() => { canvas.width = 0; if (started) paint(); });
    ro.observe(canvas);
    return () => { cancelAnimationFrame(raf); io.disconnect(); ro.disconnect(); };
  }, [pattern, period, brick, base, raised, gap, from]);
  return <canvas ref={ref} className={className} aria-hidden />;
}
