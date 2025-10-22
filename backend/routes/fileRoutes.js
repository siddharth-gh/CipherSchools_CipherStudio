// routes/fileRoutes.js
import express from "express";
import { createFile, viewFile, updateFile, deleteFile, renameFile } from "../controllers/fileController.js";

const router = express.Router();

// 📝 Create new file (no auth)
router.post("/", createFile);

// 👀 View a file by ID (no auth)
router.get("/:id", viewFile);

router.put("/:id", updateFile);      // ✅ Update file
router.delete("/:id", deleteFile);   // ✅ Delete file
router.patch("/:id/rename", renameFile); // ✅ Rename file


export default router;
