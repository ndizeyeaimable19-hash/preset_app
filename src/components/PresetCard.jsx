// src/components/PresetCard.jsx
import { useNavigate } from "react-router-dom";
import "../styles/PresetCard.css";

export default function PresetCard({
  preset,
  addToCart,
  isInCart,
  onToggleFavorite,
  isFavorite = false,
  isFavoritesPage = false,
}) {
  const navigate = useNavigate();

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

        <div className="preset-card-footer">
          <span className="preset-card-price">${preset.price}</span>

          <button
            className={`preset-card-btn ${isInCart ? "in-cart" : ""}`}
            onClick={() => { if (!isInCart) addToCart(preset); }}
            disabled={isInCart}
          >
            {isInCart ? "✓ In Cart" : "+ Cart"}
          </button>
        </div>

        {/* Favorite text button */}
        <button
          className={`preset-card-fav ${isFavorite ? "active" : ""}`}
          onClick={() => onToggleFavorite(preset)}
        >
          {isFavoritesPage ? "Remove from Favorites ❤️" : isFavorite ? "❤️ Favorited" : "🤍 Add to Favorites"}
        </button>
      </div>

    </div>
  );
}