-- Import catatan Cikalong tanggal 1-4 Oktober 2026.
-- Jalankan di Supabase SQL Editor setelah meninjau ringkasan di komentar.
-- Script ini idempotent terhadap baris yang cocok dan tidak mengubah baris lama.
--
-- Alur data: daily_reports menyimpan produksi; stock_snapshots menyimpan
-- saldo fisik yang dilaporkan; sales menyimpan transaksi jual. Sales tidak
-- mengurangi stock_snapshots secara otomatis karena tabel stok adalah snapshot,
-- bukan buku mutasi. Jangan jumlahkan telur produksi dengan berat kategori
-- sortir sebelum aturan farm dikonfirmasi.
--
-- Tanggal produksi 3.360/191,63 kg ditetapkan 4 Okt berdasarkan konfirmasi
-- pengguna meskipun teks sumber tertulis Prod 3/10; 3.402/193,85 kg dicatat
-- pada 3 Okt. Nota Taufik dikonfirmasi 30 kg (2 peti x 15 kg) pada
-- Rp22.800/kg = Rp684.000; nota Tehana 270 kg pada Rp23.000/kg = Rp6.210.000.
-- Keduanya dikonfirmasi tunai/dibayar. Pesan jual ecer 10 kg ditahan karena
-- tanggal/metodenya tidak tampak; data 5 Okt belum ada.
-- Data ayam hidup, pakan total, dan KPI (HD/FI/FCR/HH) disimpan sebagai teks
-- sumber di note jika relevan, tidak diubah menjadi data hitung yang belum sah.

begin;

-- Laporan produksi 1-4 Oktober. Nilai yang tidak tersedia dibiarkan NULL.
insert into public.daily_reports
  (farm_id, date, eggs, kg, pt_reported, su, jb, tc, sst, note, status)
select f.id, v.date, v.eggs, v.kg, v.pt_reported, v.su, v.jb, v.tc, v.sst, v.note, 'dikirim'
from public.farms f
cross join (values
  (date '2026-10-01', 3376::numeric, 192.07::numeric, '12/180kg', 5.63::numeric, 2.78::numeric, 2.34::numeric, -1.32::numeric,
   'Asli: Prod 1/10; 3376/192.07; Pt. 12/180kg; Su 5.63kg; Jb 2.78kg; Tc 2.34kg; Sst -1.32kg; HD 94.46%; FI 111.92 gram; berat telur 56.89 gram; FCR 2,08; HH 53.74. PT, HD, FI, FCR, HH disimpan sebagai catatan mentah; populasi/pakan total tidak disimpulkan.'),
  (date '2026-10-02', 3387::numeric, 193.78::numeric, '12+1/180kg', 9.47::numeric, 1.59::numeric, 2.10::numeric, -0.60::numeric,
   'Asli: Prod 2/10; 3387/193.78; Pt. 12+1/180kg (notasi tidak ditafsirkan); Su 9.47kg; Jb 1.59kg; Tc 2.1kg; Sst -0.6kg; HD 94.77%; FI 111.92 gram; berat telur 57.21 gram; FCR 2,06; HH 54.72. PT, HD, FI, FCR, HH disimpan sebagai catatan mentah; populasi/pakan total tidak disimpulkan.'),
  (date '2026-10-03', 3402::numeric, 193.85::numeric, '12/180kg', 9.60::numeric, 1.83::numeric, 1.55::numeric, -0.87::numeric,
   'Asli: Prod 3/10; 3402/193.85; Pt. 12/180kg; Su 9.6kg; Jb 1.83kg; Tc 1.55kg; Sst -0.87kg; HD 95.24%; FI 111.92 gram; berat telur 56.98 gram; FCR 2,06; HH 54.27. PT, HD, FI, FCR, HH disimpan sebagai catatan mentah; populasi/pakan total tidak disimpulkan.'),
  (date '2026-10-04', 3360::numeric, 191.63::numeric, '12/180kg', 7.40::numeric, 1.56::numeric, 1.98::numeric, 0.69::numeric,
   'Asli: pesan WhatsApp diterima 4 Okt pukul 19.09; teks laporan Prod 3/10; 3360/191.63; Pt. 12/180kg; Su 7.4kg; Jb 1.56kg; Tc 1.98kg; Tot. 190.94; Sst. 0.69kg; HD 94.09%; FI 112.01 gram; berat telur 57.21 gram; FCR 2,09; HH 54.27. Tanggal operasi 4 Okt dikonfirmasi pengguna; Tot dan SST disimpan sesuai laporan tanpa menafsirkan selisih; populasi/pakan total tidak disimpulkan.')
) as v(date, eggs, kg, pt_reported, su, jb, tc, sst, note)
where f.code = 'CKL'
  and not exists (
    select 1 from public.daily_reports d
    where d.farm_id = f.id and d.date = v.date
  );

