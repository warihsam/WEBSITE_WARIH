import { BriefcaseBusiness, CalendarDays, ArrowUpRight, Building2 } from "lucide-react";
import "./Experience.css";

const experience = {
  year: "2026",
  duration: "PRAKTIK KERJA LAPANGAN",
  company: "PT INKA (Persero)",
  maps: "https://maps.app.goo.gl/qobTcpaVaXEHtvaDA",
  description:
    "Melalui kegiatan PKL, saya menerapkan kemampuan Rekayasa Perangkat Lunak dalam lingkungan kerja dan industri secara langsung — mulai dari pengolahan data, otomatisasi workflow, hingga pengembangan aplikasi web.",
  projects: [
    "Pengolahan data PNKK & TKB dengan Google Sheets, lalu divisualisasikan sebagai dashboard monitoring di Google Looker Studio.",
    "Otomatisasi ekstraksi data komponen kereta dari dokumen PDF menggunakan workflow n8n ke Google Sheets.",
    "Otomatisasi penerimaan laporan gangguan kereta via WhatsApp (WAHA) yang diteruskan lewat webhook n8n.",
    "Pengembangan bot interaktif WhatsApp untuk menjawab pertanyaan customer seputar informasi kereta.",
    "Pembelajaran database Supabase (PostgreSQL) untuk kebutuhan penyimpanan data sistem terintegrasi.",
    "Pengembangan Bike Dashboard sebagai prototype digitalisasi informasi komponen, dasar visualisasi komponen kereta.",
  ],
};

function Experience() {
  return (
    <section className="experience" id="experience">
      <div className="experience-container">
        <div className="experience-header">
          <div className="experience-eyebrow"><span /> INDUSTRY EXPERIENCE / 04</div>
          <h2>Praktik Kerja Lapangan.</h2>
          <p>Pengalaman menerapkan kemampuan RPL dalam lingkungan industri.</p>
        </div>

        <div className="experience-wrapper">
          <div className="experience-marker">
            <div className="experience-marker-icon"><BriefcaseBusiness size={20} strokeWidth={1.5} /></div>
          </div>

          <div className="experience-card">
            <div className="experience-top">
              <div className="experience-date">
                <CalendarDays size={14} strokeWidth={1.5} />
                <span>{experience.year}</span><i />
                <span>{experience.duration}</span>
              </div>
              <div className="experience-label">PKL</div>
            </div>

            <div className="experience-company">
              <div className="company-icon"><Building2 size={23} strokeWidth={1.4} /></div>
              <div>
  <a
    href={experience.maps}
    target="_blank"
    rel="noopener noreferrer"
    className="experience-company-link"
  >
    <h3>{experience.company}</h3>
    <ArrowUpRight size={18} strokeWidth={1.4} />
  </a>

  <div className="experience-division">
    Praktik Kerja Lapangan
  </div>
</div>
            </div>

            <p className="experience-description">{experience.description}</p>

            <div className="experience-projects">
              <div className="projects-title"><span>01</span> HASIL / PROJECT</div>
              <div className="project-list">
                {experience.projects.map((project, index) => (
                  <div className="experience-project" key={project}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <p>{project}</p>
                    <ArrowUpRight size={16} strokeWidth={1.4} />
                  </div>
                ))}
              </div>
            </div>

            <div className="experience-footer"><span>PT INKA / INDUSTRY EXPERIENCE</span><ArrowUpRight size={17} /></div>
          </div>
        </div>

        <div className="experience-note">
          <div className="experience-note-number">02</div>
          <div>
            <span>PROJECT UTAMA</span>
            <p>
              Bike Dashboard — prototype web untuk menampilkan informasi unit
              sepeda dan komponen secara terstruktur, visual, dan interaktif.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Experience;
