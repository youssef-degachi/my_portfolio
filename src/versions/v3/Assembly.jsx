import { useEffect, useRef } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { nebula, portrait } from "./shapes";
import { loadSet } from "./sets";
import { store } from "./store";
import { profile } from "../content";

// Per shape: nebula, portrait, then the six of the chosen set
const OFFSETS = [0, 2.35, -2.2, 2.2, -2.1, 2.1, -2.1, 2.35];
const TILT = [.94, 0, .08, .1, .1, .04, .06, 0];
const SWAY = [.35, .05, .2, .2, .25, .12, .18, .1];
const YAW = (mobile) => [0, mobile ? -.2 : -.42, .28, -.3, .32, -.38, .28, mobile ? 0 : -.22]; // portrait: turned slightly to its left

const vert = /* glsl */ `
  attribute vec3 aTarget; attribute vec3 aColor; attribute vec3 aColorT; attribute vec4 aRand;
  uniform float uProgress, uTime, uSize, uPixelRatio, uScan, uChaos, uAspect, uRing; uniform vec2 uMouse;
  varying vec3 vColor; varying float vGlow;
  vec3 swirl(vec3 p, float t, vec4 r) {
    return vec3(sin(p.y*1.7+t*1.3+r.y*6.2831)+sin(p.z*2.3-t*.7), sin(p.z*1.9+t*1.1+r.z*6.2831)+sin(p.x*2.1+t*.9), sin(p.x*1.5+t*1.7+r.w*6.2831)+sin(p.y*2.7-t*1.2))*.5;
  }
  void main() {
    float d = aRand.x * .42;
    float t = smoothstep(d, d + .58, uProgress);
    float burst = sin(t * 3.14159265);
    vec3 p = mix(position, aTarget, t);
    vec3 dir = normalize(p + vec3(.0001,.0002,.0003));
    p += swirl(p, uTime, aRand) * burst * (.8 + aRand.w * 1.6) * uChaos;
    p += dir * burst * (.4 + aRand.x * 1.8) * uChaos;
    p += swirl(p * 2., uTime * .6, aRand) * .012;
    p += dir * uRing * pow(max(0., sin(uTime * 7.)), 6.) * .16 * (.5 + .5 * sin(p.y * 12. + uTime * 22.));
    float band = 1. - smoothstep(0., .14, abs(p.y - uScan));
    p.x += band * (aRand.y - .5) * .05; p.z += band * (aRand.z - .5) * .05;
    vec4 mv = modelViewMatrix * vec4(p, 1.);
    gl_Position = projectionMatrix * mv;
    vec2 ndc = gl_Position.xy / gl_Position.w;
    vec2 dm = (ndc - uMouse) * vec2(uAspect, 1.);
    float push = smoothstep(.3, 0., length(dm));
    gl_Position.xy += normalize(dm + .0001) / vec2(uAspect, 1.) * push * .08 * gl_Position.w;
    vGlow = band * .3 + burst * .35 * uChaos + push * .7;
    gl_PointSize = uSize * uPixelRatio * (.55 + aRand.z * .9) * (1. + band * .5 + burst * .9) / -mv.z;
    vColor = mix(aColor, aColorT, t);
  }`;
const frag = /* glsl */ `
  varying vec3 vColor; varying float vGlow;
  void main() {
    float r = length(gl_PointCoord - .5);
    if (r > .5) discard;
    float a = pow(1. - r * 2., 1.7);
    vec3 col = vColor * (.42 + vGlow * 1.1) + vec3(1.,.35,.45) * vGlow * .12;
    gl_FragColor = vec4(col * a * .85, a);
  }`;
