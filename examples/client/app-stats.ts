#!/usr/bin/env node
// Usage: npx tsx examples/client/app-stats.ts "<app name>"
// Looks up an app by name and prints a few stats: last-month downloads/revenue,
// a 6-month download trend, and its rating distribution.
import { AppfiguresAgentClient } from '@appfigures/agent-toolkit'

const query = process.argv.slice(2).join(' ').trim()
if (!query) {
	console.error('Usage: npx tsx examples/client/app-stats.ts "<app name>"')
	process.exit(1)
}

const af = new AppfiguresAgentClient() // reads APPFIGURES_API_KEY from env

const compact = (n: number | undefined) =>
	n == null
		? 'n/a'
		: new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(n)
const bar = (value: number, max: number, width = 22) =>
	'█'.repeat(Math.max(1, Math.round((value / max) * width)))
const month = (iso: string) =>
	new Date(iso).toLocaleString('en', { month: 'short', year: '2-digit' })

// 1. Find the app
const { results } = await af.apps.search({ q: query, count: 1 })
const app = results[0]
if (!app) {
	console.error(`No app found for "${query}".`)
	process.exit(1)
}

console.log(`\n  ${app.name}`)
console.log(`  ${app.publisher}  ·  ${app.storefronts.join(', ')}`)
console.log(
	`  ~${compact(app.downloads_last_month)} downloads/mo   ~$${compact(app.revenue_last_month_usd)} revenue/mo`
)

// 2. Download trend — recent months. The most recent month is usually still accruing (estimates
// lag a day or two), so drop it when it's clearly partial so the trend doesn't read as a crash.
const startDate = new Date()
startDate.setMonth(startDate.getMonth() - 6)
const start = startDate.toISOString().slice(0, 10)

// metrics.query returns a partition tree whose shape depends on `groupBy`, so its output type is
// `unknown` by design. For this fixed query (groupBy: ['date']) the result is a flat list of dated
// points — declare exactly that and assert it. (Shape verified against the agentActions metrics
// action, which flattens each node down to its dimension value + `value`.)
type DateSeries = { partition?: { nodes: Array<{ date: string; value: number | null }> } }
const series = (await af.metrics.query({
	dataset: 'estimates.sales',
	filterAppsById: [app.unified_app_id],
	groupBy: ['date'],
	granularity: 'monthly',
	start,
})) as DateSeries

let nodes = series.partition?.nodes ?? []
const last = nodes.at(-1)
const prev = nodes.at(-2)
if (last && prev && last.value != null && prev.value != null && last.value < prev.value * 0.5) {
	nodes = nodes.slice(0, -1)
}
const maxDl = Math.max(1, ...nodes.map((n) => n.value ?? 0))
console.log('\n  Downloads / month')
for (const n of nodes) {
	console.log(`    ${month(n.date).padEnd(7)} ${bar(n.value ?? 0, maxDl)} ${compact(n.value ?? 0)}`)
}

// 3. Rating distribution
const { by_stars } = await af.reviews.breakdown({ filterAppsById: [app.unified_app_id] })
const stars = by_stars ?? {}
const counts = Object.values(stars).map((c) => c ?? 0)
const total = counts.reduce((a, b) => a + b, 0)
const maxStar = Math.max(1, ...counts)
console.log(`\n  Ratings  (${compact(total)} reviews)`)
for (let s = 5; s >= 1; s--) {
	const count = stars[String(s)] ?? 0
	const pct = total ? Math.round((count / total) * 100) : 0
	console.log(`    ${'★'.repeat(s).padEnd(5)} ${bar(count, maxStar)} ${String(pct).padStart(3)}%`)
}
console.log('')
