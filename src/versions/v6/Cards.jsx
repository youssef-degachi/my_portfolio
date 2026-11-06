import { useState } from "react";
import { profile, projects, services, stats, skills, socials } from "../content";
import { OFFERS, formatPrice } from "@/data/pricing";
import { external } from "../shared";

const Blocks = ({ blocks }) => blocks.map((b, i) => {
  if (b.type === "ul") return <ul key={i}>{b.items.map((t) => <li key={t}>{t}</li>)}</ul>;
  if (b.type === "steps") return <ol key={i}>{b.items.map((s) => <li key={s.title}><strong>{s.title}.</strong> {s.text}</li>)}</ol>;
  return <p key={i} className={b.type === "note" ? "c-note" : ""}>{b.text}</p>;
});

const PIPE = ["You speak", "Speech to text", "Intent + memory", "Functions", "Text to speech"];

/** What the agent puts on screen while it talks: the equivalent of a tool result. */
export default function Card({ card, onAsk }) {
  const [more, setMore] = useState(Boolean(card.open));
  switch (card.kind) {
    case "profile":
      return (
        <div className="c-card-profile">
          <img src={profile.photo} alt={`Portrait of ${profile.name}`} />
          <div>
            <h3>{profile.name}</h3><p>{profile.role} · {profile.location}</p>
            <dl>{stats.map((s) => <div key={s.label}><dt>{s.value}{s.suffix}</dt><dd>{s.label}</dd></div>)}</dl>
          </div>
        </div>
      );
    case "work":
      return <div className="c-card-work">{projects.map((p) => <button key={p.id} onClick={() => onAsk(`Tell me about ${p.title}`)}><img src={p.image} alt="" loading="lazy" /><span>{p.title}</span></button>)}</div>;
    case "project": {
      const p = card.project;
      return (
        <div className="c-card-project">
          <img src={p.image} alt={`${p.title} screenshot`} />
          <div className="c-row"><h3>{p.title}</h3><em>{p.kindLabel}</em></div>
          <p>{p.tags.join(" · ")}</p>
          {p.live && <a className="c-link" href={p.live} {...external}>Open it ↗</a>}
        </div>
      );
    }
    case "prices":
      return <div className="c-card-prices">{OFFERS.map((o) => <button key={o.id} onClick={() => onAsk(`${o.name} price`)}><span>{o.name}</span><strong>{formatPrice(o.priceUSD, card.currency)}</strong></button>)}<p>Starting prices{card.currency.code !== "USD" ? ", approximate conversion" : ""}.</p></div>;
    case "offer": {
      const o = card.offer;
      return (
        <div className="c-card-offer">
          <div className="c-row"><h3>{o.name}</h3></div>
          <strong className="c-big">{formatPrice(o.priceUSD, card.currency)}</strong>
          <p className="c-sm">Starting price · {o.timeline}</p>
          <ul>{(more ? o.details.included : o.benefits).map((b) => <li key={b}>{b}</li>)}</ul>
          <button className="c-link" onClick={() => setMore(!more)}>{more ? "Show the short list" : "See everything included"}</button>
        </div>
      );
    }
    case "faq": return <div className="c-card-faq"><h3>{card.faq.q}</h3><Blocks blocks={card.faq.a} /></div>;
    case "contact":
      return (
        <div className="c-card-contact">
          <h3>Youssef, directly</h3>
          {card.message && <blockquote>{card.message}</blockquote>}
          <a className="c-cta" href={card.href} {...external}>Open WhatsApp ↗</a>
          <p><a href={`mailto:${profile.email}`}>{profile.email}</a><br /><a href={profile.phoneHref}>{profile.phone}</a></p>
        </div>
      );
    case "timeline":
      return (
        <div className="c-card-timeline">
          <h3>{card.title}</h3>
          {card.rows.map((r) => <div key={r.org + r.role}><span>{r.when}</span><strong>{r.role}</strong><em>{r.org}</em></div>)}
          {card.cv && <a className="c-link" href={profile.cv} download>Download the CV ↓</a>}
        </div>
      );
    case "pipeline":
      return <div className="c-card-pipe"><h3>What just happened</h3><ol>{PIPE.map((s) => <li key={s}>{s}</li>)}</ol><p>Open the trace at the bottom left to watch it live.</p></div>;
    case "stack":
      return <div className="c-card-stack">{Object.entries(skills).map(([k, v]) => <div key={k}><h3>{k}</h3><p>{v.map((x) => <span key={x}>{x}</span>)}</p></div>)}</div>;
    case "services":
      return <div className="c-card-services">{services.map((s) => <div key={s.num}><h3>{s.title}</h3><p>{s.short}</p></div>)}</div>;
    case "socials":
      return <div className="c-card-socials">{socials.map((s) => <a key={s.label} href={s.href} {...external}>{s.label} ↗</a>)}</div>;
    default: return null;
  }
}
