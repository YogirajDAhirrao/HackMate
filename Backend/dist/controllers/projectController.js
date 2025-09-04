import Project from "../model/project.model.js";
import Team from "../model/team.model.js";
export const addProjectToTeam = async (req, res) => {
    try {
        const { teamId } = req.params;
        const { title, description, techStack, githubRepo, liveDemo } = req.body;
        const userId = req.userId;
        // 1. Check if team exists
        const team = await Team.findById(teamId);
        if (!team) {
            res.status(404).json({ message: "Team not found" });
            return;
        }
        // 2. Ensure only team admin can add project
        if (team.admin.toString() !== userId) {
            res
                .status(403)
                .json({ message: "Only the team admin can add a project" });
            return;
        }
        // 3. Create new project
        const project = new Project({
            title,
            description,
            techStack,
            githubRepo,
            liveDemo,
            team: team._id,
            createdBy: userId,
        });
        // 4. Save project to DB
        await project.save();
        // 5. Attach project to the team (optional if we want a projects array)
        team.projects = team.projects || [];
        team.projects.push(project._id);
        await team.save();
        // 6. Send response
        res.status(201).json({
            message: "Project added successfully",
            project,
        });
    }
    catch (error) {
        console.error("Error adding project to team:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
