import { useEffect, useRef, useState } from "react";
import { profile, projects, services, allSkills, socials, navLinks } from "../content";
import { OFFERS, formatPrice, currencyByCode } from "@/data/pricing";
import { CountUp, FaqList, PricingBlock, external, gsap, prefersReduced, usePage, useGsap, useMedia, useSmoothScroll, useTunisTime, ScrollTrigger } from "../shared";
import "./v2.css";

const POSE = { hour: -38, minute: 38, second: 180 };
const C = 200;
const RED = "#d6112f";
const BONE = "#f4f2ee";
const rot = (el, deg) => el?.setAttribute("transform", `rotate(${deg} ${C} ${C})`);

/** The mark: three clock hands that, at rest, spell a Y. */
function Mark({ refs = {}, dial = false, className, title = "Y clock mark" }) {
  return (
    <svg viewBox={dial ? "-44 -44 488 488" : "0 0 400 400"} className={className} role="img" aria-label={title}>
      {dial && (
        <g ref={refs.dial} aria-hidden>
          {Array.from({ length: 60 }).map((_, i) => {
            const major = i % 5 === 0;
            return <line key={i} className="t-tick" x1={C} y1={C - 238} x2={C} y2={C - (major ? 214 : 226)} stroke={BONE} strokeOpacity={major ? .5 : .22} strokeWidth={major ? 3 : 1.6} strokeLinecap="round" transform={`rotate(${i * 6} ${C} ${C})`} />;
          })}
        </g>
      )}
      <g ref={refs.hour} transform={`rotate(${POSE.hour} ${C} ${C})`}>
        <line x1={C} y1={C - 8} x2={C} y2={C - 34} stroke={BONE} strokeWidth={6} strokeLinecap="round" />
        <line x1={C} y1={C - 38} x2={C} y2={C - 150} stroke={BONE} strokeWidth={20} strokeLinecap="round" />
      </g>
      <g ref={refs.minute} transform={`rotate(${POSE.minute} ${C} ${C})`}>
        <line x1={C} y1={C - 8} x2={C} y2={C - 34} stroke={BONE} strokeWidth={6} strokeLinecap="round" />
        <line x1={C} y1={C - 38} x2={C} y2={C - 150} stroke={BONE} strokeWidth={20} strokeLinecap="round" />
      </g>
      <g ref={refs.second} transform={`rotate(${POSE.second} ${C} ${C})`}>
        <line x1={C} y1={C + 34} x2={C} y2={C - 196} stroke={RED} strokeWidth={5} strokeLinecap="round" />
      </g>
      <circle cx={C} cy={C} r={9.5} fill={BONE} /><circle cx={C} cy={C} r={6.5} fill={RED} /><circle cx={C} cy={C} r={2.2} fill="#000" />
    </svg>
  );
}

const CHAPTERS = [
  { at: "15", title: "I learned by shipping.", body: "3+ years of experience building systems and ERPs for real clients." },
  { at: "30", title: "Then I studied it.", body: "ISET Tozeur, 2022 to 2025. Then design, data structures and a lot of nights." },
  { at: "45", title: "Then I taught software to talk.", body: "Building with AI: voice agents, chatbots and automations that do real work." },
  { at: "60", title: "Now I build companies.", body: "Co-founder of Andalib AI, JeridSchool and NEXT Vision Services." },
];

