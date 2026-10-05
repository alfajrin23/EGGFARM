-- Apply to an existing Supabase project to scope staff by farm membership.
-- Staff (petugas) can read only farms present in their farm_members rows.
-- Any admin_farm/manajer/admin_sistem membership grants read access across farms.
-- Existing write policies remain in force; this changes read visibility only.

create or replace function public.is_farm_admin()
returns boolean language sql stable security definer set search_path = public
as $$ select exists (
  select 1 from public.farm_members m
  where m.user_id=auth.uid()
    and m.role=any(array['admin_farm','manajer','admin_sistem'])
) $$;

drop policy if exists "members can view farms" on public.farms;
create policy "members can view farms" on public.farms
for select to authenticated
using (public.is_farm_member(id) or public.is_farm_admin());

drop policy if exists "members can view memberships" on public.farm_members;
create policy "members can view memberships" on public.farm_members
for select to authenticated
using (user_id=auth.uid() or public.is_farm_admin() or public.has_farm_role(farm_id,array['admin_farm','manajer','admin_sistem']));

drop policy if exists "farm admins can view staff profiles" on public.profiles;
create policy "farm admins can view staff profiles" on public.profiles
for select to authenticated
using (
  (public.is_farm_admin() and exists (select 1 from public.farm_members m where m.user_id=profiles.user_id))
  or exists (select 1 from public.farm_members m where m.user_id=profiles.user_id and public.has_farm_role(m.farm_id,array['admin_farm','manajer','admin_sistem']))
);

drop policy if exists "members can view stock snapshots" on public.stock_snapshots;
create policy "members can view stock snapshots" on public.stock_snapshots
for select to authenticated
using (public.is_farm_member(farm_id) or public.is_farm_admin());

drop policy if exists "farm members can view reports" on public.daily_reports;
create policy "farm members can view reports" on public.daily_reports
for select to authenticated
using (public.is_farm_member(farm_id) or public.is_farm_admin());

drop policy if exists "farm members can view sales" on public.sales;
create policy "farm members can view sales" on public.sales
for select to authenticated
using (public.is_farm_member(farm_id) or public.is_farm_admin());

drop policy if exists "members can view cash transactions" on public.cash_transactions;
create policy "members can view cash transactions" on public.cash_transactions
for select to authenticated
using (
  (farm_id is null and (public.is_group_member() or public.is_farm_admin()))
  or public.is_farm_member(farm_id)
  or public.is_farm_admin()
);

drop policy if exists "members can view terms" on public.dictionary_terms;
create policy "members can view terms" on public.dictionary_terms
for select to authenticated
using (farm_id is null or public.is_farm_member(farm_id) or public.is_farm_admin());

drop policy if exists "members can view audit" on public.audit_events;
create policy "members can view audit" on public.audit_events
for select to authenticated
using (
  (farm_id is null and (public.is_group_member() or public.is_farm_admin()))
  or public.is_farm_member(farm_id)
  or public.is_farm_admin()
);
