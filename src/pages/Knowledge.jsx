import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FiSearch, FiX } from "react-icons/fi";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import KnowledgeCard from "@/components/KnowledgeCard";
import { KNOWLEDGE_GROUPS, colorOf } from "@/data/knowledge";
import { hasDb } from "@/lib/db";
import {
  fetchEntries,
  fetchCategories,
  filterEntries,
  collectTags,
  collectCategories,
  countByGroup,
} from "@/lib/knowledge";

const chip = (active) =>
  `rounded-full px-4 py-2 text-sm font-medium transition-all border ${
    active
      ? "bg-accent-default text-primary border-accent-default font-bold"
      : "bg-[#27272c] text-white border-white/5 hover:border-accent-default/40"
  }`;

const tagChip = (active) =>
  `rounded-full px-3 py-1 text-xs transition-all border ${
    active
      ? "bg-accent-default/15 text-accent-default border-accent-default/40"
      : "text-white/60 border-white/10 hover:text-white hover:border-white/30"
  }`;

/** Category chip: soft Notion colour when active, neutral otherwise. */
const CategoryChip = ({ category, active, onClick }) => {
  const c = colorOf(category.color);
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm border transition-all ${
        active ? "font-semibold" : "bg-[#232329] text-white/80 border-white/10 hover:border-white/30"
      }`}
      style={active ? { backgroundColor: c.bg, color: c.text, borderColor: `${c.text}66` } : undefined}
    >
      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: c.text }} aria-hidden />
      {category.name}
      <span className="text-xs opacity-60">{category.count}</span>
    </button>
  );
};

const Skeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" aria-hidden>
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="h-56 rounded-xl bg-[#232329] border border-white/5 animate-pulse" />
    ))}
  </div>
);

const Knowledge = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get("q") || "";
  const group = searchParams.get("group") || "all";
  const tag = searchParams.get("tag") || "";
  const category = searchParams.get("category") || "";

  const [entries, setEntries] = useState(null);
  const [categories, setCategories] = useState([]);
  const [draft, setDraft] = useState(q);
  const inputRef = useRef(null);

  useEffect(() => {
    document.title = "Knowledge — Youssef Degachi";
  }, []);

  useEffect(() => {
    let alive = true;
    fetchEntries().then((list) => alive && setEntries(list));
    fetchCategories().then((list) => alive && setCategories(list));
    return () => {
      alive = false;
    };
  }, []);

  // "/" focuses the search box (like GitHub), unless already typing somewhere
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey) return;
      const el = document.activeElement;
      const typing = el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable);
      if (typing) return;
      e.preventDefault();
      inputRef.current?.focus();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // keep the input in sync when the URL changes from outside (back button, chips)
  useEffect(() => {
    setDraft(q);
  }, [q]);

  const update = (patch) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(patch).forEach(([k, v]) => {
      if (v && v !== "all") next.set(k, v);
      else next.delete(k);
    });
    setSearchParams(next, { replace: true });
  };

  // debounce typing → URL
  useEffect(() => {
    if (draft === q) return undefined;
    const id = setTimeout(() => update({ q: draft }), 150);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft]);

  const all = entries || [];
  const counts = useMemo(() => countByGroup(all), [all]);
  // channel/person id → how many published entries point at it (its playlist)
  const playlistCounts = useMemo(() => {
    const m = new Map();
    for (const e of all) if (e.source_id) m.set(e.source_id, (m.get(e.source_id) || 0) + 1);
    return m;
  }, [all]);
  const tags = useMemo(() => collectTags(all).slice(0, 15), [all]);
  const cats = useMemo(() => collectCategories(all, categories), [all, categories]);
  const results = useMemo(
    () => filterEntries(all, { q, group, tag, category }),
    [all, q, group, tag, category]
  );

  const reset = () => {
    setDraft("");
    setSearchParams({}, { replace: true });
  };
  const toggleTag = (t) => update({ tag: tag === t ? "" : t });
  const toggleCategory = (slug) => update({ category: category === slug ? "" : slug });
  const filtered = Boolean(q || tag || category || group !== "all");

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { delay: 0.4, duration: 0.4, ease: "easeIn" } }}
      className="min-h-[80vh] py-12 xl:px-0"
    >
      <div className="container mx-auto">
        {/* header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h1 className="h2 mb-4">
            Knowledge<span className="text-accent-default">.</span>
          </h1>
          <p className="text-white/60">
            Everything I learn, read, watch and think — searchable. Blogs, notes, quotes, videos,
            resources and the people I follow.
          </p>
        </div>

        {/* search */}
        <div className="relative max-w-2xl mx-auto mb-8">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 text-xl pointer-events-none" />
          <Input
            ref={inputRef}
            type="search"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Search everything… (react, voice ai, startup)"
            aria-label="Search knowledge"
            className="w-full pl-12 pr-12 rounded-full border-2 border-white/10"
          />
          {!draft && (
            <kbd
              className="hidden xl:flex absolute right-5 top-1/2 -translate-y-1/2 items-center gap-1 text-[11px] text-white/35 pointer-events-none"
              aria-hidden
            >
              press <span className="rounded border border-white/20 px-1.5 py-0.5 text-white/60">/</span> to search
            </kbd>
          )}
          {draft && (
            <button
              type="button"
              onClick={() => setDraft("")}
              aria-label="Clear search"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
            >
              <FiX className="text-xl" />
            </button>
          )}
        </div>

        {/* group chips */}
        <div className="flex flex-wrap justify-center gap-2 mb-5">
          {KNOWLEDGE_GROUPS.map((g) => (
            <button key={g.id} type="button" onClick={() => update({ group: g.id })} className={chip(group === g.id)}>
              {g.label}
              <span className={`ml-2 text-xs ${group === g.id ? "text-primary/70" : "text-white/40"}`}>
                {counts[g.id] ?? 0}
              </span>
            </button>
          ))}
        </div>

        {/* category chips (user-defined, coloured) */}
        {cats.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mb-5">
            {cats.map((c) => (
              <CategoryChip
                key={c.slug}
                category={c}
                active={category === c.slug}
                onClick={() => toggleCategory(c.slug)}
              />
            ))}
          </div>
        )}

        {/* tag chips */}
        {tags.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {tags.map(({ tag: t, count }) => (
              <button key={t} type="button" onClick={() => toggleTag(t)} className={tagChip(tag === t)}>
                #{t} <span className="opacity-60">{count}</span>
              </button>
            ))}
          </div>
        )}

        {/* results */}
        {entries === null ? (
          <Skeleton />
        ) : results.length === 0 ? (
          <div className="text-center py-20">
            {!hasDb && !filtered ? (
              <>
                <p className="text-xl text-white/70 mb-3">Knowledge database not connected.</p>
                <p className="text-white/50 max-w-md mx-auto">
                  Set <code className="text-accent-default">VITE_DATABASE_URL</code> in your environment to load published entries from Neon.
                </p>
              </>
            ) : !filtered && all.length === 0 ? (
              <p className="text-xl text-white/70">No published entries yet.</p>
            ) : (
              <>
                <p className="text-xl text-white/70 mb-6">
                  Nothing found{q ? ` for “${q}”` : ""}
                  {tag ? ` in #${tag}` : ""}
                  {category ? ` in ${cats.find((c) => c.slug === category)?.name || category}` : ""}.
                </p>
                <Button variant="outline" onClick={reset}>
                  Reset filters
                </Button>
              </>
            )}
          </div>
        ) : (
          <>
            <p className="text-sm text-white/40 mb-6 text-center">
              {results.length} {results.length === 1 ? "item" : "items"}
              {(q || tag || category || group !== "all") && (
                <button type="button" onClick={reset} className="ml-3 text-accent-default hover:text-accent-hover">
                  clear
                </button>
              )}
            </p>
            <div className="columns-1 md:columns-2 xl:columns-3 gap-6">
              {results.map((entry) => (
                <div key={entry.id} className="mb-6 break-inside-avoid">
                  <KnowledgeCard entry={entry} onTag={toggleTag} onCategory={toggleCategory} playlistCount={playlistCounts.get(entry.id) || 0} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </motion.section>
  );
};

export default Knowledge;
