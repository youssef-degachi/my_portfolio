import { useEffect, useMemo, useRef, useState } from "react";
import { profile, projects, services, experience, education, skills, stats, socials, navLinks, whatsappWith, asset, VERSIONS } from "../content";
import { CountUp, FaqList, PricingBlock, external, gsap, prefersReduced, usePage, useGsap, useMedia, useSmoothScroll, ScrollTrigger } from "../shared";
import LightField from "./LightField";
import "./v1.css";

const BOOT = ["mount /systems ........ 3+ yrs", "load voice-agents ..... ok", "load fullstack ........ ok", "lights ................ on"];

function Loader({ onDone }) {
  const [pct, setPct] = useState(0);
  const root = useRef(null);
  useEffect(() => {
    const state = { p: 0 };
    const tl = gsap.timeline({ onComplete: onDone });
    tl.to(state, { p: 100, duration: 1.5, ease: "power2.inOut", onUpdate: () => setPct(Math.round(state.p)) })
      .to(root.current, { clipPath: "inset(0 0 100% 0)", duration: .7, ease: "expo.inOut" });
    return () => tl.kill();
  }, [onDone]);
  return (
    <div className="l-loader" ref={root} aria-hidden>
      <div className="l-loader-lines">
        {BOOT.map((b, i) => <p key={b} style={{ opacity: pct >= (i + 1) * 18 ? 1 : .12 }}>{b}</p>)}
      </div>
      <div className="l-loader-num">{String(pct).padStart(3, "0")}</div>
      <div className="l-loader-bar"><span style={{ transform: `scaleX(${pct / 100})` }} /></div>
    </div>
  );
}

const Tape = ({ text }) => (
  <div className="l-tape" aria-hidden>
    <div className="l-tape-run">{Array.from({ length: 8 }).map((_, i) => <span key={i}>{text} <b>{"///"}</b></span>)}</div>
  </div>
);

const SectionHead = ({ tag, title, accent, children }) => (
  <header className="l-head" data-reveal>
    <p className="l-label l-cy">{tag}</p>
    <h2>{title}<em>{accent}</em></h2>
    {children && <p className="l-head-copy">{children}</p>}
  </header>
);

