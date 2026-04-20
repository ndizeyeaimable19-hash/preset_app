// src/pages/AdminUsers.jsx
import { useEffect, useState } from "react";
import "../styles/Admin.css";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setUsers(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        alert("Failed to load users");
      }
    };
    fetchUsers();
  }, []);

  const toggleAdmin = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/admin/users/${userId}/toggle-admin`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setUsers(prev => prev.map(u => u._id === userId ? { ...u, isAdmin: !u.isAdmin } : u));
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update user");
    }
  };

  const deleteUser = async (userId) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/admin/users/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setUsers(prev => prev.filter(u => u._id !== userId));
      }
    } catch (err) {
      console.error(err);
      alert("Failed to delete user");
    }
  };

  if (loading) return <div className="admin-container">Loading users...</div>;

  return (
    <div className="admin-container">
      <h1>👥 All Users</h1>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Email</th>
            <th>Joined</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td>{user.email}</td>
              <td>{new Date(user.createdAt).toLocaleDateString()}</td>
              <td>
                <span className={`badge ${user.isAdmin ? 'badge-purple' : 'badge-gray'}`}>
                  {user.isAdmin ? 'Admin' : 'User'}
                </span>
              </td>
              <td>
                <button onClick={() => toggleAdmin(user._id)} className="btn-toggle">
                  {user.isAdmin ? 'Demote' : 'Make Admin'}
                </button>
                <button onClick={() => deleteUser(user._id)} className="btn-delete">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}