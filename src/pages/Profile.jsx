// src/pages/Profile.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useFavorites } from "../context/FavoritesContext";

// ─── Stat Card ───
function StatCard({ icon, label, value, accent }) {
  return (
    <div style={{
      background: "var(--bg2)",
      border: "1px solid var(--border)",
      borderRadius: 16,
      padding: "1.5rem",
      display: "flex",
      alignItems: "center",
      gap: "1rem",
      flex: "1 1 160px",
    }}>
      <div style={{
        width: 48,
        height: 48,
        borderRadius: 12,
        background: `${accent}18`,
        border: `1px solid ${accent}33`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "1.4rem",
      }}>
        {icon}
      </div>
      <div>
        <div style={{
          color: "var(--text)",
          fontFamily: "'Syne', sans-serif",
          fontWeight: 800,
          fontSize: "1.5rem",
          lineHeight: 1,
        }}>
          {value}
        </div>
        <div style={{
          color: "var(--text-muted)",
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 13,
          marginTop: 4,
        }}>
          {label}
        </div>
      </div>
    </div>
  );
}

// ─── Tab Component ───
function Tab({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "none",
        border: "none",
        borderBottom: active ? "2px solid var(--purple-lt)" : "2px solid transparent",
        color: active ? "var(--purple-lt)" : "var(--text-muted)",
        fontFamily: "'DM Sans', sans-serif",
        fontWeight: 700,
        fontSize: "0.95rem",
        padding: "0.75rem 1.25rem",
        cursor: "pointer",
        transition: "all 0.2s",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </button>
  );
}

// ─── Info Row ───
function InfoRow({ label, value }) {
  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "0.75rem 0",
      borderBottom: "1px solid var(--border)",
    }}>
      <span style={{
        color: "var(--text-muted)",
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 14,
      }}>
        {label}
      </span>
      <span style={{
        color: "var(--text)",
        fontFamily: "'DM Mono', monospace",
        fontSize: 14,
      }}>
        {value}
      </span>
    </div>
  );
}

