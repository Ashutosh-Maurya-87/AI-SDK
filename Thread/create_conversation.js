import 'dotenv/config'
import { Agent, run } from '@openai/agents'
import { OpenAI } from 'openai'

const client = new OpenAI()

client.conversations.create({}).then((e) => {
    console.log('conversation id created:', e.id)
})

// conv_6a36d2e908c08193a308cb9036dcf4be0d770be66308aca1