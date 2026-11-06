import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { OFFERS, FAQ, CURRENCIES, BASE_CURRENCY, currencyByCode, formatPrice, PRICING_DISCLAIMER, CURRENCY_NOTE, PAYMENT_SHORT } from "@/data/pricing";
import { whatsappWith } from "./content";
import "./shared.css";

gsap.registerPlugin(ScrollTrigger);
export { gsap, ScrollTrigger };

export const prefersReduced = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
export const isTouch = () =>
  typeof window !== "undefined" && window.matchMedia("(hover: none), (pointer: coarse)").matches;

/** Title, background and fonts for one version; undone when it unmounts. */
export function usePage({ title, bg, fonts, scheme = "dark" }) {
  useEffect(() => {
    const root = document.documentElement;
    const previous = document.title;
    document.title = title;
    root.classList.add("vmode");
    root.style.background = bg;
    root.style.colorScheme = scheme;
    document.body.style.background = bg;
    let link;
    if (fonts) {
      link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = `https://fonts.googleapis.com/css2?${fonts}&display=swap`;
      document.head.appendChild(link);
    }
    return () => {
      document.title = previous;
      root.classList.remove("vmode");
      root.style.background = "";
      root.style.colorScheme = "";
      document.body.style.background = "";
      link?.remove();
    };
  }, [title, bg, fonts, scheme]);
}

