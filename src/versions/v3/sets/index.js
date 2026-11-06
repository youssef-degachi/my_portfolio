/**
 * The six shapes after the portrait come in sets, and each visit gets one.
 * Only the chosen set is downloaded, so adding a set adds nothing to the page weight.
 * Force one for checking with ?set=1, ?set=2 or ?set=3.
 */
const SETS = [
  () => import("./classic"),
  () => import("./signal"),
  () => import("./nature"),
];
const KEY = "v3-shape-set";

function choose() {
  const forced = Number(new URLSearchParams(window.location.search).get("set"));
  if (forced >= 1 && forced <= SETS.length) return forced - 1;
  let last = -1;
  try { last = Number(window.localStorage.getItem(KEY) ?? -1); } catch { /* private window: any set will do */ }
  const options = SETS.map((_, i) => i).filter((i) => i !== last); // never the same one twice in a row
  const next = options[Math.floor(Math.random() * options.length)];
  try { window.localStorage.setItem(KEY, String(next)); } catch { /* same */ }
  return next;
}

let chosen = null;
export const loadSet = () => { if (chosen === null) chosen = choose(); return SETS[chosen](); };
