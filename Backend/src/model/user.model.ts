import mongoose from "mongoose";
import slugify from "slugify";

const userSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      unique: true,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      default: "",
    },
    github: {
      type: String,
      default: "",
    },
    skills: {
      type: [String],
      default: [],
    },
    interests: {
      type: [String],
      default: [],
    },
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      default: null,
    },
    requests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

// Custom hook to generate slug when name is created or updated
userSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("name")) {
    // Generate base slug from name
    let baseSlug = slugify(this.name, { lower: true, strict: true });
    let slug = baseSlug;
    let count = 1;

    // Ensure slug uniqueness
    const User = mongoose.model("User");
    while (await User.findOne({ slug, _id: { $ne: this._id } })) {
      slug = `${baseSlug}-${count}`;
      count++;
    }

    // Override any provided slug
    this.slug = slug;
  }
  next();
});

userSchema.index({ slug: 1 });

const User = mongoose.model("User", userSchema);
export default User;