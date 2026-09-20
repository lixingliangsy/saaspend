export const RULESET_VERSION = 'saas-spend@2026-07-19'

export type SpendRule = {
  id: string
  title: string
  severity: 'low' | 'medium' | 'high'
  check: (ctx: { lines: string[]; teamSize: number; categories: Record<string, string[]> }) => boolean
  remediation: string
}

const CAT: Record<string, string> = {
  slack: 'chat',
  discord: 'chat',
  teams: 'chat',
  notion: 'docs',
  coda: 'docs',
  confluence: 'docs',
  zoom: 'meeting',
  meet: 'meeting',
  loom: 'video',
  figma: 'design',
  sketch: 'design',
}

function parseInventory(raw: string) {
  const lines = raw.split(/\n/).map((s) => s.trim()).filter(Boolean)
  const categories: Record<string, string[]> = {}
  for (const line of lines) {
    const parts = line.split(/[,\s]+/)
    const name = (parts[0] || '').toLowerCase()
    const cat = CAT[name] || 'other'
    ;(categories[cat] = categories[cat] || []).push(name)
  }
  return { lines, categories }
}

export const SPEND_RULES: SpendRule[] = [
  {
    id: 'SS-01',
    title: 'Duplicate category detected',
    severity: 'high',
    check: ({ categories }) => Object.values(categories).some((v) => v.length > 1),
    remediation: 'Consolidate overlapping tools in the same category before renewing seats.',
  },
  {
    id: 'SS-02',
    title: 'Inventory missing cost fields',
    severity: 'medium',
    check: ({ lines }) => lines.some((l) => !/[0-9]/.test(l)),
    remediation: 'Provide Name + monthly USD on each line for accurate savings estimates.',
  },
  {
    id: 'SS-03',
    title: 'Small team with many tools',
    severity: 'medium',
    check: ({ lines, teamSize }) => teamSize > 0 && teamSize <= 15 && lines.length >= 8,
    remediation: 'Review rarely used seats; prefer shared plans over per-seat sprawl.',
  },
  {
    id: 'SS-04',
    title: 'Chat stack overlap risk',
    severity: 'high',
    check: ({ categories }) => (categories.chat || []).length > 1,
    remediation: 'Pick one primary chat stack; archive secondary invite sprawl.',
  },
  {
    id: 'SS-05',
    title: 'Docs stack overlap risk',
    severity: 'medium',
    check: ({ categories }) => (categories.docs || []).length > 1,
    remediation: 'Unify knowledge base to reduce duplicate storage and search tax.',
  },
]

export function runSpendDomainChecks(inputs: Record<string, string>) {
  const { lines, categories } = parseInventory(String(inputs.tools || inputs.topic || ''))
  const teamSize = parseInt(String(inputs.teamSize || '0'), 10) || 0
  const ctx = { lines, teamSize, categories }
  const hits = SPEND_RULES.filter((r) => r.check(ctx)).map((r) => ({
    id: r.id,
    title: r.title,
    severity: r.severity,
    remediation: r.remediation,
    source: 'Rule-based' as const,
  }))
  return { rulesetVersion: RULESET_VERSION, hits }
}

export type RuleHit = {
  id: string
  title: string
  severity: 'low' | 'medium' | 'high'
  passed: boolean
  remediation?: string
  ref?: string
}

export function runDeterministicChecks(inputs: Record<string, string>): RuleHit[] {
  const result = runSpendDomainChecks(inputs) as { hits?: Array<Record<string, unknown>> }
  const hits = result.hits || []
  const blob = String(inputs.tools || inputs.topic || Object.values(inputs || {}).join('\n'))
  if (!hits.length) {
    return [{ id: 'R0', title: 'SaaS inventory accepted', severity: 'low', passed: blob.trim().length > 0 }]
  }
  return hits.map((h) => ({
    id: String(h.id || 'SPEND'),
    title: String(h.title || 'spend check'),
    severity: (h.severity as 'low' | 'medium' | 'high') || 'medium',
    passed: false,
    remediation: String(h.remediation || ''),
  }))
}
