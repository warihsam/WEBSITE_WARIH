import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, ShoppingBag, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { count } = useCart();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const links = [
    ["Home", "/"],
    ["Shop", "/products"],
    ["About", "/about"],
    ["Gallery", "/gallery"],
    ["Contact", "/contact"],
  ];

  return (
    <header className="navbar">
      <div className="container nav-inner">
        <Link className="brand" to="/" onClick={() => setOpen(false)}>
          WS<span>FASHION</span>
        </Link>

        <nav className={`nav-links ${open ? "open" : ""}`}>
          {links.map(([label, href]) => (
            <NavLink key={href} to={href} onClick={() => setOpen(false)}>
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="nav-actions">
          <button className="icon-button cart-button" onClick={() => navigate("/cart")} aria-label="Keranjang">
            <ShoppingBag size={20} />
            {count > 0 && <span>{count}</span>}
          </button>
          <button className="mobile-menu" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
    </header>
  );
}
