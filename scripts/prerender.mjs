#!/usr/bin/env node
/* ============================================================
   California Car Insurance Guide — SEO prerender build
   ------------------------------------------------------------
   The site renders sections client-side, which is invisible to
   non-JS crawlers and social-share bots. This build bakes the
   same content (from assets/js/content.js — the single source of
   truth) into static HTML inside index.html, and emits JSON-LD,
   sitemap.xml, and robots.txt.

   Progressive enhancement, not cloaking: on load, app.js's
   renderSections() clears #sections and rebuilds the interactive
   drawers/chart. JS users get the app; crawlers and no-JS users
   get the identical content as static, semantic HTML.

   Usage:  node scripts/prerender.mjs [--check]
     --check  Verify index.html is already up to date (CI guard);
              exit 1 if prerender output would differ.

   Run by .github/workflows/deploy-pages.yml before upload.
   Requires Node 18+.
   ============================================================ */

import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const require = createRequire(import.meta.url);
const { CONTENT } = require(resolve(ROOT, "assets/js/content.js"));

/* Canonical site origin. github.io for now (see monetization roadmap for a
   custom domain). Override with SITE_ORIGIN for a future domain switch. */
const ORIGIN = (process.env.SITE_ORIGIN || "https://700799.github.io/car-insurance").replace(/\/$/, "");
const CANONICAL = ORIGIN + "/";

const START = "<!-- PRERENDER:START -->";
const END = "<!-- PRERENDER:END -->";
const LD_START = "<!-- JSONLD:START -->";
const LD_END = "<!-- JSONLD:END -->";

