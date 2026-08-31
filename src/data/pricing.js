/**
 * Pricing page content — offers, currencies, FAQ. Plain data; components in
 * src/components/PricingCard.jsx, src/components/Faq.jsx, page in src/pages/Pricing.jsx.
 *
 * Every price is a STARTING price in USD; conversions are approximate only.
 */

// Same number as Header.jsx / MobileNav.jsx / Contact.jsx — change it there too.
export const WHATSAPP_URL = "https://wa.me/21650702320";
export const CONTACT_PATH = "/contact";

export const PRICING_DISCLAIMER =
  "These are starting prices, not fixed project prices. Final pricing depends on your requirements, project scope, integrations, and complexity.";

export const CURRENCY_NOTE =
  "Prices in other currencies are approximate conversions. Final project pricing is agreed upon based on the selected payment currency and project requirements.";

// --- Currencies ---------------------------------------------------------------
// No live exchange-rate API in this project (static site) → static approximate
// rates, USD is the base. Update the numbers + RATES_UPDATED when needed.
export const BASE_CURRENCY = "USD";
export const RATES_UPDATED = "Aug 2026";
export const CURRENCIES = [
  { code: "USD", symbol: "$", name: "US Dollar", rate: 1 },
  { code: "EUR", symbol: "€", name: "Euro", rate: 0.92 },
  { code: "GBP", symbol: "£", name: "British Pound", rate: 0.79 },
  { code: "SAR", symbol: "﷼", name: "Saudi Riyal", rate: 3.75 },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan", rate: 7.2 },
  { code: "RUB", symbol: "₽", name: "Russian Ruble", rate: 90 },
];

export const currencyByCode = (code) => CURRENCIES.find((c) => c.code === code) || CURRENCIES[0];

/** Approximate converted amount, rounded to a "clean" number (nearest 10, or 100 above 10k). */
export function convertPrice(usd, currency) {
  const raw = usd * currency.rate;
  const step = raw >= 10000 ? 100 : 10;
  return Math.round(raw / step) * step;
}

export function formatPrice(usd, currency) {
  const amount = convertPrice(usd, currency);
  return `${currency.symbol}${new Intl.NumberFormat("en-US").format(amount)}`;
}

