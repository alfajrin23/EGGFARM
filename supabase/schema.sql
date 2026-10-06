-- Ruang Farm MVP schema (Postgres / Supabase)
-- Run in Supabase SQL Editor. Client-side code must use anon/publishable key only.
create extension if not exists pgcrypto;

create table if not exists public.farms (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  region text not null default '',
  timezone text not null default 'Asia/Jakarta',
  status text not null default 'Pembangunan' check (status in ('Pembangunan','Persiapan','Beroperasi','Jeda','Ditutup')),
  start_date date,
  responsible text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.farm_members (
  farm_id uuid not null references public.farms(id) on delete restrict,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('petugas','admin_farm','manajer','admin_sistem')),
  created_at timestamptz not null default now(),
  primary key (farm_id,user_id),
  constraint farm_members_profile_user_id_fkey foreign key (user_id) references public.profiles(user_id) on delete cascade
);

insert into public.profiles (user_id,email,full_name)
select id,coalesce(email,''),coalesce(raw_user_meta_data->>'full_name','') from auth.users
on conflict (user_id) do nothing;

do $$ begin
  if not exists (select 1 from pg_constraint where conname='farm_members_profile_user_id_fkey' and conrelid='public.farm_members'::regclass) then
    alter table public.farm_members add constraint farm_members_profile_user_id_fkey foreign key (user_id) references public.profiles(user_id) on delete cascade;
  end if;
end $$;

create table if not exists public.daily_reports (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid not null references public.farms(id) on delete restrict,
  house_id uuid,
  flock_id uuid,
  date date not null,
  eggs numeric(14,2),
  kg numeric(14,3),
  su numeric(14,3),
  jb numeric(14,3),
  tc numeric(14,3),
  sst numeric(14,3),
  birds integer,
  feed numeric(14,3),
  hd_reported numeric(8,3) check (hd_reported is null or (hd_reported >= 0 and hd_reported <= 100)),
  fi_reported numeric(10,3) check (fi_reported is null or fi_reported >= 0),
  ew_reported numeric(8,3) check (ew_reported is null or ew_reported >= 0),
  fcr_reported numeric(10,4) check (fcr_reported is null or fcr_reported >= 0),
  hh_reported text,
  note text not null default '',
  status text not null default 'dikirim' check (status in ('draf','dikirim','disetujui','dikoreksi')),
  version integer not null default 1,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (eggs is null or eggs >= 0),
  check (kg is null or kg >= 0),
  check (birds is null or birds >= 0),
  unique (farm_id,date,house_id,flock_id)
);

