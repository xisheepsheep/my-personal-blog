create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists public.tags (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text not null,
  content text not null,
  cover_url text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  featured boolean not null default false,
  views integer not null default 0,
  category_id uuid references public.categories(id) on delete set null,
  author_id uuid references auth.users(id) on delete set null,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.post_tags (
  post_id uuid not null references public.posts(id) on delete cascade,
  tag_id uuid not null references public.tags(id) on delete cascade,
  primary key (post_id, tag_id)
);

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  author_name text not null,
  author_email text not null,
  content text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text not null,
  tech_stack text[] not null default '{}',
  repo_url text,
  demo_url text,
  featured boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists posts_status_published_at_idx on public.posts(status, published_at desc);
create index if not exists posts_category_idx on public.posts(category_id);
create index if not exists posts_search_idx on public.posts using gin (to_tsvector('simple', title || ' ' || excerpt || ' ' || content));
create index if not exists comments_post_status_idx on public.comments(post_id, status);

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists posts_touch_updated_at on public.posts;
create trigger posts_touch_updated_at before update on public.posts
for each row execute function public.touch_updated_at();

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce(auth.jwt() ->> 'email', '') = coalesce(current_setting('app.admin_email', true), '');
$$;

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.tags enable row level security;
alter table public.posts enable row level security;
alter table public.post_tags enable row level security;
alter table public.comments enable row level security;
alter table public.projects enable row level security;

drop policy if exists "public read categories" on public.categories;
create policy "public read categories" on public.categories for select using (true);
drop policy if exists "admin write categories" on public.categories;
create policy "admin write categories" on public.categories for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "public read tags" on public.tags;
create policy "public read tags" on public.tags for select using (true);
drop policy if exists "admin write tags" on public.tags;
create policy "admin write tags" on public.tags for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "public read published posts" on public.posts;
create policy "public read published posts" on public.posts for select using (status = 'published');
drop policy if exists "admin manage posts" on public.posts;
create policy "admin manage posts" on public.posts for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "public read post tags" on public.post_tags;
create policy "public read post tags" on public.post_tags for select using (true);
drop policy if exists "admin manage post tags" on public.post_tags;
create policy "admin manage post tags" on public.post_tags for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "public read approved comments" on public.comments;
create policy "public read approved comments" on public.comments for select using (status = 'approved');
drop policy if exists "public insert pending comments" on public.comments;
create policy "public insert pending comments" on public.comments for insert with check (status = 'pending');
drop policy if exists "admin manage comments" on public.comments;
create policy "admin manage comments" on public.comments for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "public read projects" on public.projects;
create policy "public read projects" on public.projects for select using (true);
drop policy if exists "admin manage projects" on public.projects;
create policy "admin manage projects" on public.projects for all using (public.is_admin()) with check (public.is_admin());

insert into public.categories (name, slug, description) values
  ('前端工程', 'frontend', 'Next.js、React 与工程化'),
  ('生活思考', 'life', '学习、阅读与日常观察'),
  ('项目复盘', 'projects', '从想法到上线的记录')
on conflict (slug) do nothing;

insert into public.tags (name, slug) values
  ('Next.js', 'nextjs'),
  ('Supabase', 'supabase'),
  ('Markdown', 'markdown'),
  ('SEO', 'seo')
on conflict (slug) do nothing;

insert into public.posts (title, slug, excerpt, content, cover_url, status, featured, category_id, published_at)
select
  '用 Next.js 和 Supabase 搭建个人博客',
  'build-blog-with-nextjs-supabase',
  '从数据库建模、Markdown 编辑到 Vercel 部署，记录一次完整的博客工程实践。',
  '## 欢迎\n\n这是一篇由初始化脚本创建的示例文章。\n\n```ts\nconsole.log("hello blog")\n```',
  'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1600&auto=format&fit=crop',
  'published',
  true,
  c.id,
  now()
from public.categories c
where c.slug = 'frontend'
on conflict (slug) do nothing;

insert into public.projects (title, slug, description, tech_stack, repo_url, demo_url, featured) values
  ('Content Studio', 'content-studio', '面向个人创作者的 Markdown 内容管理小工具。', array['Next.js','Supabase','Tailwind CSS'], 'https://github.com/alex/content-studio', 'https://example.com', true)
on conflict (slug) do nothing;

insert into storage.buckets (id, name, public)
values ('covers', 'covers', true)
on conflict (id) do update set public = true;
