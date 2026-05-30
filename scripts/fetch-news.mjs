#!/usr/bin/env node
/* ============================================================
   California Car Insurance Guide — daily news fetcher
   Pulls recent California car-insurance headlines from Google
   News RSS (no API key needed), cleans them, dedupes, and merges
   with a curated evergreen set so the feed is never empty. Writes
   data/news.json, which the static site loads in the browser.

   Run by .github/workflows/update-news.yml on a daily schedule.
   Requires Node 18+ (global fetch).
   ============================================================ */

import { writeFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, "../data/news.json");
const MAX_ARTICLES = Number(process.env.NEWS_LIMIT || 42);
const RECENCY = process.env.NEWS_WHEN || "30d"; // Google News "when:" window

/* California-focused searches we blend together. */
const QUERIES = [
  "California car insurance",
  "California car insurance rates",
  "California auto insurance Proposition 103",
  "California minimum car insurance 30/60/15",
  "California car insurance new drivers",
];

/* Curated, evergreen California links — always available as a fallback
   and as a depth-filler so the page always has plenty to page through. */
const EVERGREEN = [
  { title: "Proposition 103 and California Auto Insurance", url: "https://www.insurance.ca.gov/01-consumers/105-type/95-guides/01-auto/prop103.cfm", source: "CA Dept. of Insurance", date: "2026-02-01", snippet: "How California's prior-approval system works and who qualifies for the mandated 20% Good Driver Discount." },
  { title: "California Low Cost Automobile Insurance Program", url: "https://www.mylowcostauto.com/", source: "mylowcostauto.com", date: "2026-03-01", snippet: "State-backed affordable liability coverage for income-eligible good drivers with a vehicle valued at $25,000 or less." },
  { title: "Vehicle Insurance Requirements", url: "https://www.dmv.ca.gov/portal/vehicle-registration/insurance-requirements/", source: "California DMV", date: "2026-01-15", snippet: "Proof-of-insurance rules, electronic reporting, and registration consequences if coverage lapses." },
  { title: "California's New Minimum Liability Requirements (30/60/15)", url: "https://www.einsurance.com/blog/california-minimum-liability-requirements/", source: "eInsurance", date: "2026-01-08", snippet: "The 2025 increase to 30/60/15 under SB 1107 — California's first minimum change since 1967." },
  { title: "What Determines Your California Car Insurance Rates", url: "https://www.nerdwallet.com/article/insurance/california-car-insurance-rates", source: "NerdWallet", date: "2026-04-20", snippet: "The three mandatory Prop 103 factors — record, mileage, experience — and the factors California bans." },
  { title: "Average Cost of Car Insurance in California", url: "https://www.bankrate.com/insurance/car/california-car-insurance/", source: "Bankrate", date: "2026-05-18", snippet: "Average California premiums by city and insurer, and why rates have climbed." },
  { title: "California Car Insurance Laws and Requirements", url: "https://www.valuepenguin.com/california-car-insurance-laws", source: "ValuePenguin", date: "2026-03-22", snippet: "California's minimums, uninsured-motorist rules, and key laws in plain language." },
  { title: "Proposition 103: How California Regulates Insurance Rates", url: "https://consumerwatchdog.org/insurance/proposition-103/", source: "Consumer Watchdog", date: "2026-03-10", snippet: "The nonprofit behind Prop 103 tracks filings and challenges rate increases on behalf of drivers." },
];

/* ----------------------- helpers ----------------------- */
function decodeEntities(str = "") {
  return str
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(parseInt(d, 10)))
    .replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}
const stripCdata = (s = "") => s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1");
const stripTags = (s = "") => s.replace(/<[^>]*>/g, " ");
// Order matters: unwrap CDATA → decode entities (exposes any encoded tags) →
// strip tags → decode entities again (for literal &amp;, &#39;, etc.).
const clean = (s = "") =>
  decodeEntities(stripTags(decodeEntities(stripCdata(s)))).replace(/\s+/g, " ").trim();
