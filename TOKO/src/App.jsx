import React from "react";

import {
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import { useAuth } from "./context/AuthContext";

// =========================================================
// USER PAGES
// =========================================================

import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import About from "./pages/About";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";

// =========================================================
// AUTH
// =========================================================

import Login from "./pages/Login";
import Register from "./pages/Register";

// =========================================================
// ADMIN
// =========================================================

import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";


// =========================================================
// USER PROTECTED ROUTE
// =========================================================

function UserProtectedRoute({ children }) {
  const {
    user,
    loading,
  } = useAuth();

  const location = useLocation();

  // -------------------------------------------------------
  // CEK SESSION
  // -------------------------------------------------------

  if (loading) {
    return (
      <div className="auth-loading">
        <div className="auth-loading-content">

          <div className="auth-loading-logo">
            WS
          </div>

          <p>
            Memeriksa sesi login...
          </p>

        </div>
      </div>
    );
  }


  // -------------------------------------------------------
  // BELUM LOGIN
  // -------------------------------------------------------

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location,
        }}
      />
    );
  }


  // -------------------------------------------------------
  // SUDAH LOGIN
  // -------------------------------------------------------

  return children;
}


// =========================================================
// SHOP LAYOUT
// =========================================================

function ShopLayout() {
  const location = useLocation();

  /*
   * Login dan Register adalah halaman AUTH.
   *
   * Pada halaman ini Navbar dan Footer tidak ditampilkan.
   */

  const isAuthPage =
    location.pathname === "/login" ||
    location.pathname === "/register";


  return (
    <>
      {/* ===================================================
          NAVBAR
          Hanya tampil jika bukan Login/Register
      =================================================== */}

      {!isAuthPage && <Navbar />}


      <Routes>

        {/* =================================================
            HOME
        ================================================= */}

        <Route
          path="/home"
          element={
            <UserProtectedRoute>
              <Home />
            </UserProtectedRoute>
          }
        />


        {/* =================================================
            PRODUCTS / SHOP
        ================================================= */}

        <Route
          path="/products"
          element={
            <UserProtectedRoute>
              <Products />
            </UserProtectedRoute>
          }
        />


        {/* =================================================
            PRODUCT DETAIL
        ================================================= */}

        <Route
          path="/products/:id"
          element={
            <UserProtectedRoute>
              <ProductDetail />
            </UserProtectedRoute>
          }
        />


        {/* =================================================
            ABOUT
        ================================================= */}

        <Route
          path="/about"
          element={
            <UserProtectedRoute>
              <About />
            </UserProtectedRoute>
          }
        />


        {/* =================================================
            GALLERY
        ================================================= */}

        <Route
          path="/gallery"
          element={
            <UserProtectedRoute>
              <Gallery />
            </UserProtectedRoute>
          }
        />


        {/* =================================================
            CONTACT
        ================================================= */}

        <Route
          path="/contact"
          element={
            <UserProtectedRoute>
              <Contact />
            </UserProtectedRoute>
          }
        />


        {/* =================================================
            CART
        ================================================= */}

        <Route
          path="/cart"
          element={
            <UserProtectedRoute>
              <Cart />
            </UserProtectedRoute>
          }
        />


        {/* =================================================
            CHECKOUT
        ================================================= */}

        <Route
          path="/checkout"
          element={
            <UserProtectedRoute>
              <Checkout />
            </UserProtectedRoute>
          }
        />


        {/* =================================================
            LOGIN
        ================================================= */}

        <Route
          path="/login"
          element={<Login />}
        />


        {/* =================================================
            REGISTER
        ================================================= */}

        <Route
          path="/register"
          element={<Register />}
        />


        {/* =================================================
            ROOT
        ================================================= */}

        <Route
          path="/"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />


        {/* =================================================
            UNKNOWN PAGE
        ================================================= */}

        <Route
          path="*"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

      </Routes>


      {/* ===================================================
          FOOTER
          Hanya tampil jika bukan Login/Register
      =================================================== */}

      {!isAuthPage && <Footer />}

    </>
  );
}


// =========================================================
// APP
// =========================================================

export default function App() {
  return (
    <Routes>

      {/* ===================================================
          ADMIN LOGIN
      =================================================== */}

      <Route
        path="/admin/login"
        element={
          <AdminLogin />
        }
      />


      {/* ===================================================
          ADMIN DASHBOARD
      =================================================== */}

      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />


      {/* ===================================================
          WEBSITE
      =================================================== */}

      <Route
        path="/*"
        element={
          <ShopLayout />
        }
      />

    </Routes>
  );
}