// src/context/FavoritesContext.jsx
import { createContext, useContext, useEffect, useState } from "react";

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadFavorites = async () => {
    const token = localStorage.getItem("token");
    console.log("🔍 Loading favorites - Token exists:", !!token); // 👈 DEBUG
    
    if (!token) {
      console.log("❌ No token found - clearing favorites");
      setFavorites([]);
      setLoading(false);
      return;
    }

    try {
      console.log("📡 Fetching favorites from /favorites/my...");
      const res = await fetch("http://localhost:5000/favorites/my", {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log("📊 Response status:", res.status); // 👈 DEBUG
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(`HTTP ${res.status}: ${errorData.message || 'Unknown error'}`);
      }

      const data = await res.json();
      console.log("✅ Successfully loaded", data.length, "favorites"); // 👈 DEBUG
      setFavorites(data);
    } catch (err) {
      console.error("❌ Error loading favorites:", err);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (preset) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("❌ Cannot toggle favorite - no token");
      return;
    }

    try {
      console.log("⭐ Toggling favorite for preset:", preset._id || preset.id);
      const res = await fetch("http://localhost:5000/favorites/toggle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ presetId: preset._id || preset.id })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(`HTTP ${res.status}: ${errorData.message || 'Toggle failed'}`);
      }

      console.log("✅ Favorite toggled successfully - reloading favorites");
      await loadFavorites();
    } catch (err) {
      console.error("❌ Error toggling favorite:", err);
    }
  };

  // 🔄 Reload favorites when user logs in
  useEffect(() => {
    const handleLogin = () => {
      console.log("👤 User logged in - reloading favorites");
      setLoading(true);
      loadFavorites();
    };
    window.addEventListener("user-login", handleLogin);
    return () => window.removeEventListener("user-login", handleLogin);
  }, []);

  // 🧹 Clear favorites when user logs out
  useEffect(() => {
    const handleLogout = () => {
      console.log("🚪 User logged out - clearing favorites");
      setFavorites([]);
      setLoading(true);
    };
    window.addEventListener("user-logout", handleLogout);
    return () => window.removeEventListener("user-logout", handleLogout);
  }, []);

  // Initial load
  useEffect(() => {
    console.log("🚀 Initializing FavoritesContext");
    loadFavorites();
  }, []);

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, loading }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error("useFavorites must be used within FavoritesProvider");
  return context;
}