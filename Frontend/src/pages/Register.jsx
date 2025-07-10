import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import React from "react";

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_REACT_APP_API_URL}/auth/register`,
        form
      );
      setMessage({ type: "success", text: res.data.message });
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "An unexpected error occurred.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white shadow-md rounded-2xl p-8 space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 text-center">Create Account</h2>
        {message && (
          <div
            className={`text-sm px-4 py-2 rounded-md text-center ${
              message.type === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message.text}
          </div>
        )}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              name="name"
              id="name"
              type="text"
              onChange={handleChange}
              value={form.name}
              required
              className="mt-1 block w-full rounded-lg border border-gray-300 p-2.5 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              name="email"
              id="email"
              type="email"
              onChange={handleChange}
              value={form.email}
              required
              className="mt-1 block w-full rounded-lg border border-gray-300 p-2.5 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              name="password"
              id="password"
              type="password"
              onChange={handleChange}
              value={form.password}
              required
              className="mt-1 block w-full rounded-lg border border-gray-300 p-2.5 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition duration-150 ease-in-out disabled:opacity-50"
          >
            {isSubmitting ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;