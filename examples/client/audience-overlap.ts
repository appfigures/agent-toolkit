#!/usr/bin/env node
// Usage: npx tsx examples/client/audience-overlap.ts "<app name>"
// Profiles an app's audience: gender and age split, plus the apps and categories that same
// audience gravitates to. Useful for positioning, partnerships, and lookalike targeting.
import { AppfiguresAgentClient, type AudienceDemographicsOutput } from '@appfigures/agent-toolkit'

const query = process.argv.slice(2).join(' ').trim()
if (!query) {
	console.error('Usage: npx tsx examples/client/audience-overlap.ts "<app name>"')
	process.exit(1)
}

const af = new AppfiguresAgentClient() // reads APPFIGURES_API_KEY from env

const search = await af.apps.search({ q: query, count: 1 })
const app = search.results[0]
if (!app) {
	console.error(`No app found for "${query}".`)
	process.exit(1)
}

const [demo, cross] = await Promise.all([
	af.audience.demographics({ appId: app.unified_app_id }),
	af.audience.crossUsage({ appId: app.unified_app_id, count: 8 }),
])

// Shares are 0–1 fractions.
const bar = (fraction: number, width = 24) => '█'.repeat(Math.max(0, Math.round(fraction * width)))
const pct = (fraction: number) => `${Math.round(fraction * 100)}%`.padStart(4)

const GENDERS = [
	['female', 'Female'],
	['male', 'Male'],
	['even', 'Unspecified'],
] as const
const AGES: ReadonlyArray<[keyof AudienceDemographicsOutput['by_age'], string]> = [
	['age_18_to_24', '18–24'],
	['age_25_to_34', '25–34'],
	['age_35_to_49', '35–49'],
	['age_50_to_64', '50–64'],
	['age_65_and_older', '65+'],
]

console.log(`\n  ${app.name}`)
console.log(`  Audience profile from ${demo.total_observations.toLocaleString('en')} observations`)

console.log('\n  Gender')
for (const [key, label] of GENDERS) {
	console.log(`    ${label.padEnd(12)} ${pct(demo.by_gender[key])} ${bar(demo.by_gender[key])}`)
}

console.log('\n  Age')
for (const [key, label] of AGES) {
	console.log(`    ${label.padEnd(12)} ${pct(demo.by_age[key])} ${bar(demo.by_age[key])}`)
}

console.log('\n  This audience also uses')
for (const row of cross.results.slice(0, 8)) {
	console.log(`    ${pct(row.cross_usage_score)}  ${row.app.name}`)
}

const categories = cross.metadata.top_categories.slice(0, 5).map((c) => c.name)
if (categories.length) console.log(`\n  Gravitates to: ${categories.join(', ')}`)
console.log('')