/** Lenis smooth scrolling tied to ScrollTrigger. Returns go("#id") for in-page navigation. */
export function useSmoothScroll(options) {
  const lenis = useRef(null);
  useEffect(() => {
    if (prefersReduced() || isTouch()) return undefined;
    const instance = new Lenis({ lerp: 0.09, ...options });
    lenis.current = instance;
    instance.on("scroll", ScrollTrigger.update);
    const tick = (t) => instance.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      instance.destroy();
      lenis.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const go = useCallback((target) => {
    const el = typeof target === "string" ? document.querySelector(target) : target;
    if (!el) return;
    if (lenis.current) lenis.current.scrollTo(el, { duration: 1.4 });
    else el.scrollIntoView({ behavior: prefersReduced() ? "auto" : "smooth" });
  }, []);
  return { go, lenis };
}

/** Runs a GSAP setup inside a context so everything is reverted on unmount. */
export function useGsap(setup, deps = [], scope) {
  useEffect(() => {
    const ctx = gsap.context(() => setup(), scope?.current || undefined);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

export function useMedia(query) {
  const [match, setMatch] = useState(() => typeof window !== "undefined" && window.matchMedia(query).matches);
  useEffect(() => {
    const m = window.matchMedia(query);
    const on = () => setMatch(m.matches);
    on();
    m.addEventListener("change", on);
    return () => m.removeEventListener("change", on);
  }, [query]);
  return match;
}

/** Live local time in Tunisia. */
export function useTunisTime(withSeconds = false) {
  const format = useCallback(
    () =>
      new Intl.DateTimeFormat("en-GB", {
        timeZone: "Africa/Tunis",
        hour: "2-digit",
        minute: "2-digit",
        ...(withSeconds ? { second: "2-digit" } : {}),
      }).format(new Date()),
    [withSeconds]
  );
  const [now, setNow] = useState(format);
  useEffect(() => {
    const id = setInterval(() => setNow(format()), 1000);
    return () => clearInterval(id);
  }, [format]);
  return now;
}

/** Counts up when scrolled into view. Always renders the true value without motion. */
export function CountUp({ value, suffix = "", pad = 0, className }) {
  const ref = useRef(null);
  const text = (n) => `${String(n).padStart(pad, "0")}${suffix}`;
  useEffect(() => {
    if (prefersReduced() || !ref.current) return undefined;
    const el = ref.current;
    const state = { n: 0 };
    el.textContent = text(0);
    const tween = gsap.to(state, {
      n: value,
      duration: 1.6,
      ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 92%", once: true },
      onUpdate: () => { el.textContent = text(Math.round(state.n)); },
    });
    return () => { tween.scrollTrigger?.kill(); tween.kill(); el.textContent = text(value); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
  return <span ref={ref} className={className}>{text(value)}</span>;
}

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+=<>/\\[]{}";

/** Text that decodes from noise into the real words when it enters the viewport. */
export function Scramble({ text, as: Tag = "span", className, delay = 0, repeat = true }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReduced()) return undefined;
    let raf = 0;
    let done = false;
    const run = () => {
      cancelAnimationFrame(raf);
      const start = performance.now() + delay;
      const tick = (now) => {
        const reveal = Math.floor(Math.max(0, now - start) / 26);
        let out = "";
        for (let i = 0; i < text.length; i += 1) {
          out += text[i] === " " || i < reveal ? text[i] : GLYPHS[(Math.random() * GLYPHS.length) | 0];
        }
        el.textContent = out;
        if (reveal < text.length) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && (repeat || !done)) { done = true; run(); }
    }, { threshold: 0.4 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); el.textContent = text; };
  }, [text, delay, repeat]);
  return <Tag ref={ref} className={className} aria-label={text}>{text}</Tag>;
}

const ExternalProps = { target: "_blank", rel: "noopener noreferrer" };
export const external = ExternalProps;

const BLOCKS = {
  p: (b, i) => <p key={i}>{b.text}</p>,
  note: (b, i) => <p key={i} className="pb-note">{b.text}</p>,
  ul: (b, i) => <ul key={i}>{b.items.map((t) => <li key={t}>{t}</li>)}</ul>,
  steps: (b, i) => (
    <ol key={i}>
      {b.items.map((s) => <li key={s.title}><strong>{s.title}</strong> {s.text}</li>)}
    </ol>
  ),
};

function Offer({ offer, currency, ctaLabel }) {
  const [open, setOpen] = useState(false);
  const panel = `pb-details-${offer.id}`;
  return (
    <article className={`pb-card${offer.featured ? " is-featured" : ""}`}>
      <div className="pb-top">
        <span className="pb-num">{offer.num}</span>
        {offer.badge && <span className="pb-badge">{offer.badge}</span>}
      </div>
      <h3 className="pb-name">{offer.name}</h3>
      <p className="pb-headline">{offer.headline}</p>
      <ul className="pb-benefits">{offer.benefits.map((b) => <li key={b}>{b}</li>)}</ul>
      <div className="pb-price">
        <span className="pb-from">Starting at</span>
        <strong>{formatPrice(offer.priceUSD, currency)}</strong>
        {currency.code !== BASE_CURRENCY && <span className="pb-approx">approx.</span>}
      </div>
      <p className="pb-time">{offer.timeline}</p>
      <div className="pb-actions">
        <a className="pb-cta" href={whatsappWith(`Hi Youssef, I'm interested in: ${offer.name}.`)} {...ExternalProps}>{ctaLabel}</a>
        <button type="button" className="pb-more" aria-expanded={open} aria-controls={panel} onClick={() => setOpen(!open)}>
          {open ? "Hide details" : "What's included"}
        </button>
      </div>
      {open && (
        <div className="pb-details" id={panel}>
          <p>{offer.details.intro}</p>
          <h4>Included</h4>
          <ul>{offer.details.included.map((t) => <li key={t}>{t}</li>)}</ul>
          <h4>Good for</h4>
          <ul>{offer.details.useCases.map((t) => <li key={t}>{t}</li>)}</ul>
          {offer.details.notes?.length > 0 && (<><h4>Notes</h4><ul>{offer.details.notes.map((t) => <li key={t}>{t}</li>)}</ul></>)}
        </div>
      )}
    </article>
  );
}

/** All offers + currency selector. Each version themes it through --pb-* variables. */
export function PricingBlock({ ctaLabel = "Start on WhatsApp", className = "" }) {
  const [code, setCode] = useState(BASE_CURRENCY);
  const currency = currencyByCode(code);
  return (
    <div className={`pb ${className}`}>
      <div className="pb-bar">
        <p className="pb-intro">Every project is custom. These are starting points — we agree the final scope and price after a discovery meeting.</p>
        <label className="pb-select">
          <span>Currency</span>
          <select value={code} onChange={(e) => setCode(e.target.value)}>
            {CURRENCIES.map((c) => <option key={c.code} value={c.code}>{c.code} — {c.name}</option>)}
          </select>
        </label>
      </div>
      <div className="pb-grid">
        {OFFERS.map((o) => <Offer key={o.id} offer={o} currency={currency} ctaLabel={ctaLabel} />)}
      </div>
      <p className="pb-fine">{PRICING_DISCLAIMER} {PAYMENT_SHORT} {code !== BASE_CURRENCY && CURRENCY_NOTE}</p>
    </div>
  );
}

export function FaqList({ className = "" }) {
  return (
    <div className={`faq ${className}`}>
      {FAQ.map((f, i) => (
        <details key={f.id} className="faq-item">
          <summary><span className="faq-i">{String(i + 1).padStart(2, "0")}</span><span className="faq-q">{f.q}</span><span className="faq-mark" aria-hidden /></summary>
          <div className="faq-a">{f.a.map((b, n) => BLOCKS[b.type]?.(b, n))}</div>
        </details>
      ))}
    </div>
  );
}
