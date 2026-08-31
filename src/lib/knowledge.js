import { sql, normalizeRow } from "@/lib/db";
import { KNOWLEDGE_GROUPS } from "@/data/knowledge";

/** Embedded category object, same shape the editor uses (needs the FK entries.category_id → categories.id). */
const CATEGORY_EMBED = `case when c.id is null then null else
  json_build_object('id', c.id, 'name', c.name, 'slug', c.slug, 'color', c.color) end as category`;

/** Embedded channel/person this entry is from (entries.source_id → entries.id). RLS: null unless published. */
const SOURCE_EMBED = `case when s.id is null then null else
  json_build_object('id', s.id, 'title', s.title, 'slug', s.slug, 'type', s.type) end as source`;

/**
 * Light list query: everything a card needs, WITHOUT the rich content columns
 * (content_html may embed images as data: URLs). `has_content` tells the card
 * whether a /knowledge/:slug page exists; the page itself loads the full row.
 */
const LIST_SQL = `select e.id, e.type, e.title, e.slug, e.summary, e.category_id, e.url, e.author,
    e.platform, e.tags, e.language, e.cover_image, e.status, e.rating, e.featured, e.published,
    e.published_at, e.created_at, e.updated_at, e.source_id,
    (coalesce(e.content_html, '') <> '') as has_content,
    ${CATEGORY_EMBED},
    ${SOURCE_EMBED}
  from public.entries e
  left join public.categories c on c.id = e.category_id
  left join public.entries s on s.id = e.source_id
  where e.published
  order by e.featured desc, e.published_at desc nulls last, e.created_at desc`;

const ONE_SQL = `select e.*, (coalesce(e.content_html, '') <> '') as has_content, ${CATEGORY_EMBED}, ${SOURCE_EMBED}
  from public.entries e
  left join public.categories c on c.id = e.category_id
  left join public.entries s on s.id = e.source_id
  where e.published and e.slug = $1
  limit 1`;

const CATEGORIES_SQL = `select * from public.categories order by sort_order asc, name asc`;

// ---------------------------------------------------------------------------
// Fetching (Neon only — no local seed fallback)
// ---------------------------------------------------------------------------

let cache = null; // resolved array of entries
let inflight = null; // pending promise so parallel callers share one request
let warned = false;

const warnOnce = (msg, err) => {
  if (warned) return;
  warned = true;
  console.warn(`[knowledge] ${msg}`, err || "");
};

const sortEntries = (list) =>
  [...list].sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    const da = a.published_at || a.created_at || "";
    const db = b.published_at || b.created_at || "";
    return db.localeCompare(da);
  });

async function load() {
  if (!sql) {
    warnOnce("VITE_DATABASE_URL missing — knowledge list will be empty");
    return [];
  }
  try {
    const rows = await sql.query(LIST_SQL);
    return sortEntries((rows || []).map(normalizeRow));
  } catch (err) {
    warnOnce("Database request failed", err);
    return [];
  }
}

/** All published entries (light rows: no content_*). Cached for the lifetime of the page. */
export async function fetchEntries() {
  if (cache) return cache;
  if (!inflight) {
    inflight = load().then((list) => {
      cache = list;
      inflight = null;
      return list;
    });
  }
  return inflight;
}

const fullCache = new Map(); // slug → full row (with content_html)

/** A single entry by slug — the FULL row (list rows don't carry content_html). */
export async function fetchEntryBySlug(slug) {
  if (!slug) return null;
  if (fullCache.has(slug)) return fullCache.get(slug);

  if (sql) {
    try {
      const rows = await sql.query(ONE_SQL, [slug]);
      const row = rows?.[0] ? normalizeRow(rows[0]) : null;
      if (row) {
        fullCache.set(slug, row);
        return row;
      }
    } catch (err) {
      warnOnce("Database request failed", err);
    }
  }
  const all = await fetchEntries();
  return all.find((e) => e.slug === slug) || null;
}

// ---------------------------------------------------------------------------
// Categories (user-defined, table `categories`)
// ---------------------------------------------------------------------------

let categoryCache = null;

