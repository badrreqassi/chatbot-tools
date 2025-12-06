import {tool} from "ai";
import {z} from "zod";
import {ToolChatBot} from "../model/ToolChatBot.js";

function mapInputSchema(schema: Record<string, string>) {
    const shape: Record<string, any> = {};
    for (const key in schema) {
        switch (schema[key]) {
            case 'string':
                shape[key] = z.string();
                break;
            case 'number':
                shape[key] = z.number();
                break;
            case 'boolean':
                shape[key] = z.boolean();
                break;
            default:
                shape[key] = z.any(); // fallback
        }
    }
    return z.object(shape);
}

export function mapToolsForMistral(toolsArray :ToolChatBot[]){
    const mapped: Record<string, any> = {};
    for (const t of toolsArray) {
         mapped[t.name] = tool({
            outputSchema: undefined, type: undefined,
            description: t.description,
            inputSchema: mapInputSchema(t.inputSchema),
            execute: t.execute
        });
    }
    return mapped;
}