// src/components/Navbar.jsx
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import "../styles/Navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // ✅ Added to detect current page

  // Check if we're on the profile page
  const isProfilePage = location.pathname === "/profile";

  // Theme State
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) return savedTheme;
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return "light";
    }
    return "dark";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    setTimeout(() => {
      document.documentElement.setAttribute("data-theme", newTheme);
      document.body.style.display = 'none';
      document.body.offsetHeight;
      document.body.style.display = '';
    }, 10);
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

        <button 
          onClick={toggleTheme} 
          className="theme-toggle"
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
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
            {/* ✅ Only show Logout button when NOT on Profile page */}
            {!isProfilePage && (
              <button 
                className="navbar-logout" 
                onClick={() => { logout(); navigate("/login"); }}
              >
                Logout
              </button>
            )}
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