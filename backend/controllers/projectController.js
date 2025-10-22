import Project from "../models/Project.js";
import File from "../models/File.js";
import s3 from "../config/s3.js";
import { v4 as uuidv4 } from "uuid";

/**
 * Helper: Upload file to S3
 */
const createFileInS3 = async (key, content, mimeType) => {
    await s3
        .putObject({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: key,
            Body: Buffer.from(content, "utf-8"),
            ContentType: mimeType,
        })
        .promise();
};

/**
 * Default boilerplate files for new projects
 */
const boilerplateFiles = [
    {
        path: "src/App.js",
        language: "javascript",
        mimeType: "application/javascript",
        content: `export default function App() {
  return (
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      <h1>Hello from CipherStudio ⚡</h1>
      <p>Edit and run React code instantly!</p>
    </div>
  );
}`,
    },
    {
        path: "src/index.js",
        language: "javascript",
        mimeType: "application/javascript",
        content: `import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);`,
    },
    {
        path: "public/index.html",
        language: "html",
        mimeType: "text/html",
        content: `<div id="root"></div>`,
    },
];

/**
 * @desc Create new project with default structure
 * @route POST /api/projects
 * @access Private (temporary open)
 */
export const createProject = async (req, res) => {
    try {
        const { name, userId } = req.body;

        if (!name || !userId) {
            return res.status(400).json({ message: "Project name and userId required" });
        }

        // 🧩 Step 1: Create project in DB
        const project = await Project.create({ name, userId });

        // 🧩 Step 2: Create root folders
        const folders = [
            { name: "src", type: "folder", parentId: null },
            { name: "public", type: "folder", parentId: null },
        ];

        const createdFolders = await File.insertMany(
            folders.map((folder) => ({
                ...folder,
                projectId: project._id,
            }))
        );

        const srcFolder = createdFolders.find((f) => f.name === "src");
        const publicFolder = createdFolders.find((f) => f.name === "public");

        // 🧩 Step 3: Create boilerplate files in S3 + DB
        for (const file of boilerplateFiles) {
            const parentFolder = file.path.startsWith("src") ? srcFolder : publicFolder;
            const fileName = file.path.split("/").pop();
            const key = `users/${userId}/projects/${project._id}/${uuidv4()}-${fileName}`;

            await createFileInS3(key, file.content, file.mimeType);

            await File.create({
                projectId: project._id,
                parentId: parentFolder._id,
                name: fileName,
                type: "file",
                s3Key: key,
                language: file.language,
                sizeInBytes: file.content.length,
            });
        }

        res.status(201).json({
            message: "✅ Project created successfully",
            project: {
                _id: project._id,
                name: project.name,
                userId: project.userId,
            },
            defaultFiles: boilerplateFiles.map((b) => b.path),
        });
    } catch (error) {
        console.error("❌ Error creating project:", error);
        res
            .status(500)
            .json({ message: "Error creating project", error: error.message });
    }
};

/**
 * @desc Get all projects for a user
 * @route GET /api/projects?userId=...
 */
export const getUserProjects = async (req, res) => {
    try {
        const { userId } = req.query;
        if (!userId) {
            return res.status(400).json({ message: "userId is required" });
        }

        const projects = await Project.find({ userId }).sort({ createdAt: -1 });
        res.json({ projects });
    } catch (error) {
        console.error("❌ Error fetching projects:", error);
        res.status(500).json({
            message: "Error fetching projects",
            error: error.message,
        });
    }
};
