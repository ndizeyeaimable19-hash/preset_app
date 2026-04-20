// src/pages/AdminAnalytics.jsx
import { useEffect, useState } from "react";
import "../styles/Admin.css";

export default function AdminAnalytics() {
  const [topPresets, setTopPresets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/admin/analytics/favorites", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setTopPresets(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        alert("Failed to load analytics");
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <div className="admin-container">Loading analytics...</div>;

  return (
    <div className="admin-container">
      <h1>❤️ Most Loved Presets</h1>
      {topPresets.length === 0 ? (
        <p>No favorites yet.</p>
      ) : (
        <div className="grid-cards">
          {topPresets.map(preset => (
            <div key={preset.presetId} className="analytics-card">
              {preset.image && (
                <img src={preset.image} alt={preset.name} className="analytics-img" />
              )}
              <h3>{preset.name}</h3>
              <p className="category-tag">{preset.category}</p>
              <div className="love-count">
                ❤️ {preset.loves} {preset.loves === 1 ? 'love' : 'loves'}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}