-- Saldo fisik per kategori dan satuan; kategori yang tidak dilaporkan tidak dibuat nol.
insert into public.stock_snapshots (farm_id, snapshot_date, category, quantity, unit, note)
select f.id, v.snapshot_date, v.category, v.quantity, v.unit, v.note
from public.farms f
cross join (values
  (date '2026-10-01', 'PT', 23::numeric, 'peti', 'Asli: Stok 23pt. Snapshot yang dilaporkan; bukan saldo hasil hitung dari produksi/penjualan.'),
  (date '2026-10-01', 'TU', 10.88::numeric, 'kg', 'Asli: Tu 10.88kg. Kode TU belum dipetakan; pertahankan mentah.'),
  (date '2026-10-01', 'TC', 3.81::numeric, 'kg', 'Asli: Tc 3.81kg. Snapshot yang dilaporkan.'),
  (date '2026-10-01', 'JB', 6.40::numeric, 'kg', 'Asli: Jb 6.4kg. Snapshot yang dilaporkan.'),
  (date '2026-10-02', 'PT', 34::numeric, 'peti', 'Asli: Stok 34pt. Snapshot yang dilaporkan; bukan saldo hasil hitung dari produksi/penjualan.'),
  (date '2026-10-02', 'TU', 4.27::numeric, 'kg', 'Asli: Tu 4.27kg. Kode TU belum dipetakan; pertahankan mentah.'),
  (date '2026-10-02', 'TC', 0.69::numeric, 'kg', 'Asli: Tc 0.69kg. Snapshot yang dilaporkan.'),
  (date '2026-10-02', 'JB', 4.80::numeric, 'kg', 'Asli: Jb 4.8kg. Snapshot yang dilaporkan.'),
  (date '2026-10-03', 'PT', 46::numeric, 'peti', 'Asli: Stok 46pt. Snapshot untuk laporan Prod 3/10; terpisah dari catatan produksi.'),
  (date '2026-10-03', 'TU', 9.87::numeric, 'kg', 'Asli: Tu 9.87kg. Kode TU belum dipetakan; pertahankan mentah.'),
  (date '2026-10-03', 'TC', 6.00::numeric, 'kg', 'Asli: Tc 6kg. Snapshot yang dilaporkan.'),
  (date '2026-10-03', 'JB', 2.52::numeric, 'kg', 'Asli: Jb 2.52kg. Snapshot yang dilaporkan.'),
  (date '2026-10-04', 'PT', 40::numeric, 'peti', 'Asli: pesan WhatsApp diterima 4 Okt pukul 19.05; Stok 40pt. Tanggal snapshot 4 Okt mengikuti konfirmasi pengguna.'),
  (date '2026-10-04', 'TU', 7.40::numeric, 'kg', 'Asli: Tu 7.4kg. Kode TU belum dipetakan; pertahankan mentah.'),
  (date '2026-10-04', 'TC', 7.98::numeric, 'kg', 'Asli: Tc 7.98kg. Snapshot yang dilaporkan.'),
  (date '2026-10-04', 'JB', 4.60::numeric, 'kg', 'Asli: Jb 4.6kg. Snapshot yang dilaporkan.')
) as v(snapshot_date, category, quantity, unit, note)
where f.code = 'CKL'
  and not exists (
    select 1 from public.stock_snapshots s
    where s.farm_id = f.id
      and s.snapshot_date = v.snapshot_date
      and s.category = v.category
      and s.unit = v.unit
  );

