import User from "../models/User.js";

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    const host = `${req.protocol}://${req.get("host")}`;
    const profileImageUrl = user.profileImage ? `${host}${user.profileImage}` : null;
    const resumeUrl = user.resume ? `${host}${user.resume}` : null;

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      education: user.education,
      experience: user.experience,
      skills: user.skills,
      profileImage: profileImageUrl,
      resume: resumeUrl,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check for duplicate email
    if (req.body.email && req.body.email !== user.email) {
      const existingUser = await User.findOne({ email: req.body.email });
      if (existingUser) {
        return res.status(400).json({ message: "Email already in use" });
      }
      user.email = req.body.email;
    }

    // Update text fields
    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;
    user.education = req.body.education || user.education;
    user.experience = req.body.experience || user.experience;

    // Skills
    if (req.body.skills) {
      user.skills = typeof req.body.skills === "string"
        ? req.body.skills.split(",").map((s) => s.trim())
        : req.body.skills;
    }

    // File uploads
    const host = `${req.protocol}://${req.get("host")}`;
    if (req.files?.profileImage?.[0]) {
      user.profileImage = `/uploads/${req.files.profileImage[0].filename}`;
    }
    if (req.files?.resume?.[0]) {
      user.resume = `/uploads/${req.files.resume[0].filename}`;
    }

    await user.save();

    res.json({
      message: "Profile updated",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        education: user.education,
        experience: user.experience,
        skills: user.skills,
        profileImage: user.profileImage ? `${host}${user.profileImage}` : null,
        resume: user.resume ? `${host}${user.resume}` : null,
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getUserProfileById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select(
      "-password -email"
    );
    if (!user) return res.status(404).json({ message: "User not found" });

    const host = `${req.protocol}://${req.get("host")}`;
    const profileImageUrl = user.profileImage ? `${host}${user.profileImage}` : null;

    res.json({
      _id: user._id,
      name: user.name || "Unnamed User",
      profileImage: profileImageUrl,
      education: user.education || "",
      experience: user.experience || "",
      skills: user.skills || [],
      groups: user.groups || [],
      createdAt: user.createdAt || null, // ✅ Make sure this is included
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
