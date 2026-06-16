import 'dotenv/config'
import { Agent, run, tool } from '@openai/agents'
import { z } from 'zod'
import fs from 'node:fs/promises'

const refundTool = tool({
    name: 'Get the Refund',
    description: 'This tool give the refund.',
    parameters: z.object({
        bookingId: z.number().describe('Booking id number'),
        reason: z.string().describe('Reason for the refund amount')
    }),
    execute: async function ({ custId, reason }) {
        await fs.appendFile('./refund.txt',
            `Refund for the customer id ${custId} for the reason ${reason}\n has been processed`,
            { encoding: 'utf-8' });
        return { refundProcessed: true }
    }
})
const refundAgent = new Agent({
    name: 'Refund Agent',
    instructions: 'You are an expert refund agent.',
    tools: [refundTool]
})

const handleSalesMarketingTool = tool({
    name: 'Handling Sales and Marketing Tool',
    description: 'This tool handle the sales and marketing area and Provide the vacant room to the customer',
    parameters: z.object({}),
    execute: async function () {
        return [
            { id: 1, room_no: '421', status: 'vacant' },
            { id: 11, room_no: '521', status: 'vacant' },
            { id: 111, room_no: '621', status: 'vacant' },
            { id: 1111, room_no: '721', status: 'vacant' }
        ]
    }
})
const salesAndMarketingAgent = new Agent({
    name: 'Sales And Marketing Agent',
    instructions: 'You are an expert sales and marketing agents. Which will get the customer queries and handle that.',
    tools: [handleSalesMarketingTool]
})

const frontStaff = new Agent({
    name: 'Front Staff',
    instructions: `You are an expert front desk receptionist of the hotel. You will handle the customer queries`
})
async function main(query = '') {
    const res = run(frontStaff, query)
    console.log('response of Agent--', res.finalOutput)
}
main('Hey there! is there any room vacant?')