import { Link, useLocation } from "react-router-dom";
import { BsArrowUpRight, BsPlayFill, BsFileText } from "react-icons/bs";
import { FaYoutube, FaLinkedinIn, FaGithub, FaGlobe, FaPodcast, FaStar } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { typeMeta, colorOf } from "@/data/knowledge";
import { youtubeThumb, faviconFor, hostOf, formatDate, hasSummary } from "@/lib/knowledge";

const ME = "Youssef Degachi";

const platformIcon = (platform, url) => {
  const host = hostOf(url);
  if (platform === "youtube" || host.includes("youtube")) return <FaYoutube />;
  if (platform === "linkedin" || host.includes("linkedin")) return <FaLinkedinIn />;
  if (platform === "twitter" || host === "x.com" || host.includes("twitter")) return <FaXTwitter />;
  if (platform === "github" || host.includes("github")) return <FaGithub />;
  if (platform === "podcast") return <FaPodcast />;
  return <FaGlobe />;
};

const cardBase =
  "relative flex flex-col p-6 rounded-xl bg-[#232329] border border-white/5 hover:border-accent-default/40 hover:-translate-y-0.5 transition-[border-color,transform] duration-300";

const featuredClass = (e) => (e.featured ? "border-l-2 border-l-accent-default" : "");

const Badge = ({ children, accent = false, className = "" }) => (
  <span
    className={`text-[10px] uppercase tracking-wider rounded-full px-2.5 py-0.5 ${
      accent
        ? "bg-accent-default/15 text-accent-default border border-accent-default/30"
        : "text-white/50 border border-white/10"
    } ${className}`}
  >
    {children}
  </span>
);

/** Coloured category pill (dot + name). Click → filter by category. */
const CategoryPill = ({ category, onCategory }) => {
  if (!category) return null;
  const c = colorOf(category.color);
  return (
    <button
      type="button"
      onClick={() => onCategory?.(category.slug)}
      title={`Show everything in ${category.name}`}
      className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider rounded-full px-2.5 py-0.5 border hover:brightness-125 transition"
      style={{ backgroundColor: c.bg, color: c.text, borderColor: `${c.text}55` }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: c.text }} aria-hidden />
      {category.name}
    </button>
  );
};

const Tags = ({ tags = [], onTag }) =>
  tags.length ? (
    <ul className="flex flex-wrap gap-1.5 mt-4">
      {tags.map((t) => (
        <li key={t}>
          <button
            type="button"
            onClick={() => onTag?.(t)}
            className="text-[11px] text-white/50 hover:text-accent-default transition-colors"
          >
            #{t}
          </button>
        </li>
      ))}
    </ul>
  ) : null;

const Stars = ({ rating }) =>
  rating ? (
    <span className="inline-flex items-center gap-0.5 text-accent-default text-xs" aria-label={`${rating} out of 5`}>
      {Array.from({ length: rating }).map((_, i) => (
        <FaStar key={i} />
      ))}
    </span>
  ) : null;

const Header = ({ entry, label, onCategory }) => (
  <div className="flex items-start justify-between gap-2 mb-4">
    <div className="flex items-center gap-2 flex-wrap">
      <Badge>{label}</Badge>
      <CategoryPill category={entry.category} onCategory={onCategory} />
      {entry.featured && <Badge accent>featured</Badge>}
    </div>
    <span className="text-xs text-white/40 whitespace-nowrap">{formatDate(entry.published_at || entry.created_at)}</span>
  </div>
);

/** External link (secondary action). */
const ExtLink = ({ href, children, className = "" }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={`inline-flex items-center gap-1.5 text-sm text-white/60 hover:text-accent-default transition-colors ${className}`}
  >
    {children} <BsArrowUpRight />
  </a>
);

/** Primary action: the page with my summary (pill with accent border). */
const SummaryLink = ({ entry, children = "Summary" }) => {
  const location = useLocation();
  return (
    <Link
      to={`/knowledge/${entry.slug}`}
      state={{ from: `${location.pathname}${location.search}` }}
      className="inline-flex items-center gap-2 text-sm font-medium text-accent-default border border-accent-default/40 rounded-full px-3.5 py-1.5 hover:bg-accent-default hover:text-primary transition-colors"
    >
      <BsFileText /> {children}
    </Link>
  );
};

