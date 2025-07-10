import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { CalendarPlus, UserPlus } from "lucide-react";

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

        const allRes = await axios.get(
          `${import.meta.env.VITE_REACT_APP_API_URL}/groups`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const allGroups = Array.isArray(allRes.data)
          ? allRes.data
          : allRes.data.groups || [];

        const nonEmptyGroups = allGroups.filter(
          (group) => group.members?.length > 0
        );

        setGroups(nonEmptyGroups);
        setFilteredGroups(nonEmptyGroups);

        const myRes = await axios.get(
          `${import.meta.env.VITE_REACT_APP_API_URL}/groups/my`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

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

      setMyGroupIds((prev) => [...prev, groupId]);

      setGroups((prevGroups) =>
        prevGroups.map((group) =>
          group._id === groupId
            ? {
                ...group,
                members: [...(group.members || []), {}],
              }
            : group
        )
      );

      alert("✅ Successfully joined the group!");
    } catch (err) {
      console.error("Failed to join group:", err);
      alert("⚠️ Could not join the group. Please try again.");
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
      <div className="max-w-5xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900">
            Explore Groups
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            Browse all public groups and join ones that interest you.
          </p>
        </header>

        <div className="mb-8">
          <input
            type="text"
            placeholder="🔍 Search groups by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-5 py-3 text-base border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {filteredGroups.length === 0 ? (
          <div className="text-center text-gray-500 text-md mt-12">
            No groups found matching your search.
          </div>
        ) : (
          <ul className="grid sm:grid-cols-2 gap-6">
            {filteredGroups.map((group) => {
              const memberCount = group.members?.length || 0;
              const hasJoined = myGroupIds.includes(group._id);

              return (
                <li
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
                      <CalendarPlus size={16} />
                      Calendar
                    </Link>

                    {!hasJoined && (
                      <button
                        onClick={() => handleJoinGroup(group._id)}
                        className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                      >
                        <UserPlus size={16} />
                        Join
                      </button>
                    )}
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
