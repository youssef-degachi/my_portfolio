import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import VersionSwitcher from "@/versions/VersionSwitcher";

const LegacySite = lazy(() => import("@/LegacySite"));
const Versions = lazy(() => import("@/versions/Versions"));

// Each design is its own chunk, so one version never pays for another's libraries.
const DESIGNS = {
  v1: lazy(() => import("@/versions/v1/V1")),
  v2: lazy(() => import("@/versions/v2/V2")),
  v3: lazy(() => import("@/versions/v3/V3")),
  v4: lazy(() => import("@/versions/v4/V4")),
  v5: lazy(() => import("@/versions/v5/V5")),
  v6: lazy(() => import("@/versions/v6/V6")),
};

function App() {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <Suspense fallback={<div style={{ minHeight: "100vh", background: "#000" }} />}>
        <Routes>
          {Object.entries(DESIGNS).map(([id, Design]) => (
            <Route
              key={id}
              path={`/${id}/*`}
              element={
                <>
                  <Design />
                  <VersionSwitcher current={id} />
                </>
              }
            />
          ))}
          <Route path="/versions" element={<Versions />} />
          <Route path="/*" element={<LegacySite />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
