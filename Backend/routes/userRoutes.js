import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

// GET all valid users (excluding current user)
router.get("/", protect, async (req, res) => {
  try {
    const users = await User.find({
      _id: { $ne: req.user._id },
      name: { $exists: true, $ne: "" },
      email: { $exists: true, $ne: "" }
    }).select("name email");

    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});
// GET single user by ID
router.get("/:id", protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("name email _id profileImage");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("Error fetching user by ID:", err);
    res.status(400).json({ error: "Invalid user ID format" });
  }
});


export default router;
