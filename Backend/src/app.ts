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

// ✅ Allowed origins
const allowedOrigins = [
  "http://localhost:5173",
  "https://hackmate1.vercel.app",
];

// ✅ Robust CORS configuration
const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // Allow Postman or server-to-server requests with no Origin
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      // Must return the origin string when using credentials: true
      return callback(null, origin);
    } else {
      console.warn(`❌ CORS blocked: ${origin}`);
      return callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // Required for cookies
};

// ✅ Apply CORS globally (includes preflights)
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ Public routes
app.use("/auth", authRouter);

// ✅ Protected routes (requires JWT)
app.use(verifyJWT);
app.use("/chat", chatRouter);
app.use("/profile", profileRouter);
app.use("/users", usersRouter);
app.use("/team", teamRouter);
app.use("/friend-request", friendRequestRouter);
app.use("/team-invite", teamInviteRouter);
app.use("/add-project", projectRouter);

// ✅ Health check route
app.get("/", (req, res) => {
  res.send("HackMate API is running 🚀");
});

export default app;
