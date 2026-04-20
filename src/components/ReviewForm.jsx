// src/components/ReviewForm.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function ReviewForm({ presetId, onReviewSubmitted }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [score, setScore] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate("/login");
      return;
    }

    if (!comment.trim()) {
      setError("Please write a review comment");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/presets/${presetId}/rate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ score, comment }),
      });

      if (res.ok) {
        const data = await res.json();
        if (onReviewSubmitted) {
          onReviewSubmitted(data.averageRating, data.ratingCount);
        }
        setComment("");
        alert("Thank you for your review!");
      } else {
        const errData = await res.json();
        setError(errData.message || "Failed to submit review");
      }
    } catch (err) {
      console.error("Error submitting review:", err);
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div style={{ background: "var(--bg3)", padding: "1rem", borderRadius: "8px", marginBottom: "1rem" }}>
        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
          🔒 Please <button onClick={() => navigate("/login")} style={{ background: "none", border: "none", color: "var(--purple-lt)", cursor: "pointer", textDecoration: "underline" }}>log in</button> to leave a review.
        </p>
      </div>
    );
  }

  return (
    <div style={{ 
      background: "var(--bg3)", 
      padding: "1.5rem", 
      borderRadius: "12px", 
      marginBottom: "2rem",
      border: "1px solid var(--border)"
    }}>
      <h3 style={{ 
        margin: "0 0 1rem 0", 
        color: "var(--text)",
        fontFamily: "'Syne', sans-serif"
      }}>
        Write a Review
      </h3>

      {error && (
        <div style={{ 
          background: "var(--red)22", 
          border: "1px solid var(--red)44", 
          color: "var(--red)", 
          padding: "8px 12px", 
          borderRadius: "6px", 
          marginBottom: "1rem",
          fontSize: "0.9rem"
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Star Rating */}
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text)" }}>
            Your Rating
          </label>
          <div style={{ display: "flex", gap: "4px" }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setScore(star)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "24px",
                  color: star <= score ? "#fbbf24" : "#d1d5db",
                  transition: "color 0.2s",
                }}
              >
                ★
              </button>
            ))}
            <span style={{ marginLeft: "8px", color: "var(--text)", fontWeight: "600" }}>
              {score} ★
            </span>
          </div>
        </div>

        {/* Comment */}
        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text)" }}>
            Your Review (optional but appreciated!)
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience with this preset..."
            rows="4"
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid var(--border)",
              background: "var(--bg2)",
              color: "var(--text)",
              fontSize: "1rem",
              fontFamily: "'DM Sans', sans-serif",
              resize: "vertical"
            }}
            maxLength="500"
          />
          <div style={{ 
            textAlign: "right", 
            color: "var(--text-muted)", 
            fontSize: "0.85rem", 
            marginTop: "4px" 
          }}>
            {comment.length}/500
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          style={{
            background: "linear-gradient(135deg, #c026d3, #7c3aed)",
            color: "white",
            border: "none",
            borderRadius: "8px",
            padding: "12px 24px",
            fontSize: "1rem",
            fontWeight: "700",
            cursor: submitting ? "not-allowed" : "pointer",
            opacity: submitting ? 0.7 : 1,
            transition: "opacity 0.2s"
          }}
        >
          {submitting ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  );
}