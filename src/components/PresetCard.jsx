// src/components/PresetCard.jsx
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Rating from "./Rating";
import "../styles/PresetCard.css";

export default function PresetCard({
  preset,
  onToggleFavorite,
  isFavorite = false,
  isFavoritesPage = false,
}) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleDownload = (e) => {
    e.stopPropagation(); // Don't trigger navigate to detail page
    if (!user) {
      navigate('/login');
      return;
    }
    // Navigate to preset detail page where download happens
    navigate(`/presets/${preset._id || preset.id}`);
  };

  return (
    <div className="preset-card">

      {/* ── Image ── */}
      <div
        className="preset-card-image"
        onClick={() => navigate(`/presets/${preset._id || preset.id}`)}
      >
        <img src={preset.image} alt={preset.name} />

        {/* Category badge */}
        <span className="preset-card-category">{preset.category}</span>

        {/* Heart button */}
        <button
          className={`preset-card-heart ${isFavorite ? "active" : ""}`}
          onClick={(e) => { e.stopPropagation(); onToggleFavorite(preset); }}
          title={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          {isFavorite ? "❤️" : "🤍"}
        </button>
      </div>

      {/* ── Body ── */}
      <div className="preset-card-body">
        <div
          className="preset-card-title"
          onClick={() => navigate(`/presets/${preset._id || preset.id}`)}
        >
          {preset.name}
        </div>
        <div className="preset-card-desc">{preset.description}</div>

        {/* ── RATING DISPLAY ── */}
        <div style={{ margin: "8px 0" }}>
          <Rating 
            presetId={preset._id || preset.id} 
            currentRating={preset.averageRating || 0}
            ratingCount={preset.ratingCount || 0}
            showCount={true}
            readOnly={true}
            size={16}
          />
        </div>

        <div className="preset-card-footer">
          {/* ❌ REMOVED PRICE — REPLACED WITH FREE BADGE */}
          <span className="preset-card-free">Free Download</span>

          {/* ❌ REMOVED CART BUTTON — REPLACED WITH DOWNLOAD BUTTON */}
          <button
            className="preset-card-download-btn"
            onClick={handleDownload}
          >
            ⬇ Download
          </button>
        </div>

        {/* Favorite text button */}
        <button
          className={`preset-card-fav ${isFavorite ? "active" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(preset);
          }}
        >
          {isFavoritesPage ? "Remove from Favorites ❤️" : isFavorite ? "❤️ Favorited" : "🤍 Add to Favorites"}
        </button>
      </div>
    </div>
  );
}