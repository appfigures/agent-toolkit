#!/usr/bin/env node
// Usage: npx tsx examples/client/keyword-competition.ts "<keyword>" [country] [storefront]
// Maps the competitive landscape for a search term: who ranks organically, who is buying ads (and
// how much of the impressions they capture), and related terms worth targeting instead.
// Defaults: country US, storefront apple:ios.
import { AppfiguresAgentClient } from '@appfigures/agent-toolkit'

const [term, country = 'US', storefront = 'apple:ios'] = process.argv.slice(2)
if (!term) {
	console.error('Usage: npx tsx examples/client/keyword-competition.ts "<keyword>" [country] [storefront]')
	process.exit(1)
}

const af = new AppfiguresAgentClient() // reads APPFIGURES_API_KEY from env

const score = (n: number | null) => (n == null ? 'n/a' : String(Math.round(n))) // popularity / competitiveness are 0–100
const pct = (n: number) => `${String(Math.round(n)).padStart(3)}%`

// Advertisers are an Apple Ads dataset (Apple-only), so that call takes no storefront.
const [ranking, advertisers, related] = await Promise.all([
	af.keywords.rankingApps({ keywordTerm: term, country, storefront }),
	af.keywords.advertisers({ keywordTerm: term, country }),
	af.keywords.related({ keywordTerm: term, country, storefront }),
])

const kw = ranking.metadata.keyword
console.log(`\n  "${kw.keyword_term}"  (${country})`)
console.log(
	`  popularity ${score(kw.popularity)}/100   competitiveness ${score(kw.competitiveness)}/100   apps ranking ${kw.num_apps ?? 'n/a'}`
)

console.log('\n  Ranks organically')
for (const app of ranking.results.slice(0, 5)) console.log(`    ${app.name}  ·  ${app.developer}`)

console.log('\n  Buys ads here (by impression share)')
const bidders = [...advertisers.results].sort((a, b) => b.impressions_share - a.impressions_share).slice(0, 5)
if (!bidders.length) console.log('    (no advertisers detected)')
for (const ad of bidders) {
	const organic = ad.organic_rank == null ? 'not ranked organically' : `organic #${ad.organic_rank}`
	console.log(`    ${pct(ad.impressions_share)}  ${ad.name.padEnd(24)} ${organic}`)
}

console.log('\n  Related terms (high popularity + low competitiveness is the opening)')
for (const r of related.results.slice(0, 6)) {
	console.log(
		`    ${r.keyword_term.padEnd(24)} pop ${score(r.popularity).padStart(3)}  comp ${score(r.competitiveness).padStart(3)}  apps ${r.num_apps}`
	)
}
console.log('')
