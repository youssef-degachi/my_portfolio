import { useEffect, useRef } from "react";
import { prefersReduced } from "../shared";

const FRAG = `precision mediump float;
uniform vec2 uRes; uniform float uT; uniform vec2 uM; uniform float uK;
float h(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }
float n(vec2 p){ vec2 i=floor(p),f=fract(p); f=f*f*(3.-2.*f); return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y); }
float fbm(vec2 p){ float v=0.,a=.5; for(int i=0;i<4;i++){ v+=a*n(p); p=p*2.03+7.; a*=.5; } return v; }
void main(){
  vec2 uv=gl_FragCoord.xy/uRes.y; vec2 m=uM*vec2(uRes.x/uRes.y,1.);
  float d=length(uv-m);
  float f=fbm(uv*1.5+vec2(uT*.035,-uT*.025)+fbm(uv*.9-uT*.02)*1.1);
  f+=exp(-d*d*7.)*uK*.28*sin(d*22.-uT*2.4);
  float line=abs(fract(f*23.)-.5);
  float aa=smoothstep(0.,.075,line);
  float glow=exp(-d*d*3.2)*uK;
  float top=smoothstep(.1,1.,gl_FragCoord.y/uRes.y);
  vec3 base=vec3(.043,.043,.055);
  vec3 red=vec3(.945,.188,.141);
  gl_FragColor=vec4(base+red*(1.-aa)*(.13+glow*.75)*(.35+top*.65),1.);
}`;
const VERT = "attribute vec2 p; void main(){ gl_Position=vec4(p,0.,1.); }";

/** Topographic lines that ripple around the cursor like a voice in water. Raw WebGL, no 3D library. */
export default function ContourField() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    const gl = canvas.getContext("webgl", { antialias: false, powerPreference: "low-power" });
    if (!gl) return undefined;
    const compile = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; };
    const prog = gl.createProgram();
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return undefined;
    gl.useProgram(prog);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const u = Object.fromEntries(["uRes", "uT", "uM", "uK"].map((n) => [n, gl.getUniformLocation(prog, n)]));
    const m = { x: .72, y: .55, tx: .72, ty: .55, k: .55, tk: .55 };
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = canvas.clientWidth * dpr; canvas.height = canvas.clientHeight * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height); gl.uniform2f(u.uRes, canvas.width, canvas.height);
    };
    const move = (e) => { const r = canvas.getBoundingClientRect(); m.tx = (e.clientX - r.left) / r.width; m.ty = 1 - (e.clientY - r.top) / r.height; m.tk = 1; };
    let raf = 0; let visible = true;
    const reduced = prefersReduced();
    const frame = (t) => {
      m.x += (m.tx - m.x) * .06; m.y += (m.ty - m.y) * .06; m.k += (m.tk - m.k) * .04;
      gl.uniform1f(u.uT, reduced ? 8 : t / 1000); gl.uniform2f(u.uM, m.x, m.y); gl.uniform1f(u.uK, m.k);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    const loop = (t) => { if (visible && !document.hidden) frame(t); raf = requestAnimationFrame(loop); };
    resize();
    const ro = new ResizeObserver(resize); ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }); io.observe(canvas);
    window.addEventListener("pointermove", move, { passive: true });
    if (reduced) frame(0); else raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); window.removeEventListener("pointermove", move); };
  }, []);
  return <canvas ref={ref} className="o-field" aria-hidden />;
}
