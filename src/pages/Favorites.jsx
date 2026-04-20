// src/pages/Favorites.jsx
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useFavorites } from "../context/FavoritesContext";
import PresetCard from "../components/PresetCard";
import "../styles/Presets.css";

// ✅ works with both MongoDB _id and regular id
const getId = (item) => item._id || item.id;

export default function Favorites() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { favorites, toggleFavorite, loading } = useFavorites();

  if (loading) {
    return (
      <div className="presets-page">
        <h1>My Favorites</h1>
        <div className="status">Loading your favorites...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="presets-page">
        <h1>My Favorites</h1>
        <div className="status">🔒 Please log in to view your favorites</div>
        <button onClick={() => navigate("/login")} style={{ marginTop: "20px", padding: "10px 20px", background: "#c026d3", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}>
          Go to Login
        </button>
      </div>
    );
  }

  if (!favorites.length) {
    return (
      <div className="presets-page">
        <div className="presets-header">
          <h1>My Favorites</h1>
        </div>
        <div className="status">You have no favorite presets yet 🤍</div>
        <button onClick={() => navigate("/presets")} style={{ marginTop: "20px", padding: "10px 20px", background: "#7c3aed", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}>
          Browse Presets
        </button>
      </div>
    );
  }

  return (
    <div className="presets-page">
      <div className="presets-header">
        <h1>My Favorites</h1>
      </div>

      <div className="presets-container">
        {favorites.map(preset => (
          <PresetCard
            key={getId(preset)}
            preset={preset}
            onToggleFavorite={toggleFavorite}
            isFavorite={true}
            isFavoritesPage={true}
          />
        ))}
      </div>
    </div>
  );
}