import { Router } from "express";
import { getUserById, getUsers } from "../controllers/usersControllers.js";
const usersRouter = Router();
usersRouter.get("/", getUsers);
usersRouter.get("/:slug", getUserById);
export default usersRouter;
