const CognitiveServicesCredentials = require('ms-rest-azure').CognitiveServicesCredentials;
const WebSearchAPIClient = require('azure-cognitiveservices-websearch');



let credentials = new CognitiveServicesCredentials('26ae01034064499dad6bc6d057828919');
let webSearchApiClient = new WebSearchAPIClient(credentials);

const searchWeb = (query: string = 'Who is theprime minister of UK') => {

    webSearchApiClient.web.search(query).then((result: any) => {
        let properties = ["images", "webPages", "news", "videos"];
        for (let i = 0; i < properties.length; i++) {
            if (result[properties[i]]) {
                console.log(result[properties[i]].value);
            } else {
                console.log(`No ${properties[i]} data`);
            }
        }
    }).catch((err: any) => {
        throw err;
    })
}


export default searchWeb
