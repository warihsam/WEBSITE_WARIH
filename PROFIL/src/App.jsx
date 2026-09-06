import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Backgroundd from "./components/Backgroundd";
import Project from "./components/Project";
import Technology from "./components/Technology";
import System from "./components/System";
import Result from "./components/Result";
import Learning from "./components/Learning";
import Industry from "./components/Industry";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

import "./App.css";

function App() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <About />
        <Backgroundd />
        <Project />
        <Technology />
        <System />
        <Result />
        <Learning />
        <Industry />
        <Contact />
      </main>

      <Footer />
    </>
  );
}

export default App;