import {
  GraduationCap,
  Building2,
  Code2,
  Database,
  Palette,
  BriefcaseBusiness,
} from "lucide-react";

import "./Professional.css";

const profileData = [
  {
    icon: GraduationCap,
    label: "STATUS SAAT INI",
    value: "Siswa Kelas XII RPL",
  },
  {
    icon: Building2,
    label: "INSTANSI",
    value: "SMKN 1 Jenangan",
  },
  {
    icon: BriefcaseBusiness,
    label: "PENGALAMAN",
    value: "PKL di PT INKA (Persero)",
  },
  {
    icon: Code2,
    label: "BIDANG DITEKUNI",
    value: "Rekayasa Perangkat Lunak",
  },
  {
    icon: Database,
    label: "FOKUS TEKNOLOGI",
    value: "React · Vite · Supabase",
  },
  {
    icon: Palette,
    label: "MINAT",
    value: "Web Development · UI/UX",
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
            Saat ini saya merupakan siswa kelas XII jurusan
            Rekayasa Perangkat Lunak (RPL) di SMKN 1 Jenangan.
            Saya sedang mendalami bidang pengembangan perangkat
            lunak, khususnya website dan aplikasi digital.
          </p>

          <p>
            Selain kegiatan pembelajaran di sekolah, saya juga
            mendapatkan pengalaman Praktik Kerja Lapangan (PKL)
            di PT INKA (Persero). Pengalaman tersebut menjadi
            kesempatan bagi saya untuk mengenal lingkungan kerja
            dan menerapkan kemampuan yang telah dipelajari.
          </p>

          <p>
            Bidang yang sedang saya tekuni meliputi web development,
            pemrograman, database, serta UI/UX. Dalam proses
            pengembangan proyek, saya menggunakan teknologi seperti
            React, Vite, dan Supabase untuk membangun aplikasi
            digital yang interaktif dan mudah digunakan.
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