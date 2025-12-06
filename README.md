🤖 Chatbot Tool

A dynamic tool-loading framework for AI chatbots built with Node.js, TypeScript, and Mistral AI.
This package lets you create, load, and execute tools dynamically at runtime for LLM-based chatbots.

✨ Features

✅ Dynamic tool loading (from folders)

✅ Works with Mistral AI // will inject new ai soon

✅ Type-safe ToolChatBot interface

✅ Supports ESM + NodeNext

✅ Works with custom tools

✅ Perfect for AI agents & assistants


📦 Installation

npm install chatbot-tool

🔐 Environment Variables (VERY IMPORTANT)

Create a .env file in your project root:   
```js
MISTRAL_API_KEY=your_mistral_api_key_here
````


🧠 Tool Interface

All tools must follow this structure:
```ts
export interface ToolChatBot {

name: string;

description: string;

inputSchema: any;

execute: (args: any) => Promise<any>;

}
```
✅ Example: Default InfoUser Tool

```js
const InfoUser = {
    name: 'userInformation',
    description: 'Get information about the user',
    inputSchema: {},
    execute: async () => {
        return {
            username: 'badr',
            jobTitle: 'front end developer with angular'
        };
    }
};

export default InfoUser;

export default weather;
```
🚀 Using the Chatbot
```js
import 'dotenv/config';
import { startChatBot } from 'chatbot-tool';

await startChatBot();

```
🔧 Dynamic Tool Loading

You can dynamically load tools from a folder:
```js
/dynamic-tools/
  infoUser.js
  readFormDb.js
```
📜 License

MIT © 2025 — Made with ❤️ by Badr Reqassi

🌍 GitHub

🔗 https://github.com/badrreqassi/chatbot-tool