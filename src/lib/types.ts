export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at?: string;
};

export type Tag = {
  id: string;
  name: string;
  slug: string;
  created_at?: string;
};

export type PostStatus = "draft" | "published";

export type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_url: string | null;
  status: PostStatus;
  featured: boolean;
  views: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  category_id: string | null;
  category?: Category | null;
  tags?: Tag[];
};

export type Comment = {
  id: string;
  post_id: string;
  author_name: string;
  author_email: string;
  content: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
};

export type Project = {
  id: string;
  title: string;
  slug: string;
  description: string;
  tech_stack: string[];
  repo_url: string | null;
  demo_url: string | null;
  featured: boolean;
  created_at: string;
};
