import {
  ArrowUpRight,
  CalendarDays,
  Clock3,
  BookOpen,
} from "lucide-react";
import "./Blog.css";

const featuredPost = {
  date: "2026",
  category: "AUTOMATION",
  title: "Otomatisasi Ekstraksi Data Komponen Kereta dari Dokumen PDF dengan n8n",
  excerpt:
    "Salah satu penerapan n8n selama PKL: membaca dan mengekstrak informasi komponen kereta dari dokumen PDF, lalu memprosesnya secara otomatis ke Google Sheets — mengurangi pencatatan manual pada alur Dokumen PDF → n8n → Ekstraksi → Pemrosesan → Google Sheets.",
  readTime: "5 min read",
};

const posts = [
  {
    date: "2026",
    category: "AUTOMATION",
    title: "Membangun Bot WhatsApp Informasi Kereta dengan n8n & WAHA",
    excerpt:
      "Alur Customer → WhatsApp/WAHA → Webhook n8n → Pemrosesan → Respons Otomatis, dipakai juga untuk menerima laporan gangguan kereta 24 jam secara terstruktur.",
    readTime: "4 min read",
  },
  {
    date: "2026",
    category: "DATA",
    title: "Dari Google Sheets ke Dashboard Looker Studio",
    excerpt:
      "Mengolah data PNKK dan TKB di Google Sheets — rekap, Pivot Table, hingga menghubungkannya ke Looker Studio sebagai scorecard, tabel, dan grafik monitoring.",
    readTime: "4 min read",
  },
  {
    date: "2026",
    category: "DATABASE",
    title: "Belajar Supabase: Database PostgreSQL untuk Sistem Terintegrasi",
    excerpt:
      "Membuat tabel, menentukan field dan tipe data, menguji query, hingga mempelajari Authentication sebagai bekal integrasi database dengan aplikasi dan workflow.",
    readTime: "3 min read",
  },
  {
    date: "2026",
    category: "DEVELOPMENT",
    title: "Dari Prototipe Sepeda ke Visualisasi Komponen Kereta",
    excerpt:
      "Bike Dashboard dikembangkan sebagai prototype awal untuk mempelajari cara menampilkan objek dan bagian-bagiannya secara visual di web, sebelum diarahkan ke komponen kereta.",
    readTime: "4 min read",
  },
];

function Blog() {
  return (
    <section className="blog" id="blog">
      <div className="blog-container">

        {/* HEADER */}
        <div className="blog-header">
          <div className="blog-eyebrow">
            <span></span>
            BLOG / NOTES
          </div>

          <h2>
            Thoughts &
            <span> Learning Notes</span>
          </h2>

          <p>
            Catatan singkat mengenai pengalaman, proses belajar, teknologi,
            dan hal-hal yang saya temui selama perjalanan mengembangkan diri.
          </p>
        </div>

        {/* FEATURED ARTICLE */}
        <article className="blog-featured">
          <div className="blog-featured-visual">
            <div className="blog-featured-number">
              01
            </div>

            <img
              src="/blog/n8n.png"
              alt={featuredPost.title}
              className="blog-featured-image"
            />
          </div>

          <div className="blog-featured-content">
            <div className="blog-meta">
              <span>
                {featuredPost.category}
              </span>

              <span>
                <CalendarDays size={13} />
                {featuredPost.date}
              </span>

              <span>
                <Clock3 size={13} />
                {featuredPost.readTime}
              </span>
            </div>

            <h3>
              {featuredPost.title}
            </h3>

            <p>
              {featuredPost.excerpt}
            </p>

          
          </div>
        </article>

        {/* POSTS */}
        <div className="blog-section-heading">
          <span>02</span>
          <p>MORE NOTES</p>
        </div>

        <div className="blog-grid">
          {posts.map((post, index) => (
            <article
              className="blog-card"
              key={index}
            >
              <div className="blog-card-top">
                <span className="blog-card-number">
                  {String(index + 2).padStart(2, "0")}
                </span>

                <span className="blog-card-category">
                  {post.category}
                </span>
              </div>

              <div className="blog-card-meta">
                <span>
                  <CalendarDays size={13} />
                  {post.date}
                </span>

                <span>
                  <Clock3 size={13} />
                  {post.readTime}
                </span>
              </div>

              <h3>
                {post.title}
              </h3>

              <p>
                {post.excerpt}
              </p>

             
            </article>
          ))}
        </div>

        {/* FOOTER */}
        <div className="blog-footer">
          <div className="blog-footer-line"></div>

          <div>
            <span>
              KEEP LEARNING
            </span>

            <p>
              Setiap pengalaman adalah bahan untuk belajar dan setiap proses
              dapat menjadi cerita yang berguna.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}

export default Blog;