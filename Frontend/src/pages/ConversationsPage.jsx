import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

export default function ConversationsPage() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_REACT_APP_API_URL}/conversations`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const valid = res.data.filter((conv) => {
          const other = conv.participants?.find((p) => p._id !== user._id);
          const isValid = other && other.name && other.email;
          if (!isValid) {
            console.warn("Skipping invalid conversation:", conv);
          }
          return isValid;
        });

        setConversations(valid);
      } catch (err) {
        console.error("Failed to fetch conversations", err);
        if (err.response?.status === 401) {
          logout();
          navigate("/login", { replace: true });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [logout, navigate, user._id]);

  const handleDelete = async (participantId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_REACT_APP_API_URL}/conversations/${participantId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setConversations((prev) =>
        prev.filter(
          (c) =>
            c.participants.find((p) => p._id !== user._id)?._id !==
            participantId
        )
      );
    } catch (err) {
      console.error("Failed to delete conversation", err);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500">Loading conversations...</div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        No active conversations yet.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Your Conversations</h2>
      <div className="space-y-4">
        {conversations.map((conv) => {
          const otherUser = conv.participants.find((p) => p._id !== user._id);
          return (
            <div
              key={conv._id}
              className="flex justify-between items-center bg-white shadow border border-yellow-100 p-4 rounded-xl"
            >
              <div
                onClick={() => navigate(`/chat/${otherUser._id}`)}
                className="cursor-pointer"
              >
                <p className="font-medium text-gray-800">{otherUser.name}</p>
                <p className="text-sm text-gray-500">{otherUser.email}</p>
              </div>
              <button
                onClick={() => handleDelete(otherUser._id)}
                className="text-red-500 text-sm hover:underline"
              >
                Delete
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
