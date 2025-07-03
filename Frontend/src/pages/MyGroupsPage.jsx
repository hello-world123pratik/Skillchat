import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function MyGroupsPage() {
  const [groups, setGroups] = useState([]);
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/groups/my`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const fetchedGroups = Array.isArray(res.data)
          ? res.data
          : res.data.groups || [];

        setGroups(fetchedGroups);
        setFilteredGroups(fetchedGroups);
      } catch (err) {
        console.error("Error fetching groups:", err);
        setError("Failed to load groups.");
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  useEffect(() => {
    const filtered = groups.filter((group) =>
      group.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredGroups(filtered);
  }, [searchTerm, groups]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 text-lg">
        Loading groups...
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 text-lg">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">My Groups</h1>
          <p className="text-gray-600 mt-2">View and manage the groups you're part of.</p>
        </header>

        <input
          type="text"
          placeholder="Search groups..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-6 w-full px-4 py-3 text-sm border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        {filteredGroups.length === 0 ? (
          <div className="text-center text-gray-500 text-md mt-10">
            No groups found matching your search.
          </div>
        ) : (
          <ul className="space-y-5">
            {filteredGroups.map((group) => (
              <li key={group._id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <Link
                      to={`/groups/${group._id}`}
                      className="text-lg font-semibold text-indigo-600 hover:underline"
                    >
                      {group.name}
                    </Link>
                    <p className="text-sm text-gray-500 mt-1">
                      {group.members?.length || 0} member{group.members?.length !== 1 ? "s" : ""}
                    </p>
                  </div>

                  <Link
                    to={`/groups/${group._id}/calendar`}
                    className="inline-block bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition"
                  >
                    Open Calendar
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
