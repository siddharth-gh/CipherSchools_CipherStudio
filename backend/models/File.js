// models/File.js
import mongoose, { Schema } from "mongoose";

const fileSchema = new Schema(
    {
        projectId: {
            type: String,
            ref: "Project",
            required: true,
        },
        parentId: {
            type: Schema.Types.ObjectId,
            ref: "File",
            default: null, // null for root folder
        },
        name: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: ["folder", "file"],
            required: true,
        },
        // Only for files → points to S3 location
        s3Key: {
            type: String,
            default: null,
        },
        language: {
            type: String,
            enum: ["javascript", "jsx", "css", "html", "json", "text", ""],
            default: "",
        },
        sizeInBytes: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

export default mongoose.model("File", fileSchema);
