#!/usr/bin/env node
/* ============================================================
   Coverage Quest — daily news fetcher
   Pulls recent car-insurance headlines from Google News RSS
   (no API key needed), cleans them, dedupes, and merges with a
   curated evergreen set so the feed is never empty. Writes
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

/* Searches we blend together for good coverage of the topic. */
const QUERIES = [
  "car insurance",
  "auto insurance rates",
  "car insurance new drivers",
  "teen driver car insurance",
  "car insurance deductible coverage",
];

/* Curated, evergreen, stable links — always available as a fallback
   and as a depth-filler so the page always has plenty to page through. */
const EVERGREEN = [
  { title: "Car Insurance Basics: Understanding Your Policy", url: "https://www.iii.org/article/what-covered-basic-auto-insurance-policy", source: "Insurance Information Institute", date: "2026-01-15", snippet: "The III explains the standard parts of an auto policy — liability, collision, comprehensive, MedPay/PIP, and uninsured-motorist — in plain English." },
  { title: "A Consumer's Guide to Auto Insurance", url: "https://content.naic.org/consumer/auto-insurance.htm", source: "NAIC", date: "2026-01-10", snippet: "The national association of state regulators walks through coverages, how rates are set, and your rights as a policyholder." },
  { title: "How To Shop for Car Insurance", url: "https://www.consumerreports.org/cars/car-insurance/", source: "Consumer Reports", date: "2026-01-20", snippet: "Consumer Reports' independent guide to comparing quotes, picking limits and deductibles, and avoiding overpaying." },
  { title: "Teen Driving: Risk and Insurance", url: "https://www.iihs.org/topics/teenagers", source: "IIHS", date: "2026-01-12", snippet: "Why new and teen drivers face the highest crash risk — and the proven steps (and graduated licensing) that reduce it." },
  { title: "What Affects Car Insurance Rates? Factors, Data and How To Save", url: "https://www.moneygeek.com/insurance/auto/factors-affecting-car-insurance-cost/", source: "MoneyGeek", date: "2026-02-19", snippet: "A data-driven rundown of the dozen-plus factors insurers weigh — and which ones you can actually control." },
  { title: "Cheapest Liability-Only Car Insurance (2026)", url: "https://www.valuepenguin.com/cheap-liability-only-car-insurance", source: "ValuePenguin", date: "2026-04-22", snippet: "For older, paid-off cars, liability-only can start around $36 a month. See when dropping full coverage makes sense." },
  { title: "What Is Uninsured Motorist Coverage? Guide for 2026", url: "https://wallethub.com/edu/ci/uninsured-motorist-coverage/9647", source: "WalletHub", date: "2026-03-18", snippet: "With roughly 1 in 7 drivers uninsured, this guide explains how UM/UIM works, what it costs, and when it's worth adding." },
  { title: "Top Ways To Save on Car Insurance in 2026", url: "https://www.insurance.com/auto-insurance/auto-insurance-basics/top-ways-to-save-on-car-insurance/", source: "Insurance.com", date: "2026-05-01", snippet: "From raising your deductible to stacking discounts and going usage-based, the highest-impact moves to cut your premium." },
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
      headers: { "User-Agent": "Mozilla/5.0 (CoverageQuest news bot; +https://github.com)" },
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

/* ----------------------- main ----------------------- */
async function main() {
  console.log("Fetching car-insurance news from Google News RSS…");
  const batches = await Promise.all(QUERIES.map(fetchQuery));
  const fresh = batches.flat();

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
    generatedBy: `Google News RSS + curated (${articles.length} articles, when:${RECENCY})`,
    articles,
  };

  await mkdir(dirname(OUT), { recursive: true });
  await writeFile(OUT, JSON.stringify(payload, null, 2) + "\n", "utf8");
  console.log(`Wrote ${articles.length} articles → ${OUT}`);

  if (fresh.length === 0) {
    console.warn("No fresh items fetched — wrote curated fallback only.");
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

export { parseItems, clean, decodeEntities, normTitle };
