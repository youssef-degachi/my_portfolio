import { BsArrowUpRight, BsGithub, BsStarFill } from "react-icons/bs";
import { WORK_KIND, KIND_META, tagsOf, blurbOf } from "@/data/work";

/**
 * One card for every project in the library (products, client work, open source).
 * - has an image  → real screenshot cover
 * - no image      → generated gradient cover with the letter mark
 * Open-source items get a green badge + a GitHub action (and ⭐ stars when set).
 */

const kindBadge = {
  accent: "bg-accent-default/15 text-accent-default border-accent-default/30",
  neutral: "bg-white/5 text-white/60 border-white/15",
  provision: "bg-provision-default/15 text-provision-default border-provision-default/30",
};

// deterministic gradient for cover-less cards (stable per id)
const GRADIENTS = [
  "from-[#F13024]/25 via-[#232329] to-[#1C1C22]",
  "from-[#00ff99]/20 via-[#232329] to-[#1C1C22]",
  "from-[#3b5bdb]/25 via-[#232329] to-[#1C1C22]",
  "from-[#f59f00]/20 via-[#232329] to-[#1C1C22]",
];
const gradientFor = (id = "") =>
  GRADIENTS[[...id].reduce((n, c) => n + c.charCodeAt(0), 0) % GRADIENTS.length];

const Cover = ({ item }) => {
  const isOSS = item.kind === WORK_KIND.OPEN_SOURCE;
  if (item.image) {
    return (
      <div className="relative aspect-[16/10] overflow-hidden bg-black/30">
        <img
          src={item.image}
          alt={`${item.title} preview`}
          loading="lazy"
          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C22]/70 via-transparent to-transparent" />
      </div>
    );
  }
  return (
    <div className={`relative aspect-[16/10] overflow-hidden bg-gradient-to-br ${gradientFor(item.id)} flex items-center justify-center`}>
      {/* faint grid texture */}
      <div
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.15) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.15) 1px,transparent 1px)",
          backgroundSize: "26px 26px",
        }}
        aria-hidden
      />
      <span
        className={`relative text-6xl font-extrabold ${
          isOSS ? "text-provision-default" : "text-accent-default"
        } text-outline text-transparent`}
        style={{ WebkitTextStroke: `1.5px ${isOSS ? "#00ff99" : "#F13024"}` }}
      >
        {item.mark || item.title?.[0] || "•"}
      </span>
    </div>
  );
};

const Actions = ({ item }) => {
  const isOSS = item.kind === WORK_KIND.OPEN_SOURCE;
  const liveLabel = isOSS ? "Live demo" : "Visit";
  return (
    <div className="flex items-center gap-4 mt-5 pt-5 border-t border-white/10">
      {item.live && (
        <a
          href={item.live}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-1.5 text-sm font-medium transition-colors ${
            item.github ? "text-white/70 hover:text-accent-default" : "text-accent-default hover:text-accent-hover"
          }`}
        >
          {liveLabel} <BsArrowUpRight aria-hidden />
        </a>
      )}
      {item.github && (
        <a
          href={item.github}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-provision-default hover:brightness-125 transition"
        >
          <BsGithub aria-hidden /> Code
          {typeof item.stars === "number" && (
            <span className="inline-flex items-center gap-1 text-xs text-white/50 ml-1">
              <BsStarFill className="text-[10px]" aria-hidden /> {item.stars}
            </span>
          )}
        </a>
      )}
      {!item.live && !item.github && (
        <span className="text-sm text-white/35">Private / NDA — no public link</span>
      )}
    </div>
  );
};

const ProjectCard = ({ item }) => {
  const meta = KIND_META[item.kind] || {};
  const tags = tagsOf(item);
  const blurb = blurbOf(item);
  return (
    <article className="group flex flex-col rounded-xl overflow-hidden bg-[#232329] border border-white/5 hover:border-accent-default/40 hover:-translate-y-1 transition-[border-color,transform] duration-300">
      <Cover item={item} />

      <div className="flex flex-col flex-1 p-6">
        {/* badges — kind badge only for open source; products/client stay uniform */}
        {(item.kind === WORK_KIND.OPEN_SOURCE || item.category || item.nda) && (
          <div className="flex items-center gap-2 flex-wrap mb-3">
            {item.kind === WORK_KIND.OPEN_SOURCE && (
              <span className={`text-[10px] uppercase tracking-wider rounded-full px-2.5 py-0.5 border ${kindBadge.provision}`}>
                {meta.label}
              </span>
            )}
            {item.category && (
              <span className="text-[10px] uppercase tracking-wider rounded-full px-2.5 py-0.5 border border-white/10 text-white/50">
                {item.category}
              </span>
            )}
            {item.nda && (
              <span className="text-[10px] uppercase tracking-wider rounded-full px-2.5 py-0.5 border border-white/10 text-white/40">
                NDA
              </span>
            )}
          </div>
        )}

        <h3 className="text-xl font-bold leading-snug mb-2 group-hover:text-accent-default transition-colors">
          {item.title}
        </h3>
        {blurb && <p className="text-sm text-white/60 leading-relaxed mb-4">{blurb}</p>}
        {item.role && <p className="text-xs text-white/40 mb-4">{item.role}</p>}

        {tags.length > 0 && (
          <ul className="flex flex-wrap gap-1.5 mt-auto">
            {tags.map((t) => (
              <li
                key={t}
                className="text-[11px] uppercase tracking-wide text-accent-default/90 border border-accent-default/25 rounded-full px-2.5 py-0.5"
              >
                {t}
              </li>
            ))}
          </ul>
        )}

        <Actions item={item} />
      </div>
    </article>
  );
};

export default ProjectCard;
