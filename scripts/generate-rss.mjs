/**
 * Generates public/rss.xml from content/articles/*.md (full post content).
 * Runs before every build (see prebuild / prebuild:pages in package.json).
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkHtml from "remark-html";

const SITE_URL = "https://dheerajreddybhumanapalli.github.io";
const POSTS_DIR = path.join(process.cwd(), "content", "articles");
const OUT_PATH = path.join(process.cwd(), "public", "rss.xml");

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function absolutizeUrls(html) {
  return html
    .replace(/href="\//g, `href="${SITE_URL}/`)
    .replace(/src="\//g, `src="${SITE_URL}/`);
}

function cdata(html) {
  return `<![CDATA[${html.replaceAll("]]>", "]]&gt;")}]]>`;
}

const posts = [];
if (fs.existsSync(POSTS_DIR)) {
  for (const fileName of fs.readdirSync(POSTS_DIR)) {
    if (!fileName.endsWith(".md") || fileName.startsWith("_")) continue;
    const slug = fileName.replace(/\.md$/, "");
    const raw = fs.readFileSync(path.join(POSTS_DIR, fileName), "utf8");
    const { data, content } = matter(raw);
    if (!data.title || !data.date || !data.summary) {
      console.warn(`rss: skipping "${fileName}" (missing title/date/summary)`);
      continue;
    }
    if (data.draft === true) continue;
    const rendered = await remark().use(remarkHtml).process(content);
    const tags = Array.isArray(data.tags) ? data.tags.map(String) : [];
    posts.push({
      slug,
      title: String(data.title),
      date: String(data.date),
      summary: String(data.summary),
      tags,
      contentHtml: absolutizeUrls(String(rendered)),
    });
  }
}
posts.sort((a, b) => (a.date < b.date ? 1 : -1));

const items = posts
  .map(
    (post) => `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${SITE_URL}/articles/${post.slug}/</link>
      <guid isPermaLink="true">${SITE_URL}/articles/${post.slug}/</guid>
      <pubDate>${new Date(`${post.date}T00:00:00Z`).toUTCString()}</pubDate>
      <description>${escapeXml(post.summary)}</description>
      <content:encoded>${cdata(post.contentHtml)}</content:encoded>
${post.tags.map((t) => `      <category>${escapeXml(t)}</category>`).join("\n")}
    </item>`
  )
  .join("\n");

const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Dheeraj Reddy Bhumanapalli — Articles</title>
    <link>${SITE_URL}/articles/</link>
    <description>Articles by Dheeraj Reddy Bhumanapalli — notes on AI, software engineering, and things worth writing down.</description>
    <language>en</language>
${items ? items + "\n" : ""}  </channel>
</rss>
`;

fs.writeFileSync(OUT_PATH, rss);
console.log(`rss: wrote ${posts.length} item(s) to public/rss.xml`);