-- Penjualan eceran 2 Okt. Cash dinyatakan oleh sumber; teks kelas asli dipertahankan.
insert into public.sales
  (farm_id, date, customer, category, quantity, unit, amount, payment_method, status, note)
select f.id, date '2026-10-02', v.customer, v.category, v.quantity, 'kg', v.amount, 'Tunai', 'Dibayar', v.note
from public.farms f
cross join (values
  ('Bu Atin', 'Telur retak', 1.0::numeric, 20000::numeric, 'Tunai (sesuai catatan). Kategori retak dipertahankan mentah; belum dipetakan ke TC.'),
  ('Bu Atin', 'Telur Jumbo', 1.5::numeric, 30000::numeric, 'Tunai (sesuai catatan).'),
  ('Dina', 'Telur Jumbo', 2.0::numeric, 40000::numeric, 'Tunai (sesuai catatan).'),
  ('Dina', 'Telur retak', 1.0::numeric, 20000::numeric, 'Tunai (sesuai catatan). Kategori retak dipertahankan mentah; belum dipetakan ke TC.'),
  ('Bu Cici', 'Telur Jumbo', 2.0::numeric, 40000::numeric, 'Tunai (sesuai catatan).'),
  ('Bu Cici', 'Telur bagus', 2.0::numeric, 48000::numeric, 'Tunai (sesuai catatan). Kategori bagus dipertahankan mentah; belum dipetakan ke SU.')
) as v(customer, category, quantity, amount, note)
where f.code = 'CKL'
  and not exists (
    select 1 from public.sales s
    where s.farm_id = f.id and s.date = date '2026-10-02'
      and s.customer = v.customer and s.category = v.category
      and s.quantity = v.quantity and s.unit = 'kg'
      and s.amount = v.amount and s.note = v.note
  );

-- Nota Taufik 2 Okt: nilai dan kuantitas telah dikonfirmasi pengguna.
insert into public.sales
  (farm_id, date, customer, category, quantity, unit, amount, payment_method, status, note)
select f.id, date '2026-10-02', 'Toko Taufik', 'Telur 15 kg', 30, 'kg', 684000,
       'Tunai', 'Dibayar',
       'Nota 2 Oktober: 30 kg (2 peti x 15 kg), Rp22.800/kg, total Rp684.000; kuantitas/harga dikonfirmasi pengguna. Tunai/dibayar dikonfirmasi pengguna. Stok tidak dikurangi otomatis.'
from public.farms f
where f.code = 'CKL'
  and not exists (
    select 1 from public.sales s
    where s.farm_id = f.id and s.date = date '2026-10-02'
      and s.customer = 'Toko Taufik' and s.category = 'Telur 15 kg'
      and s.quantity = 30 and s.unit = 'kg' and s.amount = 684000
  );

-- Nota Tehana 4 Okt: kuantitas/harga cocok dan pengguna mengonfirmasi tunai/dibayar.
insert into public.sales
  (farm_id, date, customer, category, quantity, unit, amount, payment_method, status, note)
select f.id, date '2026-10-04', 'Tehana SPG', 'Telur 15 kg x 18 krat', 270, 'kg', 6210000,
       'Tunai', 'Dibayar',
       'Nota bertanggal 4 Oktober 2026: 270 kg (18 krat x 15 kg), harga tertulis Rp23.000/kg, total Rp6.210.000. Hitungan kuantitas x harga cocok; tunai/dibayar dikonfirmasi pengguna. Stok tidak dikurangi otomatis.'
from public.farms f
where f.code = 'CKL'
  and not exists (
    select 1 from public.sales s
    where s.farm_id = f.id and s.date = date '2026-10-04'
      and s.customer = 'Tehana SPG' and s.category = 'Telur 15 kg x 18 krat'
      and s.quantity = 270 and s.unit = 'kg' and s.amount = 6210000
  );

commit;
