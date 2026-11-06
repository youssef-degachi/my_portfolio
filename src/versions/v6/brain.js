/**
 * The agent's brain. Deliberately not an LLM: a small local intent matcher with memory,
 * which is what lets this run with no backend and answer honestly about itself.
 * respond(text, ctx) → { intent, confidence, say, topic, card, chips, tool, action }
 */
import { profile, projects, services, stats, experience, education, skills, whatsappWith } from "../content";
import { OFFERS, FAQ, CURRENCIES, currencyByCode, convertPrice, formatPrice } from "@/data/pricing";

const pick = (a) => a[Math.floor(Math.random() * a.length)];
const money = (usd, c) => (c.code === "USD" ? `${new Intl.NumberFormat("en-US").format(usd)} dollars` : `about ${new Intl.NumberFormat("en-US").format(convertPrice(usd, c))} ${c.name}s`);
const offerById = (id) => OFFERS.find((o) => o.id === id);
const faqById = (id) => FAQ.find((f) => f.id === id);

const PROJECT_KEYS = [
  [/andalib/, "andalib-ai"], [/jerid|school|education platform/, "jeridschool"], [/next vision|nvs|gonext|vision services/, "nvs"], [/gallery|30 projects|thirty/, "project-gallery"],
];
const OFFER_KEYS = [
  [/voice|phone|calls?\b|receptionist/, "voice-agent"], [/chat ?bot|whatsapp (bot|ai|assistant)|assistant on/, "ai-chatbot"],
  [/web ?app|custom (app|software|system|platform)|erp|dashboard|portal|saas|crm|website|site\b/, "web-application"], [/complete|everything|full solution|all[- ]in[- ]one|bundle|combined/, "complete-solution"],
];
const CURRENCY_KEYS = [[/\beur|euro/, "EUR"], [/gbp|pound|sterling/, "GBP"], [/\bsar\b|riyal|saudi/, "SAR"], [/cny|yuan|rmb|chinese/, "CNY"], [/\brub\b|ruble|rouble|russian/, "RUB"], [/usd|dollar/, "USD"]];
const find = (keys, t) => keys.find(([re]) => re.test(t))?.[1];

const CHIPS = {
  start: ["Who is Youssef?", "Show me his work", "What does it cost?", "Are you real?"],
  afterWork: ["Tell me about Andalib AI", "Tell me about JeridSchool", "What does it cost?", "I want to hire him"],
  afterPrice: ["Voice agent price", "In euros", "How does payment work?", "Talk to Youssef"],
  afterWho: ["Show me his work", "How long with AI?", "His experience", "What does it cost?"],
  close: ["Talk to Youssef", "Show me his work", "What does it cost?", "End the call"],
};

export const createContext = () => ({ currency: "USD", lastOffer: null, lastProject: null, lastIntent: null, topics: new Set(), interests: new Set(), misses: 0 });

function projectReply(p, ctx, intro) {
  ctx.lastProject = p.id;
  ctx.interests.add(p.title);
  const role = p.role ? ` ${p.role.replace(/\s*—\s*/, ": ")}` : "";
  const i = projects.findIndex((x) => x.id === p.id);
  const next = projects[(i + 1) % projects.length];
  return {
    intent: "get_project", topic: "work",
    say: `${intro || ""}${p.title}. ${p.blurb.replace(/\s+—\s+/g, ", ")}${role}`.trim(),
    card: { kind: "project", project: p },
    chips: [`Next: ${next.title}`, "What does it cost?", "I want to hire him", "Show me all his work"],
    tool: { name: "get_project", args: { id: p.id }, result: p.live ? `live: ${new URL(p.live).host}` : "no public link" },
  };
}

function offerReply(o, ctx) {
  ctx.lastOffer = o.id;
  ctx.interests.add(o.name);
  const c = currencyByCode(ctx.currency);
  return {
    intent: "get_offer", topic: "pricing",
    say: `${o.name} starts at ${money(o.priceUSD, c)}. ${o.headline} ${o.timeline} The final price is agreed after a discovery meeting.`,
    card: { kind: "offer", offer: o, currency: c },
    chips: ["What's included?", "How does payment work?", "Do I get the source code?", "Talk to Youssef"],
    tool: { name: "get_offer", args: { id: o.id, currency: c.code }, result: formatPrice(o.priceUSD, c) },
  };
}

