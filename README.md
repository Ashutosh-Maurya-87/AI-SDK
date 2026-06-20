# Output Guardrails--  How Output Guardrails work?

Generation Phase: 
     - mathAgent receives the prompt ("write code..."). It processes this and generates a full completion (the JS code).

Guardrail Phase: 
     - Once the text is generated, the system passes that output to agentOuptputGuardrail.

Validation Phase: 
     - The mathAgentOutputGuardrail analyzes the text and realizes it's not math. It sets tripwireTriggered: true.

Result: 
     - Because the guardrail is "triggered," your code throws an error and catches it in the .catch() block. By that time, the work was already done, the tokens were consumed, and the AI already produced the answer.