create table if not exists public.daily_report_attachments (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references public.daily_reports(id) on delete cascade,
  farm_id uuid not null references public.farms(id) on delete cascade,
  storage_path text not null unique,
  filename text not null,
  content_type text not null check (content_type like 'image/%'),
  size_bytes bigint not null check (size_bytes > 0 and size_bytes <= 10485760),
  uploaded_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values ('report-screenshots','report-screenshots',false,10485760,array['image/jpeg','image/png','image/webp','image/gif'])
on conflict (id) do update set public=false,file_size_limit=10485760,allowed_mime_types=excluded.allowed_mime_types;

create table if not exists public.sales (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid not null references public.farms(id) on delete restrict,
  date date not null,
  customer text,
  category text not null,
  quantity numeric(14,3) not null check (quantity >= 0),
  unit text not null check (unit in ('kg','butir','peti')),
  amount numeric(16,2) not null default 0 check (amount >= 0),
  payment_method text not null default 'Belum dicatat' check (payment_method in ('Tunai','Transfer bank','E-wallet','Belum dicatat')),
  status text not null default 'Dibayar' check (status in ('Dibayar','Direncanakan','Perlu verifikasi','Dibatalkan')),
  note text not null default '',
  reverses_sale_id uuid references public.sales(id) on delete restrict,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.sales add column if not exists stock_category text;
alter table public.sales add column if not exists normalized_quantity numeric(14,3);
alter table public.sales add column if not exists normalized_unit text;

create table if not exists public.farm_stock_rules (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid not null references public.farms(id) on delete cascade,
  sale_category text not null check (length(trim(sale_category)) > 0),
  stock_category text check (stock_category is null or stock_category in ('PT','SU','JB','TC','TU','LAINNYA')),
  kg_per_peti numeric(14,3) check (kg_per_peti is null or kg_per_peti > 0),
  conversion_confirmed boolean not null default false,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (farm_id, sale_category)
);

create table if not exists public.stock_snapshots (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid not null references public.farms(id) on delete restrict,
  snapshot_date date not null,
  category text not null check (category in ('PT','TU','TC','JB','SU','LAINNYA')),
  quantity numeric(14,3) not null check (quantity >= 0),
  unit text not null check (unit in ('peti','kg','butir')),
  note text not null default '',
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (farm_id,snapshot_date,category,unit)
);

create table if not exists public.cash_transactions (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  amount numeric(16,2) not null check (amount >= 0),
  recipient text not null,
  purpose text not null,
  category text not null,
  method text not null check (method in ('Transfer bank','E-wallet','Tunai','Pindah dana internal')),
  status text not null check (status in ('Dibayar','Direncanakan','Perlu verifikasi','Dibatalkan')),
  scope text not null check (scope in ('Grup Cikalong','Lokasi produksi','Proyek pembangunan','Umum/Grup lain','Pindah dana internal')),
  farm_id uuid references public.farms(id) on delete restrict,
  scope_name text not null default '',
  reference text not null default '',
  note text not null default '',
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.dictionary_terms (
  id uuid primary key default gen_random_uuid(),
  term text not null,
  common text not null,
  definition text not null,
  unit text not null,
  rule text not null default '',
  farm_id uuid references public.farms(id) on delete restrict,
  effective_from date,
  confirmed_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.audit_events (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid references public.farms(id) on delete restrict,
  entity_table text not null,
  entity_id uuid not null,
  action text not null,
  before_data jsonb,
  after_data jsonb,
  reason text,
  actor_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create or replace function public.capture_audit_event()
returns trigger language plpgsql security definer set search_path = public
as $$
declare
  new_row jsonb;
  old_row jsonb;
  target_id uuid;
  target_farm uuid;
begin
  if TG_OP <> 'DELETE' then new_row := to_jsonb(NEW); end if;
  if TG_OP <> 'INSERT' then old_row := to_jsonb(OLD); end if;
  target_id := coalesce((new_row->>'id')::uuid,(old_row->>'id')::uuid);
  target_farm := coalesce((new_row->>'farm_id')::uuid,(old_row->>'farm_id')::uuid);
  if TG_TABLE_NAME = 'farms' then target_farm := target_id; end if;
  insert into public.audit_events(farm_id,entity_table,entity_id,action,before_data,after_data,actor_id)
  values(target_farm,TG_TABLE_NAME,target_id,lower(TG_OP),old_row,new_row,auth.uid());
  if TG_OP = 'DELETE' then return OLD; end if;
  return NEW;
end $$;

drop trigger if exists audit_farms_changes on public.farms;
create trigger audit_farms_changes after insert or update or delete on public.farms for each row execute function public.capture_audit_event();
drop trigger if exists audit_daily_report_changes on public.daily_reports;
create trigger audit_daily_report_changes after insert or update or delete on public.daily_reports for each row execute function public.capture_audit_event();
drop trigger if exists audit_sales_changes on public.sales;
create trigger audit_sales_changes after insert or update or delete on public.sales for each row execute function public.capture_audit_event();
drop trigger if exists audit_stock_snapshot_changes on public.stock_snapshots;
create trigger audit_stock_snapshot_changes after insert or update or delete on public.stock_snapshots for each row execute function public.capture_audit_event();
drop trigger if exists audit_cash_changes on public.cash_transactions;
create trigger audit_cash_changes after insert or update or delete on public.cash_transactions for each row execute function public.capture_audit_event();
drop trigger if exists audit_terms_changes on public.dictionary_terms;
create trigger audit_terms_changes after insert or update or delete on public.dictionary_terms for each row execute function public.capture_audit_event();
drop trigger if exists audit_farm_stock_rules_changes on public.farm_stock_rules;
create trigger audit_farm_stock_rules_changes after insert or update or delete on public.farm_stock_rules for each row execute function public.capture_audit_event();

insert into public.farms (code,name,region,timezone,status,start_date,responsible)
values
  ('CKL','Cikalong','Cianjur, Jawa Barat','Asia/Jakarta','Beroperasi',null,'Admin Farm'),
  ('SKN','Sukanagara','Cianjur, Jawa Barat','Asia/Jakarta','Pembangunan',null,'Admin Farm')
on conflict (code) do nothing;

insert into public.farm_stock_rules(farm_id,sale_category,stock_category,kg_per_peti,conversion_confirmed)
select f.id,v.sale_category,v.stock_category,case when f.code='CKL' then 15::numeric else null end,false
from public.farms f
cross join (values ('PT','PT'),('SU','SU'),('JB','JB'),('TC','TC'),('Telur Jumbo','JB'),('Telur bagus','SU'),('Telur ecer','SU'),('Telur retak','TC'),('Telur 15 kg','PT'),('Telur 15 kg x 18 krat','PT')) as v(sale_category,stock_category)
where f.code='CKL' or v.sale_category in ('PT','SU','JB','TC')
on conflict (farm_id,sale_category) do nothing;

create index if not exists daily_reports_farm_date_idx on public.daily_reports(farm_id,date desc);
create index if not exists sales_farm_date_idx on public.sales(farm_id,date desc);
create index if not exists stock_snapshots_farm_date_idx on public.stock_snapshots(farm_id,snapshot_date desc);
create index if not exists cash_scope_date_idx on public.cash_transactions(scope,farm_id,date desc);
create index if not exists farm_stock_rules_farm_idx on public.farm_stock_rules(farm_id);
create index if not exists sales_stock_category_date_idx on public.sales(farm_id,stock_category,date desc);

create or replace function public.is_farm_member(target_farm uuid)
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.farm_members m where m.farm_id=target_farm and m.user_id=auth.uid()) $$;

create or replace function public.has_farm_role(target_farm uuid, allowed_roles text[])
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.farm_members m where m.farm_id=target_farm and m.user_id=auth.uid() and m.role=any(allowed_roles)) $$;

create or replace function public.is_system_admin()
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.farm_members m where m.user_id=auth.uid() and m.role='admin_sistem') $$;

-- Admin farm/manajer/admin sistem may inspect data across locations. Staff
-- remain scoped to farms explicitly listed in farm_members.
create or replace function public.is_farm_admin()
returns boolean language sql stable security definer set search_path = public
as $$ select exists (
  select 1 from public.farm_members m
  where m.user_id=auth.uid()
    and m.role=any(array['admin_farm','manajer','admin_sistem'])
) $$;

create or replace function public.is_group_member()
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.farm_members m join public.farms f on f.id=m.farm_id where f.code='CKL' and m.user_id=auth.uid()) $$;

create or replace function public.can_manage_group_cash()
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.farm_members m join public.farms f on f.id=m.farm_id where f.code='CKL' and m.user_id=auth.uid() and m.role=any(array['admin_farm','manajer','admin_sistem'])) $$;

