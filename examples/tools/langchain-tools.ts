// LangChain: wire the Appfigures tools onto your chat model with bindTools. Pass your chat model.
// The `// #region readme` block below is injected into the README, so it stays real and compiling.
// #region readme
import { createAppfiguresActions } from '@appfigures/agent-toolkit'
import { toLangChainTools } from '@appfigures/agent-toolkit/langchain'
import type { BaseChatModel } from '@langchain/core/language_models/chat_models'

// `model` is your LangChain chat model, e.g. from `@langchain/openai`. For an automatic tool loop,
// hand `tools` to `createReactAgent` from `@langchain/langgraph` instead.
export async function run(model: BaseChatModel) {
	const { tools } = toLangChainTools(createAppfiguresActions()) // reads APPFIGURES_API_KEY from env
	return model.bindTools!(tools).invoke('What are the latest downloads and revenue for Spotify?')
}
// #endregion
