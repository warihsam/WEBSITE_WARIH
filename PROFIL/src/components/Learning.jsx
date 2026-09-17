const learnings = [
  { number: "01", title: "React & Web Development", description: "Membuat aplikasi berbasis React dan membangun UI dashboard." },
  { number: "02", title: "Database & Backend", description: "Mengelola database, menghubungkan aplikasi dengan backend, dan menyusun struktur data." },
  { number: "03", title: "Visual Asset", description: "Mengelola file gambar dan GIF sebagai bagian dari pengalaman informasi visual." },
  { number: "04", title: "Search & Filtering", description: "Membuat fitur pencarian dan filtering untuk membantu pengguna menemukan data." },
  { number: "05", title: "State & Interaction", description: "Mengelola state dan interaksi pengguna pada aplikasi web." },
  { number: "06", title: "Debugging & Deployment", description: "Melakukan debugging, troubleshooting, dan deployment aplikasi web." },
  { number: "07", title: "Problem Solving", description: "Menganalisis kebutuhan, memecahkan masalah, dan mengembangkan project secara bertahap." },
  { number: "08", title: "Industry Workflow", description: "Memahami proses kerja dan menyesuaikan aplikasi dengan kebutuhan pengguna di lingkungan industri." },
];

function Learning() {
  return (
    <section className="learning-section" id="learning">
      <div className="section-number">07</div>
      <div className="section-heading">
        <p>WHAT I LEARNED / 07</p>
        <h2>Pengalaman<br /><em>dan Pembelajaran.</em></h2>
      </div>
      <div className="learning-intro"><p>Proses pengembangan Bike Dashboard menggabungkan kemampuan teknis RPL dengan kebutuhan project nyata di lingkungan industri.</p></div>
      <div className="learning-list">
        {learnings.map((item) => (
          <div className="learning-item" key={item.number}>
            <span className="learning-number">{item.number}</span>
            <div className="learning-item-main"><h3>{item.title}</h3><p>{item.description}</p></div>
            <span className="learning-arrow">↗</span>
          </div>
        ))}
      </div>
      <div className="language-block learning-note-block">
        <div className="language-heading"><span>08</span><p>FROM LEARNING TO CREATION</p></div>
        <div className="language-list learning-quote"><div><span>→</span><strong>Data → Visual → Understanding → Digital Solution</strong></div></div>
      </div>
    </section>
  );
}

export default Learning;
