import { Request, Response } from "express";
import mongoose from "mongoose";
import FriendRequest from "../model/friendRequest.model.js";
import User from "../model/user.model.js";

interface AuthRequest extends Request {
  userId?: string; // Injected by verifyJWT middleware
}

export const sendFriendRequest = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const senderId = req.userId;
    const receiverId = req.params.userId;

    if (!senderId || !receiverId) {
      res.status(400).json({ message: "Invalid request" });
      return;
    }

    if (senderId === receiverId) {
      res
        .status(400)
        .json({ message: "You cannot send a friend request to yourself" });
      return;
    }

    const receiver = await User.findById(receiverId);
    if (!receiver) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const sender = await User.findById(senderId);
    if (!sender) {
      res.status(404).json({ message: "Sender not found" });
      return;
    }

    // Correct ObjectId comparison using .equals
    const alreadyFriend = sender.friends.some((friendId) =>
      friendId.equals(receiverId)
    );

    if (alreadyFriend) {
      res.status(400).json({ message: "You are already friends" });
      return;
    }

    const existingRequest = await FriendRequest.findOne({
      from: senderId,
      to: receiverId,
      status: "pending",
    });

    if (existingRequest) {
      res.status(400).json({ message: "Friend request already sent" });
      return;
    }

    const friendRequest = new FriendRequest({
      from: senderId,
      to: receiverId,
    });

    await friendRequest.save();

    res
      .status(201)
      .json({ message: "Friend request sent successfully", friendRequest });
  } catch (error) {
    console.error("Error sending friend request:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const acceptFriendRequest = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId;
    const requestId = req.params.requestId;

    if (!userId || !requestId) {
      res.status(400).json({ message: "Invalid request" });
      return;
    }

    const friendRequest = await FriendRequest.findById(requestId);

    if (!friendRequest) {
      res.status(404).json({ message: "Friend request not found" });
      return;
    }

    if (friendRequest.status !== "pending") {
      res.status(400).json({ message: "Friend request is not pending" });
      return;
    }

    if (friendRequest.to.toString() !== userId) {
      res
        .status(403)
        .json({ message: "You are not authorized to accept this request" });
      return;
    }

    // Update friend request status to accepted
    friendRequest.status = "accepted";
    await friendRequest.save();

    // Add each other as friends
    const sender = await User.findById(friendRequest.from);
    const receiver = await User.findById(friendRequest.to);

    if (!sender || !receiver) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Avoid adding duplicates
    if (!sender.friends.some((friendId) => friendId.equals(receiver._id))) {
      sender.friends.push(receiver._id);
    }

    if (!receiver.friends.some((friendId) => friendId.equals(sender._id))) {
      receiver.friends.push(sender._id);
    }

    await sender.save();
    await receiver.save();

    res.status(200).json({ message: "Friend request accepted successfully" });
  } catch (error) {
    console.error("Error accepting friend request:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const rejectFriendRequest = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId;
    const requestId = req.params.requestId;

    if (!userId || !requestId) {
      res.status(400).json({ message: "Invalid request" });
      return;
    }

    const friendRequest = await FriendRequest.findById(requestId);

    if (!friendRequest) {
      res.status(404).json({ message: "Friend request not found" });
      return;
    }

    if (friendRequest.status !== "pending") {
      res.status(400).json({ message: "Friend request is not pending" });
      return;
    }

    if (friendRequest.to.toString() !== userId) {
      res
        .status(403)
        .json({ message: "You are not authorized to reject this request" });
      return;
    }

    // Update status to rejected
    friendRequest.status = "rejected";
    await friendRequest.save();

    res.status(200).json({ message: "Friend request rejected successfully" });
  } catch (error) {
    console.error("Error rejecting friend request:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getIncomingFriendRequests = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId;

    if (!userId) {
      res.status(400).json({ message: "Invalid request" });
      return;
    }

    const requests = await FriendRequest.find({
      to: userId,
      status: "pending",
    }).populate("from", "name email slug");

    res.status(200).json({ incomingRequests: requests });
  } catch (error) {
    console.error("Error fetching incoming friend requests:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getOutgoingFriendRequests = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId;

    if (!userId) {
      res.status(400).json({ message: "Invalid request" });
      return;
    }

    const requests = await FriendRequest.find({
      from: userId,
      status: "pending",
    }).populate("to", "name email slug");

    res.status(200).json({ outgoingRequests: requests });
  } catch (error) {
    console.error("Error fetching outgoing friend requests:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getFriends = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId;

    if (!userId) {
      res.status(400).json({ message: "Invalid request" });
      return;
    }

    const user = await User.findById(userId).populate(
      "friends",
      "name email slug"
    );

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({ friends: user.friends });
  } catch (error) {
    console.error("Error fetching friends list:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
