// import { NextFunction, Request, Response } from "express";
// import User from "../model/user.model.js";

// interface AuthRequest extends Request {
//   userId?: string;
// }

// export const getUsers = async (
//   req: AuthRequest,
//   res: Response,
//   next: NextFunction
// ): Promise<void> => {
//   try {
//     const { skills, interests } = req.query;

//     const filter: any = {};

//     if (skills) {
//       const skillsArray = Array.isArray(skills)
//         ? skills
//         : (skills as string).split(",");
//       filter.skills = { $all: skillsArray };
//     }

//     if (interests) {
//       const interestsArray = Array.isArray(interests)
//         ? interests
//         : (interests as string).split(",");
//       filter.interests = { $all: interestsArray };
//       // this is  a mongo db operator which builds up the filter object before finding the users and is to be used in find method  for example
//       //   User.find({
//       //     skills: { $all: ["nodejs", "typescript"] }
//       //   })
//     }

//     const users =  await User.find(filter).select("-password");
//     res.status(200).json(users);
//   } catch (error) {
//     console.error("Error in geting users", error);
//     res.status(404);
//     return;
//   }
//   return;
// };

import { NextFunction, Request, Response } from "express";
import User from "../model/user.model.js";
import slugify from "slugify";

interface AuthRequest extends Request {
  userId?: string;
}

export const getUsers = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { skills, interests } = req.query;

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

    const users = await User.find(filter).select("-password"); // Await the query
    res.status(200).json(users);
  } catch (error) {
    console.error("Error in getting users", error);
    res.status(404).json({ message: "Failed to fetch users" }); // Send a proper response
    // Alternatively, pass to error middleware: next(error);
  }
};

import { v4 as uuidv4 } from "uuid";

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { slug } = req.params;

    // Fetch user by slug
    let user  = await User.findOne({ slug }).select("-password");

    if (!user) {
      // Fallback: Find a user without a slug (optional, can be removed if migration script has run)
      user = await User.findOne({ slug: { $exists: false } }).select(
        "-password"
      );

      if (user) {
        let baseSlug: string = slugify(user.name, {
          lower: true,
          strict: true,
        });

        // Fallback for empty/invalid slugs
        if (!baseSlug || baseSlug.length < 1) {
          baseSlug = `user-${uuidv4().split("-")[0]}`; // e.g., user-123e4567
        }

        let newSlug: string = baseSlug;
        let count: number = 1;

        // Ensure the new slug is unique
        while (await User.findOne({ slug: newSlug, _id: { $ne: user._id } })) {
          newSlug = `${baseSlug}-${count}`;
          count++;
        }

        user.slug = newSlug;
        await user.save();

        // Instead of redirecting, return the new slug and let the frontend handle it
        if (slug !== newSlug) {
          res.status(301).json({
            message: "User slug updated",
            newSlug: newSlug,
            redirect: `/profile/${newSlug}`,
          });
          return; // Ensure no further response is sent
        }
      }
    }

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return; // Ensure no further response is sent
    }

    res.json(user);
  } catch (error) {
    console.error("Error in getUserById:", error);
    next(error); // Delegate to error-handling middleware
  }
};
