import Conversation from "../models/ConversationModel.js";
import User from "../models/User.js";

export const createOrGetConversation = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const otherUserId = req.body.userId;

    if (!otherUserId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    if (currentUserId.toString() === otherUserId.toString()) {
      return res.status(400).json({ error: "Cannot create conversation with yourself" });
    }

    //  Check if the other user exists
    const existingUser = await User.findById(otherUserId);
    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }

    //  Check for existing 1-1 conversation
    let conversation = await Conversation.findOne({
      isGroup: false,
      members: { $all: [currentUserId, otherUserId], $size: 2 },
    });

    //  If not found, create a new one
    if (!conversation) {
      conversation = await Conversation.create({
        members: [currentUserId, otherUserId],
        isGroup: false,
      });
    }

    await conversation.populate("members", "name email profileImage");

    res.status(200).json(conversation);
  } catch (err) {
    console.error("createOrGetConversation error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

export const getUserConversations = async (req, res) => {
  try {
    const currentUserId = req.user._id;

    const conversations = await Conversation.find({
      members: currentUserId,
      isGroup: false,
    })
      .populate("members", "name email profileImage")
      .sort({ updatedAt: -1 });

    //  Filter out conversations with deleted users or invalid member counts
    const validConversations = conversations.filter((conv) => {
      if (!conv.members || conv.members.length !== 2) return false;
      if (conv.members.some((m) => !m)) return false;

      // Must include at least one member that is not the current user
      return conv.members.some((m) => m._id.toString() !== currentUserId.toString());
    });

    res.status(200).json(validConversations);
  } catch (err) {
    console.error("getUserConversations error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteConversation = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Conversation.findOneAndDelete({
      _id: id,
      participants: req.user._id,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Conversation not found or unauthorized" });
    }

    res.json({ message: "Conversation deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};