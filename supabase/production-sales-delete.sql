-- Aktifkan penghapusan laporan produksi oleh admin farm.
-- Sales sudah memakai policy "admins can manage sales" (FOR ALL).
-- Trigger audit_daily_report_changes tetap merekam nilai sebelum penghapusan.
drop policy if exists "admins can delete reports" on public.daily_reports;
create policy "admins can delete reports"
  on public.daily_reports
  for delete to authenticated
  using (public.has_farm_role(farm_id,array['admin_farm','manajer','admin_sistem']));
