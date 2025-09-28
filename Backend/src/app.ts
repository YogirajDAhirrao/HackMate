import express from "express";
import cors, { CorsOptions } from "cors";
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
import chatRouter from "./routes/chat.routes.js";

dotenv.config();

const app = express();

// ✅ Allow both local dev and production frontend
const allowedOrigins = [
  "http://localhost:5173",
  "https://hackmate-io.vercel.app",
  "https://hackmate1.vercel.app",
];

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // allow non-browser tools like Postman
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`❌ CORS blocked: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

// Apply once
app.use(cors(corsOptions));

// Apply for preflights too
app.options("*", cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Public Routes
app.use("/auth", authRouter);

// Protected Routes
app.use(verifyJWT);
app.use("/chat", chatRouter);
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
