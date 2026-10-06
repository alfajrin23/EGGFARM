-- Catatan produksi dan saldo stok Cikalong untuk 4 Oktober 2026.
-- Sumber baru menggantikan catatan 4 Okt yang lebih awal (3.360 butir/191,63 kg;
-- snapshot 40 peti). Jalankan aman berulang: laporan tanggal/lokasi diperbarui,
-- snapshot kategori yang memiliki angka di-upsert.
--
-- Nilai petugas disimpan terpisah dari KPI yang dihitung. Ayam hidup dan total
-- pakan tidak tersedia, jadi tidak disimpulkan. Notasi PT, Tot, SST, TU, dan HH
-- mentah disimpan di catatan; tanda "-" untuk TU bukan angka nol.

begin;

-- Catatan 3.360/191,63 kg sebelumnya tersimpan tanggal 3 Okt, padahal
-- pengguna mengonfirmasi tanggal operasinya 4 Okt. Data 4 Okt terkini di bawah
-- menggantikannya; hapus salinan salah tanggal agar grafik tidak menjumlahkan
-- dua laporan pada 3 Okt. Trigger audit menyimpan jejak penghapusan.
delete from public.daily_reports d
using public.farms f
where d.farm_id=f.id and f.code='CKL'
  and d.date=date '2026-10-03'
  and d.house_id is null and d.flock_id is null
  and d.eggs=3360 and d.kg=191.63
  and d.note like '%Tanggal operasi 4 Okt dikonfirmasi pengguna%';

do $$
declare
  target_farm uuid;
begin
  select id into target_farm from public.farms where code='CKL';
  if target_farm is null then raise exception 'Farm Cikalong (CKL) tidak ditemukan'; end if;

  update public.daily_reports
  set eggs=3399,
      kg=194.63,
      total_reported_kg=194.77,
      su=10.8,
      jb=1.89,
      tc=2.08,
      sst=0.16,
      hd_reported=95.21,
      fi_reported=112.01,
      ew_reported=57.26,
      fcr_reported=2.06,
      hh_reported='54.51',
      birds=null,
      feed=null,
      note='Sumber WhatsApp, Prod 4/10: 3399/194.63; Pt. 12+1/180kg; Su 10.8kg; Jb 1.89kg; Tc 2.08kg; Tot. 194,77; Sst. +0.16; HD 95.21%; Fi 112.01gram; Berat telor 57.26gram; Fcr 2.06; Hh 54.51. Tanggal operasi 4 Okt dikonfirmasi pengguna. PT 12+1/180kg, Tot, dan HH dipertahankan sebagai teks mentah; populasi ayam hidup dan pakan total tidak tersedia sehingga KPI tidak dihitung ulang. Menggantikan catatan produksi 4 Okt yang lebih awal.'
  where farm_id=target_farm and date=date '2026-10-04' and house_id is null and flock_id is null;

  if not found then
    insert into public.daily_reports
      (farm_id,date,eggs,kg,total_reported_kg,su,jb,tc,sst,hd_reported,fi_reported,ew_reported,fcr_reported,hh_reported,birds,feed,note,status)
    values
      (target_farm,date '2026-10-04',3399,194.63,194.77,10.8,1.89,2.08,0.16,95.21,112.01,57.26,2.06,'54.51',null,null,
       'Sumber WhatsApp, Prod 4/10: 3399/194.63; Pt. 12+1/180kg; Su 10.8kg; Jb 1.89kg; Tc 2.08kg; Tot. 194,77; Sst. +0.16; HD 95.21%; Fi 112.01gram; Berat telor 57.26gram; Fcr 2.06; Hh 54.51. Tanggal operasi 4 Okt dikonfirmasi pengguna. PT 12+1/180kg, Tot, dan HH dipertahankan sebagai teks mentah; populasi ayam hidup dan pakan total tidak tersedia sehingga KPI tidak dihitung ulang. Menggantikan catatan produksi 4 Okt yang lebih awal.',
       'dikirim');
  end if;
end $$;

insert into public.stock_snapshots(farm_id,snapshot_date,category,quantity,unit,note)
select f.id,date '2026-10-04',v.category,v.quantity,v.unit,v.note
from public.farms f
cross join (values
  ('PT',53::numeric,'peti','Sumber WhatsApp, Stok 53 pt, diterima 4 Okt; menggantikan snapshot lama 40 peti.'),
  ('TC',8.6::numeric,'kg','Sumber WhatsApp, stok TC 8.6 kg, diterima 4 Okt; menggantikan snapshot lama 7.98 kg.'),
  ('JB',5.97::numeric,'kg','Sumber WhatsApp, stok JB 5.97 kg, diterima 4 Okt; menggantikan snapshot lama 4.60 kg.')
) as v(category,quantity,unit,note)
where f.code='CKL'
on conflict (farm_id,snapshot_date,category,unit)
do update set quantity=excluded.quantity,note=excluded.note;

-- TU dilaporkan "- kg" tanpa nilai numerik: buang angka saldo snapshot lama,
-- tetapi jangan tafsirkan tanda tersebut sebagai nol.
delete from public.stock_snapshots s
using public.farms f
where s.farm_id=f.id and f.code='CKL'
  and s.snapshot_date=date '2026-10-04' and s.category='TU' and s.unit='kg';

commit;
