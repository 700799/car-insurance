/* ============================================================
   California Car Insurance Guide — content
   All copy and data. California-specific. Figures are 2026
   estimates and program facts; they change — always verify with
   the California Department of Insurance and real quotes.
   ============================================================ */

const CONTENT = {
  meta: { state: "California", year: "2026" },

  /* Section registry (order = page order = menu order). No gating. */
  sections: [
    { id: "essentials", n: 1,  label: "California essentials",  type: "essentials" },
    { id: "situations", n: 2,  label: "Real situations",        type: "situations" },
    { id: "rate",       n: 3,  label: "What sets your rate",    type: "factors" },
    { id: "trends",     n: 4,  label: "5-year premium trends",  type: "trend" },
    { id: "bestrate",   n: 5,  label: "Get the best rate",      type: "bestrate" },
    { id: "myths",      n: 6,  label: "7 common myths",         type: "myths" },
    { id: "coverages",  n: 7,  label: "Coverages & terms",      type: "terms" },
    { id: "choices",    n: 8,  label: "Smart coverage choices", type: "choices" },
    { id: "profiles",   n: 9,  label: "Find your fit",          type: "profiles" },
    { id: "accident",   n: 10, label: "After an accident",      type: "accident" },
    { id: "resources",  n: 11, label: "Help & resources",       type: "resources" },
  ],

  /* ---- 1. California essentials ---- */
  essentials: {
    title: "What California requires",
    lead: "Every driver in California must carry proof of financial responsibility — almost always an auto liability policy. As of January 1, 2025, the state minimum limits rose for the first time since 1967.",
    minimums: [
      { k: "$30,000", v: "Bodily injury / death — one person" },
      { k: "$60,000", v: "Bodily injury / death — per accident" },
      { k: "$15,000", v: "Property damage" },
    ],
    minNote: "Written as <strong>30/60/15</strong> (SB 1107, the “Protect California Drivers Act”). The old 15/30/5 minimums are no longer compliant.",
    html: `
      <h3>The basics</h3>
      <ul>
        <li><strong>Liability only is the legal minimum.</strong> It pays for injuries and damage you cause to others — not your own car.</li>
        <li><strong>California is an at-fault (tort) state.</strong> The driver who causes a crash is responsible. There is no “no-fault” / PIP requirement here; personal-injury protection is not part of a California policy.</li>
        <li><strong>Insurers report to the DMV electronically.</strong> Carry your insurance card; a lapse can trigger a registration suspension.</li>
        <li><strong>Driving uninsured is costly.</strong> Fines start around $100–$200 but climb past $450 with penalty assessments, and your vehicle can be impounded.</li>
      </ul>`,
    callout: "Minimum limits are a floor, not a goal. A single serious injury can blow past $30,000 in minutes — most California drivers should carry higher liability limits.",
  },

  /* ---- 2. Real situations ---- */
  situationsIntro: "Four situations California teens and new drivers actually face, and the coverage that mattered.",
  situations: [
    { who: "At-fault rear-end, Sacramento", tag: "New driver · liability",
      body: "A new driver rear-ended an SUV. The other party's repairs and a minor injury claim quickly approached the state minimum. With only 30/60/15, there was little room to spare.",
      lesson: "California's minimums are low. Higher bodily-injury limits (e.g. 100/300) protect your savings if you're at fault." },
    { who: "Uninsured driver, Los Angeles", tag: "Hit by uninsured · UM",
      body: "A driver with no insurance ran a light and fled. About one in six California drivers is uninsured, so there was no one to bill. Uninsured-motorist coverage paid the medical bills and repairs.",
      lesson: "California lets you waive uninsured-motorist coverage in writing — don't. It's inexpensive and common here." },
    { who: "Teen on the family policy", tag: "Teen · discounts",
      body: "Instead of a standalone policy (often $7,000+ a year), a 17-year-old was added to a parent's policy and kept a B average for the good-student discount, cutting the added cost substantially.",
      lesson: "Stay on a parent's policy and stack the good-student discount. After three clean years, the 20% Good Driver Discount applies." },
    { who: "Paid-off commuter car", tag: "Older car · trade-off",
      body: "A 12-year-old car worth about $3,000 still carried collision and comprehensive. The premiums plus the deductible were nearing the car's value, so the owner dropped them and kept strong liability.",
      lesson: "When collision + comprehensive cost more than ~10% of the car's value, dropping them often makes sense." },
  ],

  /* ---- 3. What sets your rate (Prop 103) ---- */
  rateIntro: "California is unusual. Under Proposition 103 (1988), the Department of Insurance must approve rates in advance, and insurers must weight three mandatory factors most heavily — in this order.",
  mandatory: [
    { n: "1", name: "Driving safety record", desc: "Accidents and violations carry the most weight. A clean record is the single biggest lever you control." },
    { n: "2", name: "Annual miles driven", desc: "California explicitly rewards lower mileage. Fewer miles means lower risk and a lower rate." },
    { n: "3", name: "Years of driving experience", desc: "More experience lowers your rate over time — a major reason new drivers pay the most." },
  ],
  banned: [
    { name: "Credit score", note: "Cannot be used for auto insurance in California." },
    { name: "Gender", note: "Banned as a rating factor since 2019." },
    { name: "ZIP code as the primary factor", note: "Location may be a secondary factor only — it can't outweigh the three mandatory ones." },
  ],
  rateStats: [
    { num: "~$2,700/yr", lbl: "Avg. full coverage (2026)" },
    { num: "~$700/yr", lbl: "Avg. minimum coverage" },
    { num: "40–50%", lbl: "Rate rise over ~2 years" },
    { num: "≥20%", lbl: "Mandated Good Driver Discount" },
  ],
  rateNote: "Rates have climbed sharply (rising repair costs, claims severity, and wildfire-driven losses across the market). Optional secondary factors insurers may use include vehicle type, marital status, and annual mileage bands — but never credit or gender.",

  /* ---- 4. Coverages & terms ---- */
  termsIntro: "The coverages on a California policy, in plain terms. The note on each is the California-specific point to remember.",
  terms: [
    { term: "Bodily Injury & Property Damage liability", def: "Pays for injuries and property you cause others. The required 30/60/15 limits are the minimum.",
      note: "Required statewide. Most drivers should buy more than the minimum." },
    { term: "Collision", def: "Repairs or replaces your own car after a crash, regardless of fault.",
      note: "Optional, but required by lenders. Weigh it against your car's value." },
    { term: "Comprehensive", def: "Covers your car for theft, vandalism, fire, falling objects, and weather.",
      note: "Worth more in cities (theft) and wildfire/storm-exposed areas." },
    { term: "Uninsured / Underinsured Motorist (UM/UIM)", def: "Pays your bills when an at-fault driver has no insurance or too little — including hit-and-runs.",
      note: "Insurers must offer it; you can reject it only in writing. With ~1 in 6 drivers uninsured, keep it." },
    { term: "Medical Payments (MedPay)", def: "Covers medical bills for you and your passengers regardless of fault.",
      note: "Optional. California has no no-fault/PIP, so MedPay is the main first-party medical add-on." },
    { term: "GAP", def: "If a financed car is totaled, pays the difference between the loan balance and the car's value.",
      note: "Useful on new, financed, or leased cars that depreciate quickly." },
    { term: "Deductible", def: "What you pay out of pocket on a collision or comprehensive claim before coverage applies.",
      note: "A higher deductible lowers your premium — pick an amount you could pay today." },
    { term: "Good Driver Discount", def: "A California-mandated discount of at least 20% for qualifying drivers.",
      note: "Requires ~3 years' experience and a clean record (no more than one point)." },
  ],

  /* ---- 5. Smart coverage choices ---- */
  choicesIntro: "Coverage is a balance between premium and risk. Here is how the main trade-offs play out in California.",
  deductibleTable: {
    head: ["Deductible", "Collision + comp premium", "You pay per claim"],
    rows: [
      ["$250", "Highest", "$250"],
      ["$500", "Baseline", "$500"],
      ["$1,000", "~15–25% lower", "$1,000"],
      ["$2,000", "~30–40% lower", "$2,000"],
    ],
    note: "Illustrative. Raising your deductible lowers the premium but increases what you pay after a claim.",
  },
  rules: [
    { h: "Buy more than 30/60/15.", t: "State minimums are low. If you have any assets, 100/300/100 bodily-injury limits are a common, affordable step up." },
    { h: "Keep uninsured-motorist coverage.", t: "California lets you waive it in writing, but with so many uninsured drivers it's one of the best values on the policy." },
    { h: "Use the 10% rule on older cars.", t: "If collision + comprehensive plus the deductible exceed ~10% of the car's value, consider dropping them." },
    { h: "Lean on California's mileage factor.", t: "Because miles driven is a mandatory factor, low-mileage and verified-mileage programs can meaningfully cut your rate." },
    { h: "Earn and keep the Good Driver Discount.", t: "Three clean years and you qualify for at least 20% off — protect it." },
    { h: "Re-shop after any rate hike.", t: "Approved rate changes vary by insurer. The same coverage can differ by hundreds of dollars a year." },
  ],

  /* ---- 6. Find your fit (California profiles) ---- */
  profilesIntro: "Pick the driver closest to you to see three coverage options, the recommended choice, and a deductible — all framed for California. Then build your own below.",
  profiles: [
    {
      id: "lowmile", name: "Low-mileage, experienced", tag: "Clean record · few miles · older paid-off car", cost: 1,
      traits: ["10+ years' experience", "Low annual mileage", "Owns an older car outright", "Qualifies for Good Driver Discount"],
      options: [
        { name: "State minimum 30/60/15", price: "Lowest", items: [
          { t: "Legal to drive", ok: true }, { t: "Nothing for your own car", ok: false }, { t: "Thin if you're at fault", ok: false } ] },
        { name: "Higher liability + UM", price: "Best value", items: [
          { t: "100/300/100 limits", ok: true }, { t: "Uninsured-motorist included", ok: true }, { t: "Low-mileage discount", ok: true }, { t: "Good Driver 20% off", ok: true } ] },
        { name: "Add full coverage", price: "Often unnecessary", items: [
          { t: "Collision + comprehensive", ok: true }, { t: "May exceed 10% of car's value", ok: false } ] },
      ],
      best: 1,
      verdict: { coverage: "Liability at 100/300/100 + UM/UIM; skip collision/comp on a low-value car", deductible: "N/A (collision dropped); comprehensive only if car still worth ~$4k+, then $1,000",
        liability: "100/300/100", addons: ["UM/UIM", "Low-mileage program", "Good Driver Discount"],
        why: "Low mileage and a clean record are exactly what California rewards. Put the savings into stronger liability and keep UM rather than insuring a low-value car." },
    },
    {
      id: "la", name: "Los Angeles city driver", tag: "Urban · street parking · newer car", cost: 3,
      traits: ["Dense urban ZIP", "Higher theft/vandalism risk", "Car is 0–6 years old", "More miles in traffic"],
      options: [
        { name: "Liability only", price: "Risky here", items: [
          { t: "Cheapest", ok: true }, { t: "No theft/vandalism cover", ok: false }, { t: "No payout if your car's hit", ok: false } ] },
        { name: "Full coverage + UM", price: "Best fit", items: [
          { t: "Comprehensive (theft/vandalism)", ok: true }, { t: "Collision", ok: true }, { t: "UM/UIM", ok: true }, { t: "Anti-theft / garaging discount", ok: true } ] },
        { name: "Full + $250 deductible", price: "Pricey", items: [
          { t: "Lowest out-of-pocket", ok: true }, { t: "Highest premium in a high-rate metro", ok: false } ] },
      ],
      best: 1,
      verdict: { coverage: "Full coverage (liability + collision + comprehensive) + UM/UIM", deductible: "$500",
        liability: "100/300/100", addons: ["Comprehensive", "UM/UIM", "Anti-theft / secured-parking discount"],
        why: "Los Angeles is among California's most expensive areas, with real theft and crash exposure. Comprehensive matters; a garage or alarm and verified low mileage help offset the cost." },
    },
    {
      id: "teen", name: "New teen driver", tag: "16–18 · on the family policy", cost: 3,
      traits: ["Newly licensed", "Highest crash risk", "Eligible for good-student discount", "Gender can't raise the rate in CA"],
      options: [
        { name: "Standalone policy", price: "$7k+ /yr", items: [
          { t: "Independent", ok: true }, { t: "Very expensive alone", ok: false }, { t: "Misses family multi-car discount", ok: false } ] },
        { name: "On parents + discounts", price: "Best value", items: [
          { t: "Far cheaper than standalone", ok: true }, { t: "Good-student discount", ok: true }, { t: "Driver-training credit", ok: true }, { t: "Full coverage", ok: true } ] },
        { name: "Minimum only", price: "Exposed", items: [
          { t: "Lower premium", ok: true }, { t: "Family assets exposed if at fault", ok: false } ] },
      ],
      best: 1,
      verdict: { coverage: "Add the teen to a parent's policy with full coverage", deductible: "$500",
        liability: "100/300/100 to protect family assets", addons: ["Good-student discount", "Driver-training course", "Assign teen to the cheapest car"],
        why: "A standalone teen policy is far costlier than being added to the family policy. Because California bans gender as a factor, young men in particular fare better here than in most states. The 20% Good Driver Discount arrives after three clean years." },
    },
    {
      id: "financed", name: "New or financed car", tag: "Loan or lease · depreciates fast", cost: 2,
      traits: ["Has a loan or lease", "Lender requires coverage", "Car loses value quickly", "Wants it protected"],
      options: [
        { name: "Liability only", price: "Not allowed", items: [
          { t: "Cheapest", ok: true }, { t: "Lender won't permit it", ok: false }, { t: "You'd owe on a wreck", ok: false } ] },
        { name: "Full + GAP", price: "Best fit", items: [
          { t: "Collision + comprehensive", ok: true }, { t: "GAP covers the loan gap", ok: true }, { t: "$500 deductible", ok: true } ] },
        { name: "Full, high deductible", price: "Risky early", items: [
          { t: "Lower premium", ok: true }, { t: "High out-of-pocket on a costly repair", ok: false } ] },
      ],
      best: 1,
      verdict: { coverage: "Full coverage (required by the lender)", deductible: "$500",
        liability: "100/300/100", addons: ["GAP insurance", "New-car replacement if offered"],
        why: "Lenders require full coverage, and a new car can be worth less than you owe early on — GAP bridges that. The state minimum 30/60/15 is too thin for a driver with assets and a loan." },
    },
    {
      id: "budget", name: "Tight budget, older car", tag: "Cheap car · keep it legal & cheap", cost: 1,
      traits: ["Car worth under ~$4k", "Owns it outright", "Tight monthly budget", "Could absorb losing the car"],
      options: [
        { name: "Liability + high deductible", price: "Best value", items: [
          { t: "Lowest legal premium", ok: true }, { t: "Self-insures a low-value car", ok: true }, { t: "Keep UM if you can", ok: true } ] },
        { name: "Balanced full coverage", price: "Wasteful here", items: [
          { t: "Collision + comprehensive", ok: true }, { t: "Cost can exceed the car's value", ok: false } ] },
        { name: "Check CLCA eligibility", price: "May be lowest", items: [
          { t: "State Low-Cost Auto program", ok: true }, { t: "Income & vehicle-value limits apply", ok: false } ] },
      ],
      best: 0,
      verdict: { coverage: "Liability only — drop collision & comprehensive", deductible: "High ($1,000+), or self-insure the car",
        liability: "At least 30/60/15; step up if you have assets", addons: ["UM/UIM if affordable", "Check the California Low Cost Auto (CLCA) program"],
        why: "On a sub-$4k car, paying for collision/comp rarely pays off. Keep liability legal, add cheap UM, and if your income qualifies, the state CLCA program may beat any standard quote." },
    },
    {
      id: "clca", name: "Income-eligible driver", tag: "Good record · lower income · car ≤ $25k", cost: 1,
      traits: ["Household income within program limits", "Valid California license, 16+", "Good driving record", "Vehicle valued ≤ $25,000"],
      options: [
        { name: "Standard minimum policy", price: "Market rate", items: [
          { t: "Widely available", ok: true }, { t: "Often pricier than CLCA", ok: false } ] },
        { name: "California Low Cost Auto (CLCA)", price: "~$300–500/yr typical", items: [
          { t: "State-backed liability", ok: true }, { t: "Satisfies CA financial-responsibility law", ok: true }, { t: "Add-on UM & MedPay available", ok: true } ] },
        { name: "Go uninsured", price: "Never", items: [
          { t: "No cost", ok: true }, { t: "Illegal; fines + impound", ok: false } ] },
      ],
      best: 1,
      verdict: { coverage: "California Low Cost Automobile (CLCA) liability policy", deductible: "N/A (liability program)",
        liability: "Program limits (lower than standard, but legally compliant)", addons: ["Optional UM/UIM", "Optional MedPay"],
        why: "CLCA (mylowcostauto.com) is a state program for income-eligible good drivers. Typical premiums run a few hundred dollars a year — often the cheapest legal option for those who qualify." },
    },
  ],

  /* Build-your-own (California-tuned) */
  builder: {
    fields: [
      { id: "record", label: "Driving record", options: [
        { v: "clean", t: "Clean (3+ yrs)" }, { v: "one", t: "One incident" }, { v: "multi", t: "Multiple incidents" } ] },
      { id: "miles", label: "Annual mileage", options: [
        { v: "low", t: "Low (under 7,500)" }, { v: "avg", t: "Average (7,500–12k)" }, { v: "high", t: "High (12k+)" } ] },
      { id: "exp", label: "Experience", options: [
        { v: "new", t: "New (under 3 yrs)" }, { v: "some", t: "Some (3–10 yrs)" }, { v: "vet", t: "Experienced (10+ yrs)" } ] },
      { id: "value", label: "Your car", options: [
        { v: "beater", t: "Older, under ~$4k (owned)" }, { v: "mid", t: "Mid-value (owned)" }, { v: "financed", t: "New / financed / leased" } ] },
      { id: "area", label: "Where you drive", options: [
        { v: "la", t: "Dense city (e.g. LA)" }, { v: "suburb", t: "Suburban" }, { v: "rural", t: "Rural" } ] },
    ],
  },

  /* ---- 5-year premium trend chart ---- */
  trendIntro: "Average annual full-coverage premium in California over the past five years. Toggle a profile to see how a driver, vehicle, or violation changes the trajectory. Tap the legend chips to compare.",
  trend: {
    years: [2022, 2023, 2024, 2025, 2026],
    // Base = CA statewide average full-coverage premium ($/yr). Other series are
    // that base scaled by typical California multipliers (illustrative, sourced
    // from 2026 CA averages — real rates vary by insurer, ZIP, and history).
    base: [1900, 2120, 2417, 2540, 2719],
    series: [
      { id: "avg",     label: "CA average",            mult: 1.00, color: "#0f2747", on: true,  note: "Statewide full-coverage average. Up about 43% since 2022 — repair costs, theft, wildfire losses, and the 2025 30/60/15 minimums." },
      { id: "teen",    label: "Teen / new driver",     mult: 2.65, color: "#e0792b", on: true,  note: "16–19 year-olds pay roughly 2.5–3× the average. Staying on a family policy and the good-student discount cut this sharply." },
      { id: "dui",     label: "After a DUI",           mult: 2.30, color: "#b4434a", on: false, note: "A DUI raises a California premium by roughly 125–175%. It stays on your record 10 years, though rates ease after 3–5." },
      { id: "points",  label: "Speeding ticket / 1 point", mult: 1.36, color: "#c98a1b", on: false, note: "One speeding ticket (1 point) adds about 25–44% for ~3 years in California." },
      { id: "luxury",  label: "Luxury / high-value car", mult: 1.55, color: "#7c3aed", on: false, note: "Pricier parts, higher repair and theft costs, and (for EVs) costly battery repair push luxury-vehicle premiums well above average." },
      { id: "safety",  label: "Strong safety features", mult: 0.88, color: "#1f7a4d", on: true,  note: "Automatic braking, blind-spot and lane-keep assist, and good crash-test ratings can earn discounts that pull the premium below average." },
      { id: "good",    label: "Good Driver (clean 3+ yrs)", mult: 0.80, color: "#1f5fbf", on: false, note: "California's mandated Good Driver Discount is at least 20% off — the green-zone everyone should aim for." },
    ],
    source: "Illustrative California estimates built from 2026 averages (Bankrate, MoneyGeek, Insurify, The Zebra) and typical CA multipliers. Not quotes.",
  },

  /* ---- Get the best rate (secrets & what to avoid) ---- */
  bestrateIntro: "How to get the lowest legitimate rate in California — built around the way Prop 103 actually prices policies. These are the moves that move the needle, plus the traps that quietly cost you.",
  bestrateDo: [
    { h: "Compare at least 3–5 real quotes", t: "California rates for identical coverage can differ by well over 100% between insurers. Comparison shopping is the single biggest lever — re-quote every 1–2 years and after any life change." },
    { h: "Always claim the Good Driver Discount", t: "Prop 103 guarantees ≥20% off for ~3 years' clean driving (no more than one point). It's the law — make sure every quote applies it." },
    { h: "Report your true (low) mileage", t: "Miles driven is the #2 mandatory factor in California. If you drive less than you used to — remote work, a short commute — update it. Verified-mileage and telematics programs can cut more." },
    { h: "Raise your deductible to 'oops' money", t: "Going from $250 to $1,000 can drop collision/comp 15–30%. Pick the highest deductible you could comfortably pay tomorrow and pocket the savings." },
    { h: "Right-size coverage to the car", t: "On a paid-off car worth under ~$4k, dropping collision/comprehensive often beats paying for them (the 10% rule). Keep strong liability + UM regardless." },
    { h: "Stack every discount you qualify for", t: "Bundle auto with renters/home, multi-car, good-student (B average), driver-training, paperless/auto-pay, and defensive-driving course credits. Ask explicitly — they aren't always automatic." },
    { h: "Keep continuous coverage", t: "Even one lapse raises your rate and can suspend your registration. If you sell a car, keep a non-owner policy or transfer coverage rather than going bare." },
    { h: "Pay in full and go paperless", t: "Many California insurers offer a paid-in-full discount and small e-billing credits. If you pay monthly, compare the installment fees." },
  ],
  bestrateAvoid: [
    { h: "Auto-renewing for years", t: "'Loyalty' often means price creep. Insurers bank on inertia — the renewal quote is rarely your best quote." },
    { h: "Buying only the state minimum by default", t: "30/60/15 is cheap but thin; one serious injury blows past it and you pay the rest. Don't confuse 'cheapest premium' with 'best value'." },
    { h: "Waiving uninsured-motorist coverage", t: "California lets you reject UM/UIM in writing. Don't — roughly 1 in 6 California drivers is uninsured, and UM is inexpensive." },
    { h: "Letting a small claim raise your rate", t: "Filing a claim that's barely above your deductible can cost you more in surcharges than it pays. For minor damage, get an estimate first." },
    { h: "Guessing your mileage too high", t: "Overstating annual miles inflates your premium under California's rules. Use your real odometer trend." },
    { h: "Ignoring the car you buy", t: "Insurance cost varies hugely by model (repair cost, theft rates, EV battery repair). Get a quote before you buy the car, not after." },
  ],
  bestrateNote: "What you can't be charged for in California: your credit score and your gender — both are banned. Be skeptical of any 'tip' or quote that leans on those.",

  /* ---- 7 common myths ---- */
  mythsIntro: "Misconceptions cost California drivers real money. Here are seven of the most common — and the truth, with the California angle.",
  myths: [
    { myth: "Red cars cost more to insure.", truth: "Color is not a rating factor anywhere — and California can't even use it. Insurers rate on make, model, trim, engine, repair cost, and theft rates, never paint color." },
    { myth: "My credit score affects my California rate.", truth: "Not here. California is one of a handful of states (with MA, HI, MI) that bans credit-based insurance scores for auto. Your credit can't legally raise your premium." },
    { myth: "Men always pay more than women (or vice-versa).", truth: "California banned gender as an auto rating factor in 2019. Two otherwise-identical drivers can't be priced differently on gender here." },
    { myth: "The state minimum means I'm fully protected.", truth: "30/60/15 is the legal floor, not real protection. A single ER visit or a totaled newer car can exceed it — and you personally owe the rest." },
    { myth: "Older / low-value cars don't need any coverage.", truth: "You still must carry liability to drive legally in California, even on a $500 beater. You can drop collision/comp on it — but never liability." },
    { myth: "My insurer automatically gives me every discount.", truth: "Often not. The Good Driver Discount is mandated, but good-student, mileage, bundling, and course credits frequently require you to ask and provide proof." },
    { myth: "One ticket or claim ruins my rate forever.", truth: "Surcharges fade over time, and a clean ~3-year record restores the Good Driver Discount. Shopping around after an incident usually finds a better-priced insurer." },
  ],

  /* ---- After an accident (step-by-step) ---- */
  accidentIntro: "If you're in a crash in California, what you do in the first minutes and days matters — for safety, for the law, and for your claim. Here's exactly what to do.",
  accidentSteps: [
    { n: "1", h: "Stop and stay safe", t: "Never leave the scene — leaving an injury crash is a felony in California. If the cars are drivable and it's safe, move them out of traffic and turn on hazards. Check everyone for injuries." },
    { n: "2", h: "Call 911 if anyone's hurt or roads are blocked", t: "Get medical help and police on scene for any injury, death, or major damage. A police report is invaluable for your claim even when officers don't always respond to minor fender-benders." },
    { n: "3", h: "Exchange information", t: "Get the other driver's name, phone, address, driver's license number, license plate, and insurance company + policy number. Note the car's make/model/color." },
    { n: "4", h: "Document everything", t: "Photograph all vehicles, damage, positions, skid marks, street signs, and the overall scene. Get names and numbers of any witnesses. Write down the time, location, and what happened while it's fresh." },
    { n: "5", h: "Don't admit fault or over-share", t: "Be polite but don't say 'it was my fault' or speculate — fault is for the insurers and, in California's at-fault system, can be shared. Stick to facts when speaking with the other driver or police." },
    { n: "6", h: "Report it to your insurer promptly", t: "Call your own insurer (or use its app) as soon as you safely can, even if you weren't at fault. Prompt notice is usually required by your policy. Give facts; let them handle liability." },
    { n: "7", h: "Get medical attention — and keep records", t: "See a doctor even if you feel fine; some injuries surface later. Keep all bills and records. In California, MedPay (if you bought it) helps regardless of fault, since the state has no PIP." },
    { n: "8", h: "Know the California reporting rules", t: "You must file form SR-1 with the DMV within 10 days if anyone is injured/killed or property damage exceeds $1,000 (nearly every crash). This is separate from any police or insurance report." },
  ],
  accidentKit: ["Insurance card (in the glovebox + a photo on your phone)", "Driver's license & registration", "Phone for photos and calls", "Pen & paper or a notes app", "Emergency contacts", "Roadside/tow number"],
  accidentAvoid: [
    "Don't leave the scene — it can turn a fender-bender into a crime.",
    "Don't admit fault or apologize in a way that assigns blame.",
    "Don't accept cash to 'skip insurance' — hidden injuries and damage can cost you later.",
    "Don't sign anything from the other driver or a non-police party at the scene.",
    "Don't forget the SR-1 — the DMV deadline is 10 days and missing it can suspend your license.",
  ],

  /* ---- Help & resources ---- */
  resourcesIntro: "Official California programs and help. These are the places to verify requirements, find low-cost options, and get assistance.",
  resources: [
    { name: "California Department of Insurance", what: "Regulator under Prop 103. Compare rates, check a company or agent's license, and file a complaint. Consumer hotline 1-800-927-4357.", url: "https://www.insurance.ca.gov/01-consumers/105-type/95-guides/01-auto/", link: "insurance.ca.gov" },
    { name: "California Low Cost Auto (CLCA)", what: "State program providing affordable liability insurance to income-eligible good drivers with a vehicle valued at $25,000 or less.", url: "https://www.mylowcostauto.com/", link: "mylowcostauto.com" },
    { name: "Good Driver Discount", what: "Prop 103 guarantees at least 20% off for drivers with ~3 years' experience and a clean record. Ask every insurer if you qualify.", url: "https://www.insurance.ca.gov/01-consumers/105-type/95-guides/01-auto/prop103.cfm", link: "Prop 103 guide" },
    { name: "California DMV — insurance requirements", what: "Proof-of-insurance rules, electronic reporting, and what happens to your registration if coverage lapses.", url: "https://www.dmv.ca.gov/portal/vehicle-registration/insurance-requirements/", link: "dmv.ca.gov" },
    { name: "Consumer Watchdog", what: "The nonprofit behind Prop 103. Tracks rate filings and challenges increases on behalf of California drivers.", url: "https://consumerwatchdog.org/insurance/proposition-103/", link: "consumerwatchdog.org" },
  ],
};