function Hero({ go, booted }) {
  const root = useRef(null);
  useGsap(() => {
    if (!booted) return;
    if (prefersReduced()) return;
    const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
    tl.fromTo(".l-ch", { yPercent: 115, rotateX: -80, opacity: 0, filter: "blur(10px)" }, { yPercent: 0, rotateX: 0, opacity: 1, filter: "blur(0px)", duration: 1.3, stagger: { each: .035, from: "center" } }, .05)
      .fromTo(".l-badge", { opacity: 0, x: -12 }, { opacity: 1, x: 0, duration: .8, stagger: .08 }, .45)
      .fromTo(".l-rule", { scaleX: 0 }, { scaleX: 1, duration: 1.5, ease: "expo.inOut" }, .3)
      .fromTo(".l-hero-fade", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 1, stagger: .1 }, .7);
    gsap.timeline({ scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true } })
      .to(".l-word-0", { xPercent: -14, ease: "none" }, 0)
      .to(".l-word-1", { xPercent: 12, ease: "none" }, 0)
      .to(".l-title", { yPercent: 26, opacity: .12, ease: "none" }, 0);
  }, [booted], root);

  const near = (e) => {
    e.currentTarget.querySelectorAll(".l-ch").forEach((c) => {
      const r = c.getBoundingClientRect();
      c.classList.toggle("is-near", Math.abs(e.clientX - (r.left + r.width / 2)) < r.width * 1.05);
    });
  };
  const clear = (e) => e.currentTarget.querySelectorAll(".is-near").forEach((c) => c.classList.remove("is-near"));

  return (
    <section ref={root} id="top" className="l-hero">
      <div className="l-grid-bg" />
      <div className="l-hero-glow" />
      <LightField />
      {["tl", "tr", "bl", "br"].map((p) => <i key={p} className={`l-cross l-cross-${p}`} aria-hidden />)}
      <div className="l-hero-in">
        <div className="l-badges">
          {[`LAB // ${profile.location.toUpperCase()}`, "EXPERIENCE: 3+ YRS", "STATUS: TAKING WORK"].map((b) => <span key={b} className="l-badge l-label">[{b}]</span>)}
        </div>
        <h1 className="l-title" onPointerMove={near} onPointerLeave={clear} aria-label={profile.name}>
          {[profile.first, profile.last].map((w, wi) => (
            <span key={w} className={`l-word l-word-${wi}`} aria-hidden>
              {w.split("").map((c, i) => <span key={i} className="l-ch" data-c={c}>{c}</span>)}
            </span>
          ))}
        </h1>
        <div className="l-rule" />
        <div className="l-hero-foot">
          <p className="l-hero-fade l-tag">{profile.line}</p>
          <div className="l-hero-fade l-hero-cta">
            <button className="l-btn l-btn-cy" onClick={() => go("#work")}>▶ See the builds</button>
            <button className="l-btn" onClick={() => go("#contact")}>Work with me ↘</button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Readouts() {
  return (
    <section className="l-readouts" aria-label="Key numbers">
      {stats.map((s, i) => (
        <div key={s.label} className="l-readout" data-reveal>
          <span className="l-label">R-0{i + 1}</span>
          <CountUp value={s.value} suffix={s.suffix} pad={2} className="l-readout-n" />
          <p>{s.label}</p>
        </div>
      ))}
    </section>
  );
}

function ProjectDrawer({ project, onClose }) {
  useEffect(() => {
    if (!project) return undefined;
    const k = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [project, onClose]);
  if (!project) return null;
  return (
    <div className="l-drawer-wrap" onClick={onClose} role="presentation">
      <aside className="l-drawer" role="dialog" aria-modal="true" aria-label={project.title} onClick={(e) => e.stopPropagation()} data-lenis-prevent>
        <div className="l-drawer-bar">
          <span className="l-label l-cy">BUILD FILE // {project.kindLabel}</span>
          <button className="l-label" onClick={onClose} autoFocus>Close ✕</button>
        </div>
        <div className="l-drawer-img"><img src={project.image} alt={`${project.title} screenshot`} /></div>
        <h3>{project.title}</h3>
        <p className="l-drawer-blurb">{project.blurb}</p>
        <dl>
          {project.role && (<><dt className="l-label">Role</dt><dd>{project.role}</dd></>)}
          <dt className="l-label">Stack</dt><dd>{project.tags.join(" · ")}</dd>
        </dl>
        {project.live && <a className="l-btn l-btn-cy" href={project.live} {...external}>Open live ↗</a>}
      </aside>
    </div>
  );
}

function Builds() {
  const root = useRef(null);
  const track = useRef(null);
  const [open, setOpen] = useState(null);
  const desktop = useMedia("(min-width: 900px)");
  useGsap(() => {
    if (!desktop || prefersReduced()) return;
    const el = track.current;
    const distance = () => el.scrollWidth - window.innerWidth;
    const tween = gsap.to(el, {
      x: () => -distance(),
      ease: "none",
      scrollTrigger: { trigger: root.current, pin: true, scrub: 1, start: "top top", end: () => `+=${distance()}`, invalidateOnRefresh: true },
    });
    gsap.utils.toArray(".l-build").forEach((card) => {
      gsap.fromTo(card.querySelector(".l-build-scan"), { xPercent: -100 }, {
        xPercent: 110, ease: "none",
        scrollTrigger: { trigger: card, containerAnimation: tween, start: "left 95%", end: "left 35%", scrub: true },
      });
    });
  }, [desktop], root);

  return (
    <section ref={root} id="work" className="l-builds">
      <div className="l-builds-track" ref={track}>
        <div className="l-builds-intro">
          <p className="l-label l-cy">The workbench</p>
          <h2>Builds<em>.</em></h2>
          <p>Companies I co-founded, and a gallery of 30 projects. Open any file to read it.</p>
          <p className="l-label l-scrollhint">Scroll ———→</p>
        </div>
        {projects.map((p, i) => (
          <button key={p.id} className="l-build" onClick={() => setOpen(p)} aria-label={`Open ${p.title}`}>
            <span className="l-build-meta l-label"><span>BUILD #{String(i + 1).padStart(3, "0")}</span><span>{p.kindLabel}</span></span>
            <span className="l-build-frame">
              <img src={p.image} alt="" loading="lazy" />
              <span className="l-build-scan" />
              <i className="l-tick l-tick-a" /><i className="l-tick l-tick-b" />
            </span>
            <span className="l-build-title">{p.title}</span>
            <span className="l-build-blurb">{p.blurb}</span>
            <span className="l-build-tags l-label">{p.tags.slice(0, 3).join(" · ")}</span>
          </button>
        ))}
        <div className="l-builds-end">
          <p className="l-label l-cy">Next build</p>
          <a href={whatsappWith("Hi Youssef, I have a project to build.")} {...external}>Yours<em>?</em> ↗</a>
        </div>
      </div>
      <ProjectDrawer project={open} onClose={() => setOpen(null)} />
    </section>
  );
}

const WIRE = [
  { id: "caller", x: 60, y: 90, t: "CALLER", d: "Your customer rings a real number.", title: "Someone calls.", body: "After hours, on a busy line, on a holiday. It does not matter: the agent answers on the first ring." },
  { id: "stt", x: 240, y: 90, t: "STT", d: "Speech becomes text as they talk.", title: "It listens.", body: "Speech turns into text while they talk, so the conversation stays a conversation, not a phone menu." },
  { id: "brain", x: 420, y: 90, t: "LLM", d: "A prompt written for your business.", title: "It thinks.", body: "A custom prompt holds your services, tone and rules. It is written around your real call flow, not picked from a menu." },
  { id: "tools", x: 420, y: 230, t: "FUNCTIONS", d: "Booking, leads, FAQs, hand-off.", title: "It acts.", body: "Custom functions book the appointment, capture the lead or look up the answer, inside your own systems." },
  { id: "tts", x: 240, y: 230, t: "TTS", d: "The answer is spoken back.", title: "It answers.", body: "A natural voice speaks the reply. If the caller needs a person, it hands off to your team with the context." },
  { id: "you", x: 60, y: 230, t: "DASHBOARD", d: "You manage prompt and functions.", title: "You stay in control.", body: "I walk you through it, so you can change the prompt and functions yourself after launch." },
];

function Wiring() {
  const root = useRef(null);
  const [step, setStep] = useState(0);
  const path = useMemo(() => WIRE.map((n, i) => `${i ? "L" : "M"}${n.x + 50} ${n.y + 26}`).join(" "), []);
  const desktop = useMedia("(min-width: 900px)");
  useGsap(() => {
    if (prefersReduced()) return;
    gsap.utils.toArray(".l-wire-step").forEach((el, i) => {
      ScrollTrigger.create({ trigger: el, start: "top 58%", end: "bottom 58%", onToggle: (s) => s.isActive && setStep(i) });
    });
  }, [desktop], root);
  return (
    <section ref={root} className="l-wire" id="services">
      <SectionHead tag="Deep dive // Voice agent" title="One call, six parts" accent=".">My signature build, opened up. This is how a voice agent is wired.</SectionHead>
      <div className="l-wire-body">
        <ol className="l-wire-steps">
          {WIRE.map((n, i) => (
            <li key={n.id} className={`l-wire-step${step === i ? " is-on" : ""}`}>
              <span className="l-label">{String(i + 1).padStart(2, "0")}</span>
              <div><h3>{n.title}</h3><p>{n.body}</p></div>
            </li>
          ))}
        </ol>
        <figure className="l-fig">
          <figcaption className="l-label"><span>FIG. 01 — VOICE AGENT, SIGNAL PATH</span><span className="l-cy">STEP {String(step + 1).padStart(2, "0")}/06</span></figcaption>
          <svg viewBox="0 0 540 340" role="img" aria-label="Diagram of a voice agent: caller, speech to text, language model, functions, text to speech, dashboard">
            <path d={path} className="l-fig-path" />
            <path d={path} className="l-fig-flow" />
            {WIRE.map((n, i) => (
              <g key={n.id} className={`l-node${step === i ? " is-on" : ""}${step > i ? " is-past" : ""}`}>
                <rect x={n.x} y={n.y} width="100" height="52" />
                <text x={n.x + 50} y={n.y + 31}>{n.t}</text>
              </g>
            ))}
            <text x="60" y="40" className="l-fig-note">{WIRE[step].d.toUpperCase()}</text>
            <path d="M60 50 H480" className="l-fig-dim" />
          </svg>
        </figure>
      </div>
    </section>
  );
}

function ServiceSpecs() {
  return (
    <section className="l-specs">
      <SectionHead tag="Capabilities" title="What I build" accent="." />
      <div className="l-spec-grid">
        {services.map((s) => (
          <article key={s.num} className="l-spec" data-reveal>
            <span className="l-label l-or">SPEC {s.num}</span>
            <h3>{s.title}</h3>
            <p className="l-spec-short">{s.short}</p>
            <p>{s.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function Logbook() {
  return (
    <section id="about" className="l-log">
      <SectionHead tag="Origin // Logbook" title="The engineer" accent=".">{profile.short}</SectionHead>
      <div className="l-log-grid">
        <figure className="l-portrait" data-reveal>
          <img src={profile.photo} alt={`Portrait of ${profile.name}`} loading="lazy" />
          <figcaption className="l-label"><span>SUBJECT: Y. DEGACHI</span><span className="l-cy">{profile.location}</span></figcaption>
        </figure>
        <div className="l-log-tables">
          {[["Experience", experience], ["Education", education]].map(([title, rows]) => (
            <div key={title} data-reveal>
              <h3 className="l-label l-or">{title}</h3>
              <ul>
                {rows.map((r) => (
                  <li key={`${r.org}${r.role}`}>
                    <span className="l-log-when">{r.when}</span>
                    <span className="l-log-role">{r.role}</span>
                    <span className="l-log-org">{r.href ? <a href={r.href} {...external}>{r.org} ↗</a> : r.org}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div data-reveal>
            <h3 className="l-label l-or">Toolkit</h3>
            {Object.entries(skills).map(([k, v]) => (
              <p key={k} className="l-skill-row"><b>{k}</b>{v.map((x) => <span key={x}>{x}</span>)}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Terminal({ go, onLights }) {
  const [lines, setLines] = useState([{ k: "out", t: "yd-lab shell. Type help to look around." }]);
  const [value, setValue] = useState("");
  const body = useRef(null);
  const input = useRef(null);
  useEffect(() => { body.current?.scrollTo({ top: body.current.scrollHeight }); }, [lines]);
  const run = (raw) => {
    const cmd = raw.trim().toLowerCase();
    const out = [{ k: "in", t: raw }];
    const say = (t, k = "out") => out.push({ k, t });
    if (cmd === "clear") { setLines([]); setValue(""); return; }
    if (cmd === "help") ["whoami    who runs this lab", "work      go to the builds", "pricing   go to the prices", "contact   open the door", "whatsapp  message me now", "cv        download my CV", "socials   where to find me", "lights    you'll see", "v1…v6     switch design"].forEach((t) => say(t));
    else if (cmd === "whoami") say(`${profile.name}. ${profile.role}. 3+ years of experience building systems and ERPs for real clients.`);
    else if (cmd === "work") { say("→ moving to the workbench…", "ok"); go("#work"); }
    else if (cmd === "pricing") { say("→ opening the price sheet…", "ok"); go("#pricing"); }
    else if (cmd === "contact") { say("→ opening the door…", "ok"); go("#contact"); }
    else if (cmd === "whatsapp") { say("→ opening WhatsApp…", "ok"); window.open(profile.whatsapp, "_blank", "noopener"); }
    else if (cmd === "cv") { say("→ downloading CV…", "ok"); window.open(profile.cv, "_blank", "noopener"); }
    else if (cmd === "socials") socials.forEach((s) => say(`${s.label.padEnd(10)}${s.href}`));
    else if (cmd === "lights") { say("▓▓▓ LIGHTS ON ▓▓▓", "ok"); onLights(); }
    else if (cmd === "sudo hire youssef") say("Permission granted. Now run: whatsapp", "ok");
    else if (VERSIONS.some((v) => v.id === cmd)) { say(`→ loading ${cmd}…`, "ok"); window.location.href = asset(cmd); }
    else if (cmd) say(`command not found: ${cmd}. try help`, "err");
    setLines((l) => [...l, ...out].slice(-60));
    setValue("");
  };
  return (
    <div className="l-term" onClick={() => input.current?.focus()}>
      <div className="l-term-bar"><i /><i /><i /><span className="l-label">youssef@lab:~</span></div>
      <div ref={body} className="l-term-body" data-lenis-prevent aria-live="polite">
        {lines.map((l, i) => <div key={i} className={`l-t-${l.k}`}>{l.k === "in" && <b>$ </b>}{l.t}</div>)}
        <form onSubmit={(e) => { e.preventDefault(); run(value); }}>
          <b>$&nbsp;</b>
          <label htmlFor="l-term-input" className="sr-only">Terminal command</label>
          <input id="l-term-input" ref={input} value={value} onChange={(e) => setValue(e.target.value)} autoComplete="off" autoCapitalize="off" spellCheck={false} placeholder="type help" />
        </form>
      </div>
    </div>
  );
}

export default function V1() {
  usePage({ title: "Youssef Degachi — The Lab", bg: "#07080a", fonts: "family=JetBrains+Mono:wght@400;500&family=Space+Grotesk:wght@400;500;600;700" });
  const { go } = useSmoothScroll();
  const seen = useRef(false);
  try { seen.current = sessionStorage.getItem("yd-v1-boot") === "1"; } catch { /* storage blocked */ }
  const [booted, setBooted] = useState(() => seen.current || prefersReduced());
  const [sweeping, setSweeping] = useState(false);
  const root = useRef(null);
  const finish = useRef(() => { try { sessionStorage.setItem("yd-v1-boot", "1"); } catch { /* storage blocked */ } setBooted(true); });

  useGsap(() => {
    if (prefersReduced()) return;
    gsap.utils.toArray("[data-reveal]").forEach((el) => {
      gsap.fromTo(el, { opacity: 0, y: 34 }, { opacity: 1, y: 0, duration: 1, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 90%" } });
    });
  }, [], root);

  const lights = () => { setSweeping(true); setTimeout(() => setSweeping(false), 1100); };

  return (
    <div className="vroot lab" ref={root}>
      {!booted && <Loader onDone={finish.current} />}
      {sweeping && <div className="l-sweep" aria-hidden />}
      <nav className="l-nav" aria-label="Main">
        <button className="l-logo l-label" onClick={() => go("#top")}><i />YD // LAB</button>
        <div className="l-nav-links l-label">
          {navLinks.slice(0, 4).map((l) => <button key={l.id} onClick={() => go(`#${l.id}`)}>{l.label}</button>)}
        </div>
        <button className="l-btn l-btn-or l-btn-sm" onClick={() => go("#contact")}>Work with me</button>
      </nav>
      <main>
        <Hero go={go} booted={booted} />
        <Readouts />
        <Tape text="3+ YEARS OF EXPERIENCE // SYSTEMS & ERPS // VOICE AGENTS // FULLSTACK // SHIPPING FROM TUNISIA" />
        <Builds />
        <Wiring />
        <ServiceSpecs />
        <section id="pricing" className="l-price">
          <SectionHead tag="Price sheet" title="What it costs" accent="." />
          <PricingBlock ctaLabel="Start on WhatsApp" />
          <div className="l-faq"><h3 className="l-label l-or">Before you ask</h3><FaqList /></div>
        </section>
        <Logbook />
        <Tape text="OPEN FOR WORK // BRING A REAL PROBLEM // WHATSAPP IS FASTEST" />
        <section id="contact" className="l-contact">
          <div data-reveal>
            <p className="l-label l-cy">Open the door</p>
            <h2>Bring me a<br />real problem<em>.</em></h2>
            <p className="l-contact-copy">{profile.availability}. WhatsApp is the fastest way to reach me.</p>
            <div className="l-contact-cta">
              <a className="l-btn l-btn-cy" href={profile.whatsapp} {...external}>WhatsApp {profile.phone}</a>
              <a className="l-btn" href={`mailto:${profile.email}`}>{profile.email}</a>
              <a className="l-btn" href={profile.cv} download>Download CV ↓</a>
            </div>
          </div>
          <Terminal go={go} onLights={lights} />
        </section>
      </main>
      <footer className="l-foot l-label">
        <span>© {new Date().getFullYear()} {profile.name}</span>
        <span className="l-foot-links">{socials.map((s) => <a key={s.label} href={s.href} {...external}>{s.label}</a>)}</span>
      </footer>
    </div>
  );
}
