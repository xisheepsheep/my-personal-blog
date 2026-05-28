import "server-only";

import { categories, comments, posts, projects, tags } from "@/lib/sample-data";
import { createSupabaseAdminClient, isSupabaseConfigured } from "@/lib/supabase";
import type { Category, Comment, Post, Project, Tag } from "@/lib/types";

const postSelect = "*, category:categories(*), tags:post_tags(tags(*))";

type PostRow = Omit<Post, "category" | "tags"> & {
  category?: Category | null;
  tags?: { tags: Tag | null }[];
};

function mapPost(row: PostRow): Post {
  return {
    ...row,
    category: row.category ?? null,
    tags: Array.isArray(row.tags) ? row.tags.map((item) => item.tags).filter((tag): tag is Tag => Boolean(tag)) : [],
  };
}

export async function getPosts(params?: {
  query?: string;
  category?: string;
  tag?: string;
  status?: "published" | "draft" | "all";
  page?: number;
  pageSize?: number;
}) {
  if (!isSupabaseConfigured()) {
    const query = params?.query?.toLowerCase();
    const filtered = posts.filter((post) => {
      const matchQuery = !query || `${post.title} ${post.excerpt} ${post.content}`.toLowerCase().includes(query);
      const matchCategory = !params?.category || post.category?.slug === params.category;
      const matchTag = !params?.tag || post.tags?.some((tag) => tag.slug === params.tag);
      const matchStatus = !params?.status || params.status === "all" || post.status === params.status;
      return matchQuery && matchCategory && matchTag && matchStatus;
    });
    return { posts: filtered, count: filtered.length };
  }

  const page = params?.page || 1;
  const pageSize = params?.pageSize || 9;
  let query = createSupabaseAdminClient()
    .from("posts")
    .select(postSelect, { count: "exact" })
    .order("published_at", { ascending: false, nullsFirst: false });

  if (params?.status && params.status !== "all") query = query.eq("status", params.status);
  if (!params?.status) query = query.eq("status", "published");
  if (params?.query) query = query.or(`title.ilike.%${params.query}%,excerpt.ilike.%${params.query}%,content.ilike.%${params.query}%`);
  if (params?.category) query = query.eq("category.slug", params.category);
  if (params?.tag) query = query.eq("tags.tags.slug", params.tag);

  const from = (page - 1) * pageSize;
  const { data, error, count } = await query.range(from, from + pageSize - 1);
  if (error) throw error;
  return { posts: (data || []).map(mapPost), count: count || 0 };
}

export async function getFeaturedPosts() {
  const { posts } = await getPosts({ status: "published", pageSize: 6 });
  return posts.filter((post) => post.featured).slice(0, 3);
}

export async function getPostBySlug(slug: string) {
  if (!isSupabaseConfigured()) return posts.find((post) => post.slug === slug && post.status === "published") || null;
  const { data, error } = await createSupabaseAdminClient().from("posts").select(postSelect).eq("slug", slug).eq("status", "published").single();
  if (error) return null;
  return mapPost(data);
}

export async function getPostById(id: string) {
  if (!isSupabaseConfigured()) return posts.find((post) => post.id === id) || null;
  const { data, error } = await createSupabaseAdminClient().from("posts").select(postSelect).eq("id", id).single();
  if (error) return null;
  return mapPost(data);
}

export async function getCategories(): Promise<Category[]> {
  if (!isSupabaseConfigured()) return categories;
  const { data, error } = await createSupabaseAdminClient().from("categories").select("*").order("name");
  if (error) throw error;
  return data || [];
}

export async function getTags(): Promise<Tag[]> {
  if (!isSupabaseConfigured()) return tags;
  const { data, error } = await createSupabaseAdminClient().from("tags").select("*").order("name");
  if (error) throw error;
  return data || [];
}

export async function getProjects(): Promise<Project[]> {
  if (!isSupabaseConfigured()) return projects;
  const { data, error } = await createSupabaseAdminClient().from("projects").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function getComments(postId?: string, approvedOnly = true): Promise<Comment[]> {
  if (!isSupabaseConfigured()) return comments.filter((comment) => (!postId || comment.post_id === postId) && (!approvedOnly || comment.status === "approved"));
  let query = createSupabaseAdminClient().from("comments").select("*").order("created_at", { ascending: false });
  if (postId) query = query.eq("post_id", postId);
  if (approvedOnly) query = query.eq("status", "approved");
  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function getDashboardStats() {
  const [{ posts }, allComments, allCategories, allTags] = await Promise.all([
    getPosts({ status: "all", pageSize: 100 }),
    getComments(undefined, false),
    getCategories(),
    getTags(),
  ]);
  return {
    posts: posts.length,
    comments: allComments.length,
    categories: allCategories.length,
    tags: allTags.length,
  };
}
