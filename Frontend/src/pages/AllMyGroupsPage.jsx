import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Calendar, MessageCircle } from "lucide-react";

export default function AllMyGroupsPage() {
  const { user } = useContext(AuthContext);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMyGroups = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          `${import.meta.env.VITE_REACT_APP_API_URL}/groups/my`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setGroups(response.data || []);
      } catch (err) {
        console.error("Error fetching joined groups:", err);
        setError("Failed to load your groups.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyGroups();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 text-lg">
        Loading your groups...
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 text-lg">
        {error}
      </div>
    );

  if (groups.length === 0)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 text-lg">
        You haven't joined any groups yet.
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900">
            My Groups
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            Explore and access your joined groups below.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {groups.map((group) => {
            const memberCount = group.members?.length || 0;

            return (
              <div
                key={group._id}
                className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 p-6 flex flex-col justify-between"
              >
                <div>
                  <Link
                    to={`/groups/${group._id}`}
                    className="text-xl font-semibold text-indigo-600 hover:underline"
                  >
                    {group.name}
                  </Link>
                  <p className="text-sm text-gray-500 mt-1">
                    {memberCount} member{memberCount !== 1 ? "s" : ""}
                  </p>
                </div>

                <div className="flex gap-3 mt-6 flex-wrap">
                  <Link
                    to={`/groups/${group._id}/calendar`}
                    className="inline-flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-600 transition"
                  >
                    <Calendar size={16} />
                    Calendar
                  </Link>

                  <Link
                    to={`/groups/${group._id}`}
                    className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                  >
                    <MessageCircle size={16} />
                    Chat
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
