-- ==============================================================================
-- Plaatija24 & Mikrotsement – Supabase Andmebaasi Täielik Skeem
-- ==============================================================================

-- 1. EXTENSIONS
create extension if not exists "uuid-ossp";

-- 2. PAIGALDAJATE / MEISTRITE PROFIILID
create table if not exists tiler_profiles (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid references auth.users(id) on delete cascade,
  name                text not null,
  company_name        text not null,
  registry_code       text,
  avatar_url          text,
  city                text not null,
  service_regions     text[] not null default '{}',
  services            text[] not null default '{plaat}', -- 'plaat', 'mikrotsement'
  experience_years    integer default 5,
  phone               text not null,
  email               text not null,
  rating              numeric(2,1) default 5.0,
  reviews_count       integer default 0,
  completed_jobs_count integer default 0,
  bio                 text,
  badges              text[] default '{}',
  verified            boolean default true,
  created_at          timestamptz default now(),
  updated_at          timestamptz default now()
);

-- 3. TEHTUD TÖÖDE GALERII
create table if not exists gallery_items (
  id              uuid primary key default gen_random_uuid(),
  tiler_id        uuid references tiler_profiles(id) on delete cascade not null,
  title           text not null,
  room_type       text default 'Vannituba',
  service_type    text check (service_type in ('plaat', 'mikrotsement')) default 'plaat',
  image_url       text not null,
  before_image_url text,
  description     text,
  tile_details    text,
  completed_year  text,
  created_at      timestamptz default now()
);

-- 4. KLIENDI PROJEKTID JA PÄRINGUD
create table if not exists project_inquiries (
  id                  text primary key, -- nt 'proj-...' või uuid
  created_at          timestamptz default now(),
  updated_at          timestamptz default now(),
  status              text check (status in ('uus', 'pakkumised_avatud', 'töös', 'lõpetatud')) default 'pakkumised_avatud',

  -- Tellija kontakt
  client_name         text not null,
  client_email        text not null,
  client_phone        text,
  city                text not null,
  address             text,

  -- Objekti parameetrid
  room_type           text not null,
  room_type_label     text not null,
  service_type        text check (service_type in ('plaat', 'mikrotsement', 'mõlemad')) not null,

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
create table if not exists contractor_quotes (
  id                  text primary key,
  project_id          text references project_inquiries(id) on delete cascade not null,
  tiler_id            uuid references tiler_profiles(id) on delete cascade not null,
  
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
create table if not exists project_messages (
  id                  text primary key,
  project_id          text references project_inquiries(id) on delete cascade not null,
  conversation_id     text not null,
  sender_type         text check (sender_type in ('client', 'tiler')) not null,
  sender_name         text not null,
  message             text not null,
  created_at          timestamptz default now()
);

-- 7. INDEKSID JÕUDLUSEKS
create index if not exists idx_tiler_profiles_city on tiler_profiles(city);
create index if not exists idx_gallery_items_tiler_id on gallery_items(tiler_id);
create index if not exists idx_project_inquiries_status on project_inquiries(status);
create index if not exists idx_contractor_quotes_project on contractor_quotes(project_id);
create index if not exists idx_project_messages_project on project_messages(project_id);

-- 8. ROW LEVEL SECURITY (RLS)
alter table tiler_profiles    enable row level security;
alter table gallery_items     enable row level security;
alter table project_inquiries enable row level security;
alter table contractor_quotes enable row level security;
alter table project_messages  enable row level security;

-- Avalik lugemine (kõik saavad vaadata meistreid, galeriisid ja avatud päringuid)
create policy "public_read_tiler_profiles"    on tiler_profiles    for select using (true);
create policy "public_read_gallery_items"     on gallery_items     for select using (true);
create policy "public_read_project_inquiries" on project_inquiries for select using (true);
create policy "public_read_contractor_quotes" on contractor_quotes for select using (true);
create policy "public_read_project_messages"  on project_messages  for select using (true);

-- Lisamise ja muutmise reeglid
create policy "public_insert_project_inquiries" on project_inquiries for insert with check (true);
create policy "public_insert_contractor_quotes" on contractor_quotes for insert with check (true);
create policy "public_insert_project_messages"  on project_messages  for insert with check (true);
create policy "public_insert_gallery_items"     on gallery_items     for insert with check (true);
create policy "public_update_tiler_profiles"    on tiler_profiles    for update using (true);
