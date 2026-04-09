// src/pages/Register.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Auth.css";

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || "admin@preset.com";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const isAdminEmail = email === ADMIN_EMAIL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // ── Client-side validation ──
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      // 1. Register the user
      const registerRes = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const registerData = await registerRes.json();

      if (!registerRes.ok) {
        setError(registerData.message || "Registration failed.");
        setLoading(false);
        return;
      }

      // 2. Immediately log them in after registering
      const loginRes = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const loginData = await loginRes.json();

      if (!loginRes.ok) {
        // Registered but login failed — send to login page
        navigate("/login");
        return;
      }

      // 3. Save token + user to context
      localStorage.setItem("token", loginData.token);
      login(loginData.user);

      // 4. Redirect — admin goes to admin panel, user goes home
      if (loginData.user.isAdmin) {
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

        {/* Logo */}
        <div className="auth-logo">
          Preset<span>Store</span>
        </div>

        <h1>Create Account</h1>
        <p className="auth-subtitle">
          {isAdminEmail
            ? "⚙️ This email will be registered as Admin"
            : "Join thousands of photographers on PresetStore"}
        </p>

        {/* Admin badge */}
        {isAdminEmail && (
          <div className="auth-admin-notice">
            🔐 Registering as <strong>Admin</strong> — you'll have full access to the admin panel.
          </div>
        )}

        {/* Error */}
        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="auth-field">
            <label>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="auth-field">
            <label>Password</label>
            <input
              type="password"
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="auth-field">
            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="Repeat your password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Creating account..." : isAdminEmail ? "Register as Admin" : "Create Account"}
          </button>
        </form>

        <p>
          Already have an account? <Link to="/login">Login here</Link>
        </p>

      </div>
    </div>
  );
}