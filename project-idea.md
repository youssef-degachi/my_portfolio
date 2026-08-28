# Portfolio project ideas

Tracking doc for enhancement ideas, what shipped, and what is still pending.

Last updated: 2026-08-23

---

## What the website has right now

### Stack
- **Vite + React** SPA (README still says Next.js — outdated)
- React Router, Tailwind CSS, Framer Motion, Swiper, Radix/shadcn-style UI
- Dark theme (`#1C1C22`), red accent (`#F13024`), JetBrains Mono
- Particles background; stair / page transitions exist but are **commented out** in `App.jsx`

### Pages
| Route | What it shows |
|-------|----------------|
| `/` Home | Title, template-style intro, freelance + WhatsApp line, Download CV, socials, photo + spinning ring, CountUp stats |
| `/services` | ERP, UI/UX, AI Solutions, Voice AI Agent → all link to Contact |
| `/resume` | Tabs: About, Experience, Education, Skills — Freelance = **Available** |
| `/work` | Tabs: **Products** \| **Client work** |
| `/knowledge` | **NEW** — searchable knowledge base: blogs, notes, quotes, videos, resources (articles/books/courses/websites/tools), people & channels. Search synced to URL. Data from Neon Postgres, edited in the separate `my-personal-info` repo |
| `/knowledge/:slug` | **NEW** — one blog / note rendered from Tiptap HTML (Notion colours) |
| `/contact` | WhatsApp (primary), Email, Phone, LinkedIn, GitHub |

### Work page detail
- **Products (visible):** Andalib AI, JeridSchool — draft copy, letter marks (A / J), live links; no screenshots yet
- **Client work:** same Swiper as before (ControlAI, Smart Blind Assistant, Management Store, Saudi Citizen Support, Wedding Sales Manager) + NDA note on that tab only
- **Hidden in data (`visible: false`):** Open source, YouTube — ready in `src/data/work.js`, not shown in UI

### Contact / hire path
- Header **Hire me** → WhatsApp (`wa.me/21650702320`) desktop + mobile nav
- Social icons open in new tab (GitHub, LinkedIn, YouTube, X)
- Contact methods: WhatsApp, Email, Phone, LinkedIn, GitHub

### Content still generic / draft
- Home hero copy still mostly template (“I excel at crafting elegant digital experiences…”)
- Product taglines for Andalib / Jerid are placeholders to replace later
- Skills icons don’t fully match resume text (Nest, Spring Boot, React Native, etc.)
- Client GitHub links empty; product images empty

---

## Original 10 enhancement ideas

| # | Idea | Status |
|---|------|--------|
| 1 | Make copy sound like you (not the template) | **Partial** — freelance line added; hero/about still largely template |
| 2 | Case studies instead of slider + NDA apology | **Partial** — NDA moved to Client tab only; slider kept; no full case-study cards yet |
| 3 | Companies as proof (Andalib / Jerid featured) | **Done (v1)** — Products tab with 2 cards; draft copy / no screenshots |
| 4 | Skills that match the copy (grouped Frontend / Backend / AI / Mobile) | **Not done** |
| 5 | Contact that converts (WhatsApp primary + Hire me) | **Done** — WhatsApp primary; no contact form / Calendly / pricing yet |
| 6 | Turn motion back on, but lighter (faster transitions) | **Not done** — transitions still commented out |
| 7 | SEO / shareability (meta, OG image, etc.) | **Not done** |
| 8 | Single source of truth for content (`site.js` / CMS) | **Partial** — `src/data/work.js` only; contact/social/resume still duplicated |
| 9 | Accessibility and polish (alts, unused Sidebar, reduced-motion, etc.) | **Not done** |
| 10 | Stronger visual identity (not just dark-red template) | **Not done** |

---

## Agreed build plan (phases)

### Phase 0 — Content file
- One `site.js` (or similar) for name, phone, email, socials, stats, projects, skills
- **Status:** Not done (only `work.js` exists)

### Phase 1 — Voice / freelance / contact
- Keep hero layout, photo, circle animation as-is
- Freelance available, WhatsApp as main hire path
- Contact: email, phone, LinkedIn, GitHub (+ WhatsApp primary)
- **Status: Done**

### Phase 2 — Work: Products \| Client work
- Tabs on `/work`
- Products first: Andalib AI + JeridSchool only
- Open source / YouTube: data model ready, hidden until later
- Client work: keep current slider for now
- **Status: Done (v1)** — content/screenshots still to refine

### Phase 3 — Client work as richer case studies
- Filter chips, card grid, Problem → Built → Role → Result
- GitHub where possible
- **Status: Not done**

### Phase 4 — Skills groups
- Match Nest, Spring Boot, React Native, Python/ML, etc.
- **Status: Not done**

