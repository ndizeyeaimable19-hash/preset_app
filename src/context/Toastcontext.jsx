// src/context/ToastContext.jsx
import { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext({
  showToast: () => {}, // ✅ safe fallback so app never crashes
});

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* ── Toast container ── */}
      <div style={{
        position: "fixed",
        bottom: "2rem",
        right: "2rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.6rem",
        zIndex: 9999,
        pointerEvents: "none",
      }}>
        {toasts.map(toast => (
          <div
            key={toast.id}
            onClick={() => removeToast(toast.id)}
            style={{
              pointerEvents: "all",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "12px 18px",
              borderRadius: "14px",
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 600,
              fontSize: "0.9rem",
              cursor: "pointer",
              boxShadow: "0 8px 30px rgba(0,0,0,0.5)",
              animation: "toastIn 0.3s ease both",
              backdropFilter: "blur(10px)",
              maxWidth: "320px",
              ...(toast.type === "success" && {
                background: "rgba(16,185,129,0.15)",
                border: "1px solid rgba(16,185,129,0.35)",
                color: "#10b981",
              }),
              ...(toast.type === "error" && {
                background: "rgba(248,113,113,0.15)",
                border: "1px solid rgba(248,113,113,0.35)",
                color: "#f87171",
              }),
              ...(toast.type === "info" && {
                background: "rgba(192,38,211,0.15)",
                border: "1px solid rgba(192,38,211,0.35)",
                color: "#e879f9",
              }),
              ...(toast.type === "warning" && {
                background: "rgba(245,158,11,0.15)",
                border: "1px solid rgba(245,158,11,0.35)",
                color: "#f59e0b",
              }),
            }}
          >
            <span style={{ fontSize: "1.1rem" }}>
              {toast.type === "success" && "✅"}
              {toast.type === "error"   && "❌"}
              {toast.type === "info"    && "💜"}
              {toast.type === "warning" && "⚠️"}
            </span>
            {toast.message}
          </div>
        ))}
      </div>

      <style>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translateY(12px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);