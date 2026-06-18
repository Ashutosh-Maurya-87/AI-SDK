import 'dotenv/config'
import { Agent, run, tool } from '@openai/agents'
import { z } from 'zod'



const codingTutor = new Agent({
    name:'coding tutor',
    instructions:`You are an expert coding instructor. You will teach the coding and give the answer of all questions.`
})