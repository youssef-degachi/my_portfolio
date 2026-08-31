import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BsChevronDown } from "react-icons/bs";

/** Renders one FAQ answer block (schema in src/data/pricing.js → FAQ). */
const Block = ({ block }) => {
  switch (block.type) {
    case "ul":
      return (
        <ul className="flex flex-col gap-1.5">
          {block.items.map((it) => (
            <li key={it} className="flex items-start gap-2.5 text-white/70 text-sm leading-relaxed">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-default mt-[9px] shrink-0" aria-hidden />
              <span>{it}</span>
            </li>
          ))}
        </ul>
      );
    case "steps":
      return (
        <ol className="flex flex-col gap-4">
          {block.items.map((s, i) => (
            <li key={s.title} className="flex gap-4">
              <span className="text-2xl font-extrabold text-outline text-transparent leading-none w-9 shrink-0 pt-0.5">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <p className="font-semibold text-white mb-1">{s.title}</p>
                <p className="text-sm text-white/70 leading-relaxed">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      );
    case "note":
      return (
        <p className="text-sm text-white/80 leading-relaxed rounded-lg bg-accent-default/10 border border-accent-default/30 px-4 py-3">
          {block.text}
        </p>
      );
    default:
      return <p className="text-sm text-white/70 leading-relaxed">{block.text}</p>;
  }
};

const FaqItem = ({ item, open, onToggle }) => {
  const btnId = `faq-btn-${item.id}`;
  const panelId = `faq-panel-${item.id}`;
  return (
    <li className="border-b border-white/10">
      <h3>
        <button
          type="button"
          id={btnId}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
          className={`group w-full flex items-center justify-between gap-6 py-5 text-left transition-colors focus-visible:outline-none focus-visible:text-accent-default ${
            open ? "text-accent-default" : "text-white hover:text-accent-default"
          }`}
        >
          <span className="text-base xl:text-lg font-semibold leading-snug">{item.q}</span>
          <span
            className={`w-9 h-9 shrink-0 rounded-full border flex items-center justify-center transition-all duration-300 ${
              open
                ? "border-accent-default bg-accent-default text-primary rotate-180"
                : "border-white/15 text-white/60 group-hover:border-accent-default group-hover:text-accent-default"
            }`}
            aria-hidden
          >
            <BsChevronDown />
          </span>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="panel"
            id={panelId}
            role="region"
            aria-labelledby={btnId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pb-6 pr-2 xl:pr-16 flex flex-col gap-4">
              {item.a.map((block, i) => (
                <Block key={i} block={block} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
};

/** Accordion: one item open at a time. */
const Faq = ({ items }) => {
  const [openId, setOpenId] = useState(null);
  return (
    <ul className="border-t border-white/10">
      {items.map((item) => (
        <FaqItem key={item.id} item={item} open={openId === item.id} onToggle={() => setOpenId(openId === item.id ? null : item.id)} />
      ))}
    </ul>
  );
};

export default Faq;
