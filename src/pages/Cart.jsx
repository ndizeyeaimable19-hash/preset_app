// src/pages/Cart.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/Cart.css";

const getId = (item) => item._id || item.id;

export default function Cart() {
  const { cart, increaseQty, decreaseQty, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [downloaded, setDownloaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handleGetPresets = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      // Save order to MongoDB
      const res = await fetch("http://localhost:5000/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: cart.map(item => ({
            presetId: getId(item),
            name:     item.name,
            price:    item.price,
            qty:      item.qty,
          })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Something went wrong. Try again.");
        setLoading(false);
        return;
      }

      setDownloaded(true);
    } catch (err) {
      setError("Cannot connect to server. Make sure your backend is running.");
    }

    setLoading(false);
  };

  const handleDownload = (item) => {
    const token = localStorage.getItem("token");
    const id = getId(item);

    if (!token) {
      navigate("/login");
      return;
    }

    window.open(
      `http://localhost:5000/presets/${id}/download`,
      "_blank"
    );
  };

  const handleFinish = () => {
    clearCart();
    setDownloaded(false);
    navigate("/profile");
  };

  // ── Empty cart ──
  if (!cart.length && !downloaded) {
    return (
      <div className="cart-page">
        <h1>Your Cart</h1>
        <div className="cart-empty">
          <span>🛒</span>
          Your cart is empty. Go browse some presets!
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1>{downloaded ? "✅ Presets Ready!" : "Your Cart"}</h1>

      {/* Success banner */}
      {downloaded && (
        <div className="cart-success">
          🎉 Your presets are ready! Click download on each one below.
        </div>
      )}

      {/* Error */}
      {error && <div className="cart-error">{error}</div>}

      {/* Items */}
      {cart.map(item => (
        <div key={getId(item)} className="cart-item">
          <img src={item.image} alt={item.name} />

          <div className="cart-details">
            <h3>{item.name}</h3>
            <p>{item.description}</p>

            {/* Qty controls — only before download */}
            {!downloaded && (
              <div className="qty-controls">
                <button onClick={() => decreaseQty(getId(item))}>−</button>
                <span>{item.qty}</span>
                <button onClick={() => increaseQty(getId(item))}>+</button>
              </div>
            )}

            {/* Download button — after clicking Get Presets */}
            {downloaded && (
              item.fileType || item.presetFile ? (
                <button
                  className="download-btn"
                  onClick={() => handleDownload(item)}
                >
                  ⬇ Download {item.fileType || "Preset"}
                </button>
              ) : (
                <span className="no-file-note">⚠️ No file attached yet</span>
              )
            )}
          </div>

          <span className="price">${item.price}</span>

          {!downloaded && (
            <button
              className="remove-btn"
              onClick={() => removeFromCart(getId(item))}
            >
              ✕
            </button>
          )}
        </div>
      ))}

      {/* Summary */}
      <div className="cart-summary">
        <div className="cart-total">
          Total: <span>${total.toFixed(2)}</span>
        </div>

        {!downloaded ? (
          <button
            className="checkout-btn"
            onClick={handleGetPresets}
            disabled={loading}
          >
            {loading
              ? "Processing..."
              : user
              ? "⬇ Get Presets Free"
              : "Login to Download"}
          </button>
        ) : (
          <button className="finish-btn" onClick={handleFinish}>
            View in Profile →
          </button>
        )}
      </div>
    </div>
  );
}