function pricesReply(ctx) {
  const c = currencyByCode(ctx.currency);
  const [v, b, w, s] = ["voice-agent", "ai-chatbot", "web-application", "complete-solution"].map(offerById);
  return {
    intent: "list_prices", topic: "pricing",
    say: `Chatbots start at ${money(b.priceUSD, c)}. Voice agents at ${money(v.priceUSD, c)}. Custom web apps at ${money(w.priceUSD, c)}. And the complete AI solution at ${money(s.priceUSD, c)}. These are starting points, not fixed prices.`,
    card: { kind: "prices", currency: c },
    chips: CHIPS.afterPrice,
    tool: { name: "list_offers", args: { currency: c.code }, result: `${OFFERS.length} offers` },
  };
}

const faqReply = (id, say, chips) => ({
  intent: `faq_${id}`, topic: "process", say, card: { kind: "faq", faq: faqById(id) }, chips: chips || CHIPS.close,
  tool: { name: "search_faq", args: { id }, result: "1 answer" },
});

const handoff = (ctx, say) => {
  const about = [...ctx.interests];
  const message = about.length ? `Hi Youssef, I just talked to your agent. I'm interested in: ${about.join(", ")}.` : "Hi Youssef, I just talked to your agent and I'd like to talk to you.";
  return {
    intent: "transfer_to_human", topic: "contact", say,
    card: { kind: "contact", href: whatsappWith(message), message },
    chips: ["Show me his work", "What does it cost?", "End the call"],
    tool: { name: "transfer_to_human", args: { channel: "whatsapp" }, result: about.length ? `context: ${about.length} topics` : "no context" },
  };
};

