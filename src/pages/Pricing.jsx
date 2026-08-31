import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";
import { BsArrowUpRight } from "react-icons/bs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PricingCard from "@/components/PricingCard";
import Faq from "@/components/Faq";
import {
  OFFERS,
  FAQ,
  CURRENCIES,
  BASE_CURRENCY,
  RATES_UPDATED,
  currencyByCode,
  PRICING_DISCLAIMER,
  CURRENCY_NOTE,
  WHATSAPP_URL,
  CONTACT_PATH,
} from "@/data/pricing";

const fadeIn = (delay) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { delay, duration: 0.4 } },
});

const Pricing = () => {
  const [code, setCode] = useState(BASE_CURRENCY);
  const currency = currencyByCode(code);

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { delay: 1.4, duration: 0.4, ease: "easeIn" } }}
      className="py-6 xl:py-10"
    >
      <div className="container mx-auto">
        {/* ---- intro ---------------------------------------------------- */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-[11px] uppercase tracking-[4px] text-accent-default mb-4">Custom AI &amp; web solutions</p>
          <h1 className="h2 mb-4">
            Pricing<span className="text-accent-default">.</span>
          </h1>
          <p className="text-white/60">
            Every project is custom, so every price here is a <span className="text-white">starting point</span> — we agree on
            the final scope and price after a discovery meeting. No fixed packages, no surprises.
          </p>
        </div>

        {/* ---- currency selector ----------------------------------------- */}
        <div className="flex flex-col items-center gap-2 mb-10">
          <div className="flex items-center gap-3">
            <label htmlFor="pricing-currency" className="text-sm text-white/60">
              Show prices in
            </label>
            <Select value={code} onValueChange={setCode}>
              <SelectTrigger id="pricing-currency" aria-label="Currency" className="w-[150px] h-[42px] py-0 rounded-full text-white bg-[#232329]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((c) => (
                  <SelectItem key={c.code} value={c.code}>
                    {c.code} ({c.symbol})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {code !== BASE_CURRENCY && (
            <p className="text-xs text-white/45 text-center max-w-xl">
              {CURRENCY_NOTE} <span className="text-white/30">Rates: {RATES_UPDATED}.</span>
            </p>
          )}
        </div>

        {/* ---- offers ---------------------------------------------------- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 xl:gap-8 mb-8">
          {OFFERS.map((offer, i) => (
            <motion.div key={offer.id} {...fadeIn(1.6 + i * 0.1)} className="h-full">
              <PricingCard offer={offer} currency={currency} />
            </motion.div>
          ))}
        </div>

        {/* ---- disclaimer ------------------------------------------------ */}
        <motion.div {...fadeIn(2.0)} className="max-w-3xl mx-auto text-center mb-20 xl:mb-28">
          <p className="text-sm text-white/70 leading-relaxed rounded-xl border border-white/10 bg-[#232329] px-6 py-4">
            <span className="text-accent-default font-semibold">Starting prices. </span>
            {PRICING_DISCLAIMER}
          </p>
          {code !== BASE_CURRENCY && <p className="text-xs text-white/40 mt-3">{CURRENCY_NOTE}</p>}
        </motion.div>

        {/* ---- WhatsApp CTA ---------------------------------------------- */}
        <motion.div
          {...fadeIn(2.1)}
          className="rounded-xl bg-accent-default/10 border border-accent-default/40 px-8 py-10 xl:px-14 xl:py-12 flex flex-col xl:flex-row items-center justify-between gap-6 text-center xl:text-left mb-20 xl:mb-28"
        >
          <div>
            <h2 className="h3 mb-2">Have questions?</h2>
            <p className="text-white/60">Let&apos;s talk about your project and find the right solution for your business.</p>
          </div>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="shrink-0">
            <Button size="lg" className="gap-3">
              <FaWhatsapp className="text-xl" aria-hidden /> Contact Me on WhatsApp
            </Button>
          </a>
        </motion.div>

        {/* ---- FAQ ------------------------------------------------------- */}
        <motion.div {...fadeIn(2.2)} className="max-w-3xl mx-auto mb-20 xl:mb-28">
          <div className="text-center mb-8">
            <h2 className="h2 mb-3">
              FAQ<span className="text-accent-default">.</span>
            </h2>
            <p className="text-white/60">How we work together — steps, payment, delivery and what happens after.</p>
          </div>
          <Faq items={FAQ} />
        </motion.div>

        {/* ---- final CTA ------------------------------------------------- */}
        <motion.div {...fadeIn(2.3)} className="text-center max-w-2xl mx-auto pb-10">
          <h2 className="h2 mb-4">Have a project in mind?</h2>
          <p className="text-white/60 mb-8">
            Tell me what you want to build, and we&apos;ll discuss the best solution for your business.
          </p>
          <Button asChild size="lg" className="gap-3">
            <Link to={CONTACT_PATH}>
              Discuss Your Project <BsArrowUpRight aria-hidden />
            </Link>
          </Button>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Pricing;
