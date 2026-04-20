// src/pages/Home.jsx
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useFavorites } from "../context/FavoritesContext";
import Rating from "../components/Rating";
import "../styles/Home.css";

const getId = (item) => item._id || item.id;

const FEATURES = [
  { icon: "🎨", title: "Pro Quality",      desc: "Every preset is reviewed before listing to ensure top quality." },
  { icon: "⚡", title: "Instant Download", desc: "Download your favorite presets immediately — no waiting." },
  { icon: "🆓", title: "100% Free",        desc: "No hidden fees, no subscriptions — completely free for everyone." },
  { icon: "❤️", title: "Save Favorites",   desc: "Heart presets you love and access them anytime in your profile." },
];

const CATEGORIES = [
  { name: "Portrait",   icon: "🧑‍🎨", color: "#c026d3" },
  { name: "Night",      icon: "🌙", color: "#7c3aed" },
  { name: "Cinematic",  icon: "🎬", color: "#0ea5e9" },
  { name: "Landscape",  icon: "🏔️", color: "#10b981" },
];

// ── Skeleton card ──
function SkeletonCard() {
  return (
    <div className="home-preset-card skeleton">
      <div className="skeleton-img" />
      <div className="skeleton-body">
        <div className="skeleton-line w60" />
        <div className="skeleton-line w40" />
        <div className="skeleton-line w80" />
      </div>
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { favorites, toggleFavorite } = useFavorites();

  const [presets, setPresets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ presets: 0 });

  useEffect(() => {
    fetch("http://localhost:5000/presets")
      .then(res => res.json())
      .then(data => {
        const list = Array.isArray(data) ? data : [];
        setPresets(list);
        setStats({ presets: list.length });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Get top rated presets (minimum 1 rating)
  const topRatedPresets = presets
    .filter(p => p.ratingCount > 0)
    .sort((a, b) => {
      if (b.averageRating !== a.averageRating) {
        return b.averageRating - a.averageRating;
      }
      return b.ratingCount - a.ratingCount;
    })
    .slice(0, 3);

  return (
    <div className="home-page">

      {/* ── Hero ── */}
      <div className="home-hero">
        <div className="home-hero-left">
          <div className="home-badge">
            <span className="home-badge-dot" />
            FREE PRESETS NOW LIVE
          </div>

          <h1 className="home-title">
            Elevate Every<br />
            <span className="home-title-accent">Shot.</span>
          </h1>

          <p className="home-subtitle">
            Download professional-quality presets for Lightroom, Photoshop, and more — 100% free.
          </p>

          <div className="home-cta">
            <button className="home-cta-primary" onClick={() => navigate("/presets")}>
              Browse Presets
            </button>
            <button className="home-cta-secondary" onClick={() => navigate("/register")}>
              Get Started →
            </button>
          </div>

          <div className="home-stats">
            {[
              ["∞", "Free Downloads"],
              [stats.presets > 0 ? `${stats.presets}` : "12K+", "Presets"],
              ["❤️", "Community Loved"],
            ].map(([val, label]) => (
              <div key={label} className="home-stat">
                <div className="home-stat-value">{val}</div>
                <div className="home-stat-label">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Stacked cards */}
        <div className="home-cards">
          {(loading
            ? [
                { name: "Moody Dark",   img: "https://picsum.photos/220/290?random=10" },
                { name: "Golden Hour",  img: "https://picsum.photos/220/290?random=11" },
                { name: "Film Fade",    img: "https://picsum.photos/220/290?random=12" },
              ]
            : presets.slice(0, 3)
          ).map((item, i) => (
            <div
              key={item.name || i}
              className="home-card"
              style={{
                transform: `rotate(${(i - 1) * 7}deg) translate(${i * 55 - 55}px, ${i * 18}px)`,
                zIndex: 3 - i,
              }}
              onClick={() => item._id && navigate(`/presets/${getId(item)}`)}
            >
              <img src={item.image || item.img} alt={item.name} />
              <div className="home-card-label">
                <div className="home-card-name">{item.name}</div>
                <div className="home-card-author">{item.category || "PresetStore"}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Top Rated Presets ── */}
      {topRatedPresets.length > 0 && (
        <div className="home-section">
          <div className="home-section-header">
            <h2>🏆 Top Rated Presets</h2>
            <button onClick={() => navigate("/presets?sort=rating")}>View All →</button>
          </div>
          <div className="home-presets-grid">
            {topRatedPresets.map(preset => (
              <div
                key={getId(preset)}
                className="home-preset-card"
                onClick={() => navigate(`/presets/${getId(preset)}`)}
              >
                <div className="home-preset-img-wrap">
                  <img src={preset.image} alt={preset.name} />
                  <span className="home-preset-category">{preset.category}</span>

                  {/* Heart button */}
                  <button
                    className={`home-preset-heart ${favorites.some(f => getId(f) === getId(preset)) ? "active" : ""}`}
                    onClick={(e) => { e.stopPropagation(); toggleFavorite(preset); }}
                  >
                    {favorites.some(f => getId(f) === getId(preset)) ? "❤️" : "🤍"}
                  </button>
                </div>

                <div className="home-preset-body">
                  <div className="home-preset-name">{preset.name}</div>
                  <div className="home-preset-desc">{preset.description}</div>
                  
                  {/* Rating Display */}
                  <div style={{ margin: "8px 0" }}>
                    <Rating 
                      presetId={getId(preset)} 
                      currentRating={preset.averageRating || 0}
                      ratingCount={preset.ratingCount || 0}
                      showCount={true}
                      readOnly={true}
                      size={16}
                    />
                  </div>

                  <div className="home-preset-footer">
                    <span className="home-preset-price">Free</span>
                    <button
                      className="home-preset-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!user) {
                          navigate('/login');
                          return;
                        }
                        navigate(`/presets/${getId(preset)}`);
                      }}
                    >
                      Download
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Categories ── */}
      <div className="home-section">
        <div className="home-section-header">
          <h2>Browse by Category</h2>
          <button onClick={() => navigate("/presets")}>View all →</button>
        </div>
        <div className="home-categories">
          {CATEGORIES.map(cat => (
            <div
              key={cat.name}
              className="home-category-chip"
              style={{ "--cat-color": cat.color }}
              onClick={() => navigate("/presets")}
            >
              <span className="home-category-icon">{cat.icon}</span>
              <span>{cat.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Featured Presets ── */}
      <div className="home-section">
        <div className="home-section-header">
          <h2>Featured Presets</h2>
          <button onClick={() => navigate("/presets")}>See all →</button>
        </div>

        <div className="home-presets-grid">
          {loading
            ? Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)
            : presets.slice(0, 6).map(preset => (
                <div
                  key={getId(preset)}
                  className="home-preset-card"
                  onClick={() => navigate(`/presets/${getId(preset)}`)}
                >
                  <div className="home-preset-img-wrap">
                    <img src={preset.image} alt={preset.name} />
                    <span className="home-preset-category">{preset.category}</span>

                    {/* Heart button */}
                    <button
                      className={`home-preset-heart ${favorites.some(f => getId(f) === getId(preset)) ? "active" : ""}`}
                      onClick={(e) => { e.stopPropagation(); toggleFavorite(preset); }}
                    >
                      {favorites.some(f => getId(f) === getId(preset)) ? "❤️" : "🤍"}
                    </button>
                  </div>

                  <div className="home-preset-body">
                    <div className="home-preset-name">{preset.name}</div>
                    <div className="home-preset-desc">{preset.description}</div>
                    
                    {/* Rating Display */}
                    <div style={{ margin: "8px 0" }}>
                      <Rating 
                        presetId={getId(preset)} 
                        currentRating={preset.averageRating || 0}
                        ratingCount={preset.ratingCount || 0}
                        showCount={true}
                        readOnly={true}
                        size={16}
                      />
                    </div>

                    <div className="home-preset-footer">
                      <span className="home-preset-price">Free</span>
                      <button
                        className="home-preset-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!user) {
                            navigate('/login');
                            return;
                          }
                          navigate(`/presets/${getId(preset)}`);
                        }}
                      >
                        Download
                      </button>
                    </div>
                  </div>
                </div>
              ))
          }
        </div>
      </div>

      {/* ── Features ── */}
      <div className="home-features">
        <h2 className="home-features-title">Why PresetStore?</h2>
        <div className="home-features-grid">
          {FEATURES.map(f => (
            <div key={f.title} className="home-feature-card">
              <div className="home-feature-icon">{f.icon}</div>
              <div className="home-feature-title">{f.title}</div>
              <div className="home-feature-desc">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA Banner ── */}
      <div className="home-cta-banner">
        <h2>Ready to transform your photos?</h2>
        <p>Join thousands of creators using our free presets</p>
        <button onClick={() => navigate("/presets")}>Browse All Presets →</button>
      </div>

    </div>
  );
}