import express from "express";
import { createProject, getUserProjects } from "../controllers/projectController.js";

const router = express.Router();

router.post("/", createProject);
router.get("/", getUserProjects); // ✅ Fetch all user projects


export default router;
