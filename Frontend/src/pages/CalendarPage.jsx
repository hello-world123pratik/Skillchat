import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });

  const { groupId } = useParams();

  const API_URL = `${import.meta.env.VITE_REACT_APP_API_URL}/events/group/${groupId}`;

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(API_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        let fetchedEvents = Array.isArray(res.data) ? res.data : [];

        // Filter out expired events and delete them from backend
        const now = new Date();
        const upcomingEvents = [];

        for (const event of fetchedEvents) {
          const eventDate = new Date(event.end || event.start);
          if (eventDate > now) {
            upcomingEvents.push(event);
          } else {
            try {
              await axios.delete(`${import.meta.env.VITE_REACT_APP_API_URL}/events/${event._id}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
            } catch (err) {
              console.warn("Failed to delete expired event:", event.title);
            }
          }
        }

        // Sort latest events first
        upcomingEvents.sort(
          (a, b) => new Date(b.start).getTime() - new Date(a.start).getTime()
        );

        setEvents(upcomingEvents);
      } catch (err) {
        console.error("Error fetching events:", err);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [groupId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !date) {
      setMessage({ type: "error", text: "Title and Date are required" });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        API_URL,
        {
          title,
          description,
          start: date,
          end: date,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setEvents((prev) => [res.data, ...prev]);
      setTitle("");
      setDescription("");
      setDate("");
      setMessage({ type: "success", text: "Event created successfully" });
    } catch (err) {
      console.error("Error creating event:", err);
      setMessage({ type: "error", text: "Failed to create event" });
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">📅 Group Calendar</h1>

      {/* Feedback Message */}
      {message.text && (
        <div
          className={`mb-4 p-3 rounded text-sm ${
            message.type === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Create Event Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-blue-50 p-6 rounded-lg shadow mb-8"
      >
        <div>
          <label className="block font-semibold text-blue-800 mb-1">Event Title *</label>
          <input
            type="text"
            placeholder="e.g. Team Meeting"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-blue-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <div>
          <label className="block font-semibold text-blue-800 mb-1">Description</label>
          <textarea
            placeholder="Optional description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-blue-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block font-semibold text-blue-800 mb-1">Date & Time *</label>
          <input
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border border-blue-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          ➕ Create Event
        </button>
      </form>

      {/* Events List */}
      {loading ? (
        <div className="text-gray-500 text-center">Loading events...</div>
      ) : events.length === 0 ? (
        <p className="text-gray-500 text-center">No upcoming events.</p>
      ) : (
        <ul className="space-y-4">
          {events.map((event) => (
            <li key={event._id || event.id} className="bg-white border border-blue-100 shadow rounded p-4 transition hover:shadow-md">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold text-blue-800">{event.title}</h2>
                  <p className="text-sm text-gray-600">
                    🕒 {new Date(event.start).toLocaleString()}
                  </p>
                </div>
              </div>
              <p className="mt-2 text-gray-700">{event.description || "No description provided."}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
