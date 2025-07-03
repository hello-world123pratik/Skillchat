import express from "express";
import {
  sendMessage,
  getGroupMessages,
  getConversations, 
  sendDirectMessage,
  getDirectMessages,// <-- you need to define this controller too
} from "../controllers/messageController.js";
import { protect } from "../middleware/authMiddleware.js";
import { deleteMessage } from "../controllers/messageController.js";

const router = express.Router();

// Define this route BEFORE any dynamic params like :groupId
router.get("/conversations", protect, getConversations);

router.post("/", protect, sendMessage);
router.get("/:groupId", protect, getGroupMessages);

router.delete("/:id", protect, deleteMessage);

router.get("/direct/:userId", protect, getDirectMessages);
router.post("/direct", protect, sendDirectMessage); 

export default router;
