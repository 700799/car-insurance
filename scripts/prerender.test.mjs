#!/usr/bin/env node
/* ============================================================
   Tests for the SEO prerender build (scripts/prerender.mjs).
   Pure Node, no dependencies. Run: node scripts/prerender.test.mjs
   Asserts the generated static HTML, JSON-LD, sitemap, and robots
   are well-formed and contain the content crawlers must see.
   ============================================================ */
import { buildSectionsHtml, buildJsonLd, buildSitemap, buildRobots } from "./prerender.mjs";

let failures = 0;
const ok = (cond, msg) => { if (cond) { console.log("  ✓ " + msg); } else { console.error("  ✗ " + msg); failures++; } };

console.log("prerender: section HTML");
const html = buildSectionsHtml();
// Every section heading + representative body text must be present (crawler view).
[
  "What California requires", "30/60/15", "SB 1107",
  "Real California situations", "Sacramento",
  "What sets your rate", "Proposition 103", "Annual miles driven",
  "5-year trend", "CA average",
  "Get the best rate", "Compare at least 3", "Good Driver Discount",
  "7 common myths", "Red cars cost more", "credit score",
  "Coverages &amp; key terms", "Uninsured", "MedPay",
  "Smart coverage choices", "Choosing a deductible",
  "Find your fit", "Los Angeles city driver", "California Low Cost",
  "after an accident", "SR-1", "glovebox",
  "Help &amp; resources", "Department of Insurance",
].forEach((needle) => ok(html.includes(needle), "contains: " + needle));
// All 11 section anchors present.
["essentials","situations","rate","trends","bestrate","myths","coverages","choices","profiles","accident","resources"]
  .forEach((id) => ok(html.includes(`id="${id}"`), "section anchor #" + id));
// No unresolved template tokens / undefined.
ok(!/undefined|\[object Object\]/.test(html), "no undefined / [object Object] leaks");

console.log("prerender: JSON-LD");
const ld = buildJsonLd("2026-06-06");
// Extract and JSON.parse each <script type="application/ld+json"> block.
const blocks = [...ld.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]);
ok(blocks.length === 4, "emits 4 JSON-LD blocks (WebSite, Organization, BreadcrumbList, FAQPage)");
let types = [];
blocks.forEach((b, i) => {
  try { const obj = JSON.parse(b); types.push(obj["@type"]); ok(true, "block " + (i + 1) + " parses (" + obj["@type"] + ")"); }
  catch (e) { ok(false, "block " + (i + 1) + " is valid JSON"); }
});
ok(types.includes("FAQPage"), "includes FAQPage");
ok(types.includes("WebSite"), "includes WebSite");
// FAQ has the 7 myths + the minimum-coverage Q = 8 entries.
const faq = blocks.map((b) => { try { return JSON.parse(b); } catch { return {}; } }).find((o) => o["@type"] === "FAQPage");
ok(faq && Array.isArray(faq.mainEntity) && faq.mainEntity.length === 8, "FAQPage has 8 Q&A entries");

console.log("prerender: sitemap & robots");
const sitemap = buildSitemap("2026-06-06");
ok(sitemap.startsWith("<?xml"), "sitemap is XML");
ok(sitemap.includes("<loc>https://700799.github.io/car-insurance/</loc>"), "sitemap has homepage loc");
ok(sitemap.includes("<lastmod>2026-06-06</lastmod>"), "sitemap has lastmod");
const robots = buildRobots();
ok(/User-agent: \*/.test(robots) && /Allow: \//.test(robots), "robots allows crawl");
ok(/Sitemap: https:\/\/.+sitemap\.xml/.test(robots), "robots references sitemap");

console.log("");
if (failures) { console.error(`❌ ${failures} assertion(s) failed`); process.exit(1); }
console.log("✅ all prerender tests passed");
