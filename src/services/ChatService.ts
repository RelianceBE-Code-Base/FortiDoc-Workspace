import { OpenAIClient, AzureKeyCredential }from '@azure/openai'



async function invokePrompt(messages: {role:string, content:string}[], temp: number = 0.5) : Promise<string>{

    // const deployment_id = "gpt-35-turbo"
    const deployment_id = "KojoGPT4o"
  
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

    response = response.replace(/","/g, '\n\n');


    return response

    

    
    
}

import axios from 'axios';


async function invokePromptWithBing(query: string): Promise<any> {
    const apiUrl = 'https://digitalworkspaceaibackendapi.azurewebsites.net/api/WebSearch';

    try {
        const response = await axios.post(apiUrl, { query }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const result = response.data['result'];
        let cleanedResult = result.slice(2, -2);

        console.log(cleanedResult)

        cleanedResult = cleanedResult.replace(/","/g, '\n\n');


        return cleanedResult;

    } catch (error) {
        console.error('Error calling Bing API:', error);
        throw error;
    }
}

export { invokePrompt,invokePromptWithBing };


// export default invokePrompt

