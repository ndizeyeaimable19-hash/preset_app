// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Auth.css";

export default function Login() {
  const [tab, setTab] = useState("user"); // "user" | "admin"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  // Pre-fill admin credentials when switching to admin tab
  const handleTabSwitch = (newTab) => {
    setTab(newTab);
    setError("");
    if (newTab === "admin") {
      setEmail(import.meta.env.VITE_ADMIN_EMAIL || "admin@preset.com");
      setPassword("");
    } else {
      setEmail("");
      setPassword("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Invalid credentials");
        setLoading(false);
        return;
      }

      // Save token for API calls
      localStorage.setItem("token", data.token);

      // Save user to context
      login(data.user);

      // Redirect based on role
      if (data.user.isAdmin) {
        navigate("/admin");
      } else {
        navigate("/");
      }

    } catch (err) {
      setError("Cannot connect to server. Make sure your backend is running.");
    }

    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-box">

        {/* ── Logo ── */}
        <div className="auth-logo">
          Preset<span>Store</span>
        </div>

        {/* ── Tabs ── */}
        <div className="auth-tabs">
          <button
            className={`auth-tab ${tab === "user" ? "active" : ""}`}
            onClick={() => handleTabSwitch("user")}
            type="button"
          >
            👤 User Login
          </button>
          <button
            className={`auth-tab ${tab === "admin" ? "active" : ""}`}
            onClick={() => handleTabSwitch("admin")}
            type="button"
          >
            ⚙️ Admin Login
          </button>
        </div>

        {/* ── Heading ── */}
        <h1>{tab === "admin" ? "Admin Access" : "Welcome Back"}</h1>
        <p className="auth-subtitle">
          {tab === "admin"
            ? "Restricted to authorized administrators only"
            : "Sign in to your PresetStore account"}
        </p>

        {/* ── Admin notice ── */}
        {tab === "admin" && (
          <div className="auth-admin-notice">
            🔐 Admin email is pre-filled. Enter your admin password to continue.
          </div>
        )}

        {/* ── Error ── */}
        {error && <div className="auth-error">{error}</div>}

        {/* ── Form ── */}
        <form onSubmit={handleSubmit}>
          <div className="auth-field">
            <label>Email</label>
            <input
              type="email"
              placeholder={tab === "admin" ? "Admin email" : "you@example.com"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="auth-field">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading
              ? "Signing in..."
              : tab === "admin"
              ? "Access Admin Panel"
              : "Sign In"}
          </button>
        </form>

        {/* ── Footer ── */}
        {tab === "user" && (
          <p>
            Don't have an account? <Link to="/register">Register here</Link>
          </p>
        )}

        {tab === "admin" && (
          <p>
            Not an admin? <button
              type="button"
              onClick={() => handleTabSwitch("user")}
              className="auth-link-btn"
            >
              Switch to user login
            </button>
          </p>
        )}

      </div>
    </div>
  );
}