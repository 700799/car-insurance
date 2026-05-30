# 🛡️ Coverage Quest

A free, **gamified, Duolingo-style web app that teaches car insurance** to teens and new
drivers. Follow a 7-stop learning trail, earn a badge at each stop, decode the jargon, find the
coverage that fits your situation, and read fresh insurance news that refreshes automatically
every day.

It's a **100% static site** — no build step, no backend, no sign-up — designed to be hosted for
free on **GitHub Pages**.

👉 **Live site:** once Pages is enabled (see below) it will be at
`https://<your-username>.github.io/car-insurance/`

---

## ✨ What's inside

| Stop | Section | What you learn | Badge |
|----|----------------------|------------------------------------------------|------|
| 1 | Start Here | Why insurance matters + how the trail works | 🚦 First Steps |
| 2 | Real Stories | 5 true-to-life scenarios for teens/new drivers | 📖 Storyteller |
| 3 | What Sets Your Rate | The factors & 2026 stats behind your premium | 🔍 Rate Detective |
| 4 | Key Terms | Plain-English glossary with the trade-off on each | 📘 Word Wizard |
| 5 | Coverage Trade-offs | Interactive deductible slider, UM spotlight, rules of thumb | ⚖️ Trade-off Master |
| 6 | Find Your Profile | Pick a driver profile → optimal coverage & deductible, plus a build-your-own matcher | 🎯 Profile Pro |
| 7 | Final Quiz | 7-question quiz; pass to graduate | 🎓 Insurance Graduate |

Finish all seven to unlock the **🏆 Coverage Champion** celebration.

Other features:

- **Two ways to navigate** — a Duolingo-style winding **trail** *and* a **floating quick menu** (🧭).
- **Gamification** — badges, progress bar, confetti, and toasts. Progress saves in `localStorage`
  (per device, no account needed).
- **Driver profiles** — *Thrifty Veteran, City Commuter, New Teen Driver, New-Car Owner, Budget
  Beater, High-Mileage Commuter* — each shows three coverage options, the **optimal pick**, the
  recommended **deductible**, and why.
- **Daily news feed** — 10 articles at a time with previews and "load more" pagination, plus a
  filter box. Refreshed every day by a GitHub Action.
- **Accessible & responsive** — semantic HTML, keyboard friendly, honors `prefers-reduced-motion`,
  works great on phones.

---

## 📁 Project structure

```
.
├── index.html                     # the whole page (skeleton; content rendered by JS)
├── assets/
│   ├── css/styles.css             # all styling
│   └── js/
│       ├── content.js             # all educational copy, profiles, quiz (edit content here)
│       └── app.js                 # rendering, gamification, profile matcher, quiz, news
├── data/
│   └── news.json                  # news feed (seeded now, auto-refreshed daily)
├── scripts/
│   └── fetch-news.mjs             # pulls + cleans Google News RSS, writes data/news.json
├── .github/workflows/
│   └── update-news.yml            # daily schedule that runs the fetcher and commits
└── .nojekyll                      # serve files as-is (skip Jekyll processing)
```

To change the lessons, edit **`assets/js/content.js`** — it's structured data, no HTML required for
most of it.

---

## 🚀 Deploy on GitHub Pages (automated)

This repo ships a GitHub Actions workflow
([`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml)) that builds and
publishes the site automatically — no manual branch setup required.

1. Make sure the code is on the default branch (`main`).
2. In **Settings → Actions → General → Workflow permissions**, choose **Read and write
   permissions** (this also lets the daily news job commit).
3. The deploy workflow runs on every push to `main` (and after each daily news refresh). On its
   first run it auto-enables Pages and publishes to
   `https://<your-username>.github.io/car-insurance/`.
4. Trigger it any time from **Actions → "Deploy to GitHub Pages" → Run workflow**.

> Prefer no Actions? Instead use **Settings → Pages → Deploy from a branch → `main` / `/ (root)`**
> — the site is plain static files at the repo root and serves as-is. If you go this route you can
> delete `deploy-pages.yml`.


---

## 📰 How the daily news refresh works

- The workflow [`.github/workflows/update-news.yml`](.github/workflows/update-news.yml) runs
  **every day at 11:00 UTC** (and on demand via the **Actions → Run workflow** button).
- It runs [`scripts/fetch-news.mjs`](scripts/fetch-news.mjs), which queries **Google News RSS**
  (no API key needed) for several car-insurance topics, cleans and de-duplicates the results, and
  blends them with a curated set of evergreen guides so the feed is never empty.
- If `data/news.json` changed, the Action commits it, and the **Deploy to GitHub Pages** workflow
  republishes the site automatically (the browser also cache-busts daily).

**Enable it:** make sure **Settings → Actions → General → Workflow permissions** is set to
**Read and write permissions** so the bot can commit the updated `data/news.json`. Scheduled
Actions run on the **default branch**, so this kicks in once the code is on `main`.

You can trigger it immediately from the **Actions** tab → *Update car-insurance news* → *Run
workflow*.

---

## 🧑‍💻 Run locally

Because the news feed is fetched with `fetch()`, open the site through a local web server (not
`file://`):

```bash
# from the repo root
python3 -m http.server 8000
# then open http://localhost:8000
```

Refresh the news data locally (needs Node 18+):

```bash
node scripts/fetch-news.mjs
```

---

## ⚠️ Disclaimer

Coverage Quest is an **educational study guide**, not financial, legal, or insurance advice. The
dollar figures are **2026 U.S. averages** and vary widely by person, vehicle, and state. Always
compare real quotes, read your actual policy, and check requirements with your state insurance
department. News headlines are aggregated from public sources for convenience and are not
endorsements.
