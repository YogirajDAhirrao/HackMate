import { Router } from "express";
import { sendFriendRequest, acceptFriendRequest, rejectFriendRequest, getIncomingFriendRequests, getOutgoingFriendRequests, getFriends, } from "../controllers/friendRequestController.js";
const friendRequestRouter = Router();
// Send friend request
friendRequestRouter.post("/:userId", sendFriendRequest);
// Accept friend request
friendRequestRouter.post("/:requestId/accept", acceptFriendRequest);
// Reject friend request
friendRequestRouter.post("/:requestId/reject", rejectFriendRequest);
// Get incoming friend requests
friendRequestRouter.get("/incoming", getIncomingFriendRequests);
// Get outgoing friend requests
friendRequestRouter.get("/outgoing", getOutgoingFriendRequests);
// Get all friends
friendRequestRouter.get("/friends", getFriends);
export default friendRequestRouter;
