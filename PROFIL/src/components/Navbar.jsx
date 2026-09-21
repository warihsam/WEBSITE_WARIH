
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

  // =========================================================
  // ACTIVE SECTION OBSERVER
  // =========================================================

  useEffect(() => {
    const sectionIds = [
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
    ];

    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (sections.length === 0) return undefined;

    const navbar = document.querySelector(".navbar");
    const navbarHeight = navbar?.offsetHeight || 76;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSections = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              b.intersectionRatio - a.intersectionRatio
          );

        if (visibleSections.length > 0) {
          setActiveSection(visibleSections[0].target.id);
        }
      },
      {
        root: null,
        rootMargin: `-${navbarHeight}px 0px -45% 0px`,
        threshold: [0.1, 0.25, 0.5, 0.75],
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  // =========================================================
  // BODY SCROLL LOCK MOBILE
  // =========================================================

  useEffect(() => {
    document.body.classList.toggle("nav-open", menuOpen);

    return () => {
      document.body.classList.remove("nav-open");
    };
  }, [menuOpen]);

  // =========================================================
  // ESCAPE KEY
  // =========================================================

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // =========================================================
  // SCROLL TO SECTION
  // =========================================================

  const handleNavigation = (event, href) => {
    event.preventDefault();

    const sectionId = href.substring(1);
    const target = document.getElementById(sectionId);

    if (!target) {
      console.warn(
        `Section dengan ID "${sectionId}" tidak ditemukan.`
      );
      setMenuOpen(false);
      return;
    }

    const navbar = document.querySelector(".navbar");
    const navbarHeight = navbar?.getBoundingClientRect().height || 0;

    // Posisi section terhadap dokumen
    const targetPosition =
      target.getBoundingClientRect().top +
      window.scrollY -
      navbarHeight;

    // Scroll langsung ke section dengan offset navbar
    window.scrollTo({
      top: Math.max(0, targetPosition),
      behavior: "smooth",
    });

    // Update URL tanpa reload halaman
    window.history.replaceState(null, "", href);

    // Update active menu langsung
    setActiveSection(sectionId);

    // Tutup menu mobile
    setMenuOpen(false);
  };

  // =========================================================
  // HOME NAVIGATION
  // =========================================================

  const handleHomeNavigation = (event) => {
    event.preventDefault();

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    window.history.replaceState(null, "", "#home");

    setActiveSection("home");
    setMenuOpen(false);
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <header className="navbar">
      <div className="navbar-inner">
        {/* LOGO */}
        <a
          href="#home"
          className="navbar-logo"
          onClick={handleHomeNavigation}
          aria-label="Warih Seto Samudra - Beranda"
        >
          WSS<span>.</span>
        </a>

        {/* NAVIGATION */}
        <nav
          className={`navbar-links ${
            menuOpen ? "open" : ""
          }`}
          id="main-navigation"
          aria-label="Navigasi utama"
        >
          {links.map((link) => {
            const sectionId = link.href.substring(1);
            const isActive = activeSection === sectionId;

            return (
              <a
                key={link.href}
                href={link.href}
                className={isActive ? "active" : ""}
                onClick={(event) =>
                  handleNavigation(event, link.href)
                }
                aria-current={isActive ? "page" : undefined}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* STATUS */}
        <div
          className="navbar-status"
          aria-hidden="true"
        >
          <span />
          <span>PORTFOLIO 2026</span>
        </div>

        {/* MOBILE TOGGLE */}
        <button
          className={`navbar-toggle ${
            menuOpen ? "active" : ""
          }`}
          type="button"
          aria-label={
            menuOpen
              ? "Tutup navigasi"
              : "Buka navigasi"
          }
          aria-expanded={menuOpen}
          aria-controls="main-navigation"
          onClick={() =>
            setMenuOpen((prev) => !prev)
          }
        >
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}

export default Navbar;