// --- Offers -------------------------------------------------------------------
export const OFFERS = [
  {
    id: "voice-agent",
    num: "01",
    name: "Voice AI Agent",
    headline: "Turn missed calls into handled conversations.",
    description:
      "An AI voice agent that talks with your customers, answers questions, qualifies leads, books appointments and handles the custom tasks your business needs.",
    benefits: [
      "Answer customer questions",
      "Book appointments",
      "Qualify leads",
      "Customer support",
      "Custom functions for your business",
    ],
    priceUSD: 1000,
    timeline: "Typical timeline: 2–4+ weeks, depending on project requirements.",
    details: {
      intro:
        "Every project starts with a discovery meeting. From there I build the agent around your real call flow — the questions people actually ask, the actions they expect, and the tone that fits your brand. The final solution is customized after that meeting, not picked from a menu.",
      included: [
        "Discovery meeting and call-flow design",
        "Custom AI prompt written for your business",
        "Custom functions: booking, lead capture, FAQs, hand-off to a human…",
        "Testing with real scenarios before launch",
        "Walkthrough so you can manage the prompt and functions yourself afterwards",
      ],
      useCases: [
        "After-hours and overflow calls that would otherwise be missed",
        "Booking and rescheduling appointments",
        "Qualifying inbound leads before a human follows up",
        "First-line customer support",
      ],
      notes: [
        "CRM and other integrations are scoped during discovery — some platforms restrict external services or need access/configuration on your side.",
        "Phone numbers, telephony and AI usage are billed separately (see FAQ).",
      ],
    },
  },
  {
    id: "ai-chatbot",
    num: "02",
    name: "AI Chatbot",
    headline: "Turn your website or WhatsApp into a 24/7 AI assistant.",
    description:
      "Custom AI chatbots that answer customer questions, support your customers, qualify leads and handle the tasks your business needs — on your website, on WhatsApp, or both.",
    benefits: [
      "Website AI chatbot",
      "WhatsApp AI chatbot",
      "Answer customer questions",
      "Lead qualification",
      "Customer support",
      "Custom functionality for your needs",
    ],
    priceUSD: 600,
    timeline: "Typical timeline: 2–4+ weeks, depending on project complexity.",
    details: {
      intro:
        "The exact functionality depends on your project — we define it together in the discovery meeting. The chatbot learns your business, speaks in your tone, and can take actions instead of only answering.",
      included: [
        "Discovery meeting and conversation design",
        "Website chatbot, WhatsApp chatbot, or both",
        "Custom prompt + knowledge about your products and services",
        "Custom functions: lead capture, FAQs, hand-off to your team…",
        "Walkthrough so you can change the prompt and functions after delivery",
      ],
      useCases: [
        "Answering product and service questions instantly",
        "Collecting and qualifying leads from your website",
        "Supporting customers directly on WhatsApp",
        "Guiding visitors to the right offer, page or booking",
      ],
      notes: [
        "WhatsApp Business API access and messaging fees are separate from development.",
        "Integrations with other tools are discussed during planning — some require your own accounts or permissions.",
      ],
    },
  },
  {
    id: "web-application",
    num: "03",
    name: "Custom Web Application",
    headline: "Turn your business process into a custom application built around the way you work.",
    description:
      "Custom web applications and business systems — dashboards, portals, management tools, SaaS — built for your workflow instead of a template you have to adapt to.",
    benefits: [
      "Built around your process, not a template",
      "Dashboards, portals, management systems, SaaS",
      "Secure login and role-based access",
      "API-based and ready to integrate",
      "Source code handed over after final payment",
    ],
    priceUSD: 3000,
    timeline: "Starting from 3+ weeks — the final timeline depends on scope and complexity.",
    details: {
      intro:
        "We start with a discovery meeting, organise the requirements, and you review a prototype before full development continues. You get a system that matches how your team actually works.",
      included: [
        "Discovery meeting and requirements planning",
        "Prototype you review before development continues",
        "Development, internal testing, then your review period",
        "Source code and project files after final payment",
        "7-day Review & Adjustment period after delivery",
      ],
      useCases: [
        "SaaS platforms and customer portals",
        "Business dashboards and management systems",
        "Internal tools and booking systems",
        "API-based and other custom web applications",
      ],
      notes: [
        "Web applications are the primary offer. Mobile apps can be discussed as a separate custom project — App Store publishing is not a standard service.",
        "Hosting, domains and third-party services are not included by default (see FAQ).",
      ],
    },
  },
  {
    id: "complete-solution",
    num: "04",
    name: "Complete AI Business Solution",
    headline: "Everything you need to automate, engage, and convert more customers — in one complete solution.",
    description:
      "Voice AI Agent + AI Chatbot + Custom Web Application, designed together so your calls, chats and back-office run as one system.",
    benefits: [
      "Voice AI Agent for your calls",
      "AI Chatbot for website & WhatsApp",
      "Custom web application / dashboard",
      "One consistent system, not three tools",
      "Scope defined together after discovery",
    ],
    priceUSD: 4000,
    timeline: "Timeline: Based on project scope",
    featured: true,
    badge: "Combined offer",
    details: {
      intro:
        "This combines the three services above into one project with one design, one set of prompts and one place to manage everything. The final scope is defined after the discovery meeting.",
      included: [
        "Voice AI Agent",
        "AI Chatbot (website and/or WhatsApp)",
        "Custom web application to run and manage it all",
        "Discovery meeting to define the exact scope",
        "Consistent branding, prompts and data across everything",
      ],
      useCases: [
        "Clinics, agencies and service businesses handling calls, chats and bookings",
        "Businesses replacing scattered tools with one system",
        "Teams that want automation and a place to manage it",
      ],
      notes: [
        "$4,000 is a starting price, not a package price — the final price and scope depend on requirements, features, integrations, complexity and project size.",
        "Not every possible feature is included; the discovery meeting defines what gets built.",
      ],
    },
  },
];

export const PAYMENT_SHORT = "20% upfront to start · the rest in milestones agreed after the discovery meeting.";

