import { getPosts } from "@/lib/data";
import { absoluteUrl } from "@/lib/utils";

export async function GET() {
  const { posts } = await getPosts({ status: "published", pageSize: 100 });
  const staticRoutes = ["", "/blog", "/about", "/projects"];
  const urls = [
    ...staticRoutes.map((path) => `<url><loc>${absoluteUrl(path)}</loc></url>`),
    ...posts.map((post) => `<url><loc>${absoluteUrl(`/blog/${post.slug}`)}</loc><lastmod>${new Date(post.updated_at).toISOString()}</lastmod></url>`),
  ].join("");
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
