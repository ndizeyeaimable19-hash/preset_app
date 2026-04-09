import { useState } from "react";

const presets = [
  {
    id: 1,
    title: "Golden Hour",
    author: "Luna Visuals",
    price: 12,
    category: "Portrait",
    rating: 4.9,
    sales: 1240,
    tags: ["warm", "golden", "cinematic"],
    before: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=80",
    after: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=80&sat=-20&sepia=40",
    gradient: "from-amber-400 to-orange-500",
    accent: "#f59e0b",
  },
  {
    id: 2,
    title: "Moody Blues",
    author: "Darkroom Co.",
    price: 18,
    category: "Landscape",
    rating: 4.7,
    sales: 892,
    tags: ["dark", "moody", "cinematic"],
    before: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80",
    after: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80",
    gradient: "from-blue-500 to-indigo-700",
    accent: "#6366f1",
  },
  {
    id: 3,
    title: "Film Fade",
    author: "Analog Dreams",
    price: 9,
    category: "Street",
    rating: 4.8,
    sales: 2105,
    tags: ["film", "faded", "vintage"],
    before: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600&q=80",
    after: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600&q=80",
    gradient: "from-stone-400 to-zinc-600",
    accent: "#a8a29e",
  },
  {
    id: 4,
    title: "Ivory Edit",
    author: "Soft Studio",
    price: 15,
    category: "Portrait",
    rating: 4.6,
    sales: 670,
    tags: ["bright", "airy", "clean"],
    before: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&q=80",
    after: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&q=80",
    gradient: "from-rose-200 to-pink-400",
    accent: "#f43f5e",
  },
  {
    id: 5,
    title: "Jungle Green",
    author: "Nature Lens",
    price: 11,
    category: "Nature",
    rating: 4.9,
    sales: 543,
    tags: ["lush", "green", "vivid"],
    before: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&q=80",
    after: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&q=80",
    gradient: "from-emerald-400 to-green-700",
    accent: "#10b981",
  },
  {
    id: 6,
    title: "Noir Classic",
    author: "SilverGrain",
    price: 22,
    category: "Portrait",
    rating: 5.0,
    sales: 388,
    tags: ["black & white", "contrast", "dramatic"],
    before: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
    after: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
    gradient: "from-gray-600 to-gray-900",
    accent: "#6b7280",
  },
];

const categories = ["All", "Portrait", "Landscape", "Street", "Nature"];

