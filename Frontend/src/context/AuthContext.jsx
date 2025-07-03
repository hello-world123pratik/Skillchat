import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

function parseJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false); //  If no token, stop loading
      return;
    }

    try {
      const res = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser({ ...res.data, token });
    } catch (err) {
      console.error("Failed to refresh user:", err);
      setUser(null);
      localStorage.removeItem("token");
    } finally {
      setLoading(false); // Always stop loading at the end
    }
  };

  useEffect(() => {
    refreshUser(); // Fetch full profile on load (handles no-token inside)
  }, []);

  const login = async (token) => {
    localStorage.setItem("token", token);
    await refreshUser(); // Fetch user after login
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, refreshUser, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
