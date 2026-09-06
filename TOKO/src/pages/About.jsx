import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function About() {
  return (
    <main className="page">
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">ABOUT / 08</p>
          <h1>WEAR YOUR<br /><em>IDENTITY.</em></h1>
        </div>
      </section>
      <section className="section">
        <div className="container about-grid">
          <div><p className="eyebrow">OUR STORY</p></div>
          <div>
            <h2>WS FASHION hadir untuk membuat fashion sehari-hari terasa lebih sederhana.</h2>
            <p>Kami percaya pakaian yang baik tidak harus berlebihan. Kami memilih siluet modern, warna mudah dipadukan, dan detail yang membuat setiap outfit tetap punya karakter.</p>
            <p>Mulai dari essential tees hingga outerwear, setiap koleksi dibuat untuk menemani aktivitas sehari-hari.</p>
            <Link className="text-link" to="/products">Explore collection <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>
      <section className="statement small">
        <div className="container statement-inner">
          <p className="eyebrow">OUR PHILOSOPHY</p>
          <h2>Less noise.<br /><em>More style.</em></h2>
        </div>
      </section>
    </main>
  );
}
