import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    education: {
      type: String,
      trim: true,
    },
    experience: {
      type: String,
      trim: true,
    },
    skills: {
      type: [String],
      default: [],
    },
    profileImage: {
      type: String, // URL or path to image
    },
    resume: {
      type: String, // path or URL
    },

    // ✅ Skill Groups the user is part of
    groups: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group",
      },
    ],

    // ✅ Last seen (for chat app behavior)
    lastSeen: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // createdAt and updatedAt
  }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
