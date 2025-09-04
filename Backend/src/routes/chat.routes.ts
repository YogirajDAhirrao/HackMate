import express from "express";
import Message from "../model/messages.model.js";
import { fetchMessages } from "../controllers/chatController.js";

const chatRouter = express.Router();

chatRouter.get("/:teamId", fetchMessages);
export default chatRouter;
