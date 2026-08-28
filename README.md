# Youssef Degachi — Portfolio

Personal site: who I am, what I build (Andalib AI, JeridSchool, client work) and a public **Knowledge** base —
every blog, note, quote, video, article, book, course, tool, channel and person I learn from, all searchable.

**Stack:** Vite · React 18 · Tailwind · React Router · framer-motion · Neon Postgres (read-only) · DOMPurify

## Run it
```bash
npm install
cp .exemple.env .env   # optional — fill VITE_DATABASE_URL (read-only Neon connection string)
npm run dev            # http://localhost:5173
npm run build          # static output in dist/
```
Without `VITE_DATABASE_URL` the `/knowledge` page shows built-in demo entries from `src/data/knowledge.js`.

## Where does the Knowledge content come from?
From a small Neon (Postgres) table called `entries`, which I edit with a separate private app:
**[my-personal-info](https://github.com/youssef-degachi/my-personal-info)** (Tiptap editor, markdown, Notion-style colours).
This site only reads rows with `published = true`. The full schema and the meaning of every column live in
that repo: `docs/DATA-MODEL.md` and `db/schema.sql`.

```
my-personal-info (editor, writes) ──▶ Neon `entries` ──▶ my_portfolio /knowledge (reads, published only)
```

## Pages
`/` home · `/services` · `/resume` · `/work` (products | client work) · `/knowledge` · `/knowledge/:slug` · `/contact`

Search on `/knowledge` is synced to the URL (`/knowledge?q=voice+ai&group=videos&tag=react`) so any result list can be shared.

## Project docs
- `CLAUDE.md` — architecture / conventions for AI-assisted work
- `project-idea.md` — roadmap, what shipped, what's pending
