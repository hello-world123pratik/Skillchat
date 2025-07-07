import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

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
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">My Groups</h1>
          <p className="text-gray-600 mt-2">
            Here are all the groups you've joined.
          </p>
        </header>

        <ul className="space-y-5">
          {groups.map((group) => {
            const memberCount = group.members?.length || 0;

            return (
              <li
                key={group._id}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <Link
                      to={`/groups/${group._id}`}
                      className="text-lg font-semibold text-indigo-600 hover:underline"
                    >
                      {group.name}
                    </Link>
                    <p className="text-sm text-gray-500 mt-1">
                      {memberCount} member{memberCount !== 1 ? "s" : ""}
                    </p>
                  </div>

                  <div className="flex gap-3 flex-wrap">
                    <Link
                      to={`/groups/${group._id}/calendar`}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition"
                    >
                      Open Calendar
                    </Link>
                    <Link
                      to={`/groups/${group._id}`}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                    >
                      Open Chat
                    </Link>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
