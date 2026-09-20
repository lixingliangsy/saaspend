// scan.mjs — saaspend SaaS 支出/FinOps 审计（真实实现，由 T1 审计模板契约驱动）
// 幂等：同输入同输出、无副作用、可重入。返回 { items:[{id,...}], metrics:{...} }
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const DATA = path.join(ROOT, '.data')
const AUDIT = path.join(DATA, 'audit')

async function fetchText(url) {
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), 12000)
  try {
    const r = await fetch(url, { signal: ctrl.signal, redirect: 'follow', headers: { 'user-agent': 't1-audit-bot/1.0 (+https://lxsai.com)' } })
    if (!r.ok) throw new Error('HTTP ' + r.status)
    return await r.text()
  } finally { clearTimeout(t) }
}

async function loadTargets(targets) {
  const docs = []
  for (const t of targets) {
    try {
      if (/^https?:\/\//i.test(t)) { docs.push(await fetchText(t)); continue }
        const p = path.isAbsolute(t) ? t : path.join(AUDIT, t)
      docs.push(fs.readFileSync(p, 'utf8'))
    } catch (e) { console.warn('[scan] target load failed:', t, e.message) }
  }
  return docs
}

export async function scan(ctx) {
  const cfg = JSON.parse(fs.readFileSync(path.join(DATA, 'config.json'), 'utf8'))
  const targets = (cfg.scan && cfg.scan.targets) || [path.join(AUDIT, 'subscriptions.json')]
  const text = (await loadTargets(targets)).join('\n')
  const subs = JSON.parse(text)
  const items = []
  let monthlyWaste = 0

  // 1) Idle seats (seats > active_users)
  for (const s of subs) {
    const idle = (s.seats || 0) - (s.active_users || 0)
    if (idle > 0) {
      const waste = idle * (s.monthly || 0)
      monthlyWaste += waste
      items.push({
        id: `finops:idle-seats:${s.name}`,
        category: 'idle-seats', severity: 'medium',
        title: `Idle seats in ${s.name}`,
        detail: `${idle}/${s.seats} 座位闲置，约 $${waste.toFixed(0)}/mo 浪费`,
        present: false
      })
    }
  }

  // 2) Duplicate / overlapping tools in same category
  const byCat = {}
  for (const s of subs) (byCat[s.category] ||= []).push(s)
  for (const [cat, list] of Object.entries(byCat)) {
    if (list.length > 1) {
      const names = list.map(s => s.name).join(' + ')
      const cheapest = Math.min(...list.map(s => s.monthly || 0))
      monthlyWaste += cheapest * (list.length - 1) // 重叠冗余估算
      items.push({
        id: `finops:duplicate:${cat}`,
        category: 'duplicate', severity: 'high',
        title: `Redundant tools in ${cat}`,
        detail: `${names} 同属 ${cat}，可合并，约 $${(cheapest * (list.length - 1)).toFixed(0)}/mo 重叠`,
        present: false
      })
    }
  }

  // 3) Annual lock with low utilization
  for (const s of subs) {
    if (s.billing === 'annual' && (s.active_users || 0) < (s.seats || 0) * 0.5) {
      items.push({
        id: `finops:annual-lock:${s.name}`,
        category: 'commitment', severity: 'low',
        title: `Annual commitment underused: ${s.name}`,
        detail: `年付但利用率 <50% (${s.active_users}/${s.seats})，灵活性差`,
        present: false
      })
    }
  }

  const weights = { high: 18, medium: 10, low: 5 }
  const bySeverity = { high: 0, medium: 0, low: 0 }
  let penalty = 0
  for (const it of items) { penalty += weights[it.severity] || 0; bySeverity[it.severity]++ }
  const score = Math.max(0, 100 - penalty)

  const metrics = {
    waste_score: score,
    est_monthly_waste: Math.round(monthlyWaste * 100) / 100,
    est_yearly_waste: Math.round(monthlyWaste * 12 * 100) / 100,
    subscription_count: subs.length,
    idle_seat_items: items.filter(i => i.category === 'idle-seats').length,
    duplicate_items: items.filter(i => i.category === 'duplicate').length,
    by_severity: bySeverity
  }
  return { items, metrics }
}
