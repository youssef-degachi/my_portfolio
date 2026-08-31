import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import DOMPurify from "dompurify";
import { FiArrowLeft, FiCheck, FiLink, FiExternalLink } from "react-icons/fi";
import { FaStar, FaGlobe } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { typeMeta, colorOf, LINK_TYPES } from "@/data/knowledge";
import { fetchEntries, fetchEntryBySlug, formatDate, youtubeId, hostOf, faviconFor, hasSummary } from "@/lib/knowledge";

const ME = "Youssef Degachi";

const STATUS_LABEL = { queued: "on my list", in_progress: "reading now", done: "done" };

/** Copy-the-URL button with a 2s "Copied" state. */
const ShareButton = () => {
  const [copied, setCopied] = useState(false);
  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard blocked — nothing else to do, the URL is in the address bar
    }
  };
  return (
    <button
      type="button"
      onClick={share}
      className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-accent-default transition-colors"
      aria-live="polite"
    >
      {copied ? <FiCheck className="text-accent-default" /> : <FiLink />}
      {copied ? "Copied" : "Share"}
    </button>
  );
};

const CategoryPill = ({ category }) => {
  if (!category) return null;
  const c = colorOf(category.color);
  return (
    <Link
      to={`/knowledge?category=${encodeURIComponent(category.slug)}`}
      className="inline-flex items-center gap-1.5 uppercase tracking-wider rounded-full px-2.5 py-0.5 border hover:brightness-125 transition"
      style={{ backgroundColor: c.bg, color: c.text, borderColor: `${c.text}55` }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: c.text }} aria-hidden />
      {category.name}
    </Link>
  );
};

