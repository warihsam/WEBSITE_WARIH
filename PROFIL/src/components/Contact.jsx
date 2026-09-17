import { Mail, MapPin, Phone, ArrowUpRight, GraduationCap, Store } from "lucide-react";

function Contact() {
  return (
    <section className="contact-section" id="contact">
      <div className="section-number">11</div>
      <div className="section-heading">
        <p>CONTACT / 11</p>
        <h2>Kontak<br /><em>Saya.</em></h2>
      </div>
      <div className="contact-intro"><p>Terbuka untuk belajar, berdiskusi, berkolaborasi, dan mendapatkan pengalaman baru di bidang teknologi informasi dan pengembangan perangkat lunak.</p></div>
      <div className="contact-grid">
        <a className="contact-item" href="mailto:warihazt@gmail.com"><div className="contact-icon"><Mail size={21} strokeWidth={1.5} /></div><div className="contact-item-content"><span>EMAIL</span><strong>warihazt@gmail.com</strong></div><ArrowUpRight className="contact-arrow" size={19} /></a>
        <a className="contact-item" href="tel:+6289524085083"><div className="contact-icon"><Phone size={21} strokeWidth={1.5} /></div><div className="contact-item-content"><span>TELEPON</span><strong>+62 895 2408 5083</strong></div><ArrowUpRight className="contact-arrow" size={19} /></a>
        <div className="contact-item"><div className="contact-icon"><MapPin size={21} strokeWidth={1.5} /></div><div className="contact-item-content"><span>ALAMAT</span><strong>Pulung, Ponorogo</strong><p>Jawa Timur, Indonesia</p></div></div>
        <div className="contact-item"><div className="contact-icon"><GraduationCap size={21} strokeWidth={1.5} /></div><div className="contact-item-content"><span>SEKOLAH</span><strong>SMKN 1 Jenangan</strong><p>XII Rekayasa Perangkat Lunak</p></div></div>
      </div>

      <a className="contact-store-cta" href="https://website-warih-sam.vercel.app/" target="_blank" rel="noreferrer">
        <div className="contact-icon"><Store size={21} strokeWidth={1.5} /></div>
        <div className="contact-item-content">
          <span>PROJECT TOKO ONLINE</span>
          <strong>Kunjungi WS Fashion</strong>
          <p>website-warih-sam.vercel.app</p>
        </div>
        <ArrowUpRight className="contact-arrow" size={19} />
      </a>

      <div className="contact-note"><div className="contact-note-number">10</div><div className="contact-note-content"><span>PORTFOLIO / 2026</span><p>Warih Seto Samudra — XII Rekayasa Perangkat Lunak, SMKN 1 Jenangan. PKL — PT INKA (Persero).</p></div></div>
    </section>
  );
}

export default Contact;
