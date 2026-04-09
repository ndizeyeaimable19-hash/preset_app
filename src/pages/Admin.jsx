// src/pages/Admin.jsx
import { useState, useEffect } from "react";
import "../styles/Admin.css";

const getToken = () => localStorage.getItem("token");

const EMPTY_FORM = { name: "", description: "", price: "", category: "", image: "" };

export default function Admin() {
  const [presets, setPresets] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [presetFile, setPresetFile] = useState(null); // .xmp/.zip etc
  const [imageFile, setImageFile] = useState(null);   // preview image
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/presets")
      .then(res => res.json())
      .then(data => setPresets(data));
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const showMessage = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    // Use FormData so we can send files + fields together
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("price", form.price);
    formData.append("category", form.category);

    // image: file upload takes priority over URL
    if (imageFile) {
      formData.append("image", imageFile);
    } else if (form.image) {
      formData.append("image", form.image); // fallback to URL
    }

    if (presetFile) {
      formData.append("presetFile", presetFile);
    }

    try {
      if (editingId) {
        // ── PATCH ──
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
        // ── POST ──
        const res = await fetch("http://localhost:5000/presets", {
          method: "POST",
          headers: { Authorization: `Bearer ${getToken()}` },
          body: formData,
        });
        const newPreset = await res.json();
        setPresets([...presets, newPreset]);
        showMessage("✅ Preset added successfully!");
      }

      // Reset
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
      price: preset.price,
      category: preset.category,
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

  return (
    <div className="admin-page">
      <h1>Admin Panel</h1>
      <p className="admin-subtitle">Manage your preset listings</p>

      {/* ── Toast message ── */}
      {message && (
        <div className={`admin-toast ${message.type}`}>
          {message.text}
        </div>
      )}

      {/* ── Form ── */}
      <div className="admin-form-card">
        <h2>{editingId ? "✏️ Edit Preset" : "➕ Add New Preset"}</h2>

        <form className="admin-form" onSubmit={handleSubmit}>
          {/* Text fields */}
          <input name="name" placeholder="Preset name" value={form.name} onChange={handleChange} required />
          <input name="price" placeholder="Price ($)" type="number" min="0" value={form.price} onChange={handleChange} required />
          <input name="category" placeholder="Category (e.g. Portrait)" value={form.category} onChange={handleChange} required />
          <input name="image" placeholder="Preview image URL (or upload below)" value={form.image} onChange={handleChange} />
          <input className="admin-form-full" name="description" placeholder="Description" value={form.description} onChange={handleChange} required />

          {/* Image file upload */}
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

          {/* Preset file upload */}
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

          {/* Actions */}
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

      {/* ── Preset List ── */}
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
                ${p.price} · {p.category}
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
    </div>
  );
}