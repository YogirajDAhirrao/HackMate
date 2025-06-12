import { NextFunction, Request, Response } from "express";

import Team from "../model/team.model.js";
import User from "../model/user.model.js";

interface AuthRequest extends Request {
  userId?: string;
}

export const createTeam = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const userId = req.userId;
  const { name, description } = req.body;
  try {
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      res.status(404).json({ message: "User Not Found" });
      return;
    }
    if (existingUser.team) {
      res.status(400).json({ message: "U are already in a team" });
      return;
    }

    const newTeam = await Team.create({
      name,
      description,
      admin: userId,
      members: [userId],
    });
    // Update user with team reference
    existingUser.team = newTeam._id;
    await existingUser.save();

    res.status(201).json({
      message: "Team created successfully",
      teamId: newTeam._id,
    });
  } catch (error) {
    console.error("Error creating team:", error);
    res.status(500).json({ message: "Failed to create team" });
  }
};

export const getMyTeams = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const userId = req.userId;
  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const foundUser = await User.findById(userId);
    if (!foundUser) {
      res.status(404).json({ message: "User not found! Something went wrong" });
      return;
    }
    if (!foundUser.team) {
      res
        .status(200)
        .json({ message: "User is not part of any team", team: null });
      return;
    }
    const team = await Team.findById(foundUser.team)
      .populate("members", "name email github")
      .populate("admin", "name email");
    res.status(200).json({ team });
  } catch (error) {
    console.error("Error fetching user's team:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
export const addMemberToTeam = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const teamId = req.params.id;
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

    if (team.members.includes(memberId)) {
      res.status(400).json({ message: "Member already in the team" });
      return;
    }

    team.members.push(memberId);
    await team.save();

    res.status(200).json({ message: "Member added successfully", team });
  } catch (error) {
    console.error("Error adding member:", error);
    res.status(500).json({ message: "Server error" });
  }
};
export const removeMemberFromTeam = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const teamId = req.params.id;
    const { memberId } = req.body;
    const userId = (req as any).userId;

    const team = await Team.findById(teamId);

    if (!team) {
      res.status(404).json({ message: "Team not found" });
      return;
    }

    if (!team.admin.equals(userId)) {
      res.status(403).json({ message: "Only team admins can remove members" });
      return;
    }

    if (!team.members.includes(memberId)) {
      res.status(400).json({ message: "Member not in the team" });
      return;
    }

    // Prevent admin from removing themselves
    if (team.admin.toString() === memberId.toString()) {
      res.status(400).json({ message: "Admin cannot remove themselves" });
      return;
    }

    team.members = team.members.filter(
      (member) => member.toString() !== memberId
    );
    await team.save();

    res.status(200).json({ message: "Member removed successfully", team });
  } catch (err) {
    console.error("Error removing member:", err);
    res.status(500).json({ message: "Server error" });
  }
};
export const deleteTeam = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const teamId = req.params.id;
    const userId = req.userId;

    const team = await Team.findById(teamId);
    if (!team) {
      res.status(404).json({ message: "Team not found" });
      return;
    }

    if (!team.admin.equals(userId)) {
      res.status(403).json({ message: "Only the admin can delete the team" });
      return;
    }

    await Team.findByIdAndDelete(teamId);

    res.status(200).json({ message: "Team deleted successfully" });
  } catch (error) {
    console.error("Error deleting team:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const leaveTeam = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
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

    const team = await Team.findById(user.team);

    if (team) {
      team.members = team.members.filter(
        (memberId) => memberId.toString() !== userId
      );
      // If user was admin then transfer or delete the team
      if (team.admin.toString() === userId) {
        if (team.members.length > 0) {
          team.admin = team.members[0]; // made a new admin
        } else {
          await Team.findByIdAndDelete(team._id);
          user.team = null as any;
          await user.save();
          res.status(200).json({ message: "Team deleted and you have left" });
          return;
        }
      }
      await team.save();
      user.team = null as any;
      await user.save();
      res.status(200).json({ message: "You have left the team" });
      return;
    } else {
      // Cleanup broken reference if team doesn't exist
      user.team = null as any;
      await user.save();
      res
        .status(400)
        .json({ message: "Team not found. You have been unlinked." });
      return;
    }
    // TODO: Notify team members that user has left
  } catch (error) {
    console.error("Error leaving team:", error);
    res.status(500).json({ message: "Server error" });
  }
};
