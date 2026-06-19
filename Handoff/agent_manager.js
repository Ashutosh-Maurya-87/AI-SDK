import 'dotenv/config'
import { Agent, run, tool } from '@openai/agents'
import { z } from 'zod'
import fs from 'node:fs'

const getStrucutredOutput = z.object({
    plan_id: z.string().describe('Id of the internet plan'),
    price: z.number().describe('Price of the plan'),
    speed: z.string().describe('Speed of the plan')
})
const fetchAvailablePlans = tool({
    name: 'fetch available plans',
    description: 'fetch the available plan for internet',
    parameters: z.object({}),
    execute: async function () {
        return [
            {
                plan_id: '1',
                price: 199,
                speed: '10 mbps'
            }, {
                plan_id: '2',
                price: 499,
                speed: '30 mbps'
            }, {
                plan_id: '3',
                price: 999,
                speed: '100 mbps'
            }
        ]
    }
})
const getRefund = tool({
    name: 'get the refund',
    description: 'This tool process the redund for the customer',
    parameters: z.object({
        custId: z.string().describe('The customer ID'),
        reason: z.string().describe('The reason for the refund')
    }),
    execute: async function ({ custId, reason }) {
        await fs.promises.appendFile('./refund.txt',
            `Refund for customer having id ${custId} for the reason ${reason}\n`,
            { encoding: 'utf-8' }
        );
        return { refundIssued: true }
    }
})
const refundAgent = new Agent({
    name: 'Refund Agent',
    instructions: 'You are an expert in issuing the refund to the customer',
    tools: [getRefund]
})
const salesAgent = new Agent({
    name: 'sales_agent',
    instructions: `You are an expert sales agent for an internet broadband company. Talk to the user and
    help them what they need`,
    tools: [fetchAvailablePlans,
        refundAgent.asTool({
            toolName: 'refund_expert',
            toolDescription: 'Handles refund questions and requests.',
        })
    ],
    // outputType: getStrucutredOutput
})

const runAgent = async (query = '') => {
    const res = await run(salesAgent, query)
    console.log('----->', res.finalOutput)
}
// runAgent(`Hey there! I want to know the plan availabe.I want home internet plan.
//      There is 5 users and they will use it for gaming also and the budget is around 100.
//      My pincode is-123456 and area is ludhiana.`)

runAgent(`I have a plan of 499. 
    Now i wanted to refund right now my customer id is cust456 reason is that i am not satisfied with this speed of internet.`)