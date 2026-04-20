// src/pages/Presets.jsx
import { useState, useEffect } from "react";
import PresetCard from "../components/PresetCard";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useFavorites } from "../context/FavoritesContext";
import "../styles/Presets.css";

const categories = ["All", "Portrait", "Night", "Cinematic"];

// ✅ works with both MongoDB _id and regular id
const getId = (item) => item._id || item.id;

export default function Presets() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { favorites, toggleFavorite } = useFavorites();

  const [presets, setPresets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("newest"); // Default sort: newest

  useEffect(() => {
    fetch("http://localhost:5000/presets")
      .then(res => res.json())
      .then(data => {
        setPresets(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // ✅ SORTING LOGIC
  const filteredAndSortedPresets = presets
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    .filter(p => category === "All" ? true : p.category === category)
    .sort((a, b) => {
      if (sort === "rating") {
        // Sort by averageRating descending, then by ratingCount
        if (b.averageRating !== a.averageRating) {
          return b.averageRating - a.averageRating;
        }
        return b.ratingCount - a.ratingCount;
      }
      if (sort === "name") {
        return a.name.localeCompare(b.name);
      }
      // Default: newest first
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  if (loading) return <div className="status">Loading presets...</div>;
  if (!presets.length) return <div className="status">No presets found</div>;

  return (
    <div className="presets-page">
      <div className="presets-header">
        <h1>Free Presets</h1>
      </div>

      <input
        className="search-input"
        placeholder="Search presets..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* ── SORT BUTTONS ── */}
      <div className="sort-buttons">
        <button 
          onClick={() => setSort("newest")}
          className={sort === "newest" ? "active" : ""}
        >
          Newest
        </button>
        <button 
          onClick={() => setSort("rating")}
          className={sort === "rating" ? "active" : ""}
        >
          Top Rated
        </button>
        <button 
          onClick={() => setSort("name")}
          className={sort === "name" ? "active" : ""}
        >
          A-Z
        </button>
      </div>

      <div className="category-chips">
        {categories.map(cat => (
          <button
            key={cat}
            className={`chip ${category === cat ? "active" : ""}`}
            onClick={() => setCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="presets-container">
        {filteredAndSortedPresets.map(preset => (
          <PresetCard
            key={getId(preset)}
            preset={preset}
            onDownload={() => {
              if (!user) {
                navigate('/login');
                return;
              }
              navigate(`/presets/${getId(preset)}`);
            }}
            onToggleFavorite={toggleFavorite}
            isFavorite={favorites.some(f => getId(f) === getId(preset))}
          />
        ))}
      </div>
    </div>
  );
}