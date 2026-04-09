// src/pages/Profile.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useFavorites } from "../context/FavoritesContext";
import { useCart } from "../context/CartContext";

// ─── Stat Card ───
function StatCard({ icon, label, value, accent }) {
  return (
    <div style={{
      background: "#13131a", border: "1px solid #1e1e2a",
      borderRadius: 16, padding: "1.5rem",
      display: "flex", alignItems: "center", gap: "1rem", flex: "1 1 160px",
    }}>
      <div style={{
        width: 48, height: 48, borderRadius: 12,
        background: `${accent}18`, border: `1px solid ${accent}33`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "1.4rem",
      }}>{icon}</div>
      <div>
        <div style={{ color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.5rem", lineHeight: 1 }}>{value}</div>
        <div style={{ color: "#555", fontFamily: "'DM Sans', sans-serif", fontSize: 13, marginTop: 4 }}>{label}</div>
      </div>
    </div>
  );
}

function Tab({ label, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      background: "none", border: "none",
      borderBottom: active ? "2px solid #e879f9" : "2px solid transparent",
      color: active ? "#e879f9" : "#555",
      fontFamily: "'DM Sans', sans-serif", fontWeight: 700,
      fontSize: "0.95rem", padding: "0.75rem 1.25rem",
      cursor: "pointer", transition: "all 0.2s", whiteSpace: "nowrap",
    }}>{label}</button>
  );
}

function InfoRow({ label, value }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.75rem 0", borderBottom: "1px solid #1e1e2a" }}>
      <span style={{ color: "#555", fontFamily: "'DM Sans', sans-serif", fontSize: 14 }}>{label}</span>
      <span style={{ color: "#f9fafb", fontFamily: "'DM Mono', monospace", fontSize: 14 }}>{value}</span>
    </div>
  );
}

function Empty({ icon, message, sub }) {
  return (
    <div style={{ textAlign: "center", padding: "4rem 2rem" }}>
      <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>{icon}</div>
      <div style={{ color: "#666", fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "1.1rem", marginBottom: "0.5rem" }}>{message}</div>
      <div style={{ color: "#444", fontFamily: "'DM Sans', sans-serif", fontSize: 14 }}>{sub}</div>
    </div>
  );
}

