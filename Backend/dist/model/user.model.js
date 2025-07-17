import mongoose from "mongoose";
import slugify from "slugify";
const userSchema = new mongoose.Schema({
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
        match: [/\S+@\S+\.\S+/, "Please enter a valid email address"],
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
    teams: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Team",
        },
    ],
    friends: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
}, { timestamps: true });
// Pre-save slug generator
userSchema.pre("save", async function (next) {
    if (this.isNew || this.isModified("name")) {
        let baseSlug = slugify(this.name, { lower: true, strict: true });
        let slug = baseSlug;
        let count = 1;
        const User = mongoose.model("User");
        while (await User.findOne({ slug, _id: { $ne: this._id } })) {
            slug = `${baseSlug}-${count}`;
            count++;
        }
        this.slug = slug;
    }
    next();
});
userSchema.index({ slug: 1 });
const User = mongoose.model("User", userSchema);
export default User;
