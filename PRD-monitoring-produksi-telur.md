# PRD — Web Monitoring Produksi dan Penjualan Telur

**Status:** Draf untuk validasi operasional  
**Bahasa:** Indonesia  
**Lokasi awal:** Cikalong, Cianjur (aktif)  
**Lokasi berikutnya:** Sukanagara, Cianjur (pembangunan; belum masuk angka produksi)  
**Sumber:** *Almanak Istilah Peternakan Ayam* (PDF dari pengguna) dan contoh laporan karyawan.

## 1. Ringkasan

Aplikasi web untuk mencatat, menelusuri, dan merangkum **produksi telur, sortir, stok, dan penjualan**. Aplikasi mengubah catatan ringkas lapangan menjadi data terstruktur tanpa menghilangkan istilah lokal. Setiap angka punya satuan, periode, konteks, dan definisi. Produksi, telur layak jual, telur rusak/susut, stok, dan telur terjual selalu dibedakan.

Pengguna dapat melihat keadaan farm, mencari penyebab perubahan, memeriksa saldo telur, dan membuat laporan mingguan/bulanan per lokasi maupun gabungan. Sukanagara dapat disiapkan sebagai lokasi berstatus pembangunan, tetapi tidak memengaruhi KPI operasi sebelum tanggal mulai produksi ditetapkan.

## 2. Masalah dan tujuan

Format seperti `Prod 2/10`, `3387/193.78`, dan `SU/JB/TC/SST` cepat ditulis petugas, tetapi tidak mudah dibaca orang awam. Produksi juga bukan penjualan: telur dapat disortir, masuk stok, rusak/susut, terjual pada hari yang sama atau berbeda, dan tersisa. Satuan butir, kg, peti, gram/butir, dan persen perlu dibedakan. Singkatan almanak dapat bermakna beda menurut konteks; misalnya HPP berarti Hen-Housed Production dalam konteks performa atau Harga Pokok Produksi dalam konteks biaya.

Tujuan:

1. Petugas mencatat produksi, sortir, stok, dan penjualan melalui alur yang mudah dipahami serta nyaman di ponsel.
2. Manajer dapat menjawab berapa diproduksi, layak jual, terjual, tersisa, dan bagaimana perubahan terhadap periode lain.
3. Laporan harian menjadi sumber laporan mingguan/bulanan, bukan rekap manual.
4. Bahasa utama memakai istilah sehari-hari; singkatan teknis disertai definisi.
5. Lokasi dan flock baru dapat ditambahkan tanpa mencampur data konstruksi dengan operasi.

**Ukuran keberhasilan MVP:** ≥95% catatan memiliki lokasi, tanggal, satuan, dan petugas; tidak ada stok negatif tanpa izin koreksi dan alasan; laporan mingguan/bulanan dapat diekspor tanpa hitung ulang; selisih stok dapat ditelusuri; pengguna baru dapat membedakan produksi, penjualan, dan stok.

## 3. Cakupan

**MVP:** multi-lokasi yang dapat terus bertambah; fitur tambah dan kelola tempat produksi; master farm/kandang/flock dan populasi; kategori telur/satuan/pelanggan/pengguna; input produksi harian, sortir, pakan, populasi, stok, penjualan, retur, koreksi, transfer/pengeluaran usaha sederhana dan audit; dashboard; laporan harian/mingguan/bulanan; ekspor CSV dan cetak/PDF; kamus istilah; peringatan data tidak lengkap/tidak konsisten.

**Di luar MVP:** akuntansi penuh, HPP/COGS, laba/pajak, rekonsiliasi bank otomatis, dan laporan arus kas akuntansi; formulasi pakan dan program kesehatan; IoT/sensor, integrasi timbangan/mesin sortir, prediksi otomatis; pengelolaan penuh stok pakan/obat; pembandingan standar strain sebelum sumber standar disepakati. Pencatatan manual transfer/pengeluaran dan rekap kas keluar sederhana tetap termasuk MVP.

### Fitur pengelolaan tempat produksi

