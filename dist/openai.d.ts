import { a as AdapterToolsOptions, n as AppfiguresActions } from "./actions-CMfmwPV6.js";
import { ChatCompletionFunctionTool, ChatCompletionMessageToolCall, ChatCompletionToolMessageParam } from "openai/resources";
//#region .gen/stage/openai.d.ts
/** Optional per-call controls forwarded to the action pipeline. */
interface HandleToolCallOptions {
  /** Abort the underlying request (thread your run's `AbortController` through here). */
  signal?: AbortSignal;
}
/**
 * Project an Appfigures action surface into OpenAI tools, for the base `openai` SDK's Chat Completions
 * (and Responses) function calling — no agent framework required. Unlike the AI-SDK / LangChain adapters,
 * OpenAI's raw API doesn't execute tools for you, so this returns a two-part kit:
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
export { type AdapterToolsOptions, type AppfiguresActions, HandleToolCallOptions, toOpenAITools };