import {fileURLToPath} from "url";
import path from "path";
import fs from "fs";
import {ToolChatBot} from "./model/ToolChatBot.js";
import {main} from "./setup.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class ChatBot {

    private readonly defaultToolsDir: string;
    private readonly dynamicToolsDir: string;
    public tools: ToolChatBot[] = [];
    constructor() {
         this.defaultToolsDir =  path.join(__dirname, 'default-tools');
        this.dynamicToolsDir =  path.join(process.cwd(), 'dynamic-tools');

        // Ensure directories exist
         this.ensureDirExists(this.dynamicToolsDir);

    }

    /**
     * Helper to create a directory if it doesn't exist.
     * @param dirPath The path to the directory.
     */
    private ensureDirExists(dirPath: string): void {
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }
    }

    /**
     * Reads and imports all ToolChatBot exports from .ts || js files in a directory.
     * @param dirPath The path to the tools directory.
     * @returns A promise that resolves to an array of ToolChatBot.
     */
    private async loadToolsFromDir(dirPath: string): Promise<ToolChatBot[]> {
         const toolFiles = fs.readdirSync(dirPath)
            .filter(file => (file.endsWith('.ts') &&
                !file.endsWith('.d.ts')) || file.endsWith('.js'));

        const tools: ToolChatBot[] = [];

        for (const file of toolFiles) {
            const filePath = path.join(dirPath, file);
            try {
                const moduleUrl = path.resolve(filePath).replace(/\\/g, '/');
                const module = await import(moduleUrl);
                if (module.default && typeof module.default === 'object') {
                    // Check if it's an array of tools or a single tool
                    if (Array.isArray(module.default)) {
                        tools.push(...module.default as ToolChatBot[]);
                    } else {
                        tools.push(module.default as ToolChatBot);
                    }
                }
            } catch (error) {
                console.error(`Error loading tool from ${filePath}:`, error);
            }
        }
        return tools;
    }

    // Load default + dynamic tools from folders
    async loadTools(): Promise<void> {
        const [defaultTools, dynamicTools] = await Promise.all([
            this.loadToolsFromDir(this.defaultToolsDir),
            this.loadToolsFromDir(this.dynamicToolsDir)
        ]);

        this.tools = [...defaultTools, ...dynamicTools];
        console.log(`Loaded ${this.tools.length} tools.`);
    }


    // Update start to be async to wait for tools to load
    async start(): Promise<void> {
        if (this.tools.length === 0) {
            await this.loadTools();
        }
        await main(this.tools).catch(console.error);
    }

}