import { a as AdapterToolsOptions, n as AppfiguresActions } from "./actions-DrqZx_9c.js";
import { ChatCompletionFunctionTool, ChatCompletionMessageToolCall, ChatCompletionToolMessageParam } from "openai/resources";
import { FunctionTool, ResponseFunctionToolCall, ResponseInputItem } from "openai/resources/responses/responses";
//#region .gen/stage/openai.d.ts
/** Optional per-call controls forwarded to the action pipeline. */
interface HandleToolCallOptions {
  /** Abort the underlying request (thread your run's `AbortController` through here). */
  signal?: AbortSignal;
}
/**
 * Project an Appfigures action surface into OpenAI tools for the Responses API (`responses.create`) — no
 * agent framework required. OpenAI's raw API doesn't execute tools for you, so this returns a kit:
 *
 * - **`tools`** — the `FunctionTool[]` you pass as `tools` to `responses.create`. Each leaves `strict`
 *   unset, so OpenAI runs it in strict mode whenever its schema allows.
 * - **`handleToolCall`** — runs one `function_call` output item through the canonical pipeline (parse →
 *   mutation gate → `runAction` → hints) and returns the `function_call_output` item to push back into
 *   `input`. It passes the call's `call_id` as the `execute`-hook `payload`.
 * - **`mutations`** — `{ toolName → level }` for the write actions, so a call site can gate them before
 *   dispatching (the pipeline also refuses any un-approved write on its own).
 *
 * ```ts
 * const { tools, handleToolCall } = toOpenAIResponsesTools(createAppfiguresActions({ apiKey }))
 * const res = await openai.responses.create({ model, input, tools })
 * input.push(...toResponseInputItems(res.output))
 * for (const item of res.output) {
 * 	if (item.type === 'function_call') input.push(await handleToolCall(item))
 * }
 * ```
 *
 * The Responses API is the one OpenAI's current models call tools through. On Chat Completions (or a
 * provider that only speaks it), use {@link toOpenAITools} instead.
 *
 * Reads run on their own; every mutation refuses unless the surface's `confirmMutation` approves it — the guard
 * against prompt-injected writes.
 */
declare function toOpenAIResponsesTools(actions: AppfiguresActions, options?: AdapterToolsOptions<{
  toolCallId: string;
}>): {
  tools: FunctionTool[];
  handleToolCall: (call: ResponseFunctionToolCall, opts?: HandleToolCallOptions) => Promise<ResponseInputItem.FunctionCallOutput>;
  mutations: Record<string, string>;
};
/**
 * Project an Appfigures action surface into OpenAI tools for Chat Completions (`chat.completions.create`) — no
 * agent framework required. OpenAI's raw API doesn't execute tools for you, so this returns a kit:
 *
 * - **`tools`** — the `ChatCompletionTool[]` you pass as `tools` to `chat.completions.create`.
 * - **`handleToolCall`** — runs one tool call through the canonical pipeline (parse → mutation gate →
 *   `runAction` → hints) and returns the `{ role: 'tool' }` message to push back into `messages`. It
 *   passes the call's `id` as the `execute`-hook `payload`.
 * - **`mutations`** — `{ toolName → level }` for the write actions, so a call site can gate them before
 *   dispatching (the pipeline also refuses any un-approved write on its own).
 *
 * ```ts
 * const { tools, handleToolCall } = toOpenAITools(createAppfiguresActions({ apiKey }))
 * const res = await openai.chat.completions.create({ model, messages, tools })
 * for (const call of res.choices[0].message.tool_calls ?? []) {
 * 	messages.push(await handleToolCall(call))
 * }
 * ```
 *
 * OpenAI's current models call tools through the Responses API, and some don't call tools on Chat
 * Completions at all — use {@link toOpenAIResponsesTools} with them. This one is for Chat Completions models
 * and the providers that only speak Chat Completions.
 *
 * Reads run on their own; every mutation refuses unless the surface's `confirmMutation` approves it — the guard
 * against prompt-injected writes.
 */
declare function toOpenAITools(actions: AppfiguresActions, options?: AdapterToolsOptions<{
  toolCallId: string;
}>): {
  tools: ChatCompletionFunctionTool[];
  handleToolCall: (toolCall: ChatCompletionMessageToolCall, opts?: HandleToolCallOptions) => Promise<ChatCompletionToolMessageParam>;
  mutations: Record<string, string>;
};
//#endregion
export { type AdapterToolsOptions, type AppfiguresActions, HandleToolCallOptions, toOpenAIResponsesTools, toOpenAITools };