# How the "public site + private editor" setup works (and how to reuse it)

This is the pattern used for the portfolio's **/knowledge** section. The same idea works for any
project where **people see a public website** and **you update its content from localhost**,
without building or hosting a backend.

```
                 ┌──────────────────────────────┐
   you (localhost)│  my-personal-info  (EDITOR)  │  writes  ─┐
                 │  React + Tiptap, port 5174    │           │
                 └──────────────────────────────┘           ▼
                                                   ┌─────────────────┐
                                                   │  Neon Postgres   │  ONE database
                                                   │  tables:         │  (free tier)
                                                   │  entries,        │
                                                   │  categories      │
                                                   └─────────────────┘
                 ┌──────────────────────────────┐           ▲
   everyone      │  my_portfolio  (PUBLIC SITE)  │  reads   ─┘  only published rows
                 │  static, GitHub Pages         │
                 └──────────────────────────────┘
```

Two static apps, zero servers of your own. Both talk **SQL over HTTPS** to Neon using
`@neondatabase/serverless`. What makes it safe is *which database role* each app uses.

---

## 1. The three pieces

### Database (Neon)
- Plain Postgres. Schema lives in **one file**: `my-personal-info/db/schema.sql`
  (idempotent — re-run it after any change with `npm run db:push`).
- Two tables: `entries` (every item: blog, note, quote, video, article, book, course, website,
  tool, channel, person — a `type` column decides which fields matter) and `categories`
  (your own categories, created from the editor).
- `published boolean` on each entry is the switch between "only I see it" and "everyone sees it".
- Two roles:
  | role | who uses it | can do |
  |------|-------------|--------|
  | `neondb_owner` (the string from Neon console) | you, in the editor | everything |
  | `portfolio_reader` (created by `db/create-reader.sql`) | the public site | `SELECT` only, and Row Level Security hides unpublished rows |

### my-personal-info (the editor — private, runs on localhost)
- Vite + React + **Tiptap v3** rich editor with Notion-style colours, markdown mode, code blocks,
  images (compressed and embedded — no file storage needed).
- **Login = paste the owner connection string.** It is stored only in the browser's
  `localStorage` (`knowledge_db_url`), never in the code, never in a build. That is the whole
  auth system: whoever has the owner string is the admin, and only you have it.
  - In dev the login box is prefilled from `.env` (`VITE_DATABASE_URL`); `vite.config.js`
    blanks it for production builds so it can never leak.
- Pages: Dashboard, Entries (list + search, `#tag` search), Entry editor (one adaptive form per
  type), Categories (create / colour / reorder), Tags (rename / merge / delete everywhere).
- Data layer = three small files with raw SQL: `src/lib/entries.js`, `categories.js`, `tags.js`
  (one parametrized statement per call, `insert … on conflict (id) do update` for saves).
- Scripts: `npm run db:push` (apply schema), `npm run export` (dump everything to JSON/markdown).
- Docs inside it: `docs/DATA-MODEL.md` (the contract — every column explained),
  `docs/SETUP-NEON.md` (create DB → push schema → create reader role → login), `CLAUDE.md`.
- It is its **own git repo** (folder is git-ignored by the portfolio). You can deploy it too if
  you like (GitHub Pages) — since there are no secrets in the build, that's safe; you'd paste the
  connection string once in that browser.

### my_portfolio (the public site)
- `src/lib/db.js` → Neon client with the **reader** string from `VITE_DATABASE_URL`
  (also the GitHub Actions secret for deploy).
- `src/lib/knowledge.js` → one light query for the list (no big content columns), one full
  query per `/knowledge/:slug`. Everything else (search, group / category / tag filters,
  URL-synced `?q=&group=&tag=&category=`) is client-side — a personal KB is small.
- If the env var is missing or the DB is unreachable it silently shows seed demo data
  (`src/data/knowledge.js`), so the site never breaks.
- Stored HTML from Tiptap is rendered through DOMPurify (`ADD_ATTR: ['style','target','rel']`)
  inside `.knowledge-prose`, so the Notion colours come through as inline styles.

---

## 2. Daily workflow

```
cd my-personal-info && npm run dev      # http://localhost:5174 → Connect → write → toggle Published
cd my_portfolio && npm run dev          # http://localhost:5173/knowledge → see it immediately
```
No deploy is needed to change content: the live site reads the database at page load. You only
redeploy the portfolio when you change **code**.

Adding a **category** or **tag**: just do it in the editor — the portfolio reads them.
Adding a new **type** (code change): `db/schema.sql` (type check) → `npm run db:push` → editor
`src/lib/constants.js` + `EntryForm.jsx` → portfolio `src/data/knowledge.js` + `KnowledgeCard.jsx`.

---

## 3. Reusing the idea in another project (recipe)

1. **Neon**: new project (free) → copy the owner connection string.
2. **Schema**: write `db/schema.sql` with your own table(s). Keep these ideas:
   - a `published boolean` (+ `published_at`) column,
   - `slug text unique` if items get their own page,
   - `updated_at` trigger,
   - `enable row level security` + a `for select … using (published = true)` policy,
   - a reader role with `grant select` only (`db/create-reader.sql` is copy-paste ready).
   Apply with `psql "$DATABASE_URL" -f db/schema.sql` or copy `db/push.mjs`.
3. **Editor app**: copy `my-personal-info` and delete what you don't need. The parts to keep are
   `src/lib/db.js` (connection-string login + `getSql()` + `normalizeRow`), `src/lib/auth.jsx`,
   `src/pages/Login.jsx`, `vite.config.js` (the `define` that blanks the env in builds), the
   `RichEditor` component if you want rich text, and the `db/` + `scripts/` folders. Then write
   your own `src/lib/<table>.js` with SQL for your table.
4. **Public site**: `npm i @neondatabase/serverless`, copy `src/lib/db.js` (reader string in
   `VITE_DATABASE_URL`), write one `select … where published` query, add a seed fallback if you
   want the site to work without the DB. Add `VITE_DATABASE_URL` as a GitHub secret for deploy.
5. **Rules that keep it safe**
   - owner string: only in `.env` (git-ignored) and in your browser's localStorage,
   - reader string: fine to ship, because RLS + `SELECT`-only grants make it harmless,
   - never put `VITE_DATABASE_URL` (owner) in a deployed editor build — the `define` trick
     handles it, keep it,
   - one statement per query call (the HTTP driver doesn't accept `a; b`), always schema-qualify
     tables (`public.entries`), timestamps come back as `Date` → convert to ISO strings.

---

## 4. Where things are (this project)

| what | where |
|------|-------|
| schema (contract) | `my-personal-info/db/schema.sql`, `docs/DATA-MODEL.md` |
| DB setup guide | `my-personal-info/docs/SETUP-NEON.md` |
| editor data layer | `my-personal-info/src/lib/{db,entries,categories,tags}.js` |
| editor login / auth | `my-personal-info/src/pages/Login.jsx`, `src/lib/auth.jsx` |
| portfolio data layer | `my_portfolio/src/lib/{db,knowledge}.js` |
| portfolio pages | `src/pages/Knowledge.jsx`, `KnowledgeEntry.jsx`, `src/components/KnowledgeCard.jsx` |
| env templates | `my_portfolio/.exemple.env`, `my-personal-info/.env.example` |
| deploy | `my_portfolio/.github/workflows/deploy.yml` (secret `VITE_DATABASE_URL`) |
| what's left for you | `steps-task.md` |
