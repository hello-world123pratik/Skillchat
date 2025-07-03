import Group from "../models/groupModel.js";
import User from "../models/User.js";

//  Get all groups the logged-in user is a member of
export const getMyGroups = async (req, res) => {
  try {
    const userId = req.user._id;
    const groups = await Group.find({ members: userId }).populate("members", "name _id");
    res.json(groups);
  } catch (err) {
    console.error("Error fetching user's groups:", err.message);
    res.status(500).json({ message: "Server error fetching groups" });
  }
};

// Get all groups (admin or browse mode)
export const getAllGroups = async (req, res) => {
  try {
    const groups = await Group.find().populate("members", "name _id");
    res.json(groups);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch groups" });
  }
};

//  Create a new group
export const createGroup = async (req, res) => {
  const { name, description } = req.body;

  try {
    const group = new Group({
      name,
      description,
      createdBy: req.user._id,
      members: [req.user._id],
    });

    const savedGroup = await group.save();

    const populatedGroup = await Group.findById(savedGroup._id).populate("members", "name _id");

    res.status(201).json(populatedGroup);
  } catch (err) {
    res.status(500).json({ message: "Failed to create group" });
  }
};


//  Join a group
export const joinGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ message: "Group not found" });

    if (!group.members.includes(req.user._id)) {
      group.members.push(req.user._id);
      await group.save();
    }

    res.json({ message: "Joined group", group });
  } catch (err) {
    res.status(500).json({ message: "Failed to join group" });
  }
};

//  Detailed group view with member and creator info
export const getGroupDetails = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate("members", "name email _id")
      .populate("createdBy", "name");

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    res.json(group);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving group details" });
  }
};

export const leaveGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ message: "Group not found" });

    group.members = group.members.filter(
      memberId => memberId.toString() !== req.user._id.toString()
    );

    await group.save();
    res.json({ message: "Left group successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to leave group" });
  }
};

export const removeGroupMember = async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId);

    if (!group) return res.status(404).json({ message: "Group not found" });

    // Only creator can remove members
    if (group.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    group.members = group.members.filter(
      id => id.toString() !== req.params.memberId
    );

    await group.save();
    res.json({ message: "Member removed successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error removing member" });
  }
};

export const updateGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);

    if (!group) return res.status(404).json({ message: "Group not found" });

    if (group.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    group.name = req.body.name || group.name;
    group.description = req.body.description || group.description;

    await group.save();
    res.json({ message: "Group updated", group });
  } catch (err) {
    res.status(500).json({ message: "Failed to update group" });
  }
};