/** Big external CTA for link-type entries. */
const OpenButton = ({ entry, label }) => {
  const host = hostOf(entry.url);
  const favicon = faviconFor(entry.url);
  return (
    <a
      href={entry.url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-3 rounded-full border border-accent-default/50 bg-accent-default/10 px-5 py-2.5 text-accent-default hover:bg-accent-default hover:text-primary transition-colors"
    >
      <span className="w-6 h-6 rounded bg-primary/60 flex items-center justify-center overflow-hidden shrink-0">
        {favicon ? <img src={favicon} alt="" className="w-4 h-4" /> : <FaGlobe className="text-xs" />}
      </span>
      <span className="font-medium">
        {label} <span className="opacity-80">{host}</span>
      </span>
      <FiExternalLink />
    </a>
  );
};

const KnowledgeEntry = () => {
  const { slug } = useParams();
  const location = useLocation();
  const backTo = location.state?.from || "/knowledge";
  const [state, setState] = useState({ loading: true, entry: null });
  const [playlist, setPlaylist] = useState([]);

  useEffect(() => {
    let alive = true;
    setState({ loading: true, entry: null });
    fetchEntryBySlug(slug).then((entry) => alive && setState({ loading: false, entry }));
    return () => {
      alive = false;
    };
  }, [slug]);

  const { loading, entry } = state;

  useEffect(() => {
    document.title = entry ? `${entry.title} — ${ME}` : `Knowledge — ${ME}`;
  }, [entry]);

  // channel/person → load its playlist (published entries pointing at it via source_id)
  useEffect(() => {
    if (!entry || !(entry.type === "channel" || entry.type === "person")) {
      setPlaylist([]);
      return undefined;
    }
    let alive = true;
    fetchEntries().then((list) => alive && setPlaylist(list.filter((e) => e.source_id === entry.id)));
    return () => {
      alive = false;
    };
  }, [entry]);

  const html = useMemo(
    () =>
      entry?.content_html
        ? DOMPurify.sanitize(entry.content_html, { ADD_ATTR: ["style", "target", "rel"] })
        : "",
    [entry]
  );

  const back = (
    <Link to={backTo} className="inline-flex items-center gap-2 text-white/60 hover:text-accent-default transition-colors text-sm">
      <FiArrowLeft /> Knowledge
    </Link>
  );

  if (loading) {
    return (
      <section className="py-12">
        <div className="container mx-auto max-w-[760px]">
          {back}
          <div className="mt-8 h-10 w-2/3 rounded bg-[#232329] animate-pulse" />
          <div className="mt-6 space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-4 rounded bg-[#232329] animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!entry) {
    return (
      <section className="py-12 min-h-[60vh] flex items-center">
        <div className="container mx-auto max-w-[760px] text-center">
          <p className="text-6xl font-semibold text-accent-default mb-4">404</p>
          <p className="text-white/60 mb-8">This page doesn&apos;t exist or isn&apos;t published yet.</p>
          <Link to="/knowledge">
            <Button variant="outline">Back to Knowledge</Button>
          </Link>
        </div>
      </section>
    );
  }

  const meta = typeMeta(entry.type);
  const isLink = LINK_TYPES.includes(entry.type);
  const isPost = entry.type === "blog" || entry.type === "note";
  const isFollow = entry.type === "channel" || entry.type === "person";
  const ytId = entry.type === "video" ? youtubeId(entry.url) : null;
  const openLabel =
    entry.type === "video" ? "Watch on" : entry.type === "channel" || entry.type === "person" ? "Follow on" : "Open on";

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { delay: 0.2, duration: 0.4, ease: "easeIn" } }}
      className="py-12"
    >
      <article className="container mx-auto max-w-[760px]">
        <div className="flex items-center justify-between gap-4">
          {back}
          <ShareButton />
        </div>

        <header className="mt-8 mb-8">
          <div className="flex items-center gap-3 mb-4 text-xs flex-wrap">
            <span className="uppercase tracking-wider rounded-full px-2.5 py-0.5 bg-accent-default/15 text-accent-default border border-accent-default/30">
              {meta?.label || entry.type}
            </span>
            <CategoryPill category={entry.category} />
            <span className="text-white/40">{formatDate(entry.published_at || entry.created_at)}</span>
            {entry.author && entry.author !== ME && <span className="text-white/40">· {entry.author}</span>}
            {entry.source?.slug && (
              <Link
                to={`/knowledge/${entry.source.slug}`}
                className="text-white/40 hover:text-accent-default transition-colors"
              >
                · from <span className="text-white/70">{entry.source.title}</span>
              </Link>
            )}
          </div>

          <h1 className="h2 mb-4">{entry.title}</h1>

          {/* blog / note with a link to the original post */}
          {isPost && entry.url && (
            <p className="text-sm text-white/50 mb-4">
              Originally published on <span className="text-white/80">{hostOf(entry.url)}</span> —{" "}
              <a
                href={entry.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-accent-default hover:text-accent-hover transition-colors"
              >
                Read the original <FiExternalLink />
              </a>
            </p>
          )}

          {entry.summary && <p className="text-white/60 text-lg leading-relaxed">{entry.summary}</p>}

          {/* link types: open button + meta line */}
          {isLink && entry.url && (
            <div className="mt-6 flex flex-col gap-3">
              {!ytId && <OpenButton entry={entry} label={openLabel} />}
              <div className="flex items-center gap-3 text-xs text-white/40 flex-wrap">
                {entry.author && <span className="text-white/60">{entry.author}</span>}
                {entry.platform && <span className="uppercase tracking-wider">{entry.platform}</span>}
                {entry.rating ? (
                  <span className="inline-flex items-center gap-0.5 text-accent-default" aria-label={`${entry.rating} out of 5`}>
                    {Array.from({ length: entry.rating }).map((_, i) => (
                      <FaStar key={i} />
                    ))}
                  </span>
                ) : null}
                {entry.status && entry.status !== "done" && (
                  <span className="rounded-full border border-white/10 px-2 py-0.5">{STATUS_LABEL[entry.status]}</span>
                )}
              </div>
            </div>
          )}

          {entry.tags?.length > 0 && (
            <ul className="flex flex-wrap gap-2 mt-5">
              {entry.tags.map((t) => (
                <li key={t}>
                  <Link
                    to={`/knowledge?tag=${encodeURIComponent(t)}`}
                    className="text-xs text-white/50 border border-white/10 rounded-full px-3 py-1 hover:text-accent-default hover:border-accent-default/40 transition-colors"
                  >
                    #{t}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </header>

        {/* embedded YouTube player */}
        {ytId && (
          <div className="mb-8">
            <div className="aspect-video w-full rounded-xl overflow-hidden border border-white/5 bg-black">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${ytId}`}
                title={entry.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                className="w-full h-full"
              />
            </div>
            <div className="mt-3">
              <a
                href={entry.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-accent-default transition-colors"
              >
                Watch on YouTube <FiExternalLink />
              </a>
            </div>
          </div>
        )}

        {entry.cover_image && (
          <img src={entry.cover_image} alt="" className="w-full rounded-xl mb-10 border border-white/5" />
        )}

        {isLink && html && (
          <h2 className="h3 mb-4 flex items-center gap-3">
            <span className="text-accent-default">//</span> My summary
          </h2>
        )}

        {html ? (
          <div className="knowledge-prose" dangerouslySetInnerHTML={{ __html: html }} />
        ) : isFollow ? null : (
          <p className="text-white/50">{isLink ? "No summary yet." : "No content yet."}</p>
        )}

        {/* channel / person: the entries linked to it (its playlist) */}
        {isFollow && (
          <section className="mt-12">
            <h2 className="h3 mb-5 flex items-center gap-3">
              <span className="text-accent-default">//</span> Playlist
              <span className="text-sm text-white/40 font-normal">
                {playlist.length} {playlist.length === 1 ? "item" : "items"}
              </span>
            </h2>
            {playlist.length === 0 && <p className="text-white/50">Nothing linked here yet.</p>}
            <ul className="flex flex-col gap-3">
              {playlist.map((e) => {
                const inner = (
                  <>
                    <span className="uppercase tracking-wider text-[10px] rounded-full px-2 py-0.5 border border-white/10 text-white/50 shrink-0">
                      {typeMeta(e.type)?.label || e.type}
                    </span>
                    <span className="flex-1 min-w-0 truncate group-hover:text-accent-default transition-colors">
                      {e.title}
                    </span>
                    <span className="text-xs text-white/40 whitespace-nowrap">
                      {formatDate(e.published_at || e.created_at)}
                    </span>
                  </>
                );
                const cls =
                  "group flex items-center gap-3 rounded-xl border border-white/5 bg-[#232329] px-4 py-3 hover:border-accent-default/40 transition-colors";
                return (
                  <li key={e.id}>
                    {hasSummary(e) ? (
                      <Link to={`/knowledge/${e.slug}`} state={{ from: location.pathname }} className={cls}>
                        {inner}
                      </Link>
                    ) : (
                      <a href={e.url} target="_blank" rel="noopener noreferrer" className={cls}>
                        {inner}
                      </a>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        <footer className="mt-16 pt-8 border-t border-white/10 flex items-center justify-between gap-4 flex-wrap">
          {back}
          <div className="flex items-center gap-5">
            <ShareButton />
            <span className="text-xs text-white/40">{ME}</span>
          </div>
        </footer>
      </article>
    </motion.section>
  );
};

export default KnowledgeEntry;