/** All categories ordered by sort_order then name. */
export async function fetchCategories() {
  if (categoryCache) return categoryCache;
  if (!sql) {
    warnOnce("VITE_DATABASE_URL missing — categories will be empty");
    categoryCache = [];
    return categoryCache;
  }
  try {
    const rows = await sql.query(CATEGORIES_SQL);
    categoryCache = (rows || []).map(normalizeRow);
  } catch (err) {
    warnOnce("Database request failed", err);
    categoryCache = [];
  }
  return categoryCache;
}

/** Categories that have at least one entry, with counts, in `categories` order. */
export function collectCategories(entries, categories = []) {
  const counts = new Map();
  for (const e of entries) {
    const slug = e.category?.slug;
    if (slug) counts.set(slug, (counts.get(slug) || 0) + 1);
  }
  const known = categories.filter((c) => counts.has(c.slug));
  // categories embedded on entries but missing from the list (shouldn't happen, but be safe)
  for (const e of entries) {
    const c = e.category;
    if (c?.slug && !known.some((k) => k.slug === c.slug)) known.push(c);
  }
  return known.map((c) => ({ ...c, count: counts.get(c.slug) || 0 }));
}

// ---------------------------------------------------------------------------
// Client-side filtering
// ---------------------------------------------------------------------------

const stripHtml = (html) => (html ? html.replace(/<[^>]*>/g, " ") : "");

const haystack = (e) =>
  [
    e.title,
    e.summary,
    e.author,
    (e.tags || []).join(" "),
    e.content_text || stripHtml(e.content_html),
    e.url,
    e.category?.name,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

export const groupFor = (groupId) =>
  KNOWLEDGE_GROUPS.find((g) => g.id === groupId) || KNOWLEDGE_GROUPS[0];

/**
 * Pure filter. `q` is split into words; every word must appear somewhere.
 * `group` is a KNOWLEDGE_GROUPS id, `tag` an exact tag, `category` a category slug.
 */
export function filterEntries(entries, { q = "", group = "all", tag = "", category = "" } = {}) {
  const types = groupFor(group).types;
  const words = q.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const wantTag = tag.trim().toLowerCase();
  const wantCat = category.trim().toLowerCase();

  return entries.filter((e) => {
    if (!types.includes(e.type)) return false;
    if (wantTag && !(e.tags || []).map((t) => t.toLowerCase()).includes(wantTag)) return false;
    if (wantCat && (e.category?.slug || "").toLowerCase() !== wantCat) return false;
    if (words.length) {
      const text = haystack(e);
      if (!words.every((w) => text.includes(w))) return false;
    }
    return true;
  });
}

/** [{ tag, count }] sorted by count desc then name. */
export function collectTags(entries) {
  const counts = new Map();
  for (const e of entries) {
    for (const t of e.tags || []) counts.set(t, (counts.get(t) || 0) + 1);
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

/** Count of entries per group id (for the chips). */
export function countByGroup(entries) {
  const out = {};
  for (const g of KNOWLEDGE_GROUPS) {
    out[g.id] = entries.filter((e) => g.types.includes(e.type)).length;
  }
  return out;
}

// ---------------------------------------------------------------------------
// Small helpers
// ---------------------------------------------------------------------------

export function youtubeId(url) {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (u.hostname === "youtu.be") return u.pathname.slice(1) || null;
    if (u.hostname.endsWith("youtube.com")) {
      if (u.searchParams.get("v")) return u.searchParams.get("v");
      const m = u.pathname.match(/\/(embed|shorts|live)\/([^/?]+)/);
      if (m) return m[2];
    }
  } catch {
    return null;
  }
  return null;
}

export const youtubeThumb = (url) => {
  const id = youtubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
};

export function hostOf(url) {
  if (!url) return "";
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export const faviconFor = (url) => {
  const host = hostOf(url);
  return host ? `https://www.google.com/s2/favicons?domain=${host}&sz=64` : null;
};

/** True when the entry has a readable page (/knowledge/:slug) — blogs/notes or link types with a summary. */
export const hasSummary = (e) =>
  Boolean(e?.slug && (e.has_content ?? Boolean(e.content_html && e.content_html.trim())));

export function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}
