/**
 * Single source of truth for every design version (/v1 … /v6).
 * Projects and pricing are reused from src/data so there is one place to edit them.
 */
import { visibleWork, tagsOf, blurbOf, KIND_META, WORK_KIND } from "@/data/work";

export const asset = (p) => `${import.meta.env.BASE_URL}${String(p).replace(/^\//, "")}`;

export const profile = {
  name: "Youssef Degachi",
  first: "Youssef",
  last: "Degachi",
  arabic: "يوسف",
  role: "Fullstack engineer & AI builder",
  location: "Tunisia",
  languages: ["English", "Arabic"],
  line: "I build web products — and the AI that answers their phones.",
  short:
    "3+ years of experience building systems and ERPs for real clients. Today I co-found companies and ship voice agents, chatbots and custom platforms from the first sketch to production.",
  photo: asset("assets/photo.png"),
  cv: asset("assets/CV_Youssef_Degachi.pdf"),
  phone: "(+216) 50 702 320",
  phoneHref: "tel:+21650702320",
  email: "youssefdegachi0@gmail.com",
  whatsapp: "https://wa.me/21650702320",
  availability: "Available for freelance",
};

export const whatsappWith = (text) => `${profile.whatsapp}?text=${encodeURIComponent(text)}`;

export const socials = [
  { label: "GitHub", href: "https://github.com/youssef-degachi/" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/youssef-degachi/" },
  { label: "YouTube", href: "https://www.youtube.com/@YoussefDegachi0" },
  { label: "X", href: "https://x.com/YoussefDegachi" },
];

export const stats = [
  { value: 3, suffix: "+", label: "Years of experience" },
  { value: 30, suffix: "+", label: "Projects shipped" },
];

export const services = [
  {
    num: "01",
    title: "Voice AI Agents",
    short: "Agents that pick up the phone.",
    text: "Intelligent voice agents that answer calls, qualify leads, book appointments and hand off to a human when it matters.",
  },
  {
    num: "02",
    title: "AI Solutions",
    short: "Automation that does real work.",
    text: "Chatbots, automations and AI features wired into your business, so decisions and repetitive work stop waiting on people.",
  },
  {
    num: "03",
    title: "ERP & Custom Systems",
    short: "Software shaped like your business.",
    text: "Complete ERP systems and custom platforms for web and mobile, built around the way your company actually operates.",
  },
  {
    num: "04",
    title: "UI / UX Design",
    short: "Interfaces people understand.",
    text: "Intuitive, engaging interfaces designed in Figma and built by the same person who ships the code behind them.",
  },
];

export const experience = [
  { when: "2025 — now", role: "Co-Founder", org: "JeridSchool", href: "https://jeridschool.com" },
  { when: "2025 — now", role: "Co-Founder", org: "Andalib AI", href: "https://andalibai.com" },
  { when: "Now", role: "Co-Founder", org: "NEXT Vision Services", href: "https://www.gonextvision.com/" },
  { when: "2024 — 2025", role: "Software Developer Student", org: "CodeCooperation" },
  { when: "6 months", role: "Full Stack Developer Intern", org: "Web Agency Tozeur" },
];

export const education = [
  { when: "2022 — 2025", role: "Software Development", org: "ISET Tozeur" },
  { when: "2023 — 2024", role: "Technology and Design", org: "Yanfaa Academy" },
  { when: "2023", role: "Full Stack Web Development Bootcamp", org: "Online" },
  { when: "2023", role: "Data Structures and Algorithms", org: "Online" },
];

export const skills = {
  Frontend: ["React", "Next.js", "Tailwind CSS", "React Native", "Figma"],
  Backend: ["Node.js", "Nest.js", "Spring Boot", "Databases", "Cloud"],
  AI: ["Voice agents", "Chatbots", "AI integrations", "Automation", "Python"],
};

export const allSkills = Object.values(skills).flat();

/** Every visible project, normalised to one shape. */
const allWork = visibleWork().map((item) => ({
  id: item.id || `client-${item.num}`,
  title: item.title,
  blurb: blurbOf(item),
  role: item.role || "",
  tags: tagsOf(item),
  image: item.image ? asset(item.image) : "",
  live: item.live || "",
  kind: item.kind,
  kindLabel: KIND_META[item.kind]?.label || "Project",
  isProduct: item.kind === WORK_KIND.PRODUCT,
  prototype: Boolean(item.prototype),
  mark: item.mark || item.title[0],
}));

/** What the site lists: products only. Client systems stay private and unlisted. */
export const projects = allWork.filter((p) => p.isProduct);
export const products = projects;

export const navLinks = [
  { id: "work", label: "Work" },
  { id: "services", label: "Services" },
  { id: "pricing", label: "Pricing" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];

export const VERSIONS = [
  { id: "v1", name: "The Lab", note: "Blueprint engineering lab. Giant type, horizontal builds, a working terminal." },
  { id: "v2", name: "The Turn", note: "Black editorial. A clock whose hands form a Y — scrolling turns the career." },
  { id: "v3", name: "Assembly", note: "WebGL particles build my face from my photo, then one of three shape sets, and it ends on a call." },
  { id: "v4", name: "Operator", note: "The hybrid. Your red, a live bento board, a deck of projects. The client closer." },
  { id: "v5", name: "Jerid", note: "Light. Tozeur brick patterns under a sun that crosses the sky as you scroll." },
  { id: "v6", name: "The Call", note: "The wild one. The portfolio rings. Answer, and talk to it." },
];
