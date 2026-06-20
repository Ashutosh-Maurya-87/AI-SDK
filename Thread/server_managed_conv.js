import 'dotenv/config'
import { Agent, run } from '@openai/agents'

// By using previous respond id

const agent = new Agent({
    name: 'Assistant',
    instructions: 'Reply very concisely'
})

async function main(q = '') {
    const first = await run(agent, q)
    console.log('agent responde:', first.finalOutput)

    const second = await run(agent, "What state is it in?", {
        previousResponseId: first?.previousResponseId
    })
    console.log('response:', second.finalOutput)
}

main('What city is the Golden Gate Bridge in?')