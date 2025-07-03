import Message from "../models/MessageModel.js";

export const sendMessage = async (req, res) => {
  try {
    const { groupId, content } = req.body;

    if (!groupId || !content) {
      return res.status(400).json({ error: "Group ID and content are required" });
    }

    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: "Unauthorized: No user attached" });
    }

    const message = await Message.create({
      sender: req.user._id,
      group: groupId,
      content,
    });

    const populatedMessage = await message.populate("sender", "name email");
    res.status(201).json(populatedMessage);
  } catch (err) {
    console.error(" sendMessage error:", err);
    res.status(500).json({ error: "Failed to send message" });
  }
};

export const getGroupMessages = async (req, res) => {
  try {
    const messages = await Message.find({ group: req.params.groupId })
      .populate("sender", "name email")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    console.error(" getGroupMessages error:", err);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};

// In messageController.js
export const getConversations = async (req, res) => {
  try {
    const userId = req.user._id;

    const conversations = await Message.aggregate([
      {
        $match: {
          sender: userId
        }
      },
      {
        $group: {
          _id: "$group",
          lastMessage: { $last: "$$ROOT" }
        }
      },
      {
        $lookup: {
          from: "groups",  // <-- Make sure your Group model is named 'Group'
          localField: "_id",
          foreignField: "_id",
          as: "group"
        }
      },
      { $unwind: "$group" },
      {
        $project: {
          group: { _id: 1, name: 1 },
          lastMessage: {
            content: 1,
            createdAt: 1
          }
        }
      }
    ]);

    res.json(conversations);
  } catch (err) {
    console.error("🔥 getConversations error:", err);
    res.status(500).json({ error: "Failed to fetch conversations" });
  }
};

// DELETE /api/messages/:id
export const deleteMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    // Optional: Only allow the sender to delete their message
    if (message.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "You can only delete your own messages" });
    }

    await message.deleteOne();
    res.json({ message: "Message deleted successfully" });
  } catch (err) {
    console.error("deleteMessage error:", err);
    res.status(500).json({ error: "Failed to delete message" });
  }
};

// Get all messages between logged-in user and another user
export const getDirectMessages = async (req, res) => {
  const userId = req.user._id;
  const otherUserId = req.params.userId;

  try {
    const messages = await Message.find({
      $or: [
        { sender: userId, recipient: otherUserId },
        { sender: otherUserId, recipient: userId }
      ]
    })
      .sort({ createdAt: 1 })
      .populate("sender", "name")
      .populate("recipient", "name");

    res.json(messages);
  } catch (err) {
    console.error("getDirectMessages error:", err);
    res.status(500).json({ error: "Failed to fetch direct messages" });
  }
};

// Send a direct (private) message
export const sendDirectMessage = async (req, res) => {
  const { recipientId, content } = req.body;

  if (!recipientId || !content) {
    return res.status(400).json({ error: "Recipient ID and content are required" });
  }

  try {
    const message = await Message.create({
      sender: req.user._id,
      recipient: recipientId,
      content
    });

    const populatedMessage = await message.populate("sender", "name email");
    res.status(201).json(populatedMessage);
  } catch (err) {
    console.error("sendDirectMessage error:", err);
    res.status(500).json({ error: "Failed to send direct message" });
  }
};


