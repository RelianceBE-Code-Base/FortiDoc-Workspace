import { OpenAIClient, AzureKeyCredential }from '@azure/openai'



async function invokePrompt(messages: {role:string, content:string}[], temp: number = 0.5) : Promise<string>{

    const deployment_id = "gpt-35-turbo"
    // const deployment_id = "KojoGPT4o"
    // const endpoint = "https://ai-kojoai010105560994.openai.azure.com/"
    const endpoint = "https://ai-kojoeastus482385420656.openai.azure.com/"
    // const azure_openai_key = "a892286df8914ab8bb804a06e0331189"
    const azure_openai_key = "381f94fa10d14aaa879b798fb7c2b571"

    const client = new OpenAIClient(
        endpoint,
        new AzureKeyCredential(azure_openai_key)
    )
    
    

    

    const events = await client.getChatCompletions(deployment_id, messages, { maxTokens: 1000, temperature: temp}, );


    let response: string =  events.choices[0].message?.content!

    return response

    

    
    
}

export default invokePrompt

