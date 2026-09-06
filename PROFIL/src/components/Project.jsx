import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

function Project() {
  return (
    <section className="project-section" id="project">
      <div className="project-header">
        <div>
          <span className="section-label">03 — PROJECT IDEA</span>
          <h2>
            BIKE
            <br />
            <em>DASHBOARD</em>
          </h2>
        </div>

        <p>
          Sistem dashboard untuk mengelola data
          sepeda dan komponen secara terstruktur.
        </p>
      </div>

      <motion.div
        className="project-image"
        initial={{ opacity: 0, scale: 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
      >
        <img
          src="/bike-dashboard.jpg"
          alt="Bike Dashboard"
        />

        <div className="image-label">
          BIKE DATABASE / DASHBOARD
        </div>
      </motion.div>

      <div className="project-description">
        <div>
          <span>IDE</span>
          <h3>
            Membuat sistem yang
            mempermudah pengelolaan
            data sepeda.
          </h3>
        </div>

        <div>
          <span>TUJUAN</span>
          <p>
            Menyediakan dashboard yang dapat
            menampilkan data sepeda, komponen,
            gambar, status, dan informasi lainnya
            secara lebih terorganisir.
          </p>
        </div>
      </div>
    </section>
  );
}

export default Project;