import 'dotenv/config'
import { Agent, OutputGuardrailTripwireTriggered, run, tool } from '@openai/agents'
import { z } from 'zod'

const outputSchema = z.object({
    reason: z.string().describe('Reason for rejected'),
    isMathQuestion: z.boolean().describe('Check is the output have math questions or not')
})
const mathAgentOutputGuardrail = new Agent({
    name: 'Match Questions Guardrail Checker',
    instructions: `Check if the output have any math related questions or not.
    Rules -
       - The query have only math related question strictly.
       - Reject any other query if not related to math even though if it have any coding quesitons.`,
    // structured output schema--
    outputType: outputSchema
})
const agentOuptputGuardrail = {
    name: 'Output Agent Guardrail',
    execute: async ({ agentOutput, context }) => {
        console.log('context having:', context)
        const res = await run(mathAgentOutputGuardrail, agentOutput.response, { context })
        return {
            outputInfo: res.finalOutput.reason,
            tripwireTriggered: !res.finalOutput.isMathQuestion ?? true
        }
    }
}
const mathAgent = new Agent({
    name: 'Math Support Agent',
    instructions: `You are a user support agent. You help users with their questions.`,
    outputGuardrails: [agentOuptputGuardrail],
    outputType: z.object({ response: z.string() })
})

async function runMathAgent(q = '') {
    await run(mathAgent, q).then((res) => {
        console.log('response of Math AGent:', res.finalOutput)
        console.log('response of Math AGent:', res.finalOutput.response)
    }).catch((error) => {
        if (error instanceof OutputGuardrailTripwireTriggered) {
            console.log('Math output guardrail tripped')
        }
        console.log('error', error)
    })
}
// runMathAgent('Hello, can you help me solve for x: 2x + 3 = 11?')
runMathAgent('Hello, can you help me to wrote code for sum of two number in js?')