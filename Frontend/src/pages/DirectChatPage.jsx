import { useEffect, useState, useRef, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import MessageBubble from "../components/MessageBubble";
import { AuthContext } from "../context/AuthContext";

export default function DirectChatPage() {
  const { conversationId } = useParams(); // recipient userId
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  const { user, loading, logout } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [receiver, setReceiver] = useState(null);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [receiverNotFound, setReceiverNotFound] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login", { replace: true });
    }
  }, [loading, user, navigate]);

  // Fetch receiver info
  useEffect(() => {
    if (!conversationId) return;

    const fetchReceiver = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_REACT_APP_API_URL}/users/${conversationId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setReceiver(res.data);
        setReceiverNotFound(false);
      } catch (err) {
        if (err.response?.status === 404) {
          console.warn("Receiver not found.");
          setReceiver(null);
          setReceiverNotFound(true);
        } else {
          console.error("Failed to fetch receiver info:", err);
        }
      }
    };

    fetchReceiver();
  }, [conversationId]);

  // Fetch messages
  useEffect(() => {
    if (loading || !user || !receiver || receiverNotFound) return;

    const fetchMessages = async () => {
      setLoadingMessages(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_REACT_APP_API_URL}/messages/direct/${conversationId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setMessages(res.data || []);
      } catch (err) {
        console.error("Error fetching messages:", err);
        if (err.response?.status === 401) {
          logout();
          navigate("/login", { replace: true });
        }
      } finally {
        setLoadingMessages(false);
      }
    };

    fetchMessages();
  }, [conversationId, loading, user, receiver, receiverNotFound, logout, navigate]);

  // Scroll to bottom
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim() || !receiver?._id) return;

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_REACT_APP_API_URL}/messages/direct`,
        {
          recipientId: receiver._id,
          content: newMessage.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setMessages((prev) => [...prev, res.data]);
      setNewMessage("");
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  if (loading || !user) {
    return (
      <div className="p-6 text-center text-gray-500">
        Checking authentication...
      </div>
    );
  }

  if (receiverNotFound) {
    return (
      <div className="p-6 text-center text-red-500">
        The user you’re trying to chat with no longer exists.
        <br />
        <button
          onClick={() => navigate("/")}
          className="mt-4 underline text-blue-600"
        >
          Go back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto h-screen flex flex-col">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-3">
        {receiver?.profileImage && (
          <img
            src={receiver.profileImage}
            alt="Profile"
            className="w-8 h-8 rounded-full object-cover border"
          />
        )}
        Chat with {receiver?.name || "Unknown User"}
      </h2>

      <div className="flex-1 overflow-y-auto space-y-2 mb-4 pr-2">
        {loadingMessages ? (
          <p className="text-gray-500">Loading messages...</p>
        ) : messages.length === 0 ? (
          <p className="text-gray-500">No messages yet.</p>
        ) : (
          messages.map((msg) => (
            <MessageBubble
              key={msg._id}
              message={msg}
              isOwn={msg.sender._id === user._id}
            />
          ))
        )}
        <div ref={scrollRef} />
      </div>

      <div className="flex gap-2 mt-auto">
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSend();
            }
          }}
          className="flex-1 border rounded px-4 py-2"
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 text-white px-4 py-2 rounded"
          disabled={!receiver || !newMessage.trim()}
        >
          Send
        </button>
      </div>
    </div>
  );
}