/* ----------------------- html helpers ----------------------- */
const esc = (s = "") =>
  String(s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
/* For fields that already contain intentional inline markup (essentials.html,
   minNote) we strip tags for the crawler-safe text but keep entities readable. */
const stripTags = (s = "") => String(s).replace(/<[^>]*>/g, "");
const textOf = (s = "") => esc(stripTags(s));

const li = (items, cls = "") => items.map((t) => `<li${cls ? ` class="${cls}"` : ""}>${t}</li>`).join("");
const sectionWrap = (s, inner) =>
  `<section class="pr-section" id="${s.id}" aria-labelledby="${s.id}-h">` +
  `<h2 id="${s.id}-h" class="pr-h2"><span class="pr-num">${s.n}</span> ${esc(label(s))}</h2>` +
  inner +
  `</section>`;

/* Human title per section type (mirrors app.js headFor()). */
function label(s) {
  switch (s.type) {
    case "essentials": return CONTENT.essentials.title;
    case "situations": return "Real California situations";
    case "factors":    return "What sets your rate in California";
    case "trend":      return "How premiums have grown (5-year trend)";
    case "bestrate":   return "Get the best rate (and what to avoid)";
    case "myths":      return "7 common myths";
    case "terms":      return "Coverages & key terms";
    case "choices":    return "Smart coverage choices";
    case "profiles":   return "Find your fit";
    case "accident":   return "What to do after an accident";
    case "resources":  return "Help & resources";
    default:           return s.label;
  }
}
function sub(s) {
  const m = {
    essentials: CONTENT.essentials.lead, situations: CONTENT.situationsIntro,
    factors: CONTENT.rateIntro, trend: CONTENT.trendIntro, bestrate: CONTENT.bestrateIntro,
    myths: CONTENT.mythsIntro, terms: CONTENT.termsIntro, choices: CONTENT.choicesIntro,
    profiles: CONTENT.profilesIntro, accident: CONTENT.accidentIntro, resources: CONTENT.resourcesIntro,
  };
  return m[s.type] ? `<p class="pr-sub">${esc(m[s.type])}</p>` : "";
}

/* ----------------------- per-section renderers ----------------------- */
const R = {
  essentials() {
    const mins = CONTENT.essentials.minimums
      .map((m) => `<li><strong>${esc(m.k)}</strong> — ${esc(m.v)}</li>`).join("");
    return `<ul class="pr-mins">${mins}</ul>` +
      `<p>${textOf(CONTENT.essentials.minNote)}</p>` +
      `<div class="pr-prose">${stripUnsafe(CONTENT.essentials.html)}</div>` +
      `<p class="pr-note">${esc(CONTENT.essentials.callout)}</p>`;
  },
  situations() {
    return CONTENT.situations.map((c) =>
      `<article class="pr-case"><h3>${esc(c.who)}</h3>` +
      `<p class="pr-tag">${esc(c.tag)}</p><p>${esc(c.body)}</p>` +
      `<p><strong>Lesson:</strong> ${esc(c.lesson)}</p></article>`).join("");
  },
  factors() {
    const stats = CONTENT.rateStats.map((s) => `<li><strong>${esc(s.num)}</strong> ${esc(s.lbl)}</li>`).join("");
    const mand = CONTENT.mandatory.map((m) =>
      `<li><strong>${esc(m.n)}. ${esc(m.name)}.</strong> ${esc(m.desc)}</li>`).join("");
    const banned = CONTENT.banned.map((b) => `<li><strong>${esc(b.name)}.</strong> ${esc(b.note)}</li>`).join("");
    return `<ul class="pr-stats">${stats}</ul>` +
      `<h3>The three mandatory factors (in order of weight)</h3><ol class="pr-mand">${mand}</ol>` +
      `<h3>What California prohibits</h3><ul>${banned}</ul>` +
      `<p class="pr-note">${esc(CONTENT.rateNote)}</p>`;
  },
  trend() {
    const T = CONTENT.trend;
    const rows = T.series.map((s) => {
      const first = Math.round(T.base[0] * s.mult), last = Math.round(T.base[T.base.length - 1] * s.mult);
      return `<li><strong>${esc(s.label)}:</strong> $${first.toLocaleString()} → $${last.toLocaleString()} (${esc(s.note)})</li>`;
    }).join("");
    return `<p>Average annual full-coverage premium in California, ${T.years[0]}–${T.years[T.years.length - 1]}, by driver profile:</p>` +
      `<ul class="pr-trend">${rows}</ul><p class="pr-note">${esc(T.source)}</p>`;
  },
  bestrate() {
    const dos = CONTENT.bestrateDo.map((r) => `<li><strong>${esc(r.h)}</strong> ${esc(r.t)}</li>`).join("");
    const avoid = CONTENT.bestrateAvoid.map((r) => `<li><strong>${esc(r.h)}</strong> ${esc(r.t)}</li>`).join("");
    return `<h3>Do this — the moves that lower your rate</h3><ul>${dos}</ul>` +
      `<h3>Avoid this — the quiet money-wasters</h3><ul>${avoid}</ul>` +
      `<p class="pr-note">${esc(CONTENT.bestrateNote)}</p>`;
  },
  myths() {
    return CONTENT.myths.map((m) =>
      `<div class="pr-myth"><h3>Myth: ${esc(m.myth)}</h3><p><strong>Truth:</strong> ${esc(m.truth)}</p></div>`).join("");
  },
  terms() {
    return `<dl class="pr-terms">` + CONTENT.terms.map((t) =>
      `<dt>${esc(t.term)}</dt><dd>${esc(t.def)} <em>California: ${esc(t.note)}</em></dd>`).join("") + `</dl>`;
  },
  choices() {
    const T = CONTENT.deductibleTable;
    const head = T.head.map((th) => `<th>${esc(th)}</th>`).join("");
    const body = T.rows.map((r) => `<tr>${r.map((td) => `<td>${esc(td)}</td>`).join("")}</tr>`).join("");
    const rules = CONTENT.rules.map((r) => `<li><strong>${esc(r.h)}</strong> ${esc(r.t)}</li>`).join("");
    return `<h3>Choosing a deductible</h3>` +
      `<table class="pr-table"><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table>` +
      `<p class="pr-note">${esc(T.note)}</p><h3>Rules of thumb</h3><ul>${rules}</ul>`;
  },
  profiles() {
    return CONTENT.profiles.map((p) => {
      const v = p.verdict;
      return `<article class="pr-profile"><h3>${esc(p.name)}</h3>` +
        `<p class="pr-tag">${esc(p.tag)}</p>` +
        `<p>${esc(p.traits.join(" · "))}</p>` +
        `<p><strong>Recommended:</strong> ${esc(v.coverage)}.</p>` +
        `<ul><li><strong>Deductible:</strong> ${esc(v.deductible)}</li>` +
        `<li><strong>Liability:</strong> ${esc(v.liability)}</li>` +
        `<li><strong>Add-ons:</strong> ${esc((v.addons || []).join(" · "))}</li></ul>` +
        `<p>${esc(v.why)}</p></article>`;
    }).join("");
  },
  accident() {
    const steps = CONTENT.accidentSteps.map((s) =>
      `<li><strong>${esc(s.h)}.</strong> ${esc(s.t)}</li>`).join("");
    const donts = CONTENT.accidentAvoid.map((d) => `<li>${esc(d)}</li>`).join("");
    const kit = CONTENT.accidentKit.map((k) => `<li>${esc(k)}</li>`).join("");
    return `<h3>Step by step</h3><ol class="pr-steps">${steps}</ol>` +
      `<h3>Don't</h3><ul>${donts}</ul><h3>Keep in your glovebox</h3><ul>${kit}</ul>`;
  },
  resources() {
    return `<ul class="pr-res">` + CONTENT.resources.map((r) =>
      `<li><strong>${esc(r.name)}</strong> — ${esc(r.what)} ` +
      `<a href="${esc(r.url)}" target="_blank" rel="noopener noreferrer">${esc(r.link)}</a></li>`).join("") + `</ul>`;
  },
};

/* essentials.html / minNote contain a small, known set of safe inline tags
   (<h3>,<ul>,<li>,<strong>). Keep those; the data is authored in-repo, not
   user input. */
function stripUnsafe(html = "") {
  return String(html).replace(/<(?!\/?(h3|ul|li|strong)\b)[^>]*>/gi, "");
}

/* ----------------------- documents ----------------------- */
function buildSectionsHtml() {
  return CONTENT.sections.map((s) => {
    const body = (R[s.type] ? R[s.type]() : "");
    return sectionWrap(s, sub(s) + body);
  }).join("\n");
}

function buildJsonLd(lastmod) {
  const website = {
    "@context": "https://schema.org", "@type": "WebSite",
    name: "California Car Insurance Guide", url: CANONICAL,
    description: "A clear, California-only guide to car insurance: 30/60/15 minimums, Proposition 103 rate factors, coverages, recommendations, and daily news.",
  };
  const org = {
    "@context": "https://schema.org", "@type": "Organization",
    name: "California Car Insurance Guide", url: CANONICAL,
    logo: ORIGIN + "/assets/og-image.svg",
  };
  const breadcrumb = {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: CONTENT.sections.map((s, i) => ({
      "@type": "ListItem", position: i + 1, name: label(s), item: CANONICAL + "#" + s.id,
    })),
  };
  // FAQPage from the 7 myths (myth → question, truth → answer) plus a few key facts.
  const faqs = CONTENT.myths.map((m) => ({
    "@type": "Question", name: esc(m.myth),
    acceptedAnswer: { "@type": "Answer", text: esc(m.truth) },
  }));
  faqs.push({
    "@type": "Question", name: "What is the minimum car insurance required in California?",
    acceptedAnswer: { "@type": "Answer", text: "Since January 1, 2025 California requires 30/60/15 liability limits: $30,000 bodily injury per person, $60,000 per accident, and $15,000 property damage (SB 1107)." },
  });
  const faq = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs };
  return [website, org, breadcrumb, faq]
    .map((o) => `<script type="application/ld+json">${JSON.stringify(o)}</script>`).join("\n  ");
}

