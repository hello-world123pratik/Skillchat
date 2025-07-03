import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function PrivateMessagesPage() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          `${import.meta.env.VITE_REACT_APP_API_URL}/conversations`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setConversations(res.data);
      } catch (err) {
        console.error("Error fetching conversations:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  if (loading) return <div className="p-6">Loading conversations...</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Private Messages</h1>
        <Link
          to="/start-chat"
          className="text-blue-500 hover:underline text-sm"
        >
          + Start Chat
        </Link>
      </div>

      {conversations.length === 0 ? (
        <p className="text-gray-500">No private conversations found.</p>
      ) : (
        <ul className="space-y-4">
          {conversations.map((conv) => {
            const otherUser = conv.members.find((m) => m._id !== userId);
            return (
              <li key={conv._id} className="bg-white shadow rounded p-4">
                <Link
                  to={`/private-chat/${otherUser?._id}`}
                  className="text-blue-600 text-lg hover:underline"
                >
                  {otherUser?.name || "Unnamed User"}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
