import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { BsArrowRight, BsArrowLeft, BsCheck2, BsChevronDown } from "react-icons/bs";
import { Button } from "@/components/ui/button";
import { formatPrice, CONTACT_PATH, PAYMENT_SHORT } from "@/data/pricing";

/** true when the viewport matches `query` (SSR-safe, updates on resize). */
const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(() => typeof window !== "undefined" && window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = (e) => setMatches(e.matches);
    setMatches(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [query]);
  return matches;
};

const face =
  "flex flex-col p-7 xl:p-8 rounded-xl bg-[#232329] border border-white/5 transition-colors duration-300";

const featuredFace = "border-l-2 border-l-accent-default";

const SectionLabel = ({ children }) => (
  <p className="text-[11px] uppercase tracking-[3px] text-accent-default mb-2">{children}</p>
);

// --- Front --------------------------------------------------------------------
const Front = ({ offer, currency, expanded, onToggle, active, toggleId, detailsId, mobile }) => (
  <div
    className={`${face} ${offer.featured ? featuredFace : ""} ${
      mobile ? "" : "cursor-pointer hover:border-accent-default/40"
    } h-full`}
    onClick={mobile ? undefined : onToggle}
    aria-hidden={!active}
  >
    {/* top row: outlined number + badge */}
    <div className="flex items-center justify-between mb-5">
      <span className="text-4xl font-extrabold text-outline text-transparent leading-none">{offer.num}</span>
      {offer.badge && (
        <span className="text-[10px] uppercase tracking-wider rounded-full px-2.5 py-0.5 bg-accent-default/15 text-accent-default border border-accent-default/30">
          {offer.badge}
        </span>
      )}
    </div>

    <h3 className="text-2xl font-bold leading-tight mb-3">{offer.name}</h3>
    <p className="text-lg text-white/90 leading-snug mb-3">{offer.headline}</p>
    <p className="text-sm text-white/55 leading-relaxed mb-6">{offer.description}</p>

    <ul className="flex flex-col gap-2 mb-8">
      {offer.benefits.map((b) => (
        <li key={b} className="flex items-start gap-2.5 text-sm text-white/80">
          <BsCheck2 className="text-accent-default mt-1 shrink-0" aria-hidden />
          <span>{b}</span>
        </li>
      ))}
    </ul>

    {/* price block pinned to the bottom */}
    <div className="mt-auto pt-6 border-t border-white/10">
      <p className="text-[11px] uppercase tracking-[3px] text-white/45 mb-1">Starting from</p>
      <p className="text-4xl xl:text-[42px] font-bold leading-none mb-2">
        {formatPrice(offer.priceUSD, currency)}
        {currency.code !== "USD" && <span className="text-sm text-white/40 font-normal ml-2">≈ ${offer.priceUSD.toLocaleString("en-US")}</span>}
      </p>
      <p className="text-xs text-white/50 mb-5">{offer.timeline}</p>

      <button
        type="button"
        id={toggleId}
        aria-expanded={expanded}
        aria-controls={detailsId}
        tabIndex={active ? 0 : -1}
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        className="group inline-flex items-center gap-2 text-sm font-medium text-accent-default rounded-full px-1 py-1 -mx-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-default/60"
      >
        {mobile ? (
          <>
            {expanded ? "Hide details" : "Tap to see more details"}
            <BsChevronDown className={`transition-transform duration-300 ${expanded ? "rotate-180" : ""}`} aria-hidden />
          </>
        ) : (
          <>
            Click to see more details
            <BsArrowRight className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
          </>
        )}
      </button>
    </div>
  </div>
);

// --- Details (back of the card / expanded panel) --------------------------------
const List = ({ items }) => (
  <ul className="flex flex-col gap-1.5">
    {items.map((it) => (
      <li key={it} className="flex items-start gap-2.5 text-sm text-white/75 leading-relaxed">
        <span className="w-1.5 h-1.5 rounded-full bg-accent-default mt-[9px] shrink-0" aria-hidden />
        <span>{it}</span>
      </li>
    ))}
  </ul>
);

