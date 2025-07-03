import { useEffect, useState, useRef, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import GroupInfoSidebar from "../components/GroupInfoSidebar";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";


export default function GroupChatPage() {
  const { groupId } = useParams();
  const { user } = useContext(AuthContext);
  const currentUserId = user?._id;

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);
  const messagesEndRef = useRef();

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:5000/api/messages/${groupId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const fetchedMessages = Array.isArray(res.data) ? res.data : [];
      setMessages(fetchedMessages);
      scrollToBottom();
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/api/messages",
        {
          groupId,
          content: input,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setInput("");
      fetchMessages();
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(`http://localhost:5000/api/messages/${messageId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
      scrollToBottom();
    } catch (err) {
      console.error("Failed to delete message:", err);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [groupId]);

  return (
    <div className="flex h-screen">
      <div className="flex-1 flex flex-col">
        <header className="p-4 bg-blue-600 text-white flex justify-between items-center">
          <h1 className="text-lg font-bold">Group Chat</h1>
          <div className="flex items-center gap-4">
            <button
               onClick={() => setShowSidebar(!showSidebar)}
               className="text-sm underline"
            >
              {showSidebar ? "Hide Info" : "Show Info"}
           </button>
           <Link
               to={`/groups/${groupId}/calendar`}
               className="text-sm bg-green-400 px-3 py-1 rounded hover:bg-green-500"
            >
               View Calendar
            </Link>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-100">
          {Array.isArray(messages) && messages.length === 0 && (
            <p className="text-gray-500 text-sm">No messages yet.</p>
          )}
          {Array.isArray(messages) &&
            messages.map((msg) => (
              <div
                key={msg._id}
                className="p-2 rounded bg-white shadow flex justify-between items-center"
              >
                <p className="text-sm text-gray-800">
                  <strong>{msg.sender?.name || "Unknown"}:</strong> {msg.content}
                </p>
                {msg.sender?._id === currentUserId && (
                  <button
                    onClick={() => handleDeleteMessage(msg._id)}
                    className="ml-4 text-xs text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={sendMessage} className="p-4 bg-white border-t flex gap-2">
          <input
            className="flex-1 border rounded px-3 py-2"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            Send
          </button>
        </form>
      </div>

      {showSidebar && (
        <GroupInfoSidebar groupId={groupId} currentUserId={currentUserId} />
      )}
    </div>
  );
}
