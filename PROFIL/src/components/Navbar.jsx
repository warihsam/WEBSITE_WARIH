import { useState } from "react";
import { Menu, X } from "lucide-react";

function Navbar() {
  const [open, setOpen] = useState(false);

  const links = [
    ["01", "Tentang", "#about"],
    ["02", "Project", "#project"],
    ["03", "Teknologi", "#technology"],
    ["04", "Hasil", "#result"],
    ["05", "Kontak", "#contact"],
  ];

  return (
    <header className="navbar">
      <a href="#home" className="nav-logo">
        WS<span>.</span>
      </a>

      <button
        className="mobile-menu"
        onClick={() => setOpen(!open)}
        aria-label="Menu"
      >
        {open ? <X /> : <Menu />}
      </button>

      <nav className={open ? "nav-links open" : "nav-links"}>
        {links.map(([number, label, href]) => (
          <a
            key={number}
            href={href}
            onClick={() => setOpen(false)}
          >
            <span>{number}</span>
            {label}
          </a>
        ))}
      </nav>

      <div className="nav-status">
        <span></span>
        AVAILABLE
      </div>
    </header>
  );
}

export default Navbar;