const HeroSection = ({ onExplore }) => (
  <div className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0a0a0a 0%, #1a0a2e 50%, #0d1117 100%)", minHeight: "100vh", display: "flex", alignItems: "center" }}>
    {/* Grain overlay */}
    <div style={{
      position: "absolute", inset: 0, opacity: 0.04,
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
    }} />
    {/* Orbs */}
    <div style={{ position: "absolute", top: "10%", left: "5%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)", filter: "blur(40px)" }} />
    <div style={{ position: "absolute", bottom: "10%", right: "10%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 70%)", filter: "blur(40px)" }} />

    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 2rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center", width: "100%", position: "relative", zIndex: 1 }}>
      {/* Left */}
      <div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.3)", borderRadius: 100, padding: "0.3rem 1rem", marginBottom: "2rem" }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#a78bfa", display: "inline-block", animation: "pulse 2s infinite" }} />
          <span style={{ color: "#a78bfa", fontSize: 13, fontFamily: "'DM Mono', monospace", letterSpacing: 1 }}>MARKETPLACE NOW LIVE</span>
        </div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(3rem, 5vw, 5rem)", fontWeight: 900, lineHeight: 1.05, color: "#fff", marginBottom: "1.5rem" }}>
          Elevate Every<br />
          <span style={{ background: "linear-gradient(90deg, #f59e0b, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Shot.</span>
        </h1>
        <p style={{ color: "#9ca3af", fontSize: "1.1rem", lineHeight: 1.7, marginBottom: "2.5rem", fontFamily: "'DM Sans', sans-serif", maxWidth: 440 }}>
          Buy and sell professional Lightroom presets. Trusted by 50,000+ photographers worldwide.
        </p>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <button onClick={onExplore} style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)", color: "#fff", border: "none", borderRadius: 12, padding: "0.9rem 2rem", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "1rem", cursor: "pointer", boxShadow: "0 0 30px rgba(139,92,246,0.4)" }}>
            Explore Presets
          </button>
          <button style={{ background: "transparent", color: "#e5e7eb", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 12, padding: "0.9rem 2rem", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "1rem", cursor: "pointer" }}>
            Start Selling →
          </button>
        </div>
        <div style={{ display: "flex", gap: "2.5rem", marginTop: "3rem" }}>
          {[["50K+", "Photographers"], ["12K+", "Presets"], ["$2M+", "Paid Out"]].map(([num, label]) => (
            <div key={label}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", fontWeight: 800, color: "#fff" }}>{num}</div>
              <div style={{ color: "#6b7280", fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
      {/* Right — stacked preview cards */}
      <div style={{ position: "relative", height: 480 }}>
        {presets.slice(0, 3).map((p, i) => (
          <div key={p.id} style={{
            position: "absolute",
            width: 260, height: 320,
            borderRadius: 20,
            overflow: "hidden",
            boxShadow: "0 25px 60px rgba(0,0,0,0.6)",
            transform: `rotate(${(i - 1) * 8}deg) translate(${i * 60 - 60}px, ${i * 20}px)`,
            zIndex: 3 - i,
            border: "1px solid rgba(255,255,255,0.08)",
          }}>
            <img src={p.before} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "1.5rem 1rem 1rem", background: "linear-gradient(transparent, rgba(0,0,0,0.85))" }}>
              <div style={{ color: "#fff", fontFamily: "'Playfair Display', serif", fontSize: "1rem", fontWeight: 700 }}>{p.title}</div>
              <div style={{ color: "#9ca3af", fontFamily: "'DM Sans', sans-serif", fontSize: 12 }}>{p.author}</div>
            </div>
          </div>
        ))}
      </div>
    </div>

    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;600;700&family=DM+Mono&display=swap');
      @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
    `}</style>
  </div>
);

const PresetCard = ({ preset, onView }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onView(preset)}
      style={{
        background: "#111827",
        borderRadius: 20,
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.06)",
        cursor: "pointer",
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        boxShadow: hovered ? "0 20px 50px rgba(0,0,0,0.5)" : "0 4px 20px rgba(0,0,0,0.3)",
      }}
    >
      {/* Image */}
      <div style={{ position: "relative", height: 220, overflow: "hidden" }}>
        <img src={preset.before} alt={preset.title} style={{ width: "100%", height: "100%", objectFit: "cover", transform: hovered ? "scale(1.05)" : "scale(1)", transition: "transform 0.4s ease" }} />
        <div style={{ position: "absolute", top: 12, left: 12 }}>
          <span style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)", color: "#e5e7eb", fontSize: 11, padding: "4px 10px", borderRadius: 100, fontFamily: "'DM Sans', sans-serif", fontWeight: 600, letterSpacing: 0.5 }}>
            {preset.category}
          </span>
        </div>
        <div style={{ position: "absolute", top: 12, right: 12, background: `linear-gradient(135deg, ${preset.accent}33, ${preset.accent}55)`, border: `1px solid ${preset.accent}66`, borderRadius: 100, padding: "4px 10px" }}>
          <span style={{ color: preset.accent, fontSize: 11, fontFamily: "'DM Mono', monospace", fontWeight: 700 }}>⭐ {preset.rating}</span>
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: "1.25rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
          <div>
            <h3 style={{ color: "#f9fafb", fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontWeight: 700, margin: 0 }}>{preset.title}</h3>
            <p style={{ color: "#6b7280", fontFamily: "'DM Sans', sans-serif", fontSize: 13, margin: "2px 0 0" }}>by {preset.author}</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ color: "#f9fafb", fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: "1.2rem" }}>${preset.price}</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: "1rem" }}>
          {preset.tags.map(tag => (
            <span key={tag} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#9ca3af", fontSize: 11, padding: "2px 8px", borderRadius: 6, fontFamily: "'DM Mono', monospace" }}>
              {tag}
            </span>
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "#4b5563", fontFamily: "'DM Sans', sans-serif", fontSize: 12 }}>{preset.sales.toLocaleString()} sales</span>
          <button
            style={{
              background: `linear-gradient(135deg, ${preset.accent}cc, ${preset.accent})`,
              color: "#fff", border: "none", borderRadius: 10, padding: "0.55rem 1.2rem",
              fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 13, cursor: "pointer",
            }}
            onClick={(e) => { e.stopPropagation(); alert(`Added "${preset.title}" to cart!`); }}
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

const PresetModal = ({ preset, onClose }) => (
  <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(10px)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }} onClick={onClose}>
    <div style={{ background: "#111827", borderRadius: 24, maxWidth: 800, width: "100%", overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 40px 100px rgba(0,0,0,0.8)" }} onClick={e => e.stopPropagation()}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
        <img src={preset.before} alt={preset.title} style={{ width: "100%", height: 400, objectFit: "cover" }} />
        <div style={{ padding: "2.5rem", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <span style={{ color: "#6b7280", fontFamily: "'DM Mono', monospace", fontSize: 12, letterSpacing: 1 }}>{preset.category.toUpperCase()}</span>
            <h2 style={{ fontFamily: "'Playfair Display', serif", color: "#fff", fontSize: "2rem", margin: "0.5rem 0", fontWeight: 900 }}>{preset.title}</h2>
            <p style={{ color: "#6b7280", fontFamily: "'DM Sans', sans-serif", marginBottom: "1.5rem" }}>by {preset.author}</p>
            <div style={{ display: "flex", gap: "1.5rem", marginBottom: "1.5rem" }}>
              <div><div style={{ color: "#fff", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "1.1rem" }}>⭐ {preset.rating}</div><div style={{ color: "#6b7280", fontSize: 12 }}>Rating</div></div>
              <div><div style={{ color: "#fff", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "1.1rem" }}>{preset.sales.toLocaleString()}</div><div style={{ color: "#6b7280", fontSize: 12 }}>Sales</div></div>
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {preset.tags.map(tag => (
                <span key={tag} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#9ca3af", fontSize: 12, padding: "4px 10px", borderRadius: 8, fontFamily: "'DM Mono', monospace" }}>{tag}</span>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontFamily: "'Playfair Display', serif", color: "#fff", fontSize: "2.5rem", fontWeight: 900, marginBottom: "1rem" }}>${preset.price}</div>
            <button style={{ width: "100%", background: `linear-gradient(135deg, ${preset.accent}, ${preset.accent}cc)`, color: "#fff", border: "none", borderRadius: 14, padding: "1rem", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "1rem", cursor: "pointer", marginBottom: "0.75rem" }} onClick={() => alert(`Purchased "${preset.title}"!`)}>
              Purchase Preset
            </button>
            <button style={{ width: "100%", background: "transparent", color: "#6b7280", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, padding: "0.85rem", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "0.9rem", cursor: "pointer" }} onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const UploadSection = () => {
  const [dragOver, setDragOver] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  return (
    <div style={{ background: "#0d1117", padding: "6rem 2rem" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <span style={{ color: "#a78bfa", fontFamily: "'DM Mono', monospace", fontSize: 13, letterSpacing: 2 }}>CREATORS</span>
          <h2 style={{ fontFamily: "'Playfair Display', serif", color: "#fff", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 900, margin: "0.75rem 0" }}>Sell Your Presets</h2>
          <p style={{ color: "#6b7280", fontFamily: "'DM Sans', sans-serif", fontSize: "1.05rem", maxWidth: 500, margin: "0 auto" }}>Join thousands of creators earning passive income. Upload once, earn forever.</p>
        </div>

        <div
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={() => { setDragOver(false); setUploaded(true); }}
          style={{
            border: `2px dashed ${dragOver ? "#a78bfa" : "rgba(255,255,255,0.1)"}`,
            borderRadius: 20, padding: "4rem 2rem", textAlign: "center",
            background: dragOver ? "rgba(139,92,246,0.05)" : "rgba(255,255,255,0.02)",
            transition: "all 0.2s ease", cursor: "pointer",
          }}
        >
          {uploaded ? (
            <div>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✅</div>
              <h3 style={{ color: "#10b981", fontFamily: "'Playfair Display', serif", fontSize: "1.5rem" }}>Preset Uploaded!</h3>
              <p style={{ color: "#6b7280", fontFamily: "'DM Sans', sans-serif" }}>Your preset is under review.</p>
            </div>
          ) : (
            <>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📁</div>
              <h3 style={{ color: "#f9fafb", fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", marginBottom: "0.5rem" }}>Drop your preset files here</h3>
              <p style={{ color: "#6b7280", fontFamily: "'DM Sans', sans-serif", marginBottom: "1.5rem" }}>Supports .xmp, .lrtemplate, .dng files</p>
              <button style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)", color: "#fff", border: "none", borderRadius: 12, padding: "0.8rem 2rem", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, cursor: "pointer" }}>
                Browse Files
              </button>
            </>
          )}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem", marginTop: "2.5rem" }}>
          {[["70%", "Revenue Share", "You keep most of every sale"], ["24h", "Review Time", "Quick approval process"], ["$0", "Upload Fee", "Free to list your work"]].map(([val, label, desc]) => (
            <div key={label} style={{ background: "#111827", borderRadius: 16, padding: "1.5rem", border: "1px solid rgba(255,255,255,0.06)", textAlign: "center" }}>
              <div style={{ fontFamily: "'Playfair Display', serif", color: "#a78bfa", fontSize: "1.8rem", fontWeight: 900 }}>{val}</div>
              <div style={{ color: "#f9fafb", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, marginTop: 4 }}>{label}</div>
              <div style={{ color: "#6b7280", fontFamily: "'DM Sans', sans-serif", fontSize: 13, marginTop: 4 }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [page, setPage] = useState("home");

  const filtered = presets.filter(p => {
    const matchCat = activeCategory === "All" || p.category === activeCategory;
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.author.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh" }}>
      {/* Nav */}
      <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(10,10,10,0.9)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "1rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontFamily: "'Playfair Display', serif", color: "#fff", fontSize: "1.5rem", fontWeight: 900, cursor: "pointer" }} onClick={() => setPage("home")}>
          Preset<span style={{ color: "#a78bfa" }}>Hub</span>
        </div>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <button onClick={() => setPage("home")} style={{ background: "none", border: "none", color: page === "home" ? "#a78bfa" : "#9ca3af", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, cursor: "pointer", fontSize: "0.95rem" }}>Browse</button>
          <button onClick={() => setPage("sell")} style={{ background: "none", border: "none", color: page === "sell" ? "#a78bfa" : "#9ca3af", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, cursor: "pointer", fontSize: "0.95rem" }}>Sell</button>
          <button style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)", color: "#fff", border: "none", borderRadius: 10, padding: "0.6rem 1.4rem", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, cursor: "pointer", fontSize: "0.9rem" }}>Sign In</button>
        </div>
      </nav>

      {page === "home" && (
        <>
          <HeroSection onExplore={() => document.getElementById("browse")?.scrollIntoView({ behavior: "smooth" })} />

          {/* Browse Section */}
          <div id="browse" style={{ padding: "5rem 2rem", maxWidth: 1200, margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2.5rem", flexWrap: "wrap", gap: "1rem" }}>
              <div>
                <span style={{ color: "#a78bfa", fontFamily: "'DM Mono', monospace", fontSize: 13, letterSpacing: 2 }}>PRESETS</span>
                <h2 style={{ fontFamily: "'Playfair Display', serif", color: "#fff", fontSize: "2.2rem", fontWeight: 900, margin: "0.5rem 0 0" }}>Browse Collection</h2>
              </div>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search presets..."
                style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.1)", color: "#f9fafb", borderRadius: 12, padding: "0.7rem 1.2rem", fontFamily: "'DM Sans', sans-serif", fontSize: "0.95rem", width: 240, outline: "none" }}
              />
            </div>

            {/* Category Pills */}
            <div style={{ display: "flex", gap: "0.75rem", marginBottom: "2.5rem", flexWrap: "wrap" }}>
              {categories.map(cat => (
                <button key={cat} onClick={() => setActiveCategory(cat)} style={{
                  background: activeCategory === cat ? "linear-gradient(135deg, #7c3aed, #a855f7)" : "rgba(255,255,255,0.04)",
                  border: activeCategory === cat ? "none" : "1px solid rgba(255,255,255,0.08)",
                  color: activeCategory === cat ? "#fff" : "#9ca3af",
                  borderRadius: 100, padding: "0.5rem 1.25rem",
                  fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "0.9rem", cursor: "pointer",
                  transition: "all 0.2s",
                }}>
                  {cat}
                </button>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
              {filtered.map(preset => (
                <PresetCard key={preset.id} preset={preset} onView={setSelectedPreset} />
              ))}
            </div>
            {filtered.length === 0 && (
              <div style={{ textAlign: "center", padding: "4rem", color: "#4b5563", fontFamily: "'DM Sans', sans-serif" }}>
                No presets found for "{search}"
              </div>
            )}
          </div>
        </>
      )}

      {page === "sell" && <UploadSection />}

      {selectedPreset && <PresetModal preset={selectedPreset} onClose={() => setSelectedPreset(null)} />}
    </div>
  );
}
