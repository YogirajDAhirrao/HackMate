import { Request, Response } from "express";
import Message from "../model/messages.model.js";

export const fetchMessages = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const teamId = req.params.teamId;

    if (!teamId) {
      res.status(400).json({ message: "Team ID is required" });
      return;
    }

    const messages = await Message.find({ team: teamId })
      .populate("sender", "name email")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({ message: "Failed to fetch messages" });
  }
};
