import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);
  const API = import.meta.env.VITE_REACT_APP_API_URL; // e.g. https://skillchat-backend.onrender.com/api

  // Load or refresh the current user
  const refreshUser = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      // Attach to every request
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(`${API}/profile`);
      setUser({ ...res.data, token });
    } catch (err) {
      console.error("Failed to refresh user:", err);
      delete axios.defaults.headers.common["Authorization"];
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  // After successful login
  const login = async (token) => {
    localStorage.setItem("token", token);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    await refreshUser();
  };

  // Clear everything
  const logout = () => {
    delete axios.defaults.headers.common["Authorization"];
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
