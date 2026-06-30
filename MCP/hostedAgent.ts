import 'dotenv/config'
import { Agent, run, hostedMcpTool } from '@openai/agents'

const agent = new Agent({
    name: 'MCP Agent - Ist type Agent',
    instructions: 'You must always use the MCP tools to answer questions.',
    tools: [
        hostedMcpTool({
            serverLabel: 'gitmcp',
            serverUrl: 'https://gitmcp.io/openai/codex',
        }),
    ],
})

async function main(q: string) {
    const res = await run(agent, q);
    console.log('res of agent:', res.finalOutput)
}
main('Tell me about this repo')