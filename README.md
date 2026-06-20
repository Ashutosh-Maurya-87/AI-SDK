# Output Guardrails--  How Output Guardrails work?

Generation Phase: 
     - mathAgent receives the prompt ("write code..."). It processes this and generates a full completion (the JS code).

Guardrail Phase: 
     - Once the text is generated, the system passes that output to agentOuptputGuardrail.

Validation Phase: 
     - The mathAgentOutputGuardrail analyzes the text and realizes it's not math. It sets tripwireTriggered: true.

Result: 
     - Because the guardrail is "triggered," your code throws an error and catches it in the .catch() block. By that time, the work was already done, the tokens were consumed, and the AI already produced the answer.


# Server-managed conversations
    - You can let the OpenAI Responses API persist conversation history 
    for you instead of sending your entire local conversation history on every turn. 
    This is useful when you are coordinating long conversations or multiple services.

    - OpenAI exposes two ways to reuse server-side state:

    1. conversationId for an entire conversation

    2. previousResponseId to continue from the last turn


# Context Management
   - Context is an overloaded term. There are two main classes of context you might care about:

    1. Local context that your code can access during a run: dependencies or data needed by tools, callbacks like onHandoff, and lifecycle hooks.
    2. Agent/LLM context that the language model can see when generating a response.