Admin berwenang dapat menambah tempat produksi baru kapan pun dari **Pengaturan → Tempat produksi**, tanpa perlu mengubah kode atau membuat dashboard terpisah. Form tambah lokasi memuat nama, kode unik, alamat/wilayah, zona waktu, status (**Pembangunan**, **Persiapan**, **Beroperasi**, **Jeda**, **Ditutup**), tanggal mulai operasi (bila ada), dan penanggung jawab. Setelah dibuat, admin dapat menambahkan kandang, flock/batch, pengguna yang memiliki akses, serta konfigurasi kategori dan satuan khusus lokasi tersebut.

Lokasi baru berstatus nonoperasional sampai tanggal/status operasinya ditetapkan. Lokasi pembangunan/persiapan/jeda/ditutup tidak dihitung sebagai produksi nol dan tidak masuk agregat produksi aktif; pengguna tetap bisa melihatnya pada daftar lokasi dengan statusnya. Saat lokasi mulai beroperasi, data historis dan konfigurasi tetap melekat pada lokasi itu. Menonaktifkan atau menutup lokasi tidak menghapus laporan, transaksi, maupun audit lama. Kode unik dan riwayat perubahan lokasi mencegah data antar lokasi tercampur.

## 4. Pengguna dan akses

| Peran | Hak utama |
|---|---|
| Petugas farm | Mengisi dan melihat catatan lokasi yang ditugaskan; mengubah draf; mengirim laporan. |
| Admin farm | Memeriksa/mengoreksi laporan, mengelola flock dan stok, mencatat jual, memberi alasan koreksi. |
| Manajer/pemilik | Melihat seluruh lokasi dan laporan; menyetujui koreksi; mengelola target dan akses. |
| Admin sistem | Mengelola pengguna, lokasi, kategori, satuan, kamus, rumus dan audit. |

Hak akses dibatasi per lokasi. Laporan disetujui menjadi terkunci; revisi dilakukan sebagai koreksi berversi yang menyimpan nilai sebelum/sesudah, pelaku, waktu, dan alasan.

## 5. Navigasi dan arah UI

Navigasi utama: **Ringkasan · Produksi · Stok & Penjualan · Kas & Pengeluaran · Laporan · Kamus istilah · Pengaturan**. Tombol **Catat hari ini** mudah dijangkau di ponsel.

Arah visual: alat kerja farm yang rapi; latar terang hangat, teks gelap berkontras tinggi, aksen hijau secukupnya, garis pemisah halus, ruang cukup, tabel/grafik disiplin. Hindari hero dekoratif, gradien mencolok, ikon acak, label generik, dan deretan kartu KPI yang tampak sama penting. Gunakan “Telur dihasilkan”, “Terjual”, “Sisa stok”; singkatan menjadi label pendamping/tooltip. Angka punya unit dan tanggal (`3.387 butir · 2 Okt`). Warna bukan satu-satunya penanda status. Grafik berjudul jelas, memiliki sumbu/unit, rentang, legenda, tooltip, dan ringkasan teks. Sediakan alternatif tabel. Bedakan nilai kosong dari nol; format angka lokal (`3.387`, `193,78 kg`); form nyaman di layar kecil dan keyboard.

## 6. Dashboard

Filter: lokasi (default Cikalong), kandang, flock/batch, hari ini/7 hari/bulan/rentang khusus, pembanding periode sama panjang. Pemilih lokasi mengikuti daftar tempat produksi yang dikelola admin, sehingga lokasi baru tersedia setelah dibuat. Lokasi nonoperasional bertanda statusnya dan tidak masuk total produksi.

Urutan tampilan:

