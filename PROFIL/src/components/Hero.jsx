import { motion } from "framer-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";

function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-top">
        <span>PORTFOLIO — 2026</span>
        <span>JUNIOR WEB DEVELOPER</span>
      </div>

      <div className="hero-content">
        <motion.div
          className="hero-title"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="eyebrow">HELLO, I'M</p>

          <h1>
            WARIH
            <br />
            <em>SETO</em>
            <br />
            SAMUDRA
          </h1>
        </motion.div>

        <motion.div
          className="hero-photo"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="photo-frame">
            <img
              src="/profile.jpg"
              alt="Warih Seto Samudra"
            />
          </div>

          <p>
            Pelajar Rekayasa Perangkat Lunak
            <br />
            SMKN 1 Jenangan
          </p>
        </motion.div>
      </div>

      <div className="hero-bottom">
        <div>
          <strong>PKL</strong>
          <span>PT INKA (PERSERO)</span>
        </div>

        <a href="#about" className="scroll-down">
          SCROLL TO EXPLORE
          <ArrowDown size={18} />
        </a>

        <a
          href="#project"
          className="hero-project-link"
        >
          VIEW PROJECT
          <ArrowUpRight size={18} />
        </a>
      </div>
    </section>
  );
}

export default Hero;