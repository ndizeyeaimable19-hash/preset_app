// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Presets from "./pages/Presets";
import PresetDetails from "./pages/PresetDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
// ❌ REMOVED: import { CartProvider } from "./context/CartContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import { ToastProvider } from "./context/ToastContext";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import Favorites from "./pages/Favorites";
import MyDownloads from "./pages/MyDownloads";
import Contact from "./pages/Contact";
import AdminUsers from "./pages/AdminUsers";
import AdminAnalytics from "./pages/AdminAnalytics";
import AdminMessages from "./pages/AdminMessages";
import "./styles/App.css";

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        {/* 🚫 NO CartProvider here */}
        <FavoritesProvider>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/presets" element={<Presets />} />
            <Route path="/presets/:id" element={<PresetDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected routes */}
            <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/my-downloads" element={<ProtectedRoute><MyDownloads /></ProtectedRoute>} />
            <Route path="/contact" element={<ProtectedRoute><Contact /></ProtectedRoute>} />

            {/* Admin routes */}
            <Route path="/admin" element={<ProtectedRoute adminOnly><Admin /></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute adminOnly><AdminUsers /></ProtectedRoute>} />
            <Route path="/admin/analytics" element={<ProtectedRoute adminOnly><AdminAnalytics /></ProtectedRoute>} />
            <Route path="/admin/messages" element={<ProtectedRoute adminOnly><AdminMessages /></ProtectedRoute>} />
          </Routes>
        </FavoritesProvider>
        {/* 🚫 NO closing CartProvider */}
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;