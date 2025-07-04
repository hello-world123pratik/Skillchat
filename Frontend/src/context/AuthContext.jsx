import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);
  const API = import.meta.env.VITE_REACT_APP_API_URL; // e.g. https://skillchat-backend.onrender.com/api

  // Refresh or load the current user profile
  const refreshUser = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      // Attach token for all subsequent requests
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      // No token: clear header, stop loading
      delete axios.defaults.headers.common["Authorization"];
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(`${API}/profile`);
      // Save user data along with token
      setUser({ ...res.data, token });
    } catch (err) {
      console.error("Failed to refresh user:", err);
      // Token invalid/expired: clear everything
      delete axios.defaults.headers.common["Authorization"];
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // On mount, attempt to load user
  useEffect(() => {
    refreshUser();
  }, []);

  // Call this after a successful login
  const login = async (token) => {
    localStorage.setItem("token", token);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    await refreshUser();
  };

  // Call to log the user out
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

  
