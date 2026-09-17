import { ArrowDown, ArrowUpRight, Mail } from "lucide-react";

function Hero() {
  return (
    <section className="hero" id="home">
      {/* ==============================
          TOP LABEL
      ============================== */}
      <div className="hero-top">
        <span>Portfolio / 2026</span>
        <span>WARIH SETO SAMUDRA / RPL</span>
      </div>

      {/* ==============================
          MAIN CONTENT
      ============================== */}
      <div className="hero-content">
        {/* LEFT */}
        <div className="hero-title">
          <p className="eyebrow">REKAYASA PERANGKAT LUNAK / PROFILE</p>

          <h1>
            Warih
            <br />
            <em>Seto</em>
            <br />
            Samudra.
          </h1>

          <p className="hero-intro">
            Siswa SMK Negeri 1 Jenangan dari Jurusan Rekayasa Perangkat Lunak
            yang memiliki minat pada pengembangan perangkat lunak,
            pemrograman, basis data, dan teknologi informasi.
          </p>
        </div>

        {/* RIGHT / PHOTO */}
        <div className="hero-photo">
          <div className="photo-frame">
            <img
              src="/profile.png"
              alt="Warih Seto Samudra"
            />
          </div>

          <p>
            Portrait / Warih Seto Samudra
            <br />
            XII RPL / PKL — PT INKA (Persero)
          </p>
        </div>
      </div>

      {/* ==============================
          BOTTOM INFORMATION
      ============================== */}
      <div className="hero-bottom">
        <div>
          <span>Based in</span>
          <strong>Pulung, Ponorogo</strong>
          <span>Jawa Timur, Indonesia</span>
        </div>

        <div>
          <span>Education</span>
          <strong>SMK Negeri 1 Jenangan</strong>
          <span>Rekayasa Perangkat Lunak</span>
        </div>

        <a className="scroll-down" href="#about">
          <span>Scroll to explore</span>
          <ArrowDown size={15} strokeWidth={1.4} />
        </a>

        <a className="hero-project-link" href="#project">
          <span>View projects</span>
          <ArrowUpRight size={15} strokeWidth={1.4} />
        </a>
      </div>
    </section>
  );
}

export default Hero;