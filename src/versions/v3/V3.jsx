import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { profile, projects, services, experience, education, allSkills, socials, navLinks, stats } from "../content";
import { CountUp, FaqList, PricingBlock, Scramble, external, gsap, prefersReduced, usePage, useGsap, useSmoothScroll, ScrollTrigger } from "../shared";
import { store } from "./store";
import "./v3.css";

const Assembly = lazy(() => import("./Assembly"));
const loadCall = () => import("../v6/V6");
const CallOverlay = lazy(() => loadCall().then((m) => ({ default: m.CallOverlay })));

const byId = (id) => projects.find((p) => p.id === id);
const STAGES = [
  { name: "Y.D // Portrait" },
  { name: "01 // Voice", part: "BUILD 01 // VOICE", project: byId("andalib-ai"), title: "ANDALIB AI", copy: "AI that holds real conversations. I co-founded it and built the platform: product, architecture and the voice agents themselves.", spec: ["Voice agents", "Intelligent workflows", "Co-founder"] },
  { name: "02 // School", part: "BUILD 02 // EDUCATION", project: byId("jeridschool"), title: "JERIDSCHOOL", copy: "An education platform for learners and schools. Built to scale teaching, not just pages.", spec: ["Fullstack", "Education", "Co-founder"] },
  { name: "03 // Automation", part: "BUILD 03 // AUTOMATION", project: byId("nvs"), title: "NEXT VISION", copy: "Our AI automation studio. Voice agents, workflow automation and custom software, connected into one system.", spec: ["Voice agents", "Automation", "Co-founder"] },
  { name: "04 // Gallery", part: "BUILD 04 // 30 PROJECTS", project: byId("project-gallery"), title: "PROJECT GALLERY", copy: "One folder, 30 projects. Company websites to browse and small business systems to try. Designed and built solo.", spec: ["React", "Websites", "Business systems"] },
  { name: "05 // Systems", part: "BUILD 05 // CLIENT SYSTEMS", title: "PRIVATE SYSTEMS", copy: "ERPs and business systems built for real clients. They run real companies, so they stay private.", spec: [] },
  { name: "06 // The call" },
];

