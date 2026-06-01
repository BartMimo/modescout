-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles (linked to auth.users)
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  role text not null default 'buyer' check (role in ('buyer', 'brand', 'admin')),
  full_name text,
  email text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Brands
create table brands (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid references profiles(id) on delete cascade not null,
  name text not null,
  slug text not null unique,
  tagline text,
  story text,
  logo_url text,
  status text not null default 'pending' check (status in ('pending', 'active', 'paused')),
  stripe_account_id text,
  charges_enabled boolean not null default false,
  payouts_enabled boolean not null default false,
  commission_rate numeric(4,2) not null default 0.15,
  featured boolean not null default false,
  legal_name text,
  address text,
  kvk_number text,
  vat_number text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Products
create table products (
  id uuid primary key default uuid_generate_v4(),
  brand_id uuid references brands(id) on delete cascade not null,
  title text not null,
  description text,
  category text,
  base_price_cents integer not null check (base_price_cents > 0),
  currency text not null default 'eur',
  status text not null default 'draft' check (status in ('draft', 'published')),
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Product images
create table product_images (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid references products(id) on delete cascade not null,
  url text not null,
  storage_path text,
  position integer not null default 0
);

-- Product variants
create table product_variants (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid references products(id) on delete cascade not null,
  size text,
  color text,
  sku text,
  stock_qty integer not null default 0,
  price_cents integer
);

-- Orders
create table orders (
  id uuid primary key default uuid_generate_v4(),
  buyer_id uuid references profiles(id),
  email text not null,
  shipping_address jsonb not null,
  total_cents integer not null,
  status text not null default 'pending' check (status in ('pending', 'paid', 'failed')),
  stripe_payment_intent_id text,
  idempotency_key uuid not null unique default uuid_generate_v4(),
  created_at timestamptz not null default now()
);

-- Order items
create table order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references orders(id) on delete cascade not null,
  brand_id uuid references brands(id) not null,
  product_variant_id uuid references product_variants(id) not null,
  title_snapshot text not null,
  quantity integer not null default 1,
  unit_price_cents integer not null,
  commission_cents integer,
  transfer_id text,
  transfer_failed boolean not null default false,
  fulfillment_status text not null default 'new' check (fulfillment_status in ('new', 'shipped'))
);

-- Featured items (admin curatie)
create table featured_items (
  id uuid primary key default uuid_generate_v4(),
  type text not null check (type in ('brand', 'product')),
  ref_id uuid not null,
  position integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Auto-update updated_at
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at before update on profiles
  for each row execute function update_updated_at();
create trigger brands_updated_at before update on brands
  for each row execute function update_updated_at();
create trigger products_updated_at before update on products
  for each row execute function update_updated_at();

-- Auto-create profile on signup
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, email, role)
  values (new.id, new.email, 'buyer');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ============================
-- Row Level Security
-- ============================

alter table profiles enable row level security;
alter table brands enable row level security;
alter table products enable row level security;
alter table product_images enable row level security;
alter table product_variants enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table featured_items enable row level security;

-- Helper: get current user role
create or replace function current_user_role()
returns text as $$
  select role from profiles where id = auth.uid();
$$ language sql security definer stable;

-- Profiles
create policy "Users can read own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
create policy "Admin reads all profiles" on profiles for select using (current_user_role() = 'admin');

-- Brands: public active brands
create policy "Public can view active brands" on brands for select using (status = 'active');
create policy "Owner manages own brand" on brands for all using (owner_id = auth.uid());
create policy "Admin manages all brands" on brands for all using (current_user_role() = 'admin');

-- Products: public published products of active brands
create policy "Public can view published products" on products for select
  using (status = 'published' and exists (
    select 1 from brands where brands.id = products.brand_id and brands.status = 'active'
  ));
create policy "Brand owner manages products" on products for all
  using (exists (select 1 from brands where brands.id = products.brand_id and brands.owner_id = auth.uid()));
create policy "Admin manages all products" on products for all using (current_user_role() = 'admin');

-- Product images
create policy "Public views product images" on product_images for select using (true);
create policy "Brand owner manages images" on product_images for all
  using (exists (
    select 1 from products p join brands b on b.id = p.brand_id
    where p.id = product_images.product_id and b.owner_id = auth.uid()
  ));

-- Product variants
create policy "Public views variants" on product_variants for select using (true);
create policy "Brand owner manages variants" on product_variants for all
  using (exists (
    select 1 from products p join brands b on b.id = p.brand_id
    where p.id = product_variants.product_id and b.owner_id = auth.uid()
  ));

-- Orders
create policy "Buyer sees own orders" on orders for select using (buyer_id = auth.uid());
create policy "Admin sees all orders" on orders for all using (current_user_role() = 'admin');
create policy "Service role inserts orders" on orders for insert with check (true);
create policy "Service role updates orders" on orders for update using (true);

-- Order items
create policy "Buyer sees own order items" on order_items for select
  using (exists (select 1 from orders where orders.id = order_items.order_id and orders.buyer_id = auth.uid()));
create policy "Brand sees own order items" on order_items for select
  using (exists (select 1 from brands where brands.id = order_items.brand_id and brands.owner_id = auth.uid()));
create policy "Brand updates fulfillment" on order_items for update
  using (exists (select 1 from brands where brands.id = order_items.brand_id and brands.owner_id = auth.uid()));
create policy "Admin sees all order items" on order_items for all using (current_user_role() = 'admin');
create policy "Service role inserts order items" on order_items for insert with check (true);
create policy "Service role updates order items" on order_items for update using (true);

-- Featured items
create policy "Public views featured items" on featured_items for select using (active = true);
create policy "Admin manages featured items" on featured_items for all using (current_user_role() = 'admin');
