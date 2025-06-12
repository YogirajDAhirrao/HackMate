import { Router } from "express";
import { getProfile, updateProfile } from "../controllers/profileController.js";

const ProfileRouter = Router();
ProfileRouter.get("/me", getProfile);
ProfileRouter.put("/update", updateProfile);

export default ProfileRouter;
