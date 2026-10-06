-- Reported production KPIs and private screenshot attachments.
-- Safe to rerun in an existing Supabase project.
alter table public.daily_reports
  add column if not exists hd_reported numeric(8,3),
  add column if not exists fi_reported numeric(10,3),
  add column if not exists ew_reported numeric(8,3),
  add column if not exists fcr_reported numeric(10,4),
  add column if not exists hh_reported text;

do $$ begin
  if not exists (select 1 from pg_constraint where conname='daily_reports_hd_reported_range_check' and conrelid='public.daily_reports'::regclass) then
    alter table public.daily_reports add constraint daily_reports_hd_reported_range_check check (hd_reported is null or (hd_reported >= 0 and hd_reported <= 100));
  end if;
  if not exists (select 1 from pg_constraint where conname='daily_reports_fi_reported_nonnegative_check' and conrelid='public.daily_reports'::regclass) then
    alter table public.daily_reports add constraint daily_reports_fi_reported_nonnegative_check check (fi_reported is null or fi_reported >= 0);
  end if;
  if not exists (select 1 from pg_constraint where conname='daily_reports_ew_reported_nonnegative_check' and conrelid='public.daily_reports'::regclass) then
    alter table public.daily_reports add constraint daily_reports_ew_reported_nonnegative_check check (ew_reported is null or ew_reported >= 0);
  end if;
  if not exists (select 1 from pg_constraint where conname='daily_reports_fcr_reported_nonnegative_check' and conrelid='public.daily_reports'::regclass) then
    alter table public.daily_reports add constraint daily_reports_fcr_reported_nonnegative_check check (fcr_reported is null or fcr_reported >= 0);
  end if;
end $$;

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

create or replace function public.is_farm_admin()
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.farm_members m where m.user_id=auth.uid() and m.role=any(array['admin_farm','manajer','admin_sistem'])) $$;

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values ('report-screenshots','report-screenshots',false,10485760,array['image/jpeg','image/png','image/webp','image/gif'])
on conflict (id) do update set public=false,file_size_limit=10485760,allowed_mime_types=excluded.allowed_mime_types;

alter table public.daily_report_attachments enable row level security;
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

drop trigger if exists audit_report_attachment_changes on public.daily_report_attachments;
create trigger audit_report_attachment_changes after insert or update or delete on public.daily_report_attachments
for each row execute function public.capture_audit_event();