function Minute() {
  const root = useRef(null);
  const stage = useRef(null);
  const refs = { hour: useRef(null), minute: useRef(null), second: useRef(null), dial: useRef(null) };
  const readout = useRef(null);
  const sec = useRef(null);
  useGsap(() => {
    if (prefersReduced()) return;
    const ticks = gsap.utils.toArray(".t-tick", refs.dial.current);
    let lit = 0;
    const START = 30; // red hand rests on 30 s
    const paint = (n) => {
      if (n === lit) return;
      const [a, b] = [Math.min(n, lit), Math.max(n, lit)];
      for (let k = a; k < b; k += 1) {
        const i = (START + k) % 60;
        const on = k < n;
        ticks[i].setAttribute("stroke", on ? RED : BONE);
        ticks[i].setAttribute("stroke-opacity", on ? "1" : i % 5 === 0 ? ".5" : ".22");
      }
      lit = n;
    };
    const render = (p) => {
      rot(refs.second.current, POSE.second + p * 360);
      paint(Math.floor(p * 60 + .0001));
      const s = Math.round(p * 60);
      if (readout.current) readout.current.textContent = s === 60 ? "01:00" : `00:${String(s).padStart(2, "0")}`;
      if (sec.current) sec.current.textContent = String((START + s) % 60).padStart(2, "0");
    };
    // intro: hands sweep in from 12
    const h = { d: 0 }; const m = { d: 0 }; const r = { d: POSE.second - 720 };
    const set = () => { rot(refs.hour.current, h.d); rot(refs.minute.current, m.d); if (scroller.progress === 0) rot(refs.second.current, r.d); };
    const scroller = ScrollTrigger.create({
      trigger: root.current, start: "top top", end: "+=300%", pin: stage.current, scrub: true,
      onUpdate: (s) => render(s.progress), onLeave: () => render(1), onLeaveBack: () => render(0),
    });
    gsap.timeline({ defaults: { ease: "expo.out" }, onUpdate: set })
      .from(ticks, { opacity: 0, duration: .5, stagger: .012 }, 0)
      .to(h, { d: POSE.hour, duration: 1.8 }, .25)
      .to(m, { d: POSE.minute, duration: 2 }, .25)
      .to(r, { d: POSE.second, duration: 2.3, ease: "power4.out" }, .25)
      .from(".t-word", { yPercent: 110, duration: 1.3, stagger: .05 }, .8)
      .from(".t-fade", { opacity: 0, y: 14, duration: 1, stagger: .07 }, 1.1);

    const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: "top top", end: "+=300%", scrub: true } });
    tl.to(".t-intro", { opacity: 0, y: -30, duration: .06 }, .01);
    gsap.utils.toArray(".t-chapter").forEach((el, i) => {
      const a = (i + 1) * .24 - .17;
      tl.fromTo(el, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: .04 }, a);
      if (i < 3) tl.to(el, { opacity: 0, y: -40, duration: .04 }, a + .18);
    });
    tl.fromTo(".t-done", { opacity: 0 }, { opacity: 1, duration: .04 }, .95);
  }, [], root);

  return (
    <section ref={root} id="top" className="t-minute" aria-label={profile.name}>
      <div ref={stage} className="t-stage">
        <div className="t-glow" />
        <div className="t-clock"><Mark refs={refs} dial className="t-clock-svg" /></div>
        <div className="t-meta">
          <span className="t-fade t-tag">{profile.name} — {profile.location}</span>
          <span className="t-fade t-tag t-right">Second <b ref={sec}>30</b></span>
        </div>
        <div className="t-copy t-intro">
          <h1 className="t-serif">
            {"3+ years. Real clients.".split(" ").map((w, i) => <span key={i} className="t-mask"><span className="t-word">{w}&nbsp;</span></span>)}
            <span className="t-mask"><span className="t-word"><em>One&nbsp;turn.</em></span></span>
          </h1>
          <p className="t-fade t-tag t-mute">{profile.role}. Scroll to turn the hand.</p>
        </div>
        {CHAPTERS.map((c) => (
          <div key={c.at} className="t-copy t-chapter">
            <span className="t-tag t-hot">+00:{c.at}</span>
            <h2 className="t-serif">{c.title}</h2>
            <p>{c.body}</p>
          </div>
        ))}
        <div className="t-readout">
          <span className="t-fade t-tag t-mute">Elapsed <b ref={readout}>00:00</b> / 01:00</span>
          <span className="t-done t-tag t-hot">One turn. Now the work ↓</span>
          <span className="t-fade t-tag t-mute t-desk">Scroll to turn the hand</span>
        </div>
      </div>
    </section>
  );
}

