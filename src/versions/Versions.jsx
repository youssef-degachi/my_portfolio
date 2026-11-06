import { useEffect } from "react";
import { VERSIONS, asset } from "./content";
import "./shared.css";

const ACCENT = { v1: "#3df5ff", v2: "#ef4a60", v3: "#ff2d55", v4: "#f13024", v5: "#c8632f", v6: "#d4ff3a" };

/** Comparison hub for picking a design. Not part of the final site. */
export default function Versions() {
  useEffect(() => {
    document.title = "Pick a version — Youssef Degachi";
    document.documentElement.classList.add("vmode");
    document.documentElement.style.background = "#0a0a0c";
    document.body.style.background = "#0a0a0c";
    return () => { document.documentElement.classList.remove("vmode"); document.documentElement.style.background = ""; document.body.style.background = ""; };
  }, []);
  return (
    <main className="vroot" style={{ minHeight: "100vh", padding: "clamp(24px,5vw,64px) clamp(16px,4vw,56px)", background: "#0a0a0c", color: "#f4f2ef", fontFamily: "'Instrument Sans',system-ui,sans-serif" }}>
      <p style={{ font: "400 12px ui-monospace,monospace", letterSpacing: ".14em", textTransform: "uppercase", opacity: .65 }}>Your portfolio, six ways</p>
      <h1 style={{ margin: "10px 0 clamp(24px,4vw,44px)", fontSize: "clamp(2.4rem,7vw,6rem)", fontWeight: 600, lineHeight: 1, letterSpacing: "-.03em" }}>Pick the one that&rsquo;s you.</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,400px),1fr))", gap: 14 }}>
        {VERSIONS.map((v) => (
          <a key={v.id} href={asset(v.id)} className="vcard" style={{ display: "block", padding: 10, border: "1px solid rgba(255,255,255,.14)", borderRadius: 18, background: "#141418" }}>
            <img src={asset(`assets/versions/${v.id}.jpg`)} alt={`Preview of ${v.name}`} loading="lazy" style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover", objectPosition: "top", borderRadius: 11, background: "#000" }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10, margin: "13px 5px 5px" }}>
              <h2 style={{ fontSize: 25, fontWeight: 600, letterSpacing: "-.02em", lineHeight: 1.1 }}>{v.name}</h2>
              <span style={{ font: "500 13px ui-monospace,monospace", color: ACCENT[v.id] }}>/{v.id}</span>
            </div>
            <p style={{ margin: "0 5px 6px", color: "#b1b0b6", fontSize: 15, lineHeight: 1.35 }}>{v.note}</p>
          </a>
        ))}
      </div>
      <p style={{ marginTop: 22, color: "#a2a1a8", fontSize: 14.5 }}>Or press <kbd>1</kbd>–<kbd>6</kbd> on any version. The current live design is still at <a href={asset("")} style={{ textDecoration: "underline" }}>/</a>.</p>
    </main>
  );
}
