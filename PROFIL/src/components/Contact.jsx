import { Mail, MapPin, ArrowUpRight } from "lucide-react";

function Contact() {
  return (
    <section className="contact-section" id="contact">
      <div className="section-number">09</div>

      <div className="section-heading">
        <p>CONTACT</p>

        <h2>
          Let's Build
          <br />
          Something
          <br />
          <em>Useful.</em>
        </h2>
      </div>

      <div className="contact-grid">
        <div className="contact-item">
          <Mail />
          <div>
            <span>EMAIL</span>
            <p>warihazt@gmail.com</p>
          </div>
        </div>

        <div className="contact-item">
          <MapPin />
          <div>
            <span>LOCATION</span>
            <p>Ponorogo, Jawa Timur</p>
          </div>
        </div>
      </div>

      <a
        href="https://website-warih-sam.vercel.app/"
        className="store-link"
      >
        <span>VISIT WS FASHION</span>

        <ArrowUpRight />
      </a>
    </section>
  );
}

export default Contact;