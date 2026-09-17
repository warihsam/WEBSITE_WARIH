import { useEffect, useState } from "react";

const links = [
  { label: "About", href: "#about" },
  { label: "Profile", href: "#profile" },
  { label: "Education", href: "#education" },
  { label: "Experience", href: "#experience" },
  { label: "Project", href: "#project" },
  { label: "Skills", href: "#technology" },
  { label: "Activities", href: "#activities" },
  { label: "Certificates", href: "#certificates" },
  { label: "Blog", href: "#blog" },
  { label: "Contact", href: "#contact" },
];

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const sections = [
      "home",
      "about",
      "profile",
      "education",
      "experience",
      "project",
      "technology",
      "learning",
      "activities",
      "certificates",
      "blog",
      "contact",
    ]
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible) {
          setActiveSection(visible.target.id);
        }
      },
      {
        rootMargin: `-${window.innerWidth <= 800 ? 65 : 76}px 0px -55% 0px`,
        threshold: [0.1, 0.25, 0.5, 0.75],
      },
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.classList.toggle("nav-open", menuOpen);

    return () => document.body.classList.remove("nav-open");
  }, [menuOpen]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleClick = () => setMenuOpen(false);

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <a
          href="#home"
          className="navbar-logo"
          onClick={handleClick}
          aria-label="Warih Seto Samudra - Beranda"
        >
          WSS<span>.</span>
        </a>

        <nav
          className={`navbar-links ${menuOpen ? "open" : ""}`}
          id="main-navigation"
          aria-label="Navigasi utama"
        >
          {links.map((link) => {
            const sectionId = link.href.slice(1);

            return (
              <a
                key={link.href}
                href={link.href}
                className={activeSection === sectionId ? "active" : ""}
                onClick={handleClick}
                aria-current={activeSection === sectionId ? "page" : undefined}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        <div className="navbar-status" aria-hidden="true">
          <span />
          <span>PORTFOLIO 2026</span>
        </div>

        <button
          className={`navbar-toggle ${menuOpen ? "active" : ""}`}
          type="button"
          aria-label={menuOpen ? "Tutup navigasi" : "Buka navigasi"}
          aria-expanded={menuOpen}
          aria-controls="main-navigation"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}

export default Navbar;
