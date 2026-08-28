# Remaining steps / unfinished tasks

Everything built is working locally. What's left is either **your job** (accounts, pushing to GitHub) or **optional polish**. Nothing here blocks using the apps today.

## 1. Things only you can do (required to go live)

The database is **done**: everything lives in your Neon Postgres project (schema applied, the 4 categories
+ 6 starter entries migrated, read-only `portfolio_reader` role created for the public site).
Both apps already point at it through their `.env` files.

- [ ] **Push `my-personal-info` to its own GitHub repo**
  It's already a git repo with clean history at `../my-personal-info/` (next to this folder). Create the repo on GitHub and `git remote add` + `git push`. `.env` is ignored — the owner connection string never leaves your machine.

- [ ] **Commit the portfolio changes**
  Left uncommitted on purpose because you had older uncommitted work mixed in. Review with `git status`, then commit (Knowledge feature + Neon data layer + deploy workflow + CLAUDE.md are all in the working tree).

- [ ] **Add the GitHub Actions secret** on the portfolio repo (needed for deploy):
  `VITE_DATABASE_URL` = the read-only connection string that is in `my_portfolio/.env` (role `portfolio_reader`, safe to expose — it can only read published rows).
  If you use a custom domain, also set repo variable `VITE_BASE=/`.

- [ ] **(Recommended) Reset the Neon owner password**
  The `neondb_owner` connection string was pasted in a chat. Neon console → Branches → Roles → reset password, then update `DATABASE_URL` / `VITE_DATABASE_URL` in `my-personal-info/.env` and paste the new string in the editor's login screen.

- [ ] **Replace/delete the test content**
  The seeded welcome note and the test quote ("The best voice agent is the one that knows when to shut up.") were created to verify the pipeline — edit or delete them in the editor, then add your real blogs/videos/quotes.

- [ ] **Port note**: the editor's "Open portfolio" link assumes the portfolio runs on :5173. Your ChatBiz app was using that port. If it stays there, change `VITE_PORTFOLIO_URL` in `my-personal-info/.env`.

## 2. Optional cleanup / ideas (suggested earlier, never requested — skip freely)

- [ ] Main JS chunk is ~1 MB because **two versions of tsparticles** are installed — dedupe/remove for faster load.
- [ ] `src/components/Sidebar.jsx` is unused — delete it.
- [ ] Home page: a "Latest from Knowledge" strip (3 newest entries) to pull visitors into the knowledge base.
- [ ] A "Featured" row at the top of /knowledge (entries with `featured = true` already render with an accent border, but there's no dedicated row).
- [ ] Per-entry SEO/OG meta tags (title, description, image) for shared /knowledge/:slug links.
- [ ] Rewrite the Home hero copy in your voice / regroup the skills tab on /resume.

## 3. Nothing else

The two-app system itself is finished and verified end-to-end: editor login → create entry → appears on the portfolio, search/filters/categories/tags all managed from the editor, schema + docs + local Docker DB + deploy workflow all in place.
