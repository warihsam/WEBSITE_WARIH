import { motion } from "framer-motion";

function Result() {
  return (
    <section className="editorial-section dark" id="result">
      <div className="section-number">06</div>

      <div className="section-heading">
        <p>RESULT</p>
        <h2>Hasil<br />Project.</h2>
      </div>

      <motion.div
        className="result-content"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="result-number">
          01
        </div>

        <div>
          <h3>
            Dashboard berhasil
            menampilkan data secara
            terstruktur.
          </h3>

          <p>
            Sistem dapat digunakan untuk
            menampilkan informasi sepeda dan
            komponen melalui tampilan dashboard
            yang lebih mudah dipahami.
          </p>
        </div>
      </motion.div>
    </section>
  );
}

export default Result;