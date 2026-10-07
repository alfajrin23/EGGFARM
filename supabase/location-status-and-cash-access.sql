-- Enable admins to change location status across their farm workspace and
-- record location-scoped cash transactions. Group cash remains Cikalong-admin only.
-- Safe to rerun in Supabase SQL Editor.

drop policy if exists "managers can update farms" on public.farms;
create policy "managers can update farms" on public.farms
  for update to authenticated
  using (public.is_farm_admin() or public.has_farm_role(id,array['manajer','admin_sistem']))
  with check (public.is_farm_admin() or public.has_farm_role(id,array['manajer','admin_sistem']));

drop policy if exists "farm members can record local cash transactions" on public.cash_transactions;
create policy "farm members can record local cash transactions" on public.cash_transactions
  for insert to authenticated
  with check (
    farm_id is not null
    and (public.is_farm_member(farm_id) or public.is_farm_admin())
    and created_by = auth.uid()
  );

drop policy if exists "admins can manage cash transactions" on public.cash_transactions;
create policy "admins can manage cash transactions" on public.cash_transactions
  for all to authenticated
  using (
    (farm_id is null and public.can_manage_group_cash())
    or (farm_id is not null and (
      public.is_farm_admin()
      or public.has_farm_role(farm_id,array['admin_farm','manajer','admin_sistem'])
    ))
  )
  with check (
    (farm_id is null and public.can_manage_group_cash())
    or (farm_id is not null and (
      public.is_farm_admin()
      or public.has_farm_role(farm_id,array['admin_farm','manajer','admin_sistem'])
    ))
  );