1. **Konteks:** nama/status farm, tanggal, pembaruan terakhir, tombol catat dan laporan.
2. **Ringkasan:** telur dihasilkan (butir dan kg), layak jual, terjual, stok akhir; perubahan terhadap periode pembanding dan tautan ke sumber.
3. **Tren produksi:** grafik harian dengan seri butir atau kg yang dipilih; jangan campur dua unit pada satu sumbu. Target hanya jika dikonfigurasi dan bersumber jelas.
4. **Ke mana telur bergerak:** alur/batang produksi → hasil sortir → penjualan + stok akhir + kehilangan/koreksi. Tunjukkan angka, periode, serta selisih **Belum direkonsiliasi**. Hindari pie untuk banyak kategori.
5. **Performa ayam/pakan:** HDP (%), konsumsi pakan (g/ekor/hari), berat telur (g/butir), FCR (kg pakan/kg massa telur); grafik terpisah, definisi tooltip, hanya jika datanya tersedia.
6. **Pengeluaran usaha:** total kas keluar pada periode terpilih, dengan ringkasan per kategori (upah tukang, alat, kandang/pembangunan, operasional, lainnya) dan tautan ke transaksi. Jangan sajikan sebagai laba/rugi.
7. **Perlu ditinjau:** laporan terlambat, stok/selisih, atau transaksi pengeluaran yang belum lengkap/belum diverifikasi; setiap pesan punya alasan dan tautan perbaikan.

Agregat persentase memakai total pembilang ÷ total penyebut, bukan rata-rata sederhana persentase harian. Tampilkan total periode dan tren harian/mingguan. Nilai kosong bertuliskan **Belum dicatat**, bukan 0.

## 7. Alur utama

### Input harian

Pilih lokasi, kandang/flock, tanggal; isi tahap **Produksi & sortir → Pakan & populasi → Pemeriksaan → Kirim**. Draf tersimpan otomatis. Masukkan butir dan/atau kg per kategori yang diaktifkan farm. Form menampilkan nama umum dan istilah lokal, misalnya “Jumbo (JB) — ukuran menurut batas grading farm”. Nilai hitung diberi label **Dihitung dari data**, rumus, dan tautan sumber. Validasi menjelaskan langkah perbaikan. Sebelum kirim tampilkan ringkasan normal; admin meninjau/menyetujui.

### Penjualan

Pilih tanggal, pelanggan (opsional), kategori, jumlah/satuan, harga/pembayaran (opsional), surat jalan/catatan. Tampilkan stok saat ini dan proyeksi stok akhir. Peti dikonversi hanya jika aturan farm/kategori ditetapkan; simpan nilai input dan nilai standar. Retur/pembatalan membalik transaksi awal, bukan menghapus riwayat.

### Transfer dan pengeluaran usaha

Pengguna berwenang membuka **Kas & Pengeluaran → Tambah transaksi** untuk mencatat uang yang ditransfer/dibayarkan kepada tukang, pekerja, toko, pemasok, atau penerima lain. Isian minimum: tanggal, jumlah rupiah, penerima, tujuan/keterangan, kategori (upah/tenaga kerja; alat; kandang atau pembangunan; operasional; lainnya), metode (transfer bank/e-wallet/tunai), status (direncanakan/dibayar/perlu verifikasi), dan pencatat. Pilih cakupan transaksi: **Grup Cikalong** untuk transaksi tingkat grup yang tidak khusus pada satu lokasi; **Lokasi produksi** (misalnya farm Cikalong); **Proyek pembangunan** (misalnya pembangunan Sukanagara); atau **Umum/Grup lain**. Transaksi tingkat grup dapat dialokasikan ke lokasi/proyek bila diketahui, tanpa mengubahnya menjadi transaksi lokasi secara otomatis. Nomor referensi transfer dan foto bukti/nota dapat ditambahkan; kategori dapat dikelola admin.

Transfer internal antar rekening/kas dicatat sebagai **Pindah dana internal**, bukan biaya. Pembayaran kepada penerima eksternal dicatat sebagai pengeluaran. Rekap membedakan transaksi dibayar, direncanakan, dan menunggu verifikasi. Perubahan status dan koreksi memiliki audit. Ini buku kas keluar sederhana, bukan pembukuan akuntansi atau penghitungan laba.

### Laporan

