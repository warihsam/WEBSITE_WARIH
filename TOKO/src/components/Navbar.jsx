import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, ShoppingBag, X, ClipboardList, LogOut } from "lucide-react";
import { useState } from "react";

import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { count } = useCart();
  const { user, profile, logout } = useAuth();

  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const links = [
    ["Home", "/home"],
    ["Shop", "/products"],
    ["About", "/about"],
    ["Gallery", "/gallery"],
    ["Contact", "/contact"],
  ];

  const handleLogout = async () => {
    setOpen(false);

    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("LOGOUT ERROR:", error);
    }
  };

  return (
    <header className="navbar">
      <div className="container nav-inner">

        {/* LOGO */}
        <Link
          className="brand"
          to="/home"
          onClick={() => setOpen(false)}
        >
          WS<span>FASHION</span>
        </Link>

        {/* NAVIGATION */}
        <nav className={`nav-links ${open ? "open" : ""}`}>

          {links.map(([label, href]) => (
            <NavLink
              key={href}
              to={href}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                isActive ? "active" : ""
              }
            >
              {label}
            </NavLink>
          ))}

          {/* PESANAN */}
          <NavLink
            to="/orders"
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `nav-order-link ${isActive ? "active" : ""}`
            }
          >
            <ClipboardList size={17} />
            <span>Pesanan</span>
          </NavLink>

          {/* MOBILE LOGOUT */}
          <button
            className="mobile-logout"
            onClick={handleLogout}
          >
            <LogOut size={17} />
            Keluar
          </button>

        </nav>

        {/* RIGHT ACTIONS */}
        <div className="nav-actions">


          {/* CART */}
          <button
            className="icon-button cart-button"
            onClick={() => navigate("/cart")}
            aria-label="Keranjang"
            title="Keranjang"
          >
            <ShoppingBag size={20} />

            {count > 0 && (
              <span>{count}</span>
            )}
          </button>

          {/* USER */}
          <div className="nav-user">
            <div className="nav-user-info">
              <strong>
                {user?.email || "User"}
              </strong>
            </div>

            
          </div>

          {/* MOBILE MENU */}
          <button
            className="mobile-menu"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X /> : <Menu />}
          </button>

        </div>
      </div>
    </header>
  );
}