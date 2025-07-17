import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import verifyJWT from "./middlewares/verifyJWT.js";
import profileRouter from "./routes/profile.routes.js";
import teamRouter from "./routes/team.routes.js";
import usersRouter from "./routes/users.routes.js";
import friendRequestRouter from "./routes/friendRequests.routes.js";
import teamInviteRouter from "./routes/teamInvite.routes.js";
dotenv.config();
const app = express();
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// Public Routes
app.use("/auth", authRouter);
// Protected Routes
app.use(verifyJWT);
app.use("/profile", profileRouter);
app.use("/users", usersRouter);
app.use("/team", teamRouter);
app.use("/friend-request", friendRequestRouter); // New
app.use("/team-invite", teamInviteRouter); // New
app.get("/", (req, res) => {
    res.send("Hackmate API is running 🚀");
});
export default app;
