-- Restore the Cikalong report removed during the chart correction.
-- It is restored exactly as previously stored; its operation date remains
-- unresolved because its note says 4 Oct while the row date was 3 Oct.
begin;

drop index if exists public.daily_reports_unassigned_farm_date_uidx;

insert into public.daily_reports
  (id,farm_id,date,eggs,kg,su,jb,tc,sst,birds,feed,note,status,version,created_at,updated_at)
select
  'ae6efa03-623e-4a37-a8c2-f71942860761'::uuid,
  f.id,
  date '2026-10-03',
  3360,
  191.63,
  7.4,
  1.56,
  1.98,
  0.69,
  null,
  null,
  'Asli: pesan WhatsApp diterima 4 Okt pukul 19.09; teks laporan Prod 3/10; 3360/191.63; Pt. 12/180kg; Su 7.4kg; Jb 1.56kg; Tc 1.98kg; Tot. 190.94; Sst. 0.69kg; HD 94.09%; FI 112.01 gram; berat telur 57.21 gram; FCR 2,09; HH 54.27. Tanggal operasi 4 Okt dikonfirmasi pengguna; Tot dan SST disimpan sesuai laporan tanpa menafsirkan selisih; populasi/pakan total tidak disimpulkan.',
  'dikirim',
  1,
  timestamptz '2026-10-05 02:34:48.214096+00',
  timestamptz '2026-10-05 02:34:48.214096+00'
from public.farms f
where f.code='CKL'
  and not exists (select 1 from public.daily_reports d where d.id='ae6efa03-623e-4a37-a8c2-f71942860761'::uuid);

commit;
