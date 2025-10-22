// controllers/fileController.js
import File from "../models/File.js";
import s3 from "../config/s3.js";
import { v4 as uuidv4 } from "uuid";

/**
 * @desc Create a new file (and upload to S3)
 * @route POST /api/files
 * @access Private
 */

export const createFile = async (req, res) => {
    try {
        const { projectId, parentId, name, type, content, language, mimeType } = req.body;

        let s3Key = null;
        let sizeInBytes = 0;

        if (type === "file") {
            // 👇 use a dummy user ID while auth is disabled
            const testUserId = "test-user";
            const key = `users/${testUserId}/projects/${projectId}/${uuidv4()}-${name}`;

            const buffer = Buffer.from(content || "", "utf-8");
            sizeInBytes = buffer.length;

            await s3
                .putObject({
                    Bucket: process.env.AWS_BUCKET_NAME,
                    Key: key,
                    Body: buffer,
                    ContentType: mimeType || "text/plain",
                })
                .promise();

            s3Key = key;
        }

        const file = await File.create({
            projectId,
            parentId: parentId || null,
            name,
            type,
            s3Key,
            language,
            sizeInBytes,
        });

        res.status(201).json({
            message: "File created successfully ✅",
            file,
        });
    } catch (error) {
        console.error("❌ Error creating file:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


/**
 * @desc View a file’s content from S3
 * @route GET /api/files/:id
 * @access Private
 */
// controllers/fileController.js
export const viewFile = async (req, res) => {
    try {
        const file = await File.findById(req.params.id);
        if (!file || file.type !== "file") {
            return res.status(404).json({ message: "File not found or not a file" });
        }

        if (!file.s3Key) {
            return res.status(400).json({ message: "No S3 key found for this file" });
        }

        const data = await s3
            .getObject({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: file.s3Key,
            })
            .promise();

        res.json({
            _id: file._id, // ✅ Add this
            projectId: file.projectId,
            name: file.name,
            type: file.type,
            language: file.language,
            content: data.Body.toString("utf-8"),
            sizeInBytes: file.sizeInBytes,
            createdAt: file.createdAt,
            updatedAt: file.updatedAt,
        });
    } catch (error) {
        console.error("❌ Error viewing file:", error);
        res.status(500).json({ message: "Error fetching file", error: error.message });
    }
};


/**
 * @desc Update an existing file (overwrite content in S3 + update metadata)
 * @route PUT /api/files/:id
 * @access Private
 */
export const updateFile = async (req, res) => {
    try {
        const { content, language, mimeType, name } = req.body;

        const file = await File.findById(req.params.id);
        if (!file || file.type !== "file") {
            return res.status(404).json({ message: "File not found or not a file" });
        }

        if (!file.s3Key) {
            return res.status(400).json({ message: "No S3 key found for this file" });
        }

        // ✅ Convert content to buffer
        const buffer = Buffer.from(content || "", "utf-8");
        const sizeInBytes = buffer.length;

        // ✅ Upload new content (overwrite same S3 key)
        await s3
            .putObject({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: file.s3Key,
                Body: buffer,
                ContentType: mimeType || "text/plain",
            })
            .promise();

        // ✅ Update DB metadata
        file.sizeInBytes = sizeInBytes;
        if (language) file.language = language;
        if (name) file.name = name;
        file.updatedAt = new Date();

        await file.save();
        res.json({
            message: "File updated successfully ✅",
            file,
        });

    } catch (error) {
        console.error("❌ Error updating file:", error);
        res.status(500).json({ message: "Error updating file", error: error.message });
    }
};

/**
 * @desc Delete a file (from Mongo + S3)
 * @route DELETE /api/files/:id
 * @access Private
 */
export const deleteFile = async (req, res) => {
    try {
        const file = await File.findById(req.params.id);
        if (!file) {
            return res.status(404).json({ message: "File not found" });
        }

        // ✅ Delete from S3 if it's a file
        if (file.type === "file" && file.s3Key) {
            await s3
                .deleteObject({
                    Bucket: process.env.AWS_BUCKET_NAME,
                    Key: file.s3Key,
                })
                .promise();
        }

        // ✅ Delete from MongoDB
        await file.deleteOne();

        res.json({ message: "File deleted successfully ✅" });
    } catch (error) {
        console.error("❌ Error deleting file:", error);
        res.status(500).json({ message: "Error deleting file", error: error.message });
    }
};

/**
 * @desc Rename a file (updates name in DB + optionally S3 key)
 * @route PATCH /api/files/:id/rename
 * @access Private
 */
export const renameFile = async (req, res) => {
    try {
        const { newName } = req.body;

        if (!newName || newName.trim() === "") {
            return res.status(400).json({ message: "New name is required" });
        }

        const file = await File.findById(req.params.id);
        if (!file) {
            return res.status(404).json({ message: "File not found" });
        }

        // ✅ If it's a file stored in S3, we need to copy + delete old key (rename in S3)
        if (file.type === "file" && file.s3Key) {
            const oldKey = file.s3Key;
            const newKey = oldKey.replace(file.name, newName);

            // Copy file to new key
            await s3
                .copyObject({
                    Bucket: process.env.AWS_BUCKET_NAME,
                    CopySource: `${process.env.AWS_BUCKET_NAME}/${oldKey}`,
                    Key: newKey,
                })
                .promise();

            // Delete old key
            await s3
                .deleteObject({
                    Bucket: process.env.AWS_BUCKET_NAME,
                    Key: oldKey,
                })
                .promise();

            // Update DB with new key
            file.s3Key = newKey;
        }

        // ✅ Update file name in DB
        file.name = newName;
        file.updatedAt = new Date();
        await file.save();

        res.json({
            message: "File renamed successfully ✅",
            file,
        });
    } catch (error) {
        console.error("❌ Error renaming file:", error);
        res.status(500).json({ message: "Error renaming file", error: error.message });
    }
};
