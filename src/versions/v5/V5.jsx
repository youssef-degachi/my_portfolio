import { useEffect, useRef } from "react";
import { profile, products, services, experience, education, skills, stats, socials, navLinks } from "../content";
import { CountUp, FaqList, PricingBlock, external, gsap, prefersReduced, usePage, useGsap, useSmoothScroll, useTunisTime } from "../shared";
import Brickwork from "./Brickwork";
import "./v5.css";

// One sky per part of the day: top colour, bottom colour, sun, dune.
const SKY = [
  { id: "top", a: "#f8dcc0", b: "#fbeedd", sun: "#fff3d6", dune: "#ecc79c" },
  { id: "work", a: "#fbe9cf", b: "#fdf6ea", sun: "#fffaf0", dune: "#efd2ab" },
  { id: "services", a: "#f6efdf", b: "#fbf6ea", sun: "#fff6c9", dune: "#ecd3ad" },
  { id: "pricing", a: "#f4c58f", b: "#f9dfb8", sun: "#ff9c4a", dune: "#e0a56c" },
  { id: "about", a: "#6a2a3a", b: "#c75a35", sun: "#ff5a2e", dune: "#3f1a22" },
  { id: "contact", a: "#080c24", b: "#1c2147", sun: "#ff5a2e", dune: "#05071a" },
];

const Label = ({ time, part }) => <p className="j-label" data-reveal><b>{time}</b><span>{part}</span></p>;

function Sky({ rootRef }) {
  const sun = useRef(null);
  const moon = useRef(null);
  const stars = useRef(null);
  const starField = useRef(Array.from({ length: 90 }).map(() => ({ x: Math.random() * 100, y: Math.random() * 72, s: Math.random() < .15 ? 2.5 : 1.4, d: Math.random() * 3 })));
  const clockEl = useRef(null);
  useEffect(() => {
    const root = rootRef.current;
    const lerp = gsap.utils.interpolate;
    const positions = () => SKY.map((s) => {
      const el = document.getElementById(s.id);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      return el ? Math.min(1, Math.max(0, (el.offsetTop - window.innerHeight * .55) / max)) : 0;
    });
    let pos = positions();
    const clockAt = [6.2, 9.5, 13, 17.3, 19.1, 22.6];
    let wasDark = false;
    const update = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const p = Math.min(1, window.scrollY / max);
      pos = positions(); // read live: images and fonts can change the layout after load
      const about = document.getElementById("about");
      const dark = about ? window.scrollY + window.innerHeight * .55 > about.offsetTop : false;
      if (dark !== wasDark) { root.classList.toggle("is-dark", dark); wasDark = dark; }
      let i = 0;
      while (i < pos.length - 2 && p >= pos[i + 1]) i += 1;
      const f = Math.min(1, Math.max(0, (p - pos[i]) / Math.max(.0001, pos[i + 1] - pos[i])));
      const A = SKY[i]; const B = SKY[i + 1];
      root.style.setProperty("--sky-a", lerp(A.a, B.a, f));
      root.style.setProperty("--sky-b", lerp(A.b, B.b, f));
      root.style.setProperty("--dune", lerp(A.dune, B.dune, f));
      const sunColor = lerp(A.sun, B.sun, f);
      // the sun crosses from dawn to dusk, then sets behind the dunes
      const dusk = pos[4]; const end = pos[5];
      const t = Math.min(1, p / Math.max(.001, dusk));
      const set = p > dusk ? Math.min(1, (p - dusk) / Math.max(.001, end - dusk)) : 0;
      const x = 10 + t * 74;
      const y = 80 - Math.sin(t * Math.PI * .93 + .08) * 66 + set * 58;
      if (sun.current) { sun.current.style.transform = `translate(calc(${x}vw - 50%), calc(${y}vh - 50%))`; sun.current.style.setProperty("--sun", sunColor); }
      const night = Math.min(1, Math.max(0, (p - (dusk + (end - dusk) * .55)) / Math.max(.001, (end - dusk) * .45)));
      if (stars.current) stars.current.style.opacity = night;
      if (moon.current) { moon.current.style.opacity = night; moon.current.style.transform = `translateY(${(1 - night) * 80}px)`; }
      if (clockEl.current) {
        const h = gsap.utils.interpolate(clockAt[i], clockAt[i + 1], f);
        clockEl.current.textContent = `${String(Math.floor(h)).padStart(2, "0")}:${String(Math.floor((h % 1) * 60)).padStart(2, "0")}`;
      }
    };
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
    return () => { window.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
  }, [rootRef]);
  return (
    <>
      <div className="j-sky" aria-hidden>
        <div ref={stars} className="j-stars">{starField.current.map((s, i) => <i key={i} style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.s, height: s.s, animationDelay: `${s.d}s` }} />)}</div>
        <div ref={moon} className="j-moon" />
        <div ref={sun} className="j-sun" />
        <svg className="j-dunes" viewBox="0 0 1440 170" preserveAspectRatio="none">
          <path d="M0 110 C 200 60 360 70 560 112 S 960 150 1160 96 S 1380 70 1440 92 V170 H0Z" opacity=".55" />
          <path d="M0 140 C 240 100 460 120 700 146 S 1160 150 1440 122 V170 H0Z" />
        </svg>
        <svg className="j-palms" viewBox="0 0 240 150" aria-hidden>
          {[[60, 0, 1], [150, 20, .78], [200, 42, .6]].map(([x, y, s]) => (
            <g key={x} transform={`translate(${x} ${y}) scale(${s})`}>
              <path d="M0 150 C 4 100 2 60 -6 24 L -1 24 C 8 60 12 100 10 150 Z" />
              {[-160, -125, -90, -55, -20, 15].map((r) => <path key={r} d="M-3 24 C 14 8 36 6 58 22 C 36 16 16 20 -3 28 Z" transform={`rotate(${r + 30} -3 24)`} />)}
            </g>
          ))}
        </svg>
      </div>
      <div className="j-clock" aria-hidden><b ref={clockEl}>06:12</b><span>on this page</span></div>
    </>
  );
}