Filter lokasi/periode. Sajikan produksi, sortir, penjualan per kategori/pelanggan, pergerakan stok, indikator ayam/pakan, kelengkapan, dan catatan penyimpangan. Setiap angka dapat ditelusuri ke sumber. Ekspor memuat definisi, unit, filter, waktu pembuatan.

## 8. Kamus dan aturan istilah

| Label aplikasi | Istilah almanak/lokal | Aturan |
|---|---|---|
| Ayam hidup hari ini | Bird inventory | Saldo populasi yang menjadi basis HDP; telusuri ayam awal, kematian, afkir, koreksi. |
| Produksi harian (HDP) | HDP/HDEP | Butir hari ini ÷ ayam hidup hari ini × 100%. Tampilkan basis; almanak menyebut HDEP umumnya setara HDP. |
| Berat telur rata-rata | EW/AEW | Gram/butir; rekam cara hitung dari berat total/butir atau sampel dan ukuran sampel. |
| Konsumsi pakan | FI/ADFI | Basis harus jelas: g/ekor/hari atau jumlah kelompok. Bedakan pakan diberikan, sisa, tercecer jika ada. |
| Massa telur | Egg mass | Berat telur total; periode harus sama dengan data pakan untuk FCR. |
| FCR telur | FCR | Pakan dikonsumsi (kg) ÷ massa telur (kg); jangan campur FCR per lusin. |
| Produksi kumulatif per ayam awal | HHP/HHEP | Metode dan unit wajib eksplisit; jangan menyamakan `HH` tanpa konfirmasi. |
| Peti | Egg crate / PT lokal | Satuan kemasan; kapasitas kg/butir diatur per farm/kategori, jangan menganggap selalu 15 kg. |
| Sisa utuh (SU) | SU | Kategori lokal telur utuh yang tersisa/terpilah menurut SOP; bukan otomatis stok akhir. |
| Jumbo (JB) | JB | Ukuran besar; batas grading menurut farm/pembeli. |
| Telur cair (TC) | TC | Telur rusak hingga isi keluar/merembes; perlakuan sebagai kehilangan/produk nonnormal mengikuti SOP. |
| Susut (SST) | SST | Selisih/kehilangan; catat jenis, unit, tahap, dan alasan. Tanda negatif tidak otomatis dibalik/ditambahkan ke produksi. |
| TU | Belum dijelaskan almanak | Jangan ekspansi otomatis; minta admin menetapkan arti. |
| HPP | Hen-Housed Production atau Harga Pokok Produksi | Jangan tampilkan HPP tanpa konteks; gunakan nama dan unit penuh. Modul biaya di luar MVP. |

Kamus dapat dicari berdasarkan singkatan/kata umum, menunjukkan arti almanak, arti SOP farm, modul, unit, dan tanggal berlaku. Singkatan bermakna ganda perlu konteks (ASM, PM, PO, SO, HPP).

## 9. Pemetaan contoh karyawan

Contoh menjadi bahan validasi, bukan data yang langsung diimpor. Nilai mungkin konsisten, tetapi arti kode harus disahkan.

