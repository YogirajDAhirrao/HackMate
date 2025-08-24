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
import projectRouter from "./routes/project.routes.js";
dotenv.config();

const app = express();

// ✅ Allow both local dev and production frontend
const allowedOrigins = [
  "http://localhost:5173", // Local Vite frontend
  "https://hackmate-io.vercel.app", // Deployed frontend
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin, like mobile apps or curl
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked: ${origin} not allowed`));
      }
    },
    credentials: true,
  })
);

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
app.use("/friend-request", friendRequestRouter);
app.use("/team-invite", teamInviteRouter);
app.use("/add-project", projectRouter);

app.get("/", (req, res) => {
  res.send("Hackmate API is running 🚀");
});

export default app;
