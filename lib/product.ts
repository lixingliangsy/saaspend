export interface InputField {
  key: string
  label: string
  type: 'input' | 'textarea' | 'select'
  placeholder?: string
  options?: string[]
}

export const PRODUCT = {
  name: "SaaSpend",
  slug: "saaspend",
  tagline: "Find and cut redundant SaaS subscriptions your team forgot.",
  description: "List your team's SaaS tools (one per line with monthly cost); get a spend audit that flags duplicate categories, forgotten tools, and a suggested savings number. For SMB ops and finance managers tracking tool sprawl.",
  toolTitle: "Audit my SaaS",
  resultLabel: "Spend report",
  ctaLabel: "Audit",
  features: [
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
  systemPrompt: "You are a SaaS-spend optimizer. Given a list of tools with monthly costs and a team size, detect duplicate categories, rarely-used tools, and estimate savings.",
  pricing: [
  {
    "tier": "Free",
    "price": "$0",
    "desc": "Connect 1 card"
  },
  {
    "tier": "Pro",
    "price": "$29/mo",
    "desc": "Full audit + alerts"
  },
  {
    "tier": "Team",
    "price": "$79/mo",
    "desc": "Multi-dept + approvals"
  }
],
  mock: (inputs: Record<string, string>): string => {
  const raw = (inputs['tools'] || '').split(/\n/).map(s => s.trim()).filter(Boolean)
  if (!raw.length) return 'List your SaaS tools (Name, monthly USD) to audit.'
  const cats = { slack: 'chat', discord: 'chat', teams: 'chat', notion: 'docs', coda: 'docs', conflake: 'docs', zoom: 'meeting', meet: 'meeting', loom: 'video', figma: 'design', sketch: 'design' }
  let items = []
  raw.forEach(l => {
    const m = l.split(/[,\s]+/)
    const name = m[0]
    const cost = parseFloat(m[m.length - 1].replace(/[^0-9.]/g, '')) || 0
    items.push({ name, cost, cat: cats[name.toLowerCase()] || 'other' })
  })
  const total = items.reduce((a, b) => a + b.cost, 0)
  const byCat = {}
  items.forEach(i => { (byCat[i.cat] = byCat[i.cat] || []).push(i) })
  let dups = []
  Object.keys(byCat).forEach(c => { if (byCat[c].length > 1) dups.push(byCat[c]) })
  let out = 'SAAS SPEND AUDIT\n\n'
  out += 'Tools: ' + items.length + '   Total: $' + total.toFixed(0) + '/mo ($' + (total * 12).toFixed(0) + '/yr)\n'
  if (dups.length) {
    out += '\nDuplicate categories (consolidate):\n'
    dups.forEach(d => out += '  - ' + d.map(x => x.name + ' $' + x.cost).join(' + ') + '\n')
  } else out += '\nNo obvious duplicate categories.\n'
  const suggest = dups.reduce((a, d) => a + (d.reduce((x, y) => x + y.cost, 0) - Math.min(...d.map(z => z.cost))), 0)
  out += '\nSuggested savings: $' + suggest.toFixed(0) + '/mo\n'
  out += '\n--- (Mock. Pro connects real billing + alerts on new subscriptions.)'
  return out
}
}
