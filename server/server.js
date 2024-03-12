import { ChatOpenAI } from "@langchain/openai"
import { HumanMessage, SystemMessage, AIMessage } from "@langchain/core/messages"
import express from "express"
import cors from "cors"

const model = new ChatOpenAI({
    temperature: 0.8,
    maxRetries: 10,
    azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY,
    azureOpenAIApiVersion: process.env.OPENAI_API_VERSION,
    azureOpenAIApiInstanceName: process.env.INSTANCE_NAME,
    azureOpenAIApiDeploymentName: process.env.ENGINE_NAME,
})

const app = express();
let mapCall = await fetch("https://botw-compendium.herokuapp.com/api/v3/regions/all").then(response => {
    // Check if the request was successful
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    // Parse the JSON response
    return response.json();
})
    .then(data => {
        // Handle the data returned from the server
        return data;
    })
    .catch(error => {
        // Handle any errors that occurred during the fetch
        console.error('There was a problem with the fetch operation:', error);
    });
let mapinfo = JSON.stringify(await mapCall);
const compendiumCall = fetch("https://botw-compendium.herokuapp.com/api/v3/compendium/all").then(response => {
    // Check if the request was successful
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    // Parse the JSON response
    return response.json();
})
    .then(data => {
        // Handle the data returned from the server
        return data;
    })
    .catch(error => {
        // Handle any errors that occurred during the fetch
        console.error('There was a problem with the fetch operation:', error);
    });
let compendiumInfo = JSON.stringify( await compendiumCall );
const prompt = `you are part of the famous news paper the clover gazette, its really popular in the kingdom of hyrule and is often used by travellers to get around, and advicing them about the locations around them by using this ${mapinfo}, it contains information about the locations in the regions. only use the information given in this prompt and don't use your own info about the zelda franchise and hyrule's locations. i repeat, don't use information not provided in the map data i gave you. Remember that you are part of the clover gazette news paper and write the answer like a newspaper article.`;


app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use(cors())

app.listen(8000);

app.get("/joke", async (req, res) => {
    const joke = await answerMe("tell me a javascript joke");
    res.json(joke.content);
} )

app.get("/chat", async(req, res) => {
    res.json( await model.invoke("hello world", {signal: controller.signal}))
})

app.post("/chat", async (req,res) => {
    const Messages = [
        new SystemMessage(prompt)
    ]
    const chat = JSON.stringify(req.body.prompt);
    const parsedChat = JSON.parse(chat);


    for (let i= 0;  i < parsedChat.length; i++) {
         if(parsedChat[i][0] === "human") {
             Messages.push(new HumanMessage(parsedChat[i][1]))
         } else {
             Messages.push(new AIMessage(parsedChat[i][1]))
         }
    }

    const engineeredPrompt = await answerMe(Messages);

    for await(const chunk of engineeredPrompt){
        console.log(chunk.content)
        res.write(chunk.content);
    }
    res.end()



})

async function answerMe(prompt) {
    //console.log(prompt)
    return await model.stream(prompt);
}

// console.log("hello world");
// console.log(process.env.AZURE_OPENAI_API_KEY);