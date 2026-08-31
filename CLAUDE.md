# my_portfolio — guide for Claude Code

Public portfolio of **Youssef Degachi** (fullstack + AI / voice agents, co-founder of Andalib AI and JeridSchool).
Live content for the **Knowledge** section comes from a **Neon Postgres** database that is **edited by a separate repo:
`my-personal-info`** (sibling folder `../my-personal-info`, its own GitHub repo). Read that repo's
`docs/DATA-MODEL.md` + `db/schema.sql` before touching anything under `src/lib/knowledge.js`, `src/data/knowledge.js`, or the
Knowledge pages — it is the contract between the two apps.

## Stack
- Vite 5 + React 18, **plain JSX (no TypeScript)**, React Router 6, Tailwind 3, framer-motion, Swiper,
  Radix/shadcn-style ui in `src/components/ui`, react-icons, tsparticles background.
- Dark theme: bg `#1C1C22` (`bg-primary`), cards `#232329`, accent red `#F13024` (`text-accent-default`),
  font JetBrains Mono. Headings use the `.h1/.h2/.h3` classes from `src/globals.css`.
- Path alias `@` → `src/` (vite.config.js + jsconfig.json).
- Data: `@neondatabase/serverless` (SQL over HTTPS, read-only `portfolio_reader` role — RLS only exposes
  published rows, so the connection string is safe in the bundle) + `dompurify` for rendering stored HTML.

## Commands
```
npm install
npm run dev      # http://localhost:5173 (opens browser)
npm run build    # vite build → dist/
npm run preview
npm run lint     # eslint (react / hooks / refresh plugins)
```
Env (optional — without it the Knowledge page shows the local seed data):
```
VITE_DATABASE_URL=   # postgresql://portfolio_reader:…@…neon.tech/neondb?sslmode=require
```
Template in `.exemple.env`. Never commit `.env`.

## Routes (`src/App.jsx`)
| Route | File | Notes |
|-------|------|-------|
| `/` | `src/pages/Home.jsx` | hero, photo, stats, socials |
| `/services` | `src/pages/Services.jsx` | |
| `/pricing` | `src/pages/Pricing.jsx` | 4 custom offers (starting prices, currency selector), WhatsApp CTA, FAQ accordion; data in `src/data/pricing.js`, components `PricingCard.jsx` (flip on md+, expand on mobile) + `Faq.jsx` |
| `/resume` | `src/pages/Resume.jsx` | tabs: about / experience / education / skills |
| `/work` | `src/pages/Work.jsx` | tabs Products \| Client work; data in `src/data/work.js` |
| `/knowledge` | `src/pages/Knowledge.jsx` | searchable knowledge base (see below) |
| `/knowledge/:slug` | `src/pages/KnowledgeEntry.jsx` | one blog / note |
| `/contact` | `src/pages/Contact.jsx` | WhatsApp primary |

Nav links are duplicated in `src/components/Nav.jsx` (desktop) and `src/components/MobileNav.jsx` — change both.

## Knowledge section (how it works)
```
Neon Postgres  public.entries (published = true, enforced by RLS on portfolio_reader)
   │  src/lib/db.js            → `sql` (neon client) or null when env missing, normalizeRow() (Date → ISO)
   ▼
src/lib/knowledge.js          → fetchEntries() (LIGHT list query: no content_* columns, `has_content` flag +
                                 json_build_object category embed, cached, falls back to seed),
                                 fetchEntryBySlug() (full row, cached per slug), fetchCategories(), filterEntries({q, group, tag,
                                 category}), collectTags(), collectCategories(), countByGroup(), hasSummary(),
                                 youtubeId/youtubeThumb(), faviconFor(), hostOf(), formatDate()
   │
   ├─ src/data/knowledge.js   → KNOWLEDGE_TYPES (11 types), KNOWLEDGE_GROUPS (All/Blogs/Notes/Quotes/
   │                             Videos/Resources/People & channels), LINK_TYPES, NOTION_COLORS + colorOf(),
   │                             typeMeta(), seedCategories + seedEntries (fallback demo data)
   ├─ src/pages/Knowledge.jsx → search box (debounced, synced to ?q=&group=&tag=&category= so URLs are
   │                             shareable; "/" key focuses it), group chips with counts, coloured category
   │                             chips (user-defined categories from the `categories` table — only those with
   │                             ≥1 published entry), top-15 tag chips, masonry card columns
   ├─ src/components/KnowledgeCard.jsx → one card component, renders differently per type:
   │        blog/note → "Read" to /knowledge/:slug (+ "Original on <host> ↗" when `url` is set)
   │        quote → big quote on a lighter surface + "from me" badge
   │        video → YouTube thumbnail + "Watch ↗"     article/book/course/website/tool → favicon + host + ★
   │        channel/person → platform icon + "Follow ↗"   featured → accent left border
   │        every link type: when hasSummary(entry) (slug + content_html) a primary "Summary" pill links to
   │        /knowledge/:slug, passing state.from so the back link restores the previous filters
   │        category pill (dot + name, Notion colour) near the type badge → ?category=<slug>
   └─ src/pages/KnowledgeEntry.jsx → works for EVERY type: video with YouTube url → embedded
                                     youtube-nocookie player; other link types → "Open on <host> ↗" button;
                                     blog/note with url → "Originally published on <host>"; "My summary"
                                     heading for link types; Share (copy URL) button; 760px prose.
                                     DOMPurify.sanitize(content_html, {ADD_ATTR:['style','target','rel']})
                                     rendered inside `.knowledge-prose` (styles in src/globals.css, Notion
                                     colours come through as inline styles from the editor)
```
- All filtering is **client-side**: the whole published table is fetched once (it's a personal KB, small).
  The DB also has `search_entries(q, entry_type)` / `entry_tags()` RPCs if it ever grows.
- To add a new **type**: add it in `db/schema.sql` (other repo, then `npm run db:push` there) → `KNOWLEDGE_TYPES` + a group in
  `src/data/knowledge.js` → a branch in `KnowledgeCard.jsx` → the editor's `constants.js`.
- **Categories** are data, not code: Youssef creates them in the editor; the portfolio just reads
  `categories` (embedded on each entry as `entry.category = {id,name,slug,color}`). Nothing to change here
  when a category is added.
- `seedEntries` is **demo content** — keep it realistic but it is not the real DB. Visitors never see a
  "fallback" notice on purpose.

## Conventions
- Keep copy in Youssef's voice (first person, short). Arabic/French content allowed (`language` column).
- External links: real `<a target="_blank" rel="noopener noreferrer">`, never `<Link>`.
- Motion: pages fade in with framer-motion (`Work.jsx` pattern). Page/stair transitions are intentionally
  commented out in `App.jsx`.
- Don't add TypeScript, don't add a backend — this site is static (GitHub Pages / Vercel).

## Known leftovers (see `project-idea.md` for the full roadmap)
- Deploy: `.github/workflows/deploy.yml` builds with Vite and publishes `dist/` to GitHub Pages. Needs repo secret `VITE_DATABASE_URL` (the read-only connection string from `.env`); base path defaults to `/<repo>/` (set repo variable `VITE_BASE=/` when using a custom domain). `App.jsx` uses `basename={import.meta.env.BASE_URL}`.
- Main JS chunk is ~1 MB because of tsparticles (two versions installed) — candidate for cleanup.
- `src/components/Sidebar.jsx` is unused.
