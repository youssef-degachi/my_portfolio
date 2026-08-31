import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProjectCard from "@/components/ProjectCard";
import { visibleWork, LIBRARY_KINDS, KIND_META, countByKind } from "@/data/work";

const chip = (active) =>
  `text-sm rounded-full px-4 py-2 border transition-colors ${
    active
      ? "bg-accent-default text-primary border-accent-default"
      : "border-white/10 text-white/60 hover:text-white hover:border-white/30"
  }`;

const Work = () => {
  const [filter, setFilter] = useState("all");
  const all = useMemo(() => visibleWork(), []);
  const kinds = LIBRARY_KINDS.filter((k) => countByKind(k) > 0);
  const shown = filter === "all" ? all : all.filter((i) => i.kind === filter);

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { delay: 1.4, duration: 0.4, ease: "easeIn" } }}
      className="min-h-[80vh] py-12 xl:py-16"
    >
      <div className="container mx-auto">
        {/* ---- header ---------------------------------------------------- */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-[11px] uppercase tracking-[4px] text-accent-default mb-4">Project library</p>
          <h1 className="h2 mb-4">
            My work<span className="text-accent-default">.</span>
          </h1>
          <p className="text-white/60">
            Everything I&apos;ve built — products I co-founded, client work, and open-source projects. Browse the
            whole library or filter by type.
          </p>
        </div>

        {/* ---- filter chips ---------------------------------------------- */}
        <div className="flex flex-wrap justify-center gap-2.5 mb-12">
          <button type="button" onClick={() => setFilter("all")} className={chip(filter === "all")}>
            All <span className={`ml-1.5 text-xs ${filter === "all" ? "text-primary/70" : "text-white/40"}`}>{all.length}</span>
          </button>
          {kinds.map((k) => (
            <button key={k} type="button" onClick={() => setFilter(k)} className={chip(filter === k)}>
              {KIND_META[k].label}
              <span className={`ml-1.5 text-xs ${filter === k ? "text-primary/70" : "text-white/40"}`}>{countByKind(k)}</span>
            </button>
          ))}
        </div>

        {/* ---- grid ------------------------------------------------------ */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 xl:gap-8">
          <AnimatePresence mode="popLayout">
            {shown.map((item) => (
              <motion.div
                key={item.id || item.num || item.title}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.3 }}
              >
                <ProjectCard item={item} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {shown.length === 0 && (
          <p className="text-center text-white/40 py-16">Nothing here yet — coming soon.</p>
        )}
      </div>
    </motion.section>
  );
};

export default Work;
