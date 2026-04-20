// src/pages/PresetDetails.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useFavorites } from "../context/FavoritesContext";
import { useAuth } from "../context/AuthContext";
import Rating from "../components/Rating";
import ReviewForm from "../components/ReviewForm";
import "../styles/PresetDetails.css";

const getId = (item) => item?._id || item?.id;

export default function PresetDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [preset, setPreset] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const { favorites, toggleFavorite } = useFavorites();
  const { user } = useAuth();

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

  const handleDownload = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      setDownloading(true);
      const token = localStorage.getItem("token");

      const response = await fetch(`http://localhost:5000/presets/${getId(preset)}/download`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error("Download failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${preset.name}${preset.fileType || '.zip'}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error("Error downloading file:", error);
      alert("Error downloading file. Are you logged in?");
    } finally {
      setDownloading(false);
    }
  };

  // ✅ Handle rating updates
  const handleRatingChange = (newAvg, newCount) => {
    setPreset(prev => ({
      ...prev,
      averageRating: newAvg,
      ratingCount: newCount,
    }));
  };

  if (loading)             return <div className="details-status">Loading preset...</div>;
  if (notFound || !preset) return <div className="details-status">Preset not found 😔</div>;

  const hasFile = preset.fileType || preset.presetFile;

  return (
    <div className="preset-details-page">
      <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>

      <div className="details-card">
        <div className="details-image-wrap">
          <img src={preset.image} alt={preset.name} />
          <span className="details-image-category">{preset.category}</span>
          {hasFile && (
            <span className="details-image-filebadge">
              {preset.fileType || "📁"} included
            </span>
          )}
        </div>

        <div className="details-info">
          <h1 className="details-title">{preset.name}</h1>
          <p className="details-description">{preset.description}</p>

          {/* ── RATING & REVIEW SECTION ── */}
<div style={{
  marginTop: "1.5rem",
  paddingTop: "1rem",
  borderTop: "1px solid var(--border)",
}}>
  {/* Rating Display */}
  <div style={{ marginBottom: "1.5rem" }}>
    <h3 style={{
      margin: "0 0 0.5rem 0",
      color: "var(--text)",
      fontFamily: "'Syne', sans-serif",
      fontSize: "1.1rem"
    }}>
      Ratings & Reviews
    </h3>
    
    <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
      <Rating 
        presetId={getId(preset)} 
        currentRating={preset.averageRating || 0} 
        ratingCount={preset.ratingCount || 0}
        showCount={true}
        onRatingChange={handleRatingChange}
      />
      
      {preset.ratingCount > 0 && (
        <span style={{ 
          color: "var(--text-muted)", 
          fontSize: "0.9rem",
          fontFamily: "'DM Sans', sans-serif"
        }}>
          ⭐ {preset.averageRating} from {preset.ratingCount} {preset.ratingCount === 1 ? 'review' : 'reviews'}
        </span>
      )}
    </div>
  </div>

  {/* Review Form */}
  <ReviewForm 
    presetId={getId(preset)}
    onReviewSubmitted={handleRatingChange}
  />

  {/* Display Existing Reviews */}
  {preset.ratings && preset.ratings.length > 0 && (
    <div style={{ marginTop: "2rem" }}>
      <h4 style={{
        color: "var(--text)",
        fontFamily: "'Syne', sans-serif",
        fontSize: "1rem",
        marginBottom: "1rem"
      }}>
        What users say ({preset.ratings.length})
      </h4>
      
      <div style={{ 
        display: "flex", 
        flexDirection: "column", 
        gap: "1rem" 
      }}>
        {preset.ratings.map((rating, index) => (
          <div key={index} style={{
            background: "var(--bg3)",
            padding: "1rem",
            borderRadius: "8px",
            border: "1px solid var(--border)"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "0.5rem" }}>
              <div style={{
                color: "#fbbf24",
                fontSize: "18px"
              }}>
                {"★".repeat(rating.score)}
              </div>
              <span style={{
                color: "var(--text-muted)",
                fontSize: "0.85rem"
              }}>
                {new Date(rating.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p style={{
              color: "var(--text)",
              margin: 0,
              lineHeight: 1.5
            }}>
              {rating.comment || "No comment provided."}
            </p>
          </div>
        ))}
      </div>
    </div>
  )}
</div>

          {hasFile ? (
            <button
              className="details-download-btn"
              onClick={handleDownload}
              disabled={downloading}
              style={{ width: "100%", padding: "15px", marginTop: "15px", background: "var(--purple)", color: "white" }}
            >
              {downloading ? "⏳ Downloading..." : "⬇ Download Preset"}
            </button>
          ) : (
            <div className="details-no-file" style={{ marginTop: "15px", color: "var(--red)" }}>
              ⚠️ No file attached to this preset yet
            </div>
          )}

          <button
            className="details-back-link"
            onClick={() => navigate("/presets")}
            style={{ marginTop: "20px", display: "block" }}
          >
            ← Back to all presets
          </button>
        </div>
      </div>
    </div>
  );
}