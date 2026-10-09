import { a as AdapterToolsOptions, n as AppfiguresActions } from "./actions-CMfmwPV6.js";
import { Tool } from "ai";
//#region .gen/stage/ai.d.ts
/**
 * Project an Appfigures action surface into AI SDK tools. Reads run on their own; every mutation refuses
 * unless the surface's `confirmMutation` approves it (see `createAppfiguresActions`).
 *
 * Returns the `tools` map plus a `mutations` map (tool name → level). AI SDK 7 deprecated tool-level
 * `needsApproval` for call-site `toolApproval`, and a `Promise<boolean>` inside `execute` can't drive a UI
 * approval round-trip — so the metadata is the durable hook for a host-side approval flow (see the README
 * `toolApproval` recipe). Each tool passes AI SDK's `toolCallId` as the `execute`-hook `payload`, so a host's
 * per-request client can attribute the call.
 */
declare function toAISDKTools(actions: AppfiguresActions, options?: AdapterToolsOptions<{
  toolCallId: string;
}>): {
  tools: Record<string, Tool>;
  mutations: Record<string, string>;
};
//#endregion
export { type AdapterToolsOptions, type AppfiguresActions, toAISDKTools };