import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRouter from "./routes/auth.routes.js";
import verifyJWT from "./middlewares/verifyJWT.js";
import ProfileRouter from "./routes/profile.routes.js";
import teamRouter from "./routes/team.routes.js";
import RequestRouter from "./routes/requests.routes.js";
import usersRouter from "./routes/users.routes.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/auth", authRouter);
app.use(verifyJWT); // applies after /auth
app.use("/profile", ProfileRouter);
app.use("/users", usersRouter);
app.use("/team", teamRouter);
app.use("/request", RequestRouter);

app.get("/", (req, res) => {
  res.send("Hackmate API is running 🚀");
});

export default app;
