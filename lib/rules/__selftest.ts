// lib/rules/__selftest.ts — assertions exercising saas-spend rules.
// Run with: npx tsx lib/rules/__selftest.ts
// Exits non-zero on failure so it can gate CI / build.
import {
  RULESET_VERSION,
  SPEND_RULES,
  runSpendDomainChecks,
  type SpendRule,
} from './saas-spend'

let failures = 0
const errors: string[] = []

function assert(cond: boolean, msg: string) {
  if (!cond) {
    failures++
    errors.push(msg)
    console.error('  ✗ ' + msg)
  } else {
    console.log('  ✓ ' + msg)
  }
}

function ctxFrom(inventory: string, teamSize = 0) {
  return runSpendDomainChecks({ tools: inventory, teamSize: String(teamSize) })
}

console.log('saas-spend self-test (' + RULESET_VERSION + ')\n')

// 1. Ruleset shape
assert(
  typeof RULESET_VERSION === 'string' && RULESET_VERSION.length > 0,
  'RULESET_VERSION is a non-empty string'
)
assert(
  Array.isArray(SPEND_RULES) && SPEND_RULES.length >= 12,
  'SPEND_RULES has >= 12 rules'
)
const ids = SPEND_RULES.map((r: SpendRule) => r.id)
assert(new Set(ids).size === ids.length, 'SPEND_RULES ids are unique')
const validSev = new Set(['low', 'medium', 'high'])
assert(
  SPEND_RULES.every(
    (r: SpendRule) => typeof r.check === 'function' && validSev.has(r.severity)
  ),
  'every rule has a check() fn and valid severity'
)

// 2. SS-01 duplicate category (two chat tools)
{
  const { hits } = ctxFrom('slack\ndiscord\nnotion\nzoom', 5)
  assert(hits.some((h) => h.id === 'SS-01'), 'SS-01 fires on duplicate chat tools')
  assert(hits.some((h) => h.id === 'SS-04'), 'SS-04 fires on chat overlap')
}

// 3. SS-02 missing cost fields (no digits on a line)
{
  const { hits } = ctxFrom('figma\nslack\nnotion', 3)
  assert(hits.some((h) => h.id === 'SS-02'), 'SS-02 fires when a line lacks a numeric cost')
}

// 4. SS-03 small team with many tools
{
  const { hits } = ctxFrom('slack\nnotion\nzoom\nfigma\nloom\ncoda\nteams\nmeet', 10)
  assert(hits.some((h) => h.id === 'SS-03'), 'SS-03 fires on small team with >=8 tools')
}

// 5. SS-07 over-provisioned seats (tools > teamSize)
{
  const { hits } = ctxFrom('slack\nnotion\nzoom\nfigma', 2)
  assert(hits.some((h) => h.id === 'SS-07'), 'SS-07 fires when seats exceed team size')
}

// 6. SS-08 tool sprawl / Shadow IT
{
  const { hits } = ctxFrom(
    'slack\ndiscord\nnotion\ncoda\nzoom\nmeet\nloom\nfigma\nsketch\njira\ntrello\nasana',
    20
  )
  assert(hits.some((h) => h.id === 'SS-08'), 'SS-08 fires on broad multi-category sprawl')
}

// 7. SS-11 renewal timing
{
  const { hits } = ctxFrom('slack renews in 30 days', 5)
  assert(
    hits.some((h) => h.id === 'SS-11'),
    'SS-11 fires when renewal mentioned without 90/180 plan'
  )
}

// 8. SS-12 AI tax blended
{
  const { hits } = ctxFrom('openai copilot', 5)
  assert(hits.some((h) => h.id === 'SS-12'), 'SS-12 fires when AI tools present')
}

// 9. clean inventory => fewer hits (sanity)
{
  const clean = ctxFrom('slack 12\ndiscord 0 90 day alert\nnotion 9 owner@team', 4)
  assert(
    !clean.hits.some((h) => h.id === 'SS-02'),
    'SS-02 does NOT fire when costs are present'
  )
}

console.log('\n' + (failures === 0 ? 'ALL PASSED' : failures + ' FAILURE(S)'))
if (errors.length) console.log(errors.join('\n'))

if (failures > 0) process.exit(1)
