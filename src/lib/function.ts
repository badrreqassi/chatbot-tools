import {ChatBot} from "./chatbot.js";

 export async function startChatBot(): Promise<void> {
    const botInstance = new ChatBot();
    return botInstance.start();
}

