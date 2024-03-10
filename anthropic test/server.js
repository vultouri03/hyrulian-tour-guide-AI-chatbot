import {ChatAnthropic } from "@langchain/anthropic"
import { TaskType } from "@google/generative-ai";
import {ChatPromptTemplate} from "@langchain/core/prompts";
import express from "express"


const model = new ChatAnthropic({
    anthropicApiKey: process.env.ANTHROPIC_API_KEY
})

const app = express()

app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));

app.listen(8090)

// const prompt = ChatPromptTemplate.fromMessages([
//     ["system", "You are a helpful chatbot"],
//     ["human", "Tell me a joke about {topic}"],
// ]);

app.post("/chat", async (req, res) => {
    const prompt = req.body.prompt
    const engineeredPrompt = ChatPromptTemplate.fromMessages([
        ["system", "you are a chatbot that can tell stories about the world of the legend of zelda"],
        ["human", prompt]
    ])
    res.json(await model.invoke(JSON.stringify(engineeredPrompt)))
})

