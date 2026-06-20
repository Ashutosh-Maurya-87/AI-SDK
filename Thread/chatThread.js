import 'dotenv/config'
import { Agent, run, tool } from '@openai/agents'
import { z } from 'zod'

let sharedHistoryThread = [] // to store the history of first run to provide to the second run
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
    // Store the message in DB  (History)
    sharedHistoryThread.push({ role: 'user', content: q })
    const res = await run(sqlAgent, sharedHistoryThread)
    sharedHistoryThread = res.history
    console.log('Response of Agent:', res.finalOutput)

}

// TURN 1
runSQLAgentFun('Hi My Name is Ashutosh Maurya.').then(() => {
    // TURN 2
    runSQLAgentFun('Get me all the users with my name.')
})


// NOTE - For running programme it store the history but
// If first time execute and exist and then again run that time it not store the history this is the problem in this
// ex- runSQLAgentFun('Hi My Name is Ashutosh Maurya.') after successfull run
//  Again i write runSQLAgentFun('What is my name') - it give like i dont have personal access