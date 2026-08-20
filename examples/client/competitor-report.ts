#!/usr/bin/env node
// Usage: npx tsx examples/client/competitor-report.ts "<your app>" "<competitor>" ["<competitor 2>" ...]
// Ranks two or more apps by last-month downloads and revenue estimates, and shows how far each
// trails the leader. Estimates work for any app on any store, so the competitors need not be yours.
import { AppfiguresAgentClient, type AppsSearchOutput } from '@appfigures/agent-toolkit'

type App = AppsSearchOutput['results'][number]

const names = process.argv
	.slice(2)
	.map((s) => s.trim())
	.filter(Boolean)
if (names.length < 2) {
	console.error('Usage: npx tsx examples/client/competitor-report.ts "<your app>" "<competitor>" ["<competitor 2>" ...]')
	process.exit(1)
}

const af = new AppfiguresAgentClient() // reads APPFIGURES_API_KEY from env

const compact = (n: number | undefined) =>
	n == null ? 'n/a' : new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(n)
// Estimates come back as a bound rather than an exact figure for sub-threshold apps.
const withBound = (value: number | undefined, bound: 'at_most' | 'at_least' | undefined) =>
	(bound === 'at_most' ? '≤' : bound === 'at_least' ? '≥' : '') + compact(value)

// Resolve each name to its top unified-app match. One row per app, with last-month estimates.
const apps: App[] = []
for (const name of names) {
	const { results } = await af.apps.search({ q: name, count: 1 })
	const app = results[0]
	if (!app) {
		console.error(`No app found for "${name}".`)
		process.exit(1)
	}
	apps.push(app)
}

const report = (
	label: string,
	value: (a: App) => number | undefined,
	bound: (a: App) => 'at_most' | 'at_least' | undefined,
	money: boolean
) => {
	const rows = [...apps].sort((a, b) => (value(b) ?? 0) - (value(a) ?? 0))
	const leader = rows[0]
	if (!leader) return
	console.log(`\n  ${label}`)
	for (const app of rows) {
		const v = value(app)
		const leaderValue = value(leader)
		const shown = (money ? '$' : '') + withBound(v, bound(app))
		const share =
			app === leader
				? 'leader'
				: leaderValue && v != null
					? `${Math.round((v / leaderValue) * 100)}% of leader`
					: ''
		console.log(`    ${app.name.padEnd(24)} ${shown.padStart(8)}   ${share}`)
	}
}

console.log('\n  Head-to-head (last calendar month)')
report('Downloads', (a) => a.downloads_last_month, (a) => a.downloads_last_month_bound, false)
report('Revenue (USD)', (a) => a.revenue_last_month_usd, (a) => a.revenue_last_month_usd_bound, true)
console.log('')
