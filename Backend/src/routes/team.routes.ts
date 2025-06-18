import { Router } from "express";
import {
  createTeam,
  getMyTeams,
  addMemberToTeam,
  removeMemberFromTeam,
  deleteTeam,
  leaveTeam,
} from "../controllers/teamController.js";
import { isTeamAdmin } from "../middlewares/teamAdminVer.js";

const teamRouter = Router();

// Create a team
teamRouter.post("/create", createTeam);

// Get current user's team
teamRouter.get("/me", getMyTeams);

// Add member (admin only)
teamRouter.put("/:id/add-member", isTeamAdmin, addMemberToTeam);

// Remove member (admin only)
teamRouter.post("/remove-member/:memberId", isTeamAdmin, removeMemberFromTeam);

// Delete team (admin only)
teamRouter.delete("/:id", isTeamAdmin, deleteTeam);

// Leave team
teamRouter.post("/leave", leaveTeam);

export default teamRouter;
