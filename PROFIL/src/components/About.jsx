import { motion } from "framer-motion";

function About() {
  return (
    <section className="editorial-section light" id="about">
      <div className="section-number">01</div>

      <div className="section-heading">
        <p>ABOUT ME</p>
        <h2>
          Tentang
          <br />
          <em>Saya.</em>
        </h2>
      </div>

      <motion.div
        className="about-content"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <p className="large-text">
          Saya merupakan siswa kelas XII jurusan <strong>Rekayasa Perangkat
          Lunak (RPL)</strong> di <strong>SMKN 1 Jenangan.</strong>
        </p>

        <p>
          Sebagai siswa RPL, saya mempelajari pemrograman, pengembangan
          website, database, UI/UX, pengolahan data, dan pengembangan aplikasi.
        </p>

        <p>
          Melalui kegiatan Praktik Kerja Lapangan (PKL) di{" "}
          <strong>PT INKA (Persero)</strong>, saya mendapatkan kesempatan untuk
          menerapkan kemampuan tersebut dalam lingkungan kerja dan industri
          secara langsung.
        </p>
      </motion.div>
    </section>
  );
}

export default About;
