// routes/folderRoutes.js
import express from "express";
import {
    createFolder,
    getFolderContents,
    renameFolder,
    deleteFolder,
} from "../controllers/folderController.js";

const router = express.Router();

// 🧩 Folder APIs
router.post("/", createFolder);
router.get("/:parentId", getFolderContents);
router.patch("/:id/rename", renameFolder);
router.delete("/:id", deleteFolder);

export default router;
