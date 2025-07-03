import Event from "../models/EventModel.js";

// GET /api/events
export const getEvents = async (req, res) => {
  try {
    const events = await Event.find({ user: req.user._id });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch events" });
  }
};

// POST /api/events
export const createEvent = async (req, res) => {
  const { title, description, start, end } = req.body;
  try {
    const newEvent = new Event({
      title,
      description,
      start,
      end,
      user: req.user._id,
    });
    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (err) {
    res.status(500).json({ message: "Failed to create event" });
  }
};

// GET /api/events/:id
export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event || !event.user.equals(req.user._id)) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: "Failed to get event" });
  }
};

// PUT /api/events/:id
export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event || !event.user.equals(req.user._id)) {
      return res.status(404).json({ message: "Event not found" });
    }

    event.title = req.body.title || event.title;
    event.description = req.body.description || event.description;
    event.start = req.body.start || event.start;
    event.end = req.body.end || event.end;

    await event.save();
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: "Failed to update event" });
  }
};

// DELETE /api/events/:id
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event || !event.user.equals(req.user._id)) {
      return res.status(404).json({ message: "Event not found" });
    }

    await event.deleteOne();
    res.json({ message: "Event deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete event" });
  }
};

//  GET /api/events/group/:groupId
export const getEventsByGroup = async (req, res) => {
  try {
    const events = await Event.find({ groupId: req.params.groupId }).sort({ start: 1 });
    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch group events" });
  }
};

//  POST /api/events/group/:groupId
export const createGroupEvent = async (req, res) => {
  const { title, description, start, end } = req.body;
  try {
    const newEvent = new Event({
      title,
      description,
      start,
      end,
      user: req.user._id,
      groupId: req.params.groupId,
    });

    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create group event" });
  }
};
