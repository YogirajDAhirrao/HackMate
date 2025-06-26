import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import Team from "../model/team.model.js";
import User from "../model/user.model.js";

interface AuthRequest extends Request {
  userId?: string;
}

export const createTeam = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const userId = req.userId;
  const { name, description } = req.body;

  if (!name?.trim()) {
    res.status(400).json({ message: "Team name is required" });
    return;
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const newTeam = await Team.create({
      name,
      description,
      admin: userId,
      members: [userId],
    });

    user.teams.push(newTeam._id);
    await user.save();

    const fullTeam = await Team.findById(newTeam._id)
      .populate("admin", "name email slug")
      .populate("members", "name email github slug");

    res
      .status(201)
      .json({ message: "Team created successfully", team: fullTeam });
  } catch (error) {
    console.error("Create Team Error:", error);
    res.status(500).json({ message: "Failed to create team" });
  }
};

export const getMyTeams = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const teams = await Team.find({ members: userId })
      .populate("members", "name email github slug")
      .populate("admin", "name email slug");

    res.status(200).json({ teams });
  } catch (error) {
    console.error("Get My Teams Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const addMemberToTeam = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id: teamId } = req.params;
    const { memberId } = req.body;
    const userId = req.userId;

    const team = await Team.findById(teamId);
    if (!team) {
      res.status(404).json({ message: "Team not found" });
      return;
    }

    if (!team.admin.equals(userId)) {
      res.status(403).json({ message: "Only team admins can add members" });
      return;
    }

    if (team.members.some((id) => id.equals(memberId))) {
      res.status(400).json({ message: "Member already in the team" });
      return;
    }

    const member = await User.findById(memberId);
    if (!member) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    team.members.push(new mongoose.Types.ObjectId(memberId));
    await team.save();

    member.teams.push(team._id);
    await member.save();

    res.status(200).json({ message: "Member added successfully", team });
  } catch (error) {
    console.error("Add Member Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const removeMemberFromTeam = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id: teamId } = req.params;
    const { memberId } = req.body;
    const userId = req.userId;

    const team = await Team.findById(teamId);
    if (!team) {
      res.status(404).json({ message: "Team not found" });
      return;
    }

    if (!team.admin.equals(userId)) {
      res.status(403).json({ message: "Only team admins can remove members" });
      return;
    }

    if (!team.members.some((id) => id.equals(memberId))) {
      res.status(400).json({ message: "Member not in the team" });
      return;
    }

    if (team.admin.toString() === memberId.toString()) {
      res.status(400).json({ message: "Admin cannot remove themselves" });
      return;
    }

    team.members = team.members.filter((id) => id.toString() !== memberId);
    await team.save();

    const member = await User.findById(memberId);
    if (member) {
      member.teams = member.teams.filter((tid) => tid.toString() !== teamId);
      await member.save();
    }

    res.status(200).json({ message: "Member removed successfully", team });
  } catch (error) {
    console.error("Remove Member Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteTeam = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id: teamId } = req.params;
    const userId = req.userId;

    const team = await Team.findById(teamId);
    if (!team) {
      res.status(404).json({ message: "Team not found" });
      return;
    }

    if (!team.admin.equals(userId)) {
      res.status(403).json({ message: "Only admin can delete the team" });
      return;
    }

    await User.updateMany(
      { _id: { $in: team.members } },
      { $pull: { teams: team._id } }
    );

    await Team.findByIdAndDelete(teamId);

    res.status(200).json({ message: "Team deleted successfully" });
  } catch (error) {
    console.error("Delete Team Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const leaveTeam = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id: teamId } = req.params;
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const team = await Team.findById(teamId);
    if (!team || !team.members.some((id) => id.equals(userId))) {
      res
        .status(404)
        .json({ message: "Team not found or you are not a member" });
      return;
    }

    const teamIdStr = team._id.toString();

    // Remove user from team members
    team.members = team.members.filter((id) => id.toString() !== userId);

    if (team.admin.toString() === userId) {
      if (team.members.length > 0) {
        team.admin = team.members[0];
      } else {
        await User.updateOne({ _id: userId }, { $pull: { teams: team._id } });
        await Team.findByIdAndDelete(team._id);
        res.status(200).json({ message: "Team deleted and you have left" });
        return;
      }
    }

    await team.save();

    user.teams = user.teams.filter((tid) => tid.toString() !== teamIdStr);
    await user.save();

    res.status(200).json({ message: "You have left the team" });
  } catch (error) {
    console.error("Leave Team Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
