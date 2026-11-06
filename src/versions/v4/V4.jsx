import { useEffect, useMemo, useRef, useState } from "react";
import { profile, products, services, experience, education, skills, allSkills, socials, navLinks, whatsappWith } from "../content";
import { FAQ } from "@/data/pricing";
import { CountUp, FaqList, PricingBlock, Scramble, external, gsap, prefersReduced, usePage, useGsap, useMedia, useSmoothScroll, useTunisTime } from "../shared";
import ContourField from "./ContourField";
import "./v4.css";

const STEPS = FAQ.find((f) => f.id === "steps").a[0].items;

/** Cards share one spotlight: a soft red glow that follows the pointer. */
function useSpotlight(ref) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return undefined;
    const move = (e) => {
      root.querySelectorAll(".o-cell").forEach((c) => {
        const r = c.getBoundingClientRect();
        c.style.setProperty("--mx", `${e.clientX - r.left}px`);
        c.style.setProperty("--my", `${e.clientY - r.top}px`);
      });
    };
    root.addEventListener("pointermove", move, { passive: true });
    return () => root.removeEventListener("pointermove", move);
  }, [ref]);
}

function Waveform() {
  const bars = useMemo(() => Array.from({ length: 34 }).map((_, i) => ({ h: 22 + Math.abs(Math.sin(i * .7) * Math.cos(i * .23)) * 78, d: (i % 7) * .09 })), []);
  return <div className="o-wave" aria-hidden>{bars.map((b, i) => <i key={i} style={{ height: `${b.h}%`, animationDelay: `${b.d}s` }} />)}</div>;
}

function Palette({ go, open, setOpen }) {
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const input = useRef(null);
  const actions = useMemo(() => [
    ...navLinks.map((l) => ({ label: `Go to ${l.label}`, hint: "Jump", run: () => go(`#${l.id}`) })),
    { label: "Message me on WhatsApp", hint: "Fastest", run: () => window.open(profile.whatsapp, "_blank", "noopener") },
    { label: "Send an email", hint: profile.email, run: () => { window.location.href = `mailto:${profile.email}`; } },
    { label: "Download my CV", hint: "PDF", run: () => window.open(profile.cv, "_blank", "noopener") },
    ...products.map((p) => ({ label: `Open ${p.title}`, hint: "Product", run: () => window.open(p.live, "_blank", "noopener") })),
    ...socials.map((s) => ({ label: s.label, hint: "Social", run: () => window.open(s.href, "_blank", "noopener") })),
  ], [go]);
  const list = actions.filter((a) => a.label.toLowerCase().includes(q.trim().toLowerCase()));
  useEffect(() => { if (open) { setQ(""); setActive(0); setTimeout(() => input.current?.focus(), 20); } }, [open]);
  if (!open) return null;
  const run = (a) => { setOpen(false); a?.run(); };
  return (
    <div className="o-pal-wrap" onClick={() => setOpen(false)} role="presentation">
      <div className="o-pal" role="dialog" aria-modal="true" aria-label="Command menu" onClick={(e) => e.stopPropagation()}>
        <input ref={input} value={q} placeholder="What do you need?" aria-label="Search actions"
          onChange={(e) => { setQ(e.target.value); setActive(0); }}
          onKeyDown={(e) => {
            if (e.key === "Escape") setOpen(false);
            if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, list.length - 1)); }
            if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
            if (e.key === "Enter") run(list[active]);
          }} />
        <ul data-lenis-prevent>
          {list.map((a, i) => (
            <li key={a.label}><button className={i === active ? "is-on" : ""} onMouseEnter={() => setActive(i)} onClick={() => run(a)}><span>{a.label}</span><em>{a.hint}</em></button></li>
          ))}
          {!list.length && <li className="o-pal-empty">Nothing there. Try “pricing”.</li>}
        </ul>
      </div>
    </div>
  );
}

