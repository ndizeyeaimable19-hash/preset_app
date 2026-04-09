// src/context/FavoritesContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "./ToastContext";

const FavoritesContext = createContext();

const getId = (item) => item._id || item.id;

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  const toast = useToast(); // ✅ get whole object first
  const showToast = toast?.showToast || (() => {}); // ✅ safe fallback

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("favorites") || "[]");
    setFavorites(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (preset) => {
    setFavorites(prev => {
      const alreadyFav = prev.some(f => getId(f) === getId(preset));
      if (alreadyFav) {
        showToast(`${preset.name} removed from favorites`, "warning");
        return prev.filter(f => getId(f) !== getId(preset));
      } else {
        showToast(`${preset.name} added to favorites ❤️`, "success");
        return [...prev, preset];
      }
    });
  };

  const isFavorite = (presetId) =>
    favorites.some(f => getId(f) === presetId);

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);