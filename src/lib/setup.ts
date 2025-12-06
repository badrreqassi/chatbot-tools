import 'dotenv/config';
global.AI_SDK_LOG_WARNINGS = false;
 import {ModelMessage, stepCountIs, streamText} from "ai";
import {mistral} from "@ai-sdk/mistral";
import * as readline from 'node:readline/promises';
import {ToolChatBot} from "./model/ToolChatBot.js";
import {mapToolsForMistral} from "./mappers/mapToolsForMistral.js";


const terminal = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
const messages: ModelMessage[] = [];

 export async function main(tools: ToolChatBot[]) {
    while (true) {
        const userInput = await terminal.question('You: ');
        messages.push({ role: 'user', content: userInput });
        // Map all tools dynamically
        const toolsForMistral = mapToolsForMistral(tools);
        const result = streamText({
            model: mistral('mistral-large-latest'),
            messages,
            tools: {...toolsForMistral},
            stopWhen: stepCountIs(5),
        });


        let fullResponse = '';
        process.stdout.write('\nAssistant: ');
        for await (const delta of result.textStream) {
            fullResponse += delta;
            process.stdout.write(delta);
        }
        process.stdout.write('\n\n');

        messages.push({ role: 'assistant', content: fullResponse });
    }
}