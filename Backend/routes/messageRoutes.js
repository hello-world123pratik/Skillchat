import express from "express";
import {
  sendMessage,
  getGroupMessages,
  getConversations,
  sendDirectMessage,
  getDirectMessages,
  deleteMessage
} from "../controllers/messageController.js";
import { protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Specific routes must come before dynamic ones!
router.get("/conversations", protect, getConversations);
router.get("/direct/:userId", protect, getDirectMessages);
router.post("/direct", protect, sendDirectMessage);

router.post("/", protect, upload.single("file"), sendMessage);
router.get("/:groupId", protect, getGroupMessages);
router.delete("/:id", protect, deleteMessage);

export default router;
