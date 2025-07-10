import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }, // for direct messages
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
    }, // for group messages

    // Make content optional (some messages may only have a file)
    content: {
      type: String,
    },

    // ✅ NEW: Add file support
    fileUrl: {
      type: String,
    },
    originalFileName: {
      type: String,
    },

    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt & updatedAt
  }
);

export default mongoose.model("Message", messageSchema);
