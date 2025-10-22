import mongoose, { Schema } from "mongoose";

const projectSchema = new Schema(
    {
        userId: { type: String, required: true },
        name: { type: String, required: true },
        description: { type: String, default: "" },
    },
    { timestamps: true }
);

export default mongoose.model("Project", projectSchema);