function Hud({ count }) {
  const frame = useRef(null); const status = useRef(null); const stage = useRef(null); const bars = useRef(null);
  useEffect(() => {
    let raf = 0; let n = 0; let lastStage = -1; let lastStatus = "";
    const tick = () => {
      raf = requestAnimationFrame(tick);
      n += 1;
      if (frame.current && n % 2 === 0) frame.current.textContent = String(n).padStart(6, "0");
      const st = store.burst > .08 ? "TRANSFORMING" : store.intro < 1 ? "ASSEMBLING" : store.stage >= STAGES.length ? "INCOMING CALL" : "STABLE";
      if (st !== lastStatus && status.current) { lastStatus = st; status.current.textContent = st; status.current.style.color = st === "STABLE" ? "#7fb2ff" : st === "INCOMING CALL" ? "#00e070" : "#ff2d55"; }
      const s = Math.max(0, Math.min(STAGES.length - 1, store.stage - 1));
      if (s !== lastStage) {
        lastStage = s;
        if (stage.current) stage.current.textContent = STAGES[s].name;
        bars.current?.querySelectorAll("span").forEach((b, i) => { b.style.background = i <= s ? "#ff2d55" : "rgba(233,241,255,.18)"; });
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <div className="a-hud" aria-hidden>
      <div className="a-hud-tr"><p>Status <span ref={status} style={{ color: "#ff2d55" }}>ASSEMBLING</span></p><p className="a-dim">Frame <span ref={frame}>000000</span></p><p className="a-dim a-desk">Particles {count.toLocaleString("en-US")}</p></div>
      <div className="a-hud-b">
        <div><span ref={stage}>{STAGES[0].name}</span><span className="a-dim a-desk">Scroll to transform</span></div>
        <div ref={bars} className="a-bars">{STAGES.map((s) => <span key={s.name} />)}</div>
      </div>
      {["tl", "tr", "bl", "br"].map((c) => <i key={c} className={`a-corner a-corner-${c}`} />)}
    </div>
  );
}

export default function V3() {
  usePage({ title: "Youssef Degachi — Assembly", bg: "#020205", fonts: "family=Syne:wght@600;700;800&family=IBM+Plex+Mono:wght@400;500&family=Inter:wght@400;500" });
  const { go, lenis } = useSmoothScroll({ lerp: .08 });
  const [call, setCall] = useState(null);
  const openCall = (e) => setCall({ x: e.clientX, y: e.clientY });
  const closeCall = useCallback(() => setCall(null), []);
  const wrap = useRef(null);
  const [noGL, setNoGL] = useState(false);
  const count = useMemo(() => (window.innerWidth < 768 ? 9000 : 24000), []);

  useEffect(() => {
    store.reduced = prefersReduced();
    store.intro = 0; store.scroll = 0;
    const sections = wrap.current.querySelectorAll(".a-stage").length;
    const st = ScrollTrigger.create({
      trigger: wrap.current, start: "top top", end: "bottom bottom",
      onUpdate: (s) => { store.scroll = s.progress * (sections - .5); },
      onToggle: (s) => { store.paused = !s.isActive && s.progress > .99; },
    });
    const move = (e) => { store.mouse.x = (e.clientX / window.innerWidth) * 2 - 1; store.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1; };
    window.addEventListener("pointermove", move, { passive: true });
    return () => { st.kill(); window.removeEventListener("pointermove", move); };
  }, []);

  // While the call is open the particles rest and the page behind it stays where it was.
  const inCall = Boolean(call);
  useEffect(() => {
    store.inCall = inCall;
    document.documentElement.classList.toggle("a-locked", inCall);
    if (inCall) lenis.current?.stop(); else lenis.current?.start();
    return () => { store.inCall = false; document.documentElement.classList.remove("a-locked"); };
  }, [inCall, lenis]);
  useEffect(() => { const t = setTimeout(loadCall, 3000); return () => clearTimeout(t); }, []);

  const onReady = useCallback(() => {
    gsap.to(store, { intro: 1, duration: store.reduced ? .5 : 3.2, ease: "power2.inOut", delay: .25 });
  }, []);
  const onFail = useCallback(() => setNoGL(true), []);

  useGsap(() => {
    if (prefersReduced()) return;
    gsap.from(".a-in", { opacity: 0, y: 30, duration: 1.3, stagger: .12, delay: 1.5, ease: "expo.out" });
    gsap.utils.toArray("[data-reveal]").forEach((el) => gsap.from(el, { opacity: 0, y: 30, duration: 1, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 90%" } }));
  }, [], wrap);

  return (
    <div className={`vroot asm${noGL ? " is-nogl" : ""}`}>
      {noGL ? <div className="a-gl a-fallback"><img src={profile.photo} alt="" /></div> : <Suspense fallback={null}><Assembly count={count} onReady={onReady} onFail={onFail} /></Suspense>}
      <Hud count={count} />
      <nav className="a-nav" aria-label="Main">
        <button className="a-logo" onClick={() => go("#top")}>Y<b>/</b>D</button>
        <div>{navLinks.map((l) => <button key={l.id} onClick={() => go(`#${l.id}`)}>{l.label}</button>)}</div>
      </nav>
      <main>
        <div ref={wrap} className="a-scenes" id="top">
          <section className="a-stage">
            <div className="a-sticky">
              <div className="a-copy">
                <p className="a-in a-part">{profile.role} · {profile.location}</p>
                <h1 className="a-in">Youssef<br />Degachi</h1>
                <p className="a-in a-lead">3+ years of experience building systems and ERPs for real clients.</p>
                <div className="a-in a-actions">
                  <a className="a-btn a-btn-hot" href={profile.whatsapp} {...external}>Hire me</a>
                  <button className="a-btn a-answer-sm" onClick={openCall}><i />Call my agent</button>
                  <a className="a-btn" href={profile.cv} download>Download CV</a>
                </div>
              </div>
            </div>
          </section>
          {STAGES.slice(1, -1).map((s, i) => (
            <section key={s.name} className="a-stage" id={i === 0 ? "work" : undefined}>
              <div className={`a-sticky ${i % 2 === 0 ? "is-right" : ""}`}>
                <div className="a-copy">
                  <Scramble as="p" text={s.part} className="a-part" />
                  <Scramble as="h2" text={s.title} delay={100} />
                  <p className="a-lead">{s.copy}</p>
                  {s.spec.length > 0 && <ul className="a-spec">{s.spec.map((x) => <li key={x}>+ {x}</li>)}</ul>}
                  <div className="a-actions">
                    {s.project?.live && <a className="a-btn" href={s.project.live} {...external}><i />Open the build ↗</a>}
                  </div>
                </div>
              </div>
            </section>
          ))}
          <section className="a-stage">
            <div className="a-sticky">
              <div className="a-copy">
                <p className="a-part a-ringing">Incoming call // {profile.first}&rsquo;s agent</p>
                <h2>Don&rsquo;t read my portfolio. <em>Answer it.</em></h2>
                <p className="a-lead">Sound on. Talk or type. It runs in your browser.</p>
                <div className="a-actions">
                  <button className="a-btn a-answer" onClick={openCall}><span aria-hidden>✆</span>Answer</button>
                  <button className="a-btn" onClick={() => go("#services")}>Just read it</button>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="a-solid">
          <section className="a-block a-stats">
            {stats.map((s) => <div key={s.label} data-reveal><CountUp value={s.value} suffix={s.suffix} className="a-num" /><p>{s.label}</p></div>)}
          </section>
          <section id="services" className="a-block">
            <p className="a-part" data-reveal>What I assemble</p>
            <div className="a-services">
              {services.map((s) => (
                <article key={s.num} data-reveal><span>{s.num}</span><h3>{s.title}</h3><p>{s.text}</p></article>
              ))}
            </div>
          </section>
          <section id="work-list" className="a-block">
            <p className="a-part" data-reveal>All parts list</p>
            <ul className="a-parts">
              {projects.map((p, i) => {
                const inner = (<><span>{String(i + 1).padStart(2, "0")}</span><b>{p.title}</b><em>{p.kindLabel}</em><img src={p.image} alt="" loading="lazy" /></>);
                return <li key={p.id} data-reveal>{p.live ? <a href={p.live} {...external}>{inner}</a> : <div>{inner}</div>}</li>;
              })}
            </ul>
          </section>
          <section id="pricing" className="a-block">
            <h2 className="a-h" data-reveal>COST OF<br />ASSEMBLY</h2>
            <PricingBlock />
            <div className="a-faq"><p className="a-part">Before you ask</p><FaqList /></div>
          </section>
          <section id="about" className="a-block a-about">
            <div data-reveal><h2 className="a-h">THE<br />BUILDER</h2><p className="a-lead">{profile.short}</p><p className="a-skills">{allSkills.join(" / ")}</p></div>
            <div>
              {[["Experience", experience], ["Education", education]].map(([t, rows]) => (
                <div key={t} className="a-log" data-reveal>
                  <p className="a-part">{t}</p>
                  {rows.map((r) => <div key={r.org + r.role}><span>{r.when}</span><b>{r.role}</b><em>{r.href ? <a href={r.href} {...external}>{r.org} ↗</a> : r.org}</em></div>)}
                </div>
              ))}
            </div>
          </section>
          <section id="contact" className="a-block a-contact">
            <h2 className="a-h" data-reveal>LET&rsquo;S<br />BUILD</h2>
            <div data-reveal>
              <p className="a-lead">{profile.availability}. WhatsApp is the fastest way to reach me.</p>
              <div className="a-actions">
                <a className="a-btn a-btn-hot" href={profile.whatsapp} {...external}>{profile.phone}</a>
                <a className="a-btn" href={`mailto:${profile.email}`}>{profile.email}</a>
              </div>
            </div>
          </section>
          <footer className="a-foot">
            <span>© {new Date().getFullYear()} {profile.name}</span>
            <span>{socials.map((s) => <a key={s.label} href={s.href} {...external}>{s.label}</a>)}</span>
          </footer>
        </div>
      </main>
      {call && <Suspense fallback={null}><CallOverlay origin={call} onClose={closeCall} /></Suspense>}
    </div>
  );
}
