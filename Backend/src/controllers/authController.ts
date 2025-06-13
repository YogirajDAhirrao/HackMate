import { NextFunction, Request, RequestHandler, Response } from "express";
import User from "../model/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import slugify from "slugify";
import { JWT_SECRET } from "../config/config.js";

export const signup: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { name, email, password, interests, skills, bio, github } = req.body;
  const slug = slugify(name, { lower: true, strict: true });

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return; // Explicitly return void
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      interests,
      skills,
      bio,
      github,
      slug
    });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    res
      .status(201)
      .json({ message: "User registered successfully", userId: user._id });
  } catch (error) {
    next(error);
  }
};

export const login: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "none",
      secure: process.env.NODE_ENV === "production",
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      path: "/",
    });
    console.log(`login cookie ${token} , ${user.name}`);

    res.status(200).json({ token, userId: user._id });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error });
  }
};

export const logout: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Clear the token cookie by setting it to an empty value with an expired date
    res.cookie("token", "", {
      httpOnly: true,
      sameSite: "none",
      secure: process.env.NODE_ENV === "production",
      expires: new Date(0), // Expire immediately
      path: "/",
    });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Logout failed", error });
  }
};
