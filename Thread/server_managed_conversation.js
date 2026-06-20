import 'dotenv/config'
import { Agent, run, tool } from '@openai/agents'
import { z } from 'zod'
// BY USING CONVERSATION ID---
const executeSQL = tool({
    name: 'execute_sql',
    description: 'This will execute the SQL query',
    parameters: z.object({
        sql: z.string().describe('The SQL Query')
    }),
    execute: async ({ sql }) => {
        console.log(`[SQL]: Execute for ${sql}`)
        return 'done'
    }
})
const sqlAgent = new Agent({
    name: 'Sql Expert Agent',
    tools: [executeSQL],
    instructions: `
    You are an expert SQL Agent that is specialized in generating SQL queries as per user request.
       Postgres Schema:
        - user table
        CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
        );
        
        -- comments table
        CREATE TABLE comments(
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFRENCES user(id),
        comment_text TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
        )
        
        `
})

async function runSQLAgentFun(q = "") {
    const res = await run(sqlAgent, q, {
        conversationId: `conv_6a36d2e908c08193a308cb9036dcf4be0d770be66308aca1`
    })

    console.log('Response of Agent:', res.finalOutput)

}

// TURN 1
runSQLAgentFun('Get the all user with my name')
