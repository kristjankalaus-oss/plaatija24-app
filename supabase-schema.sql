-- ==============================================================================
-- Plaatija24 & Mikrotsement – Supabase Andmebaasi Täielik Skeem
-- Kopeeri kogu see sisu ja kleebi Supabase SQL Editori, seejärel vajuta "RUN"
-- ==============================================================================

-- 1. LAIENDUSED
create extension if not exists "uuid-ossp";

-- 2. MEISTRITE / PAIGALDAJATE PROFIILID
create table if not exists public.tiler_profiles (
  id                    text primary key,
  name                  text not null,
  company_name          text not null,
  registry_code         text,
  avatar_url            text,
  city                  text not null,
  service_regions       text[] not null default '{}',
  services              text[] not null default '{plaat}', -- 'plaat', 'mikrotsement'
  experience_years      integer default 5,
  phone                 text not null,
  email                 text not null,
  rating                numeric(3,1) default 5.0,
  reviews_count         integer default 0,
  completed_jobs_count  integer default 0,
  bio                   text,
  badges                text[] default '{}',
  verified              boolean default true,
  subscription_tier     text check (subscription_tier in ('free', 'pro_1290', 'vip_b2b_2500')) default 'free',
  quotes_used_this_month integer default 0,
  quotes_limit          integer default 3,
  created_at            timestamptz default now(),
  updated_at            timestamptz default now()
);

-- 3. TEHTUD TÖÖDE GALERII
create table if not exists public.gallery_items (
  id                text primary key,
  tiler_id          text references public.tiler_profiles(id) on delete cascade not null,
  title             text not null,
  room_type         text default 'Vannituba',
  service_type      text check (service_type in ('plaat', 'mikrotsement', 'mõlemad')) default 'plaat',
  image_url         text not null,
  before_image_url  text,
  description       text,
  tile_details      text,
  completed_year    text,
  created_at        timestamptz default now()
);

-- 4. KLIENDI PROJEKTID JA PÄRINGUD
create table if not exists public.project_inquiries (
  id                  text primary key,
  created_at          timestamptz default now(),
  updated_at          timestamptz default now(),
  status              text check (status in ('uus', 'pakkumised_avatud', 'töös', 'lõpetatud')) default 'pakkumised_avatud',

  -- Tellija info ja tüüp
  client_type         text check (client_type in ('private', 'contractor_b2b')) default 'private',
  is_b2b_project      boolean default false,
  min_tier_required   text check (min_tier_required in ('free', 'pro_1290', 'vip_b2b_2500')) default 'free',

  client_name         text not null,
  client_email        text not null,
  client_phone        text,
  company_name        text,
  city                text not null,
  address             text,

  -- Objekti parameetrid
  room_type           text default 'Vannituba',
  room_type_label     text default 'Vannituba',
  service_type        text check (service_type in ('plaat', 'mikrotsement', 'mõlemad')) not null,

  -- Süsteemi eelistus (MIRA, Mapei jne)
  system_brand        text default 'mira',
  system_brand_label  text default 'MIRA (Taani)',

  -- Mahutabel ja töölõigud (JSON)
  scope               jsonb not null default '{}'::jsonb,

  -- Plaatide ja mikrotsemendi spetsifikatsioon (JSON)
  tile_specs          jsonb,
  microcement_specs   jsonb,

  description         text,
  files               jsonb default '[]'::jsonb,

  -- AI Kalkulatsioon ja Visualiseeringud
  ai_estimate         jsonb not null default '{}'::jsonb,
  ai_visualizations   text[] default '{}'
);

-- 5. PAIGALDAJATE KOHANDATUD PAKKUMISED
create table if not exists public.contractor_quotes (
  id                  text primary key,
  project_id          text references public.project_inquiries(id) on delete cascade not null,
  tiler_id            text references public.tiler_profiles(id) on delete cascade not null,
  tiler_name          text not null,
  tiler_company       text not null,
  tiler_avatar        text,
  tiler_rating        numeric(3,1) default 5.0,
  tiler_city          text,

  labor_price         numeric(10,2) not null,
  material_price      numeric(10,2) not null default 0,
  total_price         numeric(10,2) not null,
  materials_included  boolean default true,

  estimated_start_date text,
  estimated_duration   text,
  warranty_years      integer default 2,
  comment             text,
  status              text check (status in ('esitatud', 'aktsepteeritud', 'tagasi_lükatud')) default 'esitatud',
  created_at          timestamptz default now()
);

