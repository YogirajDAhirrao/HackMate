import { NextFunction, Request, Response } from "express";
import User from "../model/user.model.js";
import slugify from "slugify";
import { v4 as uuidv4 } from "uuid";

interface AuthRequest extends Request {
  userId?: string;
}

/**
 * @desc Get all users with optional filtering and pagination
 * @route GET /users
 */
export const getUsers = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { skills, interests, page = "1", limit = "10" } = req.query;

    const filter: any = {};

    if (skills) {
      const skillsArray = Array.isArray(skills)
        ? skills
        : (skills as string).split(",");
      filter.skills = { $all: skillsArray };
    }

    if (interests) {
      const interestsArray = Array.isArray(interests)
        ? interests
        : (interests as string).split(",");
      filter.interests = { $all: interestsArray };
    }

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);

    const users = await User.find(filter)
      .select("-password")
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      page: pageNum,
      limit: limitNum,
      users,
    });
  } catch (error) {
    console.error("Error in getting users:", error);
    res.status(500).json({ success: false, message: "Failed to fetch users" });
  }
};

/**
 * @desc Get a user by slug
 * @route GET /users/:slug
 */
export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { slug } = req.params;

    let user = await User.findOne({ slug }).select("-password");

    // Fallback for users missing slug (migration phase)
    if (!user) {
      user = await User.findOne({ slug: { $exists: false } }).select(
        "-password"
      );

      if (user) {
        let baseSlug: string = slugify(user.name, {
          lower: true,
          strict: true,
        });

        if (!baseSlug || baseSlug.length < 1) {
          baseSlug = `user-${uuidv4().split("-")[0]}`;
        }

        let newSlug: string = baseSlug;
        let count: number = 1;

        while (await User.findOne({ slug: newSlug, _id: { $ne: user._id } })) {
          newSlug = `${baseSlug}-${count}`;
          count++;
        }

        user.slug = newSlug;
        await user.save();

        if (slug !== newSlug) {
          res.status(301).json({
            success: true,
            message: "User slug updated",
            newSlug: newSlug,
            redirect: `/profile/${newSlug}`,
          });
          return;
        }
      }
    }

    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Error in getUserById:", error);
    next(error);
  }
};
