import { Routes, Route } from "react-router-dom";
import Header from "@/components/Header";
import ParticlesContainer from "@/components/ParticlesContainer";

import Home from "@/pages/Home";
import Services from "@/pages/Services";
import Pricing from "@/pages/Pricing";
import Resume from "@/pages/Resume";
import Work from "@/pages/Work";
import Contact from "@/pages/Contact";

/** The current site, unchanged. Lives in its own chunk so /v1…/v6 don't download tsparticles. */
export default function LegacySite() {
  return (
    <div className="font-jetbrains-mono min-h-screen w-full bg-primary relative">
      <ParticlesContainer className="absolute top-0 left-0 w-full h-full opacity-20 z-index-negative-2 pointer-events-none" />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/resume" element={<Resume />} />
        <Route path="/work" element={<Work />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </div>
  );
}
