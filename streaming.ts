import 'dotenv/config'
import { Agent, run } from '@openai/agents'

const stroyTellerAgent = new Agent({
    name: 'Story Teller',
    instructions: 'You are an expert in story teller. You will be given a topic and you will be tell the story about that.'
})

// rendering through a generator function
async function* storyTellerGenerator(query: string) {
    const res = await run(stroyTellerAgent, query, { stream: true })
    const stream = res.toTextStream()
    for await (const text of stream) {
        yield { isCompleted: false, value: text }
    }
    yield { isCompleted: true, value: res.finalOutput }

}
async function runStoryTellerAgent(q = '') {
    for await (const val of storyTellerGenerator(q)) {
        console.log(val)
    }
    // this is the second way
    // const res = await run(stroyTellerAgent, q, { stream: true })
    // res.toTextStream({ compatibleWithNodeStreams: true }).pipe(process.stdout)
    // this is the one way- like it will write each word in new line because of console write each word in new line
    // const stream = res.toTextStream()
    // for await (const val of stream) {
    //     console.log(val)
    // }
    // console.log('The Story is:', res.finalOutput)
}
runStoryTellerAgent('Write the story in Khargosh in 100 words')