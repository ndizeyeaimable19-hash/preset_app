// src/components/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import "../styles/Navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Theme State
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  // Apply theme to HTML root
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo" onClick={() => navigate("/")}>
        Preset<span>Store</span>
      </div>

      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/presets">Presets</Link>
        <Link to="/favorites">Favorites</Link>
        <Link to="/contact">Contact</Link>

        {/* Theme Toggle Button */}
        <button onClick={toggleTheme} className="theme-toggle" style={{ background: "transparent", fontSize: "1.2rem" }}>
          {theme === "dark" ? "☀️" : "🌙"}
        </button>

        {user ? (
          <>
            <Link to="/profile" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              <span className="navbar-avatar">
                {user.email?.slice(0, 1).toUpperCase()}
              </span>
              Profile
            </Link>
            {user.isAdmin && <Link to="/admin">Admin</Link>}
            <button className="navbar-logout" onClick={() => { logout(); navigate("/login"); }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}