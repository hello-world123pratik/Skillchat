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
      alert("Group creation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg bg-white border border-yellow-200 shadow-xl rounded-3xl p-10 space-y-8">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <PlusCircle className="text-yellow-500" size={32} />
          <h1 className="text-3xl font-bold text-gray-800">
            Create a New Group
          </h1>
        </div>

        {/* Form */}
        <form onSubmit={handleCreateGroup} className="space-y-6">
          {/* Group Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Group Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Fitness Buddies"
              className="w-full px-4 py-3 text-base border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-yellow-500 focus:outline-none transition"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this group about?"
              rows={4}
              className="w-full px-4 py-3 text-base border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-yellow-500 focus:outline-none transition resize-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-xl font-semibold text-base transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating..." : "Create Group"}
          </button>
        </form>

        {/* Footer Info */}
        <p className="text-sm text-gray-400 text-center pt-2">
          You will be redirected after successful creation.
        </p>
      </div>
    </div>
  );
}
