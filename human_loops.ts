// 

import 'dotenv/config';
import { Agent, run, tool } from '@openai/agents'
import { z } from 'zod'
import axios from 'axios';
import readline from 'node:readline/promises';

const getWeatherReport = tool({
    name: 'get_weater',
    description: 'Return the current weather and AQI level of given city',
    parameters: z.object({
        city: z.string().describe('Give the City name to get the weater report')
    }),
    execute: async ({ city }) => {
        // Here need to integrate with a real weather API to get the data
        const res = await axios.get(`https://wttr.in/${city.toLowerCase()}?format=%C+%t`, {
            responseType: 'text'
        });
        // console.log('response from weather api is:', res);
        return `The current weather in ${city} is ${res.data}`;
    }
})

const sendWeatherEmailTool = tool({
    name: 'send weather email',
    description: `You are an expert weather assistant. When asked to send a weather report, 
    ALWAYS first call "get_weater" for the city, then use the output of that tool to construct 
    and call "send weather email" with the result.`,
    parameters: z.object({
        to: z.string().describe("Recipient's email address"),
        subject: z.string().describe("Subject of the email"),
        html: z.string().describe('html body for the email')
    }),
    needsApproval: true,
    execute: async ({ to, subject, html }) => {
        const API_KEY = process.env.AUTOSEND_API_KEY
        const res = await axios.post('https://api.autosend.com/v1/mails/send', {
            from: {
                email: 'ashumaurya.dev@pro',
                name: 'AI Weather Agent'
            },
            to: {
                email: to,
                name: 'testing user'
            },
            subject,
            html
        }, {
            headers: {
                Authorization: `Bearer ${API_KEY}`
            }
        })
        return res?.data;
    }
})
const agent = new Agent({
    name: 'Send email of current weather',
    instructions: 'You are an expert agent which will send the email of the current weather of the given city to given email',
    tools: [getWeatherReport, sendWeatherEmailTool]
})

const askForUserConfirmation = async (ques: string) => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    })
    const answer = await rl.question(`${ques} (y/n): `);
    const normalizedAnswer = answer.toLowerCase();
    rl.close();
    return normalizedAnswer === 'y' || normalizedAnswer === 'yes';
}
const callAgent = async (query = '') => {
    let res = await run(agent, query)
    console.log('response of Agents are--', res.finalOutput)
    console.log('intrruption while calling agent', res.interruptions)
    // if interruption
    let hasInterruptions = res.interruptions?.length > 0
    while (hasInterruptions) {
        const currentState = res.state
        for (const interrupt of res.interruptions) {
            if (interrupt.type === 'tool_approval_item') {
                const isAllowed = await askForUserConfirmation(`
    Agent ${interrupt.agent.name} is asking for calling tool ${interrupt.name} with args ${interrupt.arguments}`)
                if (isAllowed) {
                    currentState.approve(interrupt)
                } else {
                    currentState.reject(interrupt)
                }
                res = await run(agent, currentState)
                hasInterruptions = res.interruptions?.length > 0
            }
        }
    }
}

callAgent('I want the weather report of the Ludhiana which report will send to the email: ashumaurya486@gmail.com')