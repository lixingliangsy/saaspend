import type { KbEntry } from "../support-kit/types";
export type { KbEntry };

export const KB: KbEntry[] = [
  {
    id: "what",
    title: "What SaaSpend does",
    keywords: ["SaaSpend", "saaspend", "what", "product", "about", "Find and cut redundant SaaS subscriptions your team forgot."],
    body: "Find and cut redundant SaaS subscriptions your team forgot.. SaaSpend finds redundant SaaS subscriptions from an inventory paste — category overlaps and cut/keep recommendations for ops and finance partners who want fewer forgotten tools.",
    source: "SaaSpend product definition",
    tags: [],
  },
  {
    id: "features",
    title: "SaaSpend features",
    keywords: ["features", "feature", "can", "does", "Deterministic duplicate-category checklist", "Duplicate detection", "Forgotten-tool flags", "Savings estimate", "Approvals (Team)"],
    body: "SaaSpend includes: Deterministic duplicate-category checklist; Duplicate detection; Forgotten-tool flags; Savings estimate; Approvals (Team). It does not add capabilities that are not listed here.",
    source: "SaaSpend feature list",
    tags: [],
  },
  {
    id: "pricing",
    title: "SaaSpend pricing",
    keywords: ["price", "pricing", "plan", "cost", "billing", "subscription", "monthly", "yearly"],
    body: "Listed prices for SaaSpend: $19/month and $190/year. Checkout uses the in-app checkout route. This assistant cannot change a subscription or issue a refund.",
    source: "SaaSpend pricing fields",
    tags: [],
  },
  {
    id: "howto",
    title: "How to use SaaSpend",
    keywords: ["how", "start", "use", "tool", "run", "Audit my SaaS"],
    body: "Open SaaSpend and use Audit my SaaS. The form asks for: Your SaaS (one per line: Name, monthly USD); Team size.",
    source: "SaaSpend tool fields",
    tags: [],
  },
  {
    id: "faq-1",
    title: "What is SaaSpend?",
    keywords: ["What", "is", "SaaSpend?"],
    body: "SaaSpend analyzes a SaaS inventory for overlaps and likely waste.",
    source: "SaaSpend FAQ",
    tags: [],
  },
  {
    id: "faq-2",
    title: "What do I paste in?",
    keywords: ["What", "do", "I", "paste", "in?"],
    body: "A list of tools (and optional team size / notes).",
    source: "SaaSpend FAQ",
    tags: [],
  },
  {
    id: "faq-3",
    title: "Who should use it?",
    keywords: ["Who", "should", "use", "it?"],
    body: "Ops, IT, and finance partners cleaning software sprawl.",
    source: "SaaSpend FAQ",
    tags: [],
  },
  {
    id: "honesty",
    title: "What this assistant will not claim",
    keywords: ["legal", "advice", "guarantee", "demo", "human", "refund", "support"],
    body: "Answers about SaaSpend are decision support only, not legal, tax, accessibility-certification, or compliance sign-off. This assistant does not invent integrations, SSO, CSV export, or Slack connections unless they are already in the product description. If live AI is unavailable, the product must not pretend a demo result is live. Say you want a human and leave an email if you need a person.",
    source: "SaaSpend support policy",
    tags: ["compliance"],
  },
];

function normalize(s: string): string {
  return (s || "").toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, " ");
}
function toWords(s: string): string[] {
  return normalize(s).split(/\s+/).map((w) => w.trim()).filter(Boolean);
}
function cjkBigrams(s: string): string[] {
  const grams: string[] = [];
  const han = /[\u4e00-\u9fff]/;
  for (const w of toWords(s)) {
    if (han.test(w) && w.length >= 2) {
      for (let i = 0; i < w.length - 1; i++) grams.push(w.slice(i, i + 2));
    }
  }
  return grams;
}
function scoreEntry(entry: KbEntry, query: string): number {
  const q = normalize(query);
  const qWords = new Set(toWords(q));
  const qGrams = new Set(cjkBigrams(q));
  let s = 0;
  for (const kw of entry.keywords) {
    const k = kw.toLowerCase();
    if (q.includes(k)) s += 3;
  }
  for (const tw of toWords(entry.title)) {
    if (qWords.has(tw)) s += 2;
  }
  const idx = normalize(entry.keywords.join(" ") + " " + entry.title + " " + entry.body.slice(0, 400));
  for (const g of qGrams) if (idx.includes(g)) s += 0.5;
  return s;
}

export interface RetrieveResult {
  entries: KbEntry[];
  topScore: number;
}

export function retrieve(query: string, topK = 4, entries: KbEntry[] = KB): RetrieveResult {
  const scored = entries
    .map((e) => ({ e, s: scoreEntry(e, query) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, topK);
  return { entries: scored.map((x) => x.e), topScore: scored.length ? scored[0].s : 0 };
}

export function isComplianceRelated(entries: KbEntry[]): boolean {
  return entries.some((e) => e.tags.includes("compliance"));
}
