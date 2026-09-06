function System() {
  const steps = [
    ["01", "INPUT DATA", "Data sepeda dan komponen dimasukkan ke sistem."],
    ["02", "DATABASE", "Data disimpan dan dikelola menggunakan Supabase."],
    ["03", "PROCESS", "Aplikasi mengambil dan mengolah data."],
    ["04", "DISPLAY", "Data ditampilkan melalui dashboard."],
  ];

  return (
    <section className="system-section">
      <div className="section-number">05</div>

      <div className="section-heading">
        <p>SYSTEM</p>
        <h2>Alur<br />Sistem.</h2>
      </div>

      <div className="system-flow">
        {steps.map(([number, title, description]) => (
          <div className="system-step" key={number}>
            <span>{number}</span>

            <div>
              <h3>{title}</h3>
              <p>{description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default System;