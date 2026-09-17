
import {
  BriefcaseBusiness,
  Code2,
  Database,
  Palette,
  BarChart3,
  GraduationCap,
  Building2,
} from "lucide-react";

import "./Professional.css";

const profileData = [
  {
    icon: GraduationCap,
    label: "PENDIDIKAN",
    value: "SMKN 1 Jenangan · XII RPL",
  },
  {
    icon: Code2,
    label: "BIDANG KEAHLIAN",
    value: "Rekayasa Perangkat Lunak",
  },
  {
    icon: Building2,
    label: "PENGALAMAN",
    value: "PKL di PT INKA (Persero)",
  },
  {
    icon: BriefcaseBusiness,
    label: "PENGEMBANGAN",
    value: "Website & Aplikasi Digital",
  },
  {
    icon: Database,
    label: "TEKNOLOGI",
    value: "React · Vite · Supabase",
  },
  {
    icon: Palette,
    label: "KREATIVITAS",
    value: "UI/UX · Visual · Interaktif",
  },
];

function Professional() {
  return (
    <section
      className="professional-section"
      id="profile"
    >
      <div className="professional-container">
        <div className="professional-header">
          <span className="section-eyebrow">
            PROFIL PROFESIONAL / 02
          </span>

          <h2>
            Warih Seto Samudra:
            <br />
            <em>Belajar, berkarya,</em>
            <br />
            dan berkembang melalui teknologi.
          </h2>

          <p>
            Saya adalah Warih Seto Samudra, siswa kelas XII
            jurusan Rekayasa Perangkat Lunak (RPL) di
            SMKN 1 Jenangan. Saya memiliki ketertarikan
            pada pengembangan website, pemrograman,
            database, dan desain antarmuka digital.
          </p>

          <p>
            Melalui pembelajaran di sekolah dan pengalaman
            Praktik Kerja Lapangan (PKL) di PT INKA (Persero),
            saya mengembangkan kemampuan dalam menerapkan
            teknologi untuk membuat solusi digital yang
            informatif, interaktif, dan mudah digunakan.
          </p>

          <p>
            Beberapa bidang yang saya pelajari meliputi
            pengembangan aplikasi berbasis React dan Vite,
            pengelolaan database menggunakan Supabase,
            desain UI/UX, serta penyajian data melalui
            dashboard interaktif.
          </p>

          <p>
            Saya terus berusaha meningkatkan kemampuan teknis,
            kreativitas, komunikasi, dan pemecahan masalah
            untuk mempersiapkan diri menghadapi dunia kerja
            di bidang teknologi informasi.
          </p>
        </div>

        <div className="professional-grid">
          {profileData.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                className="professional-card"
                key={item.label}
              >
                <div className="professional-card-number">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <div className="professional-icon">
                  <Icon
                    size={20}
                    strokeWidth={1.5}
                  />
                </div>

                <div className="professional-card-content">
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Professional;