/* ============================================================
   California Car Insurance Guide — affiliate partner config
   ------------------------------------------------------------
   Monetization scaffolding. Quote-comparison CTAs render ONLY
   when at least one partner below has `enabled: true` AND a real
   `url`. Everything ships DISABLED with placeholder URLs so no
   broken or fake affiliate link ever goes live.

   TO ACTIVATE a partner once you've joined its program:
     1. Sign up (e.g. The Zebra, Insurify, NerdWallet, Bankrate
        partner/affiliate networks such as Impact, CJ, Partnerize).
     2. Paste your tracking URL into `url` (include your sub-id).
     3. Set `enabled: true`.
     4. Re-run the prerender build / redeploy.

   COMPLIANCE: insurance is a YMYL topic. Every CTA shows a visible
   "Advertisement — we may earn a commission" label, and the footer
   carries an affiliate disclosure. Keep both. Do not enable a
   partner whose program terms you have not accepted.
   ============================================================ */

const PARTNERS = [
  {
    id: "thezebra",
    name: "The Zebra",
    // Replace with your real affiliate/tracking URL, then set enabled: true.
    url: "https://www.thezebra.com/",
    blurb: "Compare real California quotes from 100+ insurers in minutes.",
    enabled: false,
  },
  {
    id: "insurify",
    name: "Insurify",
    url: "https://insurify.com/car-insurance/california/",
    blurb: "See personalized California rates side by side.",
    enabled: false,
  },
  {
    id: "nerdwallet",
    name: "NerdWallet",
    url: "https://www.nerdwallet.com/insurance/auto/cheap-car-insurance-california",
    blurb: "Independent California car-insurance comparisons and picks.",
    enabled: false,
  },
  {
    id: "bankrate",
    name: "Bankrate",
    url: "https://www.bankrate.com/insurance/car/california-car-insurance/",
    blurb: "California averages, top insurers, and ways to save.",
    enabled: false,
  },
];

/* Active partners = enabled AND a non-placeholder URL. */
function activePartners() {
  return PARTNERS.filter((p) => p.enabled && typeof p.url === "string" && /^https?:\/\//.test(p.url));
}

/* Browser global + Node export (same pattern as content.js). */
if (typeof window !== "undefined") {
  window.PARTNERS = PARTNERS;
  window.activePartners = activePartners;
}
if (typeof module !== "undefined" && module.exports) module.exports = { PARTNERS, activePartners };
