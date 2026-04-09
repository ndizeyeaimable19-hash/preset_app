// src/pages/PresetDetails.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { useFavorites } from "../context/FavoritesContext";
import { useAuth } from "../context/AuthContext";
import "../styles/PresetDetails.css";

const getId = (item) => item?._id || item?.id;

export default function PresetDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [preset, setPreset] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const { cart, addToCart } = useCart();
  const { favorites, toggleFavorite } = useFavorites();
  const { user } = useAuth();

  const isInCart   = cart.some(item => getId(item) === getId(preset));
  const isFavorite = favorites.some(f => getId(f) === getId(preset));

  useEffect(() => {
    fetch(`http://localhost:5000/presets/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then(data => {
        setPreset(data);
        setLoading(false);
      })
      .catch(() => {
        setNotFound(true);
        setLoading(false);
      });
  }, [id]);

  const handleDownload = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    const token = localStorage.getItem("token");
    window.open(`http://localhost:5000/presets/${getId(preset)}/download`, "_blank");
  };

  if (loading)             return <div className="details-status">Loading preset...</div>;
  if (notFound || !preset) return <div className="details-status">Preset not found 😔</div>;

  const hasFile = preset.fileType || preset.presetFile;

  return (
    <div className="preset-details-page">
      <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>

      <div className="details-card">

        {/* ── Image ── */}
        <div className="details-image-wrap">
          <img src={preset.image} alt={preset.name} />
          <span className="details-image-category">{preset.category}</span>
          {hasFile && (
            <span className="details-image-filebadge">
              {preset.fileType || "📁"} included
            </span>
          )}
        </div>

        {/* ── Info ── */}
        <div className="details-info">
          <h1 className="details-title">{preset.name}</h1>
          <p className="details-description">{preset.description}</p>
          <div className="details-price">${preset.price}</div>

          {/* Actions */}
          <div className="details-actions">

            {/* Add to cart */}
            <button
              className={`details-cart-btn ${isInCart ? "in-cart" : ""}`}
              disabled={isInCart}
              onClick={() => { if (!isInCart) addToCart(preset); }}
            >
              {isInCart ? "✓ In Cart" : "🛒 Add to Cart"}
            </button>

            {/* Favorite */}
            <button
              className={`details-fav-btn ${isFavorite ? "active" : ""}`}
              onClick={() => toggleFavorite(preset)}
            >
              {isFavorite ? "❤️" : "🤍"}
            </button>
          </div>

          {/* Direct download button */}
          {hasFile ? (
            <button
              className="details-download-btn"
              onClick={handleDownload}
            >
              ⬇ Download Free
            </button>
          ) : (
            <div className="details-no-file">
              ⚠️ No file attached to this preset yet
            </div>
          )}

          <button
            className="details-back-link"
            onClick={() => navigate("/presets")}
          >
            ← Back to all presets
          </button>
        </div>
      </div>
    </div>
  );
}