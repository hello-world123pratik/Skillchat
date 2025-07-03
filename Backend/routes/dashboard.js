import express from "express";
import { protect as auth } from "../middleware/authMiddleware.js";
import Group from "../models/groupModel.js";
import Event from "../models/EventModel.js";
import Message from "../models/MessageModel.js";

const router = express.Router();
router.use(auth);

// GET /api/groups/my
router.get("/groups/my", async (req, res) => {
  const groups = await Group.find({ members: req.user._id });
  res.json(groups);
});

// GET /api/events/upcoming
router.get("/events/upcoming", async (req, res) => {
  const now = new Date();
  const ev = await Event.findOne({ attendees: req.user._id, date: { $gte: now } }).sort("date");
  res.json(ev);
});

// GET /api/messages/unread-count
router.get("/messages/unread-count", async (req, res) => {
  const count = await Message.countDocuments({ to: req.user._id, read: false });
  res.json({ count });
});

// GET /api/messages/stats
router.get("/messages/stats", async (req, res) => {
  const msgs = await Message.aggregate([
    { $match: { to: req.user._id } },
    { $project: { day: { $dateToString: { format: "%a", date: "$createdAt" } } } },
    { $group: { _id: "$day", messages: { $sum: 1 } } },
  ]);
  res.json(msgs.map(m => ({ date: m._id, messages: m.messages })));
});

export default router;
