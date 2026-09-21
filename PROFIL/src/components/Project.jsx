import {
  ArrowUpRight,
  Database,
  Search,
  Layers3,
  Image as ImageIcon,
  Moon,
  RefreshCw,
  LayoutDashboard,
  ShoppingBag,
  ShieldCheck,
  ShoppingCart,
  MessageCircle,
  ImagePlus,
} from "lucide-react";

import { motion } from "framer-motion";

const bikeFeatures = [
  {
    icon: LayoutDashboard,
    title: "Dashboard",
    description: "Menampilkan kumpulan unit sepeda.",
  },
  {
    icon: Search,
    title: "Search",
    description: "Membantu menemukan unit berdasarkan informasi yang tersedia.",
  },
  {
    icon: Layers3,
    title: "Component Card",
    description: "Menampilkan komponen yang digunakan oleh setiap unit.",
  },
  {
    icon: Database,
    title: "Component Detail",
    description: "Menampilkan detail komponen yang dipilih.",
  },
  {
    icon: ImageIcon,
    title: "GIF Visualization",
    description: "Menampilkan GIF sebagai visualisasi komponen.",
  },
  {
    icon: Moon,
    title: "Theme",
    description: "Mendukung Light Mode dan Dark Mode.",
  },
  {
    icon: RefreshCw,
    title: "Synchronization",
    description:
      "Menyiapkan mekanisme pembaruan informasi dari sumber data.",
  },
];

const bikeComponents = [
  "MODEL",
  "FRAME",
  "FORK",
  "HANDLEBAR",
  "SADDLE",
  "CHAIN",
  "RIM",
];

const fashionFeatures = [
  {
    icon: ShoppingBag,
    title: "Product Catalog",
    description:
      "Menampilkan koleksi produk fashion berdasarkan kategori.",
  },
  {
    icon: Search,
    title: "Product Search",
    description:
      "Membantu pengguna menemukan produk yang dibutuhkan.",
  },
  {
    icon: Layers3,
    title: "Category",
    description:
      "Produk dikelompokkan berdasarkan kategori fashion.",
  },
  {
    icon: ShoppingCart,
    title: "Shopping Cart",
    description:
      "Pengguna dapat memilih produk dan mengelola keranjang belanja.",
  },
  {
    icon: ShieldCheck,
    title: "Authentication",
    description:
      "Menyediakan sistem autentikasi pengguna dan akses admin.",
  },
  {
    icon: ImagePlus,
    title: "Product Images",
    description:
      "Menggunakan Supabase Storage untuk penyimpanan gambar produk.",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp Checkout",
    description:
      "Pesanan dapat diteruskan ke WhatsApp untuk proses checkout.",
  },
];

const fashionTechnologies = [
  "REACT",
  "VITE",
  "SUPABASE",
  "FRAMER MOTION",
  "LUCIDE",
  "VERCEL",
];

