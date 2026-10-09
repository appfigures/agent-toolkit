# Changelog

## [2.0.0] — 2026-10-09

### Added

- **Tracked-app breakdown.** Count your tracked apps by the data available for them, storefront, monetization model, and whether they're yours or competitors'.
- **Review responses.** Reviews now include your response, and you can filter and count reviews by whether you've responded.
- **Store listing ratings.** An app's store listing now shows its star rating and number of ratings.
- **Monetization on app records.** Each storefront's record for an app now shows how it makes money.
- **Tool metadata without the client.** Read every tool's name, description, and input schema as plain data, for building your own integration or approval UI in the browser.
- **Stable tool descriptions.** Fix the dates used in tool descriptions so they stay the same from day to day and keep prompt caches warm.

### Fixed

- **Replying to a review returns a confirmation.** It previously reported an error after the reply had already posted.
- **Tracking a keyword for another app or country keeps its existing tracking.** It previously stopped tracking the keyword everywhere else and counted it against your keyword limit again.
- **Other data refinements.**

### Breaking

- **`store.appRanks` returns free and paid chart ranks by default.** Pass `subtypes: ['free']` for the previous default.
- **`reviews.reply` returns a plain confirmation and counts as a destructive write.** Its result type is now `{ accepted: true }`, and approval callbacks receive it as `destructive` instead of `create`.

## [1.0.0] — 2026-08-19

First public release.

### Added

- Typed client (`AppfiguresAgentClient`): every action is a typed method that returns typed data and throws a single error type.
- Agent tools for the Vercel AI SDK, OpenAI, and LangChain.
- App-market data for any app on any major store, your own or a competitor's: download and revenue estimates and other numeric metrics, reviews and ratings, rank history and top charts, store listings and featured placements, organic and paid keywords and ASO, audience demographics, Apple Ads, and catalog search across millions of apps.
- Reads run on their own; every write waits for your explicit approval, so a prompt-injected write can't post on the model's word alone.
