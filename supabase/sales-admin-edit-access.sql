-- Allow farm admins/managers/system admins to edit and delete sales across
-- locations, consistent with their cross-location dashboard access.
-- Staff remain read/write restricted by their existing role policies.
-- Safe to rerun.
create or replace function public.is_farm_admin()
returns boolean language sql stable security definer set search_path = public
as $$ select exists (
  select 1 from public.farm_members m
  where m.user_id=auth.uid()
    and m.role=any(array['admin_farm','manajer','admin_sistem'])
) $$;

drop policy if exists "admins can manage sales" on public.sales;
create policy "admins can manage sales" on public.sales
  for all to authenticated
  using (
    public.is_farm_admin()
    or public.has_farm_role(farm_id,array['admin_farm','manajer','admin_sistem'])
  )
  with check (
    public.is_farm_admin()
    or public.has_farm_role(farm_id,array['admin_farm','manajer','admin_sistem'])
  );
