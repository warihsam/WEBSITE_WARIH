function Learning() {
  const lessons = [
    "Membuat struktur aplikasi React.",
    "Menghubungkan aplikasi dengan database.",
    "Mengelola data menggunakan Supabase.",
    "Membuat tampilan responsive.",
    "Melakukan debugging aplikasi.",
    "Memahami alur pengembangan project.",
  ];

  return (
    <section className="learning-section">
      <div className="section-number">07</div>

      <div className="section-heading">
        <p>WHAT I LEARNED</p>
        <h2>Yang Saya<br />Pelajari.</h2>
      </div>

      <div className="learning-list">
        {lessons.map((lesson, index) => (
          <div key={lesson}>
            <span>
              {String(index + 1).padStart(2, "0")}
            </span>
            <p>{lesson}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Learning;