function Hero({ go }) {
  const root = useRef(null);
  useGsap(() => {
    if (prefersReduced()) return;
    gsap.timeline({ defaults: { ease: "expo.out" } })
      .from(".j-name span", { yPercent: 110, duration: 1.4, stagger: .05 }, .15)
      .from(".j-ar", { opacity: 0, y: 26, duration: 1.3 }, .5)
      .from(".j-arch", { y: 70, opacity: 0, duration: 1.5 }, .25)
      .from(".j-hero-fade", { opacity: 0, y: 22, duration: 1, stagger: .09 }, .75);
    gsap.to(".j-arch-photo", { yPercent: -7, ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true } });
  }, [], root);
  return (
    <section ref={root} id="top" className="j-hero">
      <div className="j-hero-text">
        <p className="j-hero-fade j-over">{profile.role} · The Jerid, {profile.location}</p>
        <h1 className="j-name" aria-label={profile.name}>
          <span className="j-mask" aria-hidden><span>Youssef</span></span>
          <span className="j-mask" aria-hidden><span><i>Degachi</i></span></span>
        </h1>
        <p className="j-hero-fade j-sub">Patient work, in small pieces, laid by hand. The brick walls of Tozeur taught me that. I build software the same way: 3+ years of experience building systems and ERPs for real clients.</p>
        <div className="j-hero-fade j-actions">
          <a className="j-btn j-btn-fill" href={profile.whatsapp} {...external}>Start on WhatsApp</a>
          <button className="j-btn" onClick={() => go("#work")}>Walk through the work</button>
        </div>
      </div>
      <figure className="j-arch">
        <Brickwork className="j-arch-bricks" pattern="diamond" period={6} brick={25} />
        <div className="j-arch-window"><img className="j-arch-photo" src={profile.photo} alt={`Portrait of ${profile.name}`} /></div>
        <span className="j-ar" lang="ar" dir="rtl">{profile.arabic}</span>
      </figure>
    </section>
  );
}