-- 6. KIIRSÕNUMID JA VESTLUSED
create table if not exists public.project_messages (
  id                  text primary key,
  project_id          text references public.project_inquiries(id) on delete cascade not null,
  conversation_id     text not null,
  sender_type         text check (sender_type in ('client', 'tiler')) not null,
  sender_name         text not null,
  message             text not null,
  created_at          timestamptz default now()
);

-- 7. ADMIN TOOTED JA LETIHINNAD
create table if not exists public.admin_products (
  id                  text primary key,
  brand               text not null,
  category            text not null,
  name                text not null,
  unit                text not null,
  retail_price        numeric(10,2) not null,
  description         text,
  in_stock            boolean default true,
  created_at          timestamptz default now()
);

-- 7. TURU HINNAKIRJA REEGLID (2026 turg: Topciment, Remondisemu, Remonditurg)
create table if not exists public.pricing_rules (
  id              text primary key,
  category        text not null, -- 'plaat', 'mikrotsement', 'ettevalmistus', 'viimistlus', 'eritoo'
  title           text not null,
  description     text,
  unit            text not null default 'm²',
  labor_price     numeric(10,2) not null default 0,
  material_price  numeric(10,2) not null default 0,
  min_area        numeric(10,2),
  min_project_fee numeric(10,2),
  enabled         boolean default true,
  updated_at      timestamptz default now()
);

-- 8. INDEKSID JÕUDLUSEKS
create index if not exists idx_tiler_profiles_city on public.tiler_profiles(city);
create index if not exists idx_gallery_items_tiler_id on public.gallery_items(tiler_id);
create index if not exists idx_project_inquiries_status on public.project_inquiries(status);
create index if not exists idx_contractor_quotes_project on public.contractor_quotes(project_id);
create index if not exists idx_project_messages_project on public.project_messages(project_id);

-- 9. ROW LEVEL SECURITY (RLS) - lubame turvalise lugemise ja kirjutamise
alter table public.tiler_profiles    enable row level security;
alter table public.gallery_items     enable row level security;
alter table public.project_inquiries enable row level security;
alter table public.contractor_quotes enable row level security;
alter table public.project_messages  enable row level security;
alter table public.admin_products    enable row level security;
alter table public.pricing_rules     enable row level security;

-- Avalik lugemine
create policy "public_read_tiler_profiles"    on public.tiler_profiles    for select using (true);
create policy "public_read_gallery_items"     on public.gallery_items     for select using (true);
create policy "public_read_project_inquiries" on public.project_inquiries for select using (true);
create policy "public_read_contractor_quotes" on public.contractor_quotes for select using (true);
create policy "public_read_project_messages"  on public.project_messages  for select using (true);
create policy "public_read_admin_products"    on public.admin_products    for select using (true);
create policy "public_read_pricing_rules"     on public.pricing_rules     for select using (true);

-- Avalik kirjutamine / muutmine
create policy "public_insert_project_inquiries" on public.project_inquiries for insert with check (true);
create policy "public_update_project_inquiries" on public.project_inquiries for update using (true);
create policy "public_insert_contractor_quotes" on public.contractor_quotes for insert with check (true);
create policy "public_insert_project_messages"  on public.project_messages  for insert with check (true);
create policy "public_insert_gallery_items"     on public.gallery_items     for insert with check (true);
create policy "public_insert_tiler_profiles"    on public.tiler_profiles    for insert with check (true);
create policy "public_update_tiler_profiles"    on public.tiler_profiles    for update using (true);
create policy "public_insert_admin_products"    on public.admin_products    for insert with check (true);
create policy "public_update_admin_products"    on public.admin_products    for update using (true);
create policy "public_insert_pricing_rules"     on public.pricing_rules     for insert with check (true);
create policy "public_update_pricing_rules"     on public.pricing_rules     for update using (true);

-- Baas on valmis puhasteks reaalseteks kasutajate ja päringute andmeteks.
