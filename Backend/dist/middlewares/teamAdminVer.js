import Team from "../model/team.model.js"; // Adjust path if different
export const isTeamAdmin = async (req, res, next) => {
    try {
        const teamId = req.params.id;
        const userId = req.userId; // Cast req to any to access userId (injected by auth middleware)
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
        req.team = team;
        next();
    }
    catch (err) {
        console.error("Error in isTeamAdmin middleware:", err);
        res.status(500).json({ message: "Server error" });
    }
};
