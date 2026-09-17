import { BriefcaseBusiness, Code2, Database, Palette, BarChart3 } from "lucide-react";
import "./Professional.css";

const profileData = [
  { icon: BriefcaseBusiness, label: "STATUS", value: "Siswa Kelas XII RPL" },
  { icon: Code2, label: "PEMROGRAMAN", value: "Software Development" },
  { icon: GlobeIcon, label: "WEB", value: "React + Vite" },
  { icon: Database, label: "DATABASE", value: "Supabase" },
  { icon: Palette, label: "VISUAL", value: "UI/UX · Gambar · GIF" },
  { icon: BarChart3, label: "FOKUS", value: "Data · Dashboard · Industri" },
];

function GlobeIcon(props) {
  return <span className="profile-globe-icon" {...props}>◎</span>;
}

function Professional() {
  return (
    <section className="professional-section" id="profile">
      <div className="professional-container">
        <div className="professional-header">
          <span className="section-eyebrow">PROFIL / 02</span>
          <h2>
            Dari <em>pembelajaran</em>
            <br />
            menuju solusi digital.
          </h2>
          <p>
            Saya mengembangkan kemampuan RPL melalui pembelajaran di sekolah
            dan penerapan langsung pada project. Fokus saya mencakup
            pemrograman, pengembangan website, database, UI/UX, pengolahan
            data, dan pengembangan aplikasi.
          </p>
          <p>
            Bike Dashboard menjadi salah satu hasil pengembangan selama PKL di
            PT INKA (Persero), dengan pendekatan visual dan interaktif untuk
            menyajikan informasi teknis.
          </p>
        </div>

        <div className="professional-grid">
          {profileData.map((item, index) => {
            const Icon = item.icon;

            return (
              <div className="professional-card" key={item.label}>
                <div className="professional-card-number">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <div className="professional-icon">
                  <Icon size={20} strokeWidth={1.5} />
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
