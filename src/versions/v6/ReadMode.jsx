import { profile, projects, services, stats, experience, education, skills, socials } from "../content";
import { FaqList, PricingBlock, external } from "../shared";

/** Declined the call? Everything the agent knows, as a normal, fast, accessible page. */
export default function ReadMode({ onCall }) {
  return (
    <div className="c-read">
      <header className="c-read-head">
        <p>You declined the call. Fair.</p>
        <h1>Youssef<br />Degachi<span>.</span></h1>
        <p className="c-read-lead">{profile.short}</p>
        <div className="c-read-actions">
          <button className="c-cta" onClick={onCall}>Call instead ↗</button>
          <a className="c-ghost" href={profile.whatsapp} {...external}>WhatsApp {profile.phone}</a>
          <a className="c-ghost" href={profile.cv} download>Download CV</a>
        </div>
      </header>
      <section className="c-read-stats">{stats.map((s) => <div key={s.label}><strong>{s.value}{s.suffix}</strong><span>{s.label}</span></div>)}</section>
      <section id="work" className="c-read-sec">
        <h2>Work</h2>
        <div className="c-read-grid">
          {projects.map((p) => {
            const body = (<><img src={p.image} alt={`${p.title} screenshot`} loading="lazy" /><h3>{p.title}{p.live && " ↗"}</h3><p>{p.blurb}</p></>);
            return p.live ? <a key={p.id} href={p.live} {...external}>{body}</a> : <div key={p.id}>{body}</div>;
          })}
        </div>
      </section>
      <section className="c-read-sec">
        <h2>Services</h2>
        <div className="c-read-services">{services.map((s) => <article key={s.num}><h3>{s.title}</h3><p>{s.text}</p></article>)}</div>
      </section>
      <section className="c-read-sec"><h2>Pricing</h2><PricingBlock /></section>
      <section className="c-read-sec"><h2>Questions</h2><FaqList /></section>
      <section className="c-read-sec c-read-cols">
        {[["Experience", experience], ["Education", education]].map(([t, rows]) => (
          <div key={t}><h2>{t}</h2>{rows.map((r) => <p key={r.org + r.role} className="c-read-row"><span>{r.when}</span><strong>{r.role}</strong><em>{r.href ? <a href={r.href} {...external}>{r.org} ↗</a> : r.org}</em></p>)}</div>
        ))}
        <div><h2>Skills</h2>{Object.entries(skills).map(([k, v]) => <p key={k} className="c-read-row"><span>{k}</span><strong>{v.join(", ")}</strong></p>)}</div>
      </section>
      <footer className="c-read-foot">
        <a href={`mailto:${profile.email}`}>{profile.email}</a>
        <span>{socials.map((s) => <a key={s.label} href={s.href} {...external}>{s.label}</a>)}</span>
      </footer>
    </div>
  );
}
