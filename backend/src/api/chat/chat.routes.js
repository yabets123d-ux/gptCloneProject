import express from "express"; 
const chatRouter = express.Router();
import { createChatController, getChatController } from "./controller/chat.controller.js";
// api/chat/conversation
chatRouter.post('/conversation', createChatController);
chatRouter.get('/conversation', getChatController);

export default chatRouter;