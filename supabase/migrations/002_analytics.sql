-- Page view tracking
create table if not exists page_views (
  id bigserial primary key,
  path text not null,
  referrer text,
  country text,
  city text,
  user_agent text,
  created_at timestamptz not null default now()
);

create index page_views_path_idx on page_views(path);
create index page_views_created_at_idx on page_views(created_at);

alter table page_views enable row level security;
-- Only service role can insert/read (via API route)
create policy "Service role manages page views" on page_views for all using (false);

-- Helper views for analytics queries
create or replace view admin_top_pages as
  select path, count(*) as views
  from page_views
  where created_at > now() - interval '30 days'
  group by path
  order by views desc;

create or replace view admin_top_countries as
  select country, count(*) as views
  from page_views
  where country is not null and created_at > now() - interval '30 days'
  group by country
  order by views desc;

create or replace view admin_top_cities as
  select city, count(*) as views
  from page_views
  where city is not null and created_at > now() - interval '30 days'
  group by city
  order by views desc;
