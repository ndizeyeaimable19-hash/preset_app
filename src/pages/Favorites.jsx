// src/pages/Favorites.jsx
import { useFavorites } from "../context/FavoritesContext";
import { useCart } from "../context/CartContext";
import PresetCard from "../components/PresetCard";
import "../styles/Presets.css";

// ✅ works with both MongoDB _id and regular id
const getId = (item) => item._id || item.id;

export default function Favorites() {
  const { favorites, toggleFavorite } = useFavorites();
  const { cart, addToCart } = useCart();

  if (!favorites.length) {
    return (
      <div className="presets-page">
        <h1>My Favorites</h1>
        <div className="status">You have no favorite presets yet 🤍</div>
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
            addToCart={addToCart}
            isInCart={cart.some(item => getId(item) === getId(preset))}  // ✅ fixed
            onToggleFavorite={toggleFavorite}
            isFavorite={true}
            isFavoritesPage={true}
          />
        ))}
      </div>
    </div>
  );
}