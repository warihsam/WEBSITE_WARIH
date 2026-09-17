import {
  ArrowUpRight,
  Database,
  Search,
  Layers3,
  Image as ImageIcon,
  Moon,
  RefreshCw,
  LayoutDashboard,
} from "lucide-react";

import { motion } from "framer-motion";

const features = [
  { icon: LayoutDashboard, title: "Dashboard", description: "Menampilkan kumpulan unit sepeda." },
  { icon: Search, title: "Search", description: "Membantu menemukan unit berdasarkan informasi yang tersedia." },
  { icon: Layers3, title: "Component Card", description: "Menampilkan komponen yang digunakan oleh setiap unit." },
  { icon: Database, title: "Component Detail", description: "Menampilkan detail komponen yang dipilih." },
  { icon: ImageIcon, title: "GIF Visualization", description: "Menampilkan GIF sebagai visualisasi komponen."},
  { icon: Moon, title: "Theme", description: "Mendukung Light Mode dan Dark Mode." },
  { icon: RefreshCw, title: "Synchronization", description: "Menyiapkan mekanisme pembaruan informasi dari sumber data." },
];

const components = ["MODEL", "FRAME", "FORK", "HANDLEBAR", "SADDLE", "CHAIN", "RIM"];

function Project() {
  return (
    <section className="project-section" id="project">
      <div className="section-number project-number">05</div>

      <div className="project-header">
        <div>
          <span className="section-label">PROJECT / PKL — PT INKA</span>
          <h2>BIKE<br /><em>DASHBOARD.</em></h2>
        </div>
        <p>
          Prototype aplikasi web untuk mengelola dan menampilkan informasi
          sepeda beserta komponen secara terstruktur, visual, dan interaktif.
        </p>
      </div>

      <motion.article
        className="project-featured"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <div className="project-visual">
          <img src="/bike-dashboard.jpg" alt="Tampilan Bike Dashboard" />
          <span className="project-visual-label">BIKE DASHBOARD / PROTOTYPE</span>
        </div>

        <div className="project-featured-content">
          <div className="project-card-top"><span>01</span><span>2026 / PKL</span></div>
          <div className="project-card-meta">WEB INTERACTIVE COMPONENT DASHBOARD</div>
          <h3>Dashboard sebagai Prototype Digitalisasi Informasi Komponen.</h3>
          <p className="project-card-description">
            Bike Dashboard dibuat untuk mengelola dan menampilkan informasi
            unit sepeda dan komponen. Pengguna dapat memilih unit, memilih
            komponen, lalu melihat informasi dan visualisasi yang tersedia.
          </p>

          <div className="component-tags">
            {components.map((item) => <span key={item}>{item}</span>)}
          </div>

          <div className="project-feature-list">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div className="project-feature" key={feature.title}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <Icon size={18} strokeWidth={1.4} />
                  <div><strong>{feature.title}</strong><p>{feature.description}</p></div>
                </div>
              );
            })}
          </div>

          <div className="project-card-footer">
            <span>DATA → VISUAL → UNDERSTANDING</span>
            <button className="Bike Dashboard" type="button">
              <a href="https://bike-dashboard-chi.vercel.app/" target="_blank" rel="noopener noreferrer">
                Lihat Demo
              </a>
            </button>
          </div>
        </div>
      </motion.article>

      <div className="project-purpose">
        <span>PROJECT PURPOSE</span>
        <div>
          <p><strong>01 — DIGITALISASI</strong> Mengubah penyajian data komponen menjadi sistem berbasis web.</p>
          <p><strong>02 — VISUALISASI</strong> Menampilkan komponen melalui teks, gambar, dan GIF.</p>
          <p><strong>03 — KEMUDAHAN AKSES</strong> Mempermudah pencarian informasi unit dan komponen.</p>
          <p><strong>04 — REUSABLE SYSTEM</strong> Menjadi dasar project dengan kebutuhan berbeda.</p>
        </div>
      </div>
    </section>
  );
}

export default Project;
