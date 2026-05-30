/* ============================================================
   Coverage Quest — content
   All educational copy, data, profiles, and quiz live here so
   the rest of the app stays render-only. Figures are 2026 U.S.
   averages and are illustrative — they vary by person & state.
   ============================================================ */

const CONTENT = {

  /* ---- The 7 trail stops (each maps to a badge) ---- */
  sections: [
    { id: "start",     n: 1, emoji: "🚦", label: "Start Here",            type: "intro",
      badge: { id: "first-steps",  name: "First Steps",        medal: "🚦", desc: "Began the journey" } },
    { id: "stories",   n: 2, emoji: "📖", label: "Real Stories",          type: "stories",
      badge: { id: "storyteller",  name: "Storyteller",        medal: "📖", desc: "Learned from real drivers" } },
    { id: "rate",      n: 3, emoji: "🔍", label: "What Sets Your Rate",   type: "factors",
      badge: { id: "rate-detective", name: "Rate Detective",   medal: "🔍", desc: "Cracked the pricing code" } },
    { id: "terms",     n: 4, emoji: "📘", label: "Key Terms",             type: "terms",
      badge: { id: "word-wizard",  name: "Word Wizard",        medal: "📘", desc: "Decoded the jargon" } },
    { id: "tradeoffs", n: 5, emoji: "⚖️", label: "Coverage Trade-offs",   type: "tradeoffs",
      badge: { id: "tradeoff-master", name: "Trade-off Master", medal: "⚖️", desc: "Balanced cost vs. risk" } },
    { id: "profile",   n: 6, emoji: "🎯", label: "Find Your Profile",     type: "profiles",
      badge: { id: "profile-pro",  name: "Profile Pro",        medal: "🎯", desc: "Found ideal coverage" } },
    { id: "quiz",      n: 7, emoji: "🎓", label: "Final Quiz",            type: "quiz",
      badge: { id: "graduate",     name: "Insurance Graduate", medal: "🎓", desc: "Passed the final quiz" } },
  ],

  /* ---- Section 1: Start Here ---- */
  intro: {
    kicker: "Stop 1 · Welcome",
    title: "Why this matters (more than you'd think)",
    lead: "Car insurance is the one purchase almost every driver makes but almost nobody understands. Learn it once, and you'll save money for the rest of your life.",
    html: `
      <h3>Three reasons to care</h3>
      <ul>
        <li><strong>It's the law.</strong> Nearly every U.S. state requires at least basic liability coverage to drive legally.</li>
        <li><strong>It protects your money.</strong> One serious crash can cost tens of thousands. Insurance stands between an accident and your savings.</li>
        <li><strong>New drivers overpay the most.</strong> Teens average around <strong>$5,700 a year</strong>, and the gap between the cheapest and priciest company can top <strong>$7,000</strong>. Knowing the rules is real money.</li>
      </ul>
      <h3>How the trail works</h3>
      <ul>
        <li>🧭 <strong>Seven stops.</strong> Stories → the numbers → the lingo → the trade-offs → your custom plan → a final quiz.</li>
        <li>🏅 <strong>Finish a stop, earn a badge.</strong> Your progress saves automatically on this device.</li>
        <li>📰 <strong>Fresh news at the bottom</strong>, refreshed automatically every day.</li>
      </ul>`,
    callout: { kind: "tip", icon: "💡", text: "No sign-up, no tracking, no sales pitch. This is a free study guide — not a quote engine. Tap “Complete” at the bottom of each stop to bank your badge." },
  },

  /* ---- Section 2: Real Stories ---- */
  storiesIntro: "Five short, true-to-life situations that teens and new drivers actually hit. Each one shows which coverage did the heavy lifting.",
  stories: [
    { who: "Maya, 17", tag: "New driver · at-fault", emoji: "🚗",
      body: "Maya backed into a parked SUV at the mall — an $1,800 dent. Her family's liability and collision fixed both cars; she paid her $500 deductible. At renewal, her premium ticked up.",
      lesson: "A deductible is what you pay first — and an at-fault claim can raise your future rate too." },
    { who: "Jordan, 19", tag: "Hit-and-run · UM saved him", emoji: "🛑",
      body: "A driver blew a red light into Jordan's car and sped off — no plate, no insurance to chase. His Uninsured/Underinsured Motorist coverage, about $60 a year, paid his medical bills and repairs.",
      lesson: "UM/UIM is cheap and rescues you when the other driver can't — or won't — pay." },
    { who: "Sam, 16", tag: "Teen · stacking discounts", emoji: "🎓",
      body: "Sam kept a 3.5 GPA and finished a defensive-driving course. Combined with staying on his parents' policy, the good-student and course discounts cut hundreds off the family's bill.",
      lesson: "Good grades + a driving course + a parent's policy = serious savings." },
    { who: "Priya, 22", tag: "City · comprehensive", emoji: "🏙️",
      body: "Someone smashed Priya's window overnight on a city street and grabbed her bag. Comprehensive coverage paid for the glass minus her $500 deductible — but she learned her downtown ZIP also raised her base rate.",
      lesson: "Comprehensive covers theft & vandalism — and dense city ZIP codes cost more to insure." },
    { who: "Tyler, 18", tag: "New car · cautionary tale", emoji: "💸",
      body: "To save a few bucks, Tyler dropped collision on his financed car. Three months later he totaled it — and still owed $9,000 to the bank with zero payout.",
      lesson: "Finance a car and you need full coverage — and often GAP insurance on top." },
  ],

  /* ---- Section 3: What Sets Your Rate ---- */
  rateIntro: "Insurers weigh a dozen-plus factors to predict risk. Some you can't change (your age today); many you can (your car, deductible, even your credit). Here's what moves the needle most.",
  rateStats: [
    { num: "~$2,200", lbl: "Avg. full-coverage / yr (2026)" },
    { num: "~$5,700", lbl: "Avg. for a teen driver / yr" },
    { num: "2.5×", lbl: "Rate gap between ZIP codes" },
    { num: "7", lbl: "States banning gender in pricing" },
  ],
  factors: [
    { icon: "🎂", name: "Age & experience", impact: "high",
      desc: "The #1 driver of teen rates. Crash risk falls fast with experience — rates drop notably at 20, then around 25." },
    { icon: "📋", name: "Driving record", impact: "high",
      desc: "Tickets, at-fault crashes, and DUIs raise rates for years. A clean record is the best discount there is." },
    { icon: "📍", name: "Location / ZIP code", impact: "high",
      desc: "Theft, vandalism, weather, traffic density, and repair costs are local. Two ZIPs can differ by 2.5×. (Banned in CA & MI.)" },
    { icon: "💳", name: "Credit-based insurance score", impact: "high",
      desc: "In most states, weaker credit can nearly double full-coverage rates. Banned in California, Hawaii, Massachusetts & Michigan." },
    { icon: "🚙", name: "Vehicle make & model", impact: "med",
      desc: "Sports cars, high-horsepower, and pricey-to-repair models cost more. Safe, common, cheap-to-fix cars cost less." },
    { icon: "🛡️", name: "Coverage & deductible choices", impact: "med",
      desc: "More coverage and lower deductibles raise the premium. This is the lever you control most directly." },
    { icon: "🛣️", name: "Annual mileage & usage", impact: "med",
      desc: "Fewer miles = less exposure = lower rates. Low-mileage and telematics (usage-based) programs reward light, safe driving." },
    { icon: "🧾", name: "Coverage history & profile", impact: "low",
      desc: "Continuous coverage, marital status, and (in most states) gender can nudge rates. Gender is banned in 7 states." },
  ],

  /* ---- Section 4: Key Terms ---- */
  termsIntro: "The whole policy comes down to about a dozen words. Tap each card to flip it open. The amber note is the trade-off to remember.",
  terms: [
    { emoji: "💵", term: "Premium", def: "The price you pay for the policy — monthly, every 6 months, or yearly.",
      tradeoff: "A lower premium usually means less coverage or a higher deductible. Cheapest isn't always smartest." },
    { emoji: "🧾", term: "Deductible", def: "What you pay out of pocket on a claim before insurance kicks in (e.g., $500).",
      tradeoff: "Higher deductible → lower premium, but more cash from you after a crash. Pick one you could actually pay tomorrow." },
    { emoji: "🛡️", term: "Liability (BI & PD)", def: "Pays for injuries (Bodily Injury) and property damage (Property Damage) you cause to others. Required almost everywhere.",
      tradeoff: "State minimums are cheap but thin. If you have any assets, higher limits (like 100/300/100) protect you from a lawsuit." },
    { emoji: "💥", term: "Collision", def: "Repairs or replaces YOUR car after a crash — no matter who's at fault.",
      tradeoff: "Worth it on a valuable or financed car; often not worth it on an old beater." },
    { emoji: "🌧️", term: "Comprehensive", def: "Covers your car for non-crash events: theft, vandalism, fire, hail, flood, falling trees, animal strikes.",
      tradeoff: "Matters most in cities (theft) and storm-prone areas. Drop it when the car's value gets low." },
    { emoji: "👻", term: "Uninsured / Underinsured Motorist (UM/UIM)", def: "Pays YOUR bills when an at-fault driver has no insurance or not enough — including hit-and-runs.",
      tradeoff: "About 1 in 7 drivers is uninsured. UM is cheap (~$50–75/yr) and usually well worth it." },
    { emoji: "🏥", term: "MedPay / PIP", def: "Medical Payments or Personal Injury Protection covers medical bills (and PIP, lost wages) for you & passengers, regardless of fault.",
      tradeoff: "PIP is required in 'no-fault' states. If you have strong health insurance, you may need less MedPay." },
    { emoji: "🪙", term: "GAP insurance", def: "If a financed/leased car is totaled, GAP pays the difference between what you owe and the car's depreciated value.",
      tradeoff: "Vital for new cars that drop in value fast. Pointless once you owe less than the car is worth." },
    { emoji: "📐", term: "Policy limits (e.g. 100/300/100)", def: "The max the insurer pays: $100k per person / $300k per accident for injuries / $100k for property.",
      tradeoff: "Higher limits cost a little more but prevent a catastrophic out-of-pocket hit after a serious crash." },
    { emoji: "🧰", term: "Full coverage", def: "Not an official product — shorthand for liability + collision + comprehensive together.",
      tradeoff: "Required by lenders. Optional once you own the car — weigh it against the car's value." },
  ],

  /* ---- Section 5: Coverage Trade-offs ---- */
  tradeoffsIntro: "Insurance is one long balancing act: pay more now for peace of mind, or keep cash and carry more risk. Play with the deductible slider, then steal the rules of thumb.",
  deductibleTool: {
    // Illustrative comprehensive + collision annual premium by deductible.
    levels: [
      { d: 250,  premium: 1240 },
      { d: 500,  premium: 1080 },
      { d: 1000, premium: 880 },
      { d: 1500, premium: 780 },
      { d: 2000, premium: 720 },
    ],
    baselineIndex: 1, // compare savings against the $500 deductible
  },
  rules: [
    { icon: "🔟", text: "<strong>The 10% rule.</strong> If your yearly collision + comprehensive premium plus the deductible is more than ~10% of the car's value, drop them and self-insure the car." },
    { icon: "👻", text: "<strong>Almost always keep UM/UIM.</strong> It's cheap, and 1 in 7 drivers is uninsured. It protects <em>you</em>, not just your car." },
    { icon: "📐", text: "<strong>Buy liability limits you can't outgrow.</strong> If you own a home or have savings, state-minimum liability is risky — 100/300/100 is a common sweet spot." },
    { icon: "🧾", text: "<strong>Set the deductible at 'oops' money.</strong> Pick the highest deductible you could comfortably pay tomorrow; pocket the premium savings." },
    { icon: "🪙", text: "<strong>Finance or lease? Add GAP.</strong> New cars lose value fast — GAP covers the loan if it's totaled early." },
    { icon: "🛒", text: "<strong>Re-shop every 1–2 years.</strong> Loyalty rarely pays; the same coverage can vary by thousands between insurers." },
  ],
  umSpotlight: {
    title: "Spotlight: is Uninsured Motorist worth it?",
    yes: ["~1 in 7 drivers on the road is uninsured", "Covers hit-and-runs where you can't chase anyone", "Costs roughly $50–$75 a year", "The average crash hospital bill is huge vs. that price"],
    skip: ["You already have strong health insurance AND collision", "Your state bundles similar protection (check locally)"],
    verdict: "For most teens and new drivers: yes. It's one of the best dollar-for-dollar protections on the policy.",
  },

  /* ---- Section 6: Find Your Profile ---- */
  profilesIntro: "Pick the driver who's most like you. You'll see three coverage options side-by-side, the optimal pick highlighted, and the deductible to ask for. Then build your own at the bottom.",
  profiles: [
    {
      id: "veteran", emoji: "🧓", name: "The Thrifty Veteran", tag: "Experienced · rarely drives · old paid-off car",
      cost: 1,
      traits: ["15+ years driving", "Under ~6k miles/yr", "Owns an older car outright", "Clean record"],
      options: [
        { name: "State Minimum", price: "$ — cheapest", items: [
          { t: "Legal to drive", ok: true }, { t: "Covers damage you cause", ok: true },
          { t: "Nothing for your own car", ok: false }, { t: "No uninsured-driver protection", ok: false } ] },
        { name: "Liability+ & UM", price: "$ — best value", items: [
          { t: "Strong 100/300/100 liability", ok: true }, { t: "Uninsured/Underinsured Motorist", ok: true },
          { t: "Low-mileage discount", ok: true }, { t: "Self-insures the low-value car", ok: true } ] },
        { name: "Full Coverage", price: "$$ — overkill", items: [
          { t: "Collision + comprehensive added", ok: true }, { t: "Premium + deductible > car's worth", ok: false },
          { t: "Paying to protect a cheap car", ok: false } ] },
      ],
      best: 1,
      verdict: {
        coverage: "Liability (100/300/100) + UM/UIM — skip collision & comprehensive",
        deductible: "N/A for collision (dropped). Keep comp only if the car's still worth ~$4k+, then $1,000.",
        liability: "100/300/100",
        addons: ["UM/UIM", "Low-mileage / usage-based discount"],
        why: "A paid-off, low-value car rarely justifies collision/comp. Redirect the savings into solid liability + cheap UM so other drivers can't hurt your finances.",
      },
    },
    {
      id: "city", emoji: "🏙️", name: "The City Commuter", tag: "Lives downtown · street parking · newer car",
      cost: 3,
      traits: ["Dense urban ZIP", "Parks on the street", "Car is 0–6 years old", "Higher theft/vandalism risk"],
      options: [
        { name: "Liability Only", price: "$ — risky here", items: [
          { t: "Cheapest monthly", ok: true }, { t: "No theft/vandalism cover", ok: false },
          { t: "No payout if your car's hit", ok: false } ] },
        { name: "Full + UM", price: "$$$ — best fit", items: [
          { t: "Comprehensive (theft/vandalism)", ok: true }, { t: "Collision for fender-benders", ok: true },
          { t: "UM/UIM (more uninsured in cities)", ok: true }, { t: "Anti-theft / garage discount", ok: true } ] },
        { name: "Full + low deductible", price: "$$$ — pricey", items: [
          { t: "$250 deductible", ok: true }, { t: "Highest premium", ok: false },
          { t: "Small claims rarely worth filing", ok: false } ] },
      ],
      best: 1,
      verdict: {
        coverage: "Full coverage (liability + collision + comprehensive) + UM/UIM",
        deductible: "$500 — break-ins and fender-benders are likelier in the city, so keep claims affordable.",
        liability: "100/300/100 (more cars around = more risk)",
        addons: ["Comprehensive", "UM/UIM", "Anti-theft device / secured-parking discount"],
        why: "City ZIPs can cost up to 2.5× more from theft, vandalism, and crash frequency — so comprehensive is the star. A garage or alarm can claw back some cost.",
      },
    },
    {
      id: "teen", emoji: "🧑‍🎓", name: "The New Teen Driver", tag: "16–18 · learning · on the family plan",
      cost: 3,
      traits: ["16–18 years old", "Newly licensed", "Highest crash-risk group", "Eligible for student discounts"],
      options: [
        { name: "Standalone policy", price: "$$$ — ~$10k/yr", items: [
          { t: "Full independence", ok: true }, { t: "Hugely expensive alone", ok: false },
          { t: "Misses family multi-car discounts", ok: false } ] },
        { name: "On parents + discounts", price: "$$$ — best value", items: [
          { t: "~$7k/yr cheaper than standalone", ok: true }, { t: "Good-student discount (3.0 GPA)", ok: true },
          { t: "Defensive-driving & telematics", ok: true }, { t: "Full coverage to stay protected", ok: true } ] },
        { name: "Minimum only", price: "$$ — exposed", items: [
          { t: "Lower premium", ok: true }, { t: "Family assets exposed if at-fault", ok: false },
          { t: "No help fixing the teen's car", ok: false } ] },
      ],
      best: 1,
      verdict: {
        coverage: "Add the teen to a parent's policy with full coverage",
        deductible: "$500 — new drivers crash more, so keep out-of-pocket reachable.",
        liability: "100/300/100 to protect family assets",
        addons: ["Good-student discount", "Defensive-driving course", "Telematics / safe-driver app", "Assign teen to the cheapest car"],
        why: "Staying on a parent's policy saves roughly $7,000/yr vs. standalone. Stack good-student + course + telematics (each 5–25%). Don't skimp on liability — new drivers are the highest risk.",
      },
    },
    {
      id: "newcar", emoji: "🚙", name: "The New-Car Owner", tag: "Financed or leased · brand-new ride",
      cost: 2,
      traits: ["Has a loan or lease", "Car loses value fast", "Lender requires coverage", "Wants it protected"],
      options: [
        { name: "Liability Only", price: "$ — not allowed", items: [
          { t: "Cheapest", ok: true }, { t: "Lender won't permit it", ok: false },
          { t: "You'd owe on a totaled car", ok: false } ] },
        { name: "Full + GAP", price: "$$ — best fit", items: [
          { t: "Collision + comprehensive", ok: true }, { t: "GAP covers the loan gap", ok: true },
          { t: "$500 deductible", ok: true }, { t: "New-car replacement (if offered)", ok: true } ] },
        { name: "Full, high deductible", price: "$$ — risky", items: [
          { t: "Slightly lower premium", ok: true }, { t: "$1,500+ out of pocket on a pricey repair", ok: false } ] },
      ],
      best: 1,
      verdict: {
        coverage: "Full coverage (lenders require collision + comprehensive)",
        deductible: "$500 — a new car is costly to repair, so keep out-of-pocket low.",
        liability: "100/300/100",
        addons: ["GAP insurance", "New-car replacement (if offered)"],
        why: "Lenders and leasing companies require full coverage, and a new car can be 'underwater' early — GAP bridges what you owe vs. the depreciated value if it's totaled.",
      },
    },
    {
      id: "beater", emoji: "🚜", name: "The Budget Beater", tag: "Cheap old car · tight budget",
      cost: 1,
      traits: ["Car worth under ~$4k", "Owns it outright", "Tight monthly budget", "Could absorb losing the car"],
      options: [
        { name: "Liability + high deductible", price: "$ — best value", items: [
          { t: "Lowest legal premium", ok: true }, { t: "Self-insures a low-value car", ok: true },
          { t: "Add cheap UM if you can", ok: true } ] },
        { name: "Balanced Full", price: "$$ — wasteful", items: [
          { t: "Collision + comprehensive", ok: true }, { t: "Costs may exceed the car's value", ok: false } ] },
        { name: "Full + low deductible", price: "$$ — worst value", items: [
          { t: "Maximum protection", ok: true }, { t: "Paying a lot to protect very little", ok: false } ] },
      ],
      best: 0,
      verdict: {
        coverage: "Liability only — drop collision & comprehensive",
        deductible: "High ($1,000+) on anything you keep; otherwise self-insure the car.",
        liability: "At least state minimum; step up to 50/100/50 if you have any assets.",
        addons: ["UM/UIM if you can squeeze it in — it's cheap and protects you, not the car"],
        why: "By the 10% rule, paying for collision/comp on a sub-$4k car usually isn't worth it. Keep liability legal and add cheap UM so an uninsured driver can't wipe you out.",
      },
    },
    {
      id: "commuter", emoji: "🛣️", name: "The High-Mileage Commuter", tag: "Long commute · newer car · good credit",
      cost: 2,
      traits: ["15k+ miles a year", "Lots of highway time", "Newer car", "Good credit & clean record"],
      options: [
        { name: "Minimum", price: "$ — too thin", items: [
          { t: "Cheapest", ok: true }, { t: "Heavy road exposure unprotected", ok: false } ] },
        { name: "Full + higher limits", price: "$$ — best fit", items: [
          { t: "Full coverage + UM/UIM", ok: true }, { t: "Higher liability limits", ok: true },
          { t: "Good-credit & clean-record discounts", ok: true }, { t: "Roadside assistance", ok: true } ] },
        { name: "Full + every add-on", price: "$$$ — diminishing", items: [
          { t: "Accident forgiveness, rental, etc.", ok: true }, { t: "Extras add up fast", ok: false } ] },
      ],
      best: 1,
      verdict: {
        coverage: "Full coverage + UM/UIM",
        deductible: "$500–$1,000 — balance a slightly higher deductible against your discounts.",
        liability: "100/300/100 or higher — more miles means more exposure.",
        addons: ["Accident forgiveness", "Roadside assistance", "Telematics only if your driving is genuinely safe"],
        why: "More time on the road = more crash exposure, so raise liability. Good credit and a clean record unlock the best rates; telematics can help, but lots of night or hard-braking miles may not pay off.",
      },
    },
  ],

  /* ---- Build-your-own (simple rules engine inputs) ---- */
  builder: {
    fields: [
      { id: "exp",   label: "Experience", options: [
        { v: "new", t: "New (under 3 yrs)" }, { v: "some", t: "Some (3–10 yrs)" }, { v: "vet", t: "Experienced (10+ yrs)" } ] },
      { id: "miles", label: "Yearly mileage", options: [
        { v: "low", t: "Low (under 6k)" }, { v: "avg", t: "Average (6–12k)" }, { v: "high", t: "High (12k+)" } ] },
      { id: "value", label: "Your car", options: [
        { v: "beater", t: "Beater (under $4k, owned)" }, { v: "mid", t: "Mid-value ($4k–$20k, owned)" }, { v: "financed", t: "New / financed / leased" } ] },
      { id: "park",  label: "Where you park", options: [
        { v: "city", t: "City street" }, { v: "suburb", t: "Suburb driveway" }, { v: "rural", t: "Rural / garage" } ] },
    ],
  },

  /* ---- Section 7: Final Quiz ---- */
  quizIntro: "Seven questions. Get 5 right to graduate and bank the 🎓 badge. You can retake it any time.",
  quizPass: 5,
  quiz: [
    { q: "What is a deductible?",
      opts: ["The monthly price of your policy", "What you pay out of pocket before insurance covers a claim", "A discount for good drivers", "The most insurance will ever pay"],
      a: 1, why: "A deductible is what you pay first on a claim. A higher one lowers your premium but costs more if you crash." },
    { q: "About how many drivers on the road are uninsured?",
      opts: ["1 in 50", "1 in 20", "1 in 7", "1 in 100"],
      a: 2, why: "Roughly 1 in 7 U.S. drivers is uninsured — exactly why UM/UIM coverage is so valuable." },
    { q: "Which usually saves a teen the MOST money?",
      opts: ["Buying their own standalone policy", "Staying on a parent's policy", "Skipping liability coverage", "Driving a new sports car"],
      a: 1, why: "Staying on a parent's policy saves about $7,000/yr versus a standalone teen policy." },
    { q: "Liability coverage pays for…",
      opts: ["Repairs to your own car", "Injuries & damage you cause to others", "Theft of your car", "Hail damage"],
      a: 1, why: "Liability covers other people when you're at fault. Your own car is collision; theft/hail is comprehensive." },
    { q: "You drive a paid-off car worth $2,500. What's usually smartest?",
      opts: ["Full coverage with a $250 deductible", "Drop collision/comp; keep good liability + UM", "Cancel insurance entirely", "Buy GAP insurance"],
      a: 1, why: "By the 10% rule, collision/comp isn't worth it on a low-value car. Keep liability legal and add cheap UM." },
    { q: "Which is NOT typically a rating factor in most states?",
      opts: ["Your ZIP code", "Your credit-based insurance score", "Your car's color", "Your driving record"],
      a: 2, why: "Car color is a myth — it doesn't affect your rate. ZIP, credit (most states), and record all do." },
    { q: "You finance a new car. Which add-on covers you if it's totaled while you still owe more than it's worth?",
      opts: ["Roadside assistance", "GAP insurance", "Rental reimbursement", "Uninsured motorist"],
      a: 1, why: "GAP insurance pays the difference between your loan balance and the car's depreciated value." },
  ],
};