function Project() {
  return (
    <section className="project-section" id="project">
      <div className="section-number project-number">05</div>

      {/* =====================================================
          PROJECT HEADER
      ===================================================== */}

      <div className="project-header">
        <div>
          <span className="section-label">
            PROJECT / PORTFOLIO
          </span>

          <h2>
            SELECTED
            <br />
            <em>PROJECTS.</em>
          </h2>
        </div>

        <p>
          Beberapa project yang dibuat selama proses belajar,
          pengembangan keterampilan, dan pengalaman PKL di bidang
          pengembangan perangkat lunak.
        </p>
      </div>

      {/* =====================================================
          PROJECT 01 — BIKE DASHBOARD
      ===================================================== */}

      <motion.article
        className="project-featured"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{
          duration: 0.7,
          ease: "easeOut",
        }}
      >
        <div className="project-visual">
          <img
            src="/bike-dashboard.jpg"
            alt="Tampilan Bike Dashboard"
          />

          <span className="project-visual-label">
            BIKE DASHBOARD / PROTOTYPE
          </span>
        </div>

        <div className="project-featured-content">
          <div className="project-card-top">
            <span>01</span>
            <span>2026 / PKL</span>
          </div>

          <div className="project-card-meta">
            WEB INTERACTIVE COMPONENT DASHBOARD
          </div>

          <h3>
            Dashboard sebagai Prototype Digitalisasi Informasi
            Komponen.
          </h3>

          <p className="project-card-description">
            Bike Dashboard dibuat untuk mengelola dan menampilkan
            informasi unit sepeda dan komponen. Pengguna dapat
            memilih unit, memilih komponen, lalu melihat informasi
            dan visualisasi yang tersedia.
          </p>

          <div className="component-tags">
            {bikeComponents.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>

          <div className="project-feature-list">
            {bikeFeatures.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <div
                  className="project-feature"
                  key={feature.title}
                >
                  <span>
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <Icon
                    size={18}
                    strokeWidth={1.4}
                  />

                  <div>
                    <strong>{feature.title}</strong>
                    <p>{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="project-card-footer">
            <span>DATA → VISUAL → UNDERSTANDING</span>

            <a
              className="project-demo-link"
              href="https://bike-dashboard-chi.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>Lihat Demo</span>
              <ArrowUpRight size={15} />
            </a>
          </div>
        </div>
      </motion.article>

      {/* =====================================================
          PROJECT 02 — WS FASHION
      ===================================================== */}

      <motion.article
        className="project-featured project-fashion"
        initial={{
          opacity: 0,
          y: 30,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{
          once: true,
          amount: 0.15,
        }}
        transition={{
          duration: 0.7,
          ease: "easeOut",
        }}
      >
        <div className="project-visual">
          <img
            src="/ws-fashion.png"
            alt="Tampilan WS Fashion"
            onError={(event) => {
              event.currentTarget.style.display = "none";
            }}
          />

          <span className="project-visual-label">
            WS FASHION / E-COMMERCE
          </span>
        </div>

        <div className="project-featured-content">
          <div className="project-card-top">
            <span>02</span>
            <span>2026 / PERSONAL PROJECT</span>
          </div>

          <div className="project-card-meta">
            FASHION E-COMMERCE WEBSITE
          </div>

          <h3>
            WS Fashion — Website Toko Fashion Berbasis React
            dan Supabase.
          </h3>

          <p className="project-card-description">
            WS Fashion merupakan website toko online yang dibuat
            untuk menampilkan produk fashion secara modern dan
            interaktif. Website dilengkapi katalog produk,
            kategori, keranjang, autentikasi, admin dashboard,
            penyimpanan gambar, dan checkout melalui WhatsApp.
          </p>

          <div className="component-tags">
            {fashionTechnologies.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>

          <div className="project-feature-list">
            {fashionFeatures.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <div
                  className="project-feature"
                  key={feature.title}
                >
                  <span>
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <Icon
                    size={18}
                    strokeWidth={1.4}
                  />

                  <div>
                    <strong>{feature.title}</strong>
                    <p>{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="project-card-footer">
            <span>PRODUCT → EXPERIENCE → COMMERCE</span>

            <a
              className="project-demo-link"
              href="https://website-warih-sam.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>Kunjungi WS Fashion</span>
              <ArrowUpRight size={15} />
            </a>
          </div>
        </div>
      </motion.article>

      {/* =====================================================
          PROJECT PURPOSE
      ===================================================== */}

      <div className="project-purpose">
        <span>PROJECT PURPOSE</span>

        <div>
          <p>
            <strong>01 — DIGITALISASI</strong>
            Mengubah penyajian data dan informasi menjadi sistem
            berbasis web.
          </p>

          <p>
            <strong>02 — VISUALISASI</strong>
            Menggabungkan teks, gambar, GIF, dan antarmuka
            interaktif.
          </p>

          <p>
            <strong>03 — E-COMMERCE</strong>
            Mengembangkan website toko online dengan katalog,
            keranjang, dan checkout.
          </p>

          <p>
            <strong>04 — REUSABLE SYSTEM</strong>
            Menerapkan teknologi web yang dapat dikembangkan
            untuk kebutuhan project berikutnya.
          </p>
        </div>
      </div>
    </section>
  );
}

export default Project;