import { Request, Response, NextFunction, RequestHandler } from "express";
import Team from "../model/team.model.js"; // Adjust path if different

interface AuthRequest extends Request {
  userId?: String;
  team?: typeof Team;
}

export const isTeamAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const teamId = req.params.id;
    const userId = (req as any).userId; // Cast req to any to access userId (injected by auth middleware)

    const team = await Team.findById(teamId);

    if (!team) {
      res.status(404).json({ message: "Team not found" });
      return;
    }

    if (team.admin.toString() !== userId.toString()) {
      res.status(403).json({ message: "You are not the admin of this team" });
      return;
    }

    // Attach team to request if needed in the controller
    (req as any).team = team;

    next();
  } catch (err) {
    console.error("Error in isTeamAdmin middleware:", err);
    res.status(500).json({ message: "Server error" });
  }
};
