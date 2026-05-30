/* ============================================================
   Coverage Quest — app logic
   Vanilla JS, no dependencies. Renders the trail, sections,
   badges, profile matcher, quiz, gamification, and news feed.
   ============================================================ */
(function () {
  "use strict";

  const STORE_KEY = "coverageQuest.v1";
  const SECTIONS = CONTENT.sections;
  const NEWS_PER_PAGE = 10;

  /* ---------- tiny DOM helper ---------- */
  function h(tag, attrs, children) {
    const n = document.createElement(tag);
    if (attrs) {
      for (const k in attrs) {
        const v = attrs[k];
        if (v == null || v === false) continue;
        if (k === "class") n.className = v;
        else if (k === "html") n.innerHTML = v;
        else if (k === "text") n.textContent = v;
        else if (k.slice(0, 2) === "on" && typeof v === "function") n.addEventListener(k.slice(2), v);
        else if (v === true) n.setAttribute(k, "");
        else n.setAttribute(k, v);
      }
    }
    if (children != null) {
      (Array.isArray(children) ? children : [children]).forEach((c) => {
        if (c == null) return;
        n.appendChild(typeof c === "string" || typeof c === "number" ? document.createTextNode(String(c)) : c);
      });
    }
    return n;
  }
  const byId = (id) => document.getElementById(id);
  const prefersReduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- progress state ---------- */
  let state = load();
  function load() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY)) || { done: [] }; }
    catch (e) { return { done: [] }; }
  }
  function save() { try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) {} }
  const isDone = (id) => state.done.indexOf(id) !== -1;
  const completedCount = () => SECTIONS.filter((s) => isDone(s.id)).length;
  const allDone = () => SECTIONS.every((s) => isDone(s.id));

  /* ============================================================
     TRAIL
     ============================================================ */
  function renderTrail() {
    const path = byId("trailPath");
    path.innerHTML = "";
    SECTIONS.forEach((s) => {
      const btn = h("button", {
        class: "trail-node__btn", type: "button",
        "aria-label": "Stop " + s.n + ": " + s.label,
        onclick: () => goTo(s.id),
      }, [
        h("span", { class: "trail-node__emoji", "aria-hidden": "true", text: s.emoji }),
        h("span", { class: "trail-node__n", "aria-hidden": "true", text: s.n }),
        h("span", { class: "trail-node__check", "aria-hidden": "true", text: "✓" }),
      ]);
      const li = h("li", { class: "trail-node" }, [btn, h("span", { class: "trail-node__label", text: s.label })]);
      li.dataset.id = s.id;
      path.appendChild(li);
    });
    refreshTrail();
  }
  function refreshTrail() {
    const currentId = (SECTIONS.find((s) => !isDone(s.id)) || {}).id;
    document.querySelectorAll(".trail-node").forEach((node) => {
      const id = node.dataset.id;
      node.classList.toggle("is-done", isDone(id));
      node.classList.toggle("is-current", id === currentId && !isDone(id));
    });
  }

  /* ============================================================
     SECTIONS
     ============================================================ */
  function panelTitle(s, text) { return h("h2", { class: "panel__title", id: s.id + "-h", text: text }); }

  function calloutEl(c) {
    if (!c) return null;
    return h("div", { class: "callout" + (c.kind ? " callout--" + c.kind : "") }, [
      h("span", { class: "callout__icon", "aria-hidden": "true", text: c.icon || "💡" }),
      h("div", { html: c.text }),
    ]);
  }

  function verdictBlock(v, title) {
    const dl = h("dl");
    const add = (dt, dd) => { dl.appendChild(h("dt", { text: dt })); dl.appendChild(h("dd", { text: dd })); };
    add("Coverage", v.coverage);
    add("Deductible", v.deductible);
    add("Liability", v.liability);
    add("Add-ons", (v.addons || []).join(" · "));
    return h("div", { class: "verdict" }, [
      h("div", { class: "verdict__title", text: title || "✅ Your optimal play" }),
      dl,
      v.why ? h("p", { text: v.why, style: "margin:.7rem 0 0" }) : null,
    ]);
  }

  const builders = {
    /* --- Stop 1: intro --- */
    intro(s) {
      const c = CONTENT.intro;
      return [
        panelTitle(s, c.title),
        h("p", { class: "panel__lead", text: c.lead }),
        h("div", { class: "prose", html: c.html }),
        calloutEl(c.callout),
      ];
    },

    /* --- Stop 2: stories --- */
    stories(s) {
      const grid = h("div", { class: "grid grid--2" });
      CONTENT.stories.forEach((st) => {
        grid.appendChild(h("div", { class: "story" }, [
          h("div", { class: "story__head" }, [
            h("div", { class: "story__avatar", "aria-hidden": "true", text: st.emoji }),
            h("div", {}, [h("div", { class: "story__who", text: st.who }), h("div", { class: "story__tag", text: st.tag })]),
          ]),
          h("p", { class: "story__body", text: st.body }),
          h("div", { class: "story__lesson", text: "💡 " + st.lesson }),
        ]));
      });
      return [panelTitle(s, "Real stories from the road"), h("p", { class: "panel__lead", text: CONTENT.storiesIntro }), grid];
    },

    /* --- Stop 3: factors --- */
    factors(s) {
      const stats = h("div", { class: "stats" });
      CONTENT.rateStats.forEach((st) =>
        stats.appendChild(h("div", { class: "stat" }, [h("span", { class: "stat__num", text: st.num }), h("span", { class: "stat__lbl", text: st.lbl })]))
      );
      const list = h("div", { class: "grid" });
      CONTENT.factors.forEach((f) => {
        const dots = h("span", { class: "factor__impact", "data-impact": f.impact, title: "Impact on your rate" });
        const count = f.impact === "high" ? 3 : f.impact === "med" ? 2 : 1;
        for (let i = 0; i < 3; i++) dots.appendChild(h("span", { class: "dot" + (i < count ? " on" : "") }));
        list.appendChild(h("div", { class: "factor" }, [
          h("div", { class: "factor__top" }, [
            h("span", { class: "factor__icon", "aria-hidden": "true", text: f.icon }),
            h("span", { class: "factor__name", text: f.name }),
            dots,
          ]),
          h("p", { class: "factor__desc", text: f.desc }),
        ]));
      });
      return [
        panelTitle(s, "What actually sets your rate"),
        h("p", { class: "panel__lead", text: CONTENT.rateIntro }),
        stats,
        h("h3", { text: "The big levers (dots = impact)", style: "margin:1.4rem 0 .6rem" }),
        list,
        calloutEl({ kind: "warn", icon: "🚫", text: "<strong>Myths that DON'T change your rate:</strong> your car's color, your astrological sign, or paying your premium a day early. Salespeople love a good myth — now you know better." }),
      ];
    },

    /* --- Stop 4: terms --- */
    terms(s) {
      const grid = h("div", { class: "terms" });
      CONTENT.terms.forEach((t) => {
        grid.appendChild(h("details", { class: "term" }, [
          h("summary", {}, [
            h("span", { class: "term__emoji", "aria-hidden": "true", text: t.emoji }),
            h("span", { text: t.term }),
            h("span", { class: "term__chev", "aria-hidden": "true", text: "▾" }),
          ]),
          h("div", { class: "term__body" }, [
            h("p", { text: t.def, style: "margin:0" }),
            h("div", { class: "term__tradeoff", text: "⚖️ " + t.tradeoff }),
          ]),
        ]));
      });
      return [panelTitle(s, "Key terms, decoded"), h("p", { class: "panel__lead", text: CONTENT.termsIntro }), grid];
    },

    /* --- Stop 5: trade-offs --- */
    tradeoffs(s) {
      const out = [panelTitle(s, "Coverage trade-offs"), h("p", { class: "panel__lead", text: CONTENT.tradeoffsIntro })];

      /* deductible slider tool */
      const T = CONTENT.deductibleTool;
      const maxPrem = Math.max.apply(null, T.levels.map((l) => l.premium));
      const dedVal = h("strong", { text: "$500" });
      const premOut = h("strong", { text: "$0" });
      const premBar = h("i");
      const ooPocket = h("strong", { text: "$0" });
      const saveOut = h("strong", { text: "$0/yr" });
      const range = h("input", { type: "range", min: 0, max: T.levels.length - 1, step: 1, value: T.baselineIndex, "aria-label": "Deductible amount" });
      function updateDed() {
        const lvl = T.levels[+range.value];
        const base = T.levels[T.baselineIndex].premium;
        dedVal.textContent = "$" + lvl.d.toLocaleString();
        premOut.textContent = "$" + lvl.premium.toLocaleString() + "/yr";
        premBar.style.width = Math.round((lvl.premium / maxPrem) * 100) + "%";
        ooPocket.textContent = "$" + lvl.d.toLocaleString();
        const diff = base - lvl.premium;
        saveOut.textContent = (diff >= 0 ? "Save $" + diff : "+$" + -diff) + "/yr";
        saveOut.style.color = diff >= 0 ? "var(--green-600)" : "var(--red)";
      }
      range.addEventListener("input", updateDed);
      const tool = h("div", { class: "tool" }, [
        h("div", { style: "font-weight:900;margin-bottom:.4rem" }, ["Deductible: ", dedVal]),
        h("div", { class: "tool__row" }, [h("span", { text: "$250" }), range, h("span", { text: "$2,000" })]),
        h("div", { class: "tool__readout" }, [
          h("div", { class: "tool__metric" }, [h("span", { text: "Comp + collision premium" }), premOut, h("div", { class: "tool__bar" }, premBar)]),
          h("div", { class: "tool__metric" }, [h("span", { text: "If you crash, you pay" }), ooPocket]),
          h("div", { class: "tool__metric" }, [h("span", { text: "vs. a $500 deductible" }), saveOut]),
        ]),
        h("p", { style: "color:var(--muted);font-size:.8rem;font-weight:700;margin:.8rem 0 0", text: "Illustrative figures — your real numbers depend on your car, ZIP, and insurer. The pattern is what matters: higher deductible → lower premium, bigger bill if you crash." }),
      ]);
      out.push(h("h3", { text: "🎚️ Play with your deductible", style: "margin:1.6rem 0 .4rem" }), tool);
      setTimeout(updateDed, 0);

      /* UM spotlight */
      const um = CONTENT.umSpotlight;
      const yes = h("ul", { class: "option__list" }); um.yes.forEach((x) => yes.appendChild(h("li", { text: x })));
      const skip = h("ul", { class: "option__list" }); um.skip.forEach((x) => skip.appendChild(h("li", { class: "no", text: x })));
      out.push(
        h("h3", { text: um.title, style: "margin:1.8rem 0 .4rem" }),
        h("div", { class: "grid grid--2" }, [
          h("div", { class: "option is-best" }, [h("div", { class: "option__name", text: "👍 Usually worth it when…" }), yes]),
          h("div", { class: "option" }, [h("div", { class: "option__name", text: "🤔 You might skip it when…" }), skip]),
        ]),
        calloutEl({ kind: "tip", icon: "✅", text: "<strong>Verdict:</strong> " + um.verdict })
      );

      /* rules cheat sheet */
      const rules = h("div", { class: "rules" });
      CONTENT.rules.forEach((r) => rules.appendChild(h("div", { class: "rule" }, [h("span", { class: "rule__icon", "aria-hidden": "true", text: r.icon }), h("div", { html: r.text })])));
      out.push(h("h3", { text: "🧠 Rules of thumb to steal", style: "margin:1.8rem 0 .6rem" }), rules);
      return out;
    },

    /* --- Stop 6: profiles --- */
    profiles(s) {
      const out = [panelTitle(s, "Find your profile"), h("p", { class: "panel__lead", text: CONTENT.profilesIntro })];

      const cards = h("div", { class: "profiles" });
      const recommendArea = h("div", { class: "recommend", id: "recommendArea" }, [
        h("p", { class: "complete-row__hint", text: "👆 Pick a driver above to see their optimal coverage, deductible, and options.", style: "text-align:center;padding:1rem" }),
      ]);

      CONTENT.profiles.forEach((p, i) => {
        const cost = h("div", { class: "profile-card__cost", "aria-label": "relative cost " + p.cost + " of 3" });
        for (let d = 0; d < 3; d++) cost.appendChild(h("span", { class: d < p.cost ? "" : "off", text: "$" }));
        const card = h("button", {
          class: "profile-card", type: "button", "data-i": i,
          onclick: () => selectProfile(i),
        }, [
          h("div", { class: "profile-card__emoji", "aria-hidden": "true", text: p.emoji }),
          h("div", { class: "profile-card__name", text: p.name }),
          h("div", { class: "profile-card__tag", text: p.tag }),
          cost,
        ]);
        cards.appendChild(card);
      });

      function selectProfile(i) {
        cards.querySelectorAll(".profile-card").forEach((c, idx) => c.classList.toggle("is-active", idx === i));
        const p = CONTENT.profiles[i];
        recommendArea.innerHTML = "";
        recommendArea.appendChild(h("div", { class: "recommend__head" }, [
          h("div", { class: "profile-card__emoji", style: "font-size:2.4rem", "aria-hidden": "true", text: p.emoji }),
          h("div", {}, [h("div", { class: "recommend__title", text: p.name }), h("div", { class: "profile-card__tag", text: p.traits.join(" · ") })]),
        ]));
        const options = h("div", { class: "options" });
        p.options.forEach((opt, oi) => {
          const list = h("ul", { class: "option__list" });
          opt.items.forEach((it) => list.appendChild(h("li", { class: it.ok ? "" : "no", text: it.t })));
          options.appendChild(h("div", { class: "option" + (oi === p.best ? " is-best" : "") }, [
            oi === p.best ? h("span", { class: "option__badge", text: "★ Optimal pick" }) : null,
            h("div", { class: "option__name", text: opt.name }),
            h("div", { class: "option__price", text: opt.price }),
            list,
          ]));
        });
        recommendArea.appendChild(options);
        recommendArea.appendChild(verdictBlock(p.verdict, "✅ Optimal coverage & deductible"));
      }

      out.push(cards, recommendArea);

      /* build-your-own */
      const fieldsWrap = h("div", { class: "builder__grid" });
      const selects = {};
      CONTENT.builder.fields.forEach((f) => {
        const sel = h("select", { id: "bld-" + f.id, onchange: runBuilder }, [h("option", { value: "", text: "Choose…" })]);
        f.options.forEach((o) => sel.appendChild(h("option", { value: o.v, text: o.t })));
        selects[f.id] = sel;
        fieldsWrap.appendChild(h("label", { class: "field" }, [f.label, sel]));
      });
      const builderOut = h("div", { class: "builder__out", text: "Answer all four to see your starting point." });
      function runBuilder() {
        const v = {}; let ready = true;
        CONTENT.builder.fields.forEach((f) => { v[f.id] = selects[f.id].value; if (!v[f.id]) ready = false; });
        if (!ready) { builderOut.textContent = "Answer all four to see your starting point."; return; }
        builderOut.innerHTML = "";
        builderOut.appendChild(verdictBlock(buildRecommendation(v), "✅ Your starting point"));
      }
      out.push(h("div", { class: "builder" }, [
        h("h3", { text: "🛠️ Or build your own", style: "margin:.2rem 0 .2rem" }),
        h("p", { text: "Four quick questions → a tailored starting point. (A study guide, not a quote.)", style: "color:var(--muted);font-weight:700;margin:0" }),
        fieldsWrap,
        builderOut,
      ]));
      return out;
    },

    /* --- Stop 7: quiz --- */
    quiz(s) {
      const quizWrap = h("div", { class: "quiz" });
      const answered = new Array(CONTENT.quiz.length).fill(null);
      const scoreEl = h("div", { class: "quiz__score", text: "Answer all " + CONTENT.quiz.length + " questions to see your score." });

      CONTENT.quiz.forEach((item, qi) => {
        const opts = h("div", { class: "q__opts" });
        const q = h("div", { class: "q" }, [h("div", { class: "q__q", text: qi + 1 + ". " + item.q }), opts, h("div", { class: "q__explain", text: "💡 " + item.why })]);
        item.opts.forEach((opt, oi) => {
          opts.appendChild(h("button", { class: "q__opt", type: "button", text: opt, onclick: () => choose(qi, oi, opts, q) }));
        });
        quizWrap.appendChild(q);
      });

      function choose(qi, oi, opts, q) {
        if (answered[qi] != null) return;
        answered[qi] = oi;
        const correct = CONTENT.quiz[qi].a;
        Array.prototype.forEach.call(opts.querySelectorAll(".q__opt"), (b, idx) => {
          b.disabled = true;
          if (idx === correct) b.classList.add("correct");
          else if (idx === oi) b.classList.add("wrong");
        });
        q.classList.add("answered");
        tally();
      }
      function tally() {
        const done = answered.filter((a) => a != null).length;
        const score = answered.reduce((acc, a, i) => acc + (a === CONTENT.quiz[i].a ? 1 : 0), 0);
        if (done < CONTENT.quiz.length) { scoreEl.textContent = "Progress: " + done + "/" + CONTENT.quiz.length + " answered"; scoreEl.classList.remove("pass"); return; }
        const pass = score >= CONTENT.quizPass;
        scoreEl.textContent = "You scored " + score + "/" + CONTENT.quiz.length + " — " + (pass ? "you graduated! 🎓" : "so close — review and retake!");
        scoreEl.classList.toggle("pass", pass);
        if (pass && !isDone(s.id)) complete(s.id);
      }
      const retake = h("button", { class: "btn btn--ghost btn--sm", type: "button", text: "↻ Retake quiz", onclick: () => rebuildPanel(s) });

      return [panelTitle(s, "Final quiz — graduate!"), h("p", { class: "panel__lead", text: CONTENT.quizIntro }), quizWrap, scoreEl, h("div", { style: "text-align:center;margin-top:.8rem" }, retake)];
    },
  };

  /* simple rules engine for the build-your-own card */
  function buildRecommendation(v) {
    const addons = ["UM/UIM (cheap and almost always worth it)"];
    let coverage, deductible, liability;

    if (v.value === "financed") { coverage = "Full coverage (required by your lender)"; addons.push("GAP insurance"); deductible = "$500 — keep out-of-pocket low on a pricey car"; }
    else if (v.value === "mid") { coverage = "Full coverage (your car is worth protecting)"; deductible = "$500–$1,000 — balance premium vs. cash on hand"; }
    else { coverage = "Liability only — self-insure the low-value car (10% rule)"; deductible = "$1,000+, or skip collision/comp entirely"; }

    if (v.park === "city") addons.push(v.value === "beater" ? "Consider comprehensive — city theft risk" : "Prioritize comprehensive (theft/vandalism)");
    if (v.miles === "high" || v.value === "financed") addons.push("Roadside assistance for the extra miles");
    if (v.exp === "new") addons.push("Good-student, defensive-driving & telematics discounts");
    if (v.miles === "low") addons.push("Low-mileage / usage-based discount");

    liability = (v.miles === "high" || v.exp === "vet")
      ? "100/300/100 or higher — more exposure / assets to protect"
      : "At least 50/100/50; 100/300/100 if you have any savings";

    return { coverage, deductible, liability, addons, why: "Starting point only — pull at least three real quotes, stack every discount you qualify for, and read the policy before you buy." };
  }

  function makeCompleteRow(s) {
    const done = isDone(s.id);
    const btn = h("button", { class: "btn btn--primary", type: "button", text: done ? "✓ Completed — next stop →" : "Complete & earn badge" });
    btn.addEventListener("click", () => { if (!isDone(s.id)) complete(s.id); else nextStop(s); });
    const hint = h("span", { class: "complete-row__hint", text: done ? "Badge earned: " + s.badge.medal + " " + s.badge.name : "Finished this stop? Bank your badge and roll on." });
    const row = h("div", { class: "complete-row" + (done ? " is-done" : "") }, [btn, hint]);
    return row;
  }

  function renderPanel(s) {
    const panel = h("section", { class: "panel" + (isDone(s.id) ? " is-done" : ""), id: s.id, "aria-labelledby": s.id + "-h" });
    panel.appendChild(h("span", { class: "panel__kicker", html: '<span aria-hidden="true">' + s.emoji + "</span> Stop " + s.n + " of 7" }));
    const body = builders[s.type](s);
    (Array.isArray(body) ? body : [body]).forEach((node) => node && panel.appendChild(node));
    panel.appendChild(makeCompleteRow(s));
    return panel;
  }
  function renderSections() {
    const wrap = byId("sections");
    wrap.innerHTML = "";
    SECTIONS.forEach((s) => wrap.appendChild(renderPanel(s)));
  }
  function rebuildPanel(s) {
    const old = byId(s.id);
    if (old) old.replaceWith(renderPanel(s));
  }

  /* ============================================================
     COMPLETION + GAMIFICATION
     ============================================================ */
  function complete(id) {
    if (isDone(id)) return;
    state.done.push(id);
    save();
    const s = SECTIONS.find((x) => x.id === id);
    // surgical panel update (preserves quiz/profile UI state)
    const panel = byId(id);
    if (panel) {
      panel.classList.add("is-done");
      const row = panel.querySelector(".complete-row");
      if (row) row.replaceWith(makeCompleteRow(s));
    }
    refreshAll();
    celebrate(s.badge);
  }

  function celebrate(badge) {
    confettiBurst(false);
    showToast(badge.medal, "Badge earned!", badge.name + " — " + badge.desc);
    if (allDone()) {
      byId("champion").hidden = false;
      setTimeout(() => {
        confettiBurst(true);
        showToast("🏆", "Coverage Champion!", "All 7 badges earned. You're insurance-fluent now.");
      }, 900);
    }
  }

  function refreshAll() {
    refreshTrail();
    renderBadges();
    updateProgress();
    updateFabTicks();
  }

  /* ---- badge shelf ---- */
  function renderBadges() {
    const grid = byId("shelfGrid");
    grid.innerHTML = "";
    SECTIONS.forEach((s) => {
      const earned = isDone(s.id);
      grid.appendChild(h("div", { class: "badge" + (earned ? " is-earned" : "") }, [
        h("div", { class: "badge__lock", "aria-hidden": "true", text: earned ? "✓" : "🔒" }),
        h("div", { class: "badge__medal", "aria-hidden": "true", text: s.badge.medal }),
        h("div", { class: "badge__name", text: s.badge.name }),
        h("div", { class: "badge__desc", text: s.badge.desc }),
      ]));
    });
    byId("champion").hidden = !allDone();
  }

  /* ---- progress meters ---- */
  function updateProgress() {
    const c = completedCount();
    const pct = Math.round((c / SECTIONS.length) * 100);
    byId("badgeCount").textContent = c;
    byId("appbarFill").style.width = pct + "%";
    const bar = document.querySelector(".appbar__bar");
    if (bar) bar.setAttribute("aria-valuenow", pct);
    byId("fabBadgeCount").textContent = c + "/7";
  }

  /* ============================================================
     FLOATING MENU (FAB)
     ============================================================ */
  function renderFab() {
    const ul = byId("fabLinks");
    ul.innerHTML = "";
    SECTIONS.forEach((s) => {
      const tick = h("em", { class: "tick", text: isDone(s.id) ? "✓" : "" });
      tick.dataset.id = s.id;
      const a = h("a", { class: "fab__link", href: "#" + s.id, onclick: closeFab }, [
        h("span", { "aria-hidden": "true", text: s.emoji }),
        " " + s.n + ". " + s.label + " ",
        tick,
      ]);
      ul.appendChild(h("li", {}, a));
    });
  }
  function updateFabTicks() {
    document.querySelectorAll("#fabLinks .tick").forEach((t) => { t.textContent = isDone(t.dataset.id) ? "✓" : ""; });
  }
  function wireFab() {
    const fab = byId("fab"), toggle = byId("fabToggle"), menu = byId("fabMenu");
    toggle.addEventListener("click", (e) => {
      e.stopPropagation();
      const open = fab.classList.toggle("is-open");
      menu.hidden = !open;
      toggle.setAttribute("aria-expanded", String(open));
    });
    document.addEventListener("click", (e) => { if (!fab.contains(e.target)) closeFab(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeFab(); });
  }
  function closeFab() {
    const fab = byId("fab");
    fab.classList.remove("is-open");
    byId("fabMenu").hidden = true;
    byId("fabToggle").setAttribute("aria-expanded", "false");
  }

  /* ============================================================
     NAV HELPERS
     ============================================================ */
  function goTo(id) {
    const el = byId(id);
    if (el) el.scrollIntoView({ behavior: prefersReduced() ? "auto" : "smooth", block: "start" });
  }
  function nextStop(s) {
    const i = SECTIONS.findIndex((x) => x.id === s.id);
    const next = SECTIONS[i + 1];
    goTo(next ? next.id : "badges");
  }

  /* ============================================================
     TOAST + CONFETTI
     ============================================================ */
  let toastTimer;
  function showToast(icon, title, text) {
    const t = byId("toast");
    byId("toastIcon").textContent = icon;
    byId("toastTitle").textContent = title;
    byId("toastText").textContent = text;
    t.hidden = false;
    requestAnimationFrame(() => t.classList.add("show"));
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { t.classList.remove("show"); setTimeout(() => { t.hidden = true; }, 300); }, 3400);
  }

  function confettiBurst(big) {
    if (prefersReduced()) return;
    const canvas = byId("confetti");
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const colors = ["#1f9d72", "#ffb020", "#2b7fff", "#7c5cff", "#ff5d8f", "#45c79a"];
    const N = big ? 240 : 130;
    const parts = [];
    for (let i = 0; i < N; i++) {
      parts.push({
        x: Math.random() * canvas.width,
        y: -20 - Math.random() * canvas.height * 0.25,
        r: 4 + Math.random() * 6,
        c: colors[i % colors.length],
        vx: -2.5 + Math.random() * 5,
        vy: 2 + Math.random() * 4.5,
        rot: Math.random() * Math.PI,
        vr: -0.25 + Math.random() * 0.5,
      });
    }
    let frame = 0;
    (function tick() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      parts.forEach((p) => {
        p.x += p.vx; p.y += p.vy; p.vy += 0.06; p.rot += p.vr;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.fillStyle = p.c;
        ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 0.6); ctx.restore();
      });
      if (++frame < 170) requestAnimationFrame(tick);
      else ctx.clearRect(0, 0, canvas.width, canvas.height);
    })();
  }

  /* ============================================================
     RESET
     ============================================================ */
  function wireReset() {
    const btn = byId("resetBtn");
    if (!btn) return;
    btn.addEventListener("click", () => {
      if (!window.confirm("Reset all progress and badges on this device?")) return;
      state = { done: [] };
      save();
      renderSections();
      refreshAll();
      goTo("trail");
    });
  }

  /* ============================================================
     NEWS FEED (loaded from data/news.json, refreshed daily by CI)
     ============================================================ */
  let newsAll = [], newsFiltered = [], newsShown = 0;

  async function loadNews() {
    const grid = byId("newsGrid");
    try {
      const stamp = new Date().toISOString().slice(0, 10); // daily cache-bust
      const res = await fetch("data/news.json?v=" + stamp, { cache: "no-store" });
      if (!res.ok) throw new Error("HTTP " + res.status);
      const data = await res.json();
      newsAll = Array.isArray(data.articles) ? data.articles : [];
      if (data.updatedAt) setUpdated(data.updatedAt);
      applyNewsFilter("");
    } catch (err) {
      grid.innerHTML = "";
      grid.appendChild(h("p", { class: "news__empty", text: "Couldn't load the latest articles right now — they refresh daily, so check back soon." }));
      byId("newsMoreBtn").hidden = true;
    }
  }

  function setUpdated(iso) {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return;
    byId("newsUpdated").textContent = "· Updated " + d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
    byId("footerUpdated").textContent = "Last news refresh: " + d.toLocaleString();
  }

  function applyNewsFilter(qRaw) {
    const q = (qRaw || "").trim().toLowerCase();
    newsFiltered = !q ? newsAll.slice() : newsAll.filter((a) =>
      ((a.title || "") + " " + (a.snippet || "") + " " + (a.source || "")).toLowerCase().indexOf(q) !== -1
    );
    newsShown = 0;
    byId("newsGrid").innerHTML = "";
    renderMoreNews();
  }

  function renderMoreNews() {
    const grid = byId("newsGrid");
    if (newsShown === 0 && newsFiltered.length === 0) {
      grid.appendChild(h("p", { class: "news__empty", text: "No articles match that filter." }));
      byId("newsMoreBtn").hidden = true;
      byId("newsCount").textContent = "";
      return;
    }
    newsFiltered.slice(newsShown, newsShown + NEWS_PER_PAGE).forEach((a) => grid.appendChild(articleCard(a)));
    newsShown = Math.min(newsShown + NEWS_PER_PAGE, newsFiltered.length);
    byId("newsMoreBtn").hidden = newsShown >= newsFiltered.length;
    byId("newsCount").textContent = "Showing " + newsShown + " of " + newsFiltered.length + " articles";
  }

  function articleCard(a) {
    const meta = h("div", { class: "article__meta" }, [h("span", { class: "article__source", text: a.source || "Web" })]);
    if (a.date) { const d = new Date(a.date); if (!isNaN(d.getTime())) meta.appendChild(h("span", { text: d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) })); }
    return h("a", { class: "article", href: a.url || "#", target: "_blank", rel: "noopener noreferrer" }, [
      meta,
      h("div", { class: "article__title", text: a.title || "Untitled" }),
      a.snippet ? h("p", { class: "article__snippet", text: a.snippet }) : null,
      h("span", { class: "article__more", text: "Read on " + (a.source || "site") + " →" }),
    ]);
  }

  function wireNews() {
    byId("newsMoreBtn").addEventListener("click", renderMoreNews);
    let deb;
    byId("newsSearch").addEventListener("input", (e) => {
      clearTimeout(deb);
      const v = e.target.value;
      deb = setTimeout(() => applyNewsFilter(v), 180);
    });
  }

  /* ============================================================
     INIT
     ============================================================ */
  function init() {
    renderTrail();
    renderSections();
    renderBadges();
    renderFab();
    updateProgress();
    wireFab();
    wireReset();
    wireNews();
    loadNews();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