function Work() {
  const root = useRef(null);
  useGsap(() => {
    if (prefersReduced()) return;
    gsap.utils.toArray(".j-frame img").forEach((img) => gsap.fromTo(img, { yPercent: -5, scale: 1.12 }, { yPercent: 5, scale: 1.12, ease: "none", scrollTrigger: { trigger: img.parentElement, scrub: true } }));
  }, [], root);
  return (
    <section ref={root} id="work" className="j-section">
      <Label time="09:30" part="Morning — the work" />
      <h2 className="j-h" data-reveal>What I&rsquo;ve <i>built</i> so far.</h2>
      <div className="j-gallery">
        {products.map((p, i) => (
          <a key={p.id} className={`j-piece j-piece-${i}`} href={p.live} {...external} data-reveal>
            <div className="j-frame"><img src={p.image} alt={`${p.title} screenshot`} loading="lazy" /></div>
            <div className="j-piece-copy">
              <h3>{p.title} <span>↗</span></h3>
              <p>{p.blurb}</p>
              <p className="j-small">{p.role}</p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

const MOTIFS = [["diamond", 4], ["chevron", 4], ["weave", 7], ["diamond", 3]];

export default function V5() {
  usePage({ title: "Youssef Degachi — Jerid", bg: "#f8dcc0", scheme: "light", fonts: "family=Fraunces:ital,opsz,wght,SOFT,WONK@0,9..144,300..800,50,1;1,9..144,300..800,50,1&family=Reem+Kufi:wght@500;700&family=Instrument+Sans:wght@400;500;600" });
  const { go } = useSmoothScroll();
  const root = useRef(null);
  const time = useTunisTime();
  useGsap(() => {
    if (prefersReduced()) return;
    gsap.utils.toArray("[data-reveal]").forEach((el) => gsap.from(el, { opacity: 0, y: 34, duration: 1.1, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 90%" } }));
    gsap.from(".j-aslema span", { yPercent: 110, duration: 1.4, stagger: .05, ease: "expo.out", scrollTrigger: { trigger: ".j-aslema", start: "top 85%" } });
  }, [], root);
  return (
    <div className="vroot jerid" ref={root}>
      <Sky rootRef={root} />
      <nav className="j-nav" aria-label="Main">
        <button className="j-logo" onClick={() => go("#top")} lang="ar" dir="rtl" aria-label="Back to top">{profile.arabic}</button>
        <div>{navLinks.map((l) => <button key={l.id} onClick={() => go(`#${l.id}`)}>{l.label}</button>)}</div>
      </nav>
      <main className="j-main">
        <Hero go={go} />
        <section className="j-stats" aria-label="Key numbers">
          {stats.map((s) => <div key={s.label} data-reveal><CountUp value={s.value} suffix={s.suffix} className="j-num" /><p>{s.label}</p></div>)}
        </section>
        <Work />
        <Brickwork className="j-band" pattern="chevron" period={5} brick={24} from="top" />
        <section id="services" className="j-section">
          <Label time="13:00" part="Noon — what I do" />
          <h2 className="j-h" data-reveal>Four <i>crafts,</i> one builder.</h2>
          <div className="j-crafts">
            {services.map((s, i) => (
              <article key={s.num} data-reveal>
                <div className="j-motif"><Brickwork pattern={MOTIFS[i][0]} period={MOTIFS[i][1]} brick={15} gap={2} from="bottom" /></div>
                <h3>{s.title}</h3>
                <p className="j-italic">{s.short}</p>
                <p>{s.text}</p>
              </article>
            ))}
          </div>
        </section>
        <section id="pricing" className="j-section">
          <Label time="17:20" part="Afternoon — the price" />
          <h2 className="j-h" data-reveal>Honest <i>starting</i> prices.</h2>
          <PricingBlock />
          <div className="j-faq"><h3 className="j-sub-h">Before you ask.</h3><FaqList /></div>
        </section>
        <section id="about" className="j-section">
          <Label time="19:05" part="Dusk — the road here" />
          <h2 className="j-h" data-reveal>From Tozeur <i>to founder.</i></h2>
          <p className="j-lead" data-reveal>{profile.short}</p>
          <div className="j-road">
            {[["Work", experience], ["Study", education]].map(([t, rows]) => (
              <div key={t} data-reveal>
                <h3>{t}</h3>
                {rows.map((r) => <div className="j-row" key={r.org + r.role}><span>{r.when}</span><strong>{r.role}</strong><em>{r.href ? <a href={r.href} {...external}>{r.org} ↗</a> : r.org}</em></div>)}
              </div>
            ))}
            <div data-reveal>
              <h3>Tools</h3>
              {Object.entries(skills).map(([k, v]) => <p className="j-tools" key={k}><b>{k}</b>{v.join(" · ")}</p>)}
            </div>
          </div>
        </section>
        <section id="contact" className="j-contact">
          <p className="j-label"><b>22:40</b><span>Night — the door is open</span></p>
          <h2 className="j-aslema" aria-label="Aslema"><span className="j-mask"><span aria-hidden>Aslema.</span></span></h2>
          <p className="j-ar-big" lang="ar" dir="rtl">عسلامة</p>
          <p className="j-lead">That&rsquo;s hello, in Tunisian. {profile.availability}, and WhatsApp is the fastest way to reach me.</p>
          <div className="j-actions">
            <a className="j-btn j-btn-fill" href={profile.whatsapp} {...external}>WhatsApp {profile.phone}</a>
            <a className="j-btn" href={`mailto:${profile.email}`}>{profile.email}</a>
            <a className="j-btn" href={profile.cv} download>Download CV</a>
          </div>
          <footer className="j-foot">
            <span>Tunisia, {time}</span>
            <span>{socials.map((s) => <a key={s.label} href={s.href} {...external}>{s.label}</a>)}</span>
            <span>© {new Date().getFullYear()} {profile.name}</span>
          </footer>
        </section>
      </main>
    </div>
  );
}
