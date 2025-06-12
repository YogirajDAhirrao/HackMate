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

// Get all teams where the logged-in user is a member
teamRouter.get("/me", getMyTeams);

// Add member (admin only)
teamRouter.put("/:id/add-member", isTeamAdmin, addMemberToTeam);

// Remove member (admin only)
teamRouter.put("/:id/remove-member", isTeamAdmin, removeMemberFromTeam);

// Delete team (admin only)
teamRouter.delete("/:id", isTeamAdmin, deleteTeam);

teamRouter.post("leave",leaveTeam);


export default teamRouter;
