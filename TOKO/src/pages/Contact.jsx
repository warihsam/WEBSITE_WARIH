import { Mail, MapPin, MessageCircle } from "lucide-react";

const waNumber = import.meta.env.VITE_WHATSAPP_NUMBER || "";

export default function Contact() {
  const waHref = waNumber && !waNumber.includes("X") ? `https://wa.me/${waNumber}` : "#";
  return (
    <main className="page">
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">CONTACT / 10</p>
          <h1>LET'S TALK.</h1>
          <p>Punya pertanyaan tentang produk atau pesanan? Hubungi WS FASHION.</p>
        </div>
      </section>
      <section className="section">
        <div className="container contact-grid">
          <div>
            <p className="eyebrow">GET IN TOUCH</p>
            <h2>We'd love to hear from you.</h2>
          </div>
          <div className="contact-list">
            <a href={waHref} className="contact-item"><MessageCircle /><div><small>WHATSAPP</small><strong>{waNumber || "Atur nomor WhatsApp di .env"}</strong></div></a>
            <div className="contact-item"><Mail /><div><small>EMAIL</small><strong>warihazt@gmail.com</strong></div></div>
            <div className="contact-item"><MapPin /><div><small>LOCATION</small><strong>Indonesia</strong></div></div>
          </div>
        </div>
      </section>
    </main>
  );
}
