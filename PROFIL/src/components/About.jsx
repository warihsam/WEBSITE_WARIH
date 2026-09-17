
import { motion } from "framer-motion";
import {
  Code2,
  Database,
  GraduationCap,
  Building2,
  Bike,
  Wrench,
  Lightbulb,
} from "lucide-react";

function About() {
  return (
    <section
      className="editorial-section light"
      id="about"
    >
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
        transition={{
          duration: 0.7,
          ease: "easeOut",
        }}
      >
        <p className="large-text">
          Saya adalah{" "}
          <strong>Warih Seto Samudra</strong>, siswa kelas
          XII jurusan{" "}
          <strong>Rekayasa Perangkat Lunak (RPL)</strong>{" "}
          di <strong>SMKN 1 Jenangan.</strong>
        </p>

        <p>
          Saya memiliki ketertarikan pada dunia teknologi
          informasi, khususnya pengembangan website,
          pemrograman, database, dan desain antarmuka
          pengguna. Saya senang mempelajari hal-hal baru
          dan mengembangkan ide menjadi sebuah karya
          digital yang bermanfaat.
        </p>

        <p>
          Selama menempuh pendidikan, saya mempelajari
          berbagai konsep pengembangan aplikasi, mulai
          dari pembuatan antarmuka, pengelolaan data,
          integrasi database, hingga pengembangan sistem
          berbasis web menggunakan teknologi modern.
        </p>

        <p>
          Melalui kegiatan{" "}
          <strong>Praktik Kerja Lapangan (PKL)</strong> di{" "}
          <strong>PT INKA (Persero)</strong>, saya memperoleh
          pengalaman untuk menerapkan pengetahuan yang
          dipelajari di sekolah dalam lingkungan kerja
          dan industri secara langsung.
        </p>

        <p>
          Salah satu project yang saya kembangkan adalah
          <strong> Bike Dashboard</strong>, yaitu dashboard
          interaktif untuk menyajikan informasi komponen
          sepeda secara visual. Project ini membantu saya
          mengembangkan kemampuan dalam pemrograman,
          pengelolaan data, dan pembuatan antarmuka
          interaktif.
        </p>

        <p>
          Selain bidang teknologi, saya juga memiliki
          ketertarikan terhadap{" "}
          <strong>otomotif, khususnya sepeda motor.</strong>{" "}
          Saya menyukai kegiatan memodifikasi sepeda motor,
          mempelajari komponen kendaraan, serta memahami
          bagaimana perubahan pada bagian tertentu dapat
          memengaruhi tampilan dan performa motor.
        </p>

        <p>
          Bagi saya, pemrograman dan otomotif memiliki
          kesamaan, yaitu membutuhkan kreativitas,
          ketelitian, kemampuan memecahkan masalah, dan
          kemauan untuk terus belajar. Saya ingin terus
          mengembangkan kemampuan tersebut sebagai bekal
          untuk memasuki dunia kerja dan membangun masa
          depan di bidang teknologi maupun industri.
        </p>
      </motion.div>

      <motion.div
        className="about-highlights"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{
          duration: 0.7,
          delay: 0.15,
          ease: "easeOut",
        }}
      >
        
      </motion.div>
    </section>
  );
}

export default About;