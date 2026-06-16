import 'dotenv/config';
import { Agent, run, tool } from '@openai/agents'
import { z } from 'zod'
import emailjs from "@emailjs/browser";

const SERVICE_ID = "service_c8x3jay";
const TEMPLATE_ID = "template_2lcl23s";
const PUBLIC_KEY = "SpISGMUSoBmyezRb4";

const sendEmail = async (to) => {
    try {
        await emailjs.send(
            "service_id",
            "template_id",
            {
                name: "Ashutosh",
                email: to,
                message: "Hello",
            },
            "PUBLIC_KEY"
        );

        console.log("Email sent");
    } catch (error) {
        console.error(error);
    }
};

const sendWeatherEmailTool = tool({
    name: 'send weather email',
    description: 'Send the email to the given email address of the current weather report of the given city',
    parameters: z.object({
        to: z.string().describe("Recipient's email address"),
        city: z.string().describe("City for which to send weather report")
    }),
    execute: async ({ to, city }) => {
        await sendEmail()
        // return `Email of the current weather of given city: ${city} are send to the given email : ${to}`
    }
})
const agent = new Agent({
    name: 'Send email of current weather',
    instructions: 'You are an expert agent which will send the email of the current weather of the given city to given email',
    tools: [sendWeatherEmailTool]
})

const callAgent = async (query = '') => {
    const res = await run(agent, query)
    console.log('response of Agents are--', res.finalOutput)
}

callAgent('I want the weather report of the Ludhiana which report will send to the email: ashumaurya486@gmail.com')