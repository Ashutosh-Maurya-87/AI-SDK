import 'dotenv/config'
import { Agent, run, RunContext, tool } from '@openai/agents'
import { z } from 'zod'
// this is one way of context
// interface MyContext {
//     userId: string,
//     userName: string
// }
// const customerSupportAgent = new Agent<MyContext>({
//     name: 'Customer Support Agent',
//     instructions: ({ context }) => {
//         return `You are an customer support agent\n Context: ${JSON.stringify(context)}`
//     }
// })

// async function main(q: string, ctx: MyContext) {
//     const res = await run(customerSupportAgent, q, { context: ctx })
//     console.log("agent repsonse", res.finalOutput)
// }

// main('Hey agent can you tell me what is my name?', {
//     userId: "123",
//     userName: 'Ashutosh Maurya'
// })

// SECOND WAY OF LOCAL CONTEXT--
interface MyContext {
    userId: string,
    userName: string,
    fetchUserInfoFromDb: () => Promise<string>
}

const getUserInfo = tool({
    name: 'Get user info',
    description: 'You will provide the user information',
    parameters: z.object({}),
    execute: async (_args, ctx?: RunContext<MyContext>): Promise<string | undefined> => {
        const res = await ctx?.context.fetchUserInfoFromDb()
        return res
    }
})
const customerSupportAgent = new Agent<MyContext>({
    name: 'Customer Support Agent',
    instructions: ({ context }) => {
        return `You are an customer support agent`
    },
    tools: [getUserInfo]
})

async function main(q: string, ctx: MyContext) {
    const res = await run(customerSupportAgent, q, { context: ctx })
    console.log("agent repsonse", res.finalOutput)
}

main('Hey agent can you tell me what is my name?', {
    userId: "1234",
    userName: 'Sweetu',
    fetchUserInfoFromDb: async () => {
        return `user id: 1234, user name: Sweetu`
    }
})