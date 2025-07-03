import express from "express";
import {
  getEvents,
  createEvent,
  getEventById,
  updateEvent,
  deleteEvent,
  getEventsByGroup,
  createGroupEvent
} from "../controllers/eventController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/")
  .get(protect, getEvents)
  .post(protect, createEvent); // For general (non-group) events

router.route("/:id")
  .get(protect, getEventById)
  .put(protect, updateEvent)
  .delete(protect, deleteEvent);

router.get("/group/:groupId", protect, getEventsByGroup); // Group-specific GET
router.post("/group/:groupId", protect, createGroupEvent); // Group-specific POST

export default router;
