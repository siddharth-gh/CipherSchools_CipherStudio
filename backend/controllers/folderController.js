// controllers/folderController.js
import File from "../models/File.js";

/**
 * @desc Create a new folder
 * @route POST /api/folders
 * @access Private
 */
export const createFolder = async (req, res) => {
    try {
        const { projectId, parentId, name } = req.body;

        // ✅ Check if folder already exists in same parent
        const existingFolder = await File.findOne({
            projectId,
            parentId: parentId || null,
            name,
            type: "folder",
        });

        if (existingFolder) {
            return res.status(400).json({ message: "A folder with this name already exists here" });
        }

        const folder = await File.create({
            projectId,
            parentId: parentId || null,
            name,
            type: "folder",
        });

        res.status(201).json({
            message: "Folder created successfully ✅",
            folder,
        });
    } catch (error) {
        console.error("❌ Error creating folder:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

/**
 * @desc Get all files/folders inside a given folder
 * @route GET /api/folders/:parentId?projectId=
 * @access Private
 */
export const getFolderContents = async (req, res) => {
    try {
        const { parentId } = req.params;
        const { projectId } = req.query;

        const query = {
            projectId,
            parentId: parentId === "null" ? null : parentId,
        };

        const items = await File.find(query).sort({ type: 1, name: 1 });

        res.json({
            parentId: parentId === "null" ? null : parentId,
            items,
        });
    } catch (error) {
        console.error("❌ Error fetching folder contents:", error);
        res.status(500).json({ message: "Error fetching folder contents", error: error.message });
    }
};

/**
 * @desc Rename a folder
 * @route PATCH /api/folders/:id/rename
 * @access Private
 */
export const renameFolder = async (req, res) => {
    try {
        const { newName } = req.body;

        if (!newName || newName.trim() === "") {
            return res.status(400).json({ message: "New name is required" });
        }

        const folder = await File.findById(req.params.id);
        if (!folder || folder.type !== "folder") {
            return res.status(404).json({ message: "Folder not found" });
        }

        // ✅ Prevent duplicate names in same parent
        const duplicate = await File.findOne({
            projectId: folder.projectId,
            parentId: folder.parentId,
            name: newName,
            type: "folder",
        });

        if (duplicate) {
            return res.status(400).json({ message: "A folder with this name already exists" });
        }

        folder.name = newName;
        folder.updatedAt = new Date();
        await folder.save();

        res.json({
            message: "Folder renamed successfully ✅",
            folder,
        });
    } catch (error) {
        console.error("❌ Error renaming folder:", error);
        res.status(500).json({ message: "Error renaming folder", error: error.message });
    }
};

/**
 * @desc Delete a folder (and all nested files/folders recursively)
 * @route DELETE /api/folders/:id
 * @access Private
 */
export const deleteFolder = async (req, res) => {
    try {
        const folder = await File.findById(req.params.id);
        if (!folder || folder.type !== "folder") {
            return res.status(404).json({ message: "Folder not found" });
        }

        // Recursive delete helper
        const deleteRecursive = async (folderId) => {
            const children = await File.find({ parentId: folderId });

            for (const child of children) {
                if (child.type === "folder") {
                    await deleteRecursive(child._id);
                } else if (child.type === "file" && child.s3Key) {
                    // Delete file from S3
                    await s3
                        .deleteObject({
                            Bucket: process.env.AWS_BUCKET_NAME,
                            Key: child.s3Key,
                        })
                        .promise();
                }
                await child.deleteOne();
            }
        };

        // Delete all nested items
        await deleteRecursive(folder._id);

        // Delete the folder itself
        await folder.deleteOne();

        res.json({ message: "Folder and all contents deleted successfully ✅" });
    } catch (error) {
        console.error("❌ Error deleting folder:", error);
        res.status(500).json({ message: "Error deleting folder", error: error.message });
    }
};