function BuildsIndex() {
  const preview = useRef(null);
  const [hover, setHover] = useState(null);
  const [open, setOpen] = useState(null);
  const touch = useMedia("(hover: none), (pointer: coarse), (max-width: 860px)");
  const root = useRef(null);
  useEffect(() => {
    if (touch || !preview.current) return undefined;
    const el = preview.current;
    const xTo = gsap.quickTo(el, "x", { duration: .6, ease: "power3" });
    const yTo = gsap.quickTo(el, "y", { duration: .6, ease: "power3" });
    const rTo = gsap.quickTo(el, "rotation", { duration: .8, ease: "power3" });
    let lx = 0;
    const move = (e) => { xTo(e.clientX); yTo(e.clientY); rTo(gsap.utils.clamp(-10, 10, (e.clientX - lx) * .4)); lx = e.clientX; };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [touch]);
  useEffect(() => {
    if (!preview.current) return;
    gsap.to(preview.current.firstChild, { scale: hover === null ? 0 : 1, opacity: hover === null ? 0 : 1, duration: .5, ease: "expo.out" });
  }, [hover]);
  useEffect(() => {
    if (!open) return undefined;
    const k = (e) => e.key === "Escape" && setOpen(null);
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [open]);
  useGsap(() => {
    if (prefersReduced()) return;
    gsap.utils.toArray(".t-row").forEach((row) => {
      gsap.timeline({ scrollTrigger: { trigger: row, start: "top 90%" } })
        .from(row.querySelector(".t-row-rule"), { scaleX: 0, duration: 1.1, ease: "expo.inOut" })
        .from(row.querySelector(".t-row-title"), { yPercent: 105, duration: 1, ease: "expo.out" }, .15)
        .from(row.querySelectorAll(".t-row-fade"), { opacity: 0, duration: .7, stagger: .05 }, .3);
    });
  }, [], root);
  return (
    <section ref={root} id="work" className="t-section">
      <div className="t-wrap">
        <div className="t-split-head">
          <h2 className="t-serif t-h">Things I <em>actually</em><br />shipped.</h2>
          <p>Three companies and one gallery. {touch ? "Tap one to look closer." : "Hover to preview, click to look closer."}</p>
        </div>
        <ul className="t-rows" onMouseLeave={() => setHover(null)}>
          {projects.map((p, i) => (
            <li key={p.id} className="t-row">
              <span className="t-row-rule" />
              <button onClick={() => setOpen(p)} onMouseEnter={() => setHover(i)} onFocus={() => setHover(i)} onBlur={() => setHover(null)} className={hover !== null && hover !== i ? "is-dim" : ""}>
                <span className="t-row-fade t-tag t-hot">{String(i + 1).padStart(2, "0")}</span>
                <span className="t-row-clip"><span className="t-row-title"><span className="t-row-slide t-serif">{p.title}</span></span></span>
                <span className="t-row-fade t-row-copy"><span>{p.blurb}</span><span className="t-tag t-mute">{p.kindLabel} · {p.tags.slice(0, 2).join(" · ")}</span></span>
                <span className="t-row-fade t-arrow" aria-hidden>↗</span>
                {touch && p.image && <img className="t-row-thumb" src={p.image} alt="" loading="lazy" />}
              </button>
            </li>
          ))}
        </ul>
      </div>
      {!touch && (
        <div ref={preview} className="t-preview" aria-hidden>
          <div className="t-preview-card">
            {projects.map((p, i) => <img key={p.id} src={p.image} alt="" loading="lazy" style={{ opacity: hover === i ? 1 : 0 }} />)}
          </div>
        </div>
      )}
      {open && (
        <div className="t-modal" role="dialog" aria-modal="true" aria-label={open.title} onClick={() => setOpen(null)}>
          <div className="t-modal-in" onClick={(e) => e.stopPropagation()} data-lenis-prevent>
            <div className="t-modal-bar"><span className="t-tag t-hot">{open.kindLabel}</span><button className="t-tag" onClick={() => setOpen(null)} autoFocus>Close ✕</button></div>
            <img src={open.image} alt={`${open.title} screenshot`} />
            <div className="t-modal-copy">
              <h3 className="t-serif">{open.title}</h3>
              <div><p>{open.blurb}</p>{open.role && <p className="t-mute">{open.role}</p>}<p className="t-tag t-mute">{open.tags.join(" · ")}</p>
                {open.live && <a className="t-pill" href={open.live} {...external}>Visit the site ↗</a>}</div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function SubDial({ quarter }) {
  return (
    <svg viewBox="0 0 100 100" className="t-subdial" aria-hidden>
      {Array.from({ length: 60 }).map((_, i) => {
        const on = i >= (quarter - 1) * 15 && i < quarter * 15;
        return <line key={i} x1="50" y1="5" x2="50" y2={i % 5 ? 8 : 11} stroke={on ? RED : BONE} strokeOpacity={on ? 1 : .25} strokeWidth={i % 5 ? .8 : 1.3} transform={`rotate(${i * 6} 50 50)`} />;
      })}
      <path d={`M50 50 L50 16`} stroke={RED} strokeWidth="1.5" strokeLinecap="round" className="t-subhand" data-to={quarter * 90} />
      <circle cx="50" cy="50" r="2.2" fill={BONE} />
    </svg>
  );
}

function Quarters() {
  const root = useRef(null);
  useGsap(() => {
    if (prefersReduced()) return;
    gsap.utils.toArray(".t-subhand").forEach((hand) => {
      gsap.fromTo(hand, { rotation: 0, svgOrigin: "50 50" }, { rotation: Number(hand.dataset.to), svgOrigin: "50 50", ease: "none", scrollTrigger: { trigger: hand.closest("article"), start: "top 90%", end: "top 40%", scrub: true } });
    });
  }, [], root);
  return (
    <section ref={root} id="services" className="t-section t-ink">
      <div className="t-wrap">
        <h2 className="t-serif t-h">Four quarters <em>of the work.</em></h2>
        <div className="t-quarters">
          {services.map((s, i) => (
            <article key={s.num}>
              <SubDial quarter={i + 1} />
              <span className="t-tag t-hot">Q{i + 1}</span>
              <h3 className="t-serif">{s.title}</h3>
              <p>{s.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function VoiceFeature() {
  const root = useRef(null);
  const offer = OFFERS.find((o) => o.id === "voice-agent") || OFFERS[0];
  useGsap(() => {
    if (prefersReduced()) return;
    gsap.fromTo(".t-eq i", { scaleY: .08 }, { scaleY: (i) => .25 + Math.abs(Math.sin(i * .62)) * .75, stagger: .012, ease: "none", scrollTrigger: { trigger: root.current, start: "top 75%", end: "center 45%", scrub: true } });
  }, [], root);
  return (
    <section ref={root} className="t-section">
      <div className="t-wrap t-voice">
        <div>
          <h2 className="t-serif t-h">Some calls <em>can&rsquo;t wait.</em></h2>
          <p className="t-lead">{offer.description}</p>
          <p>Every project starts with a discovery meeting, then I build the agent around your real call flow: the questions people actually ask, the actions they expect, and the tone that fits your brand.</p>
          <div className="t-counts">
            <div><CountUp value={3} suffix="+" className="t-serif" /><span className="t-tag t-mute">Years of experience</span></div>
            <div><span className="t-serif">{formatPrice(offer.priceUSD, currencyByCode("USD"))}</span><span className="t-tag t-mute">Starting price</span></div>
          </div>
          <a className="t-pill" href={profile.whatsapp} {...external}>Talk about your calls ↗</a>
        </div>
        <div className="t-eq" aria-hidden>{Array.from({ length: 56 }).map((_, i) => <i key={i} style={{ transform: `scaleY(${(.25 + Math.abs(Math.sin(i * .62)) * .75).toFixed(3)})` }} />)}</div>
      </div>
    </section>
  );
}

const ORIGIN = [
  { y: "2022", t: "ISET Tozeur", d: "Software development, until 2025." },
  { y: "2023", t: "Full-stack bootcamp", d: "Plus data structures, algorithms, and Yanfaa Academy for design." },
  { y: "Intern", t: "Web Agency Tozeur", d: "Six months as a full stack developer on real client work." },
  { y: "2024", t: "CodeCooperation", d: "Software developer student, through 2025." },
  { y: "2025", t: "Co-founder", d: "Andalib AI and JeridSchool, then NEXT Vision Services." },
  { y: "Now", t: "Still building", d: "Voice agents, platforms, and whatever your business needs next." },
];

function Origin() {
  const root = useRef(null);
  const bezel = useRef(null);
  const [idx, setIdx] = useState(0);
  const STEP = 24;
  useGsap(() => {
    if (prefersReduced()) { setIdx(ORIGIN.length - 1); return; }
    ScrollTrigger.create({
      trigger: root.current, start: "top top", end: "+=260%", pin: true, scrub: true,
      onUpdate: (s) => {
        const p = s.progress * (ORIGIN.length - 1);
        bezel.current?.setAttribute("transform", `rotate(${-p * STEP} 500 500)`);
        setIdx(Math.round(p));
      },
    });
  }, [], root);
  const item = ORIGIN[idx];
  return (
    <section ref={root} id="about" className="t-origin">
      <div className="t-origin-head">
        <img src={profile.photo} alt={`Portrait of ${profile.name}`} loading="lazy" />
        <div>
          <span className="t-tag t-hot">Origin</span>
          <h2 className="t-serif">From first site <em>to founder.</em></h2>
        </div>
      </div>
      <div className="t-origin-now" key={item.t} aria-live="polite">
        <span className="t-tag t-hot">{item.y}</span>
        <h3 className="t-serif">{item.t}</h3>
        <p>{item.d}</p>
      </div>
      <svg viewBox="0 0 1000 1000" className="t-bezel" aria-hidden>
        <path d="M500 40 l-13 -24 h26 z" fill={RED} />
        <g ref={bezel}>
          {Array.from({ length: 120 }).map((_, i) => <line key={i} x1="500" y1="50" x2="500" y2={i % 4 === 0 ? 86 : 64} stroke={BONE} strokeOpacity={i % 4 === 0 ? .55 : .2} strokeWidth={i % 4 === 0 ? 2 : 1} transform={`rotate(${i * 3} 500 500)`} />)}
          {ORIGIN.map((o, i) => (
            <g key={o.t} transform={`rotate(${i * STEP} 500 500)`}>
              <circle cx="500" cy="68" r={i === idx ? 9 : 6} fill={i <= idx ? RED : "#6a6a6a"} />
              <text x="500" y="124" textAnchor="middle" className="t-bezel-t" fill={BONE} opacity={i === idx ? 1 : .45}>{o.y}</text>
            </g>
          ))}
        </g>
      </svg>
    </section>
  );
}

function Skills() {
  const row = [...allSkills, ...allSkills];
  return <div className="t-marquee" aria-label={`Skills: ${allSkills.join(", ")}`}><div aria-hidden>{row.map((s, i) => <span key={i} className="t-serif">{s}<i>/</i></span>)}</div></div>;
}

function LiveClock() {
  const now = useTunisTime(true);
  const [h, m, s] = now.split(":").map(Number);
  return (
    <div className="t-live">
      <svg viewBox="0 0 400 400" aria-hidden>
        <circle cx="200" cy="200" r="194" fill="none" stroke={BONE} strokeOpacity=".2" strokeWidth="3" />
        <line x1="200" y1="200" x2="200" y2="96" stroke={BONE} strokeWidth="16" strokeLinecap="round" transform={`rotate(${(h % 12) * 30 + m * .5} 200 200)`} />
        <line x1="200" y1="200" x2="200" y2="50" stroke={BONE} strokeWidth="11" strokeLinecap="round" transform={`rotate(${m * 6} 200 200)`} />
        <line x1="200" y1="230" x2="200" y2="20" stroke={RED} strokeWidth="5" strokeLinecap="round" transform={`rotate(${s * 6} 200 200)`} />
        <circle cx="200" cy="200" r="9" fill={RED} />
      </svg>
      <div><span className="t-tag t-mute">Tunisia, right now</span><strong className="t-serif">{now.slice(0, 5)}</strong></div>
    </div>
  );
}

export default function V2() {
  usePage({ title: "Youssef Degachi — The Turn", bg: "#000", fonts: "family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500&family=Geist+Mono:wght@400;500" });
  const { go } = useSmoothScroll({ lerp: .08 });
  const root = useRef(null);
  useGsap(() => {
    if (prefersReduced()) return;
    gsap.utils.toArray("[data-reveal]").forEach((el) => gsap.from(el, { opacity: 0, y: 30, duration: 1.1, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 88%" } }));
    gsap.from(".t-got span", { yPercent: 110, duration: 1.3, stagger: .08, ease: "expo.out", scrollTrigger: { trigger: ".t-got", start: "top 85%" } });
  }, [], root);
  return (
    <div className="vroot turn" ref={root}>
      <div className="t-nav-fade" aria-hidden />
      <nav className="t-nav" aria-label="Main">
        <button onClick={() => go("#top")} aria-label="Back to top"><Mark className="t-nav-mark" title="Y mark" /></button>
        <div className="t-tag">{navLinks.map((l) => <button key={l.id} onClick={() => go(`#${l.id}`)}>{l.label}</button>)}</div>
      </nav>
      <main>
        <Minute />
        <BuildsIndex />
        <Skills />
        <Quarters />
        <VoiceFeature />
        <Origin />
        <section id="pricing" className="t-section t-ink">
          <div className="t-wrap">
            <h2 className="t-serif t-h" data-reveal>What a <em>minute</em> costs.</h2>
            <PricingBlock ctaLabel="Start on WhatsApp" />
            <div className="t-faq"><h3 className="t-serif" data-reveal>Before you ask.</h3><FaqList /></div>
          </div>
        </section>
        <section id="contact" className="t-section t-contact">
          <div className="t-wrap">
            <h2 className="t-got t-serif"><span className="t-mask"><span>Got a</span></span><br /><span className="t-mask"><span><em>minute?</em></span></span></h2>
            <div className="t-contact-row">
              <p className="t-lead">{profile.availability}. Tell me what you&rsquo;re building. WhatsApp is the fastest way to reach me.</p>
              <div className="t-contact-links">
                <a className="t-pill t-pill-red" href={profile.whatsapp} {...external}>WhatsApp {profile.phone} ↗</a>
                <a className="t-pill" href={`mailto:${profile.email}`}>{profile.email}</a>
                <a className="t-pill" href={profile.cv} download>Download CV ↓</a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="t-foot">
        <LiveClock />
        <div className="t-tag">{socials.map((s) => <a key={s.label} href={s.href} {...external}>{s.label}</a>)}</div>
        <p className="t-tag t-mute">© {new Date().getFullYear()} {profile.name}</p>
      </footer>
    </div>
  );
}