| Catatan | Penanganan |
|---|---|
| `Prod 2/10` | Tanggal ambigu tanpa tahun/format; impor perlu konfirmasi tanggal lengkap. |
| `3387/193.78` | Kemungkinan 3.387 butir/193,78 kg. Cocok secara hitung dengan 3.387 × 57,21 g ≈ 193,78 kg. |
| `Prod 1/10 · 3376/192.07` | Kemungkinan 3.376 butir/192,07 kg. Cocok dengan 3.376 × 56,89 g ≈ 192,06 kg; selisih kecil dapat berasal dari angka rata-rata yang dibulatkan. |
| `Pt. 12/180kg` | Baris ini menunjukkan 12 peti untuk 180 kg, atau 15 kg/peti pada transaksi tersebut. Gunakan 15 kg/peti sebagai konversi awal yang dapat dikonfigurasi untuk Cikalong; tetap simpan angka kg asli dan minta admin farm mengesahkan apakah berlaku untuk semua kategori/transaksi. |
| `Pt. 12+1/180kg` | Notasi `12+1` masih tidak jelas; jangan otomatis menafsirkan sebagai 13 peti atau mengubah nilai 180 kg. Simpan catatan asli sampai admin farm memetakan notasinya. |
| `Su 9.47kg`, `Jb 1.59kg`, `Tc 2.1kg` (contoh pertama); `Su 5.63kg`, `Jb 2.78kg`, `Tc 2.34kg` (contoh kedua) | Mungkin berat sortir. Definisi/status jual dapat diatur; jangan menganggap kategorinya pasti saling eksklusif atau otomatis menjumlahkannya ke produksi. |
| `Stok 34pt`; `Tu 4.27kg`, `Tc 0.69kg`, `Jb 4.8kg` (contoh pertama); `Stok 23pt`; `Tu 10.88kg`, `Tc 3.81kg`, `Jb 6.4kg` (contoh kedua) | Saldo per kategori/satuan; TU belum jelas. Peti dan kg tetap dipisahkan; tampilkan konversi perkiraan hanya setelah aturan 15 kg/peti diaktifkan untuk kategori terkait. |
| `HD 94.77%` / `HD 94.46%` | Kemungkinan HDP. Kedua nilai cocok dengan 3.387/3.574 dan 3.376/3.574; basis ayam hidup 3.574 sangat mungkin, tetapi perlu dicocokkan dengan catatan populasi farm. |
| `Fi 111.92gram` (kedua contoh) | Kemungkinan FI/ADFI dalam g/ekor/hari; pola silang mendukung basis ini, tetapi konfigurasi harus dapat diubah. |
| `Berat telor 57.21gram` / `56.89gram` | Tampilkan “Berat telur rata-rata” dalam g/butir; cocokkan dengan berat total dan jumlah butir, dengan toleransi pembulatan. |
| `FCR 2,06` / `FCR 2,08` | Kedua contoh konsisten dengan kg pakan/kg massa telur; jadikan dugaan konfigurasi awal dan tampilkan rumus. |
| `HH 54.72` / `HH 53.74` | Tidak dipetakan otomatis; makna dan unit belum jelas. |
| `Sst -0.6kg` / `Sst -1.32kg` | Simpan sebagai nilai susut bertanda dengan satuan dan alasan; jangan mengubahnya otomatis menjadi angka positif atau mengurangi stok dua kali. |

Kedua contoh harian saling menguatkan: `3.376 ÷ 94,46%` menghasilkan sekitar 3.574 ayam hidup; `FI 111,92 g × 3.574` menghasilkan sekitar 400 kg pakan/hari; sementara `FCR 2,08 × 192,07 kg` menghasilkan sekitar 399,51 kg. Contoh pertama menghasilkan perkiraan serupa. Ini mendukung dugaan bahwa FI adalah gram per ekor per hari, HD adalah HDP, dan FCR menggunakan kg pakan per kg telur, tetapi aplikasi tetap memisahkan angka **Dilaporkan** dan **Dihitung** sampai basisnya dikonfirmasi tim.

## 10. Data dan logika

Setiap catatan punya ID, farm, kandang, flock, tanggal operasi, waktu input, pengguna, status (draf/dikirim/disetujui/dikoreksi), versi, sumber, dan jejak perubahan. Entitas inti: `Farm`, `House`, `Flock/Batch`, `Project`, `BirdInventoryMovement`, `DailyProductionReport`, `EggCategory`, `EggStockMovement`, `Sale`, `Customer`, `FeedRecord`, `CashTransaction`, `ExpenseCategory`, `Recipient`, `KpiDefinition`, `UnitConversion`, `User`, `AuditEvent`.

Stok adalah buku pergerakan: saldo awal + produksi masuk + retur + penyesuaian masuk − penjualan − kehilangan ± koreksi = saldo akhir. Catat per lokasi/kategori/unit dasar. Produksi dan penjualan terpisah. Konversi satuan hanya dari aturan eksplisit. Pengakuan pendapatan/HPP/COGS memerlukan keputusan akuntansi pada fase berikutnya.

