/*
import { Orchestrator, AuthorizationError } from "@auth0/ai";

export class LlamaIndexOrchestrator extends Orchestrator {
  
  constructor() {
    super();
  }
  
  async prompt(message, ctx) {
    // TODO: make this agent interface generic
    
    return this.run(ctx || {}, async () => {
      try {
        const response = await this.agent.chat({ message: message });
        return response;
      } catch (ex) {
        //console.log("???");
        //console.log(ex);
        //console.log(ex.scope);
        
        if (ex instanceof AuthorizationError) {
          //var transactionID = await this.authorizer.authorize(ex);
          // FIXME: plumbing...
          var transactionID = await this.authorizer.authorize({
            scope: [ 'openid' ],
            //loginHint: 'janedoe@example.com'
            //loginHint: JSON.stringify({ format: 'iss_sub', iss: 'https://ai-117332.us.auth0.com/', sub: 'auth0|672d15e3a67830e930d6679b' }),
            loginHint: 'auth0|672d15e3a67830e930d6679b',
            // FIXME: This shouldn't be necessary, but its required currently
            bindingMessage: 'FIXME'
          });

          // Slice off the last message, under the assumption that it was a tool call that failed
          // TODO: make this more robust by checking
          var messages = this.agent.chatHistory.slice(0, -1);
          
          console.log('Waiting for approval: ' + transactionID);

          await this.historyStore.store(transactionID, messages);
          this.watch(transactionID);
          return;
        }
        
        // TODO: Feed other errors back into agent
      }
    });
  }
  
  async resume(transactionID, token) {
    //console.log('llamaindex resume');
    
    var messages = await this.historyStore.load(transactionID);
    // FIXME: pass in chat history correctly
    this.agent.reset();
    var response = await this.prompt(messages[0].content, { tokens: { accessToken: token } })
    if (response) {
      console.log(response.message);
    }
  }
}
*/
