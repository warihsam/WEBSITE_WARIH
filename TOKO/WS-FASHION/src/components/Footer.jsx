import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <div className="footer-brand">WS FASHION</div>
          <p>Style Your Day.</p>
          <p className="muted">Modern essentials untuk gaya sehari-hari.</p>
        </div>
        <div>
          <h4>Explore</h4>
          <Link to="/products">Shop</Link>
          <Link to="/about">About</Link>
          <Link to="/gallery">Gallery</Link>
        </div>
        <div>
          <h4>Help</h4>
          <Link to="/contact">Contact</Link>
          <Link to="/cart">Cart</Link>
          <a href="/admin/login">Admin <ArrowUpRight size={14} /></a>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} WS FASHION.</span>
        <span>Style Your Day.</span>
      </div>
    </footer>
  );
}
