import { GraduationCap, CalendarDays, MapPin, BookOpen, ArrowUpRight } from "lucide-react";
import "./Education.css";

const educationData = [

  {
    year: "2024 — SEKARANG",
    title: "SMK Negeri 1 Jenangan",
    major: "Rekayasa Perangkat Lunak (RPL)",
    location: "Ponorogo, Jawa Timur",
    maps: "https://maps.app.goo.gl/RUNhrpuy1C7Kh4MN8",
    description:
      "Mempelajari pemrograman, pengembangan website, database, UI/UX, pengolahan data, dan pengembangan aplikasi.",
    status: "CURRENT",
  },
  {
    year: "2021 — 2024",
    title: "SMPN 1 Pulung",
    major: "Pendidikan Menengah Pertama",
    location: "Pulung, Ponorogo, Jawa Timur",
    maps: "https://maps.app.goo.gl/x1ZNFuC8vBsCVaNe9",
    description:
      "Menempuh pendidikan tingkat menengah pertama sebagai dasar pendidikan sebelum melanjutkan ke jurusan RPL.",
    status: "COMPLETED",
  },
  {
    year: "2015 — 2021",
    title: "SDN 1 Pulung",
    major: "Pendidikan Dasar",
    location: "Pulung, Ponorogo, Jawa Timur",
    maps: "https://maps.app.goo.gl/EtXisouA1ihTvBsD8",
    description:
      "Menempuh pendidikan dasar sebagai bagian dari perjalanan pendidikan formal.",
    status: "COMPLETED",
  },
];

const subjects = [
  "Pemrograman",
  "Pengembangan Website",
  "Database",
  "UI/UX",
  "Pengolahan Data",
  "Pengembangan Aplikasi",
];

function Education() {
  return (
    <section className="education" id="education">
      <div className="education-container">
        <div className="education-header">
          <div className="education-eyebrow"><span /> EDUCATION / 03</div>
          <h2>Riwayat<span> Pendidikan.</span></h2>
          <p>
            Pendidikan menjadi dasar untuk mengembangkan kemampuan teknis dan
            menerapkannya pada project nyata di lingkungan industri.
          </p>
        </div>

        <div className="education-grid">
          <div className="education-timeline">
            {educationData.map((item, index) => (
              <div className="education-item" key={item.title}>
                <div className="education-line">
                  <div className="education-dot"><GraduationCap size={19} strokeWidth={1.5} /></div>
                </div>
                <div className="education-card">
                  <div className="education-card-header">
                    <div className="education-date"><CalendarDays size={14} /><span>{item.year}</span></div>
                    <div className="education-status">{item.status}</div>
                  </div>
                  <a
  href={item.maps}
  target="_blank"
  rel="noopener noreferrer"
  className="education-school-link"
>
  <h3>{item.title}</h3>
  <ArrowUpRight size={18} strokeWidth={1.4} />
</a>
                  <div className="education-major"><BookOpen size={15} /><span>{item.major}</span></div>
                  <div className="education-location"><MapPin size={14} /><span>{item.location}</span></div>
                  <p>{item.description}</p>
                  <div className="education-card-footer">
                    <span>{String(index + 1).padStart(2, "0")} / EDUCATION</span>
                    <ArrowUpRight size={17} strokeWidth={1.4} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="education-focus">
            <div className="focus-header">
              <span>PROGRAM KEAHLIAN</span>
              <h3>Rekayasa Perangkat <strong>Lunak.</strong></h3>
            </div>
            <div className="education-subjects">
              {subjects.map((subject, index) => (
                <div className="education-subject" key={subject}>
                  <span className="subject-number">{String(index + 1).padStart(2, "0")}</span>
                  <span className="subject-name">{subject}</span>
                  <ArrowUpRight size={16} strokeWidth={1.4} />
                </div>
              ))}
            </div>
            <div className="education-note">
              <span className="note-line" />
              <p>
                Ilmu dari sekolah menjadi bekal untuk mengerjakan project dan
                memahami kebutuhan dunia industri.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Education;
