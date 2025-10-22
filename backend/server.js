// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

// 🧩 Import all route files
// import userRoutes from "./routes/userRoutes.js";
// import projectRoutes from "./routes/projectRoutes.js";
import folderRoutes from "./routes/folderRoutes.js";
import fileRoutes from "./routes/fileRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js"

dotenv.config();
connectDB();

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Root route (for testing)
app.get("/", (req, res) => {
    res.send("🚀 CipherStudio Backend is running!");
});

// ✅ Use the imported routes
app.use("/api/auth", authRoutes);
// app.use("/api/projects", projectRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/folders", folderRoutes);
app.use("/api/projects", projectRoutes);


// ✅ Error handling middleware (optional)
app.use((err, req, res, next) => {
    console.error("❌ Server error:", err.stack);
    res.status(500).json({ message: "Something broke!", error: err.message });
});

// ✅ Start the ser
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});