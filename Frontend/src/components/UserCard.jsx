import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function UserCard({ user }) {
  const navigate = useNavigate();

  const handleStartChat = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        `${import.meta.env.VITE_REACT_APP_API_URL}/conversations`,
        { userId: user._id }, // you pass the user you want to start chat with
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