// --- FAQ ----------------------------------------------------------------------
// Answer blocks: { type: "p", text } | { type: "ul", items } | { type: "steps", items: [{ title, text }] }
// | { type: "note", text }
export const FAQ = [
  {
    id: "steps",
    q: "What are the steps?",
    a: [
      {
        type: "steps",
        items: [
          {
            title: "Discovery & Planning",
            text: "We start with a meeting to understand your business, goals, requirements, desired features and project scope.",
          },
          {
            title: "Requirements & Planning",
            text: "We organise the requirements and determine exactly what needs to be built.",
          },
          {
            title: "Prototype",
            text: "A prototype / initial version is prepared based on the agreed direction. You review it before development continues.",
          },
          {
            title: "Development",
            text: "The application is developed and refined according to the agreed requirements.",
          },
          {
            title: "Testing & Review",
            text: "I test the application first. Then you and your team receive it for review and testing. The standard review period is 3 days; for larger applications up to 7 days can be agreed. This review period is separate from the development timeline.",
          },
          {
            title: "Delivery & Support",
            text: "After the project is completed and the final payment is made, the project is delivered — followed by a 7-day Review & Adjustment period for issues and adjustments within the originally agreed scope.",
          },
        ],
      },
    ],
  },
  {
    id: "refund",
    q: "What is the refund policy?",
    a: [
      {
        type: "p",
        text: "The 20% upfront payment is non-refundable: it covers project initiation, planning, meetings, requirements analysis and the beginning of development.",
      },
      { type: "p", text: "If you decide to stop the project during development:" },
      {
        type: "ul",
        items: [
          "The project can be stopped at any point.",
          "The 20% upfront payment is not refunded.",
          "You are responsible for completed and agreed milestones / work already performed.",
          "You do not automatically owe the remaining 80% just because a total project price was agreed.",
          "Any unpaid completed milestone becomes due according to the agreed milestone plan.",
        ],
      },
      {
        type: "p",
        text: "If I am unable to deliver the agreed project because of a failure on my side, and the project cannot reasonably be completed as agreed, you may receive a full refund of the payments made for the project. This applies to genuine project failure, not to subjective preference — the contract defines the milestones and obligations clearly.",
      },
    ],
  },
  {
    id: "after",
    q: "What happens after the project is finished?",
    a: [
      {
        type: "p",
        text: "After development and your testing, the project enters a 7-day Review & Adjustment period. During it you can report:",
      },
      {
        type: "ul",
        items: ["Bugs and issues", "Problems with agreed functionality", "Minor adjustments related to the original agreed scope"],
      },
      { type: "p", text: "These adjustments are included." },
      {
        type: "note",
        text: "New features are different. Example — original project: an AI chatbot for customer support. After completion: “I also want a full CRM system.” That is a new feature. New features and new requirements are discussed separately under a new agreement, once the original project is completed.",
      },
    ],
  },
  {
    id: "payment",
    q: "How does payment work?",
    a: [
      { type: "p", text: "A 20% upfront payment is required to start the project." },
      {
        type: "p",
        text: "The remaining 80% is not necessarily one single payment: after the initial meeting the schedule can be divided into milestones depending on the size and structure of the project.",
      },
      { type: "note", text: "Example: 20% upfront → Prototype milestone → Development milestones → Final payment." },
      { type: "p", text: "The exact milestone structure is agreed before or during the project — it is not the same for every project." },
    ],
  },
  {
    id: "source-code",
    q: "Will I receive the source code?",
    a: [
      {
        type: "p",
        text: "Yes. After the final payment you receive the source code and project files required to operate and maintain your customized application. There is no extra source-code fee.",
      },
      {
        type: "p",
        text: "To deliver faster, I build on pre-existing templates and reusable components (for example a Voice AI base with dashboard, prompt management, functions, authentication and common integrations) and create your customized version — your branding, prompts, functionality and requirements. You receive the complete application you paid for. The pre-existing reusable materials themselves (templates, reusable components, internal tools, general-purpose systems built before your project) remain mine and are not transferred as separate assets.",
      },
    ],
  },
  {
    id: "resell",
    q: "Can I resell or white-label the solution?",
    a: [
      {
        type: "p",
        text: "Reselling or white-labeling the solution to other businesses is not automatically included in the standard project agreement.",
      },
      {
        type: "p",
        text: "If you want to commercialise, resell, license or offer the solution to other businesses under your own brand, that can be discussed separately — a separate commercial agreement may be required depending on the project and intended use.",
      },
    ],
  },
  {
    id: "hosting",
    q: "Do you provide hosting?",
    a: [
      { type: "p", text: "Hosting is not included in the project price by default. You can either:" },
      {
        type: "ul",
        items: [
          "Host the application on your own infrastructure / accounts, or",
          "Ask me to host and manage it — charged separately.",
        ],
      },
      { type: "p", text: "Possible additional running costs, depending on the project:" },
      {
        type: "ul",
        items: [
          "Server and domain",
          "Third-party services and API usage",
          "AI usage",
          "Phone numbers and WhatsApp-related services",
          "Other infrastructure the project requires",
        ],
      },
    ],
  },
  {
    id: "integrations",
    q: "Are third-party services and integrations included?",
    a: [
      { type: "p", text: "Integrations depend on the project and the services involved." },
      {
        type: "p",
        text: "Some services require your own account, permissions, API access, subscription or approval — certain CRM platforms, for example, restrict external integrations or need configuration from your side.",
      },
      {
        type: "p",
        text: "Third-party usage fees are not automatically included in the development price unless specifically agreed. The exact integrations and related costs are discussed during project planning.",
      },
    ],
  },
];
