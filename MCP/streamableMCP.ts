import 'dotenv/config'
import { Agent, MCPServerStreamableHttp, run } from '@openai/agents'

const githubMCPServer = new MCPServerStreamableHttp({
    url: 'https://gitmcp.io/openai/codex',
    name: "Github Documentation Server"
})
const mcpAgent = new Agent({
    name: 'Stremable MCP Agent',
    instructions: `You must always use the MCP tools to answer questions.`,
    mcpServers: [githubMCPServer]
})

async function runAgent(q: string) {
    await githubMCPServer.connect()
    const res = await run(mcpAgent, q)
    console.log('result are:', res.finalOutput)
    await githubMCPServer.close()

}
runAgent('What is the repo about?')