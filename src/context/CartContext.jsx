// src/context/CartContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "./ToastContext";

const CartContext = createContext();

const getId = (item) => item._id || item.id;

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  const toast = useToast(); // ✅ get whole object first
  const showToast = toast?.showToast || (() => {}); // ✅ safe fallback

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (preset) => {
    setCart(prev => {
      const existing = prev.find(item => getId(item) === getId(preset));
      if (existing) {
        showToast(`${preset.name} quantity updated`, "info");
        return prev.map(item =>
          getId(item) === getId(preset)
            ? { ...item, qty: item.qty + 1 }
            : item
        );
      }
      showToast(`${preset.name} added to cart 🛒`, "success");
      return [...prev, { ...preset, qty: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart(prev => {
      const item = prev.find(i => getId(i) === id);
      if (item) showToast(`${item.name} removed from cart`, "warning");
      return prev.filter(item => getId(item) !== id);
    });
  };

  const increaseQty = (id) => {
    setCart(prev =>
      prev.map(item =>
        getId(item) === id ? { ...item, qty: item.qty + 1 } : item
      )
    );
  };

  const decreaseQty = (id) => {
    setCart(prev =>
      prev
        .map(item =>
          getId(item) === id ? { ...item, qty: item.qty - 1 } : item
        )
        .filter(item => item.qty > 0)
    );
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      increaseQty,
      decreaseQty,
      clearCart,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);