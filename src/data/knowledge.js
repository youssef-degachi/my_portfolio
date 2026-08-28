/**
 * Knowledge base — types, groups and a seed/fallback dataset.
 *
 * The live data comes from Neon Postgres (table `entries`, see
 * my-personal-info/docs/DATA-MODEL.md). When the env vars are missing or the
 * request fails, `seedEntries` is rendered instead so the page never breaks.
 * Column names here mirror the database 1:1.
 */

export const KNOWLEDGE_TYPES = [
  { type: "blog", label: "Blog", plural: "Blogs", icon: "pen", group: "blogs" },
  { type: "note", label: "Note", plural: "Notes", icon: "note", group: "notes" },
  { type: "quote", label: "Quote", plural: "Quotes", icon: "quote", group: "quotes" },
  { type: "video", label: "Video", plural: "Videos", icon: "play", group: "videos" },
  { type: "article", label: "Article", plural: "Articles", icon: "article", group: "resources" },
  { type: "book", label: "Book", plural: "Books", icon: "book", group: "resources" },
  { type: "course", label: "Course", plural: "Courses", icon: "course", group: "resources" },
  { type: "website", label: "Website", plural: "Websites", icon: "globe", group: "resources" },
  { type: "tool", label: "Tool", plural: "Tools", icon: "tool", group: "resources" },
  { type: "channel", label: "Channel", plural: "Channels", icon: "youtube", group: "people" },
  { type: "person", label: "Person", plural: "People", icon: "user", group: "people" },
];

export const KNOWLEDGE_GROUPS = [
  { id: "all", label: "All", types: KNOWLEDGE_TYPES.map((t) => t.type) },
  { id: "blogs", label: "Blogs", types: ["blog"] },
  { id: "notes", label: "Notes", types: ["note"] },
  { id: "quotes", label: "Quotes", types: ["quote"] },
  { id: "videos", label: "Videos", types: ["video"] },
  { id: "resources", label: "Resources", types: ["article", "book", "course", "website", "tool"] },
  { id: "people", label: "People & Channels", types: ["channel", "person"] },
];

export const typeMeta = (type) => KNOWLEDGE_TYPES.find((t) => t.type === type);

/** Link-type entries: the rich content is "my summary", not the item itself. */
export const LINK_TYPES = ["video", "article", "book", "course", "website", "tool", "channel", "person"];

/** Notion dark palette — same values the editor uses (docs/DATA-MODEL.md). */
export const NOTION_COLORS = {
  gray: { text: "#9B9A97", bg: "#2F2F2F" },
  brown: { text: "#BA856F", bg: "#4A3228" },
  orange: { text: "#C77D48", bg: "#5C3B23" },
  yellow: { text: "#CA9849", bg: "#564328" },
  green: { text: "#529E72", bg: "#243D30" },
  blue: { text: "#5E87C9", bg: "#143A5E" },
  purple: { text: "#9D68D3", bg: "#3C2D49" },
  pink: { text: "#D15796", bg: "#4E2C3C" },
  red: { text: "#DF5452", bg: "#522E2A" },
};

export const colorOf = (name) => NOTION_COLORS[name] || NOTION_COLORS.gray;

/** Fallback categories (mirror of the `categories` table). */
export const seedCategories = [
  { id: "cat-ai", name: "AI", slug: "ai", description: "LLMs, voice agents, deep learning", color: "purple", sort_order: 1 },
  { id: "cat-startup", name: "Startup", slug: "startup", description: "Building products and companies", color: "orange", sort_order: 2 },
  { id: "cat-backend", name: "Backend", slug: "backend", description: "Databases, APIs, architecture", color: "blue", sort_order: 3 },
  { id: "cat-frontend", name: "Frontend", slug: "frontend", description: "React, the web platform", color: "green", sort_order: 4 },
  { id: "cat-product", name: "Product", slug: "product", description: "What to build and why", color: "pink", sort_order: 5 },
];

const cat = (slug) => {
  const c = seedCategories.find((x) => x.slug === slug);
  return c ? { id: c.id, name: c.name, slug: c.slug, color: c.color } : null;
};

const ME = "Youssef Degachi";