const pick = (block, tag) => {
  const m = block.match(new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return m ? m[1] : "";
};
const normTitle = (t) => clean(t).toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

function parseItems(xml) {
  const items = [];
  const re = /<item\b[^>]*>([\s\S]*?)<\/item>/gi;
  let m;
  while ((m = re.exec(xml))) {
    const block = m[1];
    const rawTitle = clean(pick(block, "title"));
    const link = clean(pick(block, "link"));
    if (!rawTitle || !link) continue;
    const source = clean(pick(block, "source")) || "Google News";
    // Google News appends " - Source" to titles — trim it when it matches.
    let title = rawTitle;
    const tail = new RegExp("\\s*[-–—]\\s*" + source.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\s*$", "i");
    title = title.replace(tail, "").trim() || rawTitle;

    let snippet = clean(pick(block, "description"));
    if (!snippet || normTitle(snippet).startsWith(normTitle(title))) snippet = "";
    if (snippet.length > 200) snippet = snippet.slice(0, 197).trimEnd() + "…";

    const pub = clean(pick(block, "pubDate"));
    const date = pub && !isNaN(new Date(pub)) ? new Date(pub).toISOString().slice(0, 10) : "";

    items.push({ title, url: link, source, date, snippet });
  }
  return items;
}

async function fetchQuery(q) {
  const url =
    "https://news.google.com/rss/search?q=" +
    encodeURIComponent(`${q} when:${RECENCY}`) +
    "&hl=en-US&gl=US&ceid=US:en";
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (CA car-insurance news bot; +https://github.com)" },
    });
    if (!res.ok) throw new Error("HTTP " + res.status);
    const xml = await res.text();
    const items = parseItems(xml);
    console.log(`  • "${q}" → ${items.length} items`);
    return items;
  } catch (err) {
    console.warn(`  ! "${q}" failed: ${err.message}`);
    return [];
  }
}

/* California relevance gate. This site is California-only, but Google News
   returns national and other-state stories for broad queries. Keep an item
   only if it clearly references California, and drop it if it's anchored to a
   different state (and doesn't also mention California). */
const CA_TERMS = [
  "california", "californ", " ca ", "(ca)", " ca.", " ca,", "calif",
  "proposition 103", "prop 103", "prop. 103", "sb 1107", "clca",
  "low cost auto", "consumer watchdog", "ricardo lara", "dept. of insurance",
  "los angeles", "san francisco", "san diego", "sacramento", "oakland",
  "san jose", "fresno", "long beach", "bay area", "inland empire",
  "orange county", "silicon valley", "socal", "norcal",
];
/* Other states/cities that signal an out-of-state story. */
const OTHER_STATES = [
  "illinois", "chicago", "new york", "nyc", "nys", "new jersey", "florida",
  "texas", "georgia", "michigan", "ohio", "pennsylvania", "washington state",
  "massachusetts", "colorado", "arizona", "nevada", "oregon", "louisiana",
  "north carolina", "south carolina", "virginia", "minnesota", "wisconsin",
  "missouri", "tennessee", "maryland", "connecticut", "new hampshire",
];
function isCalifornia(a) {
  const hay = ((a.title || "") + " " + (a.snippet || "") + " " + (a.source || "")).toLowerCase();
  const mentionsCA = CA_TERMS.some((t) => hay.includes(t));
  if (!mentionsCA) return false;
  // If it leads with another state and never says "california" explicitly, drop it.
  const mentionsOther = OTHER_STATES.some((s) => hay.includes(s));
  if (mentionsOther && !hay.includes("california")) return false;
  return true;
}

/* ----------------------- main ----------------------- */
async function main() {
  console.log("Fetching California car-insurance news from Google News RSS…");
  const batches = await Promise.all(QUERIES.map(fetchQuery));
  const fetched = batches.flat();
  const fresh = fetched.filter(isCalifornia);
  console.log(`  California-relevant: ${fresh.length} of ${fetched.length} fetched`);

  // Merge fresh + evergreen, dedupe by normalized title and by URL.
  const seenTitle = new Set();
  const seenUrl = new Set();
  const merged = [];
  for (const a of [...fresh, ...EVERGREEN]) {
    const tk = normTitle(a.title);
    if (!tk || tk.length < 8) continue;
    if (seenTitle.has(tk) || seenUrl.has(a.url)) continue;
    seenTitle.add(tk);
    seenUrl.add(a.url);
    merged.push(a);
  }

  // Sort newest first; undated (evergreen) sink to the bottom.
  merged.sort((a, b) => (b.date || "0000").localeCompare(a.date || "0000"));

  const articles = merged.slice(0, MAX_ARTICLES);
  const payload = {
    updatedAt: new Date().toISOString(),
    generatedBy: `California Google News RSS + curated (${articles.length} articles, when:${RECENCY})`,
    articles,
  };

  await mkdir(dirname(OUT), { recursive: true });
  await writeFile(OUT, JSON.stringify(payload, null, 2) + "\n", "utf8");
  console.log(`Wrote ${articles.length} California articles → ${OUT}`);

  if (fresh.length === 0) {
    console.warn("No fresh California items fetched — wrote curated fallback only.");
  }
}

/* Only run when invoked directly (so tests can import the parser). */
const invokedDirectly =
  process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (invokedDirectly) {
  main().catch((err) => {
    console.error("Fatal:", err);
    process.exit(1);
  });
}

export { parseItems, clean, decodeEntities, normTitle, isCalifornia };
