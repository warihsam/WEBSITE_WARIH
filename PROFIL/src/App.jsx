import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Professional from "./components/Professional";
import Education from "./components/Education";
import Experience from "./components/Experience";
import Project from "./components/Project";
import Technology from "./components/Technology";
import Learning from "./components/Learning";
import Activities from "./components/Activities";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Certificates from "./components/Certificates";
import Blog from "./components/Blog";

import "./App.css";

function App() {
  return (
    <>
      <Navbar />

      <main>
        {/* =========================
            00 — HOME
        ========================= */}
        <Hero />

        {/* =========================
            01 — ABOUT
        ========================= */}
        <About />

        {/* =========================
            02 — PROFESSIONAL PROFILE
        ========================= */}
        <Professional />

        {/* =========================
            03 — EDUCATION
        ========================= */}
        <Education />

        {/* =========================
            04 — EXPERIENCE
        ========================= */}
        <Experience />

        {/* =========================
            05 — PROJECTS
        ========================= */}
        <Project />

        {/* =========================
            06 — TECHNOLOGY
        ========================= */}
        <Technology />

        {/* =========================
            07 — LEARNING
        ========================= */}
        <Learning />

        {/* =========================
            08 — ACTIVITIES
        ========================= */}
        <Activities />
        {/* =========================
    09 — CERTIFICATES
========================= */}
<Certificates />

{/* =========================
    10 — BLOG
========================= */}
<Blog />

        {/* =========================
            09 — CONTACT
        ========================= */}
        <Contact />
      </main>

      <Footer />
    </>
  );
}

export default App;