// models/ConversationModel.js
import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    isGroup: {
      type: Boolean,
      default: false,
    },
    name: String, // Only used if it's a group
  },
  { timestamps: true }
);

export default mongoose.model("Conversation", conversationSchema);