// ─── Empty State ───
function Empty({ icon, message, sub }) {
  return (
    <div style={{
      textAlign: "center",
      padding: "4rem 2rem",
    }}>
      <div style={{ fontSize: "3rem", marginBottom: "1rem", color: "var(--text)" }}>
        {icon}
      </div>
      <div style={{
        color: "var(--text)",
        fontFamily: "'Syne', sans-serif",
        fontWeight: 700,
        fontSize: "1.1rem",
        marginBottom: "0.5rem",
      }}>
        {message}
      </div>
      <div style={{
        color: "var(--text-muted)",
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 14,
      }}>
        {sub}
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ───
export default function Profile() {
  const { user, logout } = useAuth();
  const { favorites, toggleFavorite, loading: favoritesLoading } = useFavorites();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("purchases");
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  // ✅ Fetch download history
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

  // ❌ Not logged in
  if (!user) {
    return (
      <div style={{
        minHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg)",
        color: "var(--text)",
      }}>
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔒</div>
        <h2 style={{
          color: "var(--text)",
          fontFamily: "'Syne', sans-serif",
          marginBottom: "0.5rem",
        }}>
          You're not logged in
        </h2>
        <p style={{
          color: "var(--text-muted)",
          fontFamily: "'DM Sans', sans-serif",
          marginBottom: "1.5rem",
        }}>
          Please login to view your profile
        </p>
        <button
          onClick={() => navigate("/login")}
          style={{
            background: "linear-gradient(135deg, var(--purple), var(--blue))",
            color: "#fff",
            border: "none",
            borderRadius: 12,
            padding: "0.8rem 2rem",
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Go to Login
        </button>
      </div>
    );
  }

  const initials = user.email?.slice(0, 2).toUpperCase() || "U";
  const totalDownloads = orders.reduce((sum, o) => sum + o.presets.length, 0);

  const handleDownload = (presetId) => {
    const token = localStorage.getItem("token");
    window.open(`http://localhost:5000/presets/${presetId}/download`, "_blank");
  };

 return (
    <div style={{
      background: "var(--bg)",
      minHeight: "100vh",
      fontFamily: "'DM Sans', sans-serif",
      color: "var(--text)",
      width: "100%",
      overflowX: "hidden",
    }}>
      {/* ── Global Styles ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;600;700&family=DM+Mono:wght@400;700&display=swap');
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        .dash-section { animation: fadeUp 0.4s ease both; }
        .preset-row:hover { background: var(--bg3) !important; }
        .fav-card:hover { transform: translateY(-4px); box-shadow: 0 12px 30px rgba(0,0,0,0.5); }
        
        /* Theme transitions */
        * {
          transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
        }
      `}</style>

            <div style={{
        maxWidth: 1100,
        margin: "0 auto",
        padding: "2.5rem 1.5rem",
        width: "100%",
        boxSizing: "border-box",
      }}>

        {/* ── Header ── */}
        <div className="dash-section" style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1rem",
          marginBottom: "2.5rem",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
            <div style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: "linear-gradient(135deg, var(--purple), var(--blue))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.6rem",
              fontWeight: 800,
              color: "#fff",
              fontFamily: "'Syne', sans-serif",
              boxShadow: "0 0 0 3px var(--bg2), 0 0 0 5px var(--purple-dim)",
            }}>
              {initials}
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <h1 style={{
                  color: "var(--text)",
                  fontFamily: "'Syne', sans-serif",
                  fontSize: "1.5rem",
                  fontWeight: 800,
                  margin: 0,
                }}>
                  {user.email?.split("@")[0]}
                </h1>
                {user.isAdmin && (
                  <span style={{
                    background: "var(--purple-dim)",
                    border: "1px solid var(--purple-lt)55",
                    color: "var(--purple-lt)",
                    fontSize: 11,
                    fontFamily: "'DM Mono', monospace",
                    padding: "2px 8px",
                    borderRadius: 100,
                    letterSpacing: 1,
                  }}>
                    ADMIN
                  </span>
                )}
              </div>
              <div style={{ color: "var(--text-muted)", fontSize: 14, marginTop: 2 }}>
                {user.email}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "0.75rem" }}>
            {user.isAdmin && (
              <button
                onClick={() => navigate("/admin")}
                style={{
                  background: "var(--bg2)",
                  border: "1px solid var(--border)",
                  color: "var(--purple-lt)",
                  borderRadius: 10,
                  padding: "0.6rem 1.2rem",
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: "pointer",
                }}
              >
                ⚙️ Admin Panel
              </button>
            )}
            <button
              onClick={() => { logout(); navigate("/login"); }}
              style={{
                background: "var(--bg2)",
                border: "1px solid var(--border)",
                color: "var(--red)",
                borderRadius: 10,
                padding: "0.6rem 1.2rem",
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 700,
                fontSize: 14,
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="dash-section" style={{
          display: "flex",
          gap: "1rem",
          flexWrap: "wrap",
          marginBottom: "2.5rem",
          animationDelay: "0.1s",
        }}>
          <StatCard icon="📥" label="Downloads" value={orders.length} accent="var(--purple)" />
          <StatCard icon="❤️" label="Favorites" value={favorites.length} accent="var(--red)" />
          <StatCard icon="📦" label="Items Downloaded" value={totalDownloads} accent="var(--green)" />
        </div>

        {/* ── Tabs ── */}
        <div className="dash-section" style={{
          borderBottom: "1px solid var(--border)",
          display: "flex",
          gap: 0,
          marginBottom: "2rem",
          overflowX: "auto",
          animationDelay: "0.15s",
        }}>
          <Tab
            label="📥 Download History"
            active={activeTab === "purchases"}
            onClick={() => setActiveTab("purchases")}
          />
          <Tab
            label="❤️ Favorites"
            active={activeTab === "favorites"}
            onClick={() => setActiveTab("favorites")}
          />
          <Tab
            label="👤 Account"
            active={activeTab === "account"}
            onClick={() => setActiveTab("account")}
          />
        </div>

        {/* ── DOWNLOAD HISTORY TAB ── */}
        {activeTab === "purchases" && (
          <div className="dash-section" style={{ animationDelay: "0.2s" }}>
            {ordersLoading ? (
              <Empty icon="⏳" message="Loading your downloads..." sub="" />
            ) : orders.length === 0 ? (
              <Empty
                icon="📥"
                message="No downloads yet"
                sub="Browse presets and download your favorites"
              />
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {orders.map(order => (
                  <div
                    key={order._id}
                    style={{
                      background: "var(--bg2)",
                      border: "1px solid var(--border)",
                      borderRadius: 16,
                      padding: "1.25rem 1.5rem",
                    }}
                  >
                    {/* Order header */}
                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "1rem",
                      flexWrap: "wrap",
                      gap: "0.5rem",
                    }}>
                      <div>
                        <div style={{
                          color: "var(--text)",
                          fontFamily: "'Syne', sans-serif",
                          fontWeight: 700,
                          fontSize: "0.95rem",
                        }}>
                          Download #{order._id.slice(-6).toUpperCase()}
                        </div>
                        <div style={{
                          color: "var(--text-muted)",
                          fontFamily: "'DM Mono', monospace",
                          fontSize: 12,
                          marginTop: 2,
                        }}>
                          {new Date(order.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <span style={{
                          background: "var(--green)22",
                          border: "1px solid var(--green)44",
                          color: "var(--green)",
                          fontSize: 12,
                          fontFamily: "'DM Mono', monospace",
                          padding: "3px 10px",
                          borderRadius: 100,
                        }}>
                          ✓ Completed
                        </span>
                      </div>
                    </div>

                    {/* Items */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                      {order.presets.map((item, i) => (
                        <div
                          key={i}
                          className="preset-row"
                          style={{
                            background: "var(--bg)",
                            border: "1px solid var(--border)",
                            borderRadius: 10,
                            padding: "0.75rem 1rem",
                            display: "flex",
                            alignItems: "center",
                            gap: "1rem",
                            transition: "background 0.2s",
                          }}
                        >
                          {item.preset?.image && (
                            <img
                              src={item.preset.image}
                              alt={item.name}
                              style={{
                                width: 60,
                                height: 45,
                                borderRadius: 8,
                                objectFit: "cover",
                                flexShrink: 0,
                              }}
                            />
                          )}
                          <div style={{ flex: 1 }}>
                            <div style={{
                              color: "var(--text)",
                              fontWeight: 600,
                              fontSize: "0.9rem",
                            }}>
                              {item.name}
                            </div>
                            <div style={{
                              color: "var(--text-muted)",
                              fontSize: 12,
                              marginTop: 2,
                            }}>
                              Qty: {item.qty} · Free Download
                            </div>
                          </div>
                          <button
                            onClick={() => handleDownload(item.preset?._id || item.preset)}
                            style={{
                              background: "var(--green)22",
                              border: "1px solid var(--green)44",
                              color: "var(--green)",
                              borderRadius: 8,
                              padding: "6px 14px",
                              fontSize: 12,
                              fontWeight: 700,
                              cursor: "pointer",
                              flexShrink: 0,
                            }}
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
            {favoritesLoading ? (
              <Empty icon="⏳" message="Loading your favorites..." sub="" />
            ) : favorites.length === 0 ? (
              <Empty
                icon="❤️"
                message="No favorites yet"
                sub="Heart presets you love to save them here"
              />
            ) : (
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: "1rem",
              }}>
                {favorites.map(preset => (
                  <div
                    key={preset._id}
                    className="fav-card"
                    style={{
                      background: "var(--bg2)",
                      border: "1px solid var(--border)",
                      borderRadius: 16,
                      overflow: "hidden",
                      transition: "transform 0.25s, box-shadow 0.25s",
                      cursor: "pointer",
                    }}
                    onClick={() => navigate(`/presets/${preset._id}`)}
                  >
                    <img
                      src={preset.image}
                      alt={preset.name}
                      style={{
                        width: "100%",
                        height: 130,
                        objectFit: "cover",
                      }}
                    />
                    <div style={{ padding: "0.85rem" }}>
                      <div style={{
                        color: "var(--text)",
                        fontWeight: 700,
                        fontSize: "0.9rem",
                      }}>
                        {preset.name}
                      </div>
                      <div style={{
                        color: "var(--text-muted)",
                        fontFamily: "'DM Mono', monospace",
                        fontSize: 12,
                        marginTop: 4,
                      }}>
                        Free Download
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── ACCOUNT TAB ── */}
        {activeTab === "account" && (
          <div className="dash-section" style={{
            animationDelay: "0.2s",
            maxWidth: 520,
          }}>
            <div style={{
              background: "var(--bg2)",
              border: "1px solid var(--border)",
              borderRadius: 20,
              padding: "2rem",
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem",
            }}>
              <h2 style={{
                color: "var(--text)",
                fontFamily: "'Syne', sans-serif",
                margin: 0,
                fontSize: "1.1rem",
              }}>
                Account Information
              </h2>
              <InfoRow label="Email" value={user.email} />
              <InfoRow label="Role" value={user.isAdmin ? "Admin" : "User"} />
              <InfoRow label="Total Downloads" value={totalDownloads} />

              <div style={{
                borderTop: "1px solid var(--border)",
                paddingTop: "1.5rem",
              }}>
                <h3 style={{
                  color: "var(--red)",
                  fontFamily: "'Syne', sans-serif",
                  fontSize: "0.95rem",
                  margin: "0 0 1rem",
                }}>
                  Danger Zone
                </h3>
                <button
                  onClick={() => { logout(); navigate("/login"); }}
                  style={{
                    background: "var(--red)22",
                    border: "1px solid var(--red)44",
                    color: "var(--red)",
                    borderRadius: 10,
                    padding: "0.7rem 1.5rem",
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 700,
                    fontSize: 14,
                    cursor: "pointer",
                  }}
                >
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