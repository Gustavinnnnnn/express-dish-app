
-- Categorias
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  emoji text,
  image_url text,
  position integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Produtos
create table public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price numeric(10,2) not null default 0,
  image_url text,
  category_id uuid references public.categories(id) on delete set null,
  featured boolean not null default false,
  active boolean not null default true,
  extras jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Ofertas
create table public.offers (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text,
  price numeric(10,2) not null default 0,
  old_price numeric(10,2),
  image_url text,
  product_id uuid references public.products(id) on delete set null,
  active boolean not null default true,
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Clientes
create table public.customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  address text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Pedidos
create type public.order_status as enum ('novo','preparo','finalizado','cancelado');

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  code text not null unique default ('#' || lpad((floor(random()*100000))::text, 5, '0')),
  customer_id uuid references public.customers(id) on delete set null,
  customer_name text,
  customer_phone text,
  items jsonb not null default '[]'::jsonb,
  total numeric(10,2) not null default 0,
  status public.order_status not null default 'novo',
  payment_method text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Equipe
create table public.team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  role text not null default 'operador',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Aparência / Configurações da loja (singleton)
create table public.store_settings (
  id uuid primary key default gen_random_uuid(),
  store_name text not null default 'Roxo Açaí',
  tagline text default 'Açaí cremoso do jeito que você ama',
  logo_url text,
  banner_url text,
  primary_color text not null default '270 70% 45%',
  whatsapp text default '5551999999999',
  address text default 'Rua dos Frutos, 456 — Centro',
  default_message text default 'Olá! Gostaria de fazer um pedido:',
  hours jsonb not null default '{"seg":"18:00-23:00","ter":"18:00-23:00","qua":"18:00-23:00","qui":"18:00-23:00","sex":"18:00-23:30","sab":"18:00-23:30","dom":"18:00-22:00"}'::jsonb,
  payment_methods jsonb not null default '["pix","dinheiro","cartao"]'::jsonb,
  hero_title text default 'Açaí cremoso na sua porta',
  hero_subtitle text default 'Monte do seu jeito e receba em minutos',
  updated_at timestamptz not null default now()
);

insert into public.store_settings (store_name) values ('Roxo Açaí');

-- Trigger updated_at
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

create trigger t_categories_upd before update on public.categories for each row execute function public.touch_updated_at();
create trigger t_products_upd   before update on public.products   for each row execute function public.touch_updated_at();
create trigger t_offers_upd     before update on public.offers     for each row execute function public.touch_updated_at();
create trigger t_customers_upd  before update on public.customers  for each row execute function public.touch_updated_at();
create trigger t_orders_upd     before update on public.orders     for each row execute function public.touch_updated_at();
create trigger t_team_upd       before update on public.team_members for each row execute function public.touch_updated_at();
create trigger t_settings_upd   before update on public.store_settings for each row execute function public.touch_updated_at();

-- RLS aberta (admin sem login conforme escolha do usuário)
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.offers enable row level security;
alter table public.customers enable row level security;
alter table public.orders enable row level security;
alter table public.team_members enable row level security;
alter table public.store_settings enable row level security;

create policy "public read categories" on public.categories for select using (true);
create policy "public write categories" on public.categories for all using (true) with check (true);
create policy "public read products" on public.products for select using (true);
create policy "public write products" on public.products for all using (true) with check (true);
create policy "public read offers" on public.offers for select using (true);
create policy "public write offers" on public.offers for all using (true) with check (true);
create policy "public read customers" on public.customers for select using (true);
create policy "public write customers" on public.customers for all using (true) with check (true);
create policy "public read orders" on public.orders for select using (true);
create policy "public write orders" on public.orders for all using (true) with check (true);
create policy "public read team" on public.team_members for select using (true);
create policy "public write team" on public.team_members for all using (true) with check (true);
create policy "public read settings" on public.store_settings for select using (true);
create policy "public write settings" on public.store_settings for all using (true) with check (true);

-- Storage bucket para uploads (logo, banner, produtos)
insert into storage.buckets (id, name, public) values ('store-assets','store-assets', true)
on conflict (id) do nothing;

create policy "public read store-assets" on storage.objects for select using (bucket_id = 'store-assets');
create policy "public write store-assets" on storage.objects for all using (bucket_id = 'store-assets') with check (bucket_id = 'store-assets');
