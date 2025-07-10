import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function UserCard({ user }) {
  const navigate = useNavigate();

  const handleStartChat = async () => {
    if (!user || !user._id) {
      console.warn("Invalid user object:", user);
      alert("Cannot start chat: user ID is missing or invalid.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        `${import.meta.env.VITE_REACT_APP_API_URL}/conversations`,
        { userId: user._id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const conversationId = res.data._id;
      navigate(`/conversations/${conversationId}`);
    } catch (err) {
      console.error("Failed to start chat:", err);
      alert("Could not start a conversation. Please try again.");
    }
  };

  return (
    <div
      onClick={handleStartChat}
      className="border p-4 rounded cursor-pointer hover:bg-gray-100 transition"
    >
      <h3 className="text-lg font-semibold">{user.name}</h3>
      <p className="text-sm text-gray-600">{user.email}</p>
    </div>
  );
}
