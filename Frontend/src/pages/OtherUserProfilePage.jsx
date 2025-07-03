import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function OtherUserProfilePage() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get(`/api/users/${userId}`)
      .then(res => setUser(res.data))
      .catch(console.error);
  }, [userId]);

  if (!user) return <div className="p-6">Loading profile...</div>;

  // Format createdAt safely
  const joinDate = user.createdAt ? new Date(user.createdAt) : null;
  const formattedDate =
    joinDate && !isNaN(joinDate.getTime())
      ? joinDate.toLocaleDateString()
      : "Not Available";

  return (
    <div className="p-6 max-w-xl mx-auto bg-white shadow rounded">
      {user.profileImage && (
        <img
          src={user.profileImage}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover border mb-4"
        />
      )}
      <h1 className="text-2xl font-bold">{user.name || "Unnamed User"}</h1>
      <p className="text-sm text-gray-500 mt-1">Joined: {formattedDate}</p>

      {user.education && (
        <p className="text-gray-700 mt-3">
          <strong>Education:</strong> {user.education}
        </p>
      )}
      {user.experience && (
        <p className="text-gray-700">
          <strong>Experience:</strong> {user.experience}
        </p>
      )}
      {user.skills?.length > 0 && (
        <div className="mt-3">
          <strong className="text-gray-700">Skills:</strong>
          <ul className="list-disc list-inside text-gray-600">
            {user.skills.map((skill, idx) => (
              <li key={idx}>{skill}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
