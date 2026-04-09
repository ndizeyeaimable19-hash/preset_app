// src/components/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import "../styles/Navbar.css";

export default function Navbar() {
  const { cart } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="navbar-logo" onClick={() => navigate("/")}>
        Preset<span>Store</span>
      </div>

      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/presets">Presets</Link>
        <Link to="/favorites">Favorites</Link>

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

        <Link to="/cart" className="navbar-cart">
          🛒 {cart.length}
        </Link>
      </div>
    </nav>
  );
}