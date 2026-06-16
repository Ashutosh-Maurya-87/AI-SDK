import 'dotenv/config';
import { Agent, run } from "@openai/agents";

// const helloAgent = new Agent({
//     name: "HelloAgent",
//     instructions: "you are an agents that aalways says hello world with user name.",
//     // tools: [],
//     // agent: async (input) => {
//     //     return "Hello, world!";
//     // }
// });

// run(helloAgent, 'Hey My Name is Ashutosh Maurya').then((res) => {
//     console.log(res.finalOutput);
// }).catch((err) => {
//     console.error('error during caling the api', err);
// });
const location = 'Indiak';
const checkCOountryAgent = new Agent({
    name:' checking country name',
    instructions: function() {
        if(location === 'India'){
            return 'Tou are an agent which is checking the cpountyr'
        } else {
            return ' country did not matched'
        }
    },
    modal:'gpt-4o-mini'
})
const resul = run(checkCOountryAgent, 'India').then((res) => {
    console.log(res.finalOutput);
}).catch((err) => {
    console.error('error during caling the api', err);
});