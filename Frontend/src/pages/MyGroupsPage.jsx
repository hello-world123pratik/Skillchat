import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function MyGroupsPage() {
  const [groups, setGroups] = useState([]);
  const [myGroupIds, setMyGroupIds] = useState([]);
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const token = localStorage.getItem("token");

        // Fetch all groups
        const allRes = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/groups`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const allGroups = Array.isArray(allRes.data)
          ? allRes.data
          : allRes.data.groups || [];

        // ✅ Exclude groups with zero members
        const nonEmptyGroups = allGroups.filter(group => group.members?.length > 0);

        setGroups(nonEmptyGroups);
        setFilteredGroups(nonEmptyGroups);

        // Fetch user's joined groups
        const myRes = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/groups/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const myIds = (myRes.data || []).map((g) => g._id);
        setMyGroupIds(myIds);
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

  const handleJoinGroup = async (groupId) => {
    const token = localStorage.getItem("token");

    try {
      await axios.post(
        `${import.meta.env.VITE_REACT_APP_API_URL}/groups/${groupId}/join`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // 1. Add to joined group IDs
      setMyGroupIds((prev) => [...prev, groupId]);

      // 2. Update member count locally
      setGroups((prevGroups) =>
        prevGroups.map((group) =>
          group._id === groupId
            ? {
                ...group,
                members: [...(group.members || []), {}], // Add dummy member to simulate count
              }
            : group
        )
      );

      // 3. Show success message
      alert("You joined the group!");
    } catch (err) {
      console.error("Failed to join group:", err);
      alert("Could not join group. Please try again.");
    }
  };

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
          <h1 className="text-3xl font-bold text-gray-900">All Groups</h1>
          <p className="text-gray-600 mt-2">
            Browse and join groups that match your interests.
          </p>
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
            {filteredGroups.map((group) => {
              const memberCount = group.members?.length || 0;
              const hasJoined = myGroupIds.includes(group._id);

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

                      {!hasJoined && (
                        <button
                          onClick={() => handleJoinGroup(group._id)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                        >
                          Join Group
                        </button>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
