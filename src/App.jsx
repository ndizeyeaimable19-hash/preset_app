// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Presets from "./pages/Presets";
import PresetDetails from "./pages/PresetDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import Admin from "./pages/Admin";
import Favorites from "./pages/Favorites";
import Profile from "./pages/Profile";
import { FavoritesProvider } from "./context/FavoritesContext";
import { CartProvider } from "./context/CartContext";
import { ToastProvider } from "./context/ToastContext";
import "./styles/App.css";

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <CartProvider>
          <FavoritesProvider>
            <Navbar />
            <Routes>
              {/* ── Public routes ── */}
              <Route path="/"            element={<Home />} />
              <Route path="/presets"     element={<Presets />} />
              <Route path="/presets/:id" element={<PresetDetails />} />
              <Route path="/login"       element={<Login />} />
              <Route path="/register"    element={<Register />} />

              {/* ── Protected routes ── */}
              <Route path="/cart" element={
                <ProtectedRoute><Cart /></ProtectedRoute>
              } />
              <Route path="/favorites" element={
                <ProtectedRoute><Favorites /></ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute><Profile /></ProtectedRoute>
              } />

              {/* ── Admin only ── */}
              <Route path="/admin" element={
                <ProtectedRoute adminOnly><Admin /></ProtectedRoute>
              } />
            </Routes>
          </FavoritesProvider>
        </CartProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;