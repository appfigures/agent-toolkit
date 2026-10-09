import { a as AdapterToolsOptions, n as AppfiguresActions } from "./actions-CMfmwPV6.js";
import { StructuredToolInterface, ToolRunnableConfig } from "@langchain/core/tools";
//#region .gen/stage/langchain.d.ts
/**
 * Project an Appfigures action surface into LangChain tools. Returns an array you hand to
 * `model.bindTools([...])` or an agent, plus a `mutations` map (`{ toolName → level }`) so a call site can
 * gate writes before running.
 *
 * ```ts
 * const { tools } = toLangChainTools(createAppfiguresActions({ apiKey }))
 * const agent = createReactAgent({ llm, tools })
 * ```
 *
 * Reads run on their own; every mutation refuses unless the surface's `confirmMutation` approves it — the guard
 * against prompt-injected writes. Each tool runs the canonical pipeline (parse → mutation gate →
 * `runAction` → hints) and returns a JSON string the model reads back.
 */
declare function toLangChainTools(actions: AppfiguresActions, options?: AdapterToolsOptions<ToolRunnableConfig | undefined>): {
  tools: StructuredToolInterface[];
  mutations: Record<string, string>;
};
//#endregion
export { type AdapterToolsOptions, type AppfiguresActions, toLangChainTools };