/** Row with the primary (summary) + secondary (external) actions. */
const Actions = ({ entry, external, left = null, forceSummary = false, summaryLabel }) => {
  const summary = hasSummary(entry) || (forceSummary && entry.slug);
  return (
    <div className="flex items-center justify-between gap-3 mt-5 flex-wrap">
      <div className="flex items-center gap-3">{left}</div>
      <div className="flex items-center gap-4">
        {entry.url && (
          <ExtLink href={entry.url} className={summary ? "" : "text-accent-default"}>
            {external}
          </ExtLink>
        )}
        {summary && <SummaryLink entry={entry}>{summaryLabel || "Summary"}</SummaryLink>}
      </div>
    </div>
  );
};

// --- Blog / Note --------------------------------------------------------------
const PostCard = ({ entry, onTag, onCategory }) => {
  const isNote = entry.type === "note";
  const location = useLocation();
  const from = `${location.pathname}${location.search}`;
  return (
    <article className={`${cardBase} ${featuredClass(entry)}`}>
      <Header entry={entry} label={isNote ? "note" : "blog"} onCategory={onCategory} />
      <h3 className={`${isNote ? "text-xl" : "text-2xl"} font-semibold leading-snug mb-3`}>
        <Link to={`/knowledge/${entry.slug}`} state={{ from }} className="hover:text-accent-default transition-colors">
          {entry.title}
        </Link>
      </h3>
      {entry.summary && <p className="text-white/60 text-sm leading-relaxed flex-1">{entry.summary}</p>}
      <Tags tags={entry.tags} onTag={onTag} />
      <div className="flex items-center justify-between gap-3 mt-5 flex-wrap">
        <Link
          to={`/knowledge/${entry.slug}`}
          state={{ from }}
          className="inline-flex items-center gap-2 text-accent-default hover:text-accent-hover transition-colors text-sm"
        >
          Read <BsArrowUpRight />
        </Link>
        {entry.url && (
          <ExtLink href={entry.url} className="text-xs">
            Original on {hostOf(entry.url)}
          </ExtLink>
        )}
      </div>
    </article>
  );
};

// --- Quote --------------------------------------------------------------------
const QuoteCard = ({ entry, onTag, onCategory }) => {
  const mine = entry.author === ME;
  return (
    <article className={`${cardBase} ${featuredClass(entry)} justify-between !bg-[#26262d]`}>
      <div>
        <div className="flex items-start justify-between gap-2">
          <span className="block text-accent-default text-5xl leading-none font-serif select-none" aria-hidden>
            “
          </span>
          <CategoryPill category={entry.category} onCategory={onCategory} />
        </div>
        <p className="text-lg xl:text-xl leading-relaxed -mt-3">{entry.title}</p>
      </div>
      <div className="mt-6 flex items-center justify-between gap-2 flex-wrap">
        <span className="text-white/70 text-sm">— {entry.author || "Unknown"}</span>
        {mine ? <Badge accent>from me</Badge> : entry.featured ? <Badge accent>featured</Badge> : null}
      </div>
      <Tags tags={entry.tags} onTag={onTag} />
    </article>
  );
};

// --- Video --------------------------------------------------------------------
const VideoCard = ({ entry, onTag, onCategory }) => {
  const thumb = youtubeThumb(entry.url);
  return (
    <article className={`${cardBase} ${featuredClass(entry)} p-0 overflow-hidden`}>
      <a href={entry.url} target="_blank" rel="noopener noreferrer" className="relative block aspect-video bg-black/40 group">
        {thumb ? (
          <img src={thumb} alt="" loading="lazy" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/30">
            <FaYoutube className="text-5xl" />
          </div>
        )}
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="w-14 h-14 rounded-full bg-accent-default/90 text-primary flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
            <BsPlayFill />
          </span>
        </span>
      </a>
      <div className="p-6 flex flex-col flex-1">
        <Header entry={entry} label="video" onCategory={onCategory} />
        <h3 className="text-xl font-semibold leading-snug mb-2">
          <a href={entry.url} target="_blank" rel="noopener noreferrer" className="hover:text-accent-default transition-colors">
            {entry.title}
          </a>
        </h3>
        {entry.author && <p className="text-xs text-white/40 mb-3">{entry.author}</p>}
        {entry.summary && <p className="text-white/60 text-sm leading-relaxed flex-1">{entry.summary}</p>}
        <Actions entry={entry} external="Watch" left={<Stars rating={entry.rating} />} />
        <Tags tags={entry.tags} onTag={onTag} />
      </div>
    </article>
  );
};

