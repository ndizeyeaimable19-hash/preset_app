// src/components/Rating.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Rating({ 
  presetId, 
  currentRating = 0, 
  onRatingChange, 
  readOnly = false,
  size = 20,
  showCount = false,
  ratingCount = 0
}) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [hover, setHover] = useState(0);
  const [selected, setSelected] = useState(currentRating);

  const handleClick = async (score) => {
    if (readOnly || !user) {
      if (!user) navigate("/login");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/presets/${presetId}/rate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ score }),
      });

      if (res.ok) {
        const data = await res.json();
        setSelected(score);
        if (onRatingChange) {
          onRatingChange(data.averageRating, data.ratingCount);
        }
      }
    } catch (err) {
      console.error("Error submitting rating:", err);
    }
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => handleClick(star)}
          onMouseEnter={() => !readOnly && setHover(star)}
          onMouseLeave={() => !readOnly && setHover(0)}
          style={{
            background: "none",
            border: "none",
            cursor: readOnly ? "default" : user ? "pointer" : "not-allowed",
            fontSize: `${size}px`,
            color: hover >= star || selected >= star ? "#fbbf24" : "#d1d5db",
            transition: "color 0.2s",
          }}
          disabled={readOnly && !user}
          title={!user ? "Login to rate" : ""}
        >
          ★
        </button>
      ))}
      
      {showCount && (
        <span style={{ 
          color: "#6b7280", 
          fontSize: "0.85rem",
          fontFamily: "'DM Mono', monospace"
        }}>
          ({ratingCount})
        </span>
      )}
    </div>
  );
}