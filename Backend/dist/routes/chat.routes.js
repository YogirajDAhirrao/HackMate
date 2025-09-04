import express from "express";
import { fetchMessages } from "../controllers/chatController.js";
const chatRouter = express.Router();
chatRouter.get("/:teamId", fetchMessages);
export default chatRouter;
