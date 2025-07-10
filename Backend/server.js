import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import groupRoutes from "./routes/groupRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import dashRoutes from "./routes/dashboard.js";
import conversationRoutes from "./routes/conversationRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import connectDB from "./config/db.js";

// Load .env
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS for local frontend
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

// JSON parser
app.use(express.json());

// API Routes
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api", dashRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/users", userRoutes);


// Root check
app.get("/", (req, res) => {
  res.send("SkillSync Backend is running locally!");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
