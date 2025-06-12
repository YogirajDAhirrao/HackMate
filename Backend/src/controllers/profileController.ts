import { Request, Response, NextFunction, RequestHandler } from "express";
import User from "../model/user.model.js"; // Adjust path if needed

// Extend Request to include userId
interface AuthRequest extends Request {
  userId?: string;
}

export const getProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    const user = await User.findById(userId).select("-password"); // exclude password

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    next(error); // or: res.status(500).json({ message: "Something went wrong", error });
  }
};

export const updateProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const userId = req.userId;
  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const { name, email, bio, github, skills, interests, } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email, bio, github, skills, interests },
      { new: true }
    ).select("-password"); // Don't return password

    if (!updatedUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({ message: "Profile updated", user: updatedUser });
  } catch (error) {
    next(error);
  }
};
