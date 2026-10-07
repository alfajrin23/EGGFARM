-- Attach screenshots to sales, stock snapshots and cash transactions.
-- Run once in Supabase SQL Editor after schema.sql and the report screenshot setup.
-- Safe to rerun. Existing data is not modified.

create table if not exists public.record_attachments (
  id uuid primary key default gen_random_uuid(),
  entity_table text not null check (entity_table in ('sales','stock_snapshots','cash_transactions')),
  entity_id uuid not null,
  farm_id uuid not null references public.farms(id) on delete restrict,
  attachment_kind text not null default 'screenshot' check (attachment_kind in ('nota','transfer','screenshot')),
  storage_path text not null unique,
  filename text not null,
  content_type text not null,
  size_bytes bigint not null check (size_bytes > 0 and size_bytes <= 10485760),
  uploaded_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists record_attachments_entity_idx
  on public.record_attachments(entity_table,entity_id,created_at desc);

alter table public.record_attachments enable row level security;

drop policy if exists "members can view record attachments" on public.record_attachments;
create policy "members can view record attachments" on public.record_attachments
  for select to authenticated
  using (public.is_farm_admin() or public.is_farm_member(farm_id));

drop policy if exists "members can add record attachments" on public.record_attachments;
create policy "members can add record attachments" on public.record_attachments
  for insert to authenticated
  with check (
    uploaded_by=auth.uid()
    and (public.is_farm_admin() or public.is_farm_member(farm_id))
    and (
      (entity_table='sales' and exists (
        select 1 from public.sales s where s.id=record_attachments.entity_id and s.farm_id=record_attachments.farm_id
      ))
      or (entity_table='stock_snapshots' and exists (
        select 1 from public.stock_snapshots s where s.id=record_attachments.entity_id and s.farm_id=record_attachments.farm_id
      ))
      or (entity_table='cash_transactions' and exists (
        select 1 from public.cash_transactions c
        where c.id=record_attachments.entity_id and (
          c.farm_id=record_attachments.farm_id
          or (c.farm_id is null and public.can_manage_group_cash() and record_attachments.farm_id=(select id from public.farms where code='CKL'))
        )
      ))
    )
  );

drop policy if exists "admins can remove record attachments" on public.record_attachments;
create policy "admins can remove record attachments" on public.record_attachments
  for delete to authenticated
  using (public.is_farm_admin() or public.has_farm_role(farm_id,array['admin_farm','manajer','admin_sistem']));
