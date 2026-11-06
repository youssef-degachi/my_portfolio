import { useEffect } from "react";
import { VERSIONS, asset } from "./content";
import "./shared.css";

/**
 * Temporary comparison control. Full page loads on purpose, so each version starts clean
 * (no leftover WebGL contexts, scroll triggers or fonts). Keys 1–6 also switch.
 */
export default function VersionSwitcher({ current }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target;
      if (t instanceof HTMLElement && (t.isContentEditable || /INPUT|TEXTAREA|SELECT/.test(t.tagName))) return;
      const v = VERSIONS[Number(e.key) - 1];
      if (v && v.id !== current) window.location.href = asset(v.id);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [current]);

  return (
    <nav className={`vsw vsw-${current}`} aria-label="Design versions">
      {VERSIONS.map((v) => (
        <a key={v.id} href={asset(v.id)} title={v.name} aria-current={v.id === current ? "page" : undefined}>
          {v.id.toUpperCase()}
        </a>
      ))}
      <a href={asset("versions")} title="Compare all versions" aria-label="Compare all versions">⋯</a>
    </nav>
  );
}
