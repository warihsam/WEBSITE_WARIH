import {
  Link,
  NavLink,
  useNavigate,
} from "react-router-dom";

import {
  Menu,
  ShoppingBag,
  X,
  LogOut,
  User,
} from "lucide-react";

import { useState } from "react";

import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";


export default function Navbar() {
  // =========================================================
  // CART
  // =========================================================

  const { count } = useCart();


  // =========================================================
  // AUTH
  // =========================================================

  const {
    user,
    profile,
    logout,
  } = useAuth();


  // =========================================================
  // STATE
  // =========================================================

  const [open, setOpen] =
    useState(false);

  const [loggingOut, setLoggingOut] =
    useState(false);


  // =========================================================
  // NAVIGATION
  // =========================================================

  const navigate =
    useNavigate();


  // =========================================================
  // NAVIGATION LINKS
  // =========================================================

  const links = [
    ["Home", "/home"],
    ["Shop", "/products"],
    ["About", "/about"],
    ["Gallery", "/gallery"],
    ["Contact", "/contact"],
  ];


  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = async () => {
    if (loggingOut) {
      return;
    }

    try {
      setLoggingOut(true);

      setOpen(false);

      const result =
        await logout();

      if (!result?.success) {
        console.error(
          "LOGOUT FAILED:",
          result?.error
        );

        alert(
          result?.error ||
            "Logout gagal. Silakan coba lagi."
        );

        return;
      }

      // -----------------------------------------------------
      // Berhasil logout
      // -----------------------------------------------------

      navigate("/login", {
        replace: true,
      });

    } catch (error) {
      console.error(
        "LOGOUT ERROR:",
        error
      );

      alert(
        error?.message ||
          "Terjadi kesalahan saat logout."
      );

    } finally {
      setLoggingOut(false);
    }
  };


  // =========================================================
  // USER NAME
  // =========================================================

  const userName =
    profile?.full_name ||
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "User";


  return (
    <header className="navbar">

      <div className="container nav-inner">


        {/* ===================================================
            BRAND
        =================================================== */}

        <Link
          className="brand"
          to="/home"
          onClick={() =>
            setOpen(false)
          }
        >
          WS
          <span>
            FASHION
          </span>
        </Link>


        {/* ===================================================
            NAVIGATION
        =================================================== */}

        <nav
          className={`nav-links ${
            open ? "open" : ""
          }`}
        >

          {links.map(
            ([label, href]) => (
              <NavLink
                key={href}
                to={href}
                onClick={() =>
                  setOpen(false)
                }
              >
                {label}
              </NavLink>
            )
          )}

        </nav>


        {/* ===================================================
            ACTIONS
        =================================================== */}

        <div className="nav-actions">


          {/* =================================================
              USER
          ================================================= */}

          <div className="nav-user">

            <User size={17} />

            <span>
              {userName}
            </span>

          </div>


          {/* =================================================
              CART
          ================================================= */}

          <button
            className="icon-button cart-button"
            onClick={() => {
              setOpen(false);

              navigate("/cart");
            }}
            aria-label="Keranjang"
          >

            <ShoppingBag
              size={20}
            />

            {count > 0 && (
              <span>
                {count}
              </span>
            )}

          </button>


          {/* =================================================
              LOGOUT
          ================================================= */}

          <button
            className="logout-button"
            onClick={handleLogout}
            disabled={loggingOut}
            title="Logout"
          >

            <LogOut
              size={18}
            />

            <span>
              {loggingOut
                ? "Keluar..."
                : "Logout"}
            </span>

          </button>


          {/* =================================================
              MOBILE MENU
          ================================================= */}

          <button
            className="mobile-menu"
            onClick={() =>
              setOpen(!open)
            }
            aria-label="Menu"
          >

            {open ? (
              <X />
            ) : (
              <Menu />
            )}

          </button>

        </div>

      </div>

    </header>
  );
}