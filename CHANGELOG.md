# Changelog

## [1.0.0] — 2026-08-19

First public release.

### Added

- Typed client (`AppfiguresAgentClient`): every action is a typed method that returns typed data and throws a single error type.
- Agent tools for the Vercel AI SDK, OpenAI, and LangChain.
- App-market data for any app on any major store, your own or a competitor's: download and revenue estimates and other numeric metrics, reviews and ratings, rank history and top charts, store listings and featured placements, organic and paid keywords and ASO, audience demographics, Apple Ads, and catalog search across millions of apps.
- Reads run on their own; every write waits for your explicit approval, so a prompt-injected write can't post on the model's word alone.
