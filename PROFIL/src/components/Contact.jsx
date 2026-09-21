import {
  Mail,
  MapPin,
  Phone,
  ArrowUpRight,
  GraduationCap,
} from "lucide-react";

function Contact() {
  return (
    <section className="contact-section" id="contact">
      <div className="section-number">11</div>

      <div className="section-heading">
        <p>CONTACT / 11</p>
        <h2>
          Kontak
          <br />
          <em>Saya.</em>
        </h2>
      </div>

      <div className="contact-intro">
        <p>
          Terbuka untuk belajar, berdiskusi, berkolaborasi, dan mendapatkan
          pengalaman baru di bidang teknologi informasi dan pengembangan
          perangkat lunak.
        </p>
      </div>

      <div className="contact-grid">
        {/* EMAIL */}
        <a
          className="contact-item"
          href="mailto:warihazt@gmail.com"
        >
          <div className="contact-icon">
            <Mail size={21} strokeWidth={1.5} />
          </div>

          <div className="contact-item-content">
            <span>EMAIL</span>
            <strong>warihazt@gmail.com</strong>
          </div>

          <ArrowUpRight
            className="contact-arrow"
            size={19}
          />
        </a>

        {/* TELEPHONE */}
        <a
          className="contact-item"
          href="https://wa.me/qr/A7ZULSBYXLC4H1"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="contact-icon">
            <Phone size={21} strokeWidth={1.5} />
          </div>

          <div className="contact-item-content">
            <span>TELEPON</span>
            <strong>+62 895 2408 5083</strong>
          </div>

          <ArrowUpRight
            className="contact-arrow"
            size={19}
          />
        </a>

        {/* ADDRESS */}
        <div className="contact-item">
          <div className="contact-icon">
            <MapPin size={21} strokeWidth={1.5} />
          </div>

          <div className="contact-item-content">
            <span>ALAMAT</span>
            <strong>Pulung, Ponorogo</strong>
            <p>Jawa Timur, Indonesia</p>
          </div>
        </div>

        {/* SCHOOL */}
        <div className="contact-item">
          <div className="contact-icon">
            <GraduationCap size={21} strokeWidth={1.5} />
          </div>

          <div className="contact-item-content">
            <span>SEKOLAH</span>
            <strong>SMKN 1 Jenangan</strong>
            <p>XII Rekayasa Perangkat Lunak</p>
          </div>
        </div>
      </div>

      <div className="contact-note">
        <div className="contact-note-number">11</div>

        <div className="contact-note-content">
          <span>PORTFOLIO / 2026</span>

          <p>
            Warih Seto Samudra — XII Rekayasa Perangkat Lunak,
            SMKN 1 Jenangan. PKL — PT INKA (Persero).
          </p>
        </div>
      </div>
    </section>
  );
}

export default Contact;