const finalShader = {
  uniforms: { tDiffuse: { value: null }, uCA: { value: .0015 }, uTime: { value: 0 } },
  vertexShader: "varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }",
  fragmentShader: `uniform sampler2D tDiffuse; uniform float uCA, uTime; varying vec2 vUv;
    float rand(vec2 c){ return fract(sin(dot(c, vec2(12.9898,78.233))) * 43758.5453); }
    void main(){ vec2 dir = vUv - .5; float d = length(dir); vec2 off = dir * uCA * (.4 + d * 2.);
      vec3 c = vec3(texture2D(tDiffuse, vUv + off).r, texture2D(tDiffuse, vUv).g, texture2D(tDiffuse, vUv - off).b);
      float l = dot(c, vec3(.3,.59,.11)); c += (rand(vUv * (uTime + 1.)) - .5) * (.0012 + l * .06); c *= 1. - smoothstep(.45, .95, d) * .7; gl_FragColor = vec4(c, 1.); }`,
};

export default function Assembly({ count, onReady, onFail }) {
  const host = useRef(null);
  useEffect(() => {
    const el = host.current;
    const mobile = window.innerWidth < 768;
    let disposed = false;
    let cleanup = () => {};

    const start = (photo, set) => {
      if (disposed) return;
      let renderer;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: "high-performance" });
      } catch { onFail?.(); return; }
      const N = count;
      const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 1.75);
      renderer.setPixelRatio(dpr);
      renderer.setSize(el.clientWidth, el.clientHeight);
      renderer.setClearColor("#000000");
      el.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(42, el.clientWidth / el.clientHeight, .1, 100);
      camera.position.set(0, 0, mobile ? 14.5 : 8.2);

      const clouds = [nebula(N), portrait(N, photo), ...set.build(N)];
      const geo = new THREE.BufferGeometry();
      const posA = new THREE.BufferAttribute(new Float32Array(N * 3), 3);
      const tgtA = new THREE.BufferAttribute(new Float32Array(N * 3), 3);
      const colA = new THREE.BufferAttribute(new Float32Array(N * 3), 3);
      const colT = new THREE.BufferAttribute(new Float32Array(N * 3), 3);
      const rand = new Float32Array(N * 4);
      for (let i = 0; i < N * 4; i += 1) rand[i] = Math.random();
      geo.setAttribute("position", posA); geo.setAttribute("aTarget", tgtA); geo.setAttribute("aColor", colA); geo.setAttribute("aColorT", colT);
      geo.setAttribute("aRand", new THREE.BufferAttribute(rand, 4));
      geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 12);

      const uniforms = {
        uProgress: { value: 0 }, uTime: { value: 0 }, uSize: { value: mobile ? 25 : 22 }, uPixelRatio: { value: dpr }, uScan: { value: -3 }, uRing: { value: 0 },
        uChaos: { value: store.reduced ? .2 : 1 }, uMouse: { value: new THREE.Vector2(9, 9) }, uAspect: { value: el.clientWidth / el.clientHeight },
      };
      const mat = new THREE.ShaderMaterial({ vertexShader: vert, fragmentShader: frag, uniforms, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
      const group = new THREE.Group();
      group.add(new THREE.Points(geo, mat));
      scene.add(group);

      const dustN = mobile ? 500 : 1400;
      const dust = new Float32Array(dustN * 3);
      for (let i = 0; i < dustN; i += 1) dust.set([(Math.random() - .5) * 30, (Math.random() - .5) * 18, -Math.random() * 20 - 2], i * 3);
      const dustGeo = new THREE.BufferGeometry();
      dustGeo.setAttribute("position", new THREE.BufferAttribute(dust, 3));
      const dustMat = new THREE.PointsMaterial({ color: "#5a6a9a", size: .03, transparent: true, opacity: .55, depthWrite: false });
      const dustPts = new THREE.Points(dustGeo, dustMat);
      scene.add(dustPts);

      const composer = new EffectComposer(renderer);
      composer.setPixelRatio(dpr);
      composer.addPass(new RenderPass(scene, camera));
      const bloom = new UnrealBloomPass(new THREE.Vector2(el.clientWidth, el.clientHeight).multiplyScalar(mobile ? .5 : .7), .7, .5, .24);
      composer.addPass(bloom);
      const final = new ShaderPass(finalShader);
      composer.addPass(final);
      composer.addPass(new OutputPass());

      let seg = -1;
      const load = (s) => {
        const a = clouds[s]; const b = clouds[Math.min(s + 1, clouds.length - 1)];
        posA.array.set(a.pos); tgtA.array.set(b.pos); colA.array.set(a.col); colT.array.set(b.col);
        posA.needsUpdate = true; tgtA.needsUpdate = true; colA.needsUpdate = true; colT.needsUpdate = true;
      };
      const onResize = () => {
        const w = el.clientWidth; const h = el.clientHeight;
        renderer.setSize(w, h); composer.setSize(w, h);
        camera.aspect = w / h; camera.position.z = w < 768 ? 14.5 : 8.2; camera.updateProjectionMatrix();
        uniforms.uAspect.value = w / h;
      };
      window.addEventListener("resize", onResize);

      const clock = new THREE.Clock();
      const mouse = new THREE.Vector2(9, 9);
      const target = new THREE.Vector2();
      let v = 0; let raf = 0; let ready = false;
      const yaw = YAW(mobile);
      const loop = () => {
        raf = requestAnimationFrame(loop);
        if (document.hidden || store.paused || store.inCall) return;
        const dt = Math.min(clock.getDelta(), .4); // generous cap: the morph must keep pace on slow GPUs
        const time = clock.elapsedTime;
        v += (store.intro + store.scroll - v) * (1 - Math.pow(.0008, dt));
        const max = clouds.length - 1;
        const vv = Math.min(v, max - .0001);
        const s = Math.floor(vv); const f = vv - s;
        if (s !== seg) { seg = s; load(s); }
        const p = s === 0 ? f : THREE.MathUtils.smoothstep(f, .45, 1);
        uniforms.uProgress.value = p; uniforms.uTime.value = time;
        uniforms.uScan.value = ((time * .45) % 1) * 6 - 3;
        const burst = Math.sin(Math.min(1, p) * Math.PI);
        store.burst = burst; store.stage = p > .5 ? s + 1 : s;
        final.uniforms.uCA.value = .001 + burst * .011 * uniforms.uChaos.value; final.uniforms.uTime.value = time;
        bloom.strength = .62 + burst * .45;
        if (Math.abs(store.mouse.x) < 1.5 && Math.abs(mouse.x) > 1.5) mouse.set(store.mouse.x, store.mouse.y);
        mouse.lerp(target.set(store.mouse.x, store.mouse.y), .12);
        uniforms.uMouse.value.copy(mouse);
        const mx = Math.abs(mouse.x) > 1.5 ? 0 : mouse.x; const my = Math.abs(mouse.y) > 1.5 ? 0 : mouse.y; // 9 = no pointer yet
        const mix = (arr) => THREE.MathUtils.lerp(arr[s], arr[s + 1], p);
        group.rotation.y = mix(yaw) + Math.sin(time * .4) * mix(SWAY) + mx * .14;
        group.rotation.x = mix(TILT) + Math.sin(time * .3) * .03 - my * .09;
        dustPts.rotation.y = time * .01;
        group.position.x = mobile ? 0 : mix(OFFSETS);
        group.position.y = mobile ? 2.5 : 0;
        uniforms.uRing.value = s === 6 && !store.reduced ? p : 0; // the last shape rings
        composer.render();
        if (!ready) { ready = true; onReady?.(); }
      };
      loop();
      cleanup = () => {
        cancelAnimationFrame(raf);
        window.removeEventListener("resize", onResize);
        geo.dispose(); mat.dispose(); dustGeo.dispose(); dustMat.dispose(); composer.dispose(); renderer.dispose();
        renderer.domElement.remove();
      };
    };

    const photo = new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = profile.photo;
    });
    Promise.all([photo, loadSet()]).then(([img, set]) => start(img, set)).catch(() => onFail?.());
    return () => { disposed = true; cleanup(); };
  }, [count, onReady, onFail]);
  return <div ref={host} className="a-gl" aria-hidden />;
}
