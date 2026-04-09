// src/pages/Home.jsx
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { useFavorites } from "../context/FavoritesContext";
import "../styles/Home.css";

const getId = (item) => item._id || item.id;

const FEATURES = [
  { icon: "🎨", title: "Pro Quality",      desc: "Every preset is reviewed before listing to ensure top quality." },
  { icon: "⚡", title: "Instant Download", desc: "Purchase and download your presets immediately." },
  { icon: "💸", title: "Fair Pricing",     desc: "Transparent pricing with no hidden fees or subscriptions." },
  { icon: "🔒", title: "Secure Checkout",  desc: "Your payments are encrypted and fully secure." },
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
  const { cart, addToCart } = useCart();
  const { favorites, toggleFavorite } = useFavorites();

  const [presets, setPresets]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [stats, setStats]       = useState({ presets: 0 });

  useEffect(() => {
    fetch("http://localhost:5000/presets")
      .then(res => res.json())
      .then(data => {
        const list = Array.isArray(data) ? data : [];
        setPresets(list.slice(0, 6)); // show 6 featured presets
        setStats({ presets: list.length });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="home-page">

      {/* ── Hero ── */}
      <div className="home-hero">
        <div className="home-hero-left">
          <div className="home-badge">
            <span className="home-badge-dot" />
            MARKETPLACE NOW LIVE
          </div>

          <h1 className="home-title">
            Elevate Every<br />
            <span className="home-title-accent">Shot.</span>
          </h1>

          <p className="home-subtitle">
            Buy and sell professional Lightroom presets. Trusted by thousands of photographers worldwide.
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
              ["50K+", "Photographers"],
              [stats.presets > 0 ? `${stats.presets}` : "12K+", "Presets"],
              ["$2M+", "Paid Out"],
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
            : presets.map(preset => (
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
                    <div className="home-preset-footer">
                      <span className="home-preset-price">${preset.price}</span>
                      <button
                        className={`home-preset-btn ${cart.some(i => getId(i) === getId(preset)) ? "in-cart" : ""}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!cart.some(i => getId(i) === getId(preset))) addToCart(preset);
                        }}
                        disabled={cart.some(i => getId(i) === getId(preset))}
                      >
                        {cart.some(i => getId(i) === getId(preset)) ? "✓ In Cart" : "+ Cart"}
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
        <p>Join thousands of photographers using PresetStore</p>
        <button onClick={() => navigate("/presets")}>Browse All Presets →</button>
      </div>

    </div>
  );
}