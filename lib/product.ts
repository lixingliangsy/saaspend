export interface InputField {
  key: string
  label: string
  type: 'input' | 'text' | 'textarea' | 'select'
  placeholder?: string
  options?: string[]
}

export const PRODUCT = {
  name: "SaaSpend",
  slug: "saaspend",
  pipelineId: "saas-spend-v1",
  rulesetId: "saas-spend@2026-07-19",
  productId: "PROD_4Cf7ZowF3yqsTSoDEVMZXs",
  priceMonthly: 19,
  yearlyProductId: "PROD_7OrLTvk666hCywVfJpW3es",
  priceYearly: 190,

  checkoutUrl: "https://pancake.waffo.ai/store/lixingliang-ai-tools-6cilbw8v/checkout/cs_d3c777ab-15c7-e2c3-c392-a64db352a036",
  tagline: "Find and cut redundant SaaS subscriptions your team forgot.",
  description: "List your team's SaaS tools (one per line with monthly cost); get a spend audit that flags duplicate categories, forgotten tools, and a suggested savings number. For SMB ops and finance managers tracking tool sprawl.",
  toolTitle: "Audit my SaaS",
  resultLabel: "Spend report",
  ctaLabel: "Audit",
  features: [
  "Deterministic duplicate-category checklist",
  "Duplicate detection",
  "Forgotten-tool flags",
  "Savings estimate",
  "Approvals (Team)"
],
  inputs: [
  {
    "key": "tools",
    "label": "Your SaaS (one per line: Name, monthly USD)",
    "type": "textarea",
    "placeholder": "Slack, 8\\nNotion, 10\\nCoda, 12\\nZoom, 15\\nLoom, 12"
  },
  {
    "key": "teamSize",
    "label": "Team size",
    "type": "input",
    "placeholder": "e.g. 25"
  }
] as InputField[],
  definitionLead: "SaaSpend finds redundant SaaS subscriptions from an inventory paste — category overlaps and cut/keep recommendations for ops and finance partners who want fewer forgotten tools.",
  geoFaq: [
    { q: "What is SaaSpend?", a: "SaaSpend analyzes a SaaS inventory for overlaps and likely waste." },
    { q: "What do I paste in?", a: "A list of tools (and optional team size / notes)." },
    { q: "Who should use it?", a: "Ops, IT, and finance partners cleaning software sprawl." },
    { q: "Does it cancel subscriptions?", a: "No. It recommends; you still own vendor cancellations." },
    { q: "Does it guarantee savings?", a: "No. Overlap detection helps prioritization; actual savings depend on contracts." },
    { q: "Is pricing scraped live?", a: "No. Treat any cost hints as estimates you must verify with invoices." },
  ],
  systemPrompt: "You are a SaaS-spend optimizer. Given a list of tools with monthly costs and a team size, detect duplicate categories, rarely-used tools, and estimate savings.",
  pricing: [
    {
      "tier": "Free",
      "price": "$0",
      "desc": "1 spend audit run / day · watermarked export"
    },
    {
      "tier": "Pro",
      "price": "$19/mo",
      "desc": "300 workflow runs / mo · alerts · export"
    },
    {
      "tier": "Enterprise",
      "price": "Custom",
      "desc": "BYOK · multi-dept rulesets · higher caps"
    }
  ],
  mock: (inputs: Record<string, string>): string => {
  const raw = (inputs['tools'] || '').split(/\n/).map(s => s.trim()).filter(Boolean)
  if (!raw.length) return 'List your SaaS tools (Name, monthly USD) to audit.'
  const cats: Record<string, string> = { slack: 'chat', discord: 'chat', teams: 'chat', notion: 'docs', coda: 'docs', conflake: 'docs', zoom: 'meeting', meet: 'meeting', loom: 'video', figma: 'design', sketch: 'design' }
  const items: { name: string; cost: number; cat: string }[] = []
  raw.forEach(l => {
    const m = l.split(/[,\s]+/)
    const name = m[0]
    const cost = parseFloat(m[m.length - 1].replace(/[^0-9.]/g, '')) || 0
    items.push({ name, cost, cat: cats[name.toLowerCase()] || 'other' })
  })
  const total = items.reduce((a, b) => a + b.cost, 0)
  const byCat: Record<string, { name: string; cost: number; cat: string }[]> = {}
  items.forEach(i => { (byCat[i.cat] = byCat[i.cat] || []).push(i) })
  const dups: { name: string; cost: number; cat: string }[][] = []
  Object.keys(byCat).forEach(c => { if (byCat[c].length > 1) dups.push(byCat[c]) })
  let out = 'SAAS SPEND AUDIT\n\n'
  out += 'Tools: ' + items.length + '   Total: $' + total.toFixed(0) + '/mo ($' + (total * 12).toFixed(0) + '/yr)\n'
  if (dups.length) {
    out += '\nDuplicate categories (consolidate):\n'
    dups.forEach(d => { out += '  - ' + d.map((x) => x.name + ' $' + x.cost).join(' + ') + '\n' })
  } else out += '\nNo obvious duplicate categories.\n'
  const suggest = dups.reduce((a, d) => a + (d.reduce((x, y) => x + y.cost, 0) - Math.min(...d.map((z) => z.cost))), 0)
  out += '\nSuggested savings: $' + suggest.toFixed(0) + '/mo\n'
  out += '\n--- (Mock. Pro connects real billing + alerts on new subscriptions.)'
  return out
}
}