alter table public.farms enable row level security;
alter table public.farm_members enable row level security;
alter table public.profiles enable row level security;
alter table public.daily_reports enable row level security;
alter table public.sales enable row level security;
alter table public.stock_snapshots enable row level security;
alter table public.cash_transactions enable row level security;
alter table public.dictionary_terms enable row level security;
alter table public.audit_events enable row level security;
alter table public.farm_stock_rules enable row level security;
alter table public.daily_report_attachments enable row level security;

drop policy if exists "members can view farms" on public.farms;
create policy "members can view farms" on public.farms for select to authenticated using (public.is_farm_member(id) or public.is_farm_admin());
drop policy if exists "managers can update farms" on public.farms;
create policy "managers can update farms" on public.farms for update to authenticated using (public.has_farm_role(id,array['manajer','admin_sistem'])) with check (public.has_farm_role(id,array['manajer','admin_sistem']));
drop policy if exists "system admins can create farms" on public.farms;
create policy "system admins can create farms" on public.farms for insert to authenticated with check (public.is_system_admin());

drop policy if exists "members can view memberships" on public.farm_members;
create policy "members can view memberships" on public.farm_members for select to authenticated using (user_id=auth.uid() or public.is_farm_admin() or public.has_farm_role(farm_id,array['admin_farm','manajer','admin_sistem']));
drop policy if exists "managers can manage memberships" on public.farm_members;
create policy "managers can manage memberships" on public.farm_members for all to authenticated using (public.has_farm_role(farm_id,array['manajer','admin_sistem']) or public.is_system_admin()) with check (public.has_farm_role(farm_id,array['manajer','admin_sistem']) or public.is_system_admin());

