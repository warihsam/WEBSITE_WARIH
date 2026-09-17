import {
  Award,
  CalendarDays,
  ExternalLink,
  FileCheck2,
} from "lucide-react";

import "./Certificates.css";

const certificates = [
  {
    title: "Sertifikat Praktik Kerja Lapangan",
    issuer: "PT INKA (Persero) Madiun",
    description:
      "Dokumentasi sertifikat atas pelaksanaan Praktik Kerja Lapangan di lingkungan industri.",
    category: "PKL / INDUSTRY",
    image: "/certificates/sertifikat-pkl-pt-inka.png",
  },
  {
    title: "Sertifikat Kunjungan Industri",
    issuer: "Gamelab Salatiga",
    description:
      "Dokumentasi sertifikat kegiatan kunjungan industri sebagai bagian dari pengenalan lingkungan dan proses kerja industri.",
    category: "INDUSTRY VISIT",
    image:"/certificates/sertifikat-kunjungan-gamelab.png",
  },
];

function Certificates() {
  return (
    <section className="certificates" id="certificates">
      <div className="certificates-container">

        <div className="certificates-header">
          <div className="certificates-eyebrow">
            <span />
            CERTIFICATES / 09
          </div>

          <h2>
            Sertifikat &
            <span> Dokumentasi.</span>
          </h2>

          <p>
            Sertifikat yang mendokumentasikan pengalaman belajar dan kegiatan
            yang relevan dengan perjalanan saya sebagai siswa RPL.
          </p>
        </div>

        <div className="certificates-grid">
          {certificates.map((certificate, index) => (
            <article
              className="certificate-card"
              key={certificate.title}
            >
              <div className="certificate-preview">
                <img
                  src={certificate.image}
                  alt={certificate.title}
                  loading="lazy"
                />

                <div className="certificate-category">
                  {certificate.category}
                </div>

                <div className="certificate-number">
                  {String(index + 1).padStart(2, "0")}
                </div>
              </div>

              <div className="certificate-content">

                <div className="certificate-meta">
                  <span>
                    <CalendarDays size={14} />
                    Dokumentasi
                  </span>

                  <span>
                    <FileCheck2 size={14} />
                    Dokumen
                  </span>
                </div>

                <h3>{certificate.title}</h3>

                <div className="certificate-issuer">
                  {certificate.issuer}
                </div>

                <p>{certificate.description}</p>

                <a
                  className="certificate-link"
                  href={certificate.image}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span>LIHAT SERTIFIKAT</span>
                  <ExternalLink size={15} />
                </a>
              </div>
            </article>
          ))}
        </div>

        <div className="certificates-footer">
          <div className="certificate-footer-line">
            <Award size={18} />
          </div>

          <div className="certificates-footer-content">
            <span>DOCUMENTATION</span>

            <p>
              Dokumentasi sertifikat menjadi bukti pendukung pengalaman
              pembelajaran dan kegiatan yang telah diikuti.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}

export default Certificates;