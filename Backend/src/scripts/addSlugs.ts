import mongoose from "mongoose";
import dotenv from "dotenv";
import slugify from "slugify";
import User from "../model/user.model";

dotenv.config();

const addSlugsToUsers = async () => {
  try {
    // Connect to the database
    await mongoose.connect(
      process.env.MONGO_URI as string,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      } as mongoose.ConnectOptions
    );
    console.log("Connected to MongoDB");

    // Find all users without a slug
    const users = await User.find({ slug: { $exists: false } });

    if (users.length === 0) {
      console.log("No users need slug updates.");
      return;
    }

    // Update each user with a slug
    for (const user of users) {
      let baseSlug = slugify(user.name, { lower: true, strict: true });
      let slug = baseSlug;
      let count = 1;

      // Handle conflicts by appending a number
      while (await User.findOne({ slug, _id: { $ne: user._id } })) {
        slug = `${baseSlug}-${count}`;
        count++;
      }

      user.slug = slug;
      await user.save();
      console.log(`Updated user ${user.name} with slug ${slug}`);
    }

    console.log(`Updated ${users.length} users with slugs.`);
  } catch (error) {
    console.error("Error during migration:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
};

addSlugsToUsers();
