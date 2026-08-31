/**
 * Knowledge UI constants — type labels, filter groups, Notion colours.
 * Live entries and categories come from Neon Postgres only (see src/lib/knowledge.js).
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