Validasi minimum: HDP hanya jika ayam hidup >0; berat rata-rata dapat dicocokkan dengan `kg × 1.000 ÷ butir` (peringatan, bukan koreksi otomatis); FCR hanya bila pakan dan massa telur pada periode sama tersedia; nilai negatif wajib berupa penyesuaian beralasan; selisih sortir/layak jual/rusak/susut/stok ditandai **Belum direkonsiliasi**; target dan ambang dikonfigurasi, tidak hard-code dari almanak.

## 11. Laporan dan KPI

Laporan memakai zona waktu farm dan tanggal lokal; mencantumkan filter, definisi, unit, pembaruan, kelengkapan dan drill-down.

- **Produksi:** total butir/kg, berat rata-rata, komposisi sortir, hari tercatat.
- **Performa layer:** HDP berbasis total telur ÷ total hen-days × 100%; FI/ADFI sesuai basis; massa telur; FCR; populasi awal/akhir; kematian/afkir bila dicatat.
- **Stok & penjualan:** saldo awal, produksi masuk, koreksi/transfer, penjualan per kategori/pelanggan, retur, kehilangan, saldo akhir, selisih.
- **Kas & pengeluaran:** total dibayar, direncanakan, dan menunggu verifikasi; rincian kategori, penerima, metode, cakupan (Grup Cikalong, lokasi, atau proyek), tanggal, dan referensi bukti. Pengguna dapat melihat transaksi Grup Cikalong tersendiri atau menyertakan transaksi lokasi/proyek yang dipilih. Pindah dana internal terpisah dari biaya eksternal. Rekap ini bukan laporan laba/rugi atau akuntansi.
- **Lokasi:** konstruksi ditampilkan terpisah dari operasi; bandingkan lokasi/periode yang sepadan.
- **Keuangan fase lanjut:** pendapatan, HPP/COGS, margin setelah kebijakan akuntansi dan arti HPP ditetapkan.

## 12. Kriteria penerimaan

1. Laporan harian Cikalong dapat dibuat dan angka dashboard ditelusuri ke sumber.
2. Sukanagara dapat berstatus pembangunan dan tidak masuk total operasi.
3. Admin dapat menambahkan tempat produksi baru lewat antarmuka, mengatur status dan detailnya, lalu lokasi itu muncul pada pemilih/filter lokasi tanpa perubahan kode.
4. Lokasi yang baru ditambahkan dengan status pembangunan/persiapan tidak dihitung sebagai produksi nol atau masuk agregat aktif.
5. Menutup atau menonaktifkan lokasi tidak menghapus catatan historis dan transaksi.
6. Produksi belum terjual menambah stok, bukan penjualan.
7. Penjualan mengurangi kategori/unit yang benar; retur membalik transaksi dan menyimpan audit.
8. Dashboard memisahkan produksi, layak jual, terjual, kehilangan/susut, stok akhir, serta selisih.
9. Grafik menyebut unit/pembanding, dapat difilter, dan memiliki tabel alternatif.
10. Laporan mingguan/bulanan bisa diekspor dan persentase diagregasi berbobot.
11. Form menjelaskan istilah dan tidak menebak arti TU/HH.
12. Koreksi menyimpan versi, pelaku, waktu, sebelum/sesudah dan alasan.
13. Kosong, nol, dan tidak berlaku dibedakan.
14. Pengguna dapat mencatat transfer/pengeluaran kepada tukang atau pemasok dengan cakupan **Grup Cikalong**, lokasi produksi, proyek pembangunan, atau grup umum, lalu melihat rekap mingguan/bulanan berdasarkan cakupan tersebut.
15. Transaksi direncanakan/belum dibayar dan yang menunggu verifikasi tidak dijumlahkan sebagai kas keluar dibayar; pindah dana internal tidak dihitung sebagai pengeluaran eksternal.
16. Kode atau metrik yang belum dipetakan dapat disimpan sebagai catatan mentah, terlihat dalam daftar peninjauan, dan tidak masuk hitungan terkait sebelum admin farm mengonfirmasinya.

