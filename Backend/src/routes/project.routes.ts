import express from "express";
import { addProjectToTeam } from "../controllers/projectController.js";
import verifyJWT from "../middlewares/verifyJWT.js";

const projectRouter = express.Router();

// @route   POST /api/projects/:teamId
// @desc    Add a project to a team (Admin only)
// @access  Private
projectRouter.post("/:teamId", verifyJWT, addProjectToTeam);

export default projectRouter;