function buildSitemap(lastmod) {
  return `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    `  <url>\n    <loc>${CANONICAL}</loc>\n    <lastmod>${lastmod}</lastmod>\n` +
    `    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n` +
    `</urlset>\n`;
}

function buildRobots() {
  return `User-agent: *\nAllow: /\n\nSitemap: ${ORIGIN}/sitemap.xml\n`;
}

/* Inject content between markers; insert markers if missing. */
function injectBetween(html, start, end, payload, label) {
  const s = html.indexOf(start), e = html.indexOf(end);
  if (s !== -1 && e !== -1 && e > s) {
    return html.slice(0, s + start.length) + "\n" + payload + "\n" + html.slice(e);
  }
  throw new Error(`Markers ${start} … ${end} not found in index.html (${label}). Add them first.`);
}

/* ----------------------- main ----------------------- */
async function main() {
  const check = process.argv.includes("--check");
  const lastmod = await newsLastmod();
  const indexPath = resolve(ROOT, "index.html");
  let html = await readFile(indexPath, "utf8");

  const built = injectBetween(html, START, END, buildSectionsHtml(), "sections");
  const withLd = injectBetween(built, LD_START, LD_END, "  " + buildJsonLd(lastmod), "json-ld");

  const sitemap = buildSitemap(lastmod);
  const robots = buildRobots();

  if (check) {
    const okHtml = withLd === html;
    let okFiles = true;
    try {
      okFiles = (await readFile(resolve(ROOT, "sitemap.xml"), "utf8")) === sitemap;
    } catch { okFiles = false; }
    if (!okHtml || !okFiles) {
      console.error("✗ prerender --check: output is stale. Run `node scripts/prerender.mjs` and commit.");
      process.exit(1);
    }
    console.log("✓ prerender --check: index.html and sitemap.xml are up to date.");
    return;
  }

  await writeFile(indexPath, withLd, "utf8");
  await writeFile(resolve(ROOT, "sitemap.xml"), sitemap, "utf8");
  await writeFile(resolve(ROOT, "robots.txt"), robots, "utf8");
  const sectionCount = CONTENT.sections.length;
  console.log(`✓ prerendered ${sectionCount} sections into index.html`);
  console.log(`✓ wrote sitemap.xml (lastmod ${lastmod}) and robots.txt`);
}

/* lastmod = the news feed's updatedAt date if available, else today. */
async function newsLastmod() {
  try {
    const data = JSON.parse(await readFile(resolve(ROOT, "data/news.json"), "utf8"));
    if (data.updatedAt) return new Date(data.updatedAt).toISOString().slice(0, 10);
  } catch { /* fall through */ }
  return new Date().toISOString().slice(0, 10);
}

const invokedDirectly = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (invokedDirectly) main().catch((err) => { console.error("Fatal:", err); process.exit(1); });

export { buildSectionsHtml, buildJsonLd, buildSitemap, buildRobots, label };
