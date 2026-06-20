import 'dotenv/config'
import { Agent, InputGuardrailTripwireTriggered, run, tool } from '@openai/agents'
import { z } from 'zod'

const getStructuredOuptutSchema = z.object({
    isValidCodingQuestion: z.boolean().describe('This will use to validate the input'),
    reason: z.string().optional().describe('Reason of rejected')
})
const codingInputAgent = new Agent({
    name: 'Coding question related query checker',
    instructions: `You are an input guardrail agent that check if
    the user query is a coding related questions or not.
    Rules-
       - The question has to be only coding related question strictly.
       - Reject Any input which is not related to the coding questions.`,
    outputType: getStructuredOuptutSchema
})
// making custom input guardrail
const codingInputGuardrail = {
    name: 'Coding Guardrail',
    // Set runInParallel to false to block the model until the guardrail completes and for cost minimazation.
    runInParallel: false,
    execute: async ({ input }) => {
        const res = await run(codingInputAgent, input)
        return {
            tripwireTriggered: !res.finalOutput.isValidCodingQuestion,
            outputInfo: res.finalOutput.reason
        }
    }
}

const codingTutor = new Agent({
    name: 'coding tutor',
    instructions: `You are an expert coding instructor. 
    You will teach the coding and give the answer of 
    all coding related questions.`,
    inputGuardrails: [codingInputGuardrail]
})

async function runCodingAgent(q = '') {
    try {
        const res = await run(codingTutor, q)
        console.log('resposne', res.finalOutput)

    } catch (error) {
        if (error instanceof InputGuardrailTripwireTriggered) {
            console.log(`Rejected Query Reason is: ${error.message}`)
        }
    }
}

// runCodingAgent('Write the code of find prime number from 1 to 10 in js.')
runCodingAgent('2+2*2') // give error because of guardrails
// runCodingAgent('Write the poem on Love') // rejected
// runCodingAgent(`
//     const obj = {
//     text: 'LOGGING',
//     list: ['1', '2', '3'],
//     log() {
//         this.list.forEach(function (item) {
//             console.log(this.text + item); // OUTPUT ????
//         });
//     },
// };
// obj.log()`)