const RULES = [
  [/^(bye|goodbye|good bye|hang up|end( the)? call|that'?s all|see you)\b|\bhang up\b|\bend (the )?call\b/, () => ({ intent: "end_call", topic: "idle", say: pick(["Thanks for calling. I'll write up what we talked about.", "Good talking to you. Here's your call report."]), action: "end", chips: [] })],
  [/human|real person|talk to (him|youssef)|speak (to|with) (him|youssef)|transfer|put me through|reach (him|youssef)/, (ctx) => handoff(ctx, "Sure, a real voice agent should know when to hand off. Here's his WhatsApp, with a note about what we discussed already written for you.")],
  [/are you (real|human|a bot|an? ai|a robot|chat ?gpt|alive)|what are you|who are you|how do you work|how (were|are) you (built|made)|is this (real|ai|a recording)|your (brain|model)|which model/, () => ({
    intent: "about_agent", topic: "ai",
    say: "Honest answer: I'm software, and a small one. No language model. I run in your browser, with intent matching Youssef wrote, memory of this call, and your browser's speech engine. The agents he ships for clients are far more capable, and they answer real phone lines.",
    card: { kind: "pipeline" }, chips: ["What can his real agents do?", "How much is a voice agent?", "Show me his work", "Tell me a joke"],
    tool: { name: "self_describe", args: {}, result: "scripted, local, no server" },
  })],
  [/joke|something funny|make me laugh/, () => ({ intent: "joke", topic: "idle", say: pick(["A client asked if the voice agent ever takes a day off. I said only when the wifi does.", "I was going to tell you a joke about hold music, but you'd have to wait.", "They said a portfolio should speak for itself. So here we are."]), chips: ["Another joke", "Are you real?", "Show me his work", "What does it cost?"] })],
  [/thank|thanks|cheers|appreciate/, () => ({ intent: "thanks", topic: "idle", say: pick(["Anytime. Anything else, or shall I put you through to Youssef?", "You're welcome. Want to talk to the real Youssef?"]), chips: CHIPS.close })],
  [/refund|money back|cancel|stop the project/, () => faqReply("refund", "The 20% upfront isn't refundable, because it covers planning and the start of development. You can stop at any point, and you only pay for completed, agreed milestones. If the failure is on Youssef's side, you may get money back.")],
  [/source ?code|own the code|who owns|repo\b/, () => faqReply("source-code", "Yes. After the final payment you receive the source code and the project files you need to run and maintain it, at no extra cost.")],
  [/resell|white.?label|licen[cs]e/, () => faqReply("resell", "Reselling or white-labelling isn't automatically included. It can be discussed separately, as its own agreement.")],
  [/hosting|server|domain|running cost|deploy/, () => faqReply("hosting", "Hosting isn't included by default. You can host it on your own accounts, or ask Youssef to host and manage it, charged separately. Things like AI usage and phone numbers are separate running costs.")],
  [/integrat|third.?party|connect (to|with)|\bapi\b/, () => faqReply("integrations", "It depends on the service. Some need your own account or approval, and usage fees aren't included unless agreed. The exact integrations are worked out for your project.")],
  [/after (the )?(project|launch|deliver)|support|maintenance|bug|warranty|adjustment/, () => faqReply("after", "After testing, there's a 7-day review and adjustment period. Bugs and small fixes within the agreed scope are included. New features are a new piece of work.")],
  [/payment|pay |deposit|upfront|instal|milestone/, () => faqReply("payment", "20% upfront to start. The rest is split into milestones agreed with you, depending on the size of the project.")],
  [/step|process|how (does|do) (it|this|you) work|what happens|how long|timeline|how fast|workflow/, () => faqReply("steps", "Six steps. Discovery, requirements, a prototype you review, development, testing with your team, then delivery and support. You see it working before it's finished.", ["How does payment work?", "Do I get the source code?", "What does it cost?", "Talk to Youssef"])],
];

export function respond(raw, ctx) {
  const t = raw.toLowerCase().replace(/[’']/g, "'").trim();
  const finish = (r, confidence) => {
    ctx.lastIntent = r.intent;
    if (r.topic && r.topic !== "idle") ctx.topics.add(r.topic);
    if (r.intent !== "fallback") ctx.misses = 0;
    return { confidence, chips: CHIPS.close, ...r };
  };

  if (/[؀-ۿ]/.test(raw)) {
    return finish({ intent: "language_arabic", topic: "contact", say: "I can see that's Arabic. Youssef speaks it, but I only speak English so far. Message him directly and he'll answer you properly.", card: { kind: "contact", href: profile.whatsapp, message: "" }, chips: ["Who is Youssef?", "What does it cost?"], tool: { name: "detect_language", args: {}, result: "ar" } }, .98);
  }

  for (const [re, make] of RULES) if (re.test(t)) return finish(make(ctx), .94);

  const currency = find(CURRENCY_KEYS, t);
  const offerId = find(OFFER_KEYS, t);
  const asksPrice = /how much|price|pricing|cost|charge|budget|rate\b|expensive|afford|quote|fee\b/.test(t);
  if (currency) {
    const c = currencyByCode(currency);
    const changed = c.code !== ctx.currency;
    ctx.currency = c.code;
    if (asksPrice || changed || /\bin\b/.test(t)) {
      const r = offerId ? offerReply(offerById(offerId), ctx) : ctx.lastOffer ? offerReply(offerById(ctx.lastOffer), ctx) : pricesReply(ctx);
      r.tool = { name: "convert_currency", args: { from: "USD", to: c.code }, result: `rate ${c.rate}` };
      return finish(r, .95);
    }
  }
  if (asksPrice) {
    if (offerId) return finish(offerReply(offerById(offerId), ctx), .96);
    if (ctx.lastOffer && /\b(it|that|this)\b/.test(t)) return finish(offerReply(offerById(ctx.lastOffer), ctx), .88);
    return finish(pricesReply(ctx), .93);
  }
  if (/include|what do i get|what's in it|details/.test(t) && ctx.lastOffer) {
    const o = offerById(ctx.lastOffer);
    return finish({ intent: "get_offer_details", topic: "pricing", say: `${o.details.included.slice(0, 3).join(". ")}. The full list is on your screen.`, card: { kind: "offer", offer: o, currency: currencyByCode(ctx.currency), open: true }, chips: ["How does payment work?", "Do I get the source code?", "Talk to Youssef", "What else does he offer?"], tool: { name: "get_offer", args: { id: o.id, fields: "included" }, result: `${o.details.included.length} items` } }, .9);
  }

  const nextMatch = /^next\b|another (one|project)|next project/.test(t);
  if (nextMatch && ctx.lastProject) {
    const i = projects.findIndex((p) => p.id === ctx.lastProject);
    return finish(projectReply(projects[(i + 1) % projects.length], ctx), .9);
  }
  const named = /^next: /.test(t) ? t.replace(/^next: /, "") : t;
  const projectId = find(PROJECT_KEYS, named);
  if (projectId) return finish(projectReply(projects.find((p) => p.id === projectId), ctx), .96);

  if (/hire|work with|build (me|something|my)|need (a|an|someone)|i have a project|project for|book|meeting|get started|start a project/.test(t)) {
    return finish(handoff(ctx, "Good. The first step is a discovery meeting with Youssef. Tap below to message him on WhatsApp. I've already written a note with what we talked about."), .92);
  }
  if (offerId && /voice|chat|agent|bot|app|erp|solution/.test(t)) return finish(offerReply(offerById(offerId), ctx), .86);
  if (/work|portfolio|project|built|build|product|show me|client|what has he/.test(t)) {
    return finish({ intent: "list_projects", topic: "work", say: "The companies he co-founded: Andalib AI, JeridSchool and NEXT Vision Services. And a gallery of 30 projects. Which one do you want to hear about?", card: { kind: "work" }, chips: CHIPS.afterWork, tool: { name: "list_projects", args: { visible: true }, result: `${projects.length} projects` } }, .93);
  }
  if (/\bai\b|llm|machine learning|voice agent|real agents|agents? do|automation/.test(t)) {
    return finish({ intent: "about_ai", topic: "ai", say: "Youssef builds voice agents with AI. They answer calls, qualify leads, book appointments and hand off to people, using custom prompts and functions written for each business.", card: { kind: "pipeline" }, chips: ["How much is a voice agent?", "Tell me about Andalib AI", "Are you real?", "Talk to Youssef"], tool: { name: "get_skills", args: { area: "ai" }, result: skills.AI.length + " skills" } }, .9);
  }
  if (/service|what (do|does|can) (you|he)|offer|help (me|with)|what else/.test(t)) {
    return finish({ intent: "list_services", topic: "work", say: `Four things. ${services.map((s) => s.title.replace("&", "and")).join(". ")}. All of it from the first sketch to production.`, card: { kind: "services" }, chips: ["Voice agent price", "Chatbot price", "Custom app price", "Show me his work"], tool: { name: "list_services", args: {}, result: `${services.length} services` } }, .9);
  }
  if (/stack|tech|skill|language[s]? (do|does)? ?(you|he)? ?(use|code)|react|next\.?js|node|python|framework|programming/.test(t)) {
    return finish({ intent: "get_skills", topic: "about", say: "On the front end: React, Next.js, Tailwind and React Native. On the back end: Node, Nest and Spring Boot. And Python for AI work. He designs in Figma too.", card: { kind: "stack" }, chips: ["His experience", "Show me his work", "How long with AI?", "I want to hire him"], tool: { name: "get_skills", args: {}, result: "3 groups" } }, .9);
  }
  if (/educat|stud(y|ied)|degree|school did|university|iset|bootcamp/.test(t)) {
    return finish({ intent: "get_education", topic: "about", say: "He studied software development at ISET Tozeur from 2022 to 2025. Plus technology and design at Yanfaa Academy, a full stack bootcamp, and data structures and algorithms.", card: { kind: "timeline", rows: education, title: "Education" }, chips: ["His experience", "Show me his work", "What does it cost?"], tool: { name: "get_education", args: {}, result: `${education.length} entries` } }, .9);
  }
  if (/experience|how long|years|background|career|cv|resume|résumé/.test(t)) {
    const wantsCv = /\bcv\b|resume|résumé/.test(t);
    return finish({ intent: wantsCv ? "get_cv" : "get_experience", topic: "about", say: wantsCv ? "Here's his CV. Tap to download it. Short version: more than 3 years of experience building systems and ERPs for real clients." : "More than 3 years of experience building systems and ERPs for real clients. He co-founded JeridSchool, Andalib AI and NEXT Vision Services, after working at CodeCooperation and interning at Web Agency Tozeur.", card: { kind: "timeline", rows: experience, title: "Experience", cv: true }, chips: ["His education", "Show me his work", "I want to hire him"], tool: { name: wantsCv ? "get_cv" : "get_experience", args: {}, result: wantsCv ? "pdf" : `${experience.length} entries` } }, .91);
  }
  if (/where|location|based|country|tunisia|time ?zone|remote/.test(t)) return finish({ intent: "get_location", topic: "about", say: "He's in Tunisia, and he works with clients remotely.", chips: ["I want to hire him", "What languages does he speak?", "Show me his work"], tool: { name: "get_profile", args: { field: "location" }, result: profile.location } }, .9);
  if (/speak|language/.test(t)) return finish({ intent: "get_languages", topic: "about", say: "He speaks English and Arabic. I'm less talented, I only speak English.", chips: ["Where is he based?", "Who is Youssef?", "I want to hire him"], tool: { name: "get_profile", args: { field: "languages" }, result: profile.languages.join(", ") } }, .9);
  if (/available|free|freelance|taking (work|clients)|busy/.test(t)) return finish(handoff(ctx, "Yes, he's available for freelance work. WhatsApp is the fastest way to reach him."), .92);
  if (/contact|whatsapp|email|phone|number|call him|message/.test(t)) return finish(handoff(ctx, "WhatsApp is the fastest. His email and phone are on your screen too."), .93);
  if (/github|linkedin|youtube|twitter|\bx\b|social/.test(t)) return finish({ intent: "get_socials", topic: "contact", say: "GitHub, LinkedIn, YouTube and X are all on your screen.", card: { kind: "socials" }, chips: ["Show me his work", "Talk to Youssef"], tool: { name: "get_socials", args: {}, result: "4 links" } }, .9);
  if (/design|this (site|website)|version|how (was|is) this|who made/.test(t)) return finish({ intent: "about_site", topic: "ai", say: "Youssef built this site. It's one of six designs he's comparing, and this one is the strange one. Use the switcher at the top to see the others.", chips: ["Are you real?", "Show me his work", "What does it cost?"], tool: { name: "get_site_info", args: {}, result: "6 versions" } }, .85);
  if (/who|about (him|youssef)|tell me about|youssef|founder|co-?found/.test(t)) {
    return finish({ intent: "get_profile", topic: "about", say: `Youssef Degachi is a fullstack engineer from Tunisia. More than ${stats[0].value} years of experience building systems and ERPs for real clients. He still ships the code himself.`, card: { kind: "profile" }, chips: CHIPS.afterWho, tool: { name: "get_profile", args: {}, result: profile.name } }, .92);
  }
  if (/^(hi|hello|hey|salam|salut|bonjour|good (morning|afternoon|evening)|aslema)\b/.test(t)) return finish({ intent: "greeting", topic: "idle", say: pick(["Hello. What would you like to know about Youssef?", "Hey. Ask me about his work, his prices, or what he could build for you."]), chips: CHIPS.start }, .95);
  if (/^(yes|yeah|yep|sure|ok|okay|please|go on|continue|tell me more|more)\b/.test(t)) {
    if (ctx.lastIntent === "get_project" && ctx.lastProject) { const i = projects.findIndex((p) => p.id === ctx.lastProject); return finish(projectReply(projects[(i + 1) % projects.length], ctx, "Next one. "), .8); }
    if (ctx.lastIntent === "get_profile") return respond("his experience", ctx);
    if (ctx.lastIntent === "get_offer" && ctx.lastOffer) return respond("what's included", ctx);
    return finish({ intent: "clarify", topic: "idle", say: "Happy to. What should I go into: his work, his prices, or how a project runs?", chips: CHIPS.start }, .7);
  }
  if (/^(no|nope|nah|not now|nothing)\b/.test(t)) return finish({ intent: "decline", topic: "idle", say: "No problem. You can ask me something else, or end the call and I'll give you a summary.", chips: CHIPS.close }, .8);

  ctx.misses += 1;
  const r = ctx.misses >= 2
    ? handoff(ctx, "I've missed that twice, and I'd rather not pretend. I'm a small scripted agent. The real Youssef can answer anything, so here's his WhatsApp.")
    : { intent: "fallback", topic: "idle", say: pick(["I didn't catch that one. I'm good on his work, prices, process and experience. Which should I start with?", "That's outside what I know. I can tell you about his work, his prices, or how a project runs."]), chips: CHIPS.start };
  return finish(r.intent === "fallback" ? { ...r, intent: "fallback" } : r, .31);
}

export const GREETING = {
  intent: "greeting", topic: "idle", confidence: .99,
  say: "Hi, you've reached Youssef Degachi. I'm his voice agent. He built me so this portfolio could answer you instead of just sitting there. Ask me anything: his work, his prices, or whether he's right for your project.",
  chips: CHIPS.start,
};
export { CURRENCIES };
