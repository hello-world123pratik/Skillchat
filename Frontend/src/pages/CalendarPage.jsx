import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const { groupId } = useParams(); // assumes URL like /groups/:groupId/calendar

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${import.meta.env.VITE_REACT_APP_API_URL}/events/group/${groupId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = res.data;
        setEvents(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching group events:", err);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [groupId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !date) return alert("Title and Date are required");

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        `${import.meta.env.VITE_REACT_APP_API_URL}/events/group/${groupId}`,
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

      setEvents((prev) => [...prev, res.data]);
      setTitle("");
      setDescription("");
      setDate("");
    } catch (err) {
      console.error("Error creating event:", err);
      alert("Failed to create event");
    }
  };

  if (loading) {
    return <div className="p-6">Loading events...</div>;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Group Events</h1>

      {/* Create Event Form */}
      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <input
          type="text"
          placeholder="Event Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border rounded px-3 py-2"
          required
        />
        <textarea
          placeholder="Event Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
        <input
          type="datetime-local"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full border rounded px-3 py-2"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create Event
        </button>
      </form>

      {/* Display Events */}
      {events.length === 0 ? (
        <p className="text-gray-500">No events scheduled.</p>
      ) : (
        <ul className="space-y-4">
          {events.map((event) => (
            <li key={event._id || event.id} className="bg-white shadow rounded p-4">
              <h2 className="text-lg font-semibold">{event.title}</h2>
              <p className="text-sm text-gray-600">
                {event.start ? new Date(event.start).toLocaleString() : "No date provided"}
              </p>
              <p className="mt-2 text-gray-700">{event.description || "No description"}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
