// src/pages/MyDownloads.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/MyDownloads.css";

export default function MyDownloads() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/orders/my", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to load downloads");

        const data = await res.json();
        setOrders(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        alert("Could not load your downloads.");
      }
    };

    fetchOrders();
  }, [user, navigate]);

  if (loading) return <div className="downloads-container">Loading your downloads...</div>;

  return (
    <div className="downloads-container">
      <h1>My Downloads</h1>
      {orders.length === 0 ? (
        <p>You haven't downloaded any presets yet.</p>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
              <ul>
                {order.presets.map((item, idx) => (
                  <li key={idx}>
                    {item.name} × {item.qty} — File type: {item.preset?.fileType || "N/A"}
                  </li>
                ))}
              </ul>
              <p><strong>Total Presets:</strong> {order.presets.reduce((sum, p) => sum + p.qty, 0)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}