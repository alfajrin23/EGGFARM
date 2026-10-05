-- Link sale units/categories to stock balances per farm.
-- Run once in Supabase SQL Editor. Safe to rerun.
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

alter table public.sales add column if not exists stock_category text;
alter table public.sales add column if not exists normalized_quantity numeric(14,3);
alter table public.sales add column if not exists normalized_unit text;

create index if not exists farm_stock_rules_farm_idx on public.farm_stock_rules(farm_id);
create index if not exists sales_stock_category_date_idx on public.sales(farm_id,stock_category,date desc);

alter table public.farm_stock_rules enable row level security;
drop policy if exists "members can view farm stock rules" on public.farm_stock_rules;
create policy "members can view farm stock rules" on public.farm_stock_rules
  for select to authenticated using (public.is_farm_member(farm_id));
drop policy if exists "admins can manage farm stock rules" on public.farm_stock_rules;
create policy "admins can manage farm stock rules" on public.farm_stock_rules
  for all to authenticated
  using (public.has_farm_role(farm_id,array['admin_farm','manajer','admin_sistem']))
  with check (public.has_farm_role(farm_id,array['admin_farm','manajer','admin_sistem']));

drop trigger if exists audit_farm_stock_rules_changes on public.farm_stock_rules;
create trigger audit_farm_stock_rules_changes
  after insert or update or delete on public.farm_stock_rules
  for each row execute function public.capture_audit_event();

-- Exact category names map to the same stock category. Cikalong's 15 kg/peti
-- comes from the supplied 2-peti/30-kg note and remains unconfirmed/editable.
insert into public.farm_stock_rules(farm_id,sale_category,stock_category,kg_per_peti,conversion_confirmed)
select f.id,v.sale_category,v.stock_category,
       case when f.code='CKL' then 15::numeric else null end,false
from public.farms f
cross join (values ('PT','PT'),('SU','SU'),('JB','JB'),('TC','TC'),('Telur Jumbo','JB'),('Telur bagus','SU'),('Telur retak','TC'),('Telur 15 kg','PT'),('Telur 15 kg x 18 krat','PT')) as v(sale_category,stock_category)
where f.code='CKL' or v.sale_category in ('PT','SU','JB','TC')
on conflict (farm_id,sale_category) do nothing;
