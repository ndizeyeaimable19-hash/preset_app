// src/pages/AdminMessages.jsx
import { useEffect, useState } from "react";
import "../styles/Admin.css";

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/admin/messages", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setMessages(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        alert("Failed to load messages");
      }
    };
    fetchMessages();
  }, []);

  const markAsRead = async (messageId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/admin/messages/${messageId}/read`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setMessages(prev => prev.map(m => m._id === messageId ? { ...m, isRead: true } : m));
      }
    } catch (err) {
      console.error(err);
      alert("Failed to mark as read");
    }
  };

  const deleteMessage = async (messageId) => {
    if (!confirm("Delete this message?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/admin/messages/${messageId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setMessages(prev => prev.filter(m => m._id !== messageId));
      }
    } catch (err) {
      console.error(err);
      alert("Failed to delete message");
    }
  };

  if (loading) return <div className="admin-container">Loading messages...</div>;

  return (
    <div className="admin-container">
      <h1>📩 Messages from Users</h1>
      {messages.length === 0 ? (
        <p>No messages yet.</p>
      ) : (
        <div className="messages-list">
          {messages.map(msg => (
            <div key={msg._id} className={`message-card ${msg.isRead ? '' : 'unread'}`}>
              <div className="message-header">
                <span className="user-email">{msg.user?.email || 'Unknown User'}</span>
                <span className="message-date">
                  {new Date(msg.createdAt).toLocaleString()}
                </span>
              </div>
              <h4>{msg.subject}</h4>
              <p className="message-body">{msg.body}</p>
              <div className="message-actions">
                {!msg.isRead && (
                  <button onClick={() => markAsRead(msg._id)} className="btn-mark-read">
                    Mark as Read
                  </button>
                )}
                <button onClick={() => deleteMessage(msg._id)} className="btn-delete-small">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}