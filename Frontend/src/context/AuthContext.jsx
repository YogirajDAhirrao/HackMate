// src/context/AuthContext.js
import { createContext, useContext, useEffect, useState } from "react";
import { getProfile } from "../api/user";
const development = import.meta.env.DEV || import.meta.env.DEVELOPMENT;
const BASE_URL = development
  ? "http://localhost:5000"
  : import.meta.env.VITE_API_URL;

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // null means not logged in
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await getProfile(); // fetch /auth/profile
        setUser(res.user); // ✅ Only store the user object
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const logout = async () => {
    try {
      // Call the backend logout endpoint to clear the HTTP-only cookie
      const response = await fetch(`${BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include", // Include cookies in the request
      });

      if (!response.ok) throw new Error("Logout failed");

      setUser(null); // Clear user state
    } catch (err) {
      console.error("Logout error:", err);
      setUser(null); // Clear state even if API call fails
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
