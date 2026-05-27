-- =============================================================================
-- TechCare IT Services — Supabase schema, RLS, indexes, seed data
-- Run this file in Supabase Dashboard → SQL Editor (New query → Run)
-- =============================================================================

-- Extensions
create extension if not exists "pgcrypto";

-- -----------------------------------------------------------------------------
-- Helper: updated_at trigger
-- -----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- -----------------------------------------------------------------------------
-- Helper: admin check (used by RLS policies)
-- Returns true when the authenticated user exists in admin_profiles.
-- -----------------------------------------------------------------------------

-- =============================================================================
-- TABLES
-- =============================================================================

-- Admin profiles (links Supabase Auth users to admin role)
create table if not exists public.admin_profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text,
  role text not null default 'admin'
    check (role in ('admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
drop trigger if exists admin_profiles_set_updated_at on public.admin_profiles;
create trigger admin_profiles_set_updated_at
  before update on public.admin_profiles
  for each row execute function public.set_updated_at();

comment on table public.admin_profiles is
  'Maps auth.users to admin role. Insert a row after creating the first admin in Authentication.';
-- -----------------------------------------------------------------------------
-- Helper: admin check (used by RLS policies)
-- Returns true when the authenticated user exists in admin_profiles.
-- -----------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

-- Services catalog (public read)
create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  price_min integer,
  price_max integer,
  duration text,
  category text,
  icon text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
drop trigger if exists services_set_updated_at on public.services;
create trigger services_set_updated_at
  before update on public.services
  for each row execute function public.set_updated_at();

-- Customers (admin-managed)
create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null,
  email text,
  address text,
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
drop trigger if exists customers_set_updated_at on public.customers;
create trigger customers_set_updated_at
  before update on public.customers
  for each row execute function public.set_updated_at();

-- Appointments (public insert, admin manage)
create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null,
  email text,
  service_id uuid references public.services (id) on delete set null,
  appointment_date date not null,
  appointment_time text not null,
  address text,
  budget_range text,
  message text,
  status text not null default 'pending'
    check (status in ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled')),
  estimated_price integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
drop trigger if exists appointments_set_updated_at on public.appointments;
create trigger appointments_set_updated_at
  before update on public.appointments
  for each row execute function public.set_updated_at();

-- Contact / lead form submissions (public insert, admin read)
create table if not exists public.contact_leads (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null,
  email text,
  content text not null,
  type text not null default 'contact'
    check (type in ('contact', 'lead')),
  source text,
  status text not null default 'new'
    check (status in ('new', 'contacted', 'converted', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
drop trigger if exists contact_leads_set_updated_at on public.contact_leads;
create trigger contact_leads_set_updated_at
  before update on public.contact_leads
  for each row execute function public.set_updated_at();

-- Chatbot sessions (public insert via API, admin read)
create table if not exists public.chat_sessions (
  id uuid primary key default gen_random_uuid(),
  session_id text not null unique,
  customer_name text,
  customer_phone text,
  interested_service text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
drop trigger if exists chat_sessions_set_updated_at on public.chat_sessions;
create trigger chat_sessions_set_updated_at
  before update on public.chat_sessions
  for each row execute function public.set_updated_at();

-- Chatbot messages (public insert via API, admin read)
create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  session_id text not null,
  role text not null
    check (role in ('user', 'assistant', 'system')),
  content text not null,
  created_at timestamptz not null default now()
);

-- =============================================================================
-- INDEXES (dashboard / common queries)
-- =============================================================================

create index if not exists idx_services_active_slug
  on public.services (is_active, slug);

create index if not exists idx_appointments_status_created
  on public.appointments (status, created_at desc);

create index if not exists idx_appointments_phone
  on public.appointments (phone);

create index if not exists idx_appointments_service_id
  on public.appointments (service_id);

create index if not exists idx_contact_leads_type_status_created
  on public.contact_leads (type, status, created_at desc);

create index if not exists idx_contact_leads_phone
  on public.contact_leads (phone);

create index if not exists idx_customers_phone
  on public.customers (phone);

create index if not exists idx_chat_sessions_created
  on public.chat_sessions (created_at desc);

create index if not exists idx_chat_messages_session_created
  on public.chat_messages (session_id, created_at);

-- =============================================================================
-- ROW LEVEL SECURITY
-- =============================================================================

alter table public.admin_profiles enable row level security;
alter table public.services enable row level security;
alter table public.customers enable row level security;
alter table public.appointments enable row level security;
alter table public.contact_leads enable row level security;
alter table public.chat_sessions enable row level security;
alter table public.chat_messages enable row level security;

-- admin_profiles: admins can read their own row; service role manages inserts
drop policy if exists "Admins read own profile" on public.admin_profiles;
create policy "Admins read own profile"
  on public.admin_profiles for select
  to authenticated
  using (id = auth.uid() or public.is_admin());

-- services: anyone can read active services (website catalog)
drop policy if exists "Public read active services" on public.services;
create policy "Public read active services"
  on public.services for select
  to anon, authenticated
  using (is_active = true);

-- services: admins full access (manage catalog) — one policy per action
drop policy if exists "Admins manage services" on public.services;
drop policy if exists "Admins select services" on public.services;
drop policy if exists "Admins insert services" on public.services;
drop policy if exists "Admins update services" on public.services;
drop policy if exists "Admins delete services" on public.services;

create policy "Admins select services"
  on public.services for select
  to authenticated
  using (public.is_admin());

create policy "Admins insert services"
  on public.services for insert
  to authenticated
  with check (public.is_admin());

create policy "Admins update services"
  on public.services for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins delete services"
  on public.services for delete
  to authenticated
  using (public.is_admin());

-- customers: admin only (no public access) — one policy per action
drop policy if exists "Admins manage customers" on public.customers;
drop policy if exists "Admins select customers" on public.customers;
drop policy if exists "Admins insert customers" on public.customers;
drop policy if exists "Admins update customers" on public.customers;
drop policy if exists "Admins delete customers" on public.customers;

create policy "Admins select customers"
  on public.customers for select
  to authenticated
  using (public.is_admin());

create policy "Admins insert customers"
  on public.customers for insert
  to authenticated
  with check (public.is_admin());

create policy "Admins update customers"
  on public.customers for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins delete customers"
  on public.customers for delete
  to authenticated
  using (public.is_admin());

-- appointments: public can create booking requests (website form)
drop policy if exists "Public insert appointments" on public.appointments;
create policy "Public insert appointments"
  on public.appointments for insert
  to anon, authenticated
  with check (true);

-- appointments: admins read/update/delete for dashboard — one policy per action
drop policy if exists "Admins manage appointments" on public.appointments;
drop policy if exists "Admins select appointments" on public.appointments;
drop policy if exists "Admins update appointments" on public.appointments;
drop policy if exists "Admins delete appointments" on public.appointments;

create policy "Admins select appointments"
  on public.appointments for select
  to authenticated
  using (public.is_admin());

create policy "Admins update appointments"
  on public.appointments for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins delete appointments"
  on public.appointments for delete
  to authenticated
  using (public.is_admin());

-- contact_leads: public can submit contact/lead forms
drop policy if exists "Public insert contact_leads" on public.contact_leads;
create policy "Public insert contact_leads"
  on public.contact_leads for insert
  to anon, authenticated
  with check (true);

-- contact_leads: admins read/update/delete for dashboard — one policy per action
drop policy if exists "Admins manage contact_leads" on public.contact_leads;
drop policy if exists "Admins select contact_leads" on public.contact_leads;
drop policy if exists "Admins update contact_leads" on public.contact_leads;
drop policy if exists "Admins delete contact_leads" on public.contact_leads;

create policy "Admins select contact_leads"
  on public.contact_leads for select
  to authenticated
  using (public.is_admin());

create policy "Admins update contact_leads"
  on public.contact_leads for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins delete contact_leads"
  on public.contact_leads for delete
  to authenticated
  using (public.is_admin());

-- chat_sessions: public insert (chatbot widget)
drop policy if exists "Public insert chat_sessions" on public.chat_sessions;
create policy "Public insert chat_sessions"
  on public.chat_sessions for insert
  to anon, authenticated
  with check (true);

-- chat_sessions: public update own session metadata (phone extraction)
drop policy if exists "Public update chat_sessions" on public.chat_sessions;
create policy "Public update chat_sessions"
  on public.chat_sessions for update
  to anon, authenticated
  using (true)
  with check (true);

-- chat_sessions: admins read all sessions
drop policy if exists "Admins read chat_sessions" on public.chat_sessions;
create policy "Admins read chat_sessions"
  on public.chat_sessions for select
  to authenticated
  using (public.is_admin());

-- chat_messages: public insert (chatbot)
drop policy if exists "Public insert chat_messages" on public.chat_messages;
create policy "Public insert chat_messages"
  on public.chat_messages for insert
  to anon, authenticated
  with check (true);

-- chat_messages: admins read history
drop policy if exists "Admins read chat_messages" on public.chat_messages;
create policy "Admins read chat_messages"
  on public.chat_messages for select
  to authenticated
  using (public.is_admin());

-- =============================================================================
-- SEED DATA — services (stable UUIDs for references)
-- =============================================================================

insert into public.services (
  id, name, slug, description, price_min, price_max, duration, category, icon, is_active
) values
  (
    'a0000001-0001-4001-8001-000000000001',
    'Cài Windows & phần mềm',
    'cai-windows',
    'Cài đặt Windows 10/11, driver, Office và phần mềm cơ bản.',
    150000, 300000, '1 - 2 giờ', 'computer', 'Monitor', true
  ),
  (
    'a0000001-0001-4001-8001-000000000002',
    'Sửa lỗi máy tính & Laptop',
    'sua-may-tinh',
    'Kiểm tra lỗi máy chậm, phần mềm, mạng, máy in, virus.',
    100000, 500000, '1 - 3 giờ', 'computer', 'Wrench', true
  ),
  (
    'a0000001-0001-4001-8001-000000000003',
    'Lắp đặt camera giám sát',
    'lap-camera',
    'Tư vấn, lắp đặt camera Wi-Fi hoặc IP, xem qua điện thoại.',
    900000, 5900000, '1 buổi - 1 ngày', 'camera', 'Camera', true
  ),
  (
    'a0000001-0001-4001-8001-000000000004',
    'Setup Wi-Fi & Hệ thống mạng',
    'setup-mang',
    'Cấu hình router, Wi-Fi Mesh, switch, máy in mạng.',
    150000, 800000, '1 - 3 giờ', 'network', 'Wifi', true
  ),
  (
    'a0000001-0001-4001-8001-000000000005',
    'Thiết kế website doanh nghiệp',
    'thiet-ke-website',
    'Landing page, website giới thiệu chuẩn SEO.',
    2200000, 10000000, '3 - 14 ngày', 'website', 'Globe', true
  ),
  (
    'a0000001-0001-4001-8001-000000000006',
    'Tư vấn Cloud VPS, Domain, Cloudflare',
    'tu-van-vps-domain',
    'Domain, Cloudflare, SSL, triển khai VPS.',
    200000, 1000000, '1 - 2 giờ', 'cloud', 'Cloud', true
  ),
  (
    'a0000001-0001-4001-8001-000000000007',
    'Bảo trì IT định kỳ doanh nghiệp',
    'bao-tri-it',
    'Bảo trì máy tính, mạng nội bộ định kỳ cho văn phòng/cửa hàng.',
    500000, 5000000, 'Định kỳ hàng tháng', 'maintenance', 'Shield', true
  )
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  price_min = excluded.price_min,
  price_max = excluded.price_max,
  duration = excluded.duration,
  category = excluded.category,
  icon = excluded.icon,
  is_active = excluded.is_active,
  updated_at = now();

-- Sample customers (admin dashboard demo)
insert into public.customers (id, full_name, phone, email, address, note)
values
  (
    'b0000001-0001-4001-8001-000000000001',
    'Nguyễn Văn An',
    '0909123456',
    'vanan.nguyen@gmail.com',
    '123 Nguyễn Huệ, Quận 1, TP.HCM',
    'Khách thường xuyên — cài Windows'
  ),
  (
    'b0000001-0001-4001-8001-000000000002',
    'Trần Thị Bình',
    '0918765432',
    'binh.tran@yahoo.com',
    '456 Lê Lợi, Gò Vấp, TP.HCM',
    'Cửa hàng — lắp camera'
  )
on conflict (id) do nothing;

-- Sample appointments (admin dashboard demo)
insert into public.appointments (
  id, full_name, phone, email, service_id, appointment_date, appointment_time,
  address, budget_range, message, status, estimated_price
)
values
  (
    'c0000001-0001-4001-8001-000000000001',
    'Nguyễn Văn An',
    '0909123456',
    'vanan.nguyen@gmail.com',
    'a0000001-0001-4001-8001-000000000001',
    '2026-06-01',
    '09:00',
    'Quận 1, TP.HCM',
    '200.000đ - 300.000đ',
    'Máy chậm, cần cài Windows 11 + Office.',
    'pending',
    250000
  ),
  (
    'c0000001-0001-4001-8001-000000000002',
    'Trần Thị Bình',
    '0918765432',
    'binh.tran@yahoo.com',
    'a0000001-0001-4001-8001-000000000003',
    '2026-06-02',
    '14:00',
    'Gò Vấp, TP.HCM',
    '3.200.000đ - 5.900.000đ',
    'Lắp 3 camera Wi-Fi cho cửa hàng.',
    'confirmed',
    3500000
  )
on conflict (id) do nothing;

-- Sample contact leads
insert into public.contact_leads (id, full_name, phone, email, content, type, source, status)
values
  (
    'd0000001-0001-4001-8001-000000000001',
    'Hoàng Văn Đức',
    '0933556677',
    'duc.hoang@gmail.com',
    'Laptop màn hình xanh, cần tư vấn cài lại Windows.',
    'contact',
    'website',
    'new'
  ),
  (
    'd0000001-0001-4001-8001-000000000002',
    'Lê Thị Mai',
    '0977889900',
    null,
    'Báo giá lắp 4 camera Wi-Fi cho cửa hàng tạp hóa.',
    'lead',
    'homepage',
    'contacted'
  )
on conflict (id) do nothing;

-- Sample chatbot session + messages
insert into public.chat_sessions (id, session_id, customer_name, customer_phone, interested_service)
values
  (
    'e0000001-0001-4001-8001-000000000001',
    'test-session-001',
    'Nguyễn Văn An',
    '0909123456',
    'Cài Windows'
  )
on conflict (session_id) do nothing;

insert into public.chat_messages (session_id, role, content)
select v.session_id, v.role, v.content
from (
  values
    ('test-session-001', 'user', 'Tôi muốn cài Windows'),
    (
      'test-session-001',
      'assistant',
      'Dịch vụ cài Windows tận nhà khoảng 150.000đ - 300.000đ. Bạn dùng PC hay Laptop ạ?'
    )
) as v(session_id, role, content)
where not exists (
  select 1 from public.chat_messages m
  where m.session_id = v.session_id and m.role = v.role and m.content = v.content
);

-- =============================================================================
-- FIRST ADMIN SETUP (manual — run AFTER creating user in Authentication)
-- =============================================================================
-- 1. Supabase Dashboard → Authentication → Users → Add user (email + password)
-- 2. Copy the user's UUID, then run (replace placeholders):
--
-- insert into public.admin_profiles (id, email, full_name, role)
-- values (
--   '<AUTH_USER_UUID>',
--   'admin@techcare.vn',
--   'Quản trị viên TechCare',
--   'admin'
-- );
-- =============================================================================
