# @appfigures/agent-toolkit

[![npm version](https://img.shields.io/npm/v/@appfigures/agent-toolkit.svg)](https://www.npmjs.com/package/@appfigures/agent-toolkit) [![License](https://img.shields.io/badge/license-Apache_2.0-blue.svg)](./LICENSE) [![types included](https://img.shields.io/badge/types-included-blue.svg)](#the-client-for-code-your-agent-writes)

Give your AI agent a read on the app market. This toolkit connects it to Appfigures: download and revenue estimates, reviews, rankings, keywords, and ads for any app on any major store, not just your own.

Ask it things like:

- _"How many downloads and how much revenue is Spotify pulling in?"_
- _"Is Headspace growing or shrinking over the last six months?"_
- _"Who's advertising on 'meditation', and how dominant are they?"_
- _"What keywords does Duolingo rank for that we don't?"_
- _"What are users complaining about in an app's newest 1-star reviews?"_
- _"Who actually uses ChatGPT: their age, gender, and what else they use?"_

[More recipes →](./docs/recipes.md)

Setting it up with a coding agent? Point it at [`llms.txt`](./llms.txt): the doc map for wiring this into your agent.

## ✨ Four ways to use the power of Appfigures AI

Bring Appfigures into your agent however it's built — as tools it calls, code it writes, a CLI, or over MCP. Whichever you pick, you can do the same things and get the same JSON back.

- 🛠️ **Agent tools** — your agent calls Appfigures as tools while it runs. AI SDK, OpenAI, LangChain. → [Add the tools](#tools-for-your-agent-framework)
- 📦 **The client** — your agent writes code that queries Appfigures and gets typed data back. → [Use the client](#the-client-for-code-your-agent-writes)
- 🖥️ **CLI** — run Appfigures from a terminal or a sandbox. → [`@appfigures/cli`](https://www.npmjs.com/package/@appfigures/cli)
- 🔌 **MCP** — connect Appfigures to Claude, ChatGPT, or Cursor. → [Connect the hosted server](https://github.com/appfigures/cli#mcp-server)

## Quickstart

```sh
npm install @appfigures/agent-toolkit
```

```ts
import { AppfiguresAgentClient } from '@appfigures/agent-toolkit'

const af = new AppfiguresAgentClient() // reads APPFIGURES_API_KEY
const { results } = await af.apps.search({ q: 'spotify', count: 1 })
console.log(results[0]) // name, downloads_last_month, revenue_last_month_usd, storefronts …
```

Get an API key at https://appfigures.com/developers/keys, then set it as `APPFIGURES_API_KEY` (or pass `apiKey` in code).

**What a key can see.** Estimates, ratings, reviews, ranks, keywords, and catalog data work for any app on any store, your own or a competitor's. Store-reported numbers for your own apps (actual sales, revenue, subscriptions, and ad spend) require linking that app's store account to Appfigures, or being granted access to it.

## What your agent can do

- **App performance** — download and revenue estimates, and any numeric metric, for your apps or a competitor's.
- **Reviews and ratings** — read reviews, break them down by rating or version, post developer replies.
- **Store presence** — rank history, top charts, full store listings, featured placements.
- **Keywords and ASO** — the organic and paid keywords an app ranks for, competitor ad spend, related terms, rank tracking.
- **Audience** — age and gender estimates, and the other apps your users use.
- **Apple Ads** — campaigns, ad groups, keywords, search terms, performance reports.
- **App catalog** — search and aggregate across millions of apps on every major store.

Every action, with its parameters, is in the [action reference](#action-reference).

## Tools for your agent framework

One tool per action. Reads run on their own. Writes wait for your approval.

Build the action surface once with `createAppfiguresActions`, then adapt it to your framework's tools with `toAISDKTools`, `toOpenAITools`, or `toLangChainTools`. The surface holds your API key and options; each adapter is a thin projection of it.

Install your framework's SDK next to the toolkit: `ai` and a model provider such as `@ai-sdk/openai` for the Vercel AI SDK, `openai` for OpenAI, or `@langchain/core @langchain/langgraph` for LangChain.

### Vercel AI SDK

<!-- BEGIN example: ai-sdk -->

```ts
import { createAppfiguresActions } from '@appfigures/agent-toolkit'
import { toAISDKTools } from '@appfigures/agent-toolkit/ai'
import { generateText, type LanguageModel, stepCountIs } from 'ai'

// `model` is your provider's model, e.g. `openai('gpt-4o')` from `@ai-sdk/openai`.
export async function run(model: LanguageModel) {
	const { tools } = toAISDKTools(createAppfiguresActions()) // reads APPFIGURES_API_KEY from env
	const { text } = await generateText({
		model,
		tools,
		stopWhen: stepCountIs(10),
		prompt: 'What are the latest downloads and revenue for Spotify?',
	})
	return text
}
```

<!-- END example: ai-sdk -->

### OpenAI

The OpenAI SDK doesn't run tools for you. Call `handleToolCall` for each one, and loop until the model stops calling tools:

<!-- BEGIN example: openai -->

```ts
import { createAppfiguresActions } from '@appfigures/agent-toolkit'
import { toOpenAITools } from '@appfigures/agent-toolkit/openai'
import OpenAI from 'openai'
import type { ChatCompletionMessageParam } from 'openai/resources'

// The OpenAI SDK doesn't run tools for you: call handleToolCall for each and loop until it stops.
const client = new OpenAI() // reads OPENAI_API_KEY from env
const { tools, handleToolCall } = toOpenAITools(createAppfiguresActions()) // reads APPFIGURES_API_KEY

const messages: ChatCompletionMessageParam[] = [
	{ role: 'user', content: 'What are the latest downloads and revenue for Spotify?' },
]

while (true) {
	const { message } = (await client.chat.completions.create({ model: 'gpt-4o', messages, tools }))
		.choices[0]!
	messages.push(message)
	if (!message.tool_calls?.length) break
	for (const call of message.tool_calls) messages.push(await handleToolCall(call))
}
```

<!-- END example: openai -->

### LangChain

Bind the tools to your LangChain chat model:

<!-- BEGIN example: langchain -->

```ts
import { createAppfiguresActions } from '@appfigures/agent-toolkit'
import { toLangChainTools } from '@appfigures/agent-toolkit/langchain'
import type { BaseChatModel } from '@langchain/core/language_models/chat_models'

// `model` is your LangChain chat model, e.g. from `@langchain/openai`. For an automatic tool loop,
// hand `tools` to `createReactAgent` from `@langchain/langgraph` instead.
export async function run(model: BaseChatModel) {
	const { tools } = toLangChainTools(createAppfiguresActions()) // reads APPFIGURES_API_KEY from env
	return model.bindTools!(tools).invoke('What are the latest downloads and revenue for Spotify?')
}
```

<!-- END example: langchain -->

Every tool returns one of:

- `{ data }` on success. A `hints` field comes along when there's a caveat (see [Configuration](#configuration)).
- `{ error }` on a handled failure, shaped for the model to fix its input and retry. An unapproved write is one of these, with `error.causeType === 'refusal'`.
- `{ error }` with `causeType: 'unexpected'` on a bug. The model gets a sanitized `internal error in <tool>` message and a hint to retry once, then degrade. The real error goes to `onUnexpectedError` (a `createAppfiguresActions` option), never to the model.

For a framework these adapters don't cover, drive the action surface directly: `actions.list()` gives you the tool metadata to register, and `actions.execute({ path, input, signal })` runs one. If your agent writes code instead, the client below runs anywhere.

The full tools reference is in [`docs/tools-api.md`](./docs/tools-api.md): the write gate, results, scoping, and per-request auth.

## The client for code your agent writes

Tools are for an agent running inside a framework. But an agent also writes code: scripts, scheduled jobs, one-off analyses. For those, use the client. It calls Appfigures directly and returns typed data. Where a tool returns `{ data }` or `{ error }`, the client returns the data itself and throws on failure.

It's the same actions as the tools, called as methods:

```ts
import { AppfiguresAgentClient } from '@appfigures/agent-toolkit'

const af = new AppfiguresAgentClient({ apiKey: process.env.APPFIGURES_API_KEY })

const { results } = await af.apps.search({ q: 'spotify', count: 1 })
const spotify = results[0]
// spotify.name, spotify.downloads_last_month, spotify.revenue_last_month_usd, spotify.storefronts …

const tracked = await af.apps.tracked() // no required input
```

The first draft runs, because:

- **Data is the return value.** `console.log(await af.metrics.query(…))` prints the data. There's no envelope to unwrap.
- **Fully type-safe.** Inputs and results are typed, so a wrong call fails to compile.
- **One error type.** Every failure throws `AppfiguresActionError`, with `causeType`, `action`, `suggestedActions`, and `hints`. Catch it with `isAppfiguresActionError`, not `instanceof`.

The full client reference is in [`docs/client-api.md`](./docs/client-api.md): returned data, errors, hints, and authentication.

## Configuration

Every option has a safe default, so none of this is required to start.

- **Hints** — a caveat that rides with the result: truncated data, another page, a deprecated action. Tools read them inline; the client prints them to `stderr`. → [client](./docs/client-api.md#receive-hints) · [tools](./docs/tools-api.md#handle-a-result)
- **Approve writes** — every write refuses until you approve it, so a prompt-injected `reviews.reply` never posts. → [tools-api.md](./docs/tools-api.md#approve-writes)
- **Scope the surface** — expose only the actions you choose, by path or group wildcard. → [tools-api.md](./docs/tools-api.md#scope-which-actions-are-exposed)
- **Bring your own transport** — customize the built-in one (retries, a proxy, a non-production base URL) or replace it outright. → [client](./docs/client-api.md#configure-authentication) · [tools](./docs/tools-api.md#configure-authentication)
- **Authenticate each request** — build the surface once and vary credentials per call, for a server serving many users. → [tools-api.md](./docs/tools-api.md#authenticate-each-request)

## Action reference

Full parameters and examples for each action are in [`docs/api-reference.md`](./docs/api-reference.md). The tools mirror these as `apps_get`, `metrics_query`, and so on.

<!-- BEGIN auto-generated API REFERENCE -->

### apps

- [**`af.apps.search`**](./docs/api-reference.md#af-apps-search) — Find apps by name or publisher.
- [**`af.apps.get`**](./docs/api-reference.md#af-apps-get) — Get an app's record: basic metadata (name, developer, etc) and, if the user tracks it, what data they can access.
- [**`af.apps.tracked`**](./docs/api-reference.md#af-apps-tracked) — List the apps your Appfigures account tracks.
- [**`af.apps.breakdown`**](./docs/api-reference.md#af-apps-breakdown) — Count your tracked apps by data group (e.g.

### explorer

- [**`af.explorer.listProducts`**](./docs/api-reference.md#af-explorer-listProducts) — Read catalog fields for one app or many.
- [**`af.explorer.aggregateProducts`**](./docs/api-reference.md#af-explorer-aggregateProducts) — Aggregate across the full catalog of millions of products across Apple, Google Play, Amazon, and other major stores: counts, averages, min/max, and histograms over any set of matching products.
- [**`af.explorer.describeFields`**](./docs/api-reference.md#af-explorer-describeFields) — List the catalog fields and the current user's access level for each.

### metrics

- [**`af.metrics.query`**](./docs/api-reference.md#af-metrics-query) — Query any numeric dataset for one or more apps.
- [**`af.metrics.describeDatasets`**](./docs/api-reference.md#af-metrics-describeDatasets) — List every numeric dataset `af.metrics.query` accepts, one row per dataset with its value type and whether it's limited to your own apps.

### store

- [**`af.store.appRanks`**](./docs/api-reference.md#af-store-appRanks) — Trace rank history for one or more apps across countries, device types, category subtypes, and categories, as time-series positions with day-over-day deltas.
- [**`af.store.topCharts`**](./docs/api-reference.md#af-store-topCharts) — List the top apps in a category chart for a given country and category, with current positions and day-over-day deltas.
- [**`af.store.categories`**](./docs/api-reference.md#af-store-categories) — List every store category with its ID.
- [**`af.store.featured`**](./docs/api-reference.md#af-store-featured) — List featured and editorial placements for an app or storefront product.
- [**`af.store.appListing`**](./docs/api-reference.md#af-store-appListing) — Read the full store listing for one storefront: localized text (name, subtitle, description, release notes) plus screenshots, video, categories, monetization, supported devices, country availability, price, ratings, file size, and age rating.

### audience

- [**`af.audience.demographics`**](./docs/api-reference.md#af-audience-demographics) — Read an app's audience demographics: the estimated age and gender breakdown.
- [**`af.audience.crossUsage`**](./docs/api-reference.md#af-audience-crossUsage) — Find the apps that an app's users also use.

### reviews

- [**`af.reviews.list`**](./docs/api-reference.md#af-reviews-list) — Read individual reviews for one or more apps.
- [**`af.reviews.breakdown`**](./docs/api-reference.md#af-reviews-breakdown) — Aggregate review counts for one or more apps, bucketed by dimension.
- [**`af.reviews.reply`**](./docs/api-reference.md#af-reviews-reply) — Post or withdraw a developer response on a specific review. _(write)_

### keywords

- [**`af.keywords.organic`**](./docs/api-reference.md#af-keywords-organic) — Check the organic keywords one or more apps rank for, with position, popularity, and competitiveness.
- [**`af.keywords.paid`**](./docs/api-reference.md#af-keywords-paid) — List the paid keywords one or more apps run ads on, with impression share and organic rank.
- [**`af.keywords.trackedRanks`**](./docs/api-reference.md#af-keywords-trackedRanks) — View where all your tracked keywords rank for a single app+country combo, with each keyword's current position, movement since it last changed, starting position, popularity, and competitiveness.
- [**`af.keywords.trackedTrend`**](./docs/api-reference.md#af-keywords-trackedTrend) — Trace how one tracked keyword's rank changes over time for a single app+country combo.
- [**`af.keywords.suggestions`**](./docs/api-reference.md#af-keywords-suggestions) — Discover keyword ideas to consider targeting for a single app+country combo, ranked by relevance to the app and including some drawn from apps you compete with.
- [**`af.keywords.rankingApps`**](./docs/api-reference.md#af-keywords-rankingApps) — List the apps ranking for a specific keyword in organic search, plus the keyword's own popularity and competitiveness scores.
- [**`af.keywords.advertisers`**](./docs/api-reference.md#af-keywords-advertisers) — List the apps advertising on a specific keyword, with each advertiser's impression share, organic rank, and how long they've been bidding.
- [**`af.keywords.related`**](./docs/api-reference.md#af-keywords-related) — Find keywords related to a seed term for ASO research.
- [**`af.keywords.tracked`**](./docs/api-reference.md#af-keywords-tracked) — List tracked keywords with their opaque IDs.
- [**`af.keywords.track`**](./docs/api-reference.md#af-keywords-track) — Track a keyword to monitor your app's hourly rank for it over time and get automatic alerts when its position moves. _(write)_
- [**`af.keywords.untrack`**](./docs/api-reference.md#af-keywords-untrack) — Stop tracking a keyword. _(write)_

### appleAds

- [**`af.appleAds.organizations`**](./docs/api-reference.md#af-appleAds-organizations) — List the Apple Ads organizations you manage campaigns in, with each one's currency and timezone.
- [**`af.appleAds.campaigns`**](./docs/api-reference.md#af-appleAds-campaigns) — List your Apple Ads campaigns with each one's status, budget, targeted countries, and schedule.
- [**`af.appleAds.adGroups`**](./docs/api-reference.md#af-appleAds-adGroups) — List Apple Ads ad groups with each one's default bid, CPA cap, pricing model, and schedule.
- [**`af.appleAds.keywords`**](./docs/api-reference.md#af-appleAds-keywords) — List a campaign's bid keywords with each keyword's performance (impressions, taps, installs, spend, cost-per-install) over a date range, plus its match type, bid, and whether it's a targeting or negative term.
- [**`af.appleAds.searchTerms`**](./docs/api-reference.md#af-appleAds-searchTerms) — List the actual user search terms that triggered a campaign's ads, each with its all-time performance (impressions, taps, installs, spend, cost-per-install).
- [**`af.appleAds.report`**](./docs/api-reference.md#af-appleAds-report) — Report Apple Ads performance per campaign (impressions, taps, installs, spend, cost-per-install), plus an account-wide total, over a date range.
- [**`af.appleAds.topKeywords`**](./docs/api-reference.md#af-appleAds-topKeywords) — Rank a campaign's top-performing keywords by conversion rate, spend, and installs over a date range.

### sdks

- [**`af.sdks.list`**](./docs/api-reference.md#af-sdks-list) — List every known SDK with its id, or search to find a specific one.

<!-- END auto-generated API REFERENCE -->

## Reference guides

In [`docs/`](./docs):

- [`docs/api-reference.md`](./docs/api-reference.md) — every action's params, types, and examples
- [`docs/client-api.md`](./docs/client-api.md) — the typed client: calling actions, returned data, errors, hints, `signal`, authentication
- [`docs/tools-api.md`](./docs/tools-api.md) — the action surface and framework adapters: the write gate, results, scoping, per-request auth
- [`docs/recipes.md`](./docs/recipes.md) — worked recipes: real, multi-step flows shown as client calls
- [`docs/catalog_playbook.md`](./docs/catalog_playbook.md) — the `af.explorer.*` query grammar and field list
- [`docs/numeric_metrics.md`](./docs/numeric_metrics.md) — the datasets `af.metrics.query` accepts
- [`docs/glossary.md`](./docs/glossary.md) — key terms

An agent wired with the framework tools can fetch the last three at runtime via the `docs_get` tool.

## Examples

Client scripts in [`examples/client/`](./examples/client), each a real solution against live data. Run one with `npx tsx examples/client/<file>`:

- [`app-stats.ts`](./examples/client/app-stats.ts) — one app's downloads, revenue, 6-month trend, and rating spread.
- [`competitor-report.ts`](./examples/client/competitor-report.ts) — rank several apps head-to-head by last-month downloads and revenue.
- [`keyword-competition.ts`](./examples/client/keyword-competition.ts) — who ranks organically and who advertises on a keyword, plus related terms to target.
- [`review-triage.ts`](./examples/client/review-triage.ts) — an app's 1–2★ reviews by version and country, and the newest ones awaiting a reply.
- [`audience-overlap.ts`](./examples/client/audience-overlap.ts) — an app's age and gender split, and the apps its audience shares.

Tool-wiring for each framework in [`examples/tools/`](./examples/tools), matching the snippets [above](#tools-for-your-agent-framework):

- [`openai-tools.ts`](./examples/tools/openai-tools.ts) — the OpenAI tool-call loop, runnable end-to-end with an OpenAI key.
- [`ai-sdk-tools.ts`](./examples/tools/ai-sdk-tools.ts) — Vercel AI SDK wiring, exported as `run(model)` so you pass your provider's model.
- [`langchain-tools.ts`](./examples/tools/langchain-tools.ts) — LangChain wiring via `bindTools`, exported as `run(model)` for your chat model.

## About this repository

`@appfigures/agent-toolkit` is built from Appfigures' internal monorepo and published as a compiled bundle. The `dist/` files here are the released build, not editable source. Bug reports and feature requests are welcome in the issue tracker. Code changes are made upstream, so this repo doesn't accept pull requests.
