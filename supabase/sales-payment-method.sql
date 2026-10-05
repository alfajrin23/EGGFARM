-- Tambahkan metode pembayaran terstruktur untuk penjualan pada database yang sudah ada.
alter table public.sales
  add column if not exists payment_method text not null default 'Belum dicatat'
  check (payment_method in ('Tunai','Transfer bank','E-wallet','Belum dicatat'));
