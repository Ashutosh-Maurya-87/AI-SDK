import 'dotenv/config'
import {
    Agent, tool, defineToolInputGuardrail, defineToolOutputGuardrail, run,
    ToolGuardrailFunctionOutputFactory
} from '@openai/agents'
import { z } from 'zod'

// TOOL INPUT GUARDRAIL: Ensure input is not empty or non-text
const textValidator = defineToolInputGuardrail({
    name: 'block Request',
    run: async ({ toolCall }) => {
        const args = JSON.parse(toolCall.arguments)
        if (!args.text && typeof args.text !== 'string') {
            return ToolGuardrailFunctionOutputFactory.rejectContent('Input must be a valid string')
        }
        return ToolGuardrailFunctionOutputFactory.allow()
    }
})

// TOOL OUTPUT GUARDRAIL: Ensure the result is a reasonable number
const vowelsCountValidator = defineToolOutputGuardrail({
    name: 'vowels count validator',
    run: async ({ output }) => {
        const count = parseInt(String(output))
        if (isNaN(count) || count < 0) {
            return ToolGuardrailFunctionOutputFactory.rejectContent('Result must be a positive number')
        }
        return ToolGuardrailFunctionOutputFactory.allow()
    }
})

const vowelCounterTool = tool({
    name: 'Count present vowel',
    description: 'Count the number of vowels in a given text.',
    parameters: z.object({ text: z.string() }),
    inputGuardrails: [textValidator],
    outputGuardrails: [vowelsCountValidator],
    execute: async ({ text }) => {
        const match = text.match(/[aeiou]/gi)
        return match ? match.length : 0
    }
})
const vowelsCountAgent = new Agent({
    name: 'Count Vowels Agent',
    instructions: `You are an expert in counting the vowels from the user query.`,
    tools: [vowelCounterTool]
})
async function runAgent(q = '') {
    try {
        const res = await run(vowelsCountAgent, q)
        console.log('response are:-', res.finalOutput)
    } catch (error) {
        console.log('errror', error)
    }
}
// runAgent('Hello ! I Love my India')
runAgent('5689454554545')