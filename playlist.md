# Playlist feature — handoff summary

> Written by Claude Code from a session in the **my-personal-info** repo (the editor app), 2026-08-30.
> That session changed files in BOTH repos: `my-personal-info` (editor) and this repo (`my_portfolio`,
> package name `my-profile`). This file explains what was done and why, for whoever (human or Claude)
> continues work in this repo.

## The user's original request (verbatim)

> "okay very cool but need one thing (in blog and post and vidoe want be play list and for youtube
> channel i want link post or blog, for exomple in people i fellow he find link or summary the summary
> button show all (but filter with this author i can add this other like what i want okay?"

Confirmed interpretation (user picked these options explicitly):

- A **channel/person entry acts like a playlist**: its Summary page shows all videos/blogs/articles
  connected to it.
- Linking = **both**: an explicit link (new DB column) + auto-suggestions by author name in the editor,
  with manual add/remove of anything.
- Scope = **editor + portfolio** (both repos).

## The database contract change (affects THIS repo)

New column on `public.entries` (already **applied to the shared Neon database** via `npm run db:push`
in my-personal-info — nothing to migrate here):

```sql
source_id uuid references public.entries(id) on delete set null
-- + index entries_source_idx
```

- Any entry except `channel`/`person` may point at ONE `channel` or `person` entry ("who it's from").
- A channel/person's **playlist** = every entry whose `source_id` points at it.
- Reads embed it as `entry.source = {id, title, slug, type}` (same pattern as `entry.category`).
  RLS makes `source` null for the reader role when the source entry isn't published.
- Full contract: `my-personal-info/docs/DATA-MODEL.md` (updated, incl. a new "Playlists" section).

## What was changed in THIS repo (my_portfolio)

| File | Change |
|------|--------|
| `src/lib/knowledge.js` | `SOURCE_EMBED` const; `LIST_SQL` now selects `e.source_id` + embeds `source` (extra `left join public.entries s on s.id = e.source_id`); same join/embed added to `ONE_SQL`. |
| `src/components/KnowledgeCard.jsx` | `Actions` got `forceSummary` + `summaryLabel` props; `SummaryLink` renders custom label. `PeopleCard` + `KnowledgeCard` accept `playlistCount` — channel/person cards show a **`Playlist (n)`** button (even with no written summary, as long as the entry has a slug). |
| `src/pages/Knowledge.jsx` | `playlistCounts` memo (Map of `source_id` → count over the published list) passed to each card as `playlistCount`. |
| `src/pages/KnowledgeEntry.jsx` | 1) meta line shows `· from <source.title>` linking to the source's `/knowledge/:slug` when `entry.source` exists; 2) channel/person pages load `fetchEntries()` and render a **Playlist** section (each item links to its own summary page via `hasSummary`, else to its external `url`); 3) "No summary yet." is suppressed when a playlist is shown instead. |

Not touched here: seed/demo data (`src/data/knowledge.js`) — seed entries simply have no `source_id`,
so demo mode shows no playlists (fine). No new CSS; existing utility classes reused. No new HTML tags,
so DOMPurify config needed no change.

## What was changed in the editor repo (my-personal-info) — FYI

- `db/schema.sql` — the column + index above (idempotent `alter table … add column if not exists`), pushed to Neon.
- `src/lib/entries.js` — `source` embed on reads; `source_id` in the write whitelist; new `listSources()`
  and `setSource(id, sourceId)`.
- `src/lib/constants.js` — `source_id: null` in `emptyEntry()`.
- `src/components/EntryForm.jsx` — "Channel / Person" dropdown in the sidebar for every non-channel/person
  type, with a one-click suggestion when the typed `author` matches a channel/person's title or owner name.
- `src/components/PlaylistPanel.jsx` (new) — on channel/person forms: linked entries (unlink ×), a
  "Suggested — author matches" list, and "+ Add any entry…". Writes immediately via `setSource`.
- `docs/DATA-MODEL.md` + `CLAUDE.md` updated.

## "I didn't see any difference" — why, and how to actually see it

The feature is invisible until data uses it:

1. This repo was **built but not redeployed/restarted** — run `npm run dev` (or redeploy) here.
2. In the **editor** (my-personal-info, :5174, refresh the page):
   - create a `channel` or `person` entry (e.g. a YouTube channel) and **save + publish** it;
   - open/create a `video`/`blog`/`article`, pick that channel under **Channel / Person** (sidebar,
     under Category), save + publish;
   - or open the channel entry and use its **Playlist** panel to link entries directly.
3. Then on this site's `/knowledge`: the channel card shows **Playlist (n)**, its summary page lists
   the linked entries, and each linked entry's page shows *"· from ChannelName"*.

Only **published** entries linked to a **published** channel/person appear publicly (RLS).

## Verification status

- `npm run lint` and `npm run build` pass in **both** repos (only the pre-existing >500 kB chunk warning).
- Schema push confirmed against Neon (`entries: 1, categories: 4` at the time — i.e. the DB is nearly
  empty, which is the main reason nothing looks different yet).
- Nothing committed in either repo yet.
