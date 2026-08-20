# Appfigures Tools

Project the Appfigures actions into your agent framework's tools. You build one framework-neutral action surface, then adapt it to the Vercel AI SDK, OpenAI, or LangChain, or drive it yourself. Reads run on their own; writes run only after you approve them.

> Writing code against Appfigures instead? Use the [Appfigures Agent Client](./client-api.md) — the same actions, as typed methods.

```ts
import { createAppfiguresActions } from '@appfigures/agent-toolkit'
import { toAISDKTools } from '@appfigures/agent-toolkit/ai'

const actions = createAppfiguresActions({ apiKey: process.env.APPFIGURES_API_KEY })
const { tools, mutations } = toAISDKTools(actions)
```

Install your framework's SDK next to the toolkit: `ai` for the Vercel AI SDK, `openai` for OpenAI, `@langchain/core` for LangChain. Full runnable examples for each are in the [README](../README.md#tools-for-your-agent-framework).

## Essentials

### Create the action surface

`createAppfiguresActions(options?)` returns an `AppfiguresActions` with two methods:

- `list(): ActionDescriptor[]` — the visible actions as model-facing metadata: `path`, the tool `name` (`apps_get`), `description`, `mutation` (the write level, or `undefined` for a read), and `inputJsonSchema`. Build your tool set from this.
- `execute(args): Promise<ExecuteResult>` — run one action and return a discriminated result. It never throws for an expected outcome. See [Handle a result](#handle-a-result).

The adapters call both for you. Call them yourself only to drive a framework the adapters don't cover, described in [Drive a custom framework](#drive-a-custom-framework).

### Add tools to your framework

Each adapter takes the surface and returns that framework's native tool shape, plus a `mutations` map. The write gate, hint resolution, and error shaping are identical across all three; only the returned shape differs.

- **Vercel AI SDK** — `toAISDKTools(actions, options?)` from `@appfigures/agent-toolkit/ai` returns `{ tools, mutations }`. `tools` is a `Record<string, Tool>` you pass to `generateText` or `streamText`. The framework runs the tools for you.
- **OpenAI** — `toOpenAITools(actions, options?)` from `@appfigures/agent-toolkit/openai` returns `{ tools, handleToolCall, mutations }`. The OpenAI SDK doesn't run tools for you: pass `tools` to `chat.completions.create`, then call `handleToolCall(call)` for each tool call and push the returned message back into `messages`.
- **LangChain** — `toLangChainTools(actions, options?)` from `@appfigures/agent-toolkit/langchain` returns `{ tools, mutations }`. `tools` is a `StructuredToolInterface[]`, ready for `bindTools` or an agent.

### Approve writes

Reads run on their own. A write — `reviews.reply`, `keywords.track`, `keywords.untrack` — runs only after you approve it.

This guards against prompt injection. A model can reach `reviews.reply` through review text it just read, and an attacker may have written that text, so a write never runs on the model's word alone.

Provide `confirmMutation` on the surface. The write runs only when it resolves `true`:

```ts
createAppfiguresActions({
	confirmMutation: async ({ path, mutation, input }) => path === 'reviews.reply',
})
```

Without it, a write returns `{ error: { causeType: 'refusal' } }` and does nothing.

Each adapter also returns a `mutations` map — `{ reviews_reply: 'create' }` — so you can drive an approval step at the call site:

```ts
const { tools, mutations } = toAISDKTools(createAppfiguresActions())
```

Reading `mutations` doesn't call the API, so a surface built with no credential is fine here. A tool call does; give the surface an `apiKey` or a `transport` before the model runs one.

### Handle a result

`execute` returns an `ExecuteResult`:

- `{ ok: true, data, hints }` on success.
- `{ ok: false, cause, message, suggestedActions, hints }` on any failure, where `cause` is `'input' | 'expected' | 'auth' | 'unexpected' | 'refusal'`.

The adapters map each result to the payload the model reads, with `toModelPayload`:

- success → `{ data, hints? }`
- failure → `{ error: { causeType, message, suggestedActions?, hints? } }`

A `refusal` is a write you didn't approve. An `unexpected` result is a bug: the raw error goes to [`onUnexpectedError`](#log-unexpected-errors), and the model receives a sanitized `internal error in <tool>` message plus a hint to retry once, then degrade. Every result is sanitized, so it's always safe to return to the model.

Every action's input and the returned `data` are strictly JSON-serializable. Per-call options (`signal`, `transport`) are runtime values, not part of it.

## Options

### Scope which actions are exposed

Limit the surface with `include` or `exclude`. Each takes action paths or group wildcards (`apps.*`), typed against the visible surface. `exclude` applies after `include`. An entry that matches nothing throws when you create the surface.

```ts
createAppfiguresActions({ include: ['metrics.query', 'apps.*'] })
createAppfiguresActions({ exclude: ['reviews.reply'] })
```

### Customize each tool

`mapDescriptor` transforms each `ActionDescriptor` as `list()` produces it, for example to add a display-only field your host UI needs on every tool. It runs once, at creation. `execute` is unaffected: it parses against the action's own schema and strips any field the schema doesn't define. Use this instead of wrapping the surface after you create it.

```ts
createAppfiguresActions({
	mapDescriptor: (descriptor) => ({ ...descriptor, /* your host's additions */ }),
})
```

### Log unexpected errors

`onUnexpectedError` observes bugs. `execute` passes the raw error here, then returns the sanitized message; the model never receives what you log.

```ts
createAppfiguresActions({
	onUnexpectedError: ({ path, error }) => captureError(error, { action: path }),
})
```

### Configure authentication

`apiKey` and `transport` behave exactly as on the client: `apiKey` configures the built-in transport, `transport` replaces it, and the two are mutually exclusive. Pass `defaultTransport({ apiKey, baseUrl, fetch })` as `transport` to customize the built-in one — a non-production base URL, retries, a proxy. See [Configure authentication](./client-api.md#configure-authentication) for the full seam.

### Authenticate each request

Build the surface once and authenticate each call as a different user, the multi-tenant case. Every adapter takes an `execute` hook that runs the call. Inside it, hand the surface's `execute` a per-call `transport`, and credentials vary per request with no rebuild.

```ts
const actions = createAppfiguresActions() // built once, no shared credential

const { tools } = toAISDKTools(actions, {
	execute: ({ path, input, payload, signal }) =>
		actions.execute({ path, input, signal, transport: currentUserClient() }),
})
```

`currentUserClient()` is your per-request client. `payload` carries the framework's per-call context: `{ toolCallId }` for the AI SDK and OpenAI, the `ToolRunnableConfig` for LangChain.

The same per-call `transport` is available without an adapter: `actions.execute({ path, input, transport })`.

## Reference

### Drive a custom framework

On a framework the adapters don't cover, use the surface directly. `actions.list()` gives you the metadata to register each tool, and `actions.execute({ path, input, signal })` runs one. Map the `ExecuteResult` with `toModelPayload`, or read its fields yourself. `resolveToolCall` is the per-call dispatch the built-in adapters share, exported for the same purpose.

### Exported types

`AppfiguresActions`, `AppfiguresActionsOptions`, `AdapterToolsOptions`, `ActionDescriptor`, `ExecuteArgs`, `ExecuteResult`, `ActionErrorCauseType`, and `ToolSelector`, plus the transport types (`APIKey`, `FetchLike`, `AppfiguresTransport`, `DefaultTransportOptions`) and every action's input and output type. `toModelPayload` and `resolveToolCall` are exported as values.