## 13. Keputusan rancangan dan validasi bersama tim

Pemilik produk tidak perlu menguasai istilah peternakan untuk mulai membangun web. Karena data lapangan dan SOP dipegang tim Cianjur, rancangan menggunakan asumsi yang paling aman di bawah ini. Nilai yang belum jelas tetap bisa dicatat, tetapi tidak diam-diam dipakai untuk menghitung stok atau KPI. Konfirmasi istilah dilakukan bersama petugas/admin farm saat pilot, langsung dari contoh laporan yang mereka kenal.

### Logika awal yang dipakai aplikasi

1. **Tanggal:** input selalu meminta tanggal lengkap. Antarmuka memakai format Indonesia (hari/bulan/tahun) dan menampilkan nama bulan agar `2/10` tidak tertukar atau kehilangan tahun. Catatan lama yang hanya memuat `2/10` disimpan sebagai teks asli sampai tanggalnya dipastikan.
2. **Jumlah dan berat produksi:** format `jumlah/berat` sangat mungkin berarti butir/kg. Dua contoh cocok dengan jumlah butir × berat telur rata-rata, dengan selisih pembulatan kecil. Form mencatat butir dan kg di kolom terpisah, membandingkan berat hitung dengan berat laporan, serta menyimpan teks asli.
3. **Peti (PT):** `12/180kg` mendukung konversi awal 15 kg/peti di Cikalong. Jadikan aturan konversi yang dapat diatur per lokasi/kategori dan simpan berat kg yang dicatat sebagai angka acuan transaksi; jangan anggap konversi berlaku universal atau menebak notasi `12+1`.
4. **Hasil sortir:** simpan SU, JB, TC sebagai kategori sortir terpisah dari total telur mentah. JB adalah kategori ukuran besar; SU adalah sisa telur utuh menurut catatan lokal; TC adalah telur cair/rusak. Untuk awal, TC ditandai tidak layak jual secara default. Status layak jual SU/JB dan apakah kategori dihitung terpisah dapat diatur admin setelah mendapat SOP tim.
5. **Susut (SST):** catat sebagai penyesuaian kehilangan/selisih, bukan kategori telur yang diproduksi. Simpan tanda nilai, satuan, tahap, dan alasan; jangan membalik tanda negatif otomatis atau menghitung kehilangan dua kali bila sudah tercatat pada kategori TC.
6. **TU dan kode yang belum dikenal:** jangan menebak kepanjangannya. Simpan kode asli, nilai, dan unit sebagai **Belum dipetakan**. Data itu terlihat pada daftar peninjauan, tetapi tidak ikut total kategori, stok layak jual, atau KPI sampai dipetakan.
7. **HD:** dua contoh cocok dengan pembagi sekitar 3.574 ayam hidup (3.387 ÷ 94,77% dan 3.376 ÷ 94,46%). Gunakan ini sebagai pemeriksaan silang awal; data populasi aktual harian tetap sumber kebenaran untuk HDP.
8. **FI dan FCR:** kedua contoh saling cocok jika FI adalah g/ekor/hari dan FCR adalah kg pakan/kg massa telur: total pakan turunannya sekitar 400 kg/hari. Jadikan basis tersebut default konfigurasi awal Cikalong, tampilkan rumus/unit, dan izinkan admin mengubahnya. Angka laporan karyawan diberi label **Dilaporkan**, hasil hitung diberi label **Dihitung**; perbedaan kecil karena pembulatan ditampilkan sebagai toleransi, bukan koreksi.
9. **HH 54,72:** simpan sebagai metrik lokal belum terpetakan beserta teks dan unit mentah. Jangan masukkan ke grafik KPI sampai nama, basis, dan unitnya diketahui.
10. **Transfer/pengeluaran:** uang dibayar kepada tukang atau pemasok dicatat sebagai kas keluar dengan tanggal, jumlah rupiah, penerima, keterangan, metode, status, dan bukti bila tersedia. Cakupan **Grup Cikalong** berbeda dari farm/lokasi Cikalong; transaksi grup dapat tetap di tingkat grup atau dialokasikan ke lokasi/proyek tanpa menggandakan nominal. Pindah dana antar rekening sendiri bukan pengeluaran.

