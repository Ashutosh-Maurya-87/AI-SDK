import 'dotenv/config'
import { Agent, run, tool } from '@openai/agents'
import { z } from 'zod'
import fs from 'node:fs/promises'
import { RECOMMENDED_PROMPT_PREFIX } from '@openai/agents-core/extensions';

const refundTool = tool({
    name: 'Get the Refund',
    description: 'This tool give the refund.',
    parameters: z.object({
        bookingId: z.number().describe('Booking id number'),
        reason: z.string().describe('Reason for the refund amount')
    }),
    execute: async function ({ bookingId, reason }) {
        await fs.appendFile('./refund.txt',
            `Refund for the booking id ${bookingId} for the reason ${reason}\n has been processed\n`,
            { encoding: 'utf-8' });
        return { refundProcessed: true }
    }
})
const refundAgent = new Agent({
    name: 'Refund Agent',
    instructions: 'You are an expert refund agent. And you will provide the refund to the customer.',
    tools: [refundTool]
})

const handleSalesMarketingTool = tool({
    name: 'Handling Sales and Marketing Tool',
    description: 'This tool handle the sales and marketing area and Provide the vacant room to the customer',
    parameters: z.object({}),
    execute: async function () {
        return [
            { id: 1, room_no: '421', status: 'vacant',date:'12/06/2026' },
            { id: 11, room_no: '521', status: 'vacant',date:'18/06/2026' },
            { id: 111, room_no: '621', status: 'vacant',date:'20/06/2026' },
            { id: 1111, room_no: '721', status: 'vacant',date:'25/06/2026' }
        ]
    }
})
const salesAndMarketingAgent = new Agent({
    name: 'Sales And Marketing Agent',
    instructions: 'You are an expert sales and marketing agents. Which will get the customer queries and handle that. And You will provide the room according to the status of the room. And also handle all the hotel related queries',
    tools: [handleSalesMarketingTool]
})

const frontStaff = new Agent({
    name: 'Front Staff',
    instructions: `${RECOMMENDED_PROMPT_PREFIX} You are an expert front desk receptionist of the hotel. You will handle the customer queries`,
    // tools:[]
    handoffDescription: `You have two agents availabel:
      - salesAndMarketingAgent: expert in sales and marketing and handle the customer queries. Good for new Customer.
      - refundAgent: Expert in handling queries of exisitng customer and issues refunds and help them.`,
    handoffs: [salesAndMarketingAgent, refundAgent]
})
async function main(query = '') {
    const res = await run(frontStaff, query)
    console.log('response of Agent--', res.finalOutput)
    console.log('response.histroy', res.history)
}
main(`I booked a room. but unfortunately i am not able to reach the hotel so right now i want refund.
    MY booking id is 123456 and room number 421 and the date is 12/06/2026. Give me the refund.`)
// main(`Hey there! is there any room vacant?. if any room available please tell me the room number and also give the date in which date that room are available.`)