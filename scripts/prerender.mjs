#!/usr/bin/env node
/* ============================================================
   Bay Area Car Insurance Guide — SEO prerender build
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

import { readFile, writeFile, mkdir } from "node:fs/promises";
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
    case "situations": return "Real Bay Area situations";
    case "factors":    return "What sets your rate in the Bay Area";
    case "estimator":  return "Estimate your rate";
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
    factors: CONTENT.rateIntro, estimator: CONTENT.estimatorIntro, trend: CONTENT.trendIntro,
    bestrate: CONTENT.bestrateIntro, myths: CONTENT.mythsIntro, terms: CONTENT.termsIntro,
    choices: CONTENT.choicesIntro, profiles: CONTENT.profilesIntro,
    accident: CONTENT.accidentIntro, resources: CONTENT.resourcesIntro,
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
  estimator() {
    const E = CONTENT.estimator;
    const caAvg = E.base;
    const fmt = (n) => "$" + Math.round(n).toLocaleString();
    const band = E.band;
    return `<p>${esc(CONTENT.estimatorIntro)}</p>` +
      `<p>Example: Bay Area average driver, full coverage ($500 ded.), mid-size vehicle, average mileage, clean record — ` +
      `illustrative range <strong>${fmt(caAvg * 1.12 * (1 - band))} – ${fmt(caAvg * 1.12 * (1 + band))}/yr</strong>.</p>` +
      `<p class="pr-note">${esc(E.disclaimer)}</p>`;
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

function buildFaq() {
  const faqs = CONTENT.myths.map((m) => ({
    "@type": "Question", name: esc(m.myth),
    acceptedAnswer: { "@type": "Answer", text: esc(m.truth) },
  }));
  faqs.push({
    "@type": "Question", name: "What is the minimum car insurance required in California?",
    acceptedAnswer: { "@type": "Answer", text: "Since January 1, 2025 California requires 30/60/15 liability limits: $30,000 bodily injury per person, $60,000 per accident, and $15,000 property damage (SB 1107)." },
  });
  return { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs };
}

function buildJsonLd(lastmod) {
  const website = {
    "@context": "https://schema.org", "@type": "WebSite",
    name: "Bay Area Car Insurance Guide", url: CANONICAL,
    description: "A clear Bay Area guide to car insurance: 30/60/15 minimums, Proposition 103 rate factors, coverages, recommendations, Bay Area city rate context, and daily news.",
  };
  const org = {
    "@context": "https://schema.org", "@type": "Organization",
    name: "Bay Area Car Insurance Guide", url: CANONICAL,
    logo: ORIGIN + "/assets/og-image.png",
  };
  const breadcrumb = {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: CONTENT.sections.map((s, i) => ({
      "@type": "ListItem", position: i + 1, name: label(s), item: CANONICAL + "#" + s.id,
    })),
  };
  const faq = buildFaq();
  const counties = [
    "San Francisco County", "Alameda County", "Santa Clara County", "San Mateo County",
    "Contra Costa County", "Solano County", "Marin County", "Sonoma County", "Napa County",
  ];
  const service = {
    "@context": "https://schema.org", "@type": "Service",
    serviceType: "Car insurance guidance",
    description: "Bay Area Car Insurance Guide — educational resource for Bay Area drivers. Covers California law, Prop 103 rate factors, and local rate context for all 9 Bay Area counties.",
    areaServed: counties.map((c) => ({ "@type": "AdministrativeArea", name: c, containedInPlace: { "@type": "State", name: "California" } })),
    provider: { "@type": "Organization", name: "Bay Area Car Insurance Guide", url: CANONICAL },
  };
  return [website, org, breadcrumb, faq, service]
    .map((o) => `<script type="application/ld+json">${JSON.stringify(o)}</script>`).join("\n  ");
}

function buildMetrosHtml() {
  if (!CONTENT.metros || !CONTENT.metros.length) return "";
  const cards = CONTENT.metros.map((m) =>
    `<a class="metro-card" href="${esc(m.slug)}/">` +
    `<div class="metro-card__name">${esc(m.name)}</div>` +
    `<div class="metro-card__county">${esc(m.county)}</div>` +
    `<p class="metro-card__blurb">${esc(m.blurb)}</p>` +
    `</a>`
  ).join("\n");
  return `<section class="metros" aria-labelledby="metros-h">` +
    `<h2 id="metros-h" class="metros__title">Bay Area city guides</h2>` +
    `<p class="metros__sub">Tap a city for local rate context, the estimator, and Bay Area news — all California law applies statewide.</p>` +
    `<div class="metro-grid">${cards}</div></section>`;
}

function buildMetroPage(metro, lastmod) {
  const metroCanonical = ORIGIN + "/" + metro.slug + "/";
  const metroOrg = { "@type": "Organization", name: "Bay Area Car Insurance Guide", url: CANONICAL };
  const place = {
    "@context": "https://schema.org", "@type": "Place",
    name: metro.name + ", California",
    geo: { "@type": "GeoCoordinates", latitude: metro.geo.lat, longitude: metro.geo.lng },
    address: { "@type": "PostalAddress", addressLocality: metro.name, addressRegion: "CA", addressCountry: "US" },
    containedInPlace: { "@type": "AdministrativeArea", name: metro.county },
  };
  const metroService = {
    "@context": "https://schema.org", "@type": "Service",
    serviceType: "Car insurance guidance",
    description: `${metro.name} car insurance guide — Bay Area rates, California law, and local coverage tips for ${metro.county} drivers.`,
    areaServed: { "@type": "City", name: metro.name, containedInPlace: { "@type": "AdministrativeArea", name: metro.county } },
    provider: metroOrg,
  };
  const metroCrumb = {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Bay Area Car Insurance Guide", item: CANONICAL },
      { "@type": "ListItem", position: 2, name: metro.name + " Car Insurance", item: metroCanonical },
    ],
  };
  const metroFaq = buildFaq();
  const ldBlocks = [place, metroService, metroCrumb, metroFaq]
    .map((o) => `  <script type="application/ld+json">${JSON.stringify(o)}</script>`).join("\n");

  const sectionsHtml = buildSectionsHtml();

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="theme-color" content="#0f2747" />
  <title>${esc(metro.name)} Car Insurance Guide — Bay Area Rates &amp; Coverage</title>
  <meta name="description" content="${esc(metro.name)} car insurance: ${esc(metro.rateContext.note)} California law — 30/60/15 minimums, Prop 103 rate factors, coverage options, and daily Bay Area news." />
  <link rel="canonical" href="${esc(metroCanonical)}" />
  <meta property="og:title" content="${esc(metro.name)} Car Insurance — Bay Area Guide" />
  <meta property="og:description" content="${esc(metro.blurb)}" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${esc(metroCanonical)}" />
  <meta property="og:image" content="${ORIGIN}/assets/og-image.png" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${esc(metro.name)} Car Insurance — Bay Area Guide" />
  <meta name="twitter:description" content="${esc(metro.blurb)}" />
  <meta name="twitter:image" content="${ORIGIN}/assets/og-image.png" />
  <!-- JSONLD:START -->
${ldBlocks}
  <!-- JSONLD:END -->
  <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='6' fill='%230f2747'/%3E%3Ctext x='16' y='22' font-family='Arial' font-size='15' font-weight='bold' fill='%23ffffff' text-anchor='middle'%3EBA%3C/text%3E%3C/svg%3E" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="../assets/css/styles.css" />
</head>
<body data-newsbase="..">
  <a class="skip-link" href="#sections">Skip to content</a>
  <header class="masthead">
    <div class="masthead__inner">
      <a class="wordmark" href="${CANONICAL}">
        <span class="wordmark__mark">BA</span>
        <span class="wordmark__text">Bay Area Car Insurance Guide</span>
      </a>
      <span class="masthead__meta">Updated for 2026 · Educational, not advice</span>
    </div>
  </header>
  <section class="intro" id="top">
    <div class="intro__inner">
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <a href="${CANONICAL}">Bay Area Guide</a> › <span aria-current="page">${esc(metro.name)}</span>
      </nav>
      <h1 class="intro__title">${esc(metro.name)} Car Insurance — Bay Area Guide</h1>
      <p class="intro__sub">${esc(metro.blurb)}</p>
      <div class="metro-rate-context">
        <p>${esc(metro.rateContext.note)}</p>
        <p class="pr-note">${esc(metro.localNote)}</p>
      </div>
      <ul class="intro__facts">
        <li><span class="intro__num">30/60/15</span> minimum liability (2025)</li>
        <li><span class="intro__num">~$2,700</span> avg. full coverage / yr (CA)</li>
        <li><span class="intro__num">≥20%</span> mandated Good Driver Discount</li>
      </ul>
      <p class="intro__links">
        <a href="#essentials">Start with the essentials</a>
        <span aria-hidden="true">·</span>
        <a href="#news">Bay Area news</a>
        <span aria-hidden="true">·</span>
        <a href="${CANONICAL}">All Bay Area cities</a>
      </p>
    </div>
  </section>
  <main>
    <div id="sections" class="sections">
      <!-- PRERENDER:START -->
${sectionsHtml}
      <!-- PRERENDER:END -->
    </div>
    <section class="news" id="news" aria-labelledby="news-h">
      <div class="news__inner">
        <div class="news__head">
          <h2 id="news-h" class="news__title">Bay Area car-insurance news</h2>
          <span id="newsUpdated" class="news__updated"></span>
        </div>
        <label class="news__search-wrap" for="newsSearch">
          <span class="news__search-icon" aria-hidden="true">🔍</span>
          <input id="newsSearch" class="news__search" type="search" placeholder="Filter articles…" aria-label="Filter news articles" />
        </label>
        <div id="newsChips" class="news__chips">
          <button class="chip is-active" data-region="" type="button">All</button>
          <button class="chip" data-region="bayarea" type="button">Bay Area</button>
        </div>
        <p id="newsCount" class="news__count"></p>
        <div id="newsGrid" class="news__grid"></div>
        <button id="newsMoreBtn" class="news__more" type="button" hidden>Load more</button>
        <p class="news__disc">Headlines from public sources — not endorsements. Verify with the <a href="https://www.insurance.ca.gov/" target="_blank" rel="noopener noreferrer">California Department of Insurance</a>.</p>
      </div>
    </section>
  </main>
  <footer class="foot">
    <p>Bay Area Car Insurance Guide · Educational content only, not financial or legal advice.</p>
    <p><small id="footerUpdated"></small></p>
  </footer>
  <nav class="floatmenu" id="floatmenu" aria-label="Jump to section"></nav>
  <script>window.ANALYTICS = null;</script>
  <script src="../assets/js/content.js"></script>
  <script src="../assets/js/partners.js"></script>
  <script src="../assets/js/app.js"></script>
</body>
</html>`;
}

function buildSitemap(lastmod) {
  const metroUrls = (CONTENT.metros || []).map((m) =>
    `  <url>\n    <loc>${ORIGIN}/${m.slug}/</loc>\n    <lastmod>${lastmod}</lastmod>\n` +
    `    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>`
  ).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    `  <url>\n    <loc>${CANONICAL}</loc>\n    <lastmod>${lastmod}</lastmod>\n` +
    `    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n` +
    (metroUrls ? metroUrls + "\n" : "") +
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

  const METROS_START = "<!-- METROS:START -->";
  const METROS_END   = "<!-- METROS:END -->";

  const built = injectBetween(html, START, END, buildSectionsHtml(), "sections");
  const withMetros = injectBetween(built, METROS_START, METROS_END, buildMetrosHtml(), "metros");
  const withLd = injectBetween(withMetros, LD_START, LD_END, "  " + buildJsonLd(lastmod), "json-ld");

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

  // Write per-metro landing pages.
  for (const metro of (CONTENT.metros || [])) {
    const dir = resolve(ROOT, metro.slug);
    await mkdir(dir, { recursive: true });
    const metroHtml = buildMetroPage(metro, lastmod);
    await writeFile(resolve(dir, "index.html"), metroHtml, "utf8");
    console.log(`✓ wrote ${metro.slug}/index.html`);
  }
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

export { buildSectionsHtml, buildJsonLd, buildSitemap, buildRobots, buildFaq, buildMetrosHtml, buildMetroPage, label };
