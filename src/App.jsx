import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from "@/components/Header";
import PageTransition from "@/components/PageTransition";
import StairTransition from "@/components/StairTransition";
import ParticlesContainer from "@/components/ParticlesContainer";

// Pages
import Home from "@/pages/Home";
import Services from "@/pages/Services";
import Resume from "@/pages/Resume";
import Work from "@/pages/Work";
import Contact from "@/pages/Contact";

function App() {
  return (
    <Router>
      <div className="font-jetbrains-mono min-h-screen w-full bg-primary relative">
        <ParticlesContainer className="absolute top-0 left-0 w-full h-full opacity-20 z-index-negative-2 pointer-events-none" />
        <Header />
        {/* <StairTransition/> */}
        {/* <PageTransition> */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/resume" element={<Resume />} />
          <Route path="/work" element={<Work />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
        {/* </PageTransition> */}
      </div>
    </Router>
  );
}

export default App;

