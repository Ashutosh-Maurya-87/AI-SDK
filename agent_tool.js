import 'dotenv/config';
import { Agent, run, tool } from '@openai/agents'
import { z } from 'zod';
import axios from 'axios';
// structured output schema--
const getWeatherReportSchema = z.object({
    city: z.string().describe('Name of the city'),
    degree_c: z.number().describe('Degree of the temprature'),
    weather_condition: z.string().optional().describe('Condition of weather')
})
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

const sendEmail = tool({
    name: 'send_email',
    description: 'Send email to the given email address with the given subject and body',
    parameters: z.object({
        to: z.string().describe("Recipient's email address")
    }),
    execute: async ({ to }) => {
        // Here need to integrate with a real email sending service to send the email
        return `Email send to ${to} successfully!`
    }
})
const agent = new Agent({
    name: 'Getting weather report',
    instructions: 'Your are an expert agent that helps user to tell the weather report of the given city',
    // modal
    tools: [getWeatherReport, sendEmail],
    outputType: getWeatherReportSchema
})


async function main(query = '') {
    const res = await run(agent, query).then((res) => {
        console.log('result of agent is:', res.finalOutput);
    }).catch((error) => {
        console.error('error during calling the api', error);
    })
}
main('i want to know the weather report of Kerla, Lucknow, Ahmedabad, Banglore')
// main('i want to send the email to ashumaurya486@gmail.com')