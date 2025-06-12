import { Request, Response } from "express";
import mongoose from "mongoose";
import User from "../model/user.model.js";
import Team from "../model/team.model.js";

interface AuthRequest extends Request {
  userId?: string;
}

export const sendRequest = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId;
    const targetId = req.params.id;

    if (!userId || !targetId) {
      res.status(400).json({ message: "Invalid request" });
      return;
    }

    if (userId === targetId) {
      res.status(400).json({ message: "You can't send a request to yourself" });
      return;
    }

    const targetUser = await User.findById(targetId);

    if (!targetUser) {
      res.status(404).json({ message: "Target user not found" });
      return;
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);

    if (targetUser.requests.includes(userObjectId)) {
      res.status(400).json({ message: "Request already sent" });
      return;
    }

    targetUser.requests.push(userObjectId);
    await targetUser.save();

    res.status(200).json({ message: "Request sent successfully" });
  } catch (error) {
    console.error("Error sending request:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const acceptRequest = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId;
    const requesterId = req.params.id;

    if (!userId || !requesterId) {
      res.status(400).json({ message: "Invalid request" });
      return;
    }

    const user = await User.findById(userId);
    const requester = await User.findById(requesterId);

    if (!user || !requester) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (!user.requests.includes(requester._id)) {
      res.status(400).json({ message: "No such request found" });
      return;
    }

    if (user.team || requester.team) {
      res.status(400).json({ message: "One of you is already in a team" });
      return;
    }

    // Step 1: Remove the request
    user.requests = user.requests.filter((id) => id.toString() !== requesterId);

    // Step 2: Create a new team with both users
    const newTeam = new Team({
      name: `${user.name}'s Team`,
      description: `Team formed by ${user.name} and ${requester.name}`,
      members: [user._id, requester._id],
      admin: user._id,
    });

    await newTeam.save();

    // Step 3: Set each user's team field
    user.team = newTeam._id;
    requester.team = newTeam._id;

    await user.save();
    await requester.save();

    res.status(200).json({ message: "Request accepted. Team created!" });
  } catch (error) {
    console.error("Error accepting request:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const rejectRequest = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId;
    const requesterId = req.params.id;

    if (!userId || !requesterId) {
      res.status(400).json({ message: "Invalid request" });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const requesterObjectId = new mongoose.Types.ObjectId(requesterId);

    if (!user.requests.includes(requesterObjectId)) {
      res.status(400).json({ message: "No such request found" });
      return;
    }

    // Remove the request
    user.requests = user.requests.filter((id) => id.toString() !== requesterId);

    await user.save();

    res.status(200).json({ message: "Request rejected successfully" });
  } catch (error) {
    console.error("Error rejecting request:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const cancelRequest = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId;
    const targetId = req.params.id;

    if (!userId || !targetId) {
      res.status(400).json({ message: "Invalid request" });
      return;
    }

    const targetUser = await User.findById(targetId);
    if (!targetUser) {
      res.status(404).json({ message: "Target user not found" });
      return;
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);

    if (!targetUser.requests.includes(userObjectId)) {
      res.status(400).json({ message: "No request to cancel" });
      return;
    }

    // Remove the request
    targetUser.requests = targetUser.requests.filter(
      (id) => id.toString() !== userId
    );

    await targetUser.save();

    res.status(200).json({ message: "Request cancelled successfully" });
  } catch (error) {
    console.error("Error cancelling request:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// View user's Incoming Request
export const viewIncoming = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const user = await User.findById(userId).populate(
      "requests",
      "name email github skills"
    );
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.status(200).json({ requests: user.requests });
  } catch (error) {

    console.error("Error fetching incoming requests:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// users can track whom they sent requests to
export const getOutgoingRequests = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    // Find users who have current user in their "requests" array
    const outgoingUsers = await User.find({ requests: userId }).select(
      "name email github skills"
    );

    res.status(200).json({ outgoing: outgoingUsers });
  } catch (error) {
    console.error("Error fetching outgoing requests:", error);
    res.status(500).json({ message: "Server error" });
  }
};
