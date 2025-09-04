import mongoose from "mongoose";
const teamSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, default: "" },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    // 🔹 New field to track all projects for this team
    projects: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
            default: [],
        },
    ],
}, { timestamps: true });
const Team = mongoose.model("Team", teamSchema);
export default Team;