// --- Resource (article / book / course / website / tool) ----------------------
const ResourceCard = ({ entry, onTag, onCategory }) => {
  const meta = typeMeta(entry.type);
  const favicon = faviconFor(entry.url);
  const host = hostOf(entry.url);
  return (
    <article className={`${cardBase} ${featuredClass(entry)}`}>
      <Header entry={entry} label={meta?.label?.toLowerCase() || entry.type} onCategory={onCategory} />
      <div className="flex items-center gap-3 mb-3">
        <span className="w-10 h-10 rounded-lg bg-primary border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
          {favicon ? <img src={favicon} alt="" loading="lazy" className="w-5 h-5" /> : <FaGlobe className="text-white/40" />}
        </span>
        <div className="min-w-0">
          <h3 className="text-lg font-semibold leading-snug truncate">
            {entry.url ? (
              <a href={entry.url} target="_blank" rel="noopener noreferrer" className="hover:text-accent-default transition-colors">
                {entry.title}
              </a>
            ) : (
              entry.title
            )}
          </h3>
          <p className="text-xs text-white/40 truncate">{[entry.author, host].filter(Boolean).join(" · ")}</p>
        </div>
      </div>
      {entry.summary && <p className="text-white/60 text-sm leading-relaxed flex-1">{entry.summary}</p>}
      <Actions
        entry={entry}
        external="Open"
        left={
          <>
            <Stars rating={entry.rating} />
            {entry.status && entry.status !== "done" && (
              <Badge>{entry.status === "in_progress" ? "reading now" : "on my list"}</Badge>
            )}
          </>
        }
      />
      <Tags tags={entry.tags} onTag={onTag} />
    </article>
  );
};

// --- Person / Channel ---------------------------------------------------------
const PeopleCard = ({ entry, onTag, onCategory, playlistCount = 0 }) => (
  <article className={`${cardBase} ${featuredClass(entry)}`}>
    <Header entry={entry} label={entry.type} onCategory={onCategory} />
    <div className="flex items-center gap-4 mb-3">
      <span className="w-12 h-12 rounded-full border border-accent-default text-accent-default flex items-center justify-center text-xl shrink-0">
        {platformIcon(entry.platform, entry.url)}
      </span>
      <div className="min-w-0">
        <h3 className="text-lg font-semibold leading-snug">
          <a href={entry.url} target="_blank" rel="noopener noreferrer" className="hover:text-accent-default transition-colors">
            {entry.title}
          </a>
        </h3>
        <p className="text-xs text-white/40 truncate">{hostOf(entry.url)}</p>
      </div>
    </div>
    {entry.summary && (
      <p className="text-white/60 text-sm leading-relaxed flex-1">
        <span className="text-white/35">Why I follow: </span>
        {entry.summary}
      </p>
    )}
    <Actions
      entry={entry}
      external="Follow"
      forceSummary
      summaryLabel={`Playlist (${playlistCount})`}
    />
    <Tags tags={entry.tags} onTag={onTag} />
  </article>
);

const KnowledgeCard = ({ entry, onTag, onCategory, playlistCount = 0 }) => {
  switch (entry.type) {
    case "blog":
    case "note":
      return <PostCard entry={entry} onTag={onTag} onCategory={onCategory} />;
    case "quote":
      return <QuoteCard entry={entry} onTag={onTag} onCategory={onCategory} />;
    case "video":
      return <VideoCard entry={entry} onTag={onTag} onCategory={onCategory} />;
    case "channel":
    case "person":
      return <PeopleCard entry={entry} onTag={onTag} onCategory={onCategory} playlistCount={playlistCount} />;
    default:
      return <ResourceCard entry={entry} onTag={onTag} onCategory={onCategory} />;
  }
};

export default KnowledgeCard;