export default function Profile() {
  const { user, logout } = useAuth();
  const { favorites } = useFavorites();
  const { cart } = useCart();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("purchases");
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  // ✅ Fetch real orders from MongoDB
  useEffect(() => {
    if (!user) return;
    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/orders/my", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        setOrders(Array.isArray(data) ? data : []);
        setOrdersLoading(false);
      })
      .catch(() => setOrdersLoading(false));
  }, [user]);

  if (!user) {
    return (
      <div style={{ minHeight: "80vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#0a0a0f" }}>
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔒</div>
        <h2 style={{ color: "#fff", fontFamily: "'Syne', sans-serif", marginBottom: "0.5rem" }}>You're not logged in</h2>
        <p style={{ color: "#555", fontFamily: "'DM Sans', sans-serif", marginBottom: "1.5rem" }}>Please login to view your profile</p>
        <button onClick={() => navigate("/login")} style={{ background: "linear-gradient(135deg, #c026d3, #7c3aed)", color: "#fff", border: "none", borderRadius: 12, padding: "0.8rem 2rem", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, cursor: "pointer" }}>
          Go to Login
        </button>
      </div>
    );
  }

  const initials = user.email?.slice(0, 2).toUpperCase() || "U";
  const totalSpent = orders.reduce((sum, o) => sum + o.total, 0);

  const handleDownload = (presetId, presetName, fileType) => {
    const token = localStorage.getItem("token");
    window.open(`http://localhost:5000/presets/${presetId}/download`, "_blank");
  };

  return (
    <div style={{ background: "#0a0a0f", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;600;700&family=DM+Mono:wght@400;700&display=swap');
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        .dash-section { animation: fadeUp 0.4s ease both; }
        .preset-row:hover { background: #1a1a24 !important; }
        .fav-card:hover { transform: translateY(-4px); box-shadow: 0 12px 30px rgba(0,0,0,0.5); }
      `}</style>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "2.5rem 1.5rem" }}>

        {/* ── Header ── */}
        <div className="dash-section" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", marginBottom: "2.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
            <div style={{
              width: 72, height: 72, borderRadius: "50%",
              background: "linear-gradient(135deg, #c026d3, #7c3aed)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "1.6rem", fontWeight: 800, color: "#fff",
              fontFamily: "'Syne', sans-serif",
              boxShadow: "0 0 0 3px #13131a, 0 0 0 5px #c026d333",
            }}>
              {initials}
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <h1 style={{ color: "#fff", fontFamily: "'Syne', sans-serif", fontSize: "1.5rem", fontWeight: 800, margin: 0 }}>
                  {user.email?.split("@")[0]}
                </h1>
                {user.isAdmin && (
                  <span style={{ background: "#c026d322", border: "1px solid #c026d355", color: "#e879f9", fontSize: 11, fontFamily: "'DM Mono', monospace", padding: "2px 8px", borderRadius: 100, letterSpacing: 1 }}>
                    ADMIN
                  </span>
                )}
              </div>
              <div style={{ color: "#555", fontSize: 14, marginTop: 2 }}>{user.email}</div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "0.75rem" }}>
            {user.isAdmin && (
              <button onClick={() => navigate("/admin")} style={{ background: "#13131a", border: "1px solid #222", color: "#e879f9", borderRadius: 10, padding: "0.6rem 1.2rem", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
                ⚙️ Admin Panel
              </button>
            )}
            <button onClick={() => { logout(); navigate("/login"); }} style={{ background: "#13131a", border: "1px solid #2a1a1a", color: "#f87171", borderRadius: 10, padding: "0.6rem 1.2rem", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
              Logout
            </button>
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="dash-section" style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "2.5rem", animationDelay: "0.1s" }}>
          <StatCard icon="🧾" label="Orders"    value={orders.length}          accent="#e879f9" />
          <StatCard icon="❤️" label="Favorites" value={favorites.length}        accent="#f43f5e" />
          <StatCard icon="🛒" label="In Cart"   value={cart.length}             accent="#f59e0b" />
          <StatCard icon="💸" label="Total Spent" value={`$${totalSpent.toFixed(2)}`} accent="#10b981" />
        </div>

        {/* ── Tabs ── */}
        <div className="dash-section" style={{ borderBottom: "1px solid #1a1a24", display: "flex", gap: 0, marginBottom: "2rem", overflowX: "auto", animationDelay: "0.15s" }}>
          <Tab label="🧾 Purchase History" active={activeTab === "purchases"} onClick={() => setActiveTab("purchases")} />
          <Tab label="❤️ Favorites"        active={activeTab === "favorites"} onClick={() => setActiveTab("favorites")} />
          <Tab label="👤 Account"          active={activeTab === "account"}   onClick={() => setActiveTab("account")} />
        </div>

        {/* ── PURCHASES TAB ── */}
        {activeTab === "purchases" && (
          <div className="dash-section" style={{ animationDelay: "0.2s" }}>
            {ordersLoading ? (
              <Empty icon="⏳" message="Loading your orders..." sub="" />
            ) : orders.length === 0 ? (
              <Empty icon="🧾" message="No purchases yet" sub="Browse presets and add them to your cart" />
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {orders.map(order => (
                  <div key={order._id} style={{ background: "#13131a", border: "1px solid #1e1e2a", borderRadius: 16, padding: "1.25rem 1.5rem" }}>
                    {/* Order header */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
                      <div>
                        <div style={{ color: "#f9fafb", fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "0.95rem" }}>
                          Order #{order._id.slice(-6).toUpperCase()}
                        </div>
                        <div style={{ color: "#555", fontFamily: "'DM Mono', monospace", fontSize: 12, marginTop: 2 }}>
                          {new Date(order.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <span style={{ background: "#10b98122", border: "1px solid #10b98144", color: "#10b981", fontSize: 12, fontFamily: "'DM Mono', monospace", padding: "3px 10px", borderRadius: 100 }}>
                          ✓ {order.status}
                        </span>
                        <span style={{ color: "#e879f9", fontFamily: "'DM Mono', monospace", fontWeight: 700 }}>
                          ${order.total.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Order items */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                      {order.presets.map((item, i) => (
                        <div key={i} className="preset-row" style={{ background: "#0a0a0f", border: "1px solid #1e1e2a", borderRadius: 10, padding: "0.75rem 1rem", display: "flex", alignItems: "center", gap: "1rem", transition: "background 0.2s" }}>
                          {item.preset?.image && (
                            <img src={item.preset.image} alt={item.name} style={{ width: 60, height: 45, borderRadius: 8, objectFit: "cover", flexShrink: 0 }} />
                          )}
                          <div style={{ flex: 1 }}>
                            <div style={{ color: "#f9fafb", fontWeight: 600, fontSize: "0.9rem" }}>{item.name}</div>
                            <div style={{ color: "#555", fontSize: 12, marginTop: 2 }}>Qty: {item.qty} · ${item.price} each</div>
                          </div>
                          <button
                            onClick={() => handleDownload(item.preset?._id || item.preset, item.name, item.preset?.fileType)}
                            style={{ background: "#10b98122", border: "1px solid #10b98144", color: "#10b981", borderRadius: 8, padding: "6px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer", flexShrink: 0 }}
                          >
                            ⬇ Download
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── FAVORITES TAB ── */}
        {activeTab === "favorites" && (
          <div className="dash-section" style={{ animationDelay: "0.2s" }}>
            {favorites.length === 0 ? (
              <Empty icon="❤️" message="No favorites yet" sub="Heart presets you love to save them here" />
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1rem" }}>
                {favorites.map(preset => (
                  <div key={preset.id || preset._id} className="fav-card" style={{ background: "#13131a", border: "1px solid #1e1e2a", borderRadius: 16, overflow: "hidden", transition: "transform 0.25s, box-shadow 0.25s", cursor: "pointer" }} onClick={() => navigate(`/presets/${preset._id || preset.id}`)}>
                    <img src={preset.image} alt={preset.name} style={{ width: "100%", height: 130, objectFit: "cover" }} />
                    <div style={{ padding: "0.85rem" }}>
                      <div style={{ color: "#f9fafb", fontWeight: 700, fontSize: "0.9rem" }}>{preset.name}</div>
                      <div style={{ color: "#e879f9", fontFamily: "'DM Mono', monospace", fontWeight: 700, marginTop: 4 }}>${preset.price}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── ACCOUNT TAB ── */}
        {activeTab === "account" && (
          <div className="dash-section" style={{ animationDelay: "0.2s", maxWidth: 520 }}>
            <div style={{ background: "#13131a", border: "1px solid #1e1e2a", borderRadius: 20, padding: "2rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <h2 style={{ color: "#fff", fontFamily: "'Syne', sans-serif", margin: 0, fontSize: "1.1rem" }}>Account Information</h2>
              <InfoRow label="Email"  value={user.email} />
              <InfoRow label="Role"   value={user.isAdmin ? "Admin / Seller" : "Buyer"} />
              <InfoRow label="Orders" value={orders.length} />
              <InfoRow label="Total Spent" value={`$${totalSpent.toFixed(2)}`} />

              <div style={{ borderTop: "1px solid #1e1e2a", paddingTop: "1.5rem" }}>
                <h3 style={{ color: "#f87171", fontFamily: "'Syne', sans-serif", fontSize: "0.95rem", margin: "0 0 1rem" }}>Danger Zone</h3>
                <button onClick={() => { logout(); navigate("/login"); }} style={{ background: "#f8717122", border: "1px solid #f8717144", color: "#f87171", borderRadius: 10, padding: "0.7rem 1.5rem", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
                  Logout from this device
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}