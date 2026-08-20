# Appfigures Agent Client

`AppfiguresAgentClient` is a typed client for when your agent writes code: scripts, scheduled jobs, one-off analyses.

> Calling actions as tools inside a framework instead? Use [Appfigures Tools](./tools-api.md) — the same actions, shaped for a model to call.

```ts
import { AppfiguresAgentClient } from '@appfigures/agent-toolkit'

const af = new AppfiguresAgentClient({ apiKey: process.env.APPFIGURES_API_KEY })

const { results } = await af.apps.search({ q: 'spotify', count: 1 })
const app = results[0]
console.log(app.name, app.downloads_last_month, app.revenue_last_month_usd)
```

## Essentials

### Create a client

```ts
const af = new AppfiguresAgentClient() // reads APPFIGURES_API_KEY from the environment
```

Pass `apiKey` explicitly to override the environment. Construction throws when neither supplies a key. Get one at https://appfigures.com/developers/keys.

### Call an action

Each action is a method, `af.<group>.<action>`:

```ts
const app = await af.apps.get({ appId: 'ua_X7iNgb' })
```

The input is optional for an action that has no required fields:

```ts
const tracked = await af.apps.tracked()
```

Writes run immediately. `af.reviews.reply(…)` posts the reply and `af.keywords.track(…)` starts tracking, with no approval step, because you control the code that calls them. When a model chooses the calls instead, use the tools surface, where every write waits for [your approval](./tools-api.md#approve-writes).

Every action, its parameters, and worked examples are in the [API reference](./api-reference.md).

### Work with the returned data

An action resolves to its data. There is no envelope to unwrap:

```ts
const { metadata } = await af.reviews.breakdown({ filterAppsById: ['ua_X7iNgb'] })
console.log(metadata.total_count) // total reviews across the matched set
```

Inputs and results are fully typed, and the types ship with the package, so inference works without importing anything.

Every action's input and returned data is strictly JSON-serializable, so a result is safe to `JSON.stringify`, cache, or pass between processes as it is.

## Errors and hints

### Handle errors

Every failure throws an `AppfiguresActionError`:

- `causeType: 'input' | 'expected' | 'auth' | 'unexpected'` — switch on this to recover.
- `action: string` — the action that failed, as its dotted path (`apps.get`).
- `message: string` — the failure summary.
- `suggestedActions: string[]` — follow-up calls to try, in client form (`af.apps.get({ … })`).
- `hints: string[]` — guidance tied to this failure. Usually empty; see [Receive hints](#receive-hints).

Input is validated locally, so a malformed field throws with `causeType: 'input'` before any request goes out.

Detect it with `isAppfiguresActionError`; an `instanceof` check fails across bundler realms.

```ts
import { isAppfiguresActionError } from '@appfigures/agent-toolkit'

try {
	await af.apps.get({ appId: 'nope' })
} catch (error) {
	if (isAppfiguresActionError(error)) {
		switch (error.causeType) {
			case 'input': /* fix the arguments and retry */ break
			case 'auth': /* refresh the credential */ break
			case 'expected': /* show error.message to the user */ break
			case 'unexpected': throw error
		}
	}
}
```

### Receive hints

Some actions attach a hint to a result: the data was truncated, another page exists, an action is deprecated. Hints are how an agent notices a caveat and adjusts.

Hints never mix into your data. On success, the client delivers them to `onHints`. The default writer prints one line per hint to standard error, preceded once per process by a notice explaining the channel:

```
af hint: [metrics.query] Results were truncated. Narrow the date range.
```

Set `onHints` to control where they go:

- Omit it to print to standard error (the default).
- Pass `null` to silence hints.
- Pass a function, `({ action, hints }) => void`, to route them elsewhere.

On failure, hints ride on `error.hints` instead, and are not also written to standard error.

Keep hints on for an unattended agent: a "results truncated, narrow the date range" note steers its next call.

## Options

### Configure authentication

`apiKey` configures the built-in transport, which attaches your bearer token and calls the production API. To change how requests are made, pass a `transport` instead; the two are mutually exclusive.

For a key that rotates, pass an async getter. The client calls it before each request:

```ts
new AppfiguresAgentClient({ apiKey: () => getFreshToken() })
```

To customize the built-in transport (retries, a proxy, logging, or a non-production base URL), pass `defaultTransport`:

```ts
import { AppfiguresAgentClient, defaultTransport } from '@appfigures/agent-toolkit'

const af = new AppfiguresAgentClient({
	transport: defaultTransport({ apiKey, fetch: fetchWithRetry }),
})
```

To replace it, pass your own client: any object with a `fetch(path, init)` method. Your transport receives the bare request path and owns authentication, so the client attaches no `Authorization` header and needs no `apiKey`:

```ts
const af = new AppfiguresAgentClient({ transport: myClient })
```

### Abort a call

Pass a `signal` as the second argument:

```ts
const controller = new AbortController()
setTimeout(() => controller.abort(), 5000)

await af.metrics.query({ dataset: 'estimates.sales' }, { signal: controller.signal })
```

The signal is per-call; a shared one would abort every later call.

## Reference

### Exported types

`AppfiguresAgentClientOptions`, `CallOptions`, `HintsCallback`, `APIKey`, `FetchLike`, `AppfiguresTransport`, `DefaultTransportOptions`, and `ActionErrorCauseType`, along with every action's input and output type (`AppsGetInput`, `AppsSearchOutput`, `Product`, …). Import these when you need to name a type in your own signatures.
