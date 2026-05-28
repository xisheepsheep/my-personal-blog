import { getPosts } from "@/lib/data";
import { siteConfig } from "@/lib/site";
import { absoluteUrl } from "@/lib/utils";

export async function GET() {
  const { posts } = await getPosts({ status: "published", pageSize: 50 });
  const items = posts
    .map((post) => `<item><title><![CDATA[${post.title}]]></title><link>${absoluteUrl(`/blog/${post.slug}`)}</link><description><![CDATA[${post.excerpt}]]></description><pubDate>${new Date(post.published_at || post.created_at).toUTCString()}</pubDate><guid>${absoluteUrl(`/blog/${post.slug}`)}</guid></item>`)
    .join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${siteConfig.name}</title><link>${siteConfig.url}</link><description>${siteConfig.description}</description>${items}</channel></rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
