import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function MessagesPage() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          `${import.meta.env.VITE_REACT_APP_API_URL}/messages/conversations`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = Array.isArray(res.data) ? res.data : [];
        setConversations(data);
      } catch (error) {
        console.error("Error fetching conversations:", error);
        setConversations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  if (loading) return <div className="p-6">Loading conversations...</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Private Messages</h1>
      {conversations.length === 0 ? (
        <p className="text-gray-500">No conversations yet.</p>
      ) : (
        <ul className="space-y-4">
          {conversations.map((conv) => (
            <li
              key={conv.user?._id}
              className="bg-white shadow rounded p-4 flex justify-between items-center"
            >
              <div>
                <Link
                  to={`/messages/${conv.user?._id}`}
                  className="text-lg text-blue-600 hover:underline"
                >
                  {conv.user?.name || "Unknown User"}
                </Link>
                <p className="text-sm text-gray-600 mt-1">
                  {conv.lastMessage?.content || "No message content"}
                </p>
              </div>
              <span className="text-sm text-gray-500">
                {conv.lastMessage?.createdAt
                  ? new Date(conv.lastMessage.createdAt).toLocaleDateString()
                  : ""}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