### Cara meminta konfirmasi kepada tim Cianjur

Web menyediakan **Daftar istilah dan data yang perlu ditinjau** untuk admin farm. Admin melihat kode dan contoh catatan asli, lalu memilih/mengisi arti, satuan, dampak pada stok (menambah, mengurangi, atau tidak berdampak), status layak jual, serta rumus/basis bila itu KPI. Perubahan berlaku mulai tanggal yang dipilih dan memiliki nama pengonfirmasi serta riwayat perubahan. Pertanyaan bisa dibagikan sebagai lembar ringkas saat komunikasi rutin; pemilik web tidak perlu menjawabnya sendiri.

Data harian tidak terhenti bila ada kode yang belum diketahui: petugas dapat menyimpan catatan mentah dan menyelesaikan laporan. Sistem mengecualikan hanya nilai yang belum terpetakan dari perhitungan terkait, menandai dampaknya dengan jelas, dan meminta admin lokal meninjaunya. Setelah pemetaan disetujui, laporan berikutnya memakai definisi itu; data lama tidak diubah diam-diam dan perlu tindakan eksplisit bila akan dipetakan ulang.

### Hal yang dipastikan saat pilot, bukan prasyarat mulai membangun

- Minta tim mengesahkan apakah 15 kg/peti berlaku umum di Cikalong dan menjelaskan notasi `Pt. 12+1/180kg`, kode `TU`, dan `HH 54.72` dengan satu atau dua laporan nyata.
- Minta admin farm menetapkan batas grading JB, arti lokal SU, perlakuan TC, dan bagaimana SST dicatat agar telur rusak/susut tidak dihitung ganda.
- Cocokkan HD/HDP, FI, dan FCR pada satu hari yang sama memakai jumlah ayam hidup, butir, kg telur, dan pakan yang mereka catat.
- Amati satu transaksi penjualan dan satu transfer Grup Cikalong (misalnya pembayaran tukang/pembelian alat) untuk memastikan kolom bukti, status, dan alokasi yang paling cocok.
- Catat daftar kandang/flock, pengguna pencatat/penyetuju, dan tanggal operasi Sukanagara dari penanggung jawab lokasi saat onboarding.

Semua hasil pilot menjadi **konfigurasi operasional farm**, bukan perubahan kode. Dengan begitu istilah bisa diperbaiki seiring pengetahuan tim bertambah, sementara data lama tetap dapat diaudit.

## 14. Tahapan

1. **Persiapan data:** gunakan contoh yang tersedia untuk membuat kamus awal dan aturan aman; tandai kode yang belum pasti. Tidak perlu menunggu pemilik produk memahami atau menjawab istilah teknis.
2. **MVP:** master lokasi/flock, input harian, stok/penjualan, kas/pengeluaran, dashboard, laporan, audit, serta kamus dan daftar peninjauan istilah.
3. **Pilot Cikalong:** jalankan pencatatan paralel; admin farm mengonfirmasi istilah, saldo, konversi peti, dan laporan dari contoh nyata. Terapkan hasilnya sebagai konfigurasi lokasi.
4. **Perluasan:** aktifkan Sukanagara setelah siap operasi; admin dapat menambah lokasi berikutnya kapan saja melalui fitur pengelolaan tempat produksi.
5. **Fase usaha:** pertimbangkan biaya, HPP/COGS, piutang, stok pakan, integrasi mesin setelah operasi stabil.

---

**Catatan sumber:** Almanak adalah referensi istilah umum, bukan SOP penentu praktik farm. Simpan definisi lokal bersama unit, rumus, dan tanggal berlaku.
