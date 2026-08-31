import { useMemo } from "react";
import { motion } from "framer-motion";
import ProjectCard from "@/components/ProjectCard";
import { visibleWork } from "@/data/work";

const Work = () => {
  const all = useMemo(() => visibleWork(), []);

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { delay: 1.4, duration: 0.4, ease: "easeIn" } }}
      className="min-h-[80vh] py-12 xl:py-16"
    >
      <div className="container mx-auto">
        {/* ---- header ---------------------------------------------------- */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-[11px] uppercase tracking-[4px] text-accent-default mb-4">Project library</p>
          <h1 className="h2 mb-4">
            My work<span className="text-accent-default">.</span>
          </h1>
          <p className="text-white/60">
            Everything I&apos;ve built — products, client work, and open-source projects, all in one place.
          </p>
        </div>

        {/* ---- grid ------------------------------------------------------ */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 xl:gap-8">
          {all.map((item, i) => (
            <motion.div
              key={item.id || item.num || item.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 1.5 + i * 0.06, duration: 0.35 } }}
            >
              <ProjectCard item={item} />
            </motion.div>
          ))}
        </div>

        {all.length === 0 && <p className="text-center text-white/40 py-16">Nothing here yet — coming soon.</p>}
      </div>
    </motion.section>
  );
};

export default Work;
