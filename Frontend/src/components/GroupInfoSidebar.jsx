import { useEffect, useState } from 'react';
import axios from 'axios';

const GroupInfoSidebar = ({ groupId }) => {
  const [group, setGroup] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token');

  const fetchGroup = async () => {
    if (!token) {
      setError('Authentication token not found.');
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5173/api/groups/${groupId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGroup(res.data);
      setFormData({ name: res.data.name, description: res.data.description });
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch group');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (groupId) fetchGroup();
  }, [groupId]);

  const handleEditToggle = () => setEditing(!editing);

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    try {
      await axios.put(
        `http://localhost:5173/api/groups/${groupId}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEditing(false);
      fetchGroup();
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    }
  };

  const handleRemoveMember = async (memberId) => {
    try {
      await axios.delete(
        `http://localhost:5173/api/groups/${groupId}/members/${memberId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchGroup(); // Refresh members list
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove member');
    }
  };

  if (!token) return <div className="text-red-500">Authentication required</div>;
  if (loading) return <div>Loading group info...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!group) return null;

  return (
    <aside className="p-4 border-l border-gray-300 w-80 bg-gray-50 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Group Info</h2>
        <button
          className="text-blue-600 hover:underline"
          onClick={handleEditToggle}
        >
          {editing ? 'Cancel' : 'Edit'}
        </button>
      </div>

      {editing ? (
        <div className="space-y-2">
          <input
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            placeholder="Group Name"
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            placeholder="Description"
          />
          <button
            onClick={handleSave}
            className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
          >
            Save
          </button>
        </div>
      ) : (
        <div>
          <h3 className="text-lg font-medium">{group.name}</h3>
          <p className="text-gray-700">{group.description}</p>
        </div>
      )}

      <div>
        <h4 className="font-semibold mt-4 mb-2">Members</h4>
        <ul className="space-y-2">
          {group.members && group.members.length > 0 ? (
            group.members.map((member) => (
              <li
                key={member._id}
                className="flex justify-between items-center p-2 bg-white rounded shadow-sm"
              >
                <span>{member.username || member.email}</span>
                <button
                  onClick={() => handleRemoveMember(member._id)}
                  className="text-red-500 hover:underline text-sm"
                >
                  Remove
                </button>
              </li>
            ))
          ) : (
            <p>No members found.</p>
          )}
        </ul>
      </div>
    </aside>
  );
};

export default GroupInfoSidebar;