function Hero({ go }) {
  const root = useRef(null);
  const time = useTunisTime();
  useSpotlight(root);
  useGsap(() => {
    if (prefersReduced()) return;
    const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
    tl.from(".o-title span", { yPercent: 108, duration: 1.3, stagger: .03 }, .1)
      .from(".o-cell", { opacity: 0, y: 40, scale: .97, duration: 1, stagger: .05 }, .5);
    gsap.to(".o-title", { yPercent: -14, ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true } });
  }, [], root);
  return (
    <section ref={root} id="top" className="o-hero">
      <ContourField />
      <div className="o-hero-in">
        <h1 className="o-title" aria-label={profile.name}>
          <div aria-hidden>{profile.first.toUpperCase().split("").map((c, i) => <span key={i}>{c}</span>)}<b>.</b></div>
        </h1>
        <div className="o-bento">
          <div className="o-cell o-c-intro">
            <p className="o-kicker"><i className="o-live" /> {profile.availability}</p>
            <h2>I build web products. <em>And the AI that answers their phones.</em></h2>
            <div className="o-actions">
              <a className="o-btn o-btn-red" href={profile.whatsapp} {...external}>Start on WhatsApp <span>↗</span></a>
              <button className="o-btn" onClick={() => go("#work")}>See the work</button>
            </div>
          </div>
          <figure className="o-cell o-c-photo">
            <img src={profile.photo} alt={`Portrait of ${profile.name}`} />
            <figcaption><strong>{profile.name}</strong><span>{profile.role}</span></figcaption>
          </figure>
          <a className="o-cell o-c-voice" href="#pricing" onClick={(e) => { e.preventDefault(); go("#pricing"); }}>
            <p className="o-kicker">Signature build</p>
            <Waveform />
            <h3>Voice AI agents <span>↗</span></h3>
            <p>Answer calls, qualify leads, book appointments.</p>
          </a>
          <div className="o-cell o-c-stat o-c-big"><CountUp value={3} suffix="+" className="o-num" /><p>years of experience</p></div>
          <div className="o-cell o-c-stat"><CountUp value={30} suffix="+" className="o-num" /><p>projects shipped</p></div>
          <div className="o-cell o-c-time">
            <p className="o-kicker">{profile.location}</p>
            <strong>{time}</strong>
            <p>{profile.languages.join(" · ")}</p>
          </div>
          <div className="o-cell o-c-stack">
            <p className="o-kicker">Daily stack</p>
            <div className="o-stack-run"><div>{[...allSkills, ...allSkills].map((s, i) => <span key={i}>{s}</span>)}</div></div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Deck() {
  const root = useRef(null);
  const desktop = useMedia("(min-width: 760px)");
  useGsap(() => {
    if (!desktop || prefersReduced()) return;
    const cards = gsap.utils.toArray(".o-deck-card");
    cards.forEach((card, i) => {
      if (i === cards.length - 1) return;
      gsap.to(card.firstElementChild, { scale: .9 + i * .015, filter: "brightness(.45)", ease: "none", scrollTrigger: { trigger: cards[i + 1], start: "top bottom", end: "top 90px", scrub: true } });
    });
  }, [desktop], root);
  return (
    <section ref={root} id="work" className="o-section">
      <div className="o-head">
        <Scramble as="p" text="SELECTED WORK" className="o-kicker" />
        <h2>Companies I built<em>, not just pages.</em></h2>
      </div>
      <div className="o-deck">
        {products.map((p, i) => (
          <article key={p.id} className="o-deck-card" style={{ top: `${72 + i * 14}px` }}>
            <div className="o-deck-in">
              <div className="o-deck-copy">
                <p className="o-kicker">{String(i + 1).padStart(2, "0")} / {p.kindLabel}</p>
                <h3>{p.title}</h3>
                <p>{p.blurb}</p>
                <p className="o-deck-role">{p.role}</p>
                <div className="o-tags">{p.tags.map((t) => <span key={t}>{t}</span>)}</div>
                <a className="o-btn o-btn-red" href={p.live} {...external}>Open live <span>↗</span></a>
              </div>
              <a className="o-deck-shot" href={p.live} {...external} aria-label={`Open ${p.title}`}><img src={p.image} alt={`${p.title} screenshot`} loading="lazy" /></a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Services() {
  const [active, setActive] = useState(0);
  return (
    <section id="services" className="o-section">
      <div className="o-head">
        <Scramble as="p" text="WHAT I DO" className="o-kicker" />
        <h2>Four ways to work<em> with me.</em></h2>
      </div>
      <div className="o-acc">
        {services.map((s, i) => (
          <button key={s.num} className={`o-acc-panel${active === i ? " is-on" : ""}`} onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)} onClick={() => setActive(i)} aria-expanded={active === i}>
            <span className="o-acc-num">{s.num}</span>
            <span className="o-acc-side">{s.title}</span>
            <span className="o-acc-body"><strong>{s.title}</strong><em>{s.short}</em><span>{s.text}</span></span>
          </button>
        ))}
      </div>
    </section>
  );
}

function Process() {
  const root = useRef(null);
  useGsap(() => {
    if (prefersReduced()) return;
    gsap.fromTo(".o-proc-fill", { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: ".o-proc", start: "top 70%", end: "bottom 70%", scrub: true } });
    gsap.utils.toArray(".o-proc li").forEach((li) => gsap.from(li, { opacity: .15, x: 24, duration: .6, scrollTrigger: { trigger: li, start: "top 72%", toggleActions: "play none none reverse" } }));
  }, [], root);
  return (
    <section ref={root} className="o-section o-process">
      <div className="o-head o-head-sticky">
        <Scramble as="p" text="HOW IT RUNS" className="o-kicker" />
        <h2>No black box<em>.</em></h2>
        <p>You see a prototype before development continues, and you test it before delivery. After the final payment, the source code is yours.</p>
      </div>
      <ol className="o-proc">
        <span className="o-proc-line" aria-hidden><span className="o-proc-fill" /></span>
        {STEPS.map((s, i) => <li key={s.title}><span>{String(i + 1).padStart(2, "0")}</span><h3>{s.title}</h3><p>{s.text}</p></li>)}
      </ol>
    </section>
  );
}

function Magnet({ children, ...props }) {
  const ref = useRef(null);
  const onMove = (e) => {
    if (prefersReduced()) return;
    const r = ref.current.getBoundingClientRect();
    gsap.to(ref.current, { x: (e.clientX - r.left - r.width / 2) * .3, y: (e.clientY - r.top - r.height / 2) * .3, duration: .4, ease: "power3" });
  };
  const onLeave = () => gsap.to(ref.current, { x: 0, y: 0, duration: .7, ease: "elastic.out(1,.4)" });
  return <a ref={ref} onPointerMove={onMove} onPointerLeave={onLeave} {...props}>{children}</a>;
}

export default function V4() {
  usePage({ title: "Youssef Degachi — Operator", bg: "#0b0b0e", fonts: "family=Archivo:wdth,wght@62..125,100..900&family=JetBrains+Mono:wght@400;500" });
  const { go } = useSmoothScroll();
  const [palette, setPalette] = useState(false);
  const root = useRef(null);
  useEffect(() => {
    const k = (e) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setPalette((o) => !o); } };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, []);
  useGsap(() => {
    if (prefersReduced()) return;
    gsap.utils.toArray("[data-reveal], .o-head h2").forEach((el) => gsap.from(el, { opacity: 0, y: 34, duration: 1, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 90%" } }));
    gsap.from(".o-cta-title span", { yPercent: 106, duration: 1.2, stagger: .05, ease: "expo.out", scrollTrigger: { trigger: ".o-cta", start: "top 65%" } });
  }, [], root);
  return (
    <div className="vroot op" ref={root}>
      <nav className="o-nav" aria-label="Main">
        <button className="o-logo" onClick={() => go("#top")}>YD<b>.</b></button>
        <div className="o-nav-links">{navLinks.map((l) => <button key={l.id} onClick={() => go(`#${l.id}`)}>{l.label}</button>)}</div>
        <button className="o-k" onClick={() => setPalette(true)} aria-label="Open command menu"><span>Menu</span><kbd>⌘K</kbd></button>
      </nav>
      <Palette go={go} open={palette} setOpen={setPalette} />
      <main>
        <Hero go={go} />
        <Deck />
        <Services />
        <Process />
        <section id="pricing" className="o-section">
          <div className="o-head"><Scramble as="p" text="PRICING" className="o-kicker" /><h2>Clear starting points<em>.</em></h2></div>
          <PricingBlock />
          <div className="o-faq"><h3>Questions clients ask</h3><FaqList /></div>
        </section>
        <section id="about" className="o-section o-about">
          <div className="o-head"><Scramble as="p" text="ABOUT" className="o-kicker" /><h2>Founder who still <em>ships the code.</em></h2><p>{profile.short}</p>
            <a className="o-btn" href={profile.cv} download>Download CV <span>↓</span></a></div>
          <div className="o-about-grid">
            {[["Experience", experience], ["Education", education]].map(([t, rows]) => (
              <div key={t} className="o-tl" data-reveal>
                <h3 className="o-kicker">{t}</h3>
                {rows.map((r) => <div key={r.org + r.role}><span>{r.when}</span><strong>{r.role}</strong><em>{r.href ? <a href={r.href} {...external}>{r.org} ↗</a> : r.org}</em></div>)}
              </div>
            ))}
            <div className="o-tl o-skill-grid" data-reveal>
              <h3 className="o-kicker">Toolkit</h3>
              {Object.entries(skills).map(([k, v]) => <p key={k}><b>{k}</b><span>{v.join(", ")}</span></p>)}
            </div>
          </div>
        </section>
        <section id="contact" className="o-cta">
          <h2 className="o-cta-title" aria-label="Let's talk">{"LET’S TALK".split("").map((c, i) => <span key={i} aria-hidden>{c === " " ? " " : c}</span>)}</h2>
          <div className="o-cta-row">
            <p>Tell me about your calls, your customers or your process. I&rsquo;ll tell you honestly what&rsquo;s worth building.</p>
            <Magnet className="o-cta-btn" href={whatsappWith("Hi Youssef, I'd like to talk about a project.")} {...external}>WhatsApp<br />me ↗</Magnet>
          </div>
          <div className="o-cta-foot">
            <a href={`mailto:${profile.email}`}>{profile.email}</a>
            <a href={profile.phoneHref}>{profile.phone}</a>
            <span>{socials.map((s) => <a key={s.label} href={s.href} {...external}>{s.label}</a>)}</span>
            <span>© {new Date().getFullYear()} {profile.name}</span>
          </div>
        </section>
      </main>
    </div>
  );
}
