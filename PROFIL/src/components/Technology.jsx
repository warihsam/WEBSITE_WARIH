import {
  Code2,
  Database,
  FileSpreadsheet,
  LayoutDashboard,
  Search,
  Sparkles,
} from "lucide-react";

const skills = [
  {
    number: "01",
    name: "HTML & CSS",
    category: "WEB",
    level: "Dasar — Menengah",
    value: 75,
    icon: Code2,
  },
  {
    number: "02",
    name: "JavaScript",
    category: "PROGRAMMING",
    level: "Dasar — Menengah",
    value: 70,
    icon: Code2,
  },
  {
    number: "03",
    name: "React + Vite",
    category: "FRONTEND",
    level: "Menengah",
    value: 70,
    icon: LayoutDashboard,
  },
  {
    number: "04",
    name: "SQL & Database",
    category: "DATABASE",
    level: "Dasar — Menengah",
    value: 65,
    icon: Database,
  },
  {
    number: "05",
    name: "Google Sheets",
    category: "DATA",
    level: "Menengah",
    value: 75,
    icon: FileSpreadsheet,
  },
  {
    number: "06",
    name: "Looker Studio",
    category: "DASHBOARD",
    level: "Dasar — Menengah",
    value: 65,
    icon: LayoutDashboard,
  },
  {
    number: "07",
    name: "Search & Filtering",
    category: "FUNCTION",
    level: "Menengah",
    value: 70,
    icon: Search,
  },
  {
    number: "08",
    name: "UI / Visualisasi",
    category: "DESIGN",
    level: "Dasar — Menengah",
    value: 65,
    icon: Sparkles,
  },
];

function Technology() {
  return (
    <section
      className="editorial-section light skills-section"
      id="technology"
    >
      <div className="section-number">06</div>

      <div className="section-heading">
        <p>SKILLS / 06</p>

        <h2>
          Keahlian
          <br />
          <em>yang Dipelajari.</em>
        </h2>
      </div>

      <div className="tech-intro">
        <p>
          Kemampuan teknis yang dikembangkan melalui pembelajaran di sekolah,
          project, dan pengalaman PKL. Tingkat kemampuan menunjukkan
          penguasaan saat ini.
        </p>
      </div>

      <div className="skills-grid">
        {skills.map((item) => {
          const Icon = item.icon;

          return (
            <article className="skill-card" key={item.number}>
              <div className="skill-card-top">
                <span>{item.number}</span>
                <small>{item.category}</small>
              </div>

              <div className="skill-icon">
                <Icon size={19} strokeWidth={1.5} />
              </div>

              <h3>{item.name}</h3>

              <div className="skill-level-row">
                <span>{item.level}</span>
                <strong>{item.value}%</strong>
              </div>

              <div className="skill-bar">
                <span style={{ width: `${item.value}%` }} />
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default Technology;