const blogHtml = `
<p>Most "AI voice agents" demos fall apart the moment a real customer interrupts, mumbles, or switches language mid-sentence. This is what we learned building the voice layer at <strong>Andalib AI</strong>.</p>
<h2>1. Latency is the product</h2>
<p>Anything above <span style="color: #DF5452">~800ms</span> from the end of the user's sentence to the first audio byte feels broken. We got there with three things:</p>
<ul>
  <li>Streaming STT → LLM → TTS, never waiting for full responses.</li>
  <li><mark style="background-color: #243D30">Speculative first sentence</mark>: start speaking the first clause while the model is still writing the rest.</li>
  <li>Keeping the prompt short. Every 1k tokens of system prompt costs you time to first token.</li>
</ul>
<h2>2. Interruptions are normal, not edge cases</h2>
<p>Humans talk over each other. Your agent must stop mid-sentence, <em>remember what it already said</em>, and continue from the new context.</p>
<blockquote><p>If the agent can't be interrupted, it is a voicemail with extra steps.</p></blockquote>
<h2>3. Keep the state machine tiny</h2>
<pre><code class="language-ts">type CallState = "listening" | "thinking" | "speaking" | "interrupted";

function next(state: CallState, event: Event): CallState {
  if (event === "user_speech_start") return "interrupted";
  if (event === "tts_done") return "listening";
  if (event === "stt_final") return "thinking";
  return state;
}</code></pre>
<p>Four states. Every time we added a fifth one we regretted it.</p>
<h3>What's next</h3>
<ul data-type="taskList">
  <li data-type="taskItem" data-checked="true"><label><input type="checkbox" checked="checked"><span></span></label><div><p>Arabic dialect support (Tunisian first)</p></div></li>
  <li data-type="taskItem" data-checked="false"><label><input type="checkbox"><span></span></label><div><p>On-device wake word</p></div></li>
</ul>
<p><span style="color: #9B9A97">Questions? Ping me on X or LinkedIn — links are in the People section.</span></p>
`;

const noteHtml = `
<p>A rule I keep coming back to while shipping <strong>JeridSchool</strong>:</p>
<p><mark style="background-color: #564328">Teachers don't want features, they want fewer tabs.</mark></p>
<ul>
  <li>Every screen should answer <span style="color: #5E87C9">one</span> question.</li>
  <li>If a task needs more than three clicks, it becomes a WhatsApp message instead.</li>
  <li>Offline-first is not optional in Tunisian schools.</li>
</ul>
<p><span style="color: #9B9A97">Written after a week of on-site visits, Tozeur, 2026.</span></p>
`;

const videoSummaryHtml = `
<h2>What the video covers</h2>
<ul>
  <li>Bigram model → self-attention → a full <strong>GPT</strong>, all in one notebook.</li>
  <li>Why attention is just <span style="color: #5E87C9">weighted averaging over the past</span>, done with matrix tricks.</li>
  <li>Residual connections, layer norm and dropout — the parts that make it <em>train</em>, not just run.</li>
</ul>
<h2>My takeaways</h2>
<ul>
  <li><mark style="background-color: #3C2D49">Tokens talk to each other only through attention.</mark> Everything else is per-token.</li>
  <li>The scaled dot-product (divide by √d) matters more than it looks — without it softmax saturates.</li>
  <li>Re-implement it yourself once. Reading is not the same as typing it.</li>
</ul>
<p><span style="color: #9B9A97">Watch with the notebook open in a second tab.</span></p>
`;

const articleSummaryHtml = `
<h2>In one sentence</h2>
<p>Effects are not lifecycle hooks — each render has <strong>its own</strong> props, state and effects.</p>
<h2>Key ideas</h2>
<ol>
  <li>Every render captures its own values; stale closures are the symptom of lying in the dependency array.</li>
  <li><span style="color: #529E72">useReducer</span> removes dependencies by moving logic inside the reducer.</li>
  <li>Functions used by an effect belong inside it (or in <code>useCallback</code>).</li>
</ol>
<blockquote><p>"Don't lie to React about dependencies."</p></blockquote>
`;

