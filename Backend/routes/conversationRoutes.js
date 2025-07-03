import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createOrGetConversation,
  getUserConversations,
  deleteConversation,
} from "../controllers/conversationController.js";

const router = express.Router();

router.post("/", protect, createOrGetConversation); // Start or get private chat
router.get("/", protect, getUserConversations);     // List all private chats
router.delete("/:id", protect, deleteConversation); // Delete a conversation

export default router;
