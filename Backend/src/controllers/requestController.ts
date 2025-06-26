// import { Request, Response } from "express";
// import mongoose from "mongoose";
// import User from "../model/user.model.js";
// import Team from "../model/team.model.js";

// interface AuthRequest extends Request {
//   userId?: string;
// }
// type OutgoingRequest = {
//   to: {
//     _id: mongoose.Types.ObjectId;
//     name: string;
//     slug: string;
//   };
//   team: {
//     _id: mongoose.Types.ObjectId;
//     name: string;
//     description: string;
//   };
// };

// // --- SEND REQUEST ---
// export const sendRequest = async (req: AuthRequest, res: Response) => {
//   try {
//     const userId = req.userId;
//     const targetId = req.params.id;
//     const { teamId } = req.body;

//     if (!userId || !targetId || !teamId) {
//       res.status(400).json({ message: "Missing data" });
//       return;
//     }

//     if (userId === targetId) {
//       res.status(400).json({ message: "You can't send a request to yourself" });
//       return;
//     }

//     const [sender, targetUser, team] = await Promise.all([
//       User.findById(userId),
//       User.findById(targetId),
//       Team.findById(teamId),
//     ]);

//     if (!sender || !targetUser || !team) {
//       res.status(404).json({ message: "User or team not found" });
//       return;
//     }

//     // Check sender is part of the team
//     if (!team.members.includes(sender._id)) {
//       res.status(403).json({ message: "You are not a member of this team" });
//       return;
//     }

//     // Check if request already exists
//     const alreadyRequested = targetUser.requests.some(
//       (r) => r.from.toString() === userId && r.team.toString() === teamId
//     );
//     if (alreadyRequested) {
//       res.status(400).json({ message: "Request already sent for this team" });
//       return;
//     }

//     targetUser.requests.push({ from: sender._id, team: team._id });
//     await targetUser.save();

//     res.status(200).json({ message: "Request sent successfully" });
//   } catch (error) {
//     console.error("Error sending request:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// export const acceptRequest = async (req: AuthRequest, res: Response) => {
//   try {
//     const userId = req.userId;
//     const requesterId = req.params.id;
//     const { teamId } = req.body;

//     const user = await User.findById(userId);
//     const requester = await User.findById(requesterId);
//     const team = await Team.findById(teamId);

//     if (!user || !requester || !team) {
//       res.status(404).json({ message: "User or team not found" });
//       return;
//     }

//     // Find the matching request
//     const targetRequest = user.requests.find(
//       (r) => r.from.toString() === requesterId && r.team.toString() === teamId
//     );

//     if (!targetRequest) {
//       res.status(400).json({ message: "No such request found" });
//       return;
//     }

//     // Remove the matching request using Mongoose's .pull() method
//     user.requests.pull(targetRequest._id);

//     // Add user to the team if not already present
//     if (!team.members.includes(user._id)) {
//       team.members.push(user._id);
//       await team.save();
//     }

//     // Add team to user's teams array
//     if (!user.teams.includes(team._id)) {
//       user.teams.push(team._id);
//     }

//     await user.save();

//     res
//       .status(200)
//       .json({ message: "Request accepted and user added to the team" });
//   } catch (error) {
//     console.error("Error accepting request:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // --- REJECT REQUEST ---
// export const rejectRequest = async (req: AuthRequest, res: Response) => {
//   try {
//     const userId = req.userId;
//     const requesterId = req.params.id;
//     const { teamId } = req.body;

//     const user = await User.findById(userId);
//     if (!user) {
//       res.status(404).json({ message: "User not found" });
//       return;
//     }

//     const targetRequest = user.requests.find(
//       (r) => r.from.toString() === requesterId && r.team.toString() === teamId
//     );

//     if (!targetRequest) {
//       res.status(400).json({ message: "No such request found" });
//       return;
//     }

//     // Remove using Mongoose's .pull()
//     user.requests.pull(targetRequest._id);

//     await user.save();
//     res.status(200).json({ message: "Request rejected successfully" });
//   } catch (error) {
//     console.error("Error rejecting request:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// export const cancelRequest = async (
//   req: AuthRequest,
//   res: Response
// ): Promise<void> => {
//   try {
//     const userId = req.userId;
//     const targetId = req.params.id;
//     const { teamId } = req.body;

//     if (!userId || !targetId || !teamId) {
//       res.status(400).json({ message: "Missing required fields" });
//       return;
//     }

//     const targetUser = await User.findById(targetId);
//     if (!targetUser) {
//       res.status(404).json({ message: "Target user not found" });
//       return;
//     }

//     const targetRequest = targetUser.requests.find(
//       (r) => r.from.toString() === userId && r.team.toString() === teamId
//     );

//     if (!targetRequest) {
//       res.status(400).json({ message: "No request to cancel for this team" });
//       return;
//     }

//     // Use .pull() with subdocument _id
//     targetUser.requests.pull(targetRequest._id);

//     await targetUser.save();

//     res.status(200).json({ message: "Request cancelled successfully" });
//   } catch (error) {
//     console.error("Error cancelling request:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// export const viewIncoming = async (
//   req: AuthRequest,
//   res: Response
// ): Promise<void> => {
//   try {
//     const userId = req.userId;
//     if (!userId) {
//       res.status(401).json({ message: "Unauthorized" });
//       return;
//     }

//     const user = await User.findById(userId)
//       .populate({
//         path: "requests.from",
//         select: "name email github skills slug",
//       })
//       .populate({
//         path: "requests.team",
//         select: "name description",
//       });

//     if (!user) {
//       res.status(404).json({ message: "User not found" });
//       return;
//     }

//     res.status(200).json({ requests: user.requests });
//   } catch (error) {
//     console.error("Error fetching incoming requests:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// export const getOutgoingRequests = async (
//   req: AuthRequest,
//   res: Response
// ): Promise<void> => {
//   try {
//     const userId = req.userId;
//     if (!userId) {
//       res.status(401).json({ message: "Unauthorized" });
//       return;
//     }

//     const usersWithRequests = await User.find({
//       "requests.from": userId,
//     })
//       .populate({
//         path: "requests.from",
//         select: "name email github skills slug",
//       })
//       .populate({
//         path: "requests.team",
//         select: "name description",
//       })
//       .select("requests name slug"); // `name/slug` for target user display

//     // Filter only the requests sent by this user
//     const outgoing: OutgoingRequest[] = [];

//     usersWithRequests.forEach((user) => {
//       user.requests.forEach((request) => {
//         if (request.from && request.from._id.toString() === userId) {
//           outgoing.push({
//             to: {
//               _id: user._id,
//               name: user.name,
//               slug: user.slug,
//             },
//             team: request.team,
//           });
//         }
//       });
//     });

//     res.status(200).json({ outgoing });
//   } catch (error) {
//     console.error("Error fetching outgoing requests:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };
