import 'dotenv/config'
import { Agent, run, tool } from '@openai/agents'
import { z } from 'zod'

const fetchAvailablePlans = tool({
    name: 'fetch available plans',
    description: 'fetch the available plan for internet',
    parameters: z.object({}),
    execute: async function () {
        return [{
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
        }]
    }
})
const salesAgent = new Agent({
    name: 'sales_agent',
    instructions: `You are an expert sales agent for an internet broadband company. Talk to the user and
    help them what they need`,
    tool: fetchAvailablePlans
})

const runAgent = async (query = '') => {
    const res = await run(salesAgent, query)
    console.log('----->', res.finalOutput)
}
runAgent(`Hey there! I want to know the plan availabe.I want home internet plan.
     There is 5 users and they will use it for gaming also and the budget is around 100.
     My pincode is-123456 and area is ludhiana.`)