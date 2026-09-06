import { motion } from "framer-motion";

function About() {
  return (
    <section className="editorial-section light" id="about">
      <div className="section-number">01</div>

      <div className="section-heading">
        <p>ABOUT ME</p>
        <h2>Tentang<br />Saya.</h2>
      </div>

      <motion.div
        className="about-content"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <p className="large-text">
          Saya adalah siswa kelas XII jurusan
          Rekayasa Perangkat Lunak di
          <strong> SMKN 1 Jenangan.</strong>
        </p>

        <p>
          Saya memiliki ketertarikan pada pengembangan
          website, antarmuka pengguna, pengolahan data,
          serta pembuatan sistem yang dapat membantu
          menyelesaikan kebutuhan di dunia kerja.
        </p>

        <p>
          Melalui kegiatan Praktik Kerja Lapangan di
          PT INKA (Persero), saya mendapatkan pengalaman
          untuk menerapkan kemampuan pemrograman dalam
          sebuah project nyata.
        </p>
      </motion.div>
    </section>
  );
}

export default About;