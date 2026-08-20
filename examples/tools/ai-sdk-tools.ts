// Vercel AI SDK: wire the Appfigures tools into a generateText call. Pass your provider's model.
// The `// #region readme` block below is injected into the README, so it stays real and compiling.
// #region readme
import { createAppfiguresActions } from '@appfigures/agent-toolkit'
import { toAISDKTools } from '@appfigures/agent-toolkit/ai'
import { generateText, stepCountIs, type LanguageModel } from 'ai'

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
// #endregion
