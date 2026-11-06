import { useEffect, useRef } from "react";
import { prefersReduced } from "../shared";

/** A blueprint dot-lattice that lights up and bends around the cursor, plus drifting sparks. */
export default function LightField() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    const calm = prefersReduced();
    const GAP = 30;
    const mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999, on: false };
    let w = 0; let h = 0; let raf = 0; let visible = true; let sparks = [];

    const draw = (t) => {
      ctx.clearRect(0, 0, w, h);
      mouse.x += (mouse.tx - mouse.x) * .12;
      mouse.y += (mouse.ty - mouse.y) * .12;
      const R = Math.min(260, Math.max(160, w * .18));
      for (let y = GAP / 2; y < h; y += GAP) {
        for (let x = GAP / 2; x < w; x += GAP) {
          const dx = x - mouse.x; const dy = y - mouse.y;
          const d = Math.hypot(dx, dy);
          const k = mouse.on ? Math.max(0, 1 - d / R) : 0;
          const wave = calm ? 0 : Math.sin(x * .012 + y * .008 + t * .0009) * .5 + .5;
          const push = k * k * 14;
          const a = .07 + wave * .07 + k * .85;
          const s = 1 + k * 1.6;
          ctx.fillStyle = k > .55 ? `rgba(255,106,0,${a})` : `rgba(61,245,255,${a})`;
          ctx.fillRect(x + (d ? (dx / d) * push : 0) - s / 2, y + (d ? (dy / d) * push : 0) - s / 2, s, s);
        }
      }
      if (calm) return;
      if (sparks.length < Math.min(70, w / 18) && Math.random() < .35) {
        sparks.push({ x: Math.random() * w, y: h + 10, vx: (Math.random() - .5) * .25, vy: -(.25 + Math.random() * .7), life: 0, max: 300 + Math.random() * 500, c: Math.random() < .18 ? "255,106,0" : "61,245,255" });
      }
      sparks = sparks.filter((p) => {
        p.life += 1;
        p.x += p.vx + Math.sin((p.y + p.life) * .01) * .15;
        p.y += p.vy;
        ctx.fillStyle = `rgba(${p.c},${Math.sin((p.life / p.max) * Math.PI) * .8})`;
        ctx.fillRect(p.x, p.y, 1.6, 1.6);
        return p.life < p.max && p.y > -10;
      });
    };
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width; h = r.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (calm) draw(0);
    };
    const loop = (t) => { if (visible) draw(t); raf = requestAnimationFrame(loop); };
    const move = (e) => {
      const r = canvas.getBoundingClientRect();
      mouse.tx = e.clientX - r.left; mouse.ty = e.clientY - r.top;
      if (!mouse.on) { mouse.x = mouse.tx; mouse.y = mouse.ty; }
      mouse.on = true;
      if (calm) draw(0);
    };
    resize();
    const ro = new ResizeObserver(resize); ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }); io.observe(canvas);
    window.addEventListener("pointermove", move, { passive: true });
    if (!calm) raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); window.removeEventListener("pointermove", move); };
  }, []);
  return <canvas ref={ref} className="l-field" aria-hidden />;
}
