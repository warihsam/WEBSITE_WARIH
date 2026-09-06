function Technology() {
  const technologies = [
    {
      number: "01",
      name: "REACT",
      description:
        "Membangun antarmuka website yang interaktif dan terstruktur.",
    },
    {
      number: "02",
      name: "VITE",
      description:
        "Digunakan sebagai build tool dan development environment.",
    },
    {
      number: "03",
      name: "SUPABASE",
      description:
        "Digunakan untuk database dan penyimpanan data.",
    },
    {
      number: "04",
      name: "JAVASCRIPT",
      description:
        "Mengatur logika dan interaksi pada aplikasi.",
    },
    {
      number: "05",
      name: "CSS",
      description:
        "Membangun tampilan visual dan responsive layout.",
    },
  ];

  return (
    <section
      className="editorial-section light"
      id="technology"
    >
      <div className="section-number">04</div>

      <div className="section-heading">
        <p>TECHNOLOGY</p>
        <h2>Teknologi<br />yang Digunakan.</h2>
      </div>

      <div className="tech-list">
        {technologies.map((item) => (
          <div className="tech-item" key={item.number}>
            <span>{item.number}</span>

            <h3>{item.name}</h3>

            <p>{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Technology;