#!/usr/bin/env node
// Usage: npx tsx examples/client/review-triage.ts "<unified app id or product id>"
// Triage an app's unhappy users: how many 1–2 star reviews there are, which app versions and
// countries they cluster in, and the most recent ones still waiting for a developer reply.
import { AppfiguresAgentClient } from '@appfigures/agent-toolkit'

const arg = process.argv.slice(2).join(' ').trim()
if (!arg) {
	console.error('Usage: npx tsx examples/client/review-triage.ts "<unified app id or product id>"')
	process.exit(1)
}
// Product IDs are numeric; unified app IDs (ua_...) are strings. Pass numbers as numbers.
const id: string | number = /^\d+$/.test(arg) ? Number(arg) : arg

const af = new AppfiguresAgentClient() // reads APPFIGURES_API_KEY from env

const [recent, breakdown] = await Promise.all([
	af.reviews.list({ filterAppsById: [id], stars: [1, 2], sort: 'date', order: 'desc', count: 5 }),
	af.reviews.breakdown({ filterAppsById: [id], stars: [1, 2], by: ['version', 'country'] }),
])

// by_version / by_country are Record<string, number | undefined>; take the top few real buckets.
const top = (counts: Record<string, number | undefined> | undefined, n: number) =>
	Object.entries(counts ?? {})
		.filter((e): e is [string, number] => e[1] != null)
		.sort((a, b) => b[1] - a[1])
		.slice(0, n)

console.log(`\n  ${breakdown.metadata.total_count} reviews at 1–2★`)
console.log(
	`  Worst versions:  ${
		top(breakdown.by_version, 3)
			.map(([v, count]) => `${v} (${count})`)
			.join(', ') || 'n/a'
	}`
)
console.log(
	`  Worst countries: ${
		top(breakdown.by_country, 3)
			.map(([c, count]) => `${c} (${count})`)
			.join(', ') || 'n/a'
	}`
)

console.log('\n  Most recent, no reply yet')
const unreplied = recent.results.filter((r) => !r.has_response)
for (const r of unreplied) {
	const where = [r.country, r.version].filter(Boolean).join(' · ')
	console.log(`\n    ${'★'.repeat(r.stars)}  ${r.title}  (${where})`)
	console.log(`    ${r.body.replace(/\s+/g, ' ').slice(0, 160)}`)
	console.log(
		`    reply: af.reviews.reply({ reviewId: ${JSON.stringify(r.review_id)}, content: "..." })`
	)
}
if (!unreplied.length) console.log('    (every recent 1–2★ review already has a reply)')
console.log('')
