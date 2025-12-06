 import {z} from "zod";
 import {ToolChatBot} from "../model/ToolChatBot.js";

  const weather: ToolChatBot = {
  name: "weather",
  description: 'Get the weather in a location (fahrenheit)',
  inputSchema: z.object({
    location: z
        .string()
        .describe('The location to get the weather for'),
  }),
  execute: async ({ location } :{ location : string}) => {
    const temperature = Math.round(Math.random() * (90 - 32) + 32);
    return {
      location,
      temperature,
    };
  },
}
 export default weather;