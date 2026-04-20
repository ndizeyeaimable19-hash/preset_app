// src/pages/Contact.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/Contact.css";

export default function Contact() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return navigate("/login");

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ subject, body }),
      });

      if (res.ok) {
        setSuccess(true);
        setSubject("");
        setBody("");
      } else {
        alert("Failed to send message");
      }
    } catch (err) {
      console.error(err);
      alert("Error sending message");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="contact-container success">
        <div className="success-icon">✅</div>
        <h2>Message Sent!</h2>
        <p>Thank you — the admin will get back to you soon.</p>
        <button onClick={() => navigate("/")}>Back to Home</button>
      </div>
    );
  }

  return (
    <div className="contact-container">
      <h1>Contact Admin</h1>
      <p>Have a question or feedback? Send a message to the admin team.</p>

      <form onSubmit={handleSubmit} className="contact-form">
        <div className="form-group">
          <label>Subject</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Enter subject"
            required
          />
        </div>

        <div className="form-group">
          <label>Message</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write your message here..."
            rows="6"
            required
          />
        </div>

        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? "Sending..." : "Send Message"}
        </button>
      </form>
    </div>
  );
}