export const seedEntries = [
  {
    id: "seed-blog-voice-agents",
    type: "blog",
    category_id: "cat-ai",
    category: cat("ai"),
    title: "What we learned shipping real-time voice agents",
    slug: "what-we-learned-shipping-voice-agents",
    summary:
      "Latency budgets, interruptions and a four-state machine: the practical lessons from building the voice layer at Andalib AI.",
    content_html: blogHtml,
    content_text:
      "Latency is the product. Streaming STT LLM TTS. Interruptions are normal. Keep the state machine tiny. Arabic dialect support.",
    url: "https://medium.com/@youssefdegachi/what-we-learned-shipping-real-time-voice-agents",
    author: ME,
    platform: null,
    tags: ["voice-ai", "llm", "startup"],
    language: "en",
    cover_image: null,
    status: "done",
    rating: null,
    featured: true,
    published: true,
    published_at: "2026-07-18T10:00:00Z",
    created_at: "2026-07-18T10:00:00Z",
  },
  {
    id: "seed-note-fewer-tabs",
    type: "note",
    category_id: "cat-product",
    category: cat("product"),
    title: "Teachers don't want features, they want fewer tabs",
    slug: "teachers-want-fewer-tabs",
    summary: "A product note from on-site visits to schools while building JeridSchool.",
    content_html: noteHtml,
    content_text: "Teachers don't want features, they want fewer tabs. Offline-first is not optional.",
    url: null,
    author: ME,
    platform: null,
    tags: ["product", "education", "jeridschool"],
    language: "en",
    featured: false,
    published: true,
    published_at: "2026-08-02T09:00:00Z",
    created_at: "2026-08-02T09:00:00Z",
  },
  {
    id: "seed-quote-me-1",
    type: "quote",
    category_id: "cat-startup",
    category: cat("startup"),
    title: "Ship the boring version first. The clever version will tell you if it is needed.",
    slug: "quote-ship-the-boring-version-first",
    summary: null,
    author: ME,
    tags: ["building", "startup"],
    language: "en",
    featured: true,
    published: true,
    published_at: "2026-06-11T12:00:00Z",
    created_at: "2026-06-11T12:00:00Z",
  },
  {
    id: "seed-quote-hamming",
    type: "quote",
    slug: "quote-hamming-important-problems",
    category_id: null,
    category: null,
    title: "If you don't work on important problems, you can't expect to do important work.",
    author: "Richard Hamming",
    tags: ["career", "focus"],
    language: "en",
    featured: false,
    published: true,
    published_at: "2026-05-20T12:00:00Z",
    created_at: "2026-05-20T12:00:00Z",
  },
  {
    id: "seed-quote-graham",
    type: "quote",
    slug: "quote-graham-make-something-people-want",
    category_id: "cat-startup",
    category: cat("startup"),
    title: "Make something people want.",
    author: "Paul Graham",
    tags: ["startup"],
    language: "en",
    featured: false,
    published: true,
    published_at: "2026-04-01T12:00:00Z",
    created_at: "2026-04-01T12:00:00Z",
  },
  {
    id: "seed-video-karpathy",
    type: "video",
    slug: "lets-build-gpt-from-scratch",
    category_id: "cat-ai",
    category: cat("ai"),
    content_html: videoSummaryHtml,
    content_text: "Bigram model self-attention GPT. Attention is weighted averaging over the past. Tokens talk to each other only through attention.",
    title: "Let's build GPT: from scratch, in code, spelled out",
    summary:
      "The single best two hours to really understand what a transformer is doing. I rewatch the attention part every few months.",
    url: "https://www.youtube.com/watch?v=kCc8FmEb1nY",
    author: "Andrej Karpathy",
    platform: "youtube",
    tags: ["llm", "deep-learning", "python"],
    language: "en",
    rating: 5,
    featured: true,
    published: true,
    published_at: "2026-03-14T12:00:00Z",
    created_at: "2026-03-14T12:00:00Z",
  },
  {
    id: "seed-article-vercel-react",
    type: "article",
    slug: "a-complete-guide-to-useeffect",
    category_id: "cat-frontend",
    category: cat("frontend"),
    content_html: articleSummaryHtml,
    content_text: "Effects are not lifecycle hooks. Every render captures its own values. Don't lie to React about dependencies.",
    title: "A Complete Guide to useEffect",
    summary:
      "Dan's long-form explanation of effects, closures and dependency arrays. Fixed half of my React bugs by reading it twice.",
    url: "https://overreacted.io/a-complete-guide-to-useeffect/",
    author: "Dan Abramov",
    platform: "website",
    tags: ["react", "javascript"],
    language: "en",
    rating: 5,
    status: "done",
    featured: false,
    published: true,
    published_at: "2026-02-10T12:00:00Z",
    created_at: "2026-02-10T12:00:00Z",
  },
  {
    id: "seed-book-ddia",
    type: "book",
    slug: "designing-data-intensive-applications",
    category_id: "cat-backend",
    category: cat("backend"),
    title: "Designing Data-Intensive Applications",
    summary:
      "The book behind most of the backend decisions I make: replication, partitioning, and why 'just use Postgres' is usually right.",
    url: "https://dataintensive.net/",
    author: "Martin Kleppmann",
    platform: "book",
    tags: ["backend", "databases", "architecture"],
    language: "en",
    rating: 5,
    status: "in_progress",
    featured: false,
    published: true,
    published_at: "2026-01-22T12:00:00Z",
    created_at: "2026-01-22T12:00:00Z",
  },
  {
    id: "seed-course-fast-ai",
    type: "course",
    slug: "practical-deep-learning-for-coders",
    category_id: "cat-ai",
    category: cat("ai"),
    title: "Practical Deep Learning for Coders",
    summary: "Top-down, code-first deep learning. How I went from 'I know the theory' to training models that shipped.",
    url: "https://course.fast.ai/",
    author: "fast.ai",
    platform: "website",
    tags: ["deep-learning", "python"],
    language: "en",
    rating: 4,
    status: "done",
    featured: false,
    published: true,
    published_at: "2025-12-05T12:00:00Z",
    created_at: "2025-12-05T12:00:00Z",
  },
  {
    id: "seed-website-mdn",
    type: "website",
    slug: "mdn-web-docs",
    category_id: "cat-frontend",
    category: cat("frontend"),
    title: "MDN Web Docs",
    summary: "Still the reference for anything browser-related. Bookmark the Web APIs section.",
    url: "https://developer.mozilla.org/",
    author: null,
    platform: "website",
    tags: ["javascript", "web", "reference"],
    language: "en",
    featured: false,
    published: true,
    published_at: "2025-11-01T12:00:00Z",
    created_at: "2025-11-01T12:00:00Z",
  },
  {
    id: "seed-tool-supabase",
    type: "tool",
    slug: "supabase",
    category_id: "cat-backend",
    category: cat("backend"),
    title: "Supabase",
    summary: "Postgres + auth + storage with a generous free tier. Powers this very knowledge base.",
    url: "https://supabase.com/",
    author: null,
    platform: "website",
    tags: ["backend", "databases", "tools"],
    language: "en",
    featured: false,
    published: true,
    published_at: "2025-10-15T12:00:00Z",
    created_at: "2025-10-15T12:00:00Z",
  },
  {
    id: "seed-channel-fireship",
    type: "channel",
    slug: "fireship",
    category_id: "cat-frontend",
    category: cat("frontend"),
    title: "Fireship",
    summary: "100-second explainers that tell me whether a new tool is worth a weekend.",
    url: "https://www.youtube.com/@Fireship",
    author: "Jeff Delaney",
    platform: "youtube",
    tags: ["web", "tools"],
    language: "en",
    featured: false,
    published: true,
    published_at: "2025-09-10T12:00:00Z",
    created_at: "2025-09-10T12:00:00Z",
  },
  {
    id: "seed-person-karpathy-x",
    type: "person",
    slug: "andrej-karpathy",
    category_id: "cat-ai",
    category: cat("ai"),
    title: "Andrej Karpathy",
    summary: "The clearest thinker on what LLMs are actually doing. Read everything he posts.",
    url: "https://x.com/karpathy",
    author: "Andrej Karpathy",
    platform: "twitter",
    tags: ["llm", "deep-learning"],
    language: "en",
    featured: false,
    published: true,
    published_at: "2025-08-20T12:00:00Z",
    created_at: "2025-08-20T12:00:00Z",
  },
];
