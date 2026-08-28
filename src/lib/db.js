import { neon } from "@neondatabase/serverless";

/**
 * Neon Postgres over HTTPS. The URL is the READ-ONLY `portfolio_reader` role
 * (row-level security only exposes published entries + categories), so it is
 * safe to ship in the bundle. Created in my-personal-info/db/create-reader.sql.
 */
const url = import.meta.env.VITE_DATABASE_URL;

/** True when VITE_DATABASE_URL is present. */
export const hasDb = Boolean(url);

/** `sql.query(text, params)` — one statement per call — or `null` when env is missing. */
export const sql = hasDb ? neon(url, { disableWarningInBrowsers: true }) : null; // read-only role: the "SQL from the browser" warning does not apply

/** The driver returns timestamptz as Date objects; the app compares/format them as ISO strings. */
export function normalizeRow(row) {
  if (!row) return row;
  const out = {};
  for (const [k, v] of Object.entries(row)) out[k] = v instanceof Date ? v.toISOString() : v;
  return out;
}