drop policy if exists "users can view own profile" on public.profiles;
create policy "users can view own profile" on public.profiles for select to authenticated using (user_id=auth.uid());
drop policy if exists "farm admins can view staff profiles" on public.profiles;
create policy "farm admins can view staff profiles" on public.profiles for select to authenticated using (
  (public.is_farm_admin() and exists (select 1 from public.farm_members m where m.user_id=profiles.user_id))
  or exists (select 1 from public.farm_members m where m.user_id=profiles.user_id and public.has_farm_role(m.farm_id,array['admin_farm','manajer','admin_sistem']))
);

drop policy if exists "members can view stock snapshots" on public.stock_snapshots;
create policy "members can view stock snapshots" on public.stock_snapshots for select to authenticated using (public.is_farm_member(farm_id) or public.is_farm_admin());
drop policy if exists "members can record stock snapshots" on public.stock_snapshots;
create policy "members can record stock snapshots" on public.stock_snapshots for insert to authenticated with check (public.is_farm_member(farm_id) and created_by=auth.uid());
drop policy if exists "admins can update stock snapshots" on public.stock_snapshots;
drop policy if exists "members can update stock snapshots" on public.stock_snapshots;
create policy "members can update stock snapshots" on public.stock_snapshots for update to authenticated using (public.is_farm_member(farm_id)) with check (public.is_farm_member(farm_id));

drop policy if exists "farm members can view reports" on public.daily_reports;
create policy "farm members can view reports" on public.daily_reports for select to authenticated using (public.is_farm_member(farm_id) or public.is_farm_admin());
drop policy if exists "farm members can create reports" on public.daily_reports;
create policy "farm members can create reports" on public.daily_reports for insert to authenticated with check (public.is_farm_member(farm_id) and created_by=auth.uid());
drop policy if exists "admins can update reports" on public.daily_reports;
create policy "admins can update reports" on public.daily_reports for update to authenticated using (public.has_farm_role(farm_id,array['admin_farm','manajer','admin_sistem'])) with check (public.has_farm_role(farm_id,array['admin_farm','manajer','admin_sistem']));
drop policy if exists "admins can delete reports" on public.daily_reports;
create policy "admins can delete reports" on public.daily_reports for delete to authenticated using (public.has_farm_role(farm_id,array['admin_farm','manajer','admin_sistem']));

drop policy if exists "members can view report attachments" on public.daily_report_attachments;
create policy "members can view report attachments" on public.daily_report_attachments for select to authenticated
using (public.is_farm_member(farm_id) or public.is_farm_admin());
drop policy if exists "members can add report attachments" on public.daily_report_attachments;
create policy "members can add report attachments" on public.daily_report_attachments for insert to authenticated
with check (uploaded_by=auth.uid() and (public.is_farm_member(daily_report_attachments.farm_id) or public.is_farm_admin()) and exists (select 1 from public.daily_reports r where r.id=daily_report_attachments.report_id and r.farm_id=daily_report_attachments.farm_id));
drop policy if exists "admins can remove report attachments" on public.daily_report_attachments;
create policy "admins can remove report attachments" on public.daily_report_attachments for delete to authenticated
using (public.has_farm_role(farm_id,array['admin_farm','manajer','admin_sistem']) or public.is_farm_admin());

