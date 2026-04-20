// src/pages/Admin.jsx
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../styles/Admin.css";

const getToken = () => localStorage.getItem("token");
const EMPTY_FORM = { name: "", description: "", category: "", image: "" }; // ❌ Removed price

export default function Admin() {
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const activeTab = searchParams.get("tab") || "presets";
  const showPresetManager = activeTab === "presets";

  const [presets, setPresets] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [presetFile, setPresetFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState(null);

  // Load presets + stats
  useEffect(() => {
    if (showPresetManager) {
      fetch("http://localhost:5000/presets")
        .then(res => res.json())
        .then(data => setPresets(data));
    }
  }, [showPresetManager]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const showMessage = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("category", form.category); // ❌ No price

    if (imageFile) {
      formData.append("image", imageFile);
    } else if (form.image) {
      formData.append("image", form.image);
    }

    if (presetFile) {
      formData.append("presetFile", presetFile);
    }

    try {
      if (editingId) {
        const res = await fetch(`http://localhost:5000/presets/${editingId}`, {
          method: "PATCH",
          headers: { Authorization: `Bearer ${getToken()}` },
          body: formData,
        });
        const updated = await res.json();
        setPresets(presets.map(p => (p.id === editingId ? updated : p)));
        setEditingId(null);
        showMessage("✅ Preset updated successfully!");
      } else {
        const res = await fetch("http://localhost:5000/presets", {
          method: "POST",
          headers: { Authorization: `Bearer ${getToken()}` },
          body: formData,
        });
        const newPreset = await res.json();
        setPresets([...presets, newPreset]);
        showMessage("✅ Preset added successfully!");
      }

      setForm(EMPTY_FORM);
      setPresetFile(null);
      setImageFile(null);
    } catch (err) {
      showMessage("❌ Something went wrong. Try again.", "error");
    }

    setUploading(false);
  };

  const handleEdit = (preset) => {
    setForm({
      name: preset.name,
      description: preset.description,
      category: preset.category, // ❌ No price
      image: preset.image || "",
    });
    setEditingId(preset.id);
    setPresetFile(null);
    setImageFile(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this preset?")) return;
    await fetch(`http://localhost:5000/presets/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    setPresets(presets.filter(p => p.id !== id));
    showMessage("🗑️ Preset deleted.");
  };

  const handleCancel = () => {
    setForm(EMPTY_FORM);
    setPresetFile(null);
    setImageFile(null);
    setEditingId(null);
  };

  const changeTab = (tab) => {
    navigate(`/admin?tab=${tab}`);
  };

  // 💡 QUICK STATS WIDGET
  const totalPresets = presets.length;
  const totalDownloads = presets.reduce((sum, p) => sum + (p.downloadCount || 0), 0); // optional — if you track downloads later
  const totalCategories = [...new Set(presets.map(p => p.category))].length;

  return (
    <div className="admin-page">
      <h1>👑 Admin Dashboard</h1>
      <p className="admin-subtitle">Manage presets, users, analytics & messages</p>

      {/* ── Quick Stats Widget ── */}
      {showPresetManager && (
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem",
          marginBottom: "2rem", padding: "1.5rem", background: "var(--bg3)", borderRadius: "16px", border: "1px solid var(--border)"
        }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--purple-lt)" }}>{totalPresets}</div>
            <div style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Total Presets</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--blue)" }}>{totalCategories}</div>
            <div style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Categories</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--green)" }}>∞</div>
            <div style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Free Downloads</div>
          </div>
        </div>
      )}

      {/* ── Tab Navigation ── */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem", flexWrap: "wrap", borderBottom: "1px solid var(--border)", paddingBottom: "1rem" }}>
        {[
          { key: "presets", label: "🎨 Manage Presets", icon: "🎨" },
          { key: "users", label: "👥 View All Users", icon: "👥" },
          { key: "analytics", label: "❤️ Most Loved Presets", icon: "❤️" },
          { key: "messages", label: "📩 User Messages", icon: "📩" },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => changeTab(tab.key)}
            style={{
              background: "none",
              border: "none",
              padding: "8px 16px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: activeTab === tab.key ? "700" : "500",
              color: activeTab === tab.key ? "var(--purple-lt)" : "var(--text-muted)",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "0.95rem",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => e.target.style.color = "var(--purple-lt)"}
            onMouseLeave={(e) => {
              if (activeTab !== tab.key) e.target.style.color = "var(--text-muted)";
            }}
          >
            <span>{tab.icon}</span> {tab.label}
          </button>
        ))}
      </div>

      {/* ── Toast ── */}
      {message && (
        <div className={`admin-toast ${message.type}`} style={{ marginBottom: "1.5rem" }}>
          {message.text}
        </div>
      )}

      {/* ── Preset Manager ── */}
      {activeTab === "presets" && (
        <>
          {/* Form */}
          <div className="admin-form-card">
            <h2>{editingId ? "✏️ Edit Preset" : "➕ Add New Preset"}</h2>
            <form className="admin-form" onSubmit={handleSubmit}>
              <input name="name" placeholder="Preset name" value={form.name} onChange={handleChange} required />
              {/* ❌ REMOVED PRICE INPUT */}
              <input name="category" placeholder="Category (e.g. Portrait)" value={form.category} onChange={handleChange} required />
              <input name="image" placeholder="Preview image URL (or upload below)" value={form.image} onChange={handleChange} />
              <input className="admin-form-full" name="description" placeholder="Description" value={form.description} onChange={handleChange} required />

              <div className="admin-upload-zone admin-form-full">
                <label className="admin-upload-label">
                  🖼️ Upload Preview Image
                  <span className="admin-upload-hint">.jpg, .png, .webp — overrides URL above</span>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp"
                    style={{ display: "none" }}
                    onChange={e => setImageFile(e.target.files[0] || null)}
                  />
                </label>
                {imageFile && (
                  <div className="admin-file-chosen">
                    <span>✅ {imageFile.name}</span>
                    <button type="button" className="admin-remove-file" onClick={() => setImageFile(null)}>✕</button>
                  </div>
                )}
              </div>

              <div className="admin-upload-zone admin-form-full">
                <label className="admin-upload-label">
                  📁 Upload Preset File
                  <span className="admin-upload-hint">.xmp · .lrtemplate · .dng · .zip</span>
                  <input
                    type="file"
                    accept=".xmp,.lrtemplate,.dng,.zip"
                    style={{ display: "none" }}
                    onChange={e => setPresetFile(e.target.files[0] || null)}
                  />
                </label>
                {presetFile && (
                  <div className="admin-file-chosen">
                    <span>✅ {presetFile.name}</span>
                    <button type="button" className="admin-remove-file" onClick={() => setPresetFile(null)}>✕</button>
                  </div>
                )}
                {!presetFile && editingId && (
                  <p className="admin-upload-hint" style={{ marginTop: 8 }}>Leave empty to keep the existing file</p>
                )}
              </div>

              <div className="admin-form-actions admin-form-full">
                <button type="submit" className="admin-submit-btn" disabled={uploading}>
                  {uploading ? "Uploading..." : editingId ? "Update Preset" : "Add Preset"}
                </button>
                {editingId && (
                  <button type="button" className="admin-cancel-btn" onClick={handleCancel}>
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Preset List — NO PRICE DISPLAY */}
          <h2 className="admin-list-title">All Presets ({presets.length})</h2>
          <ul className="admin-preset-list">
            {presets.map(p => (
              <li key={p.id} className="admin-preset-item">
                {p.image && (
                  <img src={p.image} alt={p.name} className="admin-preset-img" />
                )}
                <div className="admin-preset-info">
                  <div className="admin-preset-name">{p.name}</div>
                  <div className="admin-preset-meta">
                    {p.category} • Free Download {/* ✅ Replaced price with "Free Download" */}
                    {p.fileType && (
                      <span className="admin-file-badge">{p.fileType}</span>
                    )}
                    {!p.fileType && (
                      <span className="admin-file-badge missing">no file</span>
                    )}
                  </div>
                </div>
                <button className="admin-edit-btn" onClick={() => handleEdit(p)}>Edit</button>
                <button className="admin-delete-btn" onClick={() => handleDelete(p.id)}>Delete</button>
              </li>
            ))}
          </ul>
        </>
      )}

      {activeTab === "users" && (
        <div style={{ textAlign: "center", padding: "4rem 2rem", color: "var(--text-muted)" }}>
          <p>Loading user management...</p>
          <p><Link to="/admin/users" style={{ color: "var(--purple-lt)", textDecoration: "underline" }}>→ Go to Users Page</Link></p>
        </div>
      )}

      {activeTab === "analytics" && (
        <div style={{ textAlign: "center", padding: "4rem 2rem", color: "var(--text-muted)" }}>
          <p>Loading analytics...</p>
          <p><Link to="/admin/analytics" style={{ color: "var(--purple-lt)", textDecoration: "underline" }}>→ Go to Analytics Page</Link></p>
        </div>
      )}

      {activeTab === "messages" && (
        <div style={{ textAlign: "center", padding: "4rem 2rem", color: "var(--text-muted)" }}>
          <p>Loading messages...</p>
          <p><Link to="/admin/messages" style={{ color: "var(--purple-lt)", textDecoration: "underline" }}>→ Go to Messages Page</Link></p>
        </div>
      )}
    </div>
  );
}