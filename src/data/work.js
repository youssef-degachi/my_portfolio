export const WORK_KIND = {
  PRODUCT: "product",
  CLIENT: "client",
  OPEN_SOURCE: "opensource",
  YOUTUBE: "youtube",
};

/**
 * Future kinds (opensource, youtube) stay in this list with visible: false
 * until you are ready to show them in the UI.
 */
export const workItems = [
  {
    id: "andalib-ai",
    kind: WORK_KIND.PRODUCT,
    visible: true,
    title: "Andalib AI",
    tagline: "AI products for real conversations — voice agents and intelligent workflows.",
    role: "Co-founder — product, architecture, and shipping the platform.",
    stack: ["AI", "Voice agents", "Fullstack"],
    live: "https://andalibai.com",
    github: "",
    image: "/assets/work/andalib.png",
    mark: "A",
  },
  {
    id: "jeridschool",
    kind: WORK_KIND.PRODUCT,
    visible: true,
    title: "JeridSchool",
    tagline: "Education platform for learners and schools — built to scale teaching, not just pages.",
    role: "Co-founder — product and engineering end to end.",
    stack: ["Fullstack", "Education", "Web"],
    live: "https://jeridschool.com",
    github: "",
    image: "/assets/work/jeridschool.png",
    mark: "J",
  },
  {
    id: "opensource",
    kind: WORK_KIND.OPEN_SOURCE,
    visible: false,
    title: "Open source",
    tagline: "Public repos and contributions — coming later.",
    role: "",
    stack: [],
    live: "",
    github: "",
    image: "",
    mark: "OS",
  },
  {
    id: "youtube",
    kind: WORK_KIND.YOUTUBE,
    visible: false,
    title: "YouTube",
    tagline: "Channel and videos — coming later.",
    role: "",
    stack: [],
    live: "https://www.youtube.com/@YoussefDegachi0",
    github: "",
    image: "",
    mark: "YT",
  },
  {
    num: "01",
    kind: WORK_KIND.CLIENT,
    visible: true,
    prototype: true,
    nda: true,
    category: "Design",
    title: "ControlAI Design",
    description:
      "Prototype showcase for a client landing page — AI-powered solutions, modern responsive design. The real product stays private.",
    stack: [{ name: "React.js" }, { name: "Tailwind CSS" }, { name: "Voice AI Agent" }],
    image: "/assets/work/controleAi.png",
    live: "https://controlai-design.vercel.app/",
    github: "",
  },
  {
    num: "02",
    kind: WORK_KIND.CLIENT,
    visible: true,
    prototype: true,
    nda: true,
    category: "Fullstack",
    title: "Smart Blind Assistant",
    description:
      "Prototype for an accessibility app with AI-powered assistance. Built to demo the concept — the production client app is not public.",
    stack: [{ name: "React.js" }, { name: "AI Integration" }, { name: "Accessibility" }],
    image: "/assets/work/eye.png",
    live: "https://smart-blind-assistant.vercel.app/home",
    github: "",
  },
  {
    num: "03",
    kind: WORK_KIND.CLIENT,
    visible: true,
    prototype: true,
    nda: true,
    category: "Fullstack",
    title: "Management Store",
    description:
      "Prototype store-management system for a retail client. Illustrates the UX and flows — the live client platform is under NDA.",
    stack: [{ name: "React.js" }, { name: "Node.js" }, { name: "Database" }, { name: "API Integration" }],
    image: "/assets/work/managment-store.png",
    live: "https://arpa-flow.vercel.app/",
    github: "",
  },
  {
    num: "04",
    kind: WORK_KIND.CLIENT,
    visible: true,
    prototype: true,
    nda: true,
    category: "Fullstack",
    title: "Wedding Sales Manager",
    description:
      "Prototype for a wedding sales and booking platform. The real client system handles live bookings and cannot be shared publicly.",
    stack: [{ name: "React.js" }, { name: "Node.js" }, { name: "Database" }, { name: "Payment Integration" }],
    image: "/assets/work/wedding-system.png",
    live: "",
    github: "",
  },
];

export const visibleWorkByKind = (kind) =>
  workItems.filter((item) => item.kind === kind && item.visible);


// --- Library helpers ----------------------------------------------------------

/** Human label + accent for each kind (used by the library chips + card badge). */
export const KIND_META = {
  [WORK_KIND.PRODUCT]: { label: "Product", accent: "accent" },
  [WORK_KIND.CLIENT]: { label: "Client work", accent: "neutral" },
  [WORK_KIND.OPEN_SOURCE]: { label: "Open source", accent: "provision" },
  [WORK_KIND.YOUTUBE]: { label: "YouTube", accent: "accent" },
};

/** Order the filter chips appear in. */
export const LIBRARY_KINDS = [WORK_KIND.PRODUCT, WORK_KIND.CLIENT, WORK_KIND.OPEN_SOURCE];

/** All visible projects, products first, then client work, then open source. */
export const visibleWork = () => {
  const order = { [WORK_KIND.PRODUCT]: 0, [WORK_KIND.CLIENT]: 1, [WORK_KIND.OPEN_SOURCE]: 2, [WORK_KIND.YOUTUBE]: 3 };
  return workItems
    .filter((i) => i.visible)
    .sort((a, b) => (order[a.kind] ?? 9) - (order[b.kind] ?? 9));
};

/** Stack entries are either strings (products) or { name } (client) — normalise to strings. */
export const tagsOf = (item) =>
  (item.stack || []).map((t) => (typeof t === "string" ? t : t.name)).filter(Boolean);

/** One-line description, whichever field the item uses. */
export const blurbOf = (item) => item.tagline || item.description || "";

/** Count of visible items per kind, for the chip badges. */
export const countByKind = (kind) => workItems.filter((i) => i.visible && i.kind === kind).length;