### Phase 5 — Contact form / pricing / project packages
- Form (Formspree etc.) optional; pricing and “projects I will build” later
- **Status: Not done** (intentionally deferred)

---

## User roadmap ideas (architecture later)

These were planned as a bigger content architecture — **not built yet**:

1. **Split work clearly**
   - My products (SaaS) — Andalib, Jerid, more later
   - Client / contract work (NDA-safe)
   - Open source projects
   - YouTube channel

2. **Learning / knowledge section** — **Done (2026-08-23)** → `/knowledge`, type `course`

3. **Quotes** — **Done** → `/knowledge?group=quotes` (author "Youssef Degachi" = my own)

4. **Videos & blogs you read** — **Done** → `video`, `article`, `book`, `website`, `tool`, `channel`, `person` types with a summary each

5. **Pricing / packages**
   - Freelance pricing and project types you offer

6. **Replace draft product copy + screenshots**
   - Real Andalib / Jerid descriptions and images when ready

---

## Done checklist

- [x] Freelance = Available (Resume)
- [x] Home line: available for freelance → WhatsApp
- [x] Header + MobileNav **Hire me** → WhatsApp
- [x] Contact: WhatsApp primary + Email, Phone, LinkedIn, GitHub
- [x] Social links use real `<a target="_blank">` (not React Router for external URLs)
- [x] `/work` tabs: Products \| Client work
- [x] Products: Andalib AI + JeridSchool cards (draft)
- [x] Open source + YouTube entries in `work.js` with `visible: false`
- [x] Client NDA note only on Client work tab
- [x] Hero photo + spinning ring motion left unchanged

---

## Not done checklist

- [ ] Rewrite home / about copy to match real story (Andalib, Jerid, AI/voice)
- [ ] Real product descriptions + screenshots for Andalib / Jerid
- [ ] Show Open source / YouTube when content is ready
- [ ] Richer client case studies (grid / filters / outcomes)
- [ ] Skills tab regrouped to match real stack
- [ ] Central `site.js` (or CMS) for all contact + about data
- [ ] Contact form (if wanted) + pricing / packages
- [x] Learning, quotes, read-later videos/blogs sections → `/knowledge` (2026-08-23)
- [x] CMS for knowledge content → separate repo `my-personal-info` (Neon Postgres + Tiptap editor)
- [ ] Re-enable lighter page transitions; tune particles / delays
- [ ] SEO: title/description, OG image, share meta
- [ ] A11y / cleanup: photo alt, unused Sidebar, duplicate tsparticles deps, README (still says Next.js)
- [ ] Distinct visual identity beyond the template look

---

## Suggested next slices (when you return)

1. **Content:** replace Andalib / Jerid draft copy + add screenshots  
2. **Skills groups** on Resume  
3. **site.js** so phone/email/WhatsApp aren’t duplicated  
4. **Client case-study cards** when you want to move past the slider  
5. **Architecture** for learning / quotes / blogs / open source / YouTube / pricing  

---

## Knowledge architecture (2026-08-23)

```
my-personal-info (private editor, its own repo)  --writes-->  Neon Postgres table `entries`  --reads published-->  my_portfolio /knowledge
```
- Contract: `my-personal-info/docs/DATA-MODEL.md` + `db/schema.sql`
- Setup: `my-personal-info/docs/SETUP-NEON.md`
- Portfolio side: `src/lib/db.js`, `src/lib/knowledge.js`, `src/data/knowledge.js` (seed fallback), `src/pages/Knowledge.jsx`, `src/pages/KnowledgeEntry.jsx`, `src/components/KnowledgeCard.jsx`
- Categories: user-defined in the editor (`categories` table), shown as coloured chips. Link-type entries can carry "My summary" (→ Summary button → `/knowledge/:slug` with embedded player). Blogs can be a link to the original + summary.
- Still to do: replace the starter entries with real ones, add the `VITE_DATABASE_URL` GitHub secret; GitHub Pages workflow now builds with Vite (`.github/workflows/deploy.yml`, needs repo secrets)

## Key files

| File | Role |
|------|------|
| `src/data/work.js` | Products, client, opensource, youtube data |
| `src/pages/Work.jsx` | Products \| Client tabs |
| `src/components/ClientWorkSlider.jsx` | Client Swiper |
| `src/pages/Contact.jsx` | Contact methods |
| `src/components/Header.jsx` / `MobileNav.jsx` | Hire me → WhatsApp |
| `src/pages/Home.jsx` | Hero (kept) + freelance line |
| `src/pages/Resume.jsx` | About / experience / skills |
| `src/pages/Knowledge.jsx` / `KnowledgeEntry.jsx` | Knowledge base list + detail |
| `src/lib/knowledge.js` | Neon SQL fetch + client-side filtering (seed fallback) |
| `CLAUDE.md` | Architecture guide for Claude Code |
