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
      res
        .status(401)
        .json({ success: false, message: "User not authenticated" });
      return;
    }

    const user = await User.findById(userId)
      .select("-password")
      .populate("friends", "name email github slug") // ✅ Populating friends with selected fields
      .populate("teams", "name slug");

    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    next(error);
  }
};

export const updateProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const userId = req.userId;

  if (!userId) {
    res.status(401).json({ success: false, message: "Unauthorized" });
    return;
  }

  const { name, bio, github, skills, interests } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, bio, github, skills, interests },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    res
      .status(200)
      .json({ success: true, message: "Profile updated", user: updatedUser });
  } catch (error) {
    next(error);
  }
};
