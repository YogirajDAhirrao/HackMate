import mongoose, { Schema } from "mongoose";
const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    techStack: [
        {
            type: String,
            required: true,
        },
    ],
    githubRepo: {
        type: String,
        default: "",
    },
    liveDemo: {
        type: String,
        default: "",
    },
    team: {
        type: Schema.Types.ObjectId,
        ref: "Team",
        required: true,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, { timestamps: true });
const Project = mongoose.model("Project", projectSchema);
export default Project;
