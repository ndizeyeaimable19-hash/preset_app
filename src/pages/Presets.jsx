// src/pages/Presets.jsx
import { useState, useEffect } from "react";
import PresetCard from "../components/PresetCard";
import "../styles/Presets.css";
import { useCart } from "../context/CartContext";
import { useFavorites } from "../context/FavoritesContext";

const categories = ["All", "Portrait", "Night", "Cinematic"];

// ✅ works with both MongoDB _id and regular id
const getId = (item) => item._id || item.id;

export default function Presets() {
  const [presets, setPresets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState(null);
  const [category, setCategory] = useState("All");

  const { cart, addToCart } = useCart();
  const { favorites, toggleFavorite } = useFavorites();

  useEffect(() => {
    fetch("http://localhost:5000/presets")
      .then(res => res.json())
      .then(data => {
        setPresets(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredPresets = presets
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    .filter(p => category === "All" ? true : p.category === category)
    .sort((a, b) => {
      if (sort === "low")  return a.price - b.price;
      if (sort === "high") return b.price - a.price;
      return 0;
    });

  if (loading) return <div className="status">Loading presets...</div>;
  if (!presets.length) return <div className="status">No presets found</div>;

  return (
    <div className="presets-page">
      <div className="presets-header">
        <h1>Presets</h1>
        <div className="cart-count">🛒 {cart.length}</div>
      </div>

      <input
        className="search-input"
        placeholder="Search presets..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="sort-buttons">
        <button onClick={() => setSort("low")}>Low → High</button>
        <button onClick={() => setSort("high")}>High → Low</button>
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
        {filteredPresets.map(preset => (
          <PresetCard
            key={getId(preset)}
            preset={preset}
            addToCart={addToCart}
            isInCart={cart.some(item => getId(item) === getId(preset))}   // ✅ fixed
            onToggleFavorite={toggleFavorite}
            isFavorite={favorites.some(f => getId(f) === getId(preset))}  // ✅ fixed
          />
        ))}
      </div>
    </div>
  );
}