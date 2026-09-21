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

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  /*
   * ==========================================
   * DETEKSI SECTION SAAT SCROLL
   * ==========================================
   */
  useEffect(() => {
    let ticking = false;

    const updateActiveSection = () => {
      if (ticking) return;

      ticking = true;

      window.requestAnimationFrame(() => {
        const navbar = document.querySelector(".navbar");
        const navbarHeight =
          navbar?.getBoundingClientRect().height || 76;

        /*
         * Garis penentu active section.
         * Section yang sudah melewati posisi ini
         * dianggap sebagai section aktif.
         */
        const triggerPosition =
          window.scrollY +
          navbarHeight +
          window.innerHeight * 0.28;

        let currentSection = "home";

        sectionIds.forEach((id) => {
          const section = document.getElementById(id);

          if (!section) return;

          const sectionTop =
            section.getBoundingClientRect().top +
            window.scrollY;

          if (triggerPosition >= sectionTop) {
            currentSection = id;
          }
        });

        /*
         * Jika sudah sampai bagian paling bawah,
         * pastikan Contact menjadi active.
         */
        const documentHeight =
          document.documentElement.scrollHeight;

        const viewportBottom =
          window.scrollY + window.innerHeight;

        if (
          viewportBottom >=
          documentHeight - 10
        ) {
          if (document.getElementById("contact")) {
            currentSection = "contact";
          }
        }

        setActiveSection((previous) =>
          previous === currentSection
            ? previous
            : currentSection
        );

        ticking = false;
      });
    };

    updateActiveSection();

    window.addEventListener(
      "scroll",
      updateActiveSection,
      { passive: true }
    );

    window.addEventListener(
      "resize",
      updateActiveSection
    );

    return () => {
      window.removeEventListener(
        "scroll",
        updateActiveSection
      );

      window.removeEventListener(
        "resize",
        updateActiveSection
      );
    };
  }, []);

  /*
   * ==========================================
   * MOBILE MENU
   * ==========================================
   */
  useEffect(() => {
    document.body.classList.toggle(
      "nav-open",
      menuOpen
    );

    return () => {
      document.body.classList.remove(
        "nav-open"
      );
    };
  }, [menuOpen]);

  /*
   * ==========================================
   * ESCAPE
   * ==========================================
   */
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, []);

  /*
   * ==========================================
   * NAVIGATION
   * ==========================================
   */
  const handleNavigation = (
    event,
    href
  ) => {
    event.preventDefault();

    const sectionId =
      href.substring(1);

    const target =
      document.getElementById(
        sectionId
      );

    if (!target) {
      console.warn(
        `Section dengan ID "${sectionId}" tidak ditemukan.`
      );
      return;
    }

    const navbar =
      document.querySelector(
        ".navbar"
      );

    const navbarHeight =
      navbar?.getBoundingClientRect()
        .height || 76;

    const targetPosition =
      target.getBoundingClientRect().top +
      window.scrollY -
      navbarHeight;

    /*
     * Langsung aktifkan menu yang diklik.
     */
    setActiveSection(sectionId);

    setMenuOpen(false);

    window.history.replaceState(
      null,
      "",
      href
    );

    window.scrollTo({
      top: Math.max(
        0,
        targetPosition
      ),
      behavior: "smooth",
    });
  };

  /*
   * ==========================================
   * HOME / LOGO
   * ==========================================
   */
  const handleHomeNavigation = (
    event
  ) => {
    event.preventDefault();

    setActiveSection("home");
    setMenuOpen(false);

    window.history.replaceState(
      null,
      "",
      "#home"
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">

        {/* =========================
            LOGO
        ========================= */}
        <a
          href="#home"
          className="navbar-logo"
          onClick={
            handleHomeNavigation
          }
          aria-label="Warih Seto Samudra - Beranda"
        >
          WSS<span>.</span>
        </a>

        {/* =========================
            NAVIGATION
        ========================= */}
        <nav
          className={`navbar-links ${
            menuOpen ? "open" : ""
          }`}
          id="main-navigation"
          aria-label="Navigasi utama"
        >
          {links.map((link) => {
            const sectionId =
              link.href.substring(1);

            const isActive =
              activeSection ===
              sectionId;

            return (
              <a
                key={link.href}
                href={link.href}
                className={
                  isActive
                    ? "active"
                    : ""
                }
                onClick={(event) =>
                  handleNavigation(
                    event,
                    link.href
                  )
                }
                aria-current={
                  isActive
                    ? "page"
                    : undefined
                }
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* =========================
            STATUS
        ========================= */}
        <div
          className="navbar-status"
          aria-hidden="true"
        >
          <span />
          <span>
            PORTFOLIO 2026
          </span>
        </div>

        {/* =========================
            MOBILE TOGGLE
        ========================= */}
        <button
          className={`navbar-toggle ${
            menuOpen
              ? "active"
              : ""
          }`}
          type="button"
          aria-label={
            menuOpen
              ? "Tutup navigasi"
              : "Buka navigasi"
          }
          aria-expanded={
            menuOpen
          }
          aria-controls="main-navigation"
          onClick={() =>
            setMenuOpen(
              (previous) =>
                !previous
            )
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