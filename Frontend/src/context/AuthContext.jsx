import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const API = import.meta.env.VITE_REACT_APP_API_URL;

  // Load or refresh the current user
  const refreshUser = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(`${API}/profile`);
      const updatedUser = { ...res.data, token };

      // Add a version param to profileImage to bust cache
      if (updatedUser.profileImage) {
        updatedUser.profileImage = `${updatedUser.profileImage}?v=${Date.now()}`;
      }

      setUser(updatedUser); // <- force new object reference
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

  const login = async (token) => {
    localStorage.setItem("token", token);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    await refreshUser();
  };

  const logout = () => {
    delete axios.defaults.headers.common["Authorization"];
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
