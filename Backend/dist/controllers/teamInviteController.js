import mongoose from "mongoose";
import TeamInvite from "../model/teamInvite.model.js";
import User from "../model/user.model.js";
import Team from "../model/team.model.js";
export const sendTeamInvite = async (req, res) => {
    try {
        const inviterId = req.userId;
        const { teamId, userId: inviteeId } = req.params;
        if (!inviterId || !teamId || !inviteeId) {
            res.status(400).json({ message: "Invalid request" });
            return;
        }
        if (inviterId === inviteeId) {
            res.status(400).json({ message: "You cannot invite yourself" });
            return;
        }
        // Validate team
        const team = await Team.findById(teamId);
        if (!team) {
            res.status(404).json({ message: "Team not found" });
            return;
        }
        // Validate users
        const inviter = await User.findById(inviterId);
        const invitee = await User.findById(inviteeId);
        if (!inviter || !invitee) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        // Check if they are friends
        const areFriends = inviter.friends.some((friendId) => friendId.equals(inviteeId));
        if (!areFriends) {
            res
                .status(400)
                .json({ message: "You can only invite your friends to the team" });
            return;
        }
        // Check if user is already in the team
        const isMember = team.members.some((memberId) => memberId.equals(inviteeId));
        if (isMember) {
            res.status(400).json({ message: "User is already a team member" });
            return;
        }
        // Check if invite already exists
        const existingInvite = await TeamInvite.findOne({
            from: inviterId,
            to: inviteeId,
            team: teamId,
            status: "pending",
        });
        if (existingInvite) {
            res.status(400).json({ message: "Team invite already sent" });
            return;
        }
        // Create the team invite
        const teamInvite = new TeamInvite({
            from: inviterId,
            to: inviteeId,
            team: teamId,
        });
        await teamInvite.save();
        res
            .status(201)
            .json({ message: "Team invite sent successfully", teamInvite });
    }
    catch (error) {
        console.error("Error sending team invite:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
export const acceptTeamInvite = async (req, res) => {
    try {
        const userId = req.userId;
        const inviteId = req.params.inviteId;
        if (!userId || !inviteId) {
            res.status(400).json({ message: "Invalid request" });
            return;
        }
        const teamInvite = await TeamInvite.findById(inviteId);
        console.log("team Invite", teamInvite);
        if (!teamInvite) {
            res.status(404).json({ message: "Team invite not found" });
            return;
        }
        if (teamInvite.status !== "pending") {
            res.status(400).json({ message: "Team invite is not pending" });
            return;
        }
        if (teamInvite.to.toString() !== userId) {
            res
                .status(403)
                .json({ message: "You are not authorized to accept this invite" });
            return;
        }
        // Add user to the team
        const team = await Team.findById(teamInvite.team);
        if (!team) {
            res.status(404).json({ message: "Team not found" });
            return;
        }
        // Avoid adding duplicates
        if (!team.members.some((memberId) => memberId.equals(userId))) {
            team.members.push(new mongoose.Types.ObjectId(userId));
            await team.save();
        }
        // ✅ Update user's teams array
        const user = await User.findById(userId);
        if (user && !user.teams.some((teamId) => teamId.equals(team._id))) {
            user.teams.push(team._id);
            await user.save();
        }
        // Update invite status
        teamInvite.status = "accepted";
        await teamInvite.save();
        res.status(200).json({ message: "Team invite accepted successfully" });
    }
    catch (error) {
        console.error("Error accepting team invite:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
export const rejectTeamInvite = async (req, res) => {
    try {
        const userId = req.userId;
        const inviteId = req.params.inviteId;
        if (!userId || !inviteId) {
            res.status(400).json({ message: "Invalid request" });
            return;
        }
        const teamInvite = await TeamInvite.findById(inviteId);
        if (!teamInvite) {
            res.status(404).json({ message: "Team invite not found" });
            return;
        }
        if (teamInvite.status !== "pending") {
            res.status(400).json({ message: "Team invite is not pending" });
            return;
        }
        if (teamInvite.to.toString() !== userId) {
            res
                .status(403)
                .json({ message: "You are not authorized to reject this invite" });
            return;
        }
        // Update invite status to rejected
        teamInvite.status = "rejected";
        await teamInvite.save();
        res.status(200).json({ message: "Team invite rejected successfully" });
    }
    catch (error) {
        console.error("Error rejecting team invite:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
export const getIncomingTeamInvites = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) {
            res.status(400).json({ message: "Invalid request" });
            return;
        }
        const invites = await TeamInvite.find({
            to: userId,
            status: "pending",
        })
            .populate("from", "name email slug")
            .populate("team", "name description slug");
        res.status(200).json({ incomingTeamInvites: invites });
    }
    catch (error) {
        console.error("Error fetching incoming team invites:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
export const getOutgoingTeamInvites = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) {
            res.status(400).json({ message: "Invalid request" });
            return;
        }
        const invites = await TeamInvite.find({
            from: userId,
            status: "pending",
        })
            .populate("to", "name email slug")
            .populate("team", "name description slug");
        res.status(200).json({ outgoingTeamInvites: invites });
    }
    catch (error) {
        console.error("Error fetching outgoing team invites:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
