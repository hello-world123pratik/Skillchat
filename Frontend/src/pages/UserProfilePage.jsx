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
        setFormData({
          name: data.name,
          email: data.email,
          phone: data.phone || "",
        });
        setSkills(data.skills || []);
        if (data.profileImage) {
          // Fix SSL issue for localhost
          const url = data.profileImage.replace("https://localhost", "http://localhost");
          setPreview(url);
        }
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
    const uniqueSkills = [...new Set(skills.map((s) => s.trim()))];
    data.append("skills", uniqueSkills.join(","));
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
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-yellow-50 to-white">
      {/* Sidebar */}
      <aside className="md:w-1/3 bg-white shadow-lg border-r border-yellow-200 p-8 flex flex-col items-center text-center">
        <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-yellow-400 mb-4">
          {preview ? (
            <img src={preview} alt="avatar" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
              No Image
            </div>
          )}
        </div>

        <label className="text-sm text-blue-600 cursor-pointer hover:underline mb-2">
          Change Photo
          <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
        </label>

        <h2 className="mt-4 text-2xl font-semibold text-gray-800">{formData.name}</h2>
        <p className="text-gray-500">{formData.email}</p>
      </aside>

      {/* Main Content */}
      <main className="flex-1 px-6 sm:px-10 py-10 overflow-y-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Edit Profile</h1>

        {message && (
          <div
            className={`mb-6 p-4 rounded-md border text-sm font-medium transition ${
              message.type === "success"
                ? "bg-green-50 text-green-700 border-green-300"
                : "bg-red-50 text-red-700 border-red-300"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Full Name</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Email</label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-700 font-medium mb-1">Phone</label>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="(Optional)"
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-yellow-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Skills */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Skills</label>
            <input
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Type skill and press Enter or Comma"
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-yellow-400 focus:outline-none mb-3"
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === ",") {
                  e.preventDefault();
                  const newSkills = newSkill
                    .split(",")
                    .map((s) => s.trim())
                    .filter((s) => s && !skills.includes(s));
                  if (newSkills.length) setSkills([...skills, ...newSkills]);
                  setNewSkill("");
                }
              }}
            />

            <div className="flex flex-wrap gap-3">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-yellow-100 text-yellow-900 px-3 py-1.5 rounded-full text-sm flex items-center shadow-sm"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => setSkills(skills.filter((s) => s !== skill))}
                    className="ml-2 text-red-500 hover:text-red-600 font-bold"
                    title="Remove"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Saving..." : "Update Profile"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
