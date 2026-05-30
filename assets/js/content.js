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
    { id: "essentials", n: 1, label: "California essentials",  type: "essentials" },
    { id: "situations", n: 2, label: "Real situations",        type: "situations" },
    { id: "rate",       n: 3, label: "What sets your rate",    type: "factors" },
    { id: "coverages",  n: 4, label: "Coverages & terms",      type: "terms" },
    { id: "choices",    n: 5, label: "Smart coverage choices", type: "choices" },
    { id: "profiles",   n: 6, label: "Find your fit",          type: "profiles" },
    { id: "resources",  n: 7, label: "Help & resources",       type: "resources" },
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

  /* ---- 7. Help & resources ---- */
  resourcesIntro: "Official California programs and help. These are the places to verify requirements, find low-cost options, and get assistance.",
  resources: [
    { name: "California Department of Insurance", what: "Regulator under Prop 103. Compare rates, check a company or agent's license, and file a complaint. Consumer hotline 1-800-927-4357.", url: "https://www.insurance.ca.gov/01-consumers/105-type/95-guides/01-auto/", link: "insurance.ca.gov" },
    { name: "California Low Cost Auto (CLCA)", what: "State program providing affordable liability insurance to income-eligible good drivers with a vehicle valued at $25,000 or less.", url: "https://www.mylowcostauto.com/", link: "mylowcostauto.com" },
    { name: "Good Driver Discount", what: "Prop 103 guarantees at least 20% off for drivers with ~3 years' experience and a clean record. Ask every insurer if you qualify.", url: "https://www.insurance.ca.gov/01-consumers/105-type/95-guides/01-auto/prop103.cfm", link: "Prop 103 guide" },
    { name: "California DMV — insurance requirements", what: "Proof-of-insurance rules, electronic reporting, and what happens to your registration if coverage lapses.", url: "https://www.dmv.ca.gov/portal/vehicle-registration/insurance-requirements/", link: "dmv.ca.gov" },
    { name: "Consumer Watchdog", what: "The nonprofit behind Prop 103. Tracks rate filings and challenges increases on behalf of California drivers.", url: "https://consumerwatchdog.org/insurance/proposition-103/", link: "consumerwatchdog.org" },
  ],
};
