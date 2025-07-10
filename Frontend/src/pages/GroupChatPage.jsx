import { useEffect, useState, useRef, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import GroupInfoSidebar from "../components/GroupInfoSidebar";
import { AuthContext } from "../context/AuthContext";

const API_BASE_URL = "http://localhost:5000/api/messages";

export default function GroupChatPage() {
  const { groupId } = useParams();
  const { user } = useContext(AuthContext);
  const currentUserId = user?._id;

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [file, setFile] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE_URL}/${groupId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessages(Array.isArray(res.data) ? res.data : []);
      scrollToBottom();
    } catch (err) {
      console.error("Error fetching messages:", err.response?.data || err.message);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() && !file) return;

    const formData = new FormData();
    formData.append("groupId", groupId);
    if (input.trim()) formData.append("content", input.trim());
    if (file) formData.append("file", file);

    try {
      const token = localStorage.getItem("token");
      await axios.post(API_BASE_URL, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setInput("");
      setFile(null);
      fetchMessages();
    } catch (err) {
      console.error("Error sending message:", err.response?.data || err.message);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/${messageId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
    } catch (err) {
      console.error("Error deleting message:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [groupId]);

  const getFullFileUrl = (relativePath) => {
    if (!relativePath) return "";
    if (relativePath.startsWith("http")) return relativePath;
    return `http://localhost:5000${relativePath}`;
  };

  const renderMessageContent = (msg) => {
    if (msg.fileUrl) {
      const fileExt = msg.fileUrl.split(".").pop().toLowerCase();
      const fullFileUrl = getFullFileUrl(msg.fileUrl);

      if (["mp4", "webm", "ogg"].includes(fileExt)) {
        return (
          <video controls className="max-w-full rounded mt-2">
            <source src={fullFileUrl} type={`video/${fileExt}`} />
            Your browser does not support the video tag.
          </video>
        );
      } else {
        return (
          <a
            href={fullFileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 text-sm underline mt-2 block"
          >
            Download {msg.originalFileName || "File"}
          </a>
        );
      }
    }

    return <p className="text-sm">{msg.content}</p>;
  };

  return (
    <div className="flex h-screen">
      <div className="flex-1 flex flex-col">
        <header className="p-4 bg-yellow-400 text-gray-900 flex justify-between items-center shadow-sm">
          <h1 className="text-lg font-bold">Group Chat</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowSidebar((prev) => !prev)}
              className="text-sm underline hover:text-gray-800"
            >
              {showSidebar ? "Hide Info" : "Show Info"}
            </button>
            <Link
              to={`/groups/${groupId}/calendar`}
              className="text-sm bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700"
            >
              View Calendar
            </Link>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-yellow-50">
          {messages.length === 0 ? (
            <p className="text-gray-500 text-sm text-center">No messages yet.</p>
          ) : (
            messages.map((msg) => {
              const isCurrentUser = msg?.sender?._id === currentUserId;
              return (
                <div
                  key={msg._id}
                  className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs md:max-w-md p-3 rounded-lg shadow ${
                      isCurrentUser
                        ? "bg-yellow-300 text-gray-900 rounded-br-none"
                        : "bg-white text-gray-800 rounded-bl-none"
                    }`}
                  >
                    <p className="text-sm font-semibold mb-1">
                      {msg.sender?.name || "Unknown"}
                    </p>
                    {renderMessageContent(msg)}
                    {isCurrentUser && (
                      <button
                        onClick={() => handleDeleteMessage(msg._id)}
                        className="text-xs text-red-500 hover:underline mt-1"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message input with file support */}
        <form
          onSubmit={sendMessage}
          className="p-4 bg-white border-t flex flex-col gap-2 sm:flex-row sm:items-center"
        >
          <input
            type="text"
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
          />
          <input
            type="file"
            accept="video/*,application/pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
            onChange={(e) => {
              const selectedFile = e.target.files[0];
              if (selectedFile && selectedFile.size > 50 * 1024 * 1024) {
                alert("File is too large! Max allowed size is 50MB.");
                e.target.value = "";
                return;
              }
              setFile(selectedFile);
            }}
            className="text-sm"
          />
          <button
            type="submit"
            className="bg-yellow-500 text-white px-5 py-2 rounded-full hover:bg-yellow-600 transition"
          >
            Send
          </button>
        </form>
      </div>

      {showSidebar && (
        <div className="w-80 border-l border-yellow-300 bg-white shadow-lg">
          <GroupInfoSidebar groupId={groupId} currentUserId={currentUserId} />
        </div>
      )}
    </div>
  );
}
