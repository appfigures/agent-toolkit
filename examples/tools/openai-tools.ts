#!/usr/bin/env node
// Usage: OPENAI_API_KEY=… APPFIGURES_API_KEY=… npx tsx examples/tools/openai-tools.ts
// The `// #region readme` block below is injected into the README, so it stays real and compiling.
// #region readme
import { createAppfiguresActions } from '@appfigures/agent-toolkit'
import { toOpenAIResponsesTools } from '@appfigures/agent-toolkit/openai'
import OpenAI from 'openai'
import { toResponseInputItems } from 'openai/lib/responses/ResponseInputItems'
import type { ResponseInputItem } from 'openai/resources/responses/responses'

// The OpenAI SDK doesn't run tools for you: call handleToolCall for each and loop until it stops.
const client = new OpenAI() // reads OPENAI_API_KEY from env
const { tools, handleToolCall } = toOpenAIResponsesTools(createAppfiguresActions()) // reads APPFIGURES_API_KEY

const input: ResponseInputItem[] = [
	{ role: 'user', content: 'What are the latest downloads and revenue for Spotify?' },
]

while (true) {
	const response = await client.responses.create({ model: 'gpt-6.1-sol', input, tools })
	// Send the model's output back with the tool results; reasoning models need their reasoning items too.
	input.push(...toResponseInputItems(response.output))
	const calls = response.output.filter((item) => item.type === 'function_call')
	if (!calls.length) {
		console.log(response.output_text)
		break
	}
	for (const call of calls) input.push(await handleToolCall(call))
}
// #endregion
