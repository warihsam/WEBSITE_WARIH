import { Award, BriefcaseBusiness, Code2, Laptop, GraduationCap, ArrowUpRight } from "lucide-react";
import "./Activities.css";

const activities = [
  {
    number: "01",
    category: "TRAINING",
    title: "Basic Training & Pengenalan Lingkungan Kerja",
    description:
      "Mengikuti pembekalan awal PKL di PT INKA (Persero): tata tertib perusahaan, budaya kerja, K3, serta pengenalan unit kerja dan tanggung jawab tugas.",
    icon: Award,
    image: "/activities/training.jpg",
  },
  {
    number: "02",
    category: "DATA PROCESSING",
    title: "Pengolahan Data PNKK & TKB dengan Google Sheets",
    description:
      "Menata format data, memeriksa konsistensi, membuat rekapitulasi dan Pivot Table, lalu menyiapkan struktur data untuk kebutuhan dashboard.",
    icon: BriefcaseBusiness,
    image: "/activities/pnkk-tkb.jpg",
  },
  {
    number: "03",
    category: "AUTOMATION",
    title: "Workflow Automation dengan n8n",
    description:
      "Membangun otomatisasi ekstraksi data komponen kereta dari dokumen PDF, serta penerimaan laporan gangguan kereta via WhatsApp (WAHA) ke Google Sheets.",
    icon: Code2,
    image: "/activities/n8n.jpg",
  },
  {
    number: "04",
    category: "PROJECT",
    title: "Bike Dashboard",
    description:
      "Mengembangkan prototype web interaktif untuk menampilkan informasi unit sepeda dan komponen secara terstruktur, sebagai dasar visualisasi komponen kereta.",
    icon: Laptop,
    image: "/activities/bike-dashboard.jpg",
  },
  {
    number: "05",
    category: "LEARNING",
    title: "Pembelajaran Data & Web",
    description:
      "Mengembangkan kemampuan pemrograman, database (Supabase/PostgreSQL), pengolahan data, dashboard Looker Studio, dan pengembangan website.",
    icon: GraduationCap,
    image: "/activities/learning.jpg",
  },
];

function Activities() {
  return (
    <section className="activities" id="activities">
      <div className="activities-container">

        <div className="activities-header">
          <div className="activities-eyebrow">
            <span />
            ACTIVITIES / 08
          </div>

          <h2>
            Kegiatan &
            <span> Dokumentasi.</span>
          </h2>

          <p>
            Kegiatan belajar, kunjungan industri, PKL, dan project yang
            mendukung proses pengembangan kompetensi.
          </p>
        </div>

        <div className="activities-grid">
          {activities.map((activity) => {
            const Icon = activity.icon;

            return (
              <article
                className="activity-card"
                key={activity.number}
              >
                <div className="activity-visual">
  {activity.image ? (
    <img
      src={activity.image}
      alt={activity.title}
      className="activity-image"
    />
  ) : (
    <div className="activity-placeholder">
      <Icon size={42} strokeWidth={1.05} />
      <span>{activity.category}</span>
    </div>
  )}

  <div className="activity-number">
    {activity.number}
  </div>
</div>

                <div className="activity-content">

                  <div className="activity-meta">
                    <span>{activity.category}</span>
                    <span>PORTFOLIO</span>
                  </div>

                  <h3>{activity.title}</h3>

                  <p>{activity.description}</p>

                  <div className="activity-footer">
                    <span>LEARN / PRACTICE / CREATE</span>
                    <ArrowUpRight
                      size={17}
                      strokeWidth={1.4}
                    />
                  </div>

                </div>
              </article>
            );
          })}
        </div>

      </div>
    </section>
  );
}

export default Activities;
