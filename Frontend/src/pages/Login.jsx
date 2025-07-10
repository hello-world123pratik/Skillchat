import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm]             = useState({ email: "", password: "" });
  const [message, setMessage]       = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, user }             = useContext(AuthContext);
  const navigate                    = useNavigate();
  const API                          = import.meta.env.VITE_REACT_APP_API_URL;

  useEffect(() => {
    if (user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await axios.post(
        `${API}/auth/login`,
        form
      );
      await login(res.data.token);
      setMessage({ type: "success", text: res.data.message });
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Login failed. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8 space-y-6">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Sign in to your account
        </h2>

        {message && (
          <div
            className={`text-sm text-center px-4 py-2 rounded-md ${
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
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-lg border border-gray-300 p-2.5 shadow-sm focus:border-green-500 focus:ring-green-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-lg border border-gray-300 p-2.5 shadow-sm focus:border-green-500 focus:ring-green-500"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 rounded-lg transition duration-150 ease-in-out disabled:opacity-50"
          >
            {isSubmitting ? "Signing in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500">
          Don’t have an account?{" "}
          <a href="/register" className="text-green-600 hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
}