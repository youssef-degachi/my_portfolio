import { useEffect, useRef } from "react";
import * as THREE from "three";

const VERT = `
uniform float uT, uAmp, uRing, uSize; attribute float aR; varying float vL;
vec3 m289(vec3 x){return x-floor(x*(1./289.))*289.;} vec4 m289(vec4 x){return x-floor(x*(1./289.))*289.;} vec4 perm(vec4 x){return m289(((x*34.)+1.)*x);} vec4 ti(vec4 r){return 1.79284291400159-.85373472095314*r;}
float sn(vec3 v){ const vec2 C=vec2(1./6.,1./3.); const vec4 D=vec4(0.,.5,1.,2.); vec3 i=floor(v+dot(v,C.yyy)); vec3 x0=v-i+dot(i,C.xxx); vec3 g=step(x0.yzx,x0.xyz); vec3 l=1.-g; vec3 i1=min(g.xyz,l.zxy); vec3 i2=max(g.xyz,l.zxy); vec3 x1=x0-i1+C.xxx; vec3 x2=x0-i2+C.yyy; vec3 x3=x0-D.yyy; i=m289(i); vec4 p=perm(perm(perm(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.)); float n_=.142857142857; vec3 ns=n_*D.wyz-D.xzx; vec4 j=p-49.*floor(p*ns.z*ns.z); vec4 x_=floor(j*ns.z); vec4 y_=floor(j-7.*x_); vec4 x=x_*ns.x+ns.yyyy; vec4 y=y_*ns.x+ns.yyyy; vec4 h=1.-abs(x)-abs(y); vec4 b0=vec4(x.xy,y.xy); vec4 b1=vec4(x.zw,y.zw); vec4 s0=floor(b0)*2.+1.; vec4 s1=floor(b1)*2.+1.; vec4 sh=-step(h,vec4(0.)); vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy; vec4 a1=b1.xzyw+s1.xzyw*sh.zzww; vec3 p0=vec3(a0.xy,h.x); vec3 p1=vec3(a0.zw,h.y); vec3 p2=vec3(a1.xy,h.z); vec3 p3=vec3(a1.zw,h.w); vec4 nr=ti(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3))); p0*=nr.x;p1*=nr.y;p2*=nr.z;p3*=nr.w; vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.); m=m*m; return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3))); }
void main(){
  vec3 dir=normalize(position);
  float slow=sn(dir*1.35+vec3(uT*.13));
  float fast=sn(dir*3.2-vec3(uT*.7))*uAmp;
  float band=sin(dir.y*16.-uT*5.)*.5+.5;
  float ring=uRing*pow(max(0.,sin(uT*7.)),6.)*.12*(.5+.5*sin(dir.y*30.+uT*22.));
  float r=1.+slow*.09+fast*.42+band*uAmp*.07+ring;
  vec3 p=dir*r;
  vec4 mv=modelViewMatrix*vec4(p,1.);
  gl_Position=projectionMatrix*mv;
  vL=.32+.68*smoothstep(-1.4,1.,dir.z+fast*.9)+uAmp*.2;
  gl_PointSize=uSize*(.65+aR*.8)*(1.+uAmp*.5)/-mv.z;
}`;
const FRAG = `uniform vec3 uColor; varying float vL;
void main(){ float d=length(gl_PointCoord-.5); if(d>.5) discard; gl_FragColor=vec4(uColor,vL*(1.-smoothstep(.3,.5,d))); }`;

/** The agent's body: a point sphere that breathes, rings and speaks. Controlled through `state` (a ref). */
export default function Orb({ state }) {
  const host = useRef(null);
  useEffect(() => {
    const el = host.current;
    let renderer;
    try { renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: "high-performance" }); } catch { return undefined; }
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(dpr);
    el.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, 1, .1, 20);
    camera.position.z = 3.9;
    const N = window.innerWidth < 768 ? 9000 : 20000;
    const pos = new Float32Array(N * 3); const rnd = new Float32Array(N);
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < N; i += 1) {
      const y = 1 - (i / (N - 1)) * 2; const r = Math.sqrt(1 - y * y); const a = golden * i;
      pos.set([Math.cos(a) * r, y, Math.sin(a) * r], i * 3); rnd[i] = Math.random();
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geo.setAttribute("aR", new THREE.BufferAttribute(rnd, 1));
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 3);
    const uniforms = { uT: { value: 0 }, uAmp: { value: 0 }, uRing: { value: 1 }, uSize: { value: 5.6 * dpr }, uColor: { value: new THREE.Color("#d4ff3a") } };
    const mat = new THREE.ShaderMaterial({ vertexShader: VERT, fragmentShader: FRAG, uniforms, transparent: true, depthWrite: false });
    const pts = new THREE.Points(geo, mat);
    scene.add(pts);
    const size = () => {
      const s = Math.max(el.clientWidth, el.clientHeight);
      renderer.setSize(el.clientWidth, el.clientHeight);
      camera.aspect = el.clientWidth / el.clientHeight;
      camera.fov = 36 * Math.max(1, 1 / camera.aspect);
      camera.updateProjectionMatrix();
      uniforms.uSize.value = (window.innerWidth < 768 ? 4.8 : 5.6) * dpr * (s / 900);
    };
    size();
    const ro = new ResizeObserver(size); ro.observe(el);
    const clock = new THREE.Clock();
    const target = new THREE.Color();
    const pointer = { x: 0, y: 0 };
    const move = (e) => { pointer.x = (e.clientX / window.innerWidth) * 2 - 1; pointer.y = (e.clientY / window.innerHeight) * 2 - 1; };
    window.addEventListener("pointermove", move, { passive: true });
    let raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (document.hidden) return;
      const dt = Math.min(clock.getDelta(), .1);
      const st = state.current;
      uniforms.uT.value = clock.elapsedTime;
      uniforms.uAmp.value += (st.energy - uniforms.uAmp.value) * (1 - Math.exp(-dt * 9));
      uniforms.uRing.value += (st.ringing - uniforms.uRing.value) * (1 - Math.exp(-dt * 5));
      target.set(st.color);
      uniforms.uColor.value.lerp(target, 1 - Math.exp(-dt * 4));
      pts.rotation.y += dt * (.07 + uniforms.uAmp.value * .35);
      pts.rotation.x += ((pointer.y * .25) - pts.rotation.x) * .04;
      pts.position.x += ((pointer.x * .05) - pts.position.x) * .04;
      renderer.render(scene, camera);
    };
    loop();
    return () => { cancelAnimationFrame(raf); ro.disconnect(); window.removeEventListener("pointermove", move); geo.dispose(); mat.dispose(); renderer.dispose(); renderer.domElement.remove(); };
  }, [state]);
  return <div ref={host} className="c-orb" aria-hidden />;
}