drop policy if exists "members can read report screenshot files" on storage.objects;
create policy "members can read report screenshot files" on storage.objects for select to authenticated
using (bucket_id='report-screenshots' and (public.is_farm_admin() or public.is_farm_member(((storage.foldername(name))[1])::uuid)));
drop policy if exists "members can upload report screenshot files" on storage.objects;
create policy "members can upload report screenshot files" on storage.objects for insert to authenticated
with check (bucket_id='report-screenshots' and (public.is_farm_admin() or public.is_farm_member(((storage.foldername(name))[1])::uuid)));
drop policy if exists "owners or admins can remove report screenshot files" on storage.objects;
create policy "owners or admins can remove report screenshot files" on storage.objects for delete to authenticated
using (bucket_id='report-screenshots' and (public.is_farm_admin() or (owner_id=auth.uid()::text and public.is_farm_member(((storage.foldername(name))[1])::uuid))));

drop policy if exists "farm members can view sales" on public.sales;
create policy "farm members can view sales" on public.sales for select to authenticated using (public.is_farm_member(farm_id) or public.is_farm_admin());
drop policy if exists "admins can manage sales" on public.sales;
create policy "admins can manage sales" on public.sales for all to authenticated using (public.is_farm_admin() or public.has_farm_role(farm_id,array['admin_farm','manajer','admin_sistem'])) with check (public.is_farm_admin() or public.has_farm_role(farm_id,array['admin_farm','manajer','admin_sistem']));

drop policy if exists "members can view farm stock rules" on public.farm_stock_rules;
create policy "members can view farm stock rules" on public.farm_stock_rules for select to authenticated using (public.is_farm_member(farm_id));
drop policy if exists "admins can manage farm stock rules" on public.farm_stock_rules;
create policy "admins can manage farm stock rules" on public.farm_stock_rules for all to authenticated using (public.has_farm_role(farm_id,array['admin_farm','manajer','admin_sistem'])) with check (public.has_farm_role(farm_id,array['admin_farm','manajer','admin_sistem']));

drop policy if exists "members can view cash transactions" on public.cash_transactions;
create policy "members can view cash transactions" on public.cash_transactions for select to authenticated using ((farm_id is null and (public.is_group_member() or public.is_farm_admin())) or public.is_farm_member(farm_id) or public.is_farm_admin());
drop policy if exists "admins can manage cash transactions" on public.cash_transactions;
create policy "admins can manage cash transactions" on public.cash_transactions for all to authenticated using ((farm_id is null and public.can_manage_group_cash()) or public.has_farm_role(farm_id,array['admin_farm','manajer','admin_sistem'])) with check ((farm_id is null and public.can_manage_group_cash()) or public.has_farm_role(farm_id,array['admin_farm','manajer','admin_sistem']));

drop policy if exists "members can view terms" on public.dictionary_terms;
create policy "members can view terms" on public.dictionary_terms for select to authenticated using (farm_id is null or public.is_farm_member(farm_id) or public.is_farm_admin());
drop policy if exists "admins can manage terms" on public.dictionary_terms;
create policy "admins can manage terms" on public.dictionary_terms for all to authenticated using ((farm_id is null and public.is_system_admin()) or public.has_farm_role(farm_id,array['admin_farm','manajer','admin_sistem'])) with check ((farm_id is null and public.is_system_admin()) or public.has_farm_role(farm_id,array['admin_farm','manajer','admin_sistem']));

drop policy if exists "members can view audit" on public.audit_events;
create policy "members can view audit" on public.audit_events for select to authenticated using ((farm_id is null and (public.is_group_member() or public.is_farm_admin())) or public.is_farm_member(farm_id) or public.is_farm_admin());
drop policy if exists "authenticated users can write audit" on public.audit_events;
drop policy if exists "admins can write audit" on public.audit_events;
create policy "admins can write audit" on public.audit_events for insert to authenticated with check (actor_id=auth.uid() and ((farm_id is null and public.can_manage_group_cash()) or public.has_farm_role(farm_id,array['admin_farm','manajer','admin_sistem'])));

-- Bootstrap: create an auth user in Supabase Auth, then add membership rows using its UUID.
-- insert into public.farms (code,name,region,status) values ('CKL','Cikalong','Cianjur, Jawa Barat','Beroperasi');
-- insert into public.farm_members (farm_id,user_id,role) values ('<farm-uuid>','<auth-user-uuid>','admin_sistem');
