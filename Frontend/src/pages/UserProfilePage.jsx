import React, { useState, useEffect, useContext } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

export default function UserProfilePage() {
  const { user, refreshUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const API = import.meta.env.VITE_REACT_APP_API_URL;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${API}/profile`);
        const data = res.data;
        setFormData({ name: data.name, email: data.email, phone: data.phone || "" });
        setSkills(data.skills || []);
        if (data.profileImage) setPreview(data.profileImage);
      } catch {
        setMessage({ type: "error", text: "Failed to load profile." });
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchProfile();
    else setLoading(false);
  }, [user]);

  if (!user) return <Navigate to="/login" replace />;
  if (loading) return <div className="p-6 text-center text-gray-600">Loading profile...</div>;

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setProfileImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const data = new FormData();
    Object.entries(formData).forEach(([k, v]) => data.append(k, v));

    // Deduplicate and send skills as array
    const uniqueSkills = [...new Set(skills.map((s) => s.trim()))];
    uniqueSkills.forEach((skill) => data.append("skills[]", skill));

    if (profileImage) data.append("profileImage", profileImage);

    try {
      const res = await axios.put(`${API}/profile`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setFormData((prev) => ({ ...prev, ...res.data.user }));
      setSkills(res.data.user.skills || []);
      setMessage({ type: "success", text: "Profile updated!" });
      await refreshUser(); 
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Profile update failed.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-4rem)] bg-yellow-50">
      {/* Sidebar */}
      <aside className="md:w-1/3 bg-white shadow-lg p-6 flex flex-col items-center border-r border-yellow-200">
        <div className="w-28 h-28 rounded-full overflow-hidden mb-4 ring-2 ring-yellow-400">
          {preview ? (
            <img src={preview} alt="avatar" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500 text-sm">
              No Image
            </div>
          )}
        </div>
        <label className="text-sm text-blue-600 cursor-pointer hover:underline">
          Change Photo
          <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
        </label>
        <h2 className="mt-4 text-xl font-semibold text-gray-800">{formData.name}</h2>
        <p className="text-gray-500">{formData.email}</p>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8 bg-white overflow-y-auto">
        <h3 className="text-3xl font-bold text-gray-800 mb-6">Profile Information</h3>
        {message && (
          <div
            className={`mb-6 p-4 text-sm rounded-lg border ${
              message.type === "success"
                ? "bg-green-50 text-green-700 border-green-200"
                : "bg-red-50 text-red-700 border-red-200"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
              className="p-3 border rounded-lg bg-white shadow-sm focus:ring-yellow-400 focus:border-yellow-400"
              required
            />
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="p-3 border rounded-lg bg-white shadow-sm focus:ring-yellow-400 focus:border-yellow-400"
              required
            />
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone"
              className="p-3 border rounded-lg bg-white shadow-sm focus:ring-yellow-400 focus:border-yellow-400 md:col-span-2"
            />
          </div>

          <div>
            <label className="block font-medium mb-2 text-gray-700">Skills</label>
            <div className="flex items-center gap-2 mb-3">
              <input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add skill and press Enter or Comma"
                className="flex-1 p-3 border rounded-lg bg-white shadow-sm focus:ring-yellow-400 focus:border-yellow-400"
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === ",") {
                    e.preventDefault();
                    const newSkills = newSkill
                      .split(",")
                      .map((s) => s.trim())
                      .filter((s) => s && !skills.includes(s));
                    if (newSkills.length) {
                      setSkills([...skills, ...newSkills]);
                    }
                    setNewSkill("");
                  }
                }}
              />
            </div>

            <div className="flex flex-wrap gap-3">
              {skills.map((skill, i) => (
                <span
                  key={i}
                  className="bg-yellow-100 px-3 py-1.5 rounded-full text-yellow-800 text-sm flex items-center shadow-sm"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => setSkills(skills.filter((s) => s !== skill))}
                    className="ml-2 text-red-500 hover:text-red-600"
                    title="Remove skill"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Update Profile"}
          </button>
        </form>
      </main>
    </div>
  );
}

