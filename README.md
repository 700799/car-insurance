# California Car Insurance Guide

A clear, **California-only** guide to car insurance — built for California drivers, especially
teens and new drivers. It explains what the state requires, how **Proposition 103** shapes your
rate, the coverages and key terms, smart coverage choices, profile-based recommendations, and
where to get official help. California insurance news at the bottom refreshes automatically every
day.

It's a **100% static site** — no build step, no backend, no sign-up — hosted free on **GitHub
Pages**. The design is intentionally serious and compact, with a **floating menu** for navigation.
There is **no gamification and nothing is locked** — every section is freely accessible.

👉 **Live site:** `https://<your-username>.github.io/car-insurance/`

---

## What's inside

| # | Section | Focus |
|---|------------------------|------------------------------------------------------------|
| 1 | California essentials | The 2025 **30/60/15** minimums (SB 1107), at-fault rules, proof of insurance |
| 2 | Real situations | Four California scenarios for teens and new drivers |
| 3 | What sets your rate | **Prop 103**'s three mandatory factors; what California bans (credit, gender, ZIP-as-primary) |
| 4 | Coverages & terms | Plain-English glossary with the California-specific note on each |
| 5 | Smart coverage choices | Deductible trade-offs and rules of thumb |
| 6 | Find your fit | Profile matcher → recommended coverage & deductible, plus a build-your-own tool |
| 7 | Help & resources | CA Dept. of Insurance, CLCA low-cost program, DMV, Consumer Watchdog |

Other features:

- **Floating menu** with scroll-spy that highlights the section you're reading.
- **Profile matcher** — *Low-mileage experienced, Los Angeles city driver, New teen driver, New/financed
  car, Tight budget older car, Income-eligible (CLCA)* — each shows three options, the recommended
  choice, the deductible, and why, all framed for California.
- **Daily California news** — 10 articles per page with "load more" pagination and a filter box.
- **Accessible & responsive** — semantic HTML, keyboard friendly, honors `prefers-reduced-motion`.

---

## California specifics baked in

- **Minimum limits: 30/60/15** ($30k bodily injury per person / $60k per accident / $15k property
  damage), effective Jan 1, 2025 under SB 1107 (the "Protect California Drivers Act"). Scheduled to
  rise to 50/100/25 in 2035.
- **At-fault (tort) state** — California has no no-fault/PIP requirement.
- **Proposition 103 (1988)** — prior-approval rate regulation. The three mandatory rating factors,
  in order of weight, are **driving record → annual miles → years of experience**.
- **Banned from auto rating:** credit-based insurance scores, gender, and ZIP code as a primary
  factor (territorial rating).
- **Good Driver Discount** — at least **20%** for drivers with ~3 years' experience and a clean
  record.
- **California Low Cost Automobile (CLCA)** program for income-eligible good drivers.

> Figures are 2026 estimates and program details that change over time — always verify with the
> California Department of Insurance and compare real quotes.

---

## Project structure

```
.
├── index.html                     # page skeleton; content rendered by JS
├── assets/
│   ├── css/styles.css             # serious, compact styling (navy/slate, Inter)
│   └── js/
│       ├── content.js             # all California copy, profiles, resources (edit here)
│       └── app.js                 # rendering, floating menu + scroll-spy, matcher, news
├── data/
│   └── news.json                  # California news feed (seeded, auto-refreshed daily)
├── scripts/
│   └── fetch-news.mjs             # pulls + cleans California Google News RSS
├── .github/workflows/
│   ├── update-news.yml            # daily California news refresh
│   └── deploy-pages.yml           # auto-deploy to GitHub Pages
└── .nojekyll                      # serve files as-is (skip Jekyll)
```

To change content, edit **`assets/js/content.js`** — it's structured data.

---

## Deploy on GitHub Pages

A workflow ([`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml)) publishes
the site automatically. Ensure **Settings → Actions → General → Workflow permissions** is set to
**Read and write permissions**, then it deploys on every push to `main` and after each daily news
refresh, auto-enabling Pages on the first run.

Prefer manual setup instead? **Settings → Pages → Deploy from a branch → `main` / `/ (root)`** —
the static files at the repo root serve as-is.

---

## How the daily California news refresh works

- [`.github/workflows/update-news.yml`](.github/workflows/update-news.yml) runs **daily at 11:00
  UTC** (and on demand).
- It runs [`scripts/fetch-news.mjs`](scripts/fetch-news.mjs), which queries **Google News RSS** for
  several **California-specific** car-insurance searches, keeps only California-relevant results,
  cleans and de-duplicates them, and blends in a curated set of California evergreen links (CA DOI,
  CLCA, DMV, Consumer Watchdog) so the feed is never empty.
- If `data/news.json` changed, the Action commits it and the deploy workflow republishes the site.

---

## Run locally

Because the news feed is fetched with `fetch()`, serve over HTTP (not `file://`):

```bash
python3 -m http.server 8000   # then open http://localhost:8000
```

Refresh the news data locally (Node 18+):

```bash
node scripts/fetch-news.mjs
```

---

## Disclaimer

Educational content for California drivers only — **not** financial, legal, or insurance advice.
Figures are 2026 estimates and may change. Verify current requirements, limits, and programs with
the [California Department of Insurance](https://www.insurance.ca.gov/) and compare real quotes
before you buy. News headlines are aggregated from public sources and are not endorsements.
