import {BotFrameworkAdapter, ConversationState, MemoryStorage, UserState } from "botbuilder";
import * as restify from "restify";
import { ConfState} from "./types";

let server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, () => {
    console.log(`${server.name} listening on ${server.url}`);
});

const adapter = new BotFrameworkAdapter({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
const memoryStorage = new MemoryStorage();
const conversationSate = new ConversationState(memoryStorage);
let userState: UserState;
userState = new UserState(memoryStorage)

server.post("/api/messages", (req, res) => {
    adapter.processActivity(req, res, async (context) => {
        if (context.activity.type === "message") {
            const state = conversationSate.get(context);
            await context.sendActivity(`You said ${context.activity.text}`);
        } else {
            await context.sendActivity(`${context.activity.type} event detected`)
        }
    });
})