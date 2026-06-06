/* ============================================================
   California Car Insurance Guide — app logic
   Vanilla JS. Renders sections, the floating menu (with
   scroll-spy), the profile matcher, and the daily news feed.
   No gamification, no gating — everything is freely accessible.
   ============================================================ */
(function () {
  "use strict";

  const SECTIONS = CONTENT.sections;
  const NEWS_PER_PAGE = 10;

  /* ---------- DOM helper ---------- */
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

  /* ---------- shared bits ---------- */
  function calloutEl(text) { return h("div", { class: "callout" }, h("div", { text })); }

  function verdictBlock(v, title) {
    const dl = h("dl");
    const add = (dt, dd) => { dl.appendChild(h("dt", { text: dt })); dl.appendChild(h("dd", { text: dd })); };
    add("Coverage", v.coverage);
    add("Deductible", v.deductible);
    add("Liability", v.liability);
    add("Add-ons", (v.addons || []).join(" · "));
    return h("div", { class: "verdict" }, [
      h("div", { class: "verdict__title", text: title || "Recommended" }),
      dl,
      v.why ? h("p", { class: "verdict__why", text: v.why }) : null,
    ]);
  }

  /* ---------- section heads ---------- */
  function headFor(s) {
    switch (s.type) {
      case "essentials": return { title: CONTENT.essentials.title, sub: CONTENT.essentials.lead };
      case "situations": return { title: "Real California situations", sub: CONTENT.situationsIntro };
      case "factors":    return { title: "What sets your rate in California", sub: CONTENT.rateIntro };
      case "trend":      return { title: "How premiums have grown (5-year trend)", sub: CONTENT.trendIntro };
      case "bestrate":   return { title: "Get the best rate (and what to avoid)", sub: CONTENT.bestrateIntro };
      case "myths":      return { title: "7 common myths", sub: CONTENT.mythsIntro };
      case "terms":      return { title: "Coverages & key terms", sub: CONTENT.termsIntro };
      case "choices":    return { title: "Smart coverage choices", sub: CONTENT.choicesIntro };
      case "profiles":   return { title: "Find your fit", sub: CONTENT.profilesIntro };
      case "accident":   return { title: "What to do after an accident", sub: CONTENT.accidentIntro };
      case "resources":  return { title: "Help & resources", sub: CONTENT.resourcesIntro };
      default:           return { title: s.label, sub: "" };
    }
  }

  /* ---------- section bodies ---------- */
  const builders = {
    essentials() {
      const c = CONTENT.essentials;
      const mins = h("div", { class: "mins" });
      c.minimums.forEach((m) => mins.appendChild(h("div", { class: "min" }, [h("div", { class: "min__k", text: m.k }), h("div", { class: "min__v", text: m.v })])));
      return [mins, h("p", { class: "min-note", html: c.minNote }), h("div", { class: "prose", html: c.html }), calloutEl(c.callout)];
    },

    situations() {
      const grid = h("div", { class: "grid grid-2" });
      CONTENT.situations.forEach((c) => {
        grid.appendChild(h("div", { class: "case" }, [
          h("div", { class: "case__tag", text: c.tag }),
          h("div", { class: "case__who", text: c.who }),
          h("p", { class: "case__body", text: c.body }),
          h("div", { class: "case__lesson", html: "<b>Lesson:</b> " + c.lesson }),
        ]));
      });
      return [grid];
    },

    factors() {
      const stats = h("div", { class: "stats" });
      CONTENT.rateStats.forEach((s) => stats.appendChild(h("div", { class: "stat" }, [h("span", { class: "stat__num", text: s.num }), h("span", { class: "stat__lbl", text: s.lbl })])));

      const mand = h("div", { class: "mand" });
      CONTENT.mandatory.forEach((m) => mand.appendChild(h("div", { class: "mand__row" }, [
        h("div", { class: "mand__n", text: m.n }),
        h("div", {}, [h("div", { class: "mand__name", text: m.name }), h("p", { class: "mand__desc", text: m.desc })]),
      ])));

      const banList = h("div", { class: "banned__list" });
      CONTENT.banned.forEach((b) => banList.appendChild(h("div", { class: "banned__item", html: "<b>" + b.name + ".</b> " + b.note })));
      const banned = h("div", { class: "banned" }, [h("div", { class: "banned__title", html: "What California <span>prohibits</span>" }), banList]);

      return [
        stats,
        h("h3", { text: "The three mandatory factors (in order of weight)" }),
        mand,
        banned,
        h("p", { class: "min-note", text: CONTENT.rateNote }),
      ];
    },

    trend() {
      const T = CONTENT.trend;
      const SVGNS = "http://www.w3.org/2000/svg";
      const svgEl = (tag, attrs) => { const n = document.createElementNS(SVGNS, tag); for (const k in attrs) n.setAttribute(k, attrs[k]); return n; };
      const money = (v) => "$" + Math.round(v).toLocaleString();

      // Build each series' data points from base × multiplier.
      const data = T.series.map((s) => ({ ...s, values: T.base.map((b) => Math.round(b * s.mult)) }));
      const state = {}; data.forEach((s) => { state[s.id] = s.on; });

      // Geometry (viewBox space; SVG scales responsively via CSS width:100%).
      const W = 720, H = 360, m = { t: 24, r: 16, b: 40, l: 64 };
      const plotW = W - m.l - m.r, plotH = H - m.t - m.b;
      const yMax = 8000; // headroom for the DUI/teen lines
      const x = (i) => m.l + (plotW * i) / (T.years.length - 1);
      const y = (v) => m.t + plotH * (1 - v / yMax);

      const svg = svgEl("svg", { viewBox: "0 0 " + W + " " + H, role: "img", "aria-label": "Line chart of California car insurance premiums, 2022 to 2026, by driver profile", class: "chart__svg" });

      // Gridlines + y labels
      for (let g = 0; g <= 8; g += 2) {
        const gv = g * 1000, gy = y(gv);
        svg.appendChild(svgEl("line", { x1: m.l, y1: gy, x2: W - m.r, y2: gy, class: "chart__grid" }));
        const lbl = svgEl("text", { x: m.l - 10, y: gy + 4, class: "chart__ylabel", "text-anchor": "end" });
        lbl.textContent = "$" + (g) + "k"; svg.appendChild(lbl);
      }
      // X labels
      T.years.forEach((yr, i) => {
        const t = svgEl("text", { x: x(i), y: H - m.b + 22, class: "chart__xlabel", "text-anchor": "middle" });
        t.textContent = yr; svg.appendChild(t);
      });

      // Layers for lines, dots, and a hover guide
      const guide = svgEl("line", { x1: 0, y1: m.t, x2: 0, y2: m.t + plotH, class: "chart__guide", opacity: "0" });
      svg.appendChild(guide);
      const lineNodes = {}, dotGroups = {};
      data.forEach((s) => {
        const d = s.values.map((v, i) => (i ? "L" : "M") + x(i) + " " + y(v)).join(" ");
        const path = svgEl("path", { d: d, fill: "none", stroke: s.color, "stroke-width": "2.5", "stroke-linejoin": "round", "stroke-linecap": "round", class: "chart__line" });
        lineNodes[s.id] = path; svg.appendChild(path);
        const dg = svgEl("g", {}); dotGroups[s.id] = dg;
        s.values.forEach((v, i) => dg.appendChild(svgEl("circle", { cx: x(i), cy: y(v), r: "3.5", fill: s.color, class: "chart__dot" })));
        svg.appendChild(dg);
      });

      // Tooltip (HTML overlay)
      const tip = h("div", { class: "chart__tip", hidden: true });

      function applyVisibility() {
        data.forEach((s) => {
          const vis = state[s.id];
          lineNodes[s.id].style.display = vis ? "" : "none";
          dotGroups[s.id].style.display = vis ? "" : "none";
        });
      }
      applyVisibility();

      // Hover: snap to nearest year, show all visible series
      const overlay = svgEl("rect", { x: m.l, y: m.t, width: plotW, height: plotH, fill: "transparent", class: "chart__overlay" });
      function handleMove(clientX, rect) {
        const rel = (clientX - rect.left) / rect.width * W; // back to viewBox units
        let i = Math.round((rel - m.l) / plotW * (T.years.length - 1));
        i = Math.max(0, Math.min(T.years.length - 1, i));
        guide.setAttribute("x1", x(i)); guide.setAttribute("x2", x(i)); guide.setAttribute("opacity", "1");
        const rows = data.filter((s) => state[s.id]).map((s) =>
          '<span class="chart__tiprow"><i style="background:' + s.color + '"></i>' + s.label + " <b>" + money(s.values[i]) + "</b></span>"
        ).join("");
        tip.innerHTML = '<div class="chart__tipyear">' + T.years[i] + "</div>" + rows;
        tip.hidden = false;
        // position tooltip within the wrap
        const px = (x(i) / W) * rect.width;
        tip.style.left = Math.max(8, Math.min(rect.width - 8, px)) + "px";
      }
      overlay.addEventListener("mousemove", (e) => handleMove(e.clientX, svg.getBoundingClientRect()));
      overlay.addEventListener("mouseleave", () => { tip.hidden = true; guide.setAttribute("opacity", "0"); });
      overlay.addEventListener("touchstart", (e) => { if (e.touches[0]) handleMove(e.touches[0].clientX, svg.getBoundingClientRect()); }, { passive: true });
      overlay.addEventListener("touchmove", (e) => { if (e.touches[0]) handleMove(e.touches[0].clientX, svg.getBoundingClientRect()); }, { passive: true });
      svg.appendChild(overlay);

      // Filter chips (legend = toggles)
      const noteEl = h("p", { class: "chart__note" });
      function refreshNote() {
        const active = data.filter((s) => state[s.id]);
        const lead = active.length === 1 ? active[0] : (active.find((s) => s.id === "avg") || active[0]);
        if (lead) {
          const first = Math.round(T.base[0] * lead.mult), last = Math.round(T.base[T.base.length - 1] * lead.mult);
          const pct = Math.round((last / first - 1) * 100);
          noteEl.innerHTML = "<b>" + lead.label + ":</b> " + lead.note + " <span class='chart__delta'>(" + money(first) + " → " + money(last) + ", " + (pct >= 0 ? "+" : "") + pct + "% over 5 yrs)</span>";
        } else { noteEl.textContent = "Select at least one profile to see the trend."; }
      }
      const chips = h("div", { class: "chart__chips", role: "group", "aria-label": "Filter profiles" });
      data.forEach((s) => {
        const chip = h("button", {
          type: "button", class: "chip" + (state[s.id] ? " is-on" : ""),
          "aria-pressed": String(state[s.id]),
          onclick: () => {
            state[s.id] = !state[s.id];
            chip.classList.toggle("is-on", state[s.id]);
            chip.setAttribute("aria-pressed", String(state[s.id]));
            applyVisibility(); refreshNote();
          },
        }, [h("span", { class: "chip__dot", style: "background:" + s.color }), s.label]);
        chips.appendChild(chip);
      });
      refreshNote();

      return [
        chips,
        h("div", { class: "chart__wrap" }, [svg, tip]),
        noteEl,
        h("p", { class: "tbl-note", text: T.source }),
      ];
    },

    bestrate() {
      const doList = h("div", { class: "rules" });
      CONTENT.bestrateDo.forEach((r) => doList.appendChild(h("div", { class: "rule" }, [
        h("div", { class: "rule__h", html: "✓ " + r.h }), h("p", { class: "rule__t", text: r.t }),
      ])));
      const avoidList = h("div", { class: "rules" });
      CONTENT.bestrateAvoid.forEach((r) => avoidList.appendChild(h("div", { class: "rule rule--avoid" }, [
        h("div", { class: "rule__h", html: "✕ " + r.h }), h("p", { class: "rule__t", text: r.t }),
      ])));
      return [
        h("h3", { text: "Do this — the moves that lower your rate" }),
        doList,
        h("h3", { text: "Avoid this — the quiet money-wasters", style: "margin-top:1.4rem" }),
        avoidList,
        calloutEl(CONTENT.bestrateNote),
      ];
    },

    myths() {
      const wrap = h("div", { class: "myths" });
      CONTENT.myths.forEach((m, i) => wrap.appendChild(h("div", { class: "myth" }, [
        h("div", { class: "myth__head" }, [
          h("span", { class: "myth__badge", text: "Myth " + (i + 1) }),
          h("span", { class: "myth__claim", text: m.myth }),
        ]),
        h("p", { class: "myth__truth", html: "<b>Truth:</b> " + m.truth }),
      ])));
      return [wrap];
    },

    terms() {
      const wrap = h("div", { class: "terms" });
      CONTENT.terms.forEach((t) => {
        wrap.appendChild(h("details", { class: "term" }, [
          h("summary", {}, [h("span", { text: t.term }), h("span", { class: "term__chev", "aria-hidden": "true", text: "▾" })]),
          h("div", { class: "term__body" }, [
            h("p", { class: "term__def", text: t.def }),
            h("div", { class: "term__note", html: "<b>California:</b> " + t.note }),
          ]),
        ]));
      });
      return [wrap];
    },

    choices() {
      const t = CONTENT.deductibleTable;
      const thead = h("tr", {}, t.head.map((th) => h("th", { text: th })));
      const tbody = t.rows.map((r) => h("tr", {}, r.map((td) => h("td", { text: td }))));
      const table = h("div", { class: "table-wrap" }, h("table", { class: "tbl" }, [h("thead", {}, thead), h("tbody", {}, tbody)]));

      const rules = h("div", { class: "rules" });
      CONTENT.rules.forEach((r) => rules.appendChild(h("div", { class: "rule" }, [h("div", { class: "rule__h", text: r.h }), h("p", { class: "rule__t", text: r.t })])));

      return [
        h("h3", { text: "Choosing a deductible" }),
        table,
        h("p", { class: "tbl-note", text: t.note }),
        h("h3", { text: "Rules of thumb" }),
        rules,
      ];
    },

    profiles() {
      const cards = h("div", { class: "pcards" });
      const rec = h("div", { class: "rec" }, h("p", { class: "rec__hint", text: "Select a profile above to see options, the recommended choice, and a deductible." }));

      CONTENT.profiles.forEach((p, i) => {
        const cost = h("span", { class: "pcard__cost" });
        cost.appendChild(document.createTextNode("Relative cost: "));
        for (let d = 0; d < 3; d++) cost.appendChild(h("span", { class: d < p.cost ? "on" : "off", text: "$" }));
        cards.appendChild(h("button", { class: "pcard", type: "button", "data-i": i, onclick: () => select(i) }, [
          h("div", { class: "pcard__name", text: p.name }),
          h("div", { class: "pcard__tag", text: p.tag }),
          cost,
        ]));
      });

      function select(i) {
        Array.prototype.forEach.call(cards.querySelectorAll(".pcard"), (c, idx) => c.classList.toggle("is-active", idx === i));
        const p = CONTENT.profiles[i];
        rec.innerHTML = "";
        rec.appendChild(h("div", { class: "rec__head" }, [h("div", { class: "rec__name", text: p.name }), h("div", { class: "rec__traits", text: p.traits.join(" · ") })]));
        const opts = h("div", { class: "opts" });
        p.options.forEach((o, oi) => {
          const list = h("ul", { class: "opt__list" });
          o.items.forEach((it) => list.appendChild(h("li", { class: it.ok ? "" : "no", text: it.t })));
          opts.appendChild(h("div", { class: "opt" + (oi === p.best ? " is-best" : "") }, [
            oi === p.best ? h("span", { class: "opt__badge", text: "Recommended" }) : null,
            h("div", { class: "opt__name", text: o.name }),
            h("div", { class: "opt__price", text: o.price }),
            list,
          ]));
        });
        rec.appendChild(opts);
        rec.appendChild(verdictBlock(p.verdict, "Optimal coverage & deductible"));
      }

      /* build-your-own */
      const grid = h("div", { class: "builder__grid" });
      const selects = {};
      CONTENT.builder.fields.forEach((f) => {
        const sel = h("select", { id: "b-" + f.id, onchange: run }, [h("option", { value: "", text: "Choose…" })]);
        f.options.forEach((o) => sel.appendChild(h("option", { value: o.v, text: o.t })));
        selects[f.id] = sel;
        grid.appendChild(h("label", { class: "field" }, [f.label, sel]));
      });
      const out = h("div", { class: "builder__out" }, h("p", { class: "rec__hint", text: "Answer all five to see a tailored California starting point." }));
      function run() {
        const v = {}; let ready = true;
        CONTENT.builder.fields.forEach((f) => { v[f.id] = selects[f.id].value; if (!v[f.id]) ready = false; });
        if (!ready) { out.innerHTML = ""; out.appendChild(h("p", { class: "rec__hint", text: "Answer all five to see a tailored California starting point." })); return; }
        out.innerHTML = "";
        out.appendChild(verdictBlock(buildRecommendation(v), "Your California starting point"));
      }
      const builder = h("div", { class: "builder" }, [
        h("div", { class: "builder__title", text: "Build your own" }),
        h("p", { class: "builder__sub", text: "Five questions tuned to California's rating rules — a starting point, not a quote." }),
        grid, out,
      ]);

      return [cards, rec, builder];
    },

    accident() {
      const steps = h("ol", { class: "steps" });
      CONTENT.accidentSteps.forEach((s) => steps.appendChild(h("li", { class: "step" }, [
        h("div", { class: "step__n", text: s.n }),
        h("div", { class: "step__body" }, [h("div", { class: "step__h", text: s.h }), h("p", { class: "step__t", text: s.t })]),
      ])));

      const avoid = h("ul", { class: "donts" });
      CONTENT.accidentAvoid.forEach((d) => avoid.appendChild(h("li", { text: d })));

      const kit = h("ul", { class: "kit" });
      CONTENT.accidentKit.forEach((k) => kit.appendChild(h("li", { text: k })));

      return [
        h("h3", { text: "Step by step" }),
        steps,
        h("div", { class: "grid grid-2", style: "margin-top:1.2rem" }, [
          h("div", { class: "panel-sub" }, [h("h3", { text: "Don't" }), avoid]),
          h("div", { class: "panel-sub" }, [h("h3", { text: "Keep in your glovebox" }), kit]),
        ]),
        calloutEl("California law: file DMV form SR-1 within 10 days of any crash with injury, death, or property damage over $1,000. Missing it can suspend your license — even if you weren't at fault."),
      ];
    },

    resources() {
      const wrap = h("div", { class: "res" });
      CONTENT.resources.forEach((r) => wrap.appendChild(h("div", { class: "resource" }, [
        h("div", { class: "resource__name", text: r.name }),
        h("p", { class: "resource__what", text: r.what }),
        h("a", { class: "resource__link ext", href: r.url, target: "_blank", rel: "noopener noreferrer", text: r.link }),
      ])));
      return [wrap];
    },
  };

  /* California-tuned recommendation engine */
  function buildRecommendation(v) {
    const addons = ["Keep UM/UIM — don't waive it"];
    let coverage, deductible, liability;

    if (v.value === "financed") { coverage = "Full coverage (required by your lender)"; deductible = "$500"; addons.push("GAP insurance"); }
    else if (v.value === "mid") { coverage = "Full coverage (collision + comprehensive)"; deductible = "$500–$1,000"; }
    else { coverage = "Liability only — self-insure an older car (10% rule)"; deductible = "$1,000+, or skip collision/comp"; addons.push("Check California Low Cost Auto (CLCA) if income-eligible"); }

    if (v.area === "la") addons.push(v.value === "beater" ? "Comprehensive worth considering (city theft)" : "Prioritize comprehensive (theft/vandalism)");

    liability = (v.value === "beater" && v.record !== "clean")
      ? "At least 30/60/15; step up if you have assets"
      : "Above the 30/60/15 minimum — 100/300/100 is a common step up";

    if (v.record === "clean" && (v.exp === "some" || v.exp === "vet")) addons.push("Good Driver Discount (≥20%) — you likely qualify");
    else if (v.record === "clean" && v.exp === "new") addons.push("Good Driver Discount after ~3 clean years — on track");
    if (v.miles === "low") addons.push("Low-mileage discount (California weights miles heavily)");
    if (v.exp === "new") addons.push("Good-student & driver-training discounts");

    const why = v.record === "multi"
      ? "With recent incidents, expect higher rates — shop several insurers, since approved rates vary widely under Prop 103."
      : "California rewards a clean record, low mileage, and experience. Lock in the Good Driver Discount and re-shop after any rate hike.";

    return { coverage, deductible, liability, addons, why };
  }

  /* ---------- render sections as drawers (accordion) ---------- */
  const CHEVRON = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  function renderSections() {
    const wrap = byId("sections");
    wrap.innerHTML = "";

    // Expand / collapse-all toolbar
    wrap.appendChild(h("div", { class: "drawers__bar" }, [
      h("span", { class: "drawers__hint", text: "Tap a section to open it." }),
      h("button", { class: "drawers__toggle", type: "button", id: "expandAll", onclick: toggleAll, text: "Expand all" }),
    ]));

    SECTIONS.forEach((s, i) => {
      const head = headFor(s);
      const inner = h("div", { class: "drawer__inner" }, head.sub ? h("p", { class: "section__sub", text: head.sub }) : null);
      builders[s.type]().forEach((node) => node && inner.appendChild(node));

      const drawer = h("details", { class: "drawer", id: s.id }, [
        h("summary", { class: "drawer__head", "aria-label": "Section " + s.n + ": " + head.title }, [
          h("span", { class: "drawer__num", "aria-hidden": "true", text: s.n }),
          h("span", { class: "drawer__title", text: head.title }),
          h("span", { class: "drawer__chev", "aria-hidden": "true", html: CHEVRON }),
        ]),
        h("div", { class: "drawer__body" }, inner),
      ]);
      if (i === 0) drawer.open = true; // first section open by default
      drawer.addEventListener("toggle", () => { if (drawer.open) setActive(s.id); syncExpandAll(); });
      wrap.appendChild(drawer);
    });
    syncExpandAll();
  }

  function toggleAll() {
    const drawers = document.querySelectorAll(".drawer");
    const anyClosed = Array.prototype.some.call(drawers, (d) => !d.open);
    Array.prototype.forEach.call(drawers, (d) => { d.open = anyClosed; });
    syncExpandAll();
  }
  function syncExpandAll() {
    const btn = byId("expandAll");
    if (!btn) return;
    const drawers = document.querySelectorAll(".drawer");
    const allOpen = drawers.length > 0 && Array.prototype.every.call(drawers, (d) => d.open);
    btn.textContent = allOpen ? "Collapse all" : "Expand all";
  }
  function openSection(id) {
    const el = byId(id);
    if (!el) return;
    if (el.tagName === "DETAILS") { el.open = true; syncExpandAll(); }
    requestAnimationFrame(() => el.scrollIntoView({ behavior: prefersReduced() ? "auto" : "smooth", block: "start" }));
  }
  const prefersReduced = () => window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- floating menu ---------- */
  function renderMenu() {
    const list = byId("fmenuList");
    list.innerHTML = "";
    SECTIONS.forEach((s) => {
      const a = h("a", { class: "fmenu__link", href: "#" + s.id, onclick: (e) => { e.preventDefault(); closeMenu(); openSection(s.id); } }, [
        h("span", { class: "n", "aria-hidden": "true", text: s.n }),
        h("span", { text: s.label }),
      ]);
      a.dataset.id = s.id;
      list.appendChild(h("li", {}, a));
    });
    const foot = document.querySelector(".fmenu__extra");
    if (foot) { foot.dataset.id = "news"; foot.addEventListener("click", (e) => { e.preventDefault(); closeMenu(); openSection("news"); }); }
  }
  function wireMenu() {
    const fmenu = byId("fmenu"), btn = byId("fmenuBtn"), panel = byId("fmenuPanel");
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const open = fmenu.classList.toggle("is-open");
      panel.hidden = !open;
      btn.setAttribute("aria-expanded", String(open));
    });
    document.addEventListener("click", (e) => { if (!fmenu.contains(e.target)) closeMenu(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeMenu(); });
  }
  function closeMenu() {
    const fmenu = byId("fmenu");
    if (!fmenu.classList.contains("is-open")) return;
    fmenu.classList.remove("is-open");
    byId("fmenuPanel").hidden = true;
    byId("fmenuBtn").setAttribute("aria-expanded", "false");
  }
  function setActive(id) {
    document.querySelectorAll(".fmenu__link, .fmenu__extra").forEach((a) => a.classList.toggle("is-active", a.dataset.id === id));
  }
  function setupScrollSpy() {
    if (!("IntersectionObserver" in window)) return;
    const targets = SECTIONS.map((s) => byId(s.id)).filter(Boolean);
    const news = byId("news"); if (news) targets.push(news);
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) setActive(en.target.id); });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
    targets.forEach((t) => obs.observe(t));
  }

  /* ---------- news ---------- */
  let newsAll = [], newsFiltered = [], newsShown = 0;

  async function loadNews() {
    const grid = byId("newsGrid");
    try {
      const stamp = new Date().toISOString().slice(0, 10);
      const res = await fetch("data/news.json?v=" + stamp, { cache: "no-store" });
      if (!res.ok) throw new Error("HTTP " + res.status);
      const data = await res.json();
      newsAll = Array.isArray(data.articles) ? data.articles : [];
      if (data.updatedAt) setUpdated(data.updatedAt);
      applyFilter("");
    } catch (err) {
      grid.innerHTML = "";
      grid.appendChild(h("p", { class: "news__empty", text: "Couldn't load the latest articles right now — they refresh daily, so please check back soon." }));
      byId("newsMoreBtn").hidden = true;
    }
  }
  function setUpdated(iso) {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return;
    byId("newsUpdated").textContent = "Updated " + d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
    byId("footerUpdated").textContent = "Last news refresh: " + d.toLocaleString();
  }
  function applyFilter(qRaw) {
    const q = (qRaw || "").trim().toLowerCase();
    newsFiltered = !q ? newsAll.slice() : newsAll.filter((a) => ((a.title || "") + " " + (a.snippet || "") + " " + (a.source || "")).toLowerCase().indexOf(q) !== -1);
    newsShown = 0;
    byId("newsGrid").innerHTML = "";
    renderMore();
  }
  function renderMore() {
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
      h("span", { class: "article__more", text: "Read on " + (a.source || "site") + " ↗" }),
    ]);
  }
  function wireNews() {
    byId("newsMoreBtn").addEventListener("click", renderMore);
    let deb;
    byId("newsSearch").addEventListener("input", (e) => { clearTimeout(deb); const val = e.target.value; deb = setTimeout(() => applyFilter(val), 180); });
  }

  /* ---------- init ---------- */
  function init() {
    renderSections();
    renderMenu();
    wireMenu();
    setupScrollSpy();
    wireNews();
    loadNews();
    // Open a drawer if the page was loaded with a deep link (e.g. #trends).
    const hash = (location.hash || "").replace(/^#/, "");
    if (hash && byId(hash)) setTimeout(() => openSection(hash), 60);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
