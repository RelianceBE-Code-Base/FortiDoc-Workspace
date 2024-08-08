import { OpenAIClient, AzureKeyCredential }from '@azure/openai'



async function invokePrompt(messages: {role:string, content:string}[], temp: number = 0.5) : Promise<string>{

    const deployment_id = "gpt-35-turbo"
    // const endpoint = "https://ai-kojoai010105560994.openai.azure.com/"
    // const azure_openai_key = "a892286df8914ab8bb804a06e0331189"
    const endpoint = "https://kojoai.openai.azure.com/"
    const azure_openai_key = "3c1aef567ccf4e3b8728c361ced06b3e"

    const client = new OpenAIClient(
        endpoint,
        new AzureKeyCredential(azure_openai_key)
    
    )
    

    const events = await client.getChatCompletions(deployment_id, messages, { maxTokens: 1000, temperature: temp }, );


    let response: string =  events.choices[0].message?.content!

    return response

    

    
    
}

export default invokePrompt







// import { OpenAIClient, AzureKeyCredential } from '@azure/openai'



// const invokePrompt = async (messages: {role:string, content:string}[], temp: number = 0.5, onPartialResponse: (text: string) => void) => {
// try{
//     const deployment_id = "gpt-35-turbo"
//     // const endpoint = "https://ai-kojoai010105560994.openai.azure.com/"
//     // const azure_openai_key = "a892286df8914ab8bb804a06e0331189"
//     const endpoint = "https://kojoai.openai.azure.com/"
//     const azure_openai_key = "3c1aef567ccf4e3b8728c361ced06b3e"

//     const client = new OpenAIClient(
//         endpoint,
//         new AzureKeyCredential(azure_openai_key)
    
//     )
    

//     // const events = await client.getChatCompletions(deployment_id, messages, { maxTokens: 1000, temperature: temp,  }, );

//     const events = await client.streamCompletions(deployment_id,['what is life'], {maxTokens:1000, temperature: temp, })

//     let fullResponse = '';
//     for await (const event of events) {
//       for (const choice of event.choices) {
//         const newText = choice.text;
//         fullResponse += newText;
//         onPartialResponse(fullResponse);
//       }
//     }

//     return fullResponse}  catch (error) {
//         console.error('Error streaming from Azure LLM:', error);
//         throw error;
//       }

    

    
    
// }

// export default invokePrompt

