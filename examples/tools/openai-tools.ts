#!/usr/bin/env node
// Usage: OPENAI_API_KEY=… APPFIGURES_API_KEY=… npx tsx examples/tools/openai-tools.ts
// The `// #region readme` block below is injected into the README, so it stays real and compiling.
// #region readme
import { createAppfiguresActions } from '@appfigures/agent-toolkit'
import { toOpenAITools } from '@appfigures/agent-toolkit/openai'
import OpenAI from 'openai'
import type { ChatCompletionMessageParam } from 'openai/resources'

// The OpenAI SDK doesn't run tools for you: call handleToolCall for each and loop until it stops.
const client = new OpenAI() // reads OPENAI_API_KEY from env
const { tools, handleToolCall } = toOpenAITools(createAppfiguresActions()) // reads APPFIGURES_API_KEY

const messages: ChatCompletionMessageParam[] = [
	{ role: 'user', content: 'What are the latest downloads and revenue for Spotify?' },
]

while (true) {
	const { message } = (await client.chat.completions.create({ model: 'gpt-4o', messages, tools }))
		.choices[0]!
	messages.push(message)
	if (!message.tool_calls?.length) break
	for (const call of message.tool_calls) messages.push(await handleToolCall(call))
}
// #endregion

console.log(messages.at(-1)?.content)