const Details = ({ offer, currency, onBack, active, detailsId, toggleId, mobile }) => {
  const { details } = offer;
  return (
    <div
      id={detailsId}
      role="region"
      aria-labelledby={toggleId}
      aria-hidden={!active}
      className={`${mobile ? "pt-6 mt-6 border-t border-white/10" : `${face} ${offer.featured ? featuredFace : ""} h-full`}`}
    >
      {!mobile && (
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm font-semibold">{offer.name}</p>
          <button
            type="button"
            onClick={onBack}
            tabIndex={active ? 0 : -1}
            className="inline-flex items-center gap-1.5 text-xs text-white/60 hover:text-accent-default transition-colors rounded-full px-1 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-default/60"
          >
            <BsArrowLeft aria-hidden /> Back
          </button>
        </div>
      )}

      <p className="text-sm text-white/80 leading-relaxed mb-6">{details.intro}</p>

      <div className="mb-6">
        <SectionLabel>What&apos;s included</SectionLabel>
        <List items={details.included} />
      </div>

      <div className="mb-6">
        <SectionLabel>Typical use cases</SectionLabel>
        <List items={details.useCases} />
      </div>

      <div className="mb-6">
        <SectionLabel>Good to know</SectionLabel>
        <ul className="flex flex-col gap-2">
          {details.notes.map((n) => (
            <li key={n} className="text-xs text-white/55 leading-relaxed border-l border-white/15 pl-3">
              {n}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-auto pt-5 border-t border-white/10">
        <p className="text-xs text-white/60 mb-1">
          <span className="text-white/40">Starting from </span>
          <span className="text-white font-semibold">{formatPrice(offer.priceUSD, currency)}</span>
          <span className="text-white/40"> · {offer.timeline}</span>
        </p>
        <p className="text-xs text-white/50 mb-5">
          <span className="text-white/40">Payment: </span>
          {PAYMENT_SHORT}
        </p>
        <Button asChild className="w-full">
          <Link to={CONTACT_PATH} tabIndex={active ? 0 : -1}>
            Discuss Your Project
          </Link>
        </Button>
      </div>
    </div>
  );
};

// --- Card ---------------------------------------------------------------------
/**
 * Desktop (md+): 3D flip. The front stays in normal flow (it defines the card's
 * height at rest); the back is absolutely positioned and, when flipped, the card
 * animates its min-height to the back's measured height so nothing overflows or
 * leaves a gap. Mobile: the details expand below the front (a flip is awkward to
 * read/scroll on touch).
 */
const PricingCard = ({ offer, currency }) => {
  const [open, setOpen] = useState(false);
  const [backHeight, setBackHeight] = useState(0);
  const backRef = useRef(null);
  const mobile = !useMediaQuery("(min-width: 768px)");
  const uid = useId();
  const toggleId = `pricing-toggle-${uid}`;
  const detailsId = `pricing-details-${uid}`;
  const toggle = () => setOpen((v) => !v);

  // measure the back face whenever it becomes visible or its content changes
  useLayoutEffect(() => {
    if (!mobile && open && backRef.current) setBackHeight(backRef.current.offsetHeight);
  }, [open, currency, mobile]);

  if (mobile) {
    return (
      <article className={`${face} ${offer.featured ? featuredFace : ""} !p-0`}>
        <Front
          offer={offer}
          currency={currency}
          expanded={open}
          onToggle={toggle}
          active
          toggleId={toggleId}
          detailsId={detailsId}
          mobile
        />
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key="details"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="overflow-hidden px-7"
            >
              <div className="pb-7">
                <Details offer={offer} currency={currency} active detailsId={detailsId} toggleId={toggleId} mobile />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </article>
    );
  }

  return (
    <article className="h-full [perspective:1800px]">
      <motion.div
        className="relative h-full"
        style={{ transformStyle: "preserve-3d" }}
        initial={false}
        animate={{ rotateY: open ? 180 : 0, minHeight: open ? `${backHeight}px` : "0px" }}
        transition={{ duration: 0.65, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="h-full [backface-visibility:hidden] [-webkit-backface-visibility:hidden]">
          <Front
            offer={offer}
            currency={currency}
            expanded={open}
            onToggle={toggle}
            active={!open}
            toggleId={toggleId}
            detailsId={detailsId}
          />
        </div>
        <div
          ref={backRef}
          className="absolute top-0 left-0 w-full min-h-full [backface-visibility:hidden] [-webkit-backface-visibility:hidden] [transform:rotateY(180deg)]"
        >
          <Details
            offer={offer}
            currency={currency}
            onBack={toggle}
            active={open}
            detailsId={detailsId}
            toggleId={toggleId}
          />
        </div>
      </motion.div>
    </article>
  );
};

export default PricingCard;
