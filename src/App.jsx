import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const Site = lazy(() => import("@/versions/v3/V3"));

function App() {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <Suspense fallback={<div style={{ minHeight: "100vh", background: "#020205" }} />}>
        <Routes>
          <Route path="/*" element={<Site />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
