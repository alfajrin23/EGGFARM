# Ruang Farm

Web responsif untuk mencatat produksi telur, sortir, stok, penjualan, dan kas keluar. Antarmuka memakai Bahasa Indonesia. Tanpa konfigurasi Supabase, aplikasi berjalan dalam mode demo dan menyimpan perubahan pada `localStorage` browser yang sedang digunakan.

## Menjalankan pratinjau lokal

Perbarui berkas konfigurasi browser dari URL dan anon key publik yang sudah ada di `.env.local`, lalu jalankan server statis:

```sh
node scripts/sync-supabase-config.mjs
python -m http.server 8000
```

Buka `http://localhost:8000`. Jangan menaruh service role key di `.env.local` dengan awalan `NEXT_PUBLIC_`.

## Deploy ke Vercel

Project memakai build statis di `vercel.json`. Tambahkan `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY` sebagai environment variables Production di Vercel, lalu deploy dari root repository. Build menyalin hanya file web dan aset publik ke `dist`; file `.env.local` serta konfigurasi lokal tidak ikut dipublish.

## Mengaktifkan Supabase

1. Buat proyek Supabase dan buka **SQL Editor**.
2. Jalankan atau jalankan ulang skrip [supabase/schema.sql](supabase/schema.sql). Skrip menambah tabel snapshot stok dan profil pengguna untuk instalasi MVP sebelumnya. Untuk proyek yang sudah memakai skema ini, jalankan [supabase/location-access-update.sql](supabase/location-access-update.sql) untuk kebijakan lokasi dan [supabase/sales-payment-method.sql](supabase/sales-payment-method.sql) untuk kolom metode pembayaran penjualan.
3. Matikan pendaftaran publik di pengaturan **Authentication**. Di **Authentication → Users**, buat akun admin pertama dari dashboard Supabase.
4. Skema otomatis menambahkan Cikalong (beroperasi) dan Sukanagara (pembangunan). Tambahkan keanggotaan akun lewat SQL Editor. Ambil UUID Cikalong dan UUID pengguna dari Authentication → Users:

   ```sql
   select id, code, name from public.farms where code = 'CKL';
   insert into public.farm_members (farm_id, user_id, role)
   values ('UUID-CKL', 'UUID-PENGGUNA', 'admin_sistem');
   ```

5. Siapkan `.env.local` dengan `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY`, lalu jalankan `node scripts/sync-supabase-config.mjs`. Skrip membuat berkas lokal `supabase-config.js`, yang diabaikan Git.
6. Muat ulang aplikasi dan masuk dengan akun Supabase. Akun staff (`petugas`) hanya dapat melihat lokasi yang ditugaskan melalui `farm_members`; admin farm, manajer, dan admin sistem dapat membaca seluruh lokasi. Kebijakan RLS Supabase menegakkan batas tersebut untuk permintaan langsung ke database. Halaman login tidak menyediakan pendaftaran mandiri.
7. Deploy Edge Function untuk undangan staff: `supabase functions deploy admin-invite-user`. Function memakai `SUPABASE_SERVICE_ROLE_KEY` hanya di server dan memeriksa bahwa pemanggil admin lokasi. Pastikan pengiriman email Auth/SMTP Supabase sudah dikonfigurasi. Atur `APP_SITE_URL` sebagai secret function jika tautan undangan harus kembali ke alamat aplikasi tertentu.
8. Jalankan [supabase/smart-capture-evidence.sql](supabase/smart-capture-evidence.sql) untuk menyimpan nota dan bukti gambar pada penjualan, stok, dan kas. OCR menggunakan Tesseract.js dari CDN saat diminta; pastikan browser terhubung ke internet.
9. Untuk database yang sudah berjalan, jalankan [supabase/production-pt-reported.sql](supabase/production-pt-reported.sql) agar kolom PT tersedia dan notasi PT di catatan lama diisi kembali jika ditemukan. PT disimpan sebagai teks sumber sampai arti notasinya dikonfirmasi.

`supabase-config.js` diabaikan Git. Browser hanya boleh memakai anon/publishable key; jangan menaruh `service_role` key di frontend. Jangan gunakan database produksi sebelum kebijakan, peran, dan alur autentikasi ditinjau sesuai kebutuhan operasional.

## Yang tersedia

- Ringkasan produksi, sortir, snapshot stok per kategori/satuan, penjualan, tren harian, dan catatan yang perlu ditinjau.
- Form catatan produksi, penjualan, kas keluar, istilah lokal, dan pengelolaan tempat produksi.
- Form produksi, stok, penjualan, dan kas dapat membaca teks yang ditempel atau screenshot dari clipboard/file. Hasil OCR menjadi isian awal yang harus ditinjau pengguna sebelum disimpan. Penjualan baru memerlukan nota; metode Transfer bank juga memerlukan bukti transfer.
- Laporan periode, ekspor CSV, cetak/PDF, tabel responsif, filter lokasi/periode, dan kamus yang dapat dicari.
- Lokasi nonoperasional (pembangunan, persiapan, jeda, ditutup) tetap terlihat dan dikecualikan dari agregat produksi aktif.
- Skema Supabase untuk farm/akses, laporan harian, penjualan, transaksi kas, istilah, dan audit.
- Login email/kata sandi, tanpa pendaftaran mandiri; admin dapat mengundang Staff (`petugas`) untuk satu lokasi lewat Edge Function.

## Batasan prototipe

Screenshot hanya mengisi form sebagai saran; pengguna perlu memeriksa hasilnya. Clipboard gambar mungkin meminta izin browser, dan OCR memerlukan koneksi internet. Contoh baru dapat dipakai untuk memperluas aturan pembacaan pola, tetapi sistem tidak melatih model otomatis. Peti, kg, dan butir tetap mengikuti satuan dan aturan stok setiap lokasi.
