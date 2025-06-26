import { Router } from "express";
import {
  sendTeamInvite,
  acceptTeamInvite,
  rejectTeamInvite,
  getIncomingTeamInvites,
  getOutgoingTeamInvites,
} from "../controllers/teamInviteController.js";

const teamInviteRouter = Router();

// Send a team invite (only to friends)
teamInviteRouter.post("/:teamId/:userId", sendTeamInvite);

// Accept a team invite
teamInviteRouter.post("/:inviteId/accept", acceptTeamInvite);

// Reject a team invite
teamInviteRouter.post("/:inviteId/reject", rejectTeamInvite);

// View incoming invites
teamInviteRouter.get("/incoming", getIncomingTeamInvites);

// View outgoing invites
teamInviteRouter.get("/outgoing", getOutgoingTeamInvites);

export default teamInviteRouter;
