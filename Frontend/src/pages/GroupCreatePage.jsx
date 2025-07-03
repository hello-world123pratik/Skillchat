import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { PlusCircle } from "lucide-react";

export default function GroupCreatePage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${import.meta.env.VITE_REACT_APP_API_URL}/groups`,
        { name, description },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Group created:", res.data);
      navigate("/groups");
    } catch (err) {
      console.error("Error creating group:", err.response?.data || err.message);
      alert("Group creation failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-yellow-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white border border-yellow-200 shadow-2xl rounded-3xl p-8 space-y-6">
        <div className="flex items-center space-x-3">
          <PlusCircle className="text-yellow-500" size={28} />
          <h1 className="text-2xl font-extrabold text-gray-800 tracking-tight">Create New Group</h1>
        </div>

        <form onSubmit={handleCreateGroup} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Group Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter group name"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-yellow-500 focus:border-yellow-500 transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description (optional)"
              rows={4}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-yellow-500 focus:border-yellow-500 transition resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-lg font-semibold transition-all disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Group"}
          </button>
        </form>
      </div>
    </div>
  );
}
