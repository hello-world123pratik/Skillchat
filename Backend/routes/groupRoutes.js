import express from "express";
import {
  createGroup,
  getAllGroups,
  getGroupDetails,
  joinGroup,
  getMyGroups,
  leaveGroup,
  removeGroupMember,
  updateGroup,
} from "../controllers/groupController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// More specific routes first
router.get("/my", protect, getMyGroups);              // Get groups user is part of
router.get("/", protect, getAllGroups);               // Get all groups
router.post("/", protect, createGroup);               // Create a group
router.post("/:id/join", protect, joinGroup);         // Join a group
router.post("/:id/leave", protect, leaveGroup);       // Leave a group
router.delete("/:groupId/members/:memberId", protect, removeGroupMember); // Remove member from group
router.put("/:id", protect, updateGroup);             // Edit group (name/description)

// This should come last to avoid conflicts with the above
router.get("/:id", protect, getGroupDetails);         // Get group details (includes members)

export default router;
