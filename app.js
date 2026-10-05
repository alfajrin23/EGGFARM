const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];
const today = () => new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' });
const dateLabel = (date, options = { day: 'numeric', month: 'short', year: 'numeric' }) => new Date(`${date}T12:00:00`).toLocaleDateString('id-ID', options);
const num = (value, digits = 0) => Number(value || 0).toLocaleString('id-ID', { maximumFractionDigits: digits, minimumFractionDigits: digits });
const maybeNum = (value, digits = 0) => value === null || value === undefined || value === '' ? 'Belum dicatat' : num(value, digits);
const rupiah = value => `Rp ${num(value)}`;
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const shiftDate = (days) => { const d = new Date(`${today()}T12:00:00`); d.setDate(d.getDate() + days); return d.toLocaleDateString('en-CA'); };
const defaultState = () => ({
  farms: [
    { id: 'cikalong', code: 'CKL', name: 'Cikalong', region: 'Cianjur, Jawa Barat', status: 'Beroperasi', timezone: 'Asia/Jakarta', start_date: '', responsible: 'Admin Farm' },
    { id: 'sukanagara', code: 'SKN', name: 'Sukanagara', region: 'Cianjur, Jawa Barat', status: 'Pembangunan', timezone: 'Asia/Jakarta', start_date: '', responsible: 'Admin Farm' }
  ],
  reports: [
    { id: 'demo-1', farm_id: 'cikalong', date: shiftDate(-6), eggs: 3310, kg: 188.6, su: 8.4, jb: 2.1, tc: 1.2, sst: 0, birds: 3574, feed: 398, note: '', status: 'Disetujui' },
    { id: 'demo-2', farm_id: 'cikalong', date: shiftDate(-5), eggs: 3368, kg: 191.8, su: 8.8, jb: 2.3, tc: 1.4, sst: 0.2, birds: 3574, feed: 399, note: '', status: 'Disetujui' },
    { id: 'demo-3', farm_id: 'cikalong', date: shiftDate(-4), eggs: 3287, kg: 187.2, su: 8.2, jb: 2.6, tc: 1.1, sst: 0, birds: 3571, feed: 397, note: '', status: 'Disetujui' },
    { id: 'demo-4', farm_id: 'cikalong', date: shiftDate(-3), eggs: 3394, kg: 193.2, su: 9.1, jb: 2.4, tc: 1.5, sst: 0.1, birds: 3571, feed: 400, note: '', status: 'Disetujui' },
    { id: 'demo-5', farm_id: 'cikalong', date: shiftDate(-2), eggs: 3346, kg: 190.8, su: 8.7, jb: 2.8, tc: 1.3, sst: 0, birds: 3568, feed: 399, note: '', status: 'Disetujui' },
    { id: 'demo-6', farm_id: 'cikalong', date: shiftDate(-1), eggs: 3376, kg: 192.07, su: 5.63, jb: 2.78, tc: 2.34, sst: 1.32, birds: 3574, feed: 400, note: 'Angka contoh untuk pratinjau; perlu dicocokkan dengan catatan farm.', status: 'Dikirim' },
    { id: 'demo-7', farm_id: 'cikalong', date: today(), eggs: 3387, kg: 193.78, su: 9.47, jb: 1.59, tc: 2.1, sst: 0.6, birds: 3574, feed: 400, note: 'Angka contoh untuk pratinjau; perlu dicocokkan dengan catatan farm.', status: 'Dikirim' }
  ],
  sales: [{ id: 'sale-demo', farm_id: 'cikalong', date: today(), customer: 'Pelanggan umum', category: 'SU', quantity: 42, unit: 'kg', amount: 0, payment_method: 'Belum dicatat', status: 'Dibayar', note: 'Contoh demo' }],
  cash: [
    { id: 'cash-demo-1', date: shiftDate(-2), amount: 1250000, recipient: 'Toko pakan Cikalong', purpose: 'Pembelian perlengkapan operasional', category: 'Operasional', method: 'Transfer bank', status: 'Dibayar', scope: 'Lokasi produksi', farm_id: 'cikalong', scope_name: 'Cikalong', reference: '' },
    { id: 'cash-demo-2', date: shiftDate(-1), amount: 2500000, recipient: 'Tim pembangunan', purpose: 'Upah pekerjaan kandang', category: 'Upah/tenaga kerja', method: 'Transfer bank', status: 'Perlu verifikasi', scope: 'Proyek pembangunan', farm_id: 'sukanagara', scope_name: 'Sukanagara', reference: '' }
  ],
  stockSnapshots: [],
  terms: [
    { term: 'HDP', common: 'Produksi telur harian', definition: 'Hen-Day Production: jumlah telur hari ini ÷ ayam hidup hari ini × 100%.', unit: '%', rule: 'Hitung dari total telur dan total hen-days; basis populasi wajib tersedia.' },
    { term: 'HDEP', common: 'Produksi harian per ayam', definition: 'Hen-Housed Egg Production; almanak menyebut umumnya setara HDP.', unit: '%', rule: 'Konfirmasi basis dengan SOP farm.' },
    { term: 'FI / ADFI', common: 'Konsumsi pakan', definition: 'Feed Intake / Average Daily Feed Intake.', unit: 'g/ekor/hari', rule: 'Pastikan apakah angka untuk kelompok atau per ekor.' },
    { term: 'FCR', common: 'Rasio pakan terhadap massa telur', definition: 'Feed Conversion Ratio untuk telur.', unit: 'kg pakan/kg massa telur', rule: 'Gunakan pakan dan massa telur pada periode yang sama.' },
    { term: 'EW / AEW', common: 'Berat telur rata-rata', definition: 'Egg Weight / Average Egg Weight.', unit: 'g/butir', rule: 'Simpan cara pengukuran dan ukuran sampel.' },
    { term: 'SU', common: 'Sisa utuh', definition: 'Kode kategori telur utuh menurut istilah lokal.', unit: 'kg atau butir', rule: 'Layak jual dan dampak stok mengikuti SOP farm.' },
    { term: 'JB', common: 'Jumbo', definition: 'Kategori ukuran besar menurut grading farm.', unit: 'kg atau butir', rule: 'Batas grading dapat berbeda antar farm/pembeli.' },
    { term: 'TC', common: 'Telur cair', definition: 'Telur rusak hingga isi keluar atau merembes.', unit: 'kg atau butir', rule: 'Nonnormal secara default; ikuti SOP farm.' },
    { term: 'SST', common: 'Susut', definition: 'Selisih atau kehilangan di tahap tertentu.', unit: 'sesuai catatan', rule: 'Simpan tanda, tahap, alasan. Jangan hitung kehilangan dua kali.' },
    { term: 'TU', common: 'Belum dipetakan', definition: 'Arti kode belum dikonfirmasi admin farm.', unit: 'mentah', rule: 'Tidak masuk hitungan sebelum definisi disahkan.' },
    { term: 'HPP', common: 'Perlu konteks', definition: 'Hen-Housed Production atau Harga Pokok Produksi.', unit: 'tergantung konteks', rule: 'Tampilkan nama dan unit lengkap; jangan gunakan singkatan sendiri.' },
    { term: 'Peti / PT', common: 'Satuan kemasan', definition: 'Kapasitas peti dapat diatur per farm dan kategori.', unit: 'peti', rule: 'Jangan menganggap kapasitas selalu 15 kg.' }
  ]
});

let state;
let view = location.hash.slice(1) || 'ringkasan';
let selectedFarm = 'semua';
let period = '7hari';
let supabase = null;
let backend = 'local';
let loading = false;
let currentUser = null;
let memberships = [];
let farmUsers = [];
let modalReturnFocus = null;
let authFlowType = new URLSearchParams(location.hash.slice(1)).get('type') || new URLSearchParams(location.search).get('type') || '';

const adminRoles = ['admin_farm','manajer','admin_sistem'];
function roleForFarm(farmId = selectedFarm) {
  if (backend === 'local') return 'admin_sistem';
  return memberships.find(m => m.farm_id === farmId)?.role || null;
}
function roleForDisplay() {
  return selectedFarm === 'semua'
    ? memberships.find(m => adminRoles.includes(m.role))?.role || null
    : roleForFarm();
}
function canManageFarm(farmId = selectedFarm) { return adminRoles.includes(roleForFarm(farmId)); }
function canViewAllFarms() { return backend === 'local' || memberships.some(m => adminRoles.includes(m.role)); }
function roleDisplay(role) { return role==='petugas'?'Staff':role==='admin_farm'?'Admin farm':role==='manajer'?'Manajer':role==='admin_sistem'?'Admin sistem':'Tanpa akses'; }

function loadLocal() {
  try { const saved = localStorage.getItem('ruangfarm-v1'); if (saved) return { ...defaultState(), ...JSON.parse(saved) }; }
  catch (e) { console.warn('Data lokal tidak dapat dibaca', e); }
  return defaultState();
}
function persist() { localStorage.setItem('ruangfarm-v1', JSON.stringify(state)); }
function farmById(id) { return state.farms.find(f => f.id === id); }
function defaultFarmId() { return state.farms.find(f => f.code === 'CKL')?.id || state.farms.find(f => f.status === 'Beroperasi')?.id || state.farms[0]?.id; }
function periodDays() { return period === 'hariini' ? 1 : period === '30hari' ? 30 : 7; }
function filteredReports(farmId = selectedFarm) {
  const cutoff = shiftDate(-(periodDays() - 1));
  return state.reports.filter(r => (farmId === 'semua' ? farmById(r.farm_id)?.status === 'Beroperasi' : r.farm_id === farmId) && r.date >= cutoff && r.date <= today());
}
function filteredSales(farmId = selectedFarm) {
  const cutoff = shiftDate(-(periodDays() - 1));
  return state.sales.filter(s => (farmId === 'semua' || s.farm_id === farmId) && s.date >= cutoff && s.date <= today());
}
function paidSalesTotal(sales) {
  return sales.filter(s => (s.status || 'Dibayar') === 'Dibayar').reduce((total, sale) => total + Number(sale.amount || 0), 0);
}
function farmSelect(value = selectedFarm, includeAll = true) {
  const showAll = includeAll && canViewAllFarms();
  return `<div class="select-wrap"><select class="select-control" id="farmFilter">${showAll ? '<option value="semua">Semua lokasi aktif</option>' : ''}${state.farms.map(f => `<option value="${esc(f.id)}" ${value === f.id ? 'selected' : ''}>${esc(f.name)}${f.status !== 'Beroperasi' ? ` · ${esc(f.status)}` : ''}</option>`).join('')}</select></div>`;
}
function heading(kicker, title, subtitle, action = '') {
  return `<div class="page-heading"><div><div class="eyebrow">${kicker}</div><h1>${title}</h1><p>${subtitle}</p></div><div class="heading-actions">${action}</div></div>`;
}
function statusClass(value) { return value === 'Perlu verifikasi' || value === 'Draf' ? 'warning' : value === 'Direncanakan' ? 'neutral' : value === 'Ditolak' ? 'red' : ''; }
function statusBadge(value) { return `<span class="status ${statusClass(value)}">${esc(value)}</span>`; }
function recentReportRows(rows) {
  return rows.slice().sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6).map(r => `<tr><td><b>${dateLabel(r.date)}</b></td><td>${num(r.eggs)} butir</td><td>${num(r.kg, 2)} kg</td><td>${num(r.birds)} ekor</td><td>${statusBadge(r.status || 'Dikirim')}</td></tr>`).join('');
}
function renderChart(rows) {
  if (!rows.length) return '<div class="chart-empty">Belum ada data produksi pada periode ini.</div>';
  const days = Array.from({ length: Math.min(periodDays(), 7) }, (_, i) => shiftDate(-(Math.min(periodDays(), 7) - 1 - i)));
  const values = days.map(d => rows.filter(r => r.date === d).reduce((sum, r) => sum + Number(r.eggs || 0), 0));
  if (values.every(v => !v)) return '<div class="chart-empty">Belum ada data produksi pada periode ini.</div>';
  const max = Math.ceil(Math.max(...values) / 500) * 500 || 500, min = Math.max(0, max - 2500);
  const x0 = 42, y0 = 18, w = 520, h = 143;
  const points = values.map((v, i) => [x0 + (days.length === 1 ? w / 2 : (w * i / (days.length - 1))), y0 + h - ((v - min) / (max - min || 1)) * h]);
  const path = points.map((p, i) => `${i ? 'L' : 'M'}${p[0]},${p[1]}`).join(' ');
  const area = `${path} L${points.at(-1)[0]},${y0 + h} L${points[0][0]},${y0 + h} Z`;
  const labels = days.map((d, i) => `<text x="${points[i][0]}" y="186" text-anchor="middle">${new Date(`${d}T12:00:00`).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</text>`).join('');
  const circles = points.map((p, i) => `<circle class="point" cx="${p[0]}" cy="${p[1]}" r="3.5"><title>${dateLabel(days[i])}: ${num(values[i])} butir</title></circle>`).join('');
  return `<svg class="chart" viewBox="0 0 590 200" role="img" aria-label="Tren telur dihasilkan dalam butir per hari"><defs><linearGradient id="areaGradient" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stop-color="#a9cca1" stop-opacity=".42"/><stop offset="100%" stop-color="#a9cca1" stop-opacity="0"/></linearGradient></defs>${[0,1,2,3].map(i => `<line class="grid" x1="${x0}" x2="570" y1="${y0 + i * h / 3}" y2="${y0 + i * h / 3}"/><text x="34" y="${y0 + i * h / 3 + 3}" text-anchor="end">${num(Math.max(0, max - i * (max - min) / 3))}</text>`).join('')}<path class="area" d="${area}"/><path class="line" d="${path}"/>${circles}${labels}</svg>`;
}
function latestStockForFarm(farmId) {
  const rows=state.stockSnapshots.filter(r=>r.farm_id===farmId).sort((a,b)=>b.snapshot_date.localeCompare(a.snapshot_date));
  if(!rows.length)return [];
  return rows.filter(r=>r.snapshot_date===rows[0].snapshot_date);
}
function stockLabel(category) { return category==='TU'?'TU · belum dipetakan':category==='PT'?'Peti':'Telur '+category; }
function stockSnapshotPanel() {
  const action=`<button class="btn btn-sm btn-soft" data-action="new-stock">＋ Catat saldo</button>`;
  if(selectedFarm==='semua') {
    const rows=state.farms.filter(f=>f.status==='Beroperasi').flatMap(f=>latestStockForFarm(f.id).map(r=>({...r,farm:f})));
    return `<article class="panel stock-panel"><div class="panel-heading"><div><h3>Saldo stok terakhir</h3><p>Snapshot yang dilaporkan petugas; peti, kg, dan butir tidak dijumlahkan.</p></div>${action}</div>${rows.length?`<div class="table-wrap"><table class="data-table"><thead><tr><th>Lokasi</th><th>Tanggal</th><th>Kategori</th><th>Saldo</th></tr></thead><tbody>${rows.map(r=>`<tr><td><b>${esc(r.farm.name)}</b></td><td>${dateLabel(r.snapshot_date)}</td><td>${esc(stockLabel(r.category))}</td><td><b>${num(r.quantity,2)} ${esc(r.unit)}</b></td></tr>`).join('')}</tbody></table></div>`:'<div class="empty-state"><strong>Belum ada saldo stok yang dicatat.</strong>Catat saldo per kategori untuk melihat sisa peti, kg, atau butir di sini.</div>'}</article>`;
  }
  const rows=latestStockForFarm(selectedFarm);
  const date=rows[0]?.snapshot_date;
    return `<article class="panel stock-panel"><div class="panel-heading"><div><h3>Saldo stok terakhir</h3><p>${date?`Snapshot per ${dateLabel(date)} · jumlah menurut kategori dan satuan`:'Catatan saldo stok yang dilaporkan petugas.'}</p></div>${action}</div>${rows.length?`<div class="stock-grid">${rows.map(r=>`<div class="stock-balance"><span>${esc(stockLabel(r.category))}</span><b>${num(r.quantity,Number.isInteger(Number(r.quantity))?0:2)} <small>${esc(r.unit)}</small></b></div>`).join('')}</div><div class="stock-caption">Saldo snapshot yang dicatat; tidak dihitung dari produksi dikurangi penjualan. Konversi peti hanya berlaku jika aturan farm dikonfigurasi.</div>`:`<div class="empty-state"><strong>Belum ada saldo stok yang dicatat.</strong><span>Contoh dari catatan Anda: 40 peti · TU 7,4 kg · TC 7,98 kg · JB 4,6 kg. Nilai tersebut contoh format dan belum menjadi saldo tersimpan.</span></div>`}</article>`;
}
function renderDashboard() {
  const reports = filteredReports();
  const sales = filteredSales();
  const eggs = reports.reduce((s, r) => s + Number(r.eggs || 0), 0);
  const kg = reports.reduce((s, r) => s + Number(r.kg || 0), 0);
  const good = reports.reduce((s, r) => s + Number(r.su || 0) + Number(r.jb || 0), 0);
  const sold = sales.reduce((s, r) => s + (r.unit === 'kg' ? Number(r.quantity || 0) : Number(r.quantity || 0) * .058), 0);
  const salesRevenue = paidSalesTotal(sales);
  const farm = selectedFarm === 'semua' ? null : farmById(selectedFarm);
  const action = `<button class="btn btn-primary" data-action="new-report">＋ Catat produksi</button><button class="btn" data-go="laporan">Lihat laporan</button>`;
  return `${heading('OPERASI FARM', farm ? `Selamat pagi, tim ${esc(farm.name)}.` : 'Ringkasan semua lokasi aktif.', 'Pantau catatan produksi, pergerakan telur, dan hal yang perlu ditinjau.', action)}
    <div class="filters"><span class="filter-label">Tampilkan data</span>${farmSelect()}<div class="select-wrap"><select class="select-control" id="periodFilter"><option value="hariini" ${period === 'hariini' ? 'selected' : ''}>Hari ini</option><option value="7hari" ${period === '7hari' ? 'selected' : ''}>7 hari terakhir</option><option value="30hari" ${period === '30hari' ? 'selected' : ''}>30 hari terakhir</option></select></div><span class="connection-indicator ${backend === 'supabase' ? 'connected' : 'offline'}"><i></i>${backend === 'supabase' ? 'Supabase tersambung' : 'Mode demo lokal'}</span></div>
    <div class="overview-grid">
      <article class="metric-card"><div class="metric-top"><span class="metric-icon">◒</span>Telur dihasilkan</div><div class="metric-value">${num(eggs)} <small>butir</small></div><div class="metric-foot">${num(kg, 2)} kg · ${reports.length} hari tercatat</div></article>
      <article class="metric-card"><div class="metric-top"><span class="metric-icon">✓</span>Hasil sortir utuh</div><div class="metric-value">${num(good, 2)} <small>kg</small></div><div class="metric-foot">SU + JB · perlu konfirmasi SOP</div></article>
      <article class="metric-card"><div class="metric-top"><span class="metric-icon">↗</span>Terjual</div><div class="metric-value">${num(sold, 2)} <small>kg</small></div><div class="metric-foot">${sales.length} transaksi · stok dihitung terpisah</div></article>
      <article class="metric-card"><div class="metric-top"><span class="metric-icon">Rp</span>Nilai penjualan</div><div class="metric-value metric-currency">${rupiah(salesRevenue)}</div><div class="metric-foot">Transaksi dibayar pada periode ini</div></article>
      <article class="metric-card"><div class="metric-top"><span class="metric-icon">▣</span>Saldo stok</div><div class="metric-value">${latestStockForFarm(selectedFarm==='semua'?state.farms.find(f=>f.status==='Beroperasi')?.id:selectedFarm).length?'Tercatat':'Belum'}</div><div class="metric-foot">Lihat snapshot menurut kategori dan satuan di bawah</div></article>
    </div>
    <div class="section-kicker"><h2>Stok telur saat ini</h2><span>Saldo catatan dipisah dari produksi dan penjualan</span></div>${stockSnapshotPanel()}
    <div class="section-kicker"><h2>Ringkasan periode</h2><span>${dateLabel(shiftDate(-(periodDays() - 1)))} — ${dateLabel(today())}</span></div>
    <div class="overview-lower"><article class="panel"><div class="panel-heading"><div><h3>Tren telur dihasilkan</h3><p>Produksi harian · butir</p></div><div class="chart-legend"><span><i class="legend-dot"></i>Telur dihasilkan</span></div></div>${renderChart(reports)}</article>
      <article class="panel" style="display:flex;flex-direction:column"><div class="panel-heading"><div><h3>Ke mana telur bergerak</h3><p>${period === 'hariini' ? 'Hari ini' : `${periodDays()} hari terakhir`}</p></div><span class="pill">${farm ? esc(farm.name) : 'Semua aktif'}</span></div>
      <div class="movement"><div><div class="move-row"><span class="move-label"><i></i>Produksi total</span><b>${num(kg, 2)} kg</b></div><div class="move-bar"><span style="width:100%"></span></div></div><div><div class="move-row"><span class="move-label"><i></i>Sortir utuh (SU + JB)</span><b>${num(good, 2)} kg</b></div><div class="move-bar"><span style="width:${kg ? Math.min(100, good / kg * 100) : 0}%"></span></div></div><div><div class="move-row"><span class="move-label"><i></i>Terjual</span><b>${num(sold, 2)} kg</b></div><div class="move-bar"><span style="width:${kg ? Math.min(100, sold / kg * 100) : 0}%;background:#d9a366"></span></div></div><div><div class="move-row"><span class="move-label"><i></i>TC / rusak tercatat</span><b>${num(reports.reduce((s,r)=>s+Number(r.tc||0),0),2)} kg</b></div><div class="move-bar"><span style="width:${kg ? Math.min(100, reports.reduce((s,r)=>s+Number(r.tc||0),0)/kg*100) : 0}%;background:#d18475"></span></div></div></div>
      <div class="reconcile"><span>Selisih alur produksi ke sortir belum direkonsiliasi</span><b>Perlu ditinjau</b></div></article></div>
    <div class="bottom-grid"><article class="panel"><div class="panel-heading"><div><h3>Catatan produksi terbaru</h3><p>Telusuri catatan harian dan status persetujuan</p></div><button class="btn btn-sm" data-go="produksi">Semua catatan</button></div><div class="table-wrap"><table class="data-table"><thead><tr><th>Tanggal</th><th>Produksi</th><th>Berat</th><th>Populasi</th><th>Status</th></tr></thead><tbody>${recentReportRows(reports) || '<tr><td colspan="5" class="empty-state">Belum ada catatan pada periode ini.</td></tr>'}</tbody></table></div></article>
    <article class="panel"><div class="panel-heading"><div><h3>Perlu ditinjau</h3><p>Catatan yang membutuhkan perhatian</p></div><span class="status warning">${state.reports.filter(r=>r.status==='Dikirim').length} item</span></div><div class="review-list"><div class="review-item"><span class="review-icon">!</span><div><b>Periksa catatan yang belum disetujui</b><p>Pastikan data harian sudah diperiksa admin farm.</p></div><button data-go="produksi">Buka</button></div><div class="review-item"><span class="review-icon">⌕</span><div><b>Kode lokal belum dipetakan</b><p>TU dan HH menunggu konfirmasi SOP.</p></div><button data-go="kamus">Tinjau</button></div><div class="review-item"><span class="review-icon">↔</span><div><b>Saldo awal stok belum dimasukkan</b><p>Angka stok saat ini adalah perkiraan dari data demo.</p></div><button data-go="stok">Buka stok</button></div></div></article></div>`;
}

function renderProduction() {
  const rows = state.reports.filter(r => selectedFarm === 'semua' ? farmById(r.farm_id)?.status === 'Beroperasi' : r.farm_id === selectedFarm).sort((a,b)=>b.date.localeCompare(a.date));
  return `${heading('CATATAN HARIAN','Produksi & sortir','Simpan jumlah butir, berat, hasil sortir, pakan, dan populasi dalam satu laporan.', '<button class="btn btn-primary" data-action="new-report">＋ Catat produksi</button>')}<div class="filters">${farmSelect()}<span class="muted-note">Kosong berbeda dari nol · data demo ditandai dalam catatan</span></div><article class="panel"><div class="panel-heading"><div><h3>Riwayat catatan produksi</h3><p>${rows.length} laporan tersimpan · urut terbaru</p></div><button class="btn btn-sm" data-action="export-production">Ekspor CSV</button></div><div class="table-wrap"><table class="data-table"><thead><tr><th>Tanggal</th><th>Lokasi</th><th>Telur</th><th>Berat</th><th>SU</th><th>JB</th><th>TC</th><th>Susut</th><th>HDP</th><th>Status</th></tr></thead><tbody>${rows.map(r=>`<tr><td><b>${dateLabel(r.date)}</b></td><td>${esc(farmById(r.farm_id)?.name || '—')}</td><td>${maybeNum(r.eggs)} butir</td><td>${maybeNum(r.kg,2)} kg</td><td>${maybeNum(r.su,2)} kg</td><td>${maybeNum(r.jb,2)} kg</td><td>${maybeNum(r.tc,2)} kg</td><td>${maybeNum(r.sst,2)} kg</td><td>${r.birds ? `${num(r.eggs/r.birds*100,2)}%` : 'Belum dicatat'}</td><td>${statusBadge(r.status||'Dikirim')}</td></tr>`).join('') || '<tr><td colspan="10" class="empty-state">Belum ada catatan produksi.</td></tr>'}</tbody></table></div></article><div class="page-grid" style="margin-top:13px"><article class="panel"><div class="panel-heading"><div><h3>Perhitungan yang tersedia</h3><p>Ditampilkan saat basis data lengkap</p></div></div><div class="setting-list"><div class="setting-row"><span>HDP — telur ÷ ayam hidup × 100%</span><b>${rows.at(0)?.birds ? `${num(rows.at(0).eggs / rows.at(0).birds * 100,2)}%` : 'Belum dicatat'}</b></div><div class="setting-row"><span>Berat telur rata-rata — kg × 1.000 ÷ butir</span><b>${rows.at(0)?.eggs ? `${num(rows.at(0).kg*1000/rows.at(0).eggs,2)} g/butir` : 'Belum dicatat'}</b></div><div class="setting-row"><span>FCR — kg pakan ÷ kg massa telur</span><b>${rows.at(0)?.kg && rows.at(0)?.feed ? num(rows.at(0).feed/rows.at(0).kg,2) : 'Belum dicatat'}</b></div></div><p class="muted-note">Angka dihitung dari catatan tersedia, bukan nilai laporan petugas.</p></article><article class="panel"><div class="panel-heading"><div><h3>Catatan mentah belum dipetakan</h3><p>Jangan ikutkan ke KPI sebelum dikonfirmasi.</p></div></div><div class="review-list"><div class="review-item"><span class="review-icon">?</span><div><b>TU · arti dan satuan belum diketahui</b><p>Simpan teks asli, minta konfirmasi admin lokasi.</p></div></div><div class="review-item"><span class="review-icon">?</span><div><b>HH · basis dan unit belum diketahui</b><p>Tidak ditampilkan sebagai KPI.</p></div></div></div></article></div>`;
}

function renderStock() {
  const sales = state.sales.filter(s => selectedFarm === 'semua' || s.farm_id === selectedFarm).sort((a,b)=>b.date.localeCompare(a.date));
  return `${heading('PERGERAKAN TELUR','Stok & penjualan','Saldo stok adalah catatan keadaan fisik pada tanggal tertentu; produksi dan penjualan tetap transaksi terpisah.', '<button class="btn btn-primary" data-action="new-stock">＋ Catat saldo stok</button><button class="btn" data-action="new-sale">Catat penjualan</button>')}<div class="filters">${farmSelect()}<span class="muted-note">Peti, kg, dan butir ditampilkan terpisah. Tidak ada konversi otomatis.</span></div>${stockSnapshotPanel()}<div class="page-grid" style="margin-top:13px"><article class="panel"><div class="panel-heading"><div><h3>Memahami saldo stok</h3><p>Contoh dari catatan lapangan yang Anda kirim</p></div></div><div class="stock-example"><b>Stok 40 pt</b><span>TU 7,4 kg</span><span>TC 7,98 kg</span><span>JB 4,6 kg</span></div><p class="muted-note">Setiap kategori dan satuan punya saldo sendiri. TU tetap berlabel belum dipetakan; PT/peti tidak dikonversi ke kg tanpa aturan lokasi yang disahkan.</p><p class="muted-note">Untuk rekonsiliasi penuh: saldo awal + produksi masuk + retur + penyesuaian masuk − penjualan − kehilangan ± koreksi.</p></article><article class="panel"><div class="panel-heading"><div><h3>Riwayat penjualan</h3><p>Penjualan tidak otomatis mengubah snapshot stok yang sudah dicatat.</p></div><button class="btn btn-sm" data-action="export-sales">Ekspor CSV</button></div><div class="table-wrap"><table class="data-table"><thead><tr><th>Tanggal</th><th>Lokasi</th><th>Pelanggan</th><th>Kategori</th><th>Jumlah</th><th>Nilai</th><th>Metode bayar</th><th>Status</th></tr></thead><tbody>${sales.map(s=>`<tr><td><b>${dateLabel(s.date)}</b></td><td>${esc(farmById(s.farm_id)?.name||'—')}</td><td>${esc(s.customer || '—')}</td><td>${esc(s.category)}</td><td>${num(s.quantity,2)} ${esc(s.unit)}</td><td>${Number(s.amount)?rupiah(s.amount):'Belum dicatat'}</td><td>${esc(s.payment_method||'Belum dicatat')}</td><td>${statusBadge(s.status || 'Dibayar')}</td></tr>`).join('') || '<tr><td colspan="8" class="empty-state">Belum ada penjualan.</td></tr>'}</tbody></table></div></article></div>`;
}

function renderCash() {
  const rows = state.cash.filter(c => selectedFarm === 'semua' || c.scope === 'Grup Cikalong' || c.scope === 'Umum/Grup lain' || c.farm_id === selectedFarm).sort((a,b)=>b.date.localeCompare(a.date));
  const isInternal=c=>c.scope==='Pindah dana internal'||c.method==='Pindah dana internal';
  const paid=rows.filter(c=>c.status==='Dibayar'&&!isInternal(c)).reduce((sum,c)=>sum+Number(c.amount||0),0), planned=rows.filter(c=>c.status==='Direncanakan'&&!isInternal(c)).reduce((sum,c)=>sum+Number(c.amount||0),0), pending=rows.filter(c=>c.status==='Perlu verifikasi'&&!isInternal(c)).reduce((sum,c)=>sum+Number(c.amount||0),0), internal=rows.filter(isInternal).reduce((sum,c)=>sum+Number(c.amount||0),0);
  return `${heading('KAS KELUAR','Kas & pengeluaran','Catat pembayaran eksternal beserta status dan cakupan. Pindah dana internal bukan biaya.', '<button class="btn btn-primary" data-action="new-cash">＋ Tambah transaksi</button>')}<div class="filters">${farmSelect()}<span class="muted-note">Dibayar, direncanakan, dan perlu verifikasi ditampilkan terpisah.</span></div><div class="overview-grid"><article class="metric-card"><div class="metric-top"><span class="metric-icon">✓</span>Kas keluar dibayar</div><div class="cash-total">${rupiah(paid)}</div><div class="metric-foot">Tidak termasuk direncanakan / verifikasi</div></article><article class="metric-card"><div class="metric-top"><span class="metric-icon">◷</span>Direncanakan</div><div class="cash-total">${rupiah(planned)}</div><div class="metric-foot">Belum dibayar</div></article><article class="metric-card"><div class="metric-top"><span class="metric-icon">!</span>Perlu verifikasi</div><div class="cash-total">${rupiah(pending)}</div><div class="metric-foot">Belum dijumlahkan sebagai kas keluar</div></article><article class="metric-card"><div class="metric-top"><span class="metric-icon">↔</span>Pindah dana internal</div><div class="cash-total">${rupiah(internal)}</div><div class="metric-foot">Terpisah dari pengeluaran eksternal</div></article></div><article class="panel" style="margin-top:13px"><div class="panel-heading"><div><h3>Riwayat transaksi</h3><p>Rekap kas keluar sederhana, bukan laporan laba/rugi.</p></div><button class="btn btn-sm" data-action="export-cash">Ekspor CSV</button></div><div class="table-wrap"><table class="data-table"><thead><tr><th>Tanggal</th><th>Penerima / tujuan</th><th>Kategori</th><th>Cakupan</th><th>Metode</th><th>Jumlah</th><th>Status</th></tr></thead><tbody>${rows.map(c=>`<tr><td><b>${dateLabel(c.date)}</b></td><td>${esc(c.recipient)}<br><span class="muted-note">${esc(c.purpose)}</span></td><td>${esc(c.category)}</td><td>${esc(c.scope)}${c.scope_name?` · ${esc(c.scope_name)}`:''}</td><td>${esc(c.method)}</td><td>${rupiah(c.amount)}</td><td>${statusBadge(c.status)}</td></tr>`).join('')||'<tr><td colspan="7" class="empty-state">Belum ada transaksi.</td></tr>'}</tbody></table></div></article>`;
}

function renderReports() {
  const rows=filteredReports(), sales=filteredSales();
  const eggs=rows.reduce((s,r)=>s+Number(r.eggs||0),0), kg=rows.reduce((s,r)=>s+Number(r.kg||0),0), henDays=rows.reduce((s,r)=>s+Number(r.birds||0),0), feed=rows.reduce((s,r)=>s+Number(r.feed||0),0);
  const salesRevenue=paidSalesTotal(sales);
  return `${heading('REKAP OPERASIONAL','Laporan','Ringkas periode dengan satuan, filter, dan jejak ke catatan harian.', '<button class="btn btn-primary" data-action="export-report">⇩ Ekspor CSV</button><button class="btn" data-action="print">Cetak / PDF</button>')}<div class="filters">${farmSelect()}<div class="select-wrap"><select class="select-control" id="periodFilter"><option value="hariini" ${period==='hariini'?'selected':''}>Hari ini</option><option value="7hari" ${period==='7hari'?'selected':''}>7 hari terakhir</option><option value="30hari" ${period==='30hari'?'selected':''}>30 hari terakhir</option></select></div><span class="muted-note">${dateLabel(shiftDate(-(periodDays()-1)))} — ${dateLabel(today())} · zona waktu Asia/Jakarta</span></div><div class="report-summary"><div><small>Telur dihasilkan</small><b>${num(eggs)} butir</b></div><div><small>Berat produksi</small><b>${num(kg,2)} kg</b></div><div><small>Telur terjual</small><b>${num(sales.reduce((s,x)=>s+Number(x.quantity||0),0),2)} sesuai satuan</b></div><div><small>Nilai penjualan dibayar</small><b>${rupiah(salesRevenue)}</b></div><div><small>HDP berbobot</small><b>${henDays ? `${num(eggs/henDays*100,2)}%` : 'Belum dicatat'}</b></div><div><small>Pakan tercatat</small><b>${num(feed,2)} kg</b></div><div><small>FCR dihitung</small><b>${kg&&feed?num(feed/kg,2):'Belum dicatat'}</b></div></div><article class="panel" style="margin-top:13px"><div class="panel-heading"><div><h3>Produksi harian</h3><p>Persentase agregat memakai total pembilang ÷ total penyebut.</p></div></div><div class="table-wrap"><table class="data-table"><thead><tr><th>Tanggal</th><th>Lokasi</th><th>Butir</th><th>Kg</th><th>Populasi</th><th>HDP</th><th>Pakan (kg)</th><th>FCR</th><th>Status</th></tr></thead><tbody>${rows.slice().sort((a,b)=>a.date.localeCompare(b.date)).map(r=>`<tr><td><b>${dateLabel(r.date)}</b></td><td>${esc(farmById(r.farm_id)?.name||'—')}</td><td>${num(r.eggs)}</td><td>${num(r.kg,2)}</td><td>${num(r.birds)}</td><td>${r.birds?`${num(r.eggs/r.birds*100,2)}%`:'Belum dicatat'}</td><td>${num(r.feed,2)}</td><td>${r.kg&&r.feed?num(r.feed/r.kg,2):'Belum dicatat'}</td><td>${statusBadge(r.status||'Dikirim')}</td></tr>`).join('')||'<tr><td colspan="9" class="empty-state">Tidak ada data untuk filter ini.</td></tr>'}</tbody></table></div></article><p class="muted-note">Laporan dibuat ${dateLabel(today())}. Angka stok memerlukan saldo awal dan rekonsiliasi sebelum dianggap saldo aktual.</p>`;
}

function renderDictionary() {
  return `${heading('REFERENSI FARM','Kamus istilah','Cari istilah umum dan kode lokal. Definisi farm dapat dikelola saat onboarding.', '<button class="btn btn-primary" data-action="add-term">＋ Tambah istilah</button>')}<div class="filters"><input class="input-control" style="max-width:360px" id="termSearch" placeholder="Cari singkatan atau istilah…" aria-label="Cari istilah"><span class="muted-note">${state.terms.length} istilah · istilah ambigu memerlukan konteks</span></div><div class="term-grid" id="termGrid">${state.terms.map(t=>`<article class="term-card" data-search="${esc(`${t.term} ${t.common} ${t.definition}`.toLowerCase())}"><div style="display:flex;justify-content:space-between;gap:8px"><b>${esc(t.term)}</b><span class="pill">${esc(t.unit)}</span></div><p><strong>${esc(t.common)}</strong><br>${esc(t.definition)}</p><small>${esc(t.rule)}</small></article>`).join('')}</div>`;
}

function renderSettings() {
  const canManage=selectedFarm==='semua'?canViewAllFarms():canManageFarm();
  const canManageLocations=['manajer','admin_sistem'].includes(roleForFarm());
  const headerAction=canManageLocations?'<button class="btn btn-primary" data-action="new-farm">＋ Tambah lokasi</button>':'';
  const users=selectedFarm==='semua'?farmUsers:farmUsers.filter(m=>m.farm_id===selectedFarm);
  const userPanel=canManage?`<article class="panel" style="margin-bottom:13px"><div class="panel-heading"><div><h3>Pengguna & akses</h3><p>Staff dapat masuk dan mencatat data lokasi. Hanya admin yang dapat mengundang pengguna.</p></div><button class="btn btn-primary" data-action="invite-staff">＋ Tambah staff</button></div><div class="table-wrap"><table class="data-table"><thead><tr><th>Nama</th><th>Email</th><th>Lokasi</th><th>Peran</th><th>Akses akun</th></tr></thead><tbody>${users.map(m=>`<tr><td><b>${esc(m.profiles?.full_name||m.profiles?.email||'Pengguna')}</b></td><td>${esc(m.profiles?.email||'')}</td><td>${esc(farmById(m.farm_id)?.name||'—')}</td><td>${m.role==='petugas'?'Staff':esc(m.role)}</td><td>${m.user_id===currentUser?.id?'<span class="status">Aktif · Anda</span>':'<span class="status neutral">Terdaftar</span>'}</td></tr>`).join('')||'<tr><td colspan="5" class="empty-state">Daftar pengguna belum tersedia di mode demo.</td></tr>'}</tbody></table></div></article>`:selectedFarm==='semua'&&canViewAllFarms()?`<article class="panel" style="margin-bottom:13px"><div class="panel-heading"><div><h3>Pengguna & akses</h3><p>Akun admin dapat melihat seluruh lokasi.</p></div></div><p class="muted-note">Pilih lokasi tertentu untuk mengelola staff dan keanggotaannya.</p></article>`:`<article class="panel" style="margin-bottom:13px"><div class="panel-heading"><div><h3>Akses pengguna</h3><p>Peran Anda: Staff. Minta admin farm jika perlu menambah atau mengubah akses pengguna.</p></div><span class="pill">Staff</span></div><p class="muted-note">Pembuatan akun hanya melalui undangan admin. Tidak ada pendaftaran mandiri.</p></article>`;
  return `${heading('KONFIGURASI','Pengaturan farm','Kelola tempat produksi, pengguna, dan koneksi data.', headerAction)}<div class="filters"><span class="filter-label">Lokasi aktif</span>${farmSelect()}</div>${userPanel}<article class="panel" style="margin-bottom:13px"><div class="panel-heading"><div><h3>Tempat produksi</h3><p>Lokasi nonoperasional tidak masuk agregat produksi aktif.</p></div><span class="pill">${state.farms.length} lokasi</span></div><div class="setting-list">${state.farms.map(f=>`<div class="location-card"><div><h3>${esc(f.name)} <span class="pill">${esc(f.code)}</span></h3><p>${esc(f.region)} · ${f.start_date?`mulai operasi ${dateLabel(f.start_date)}`:'tanggal operasi belum ditetapkan'} · ${esc(f.responsible||'Belum ada penanggung jawab')}</p></div><div style="display:flex;align-items:center;gap:8px">${statusBadge(f.status)}${canManageLocations?`<button class="btn btn-sm" data-action="edit-farm" data-id="${esc(f.id)}">Kelola</button>`:''}</div></div>`).join('')}</div></article><div class="page-grid"><article class="panel"><div class="panel-heading"><div><h3>Penyimpanan</h3><p>Mode aktif untuk sesi ini</p></div><span class="connection-indicator ${backend==='supabase'?'connected':'offline'}"><i></i>${backend==='supabase'?'Supabase':'Lokal'}</span></div><p class="muted-note">${backend==='supabase'?'Data aplikasi dimuat dan disimpan melalui Supabase. Akses dibatasi berdasarkan keanggotaan lokasi.':'Data disimpan pada browser ini untuk pratinjau.'}</p></article><article class="panel"><div class="panel-heading"><div><h3>Konfigurasi awal</h3><p>Nilai yang masih perlu disahkan farm</p></div></div><div class="setting-list"><div class="setting-row"><span>Konversi peti ke kg</span><b>Belum disahkan</b></div><div class="setting-row"><span>Kandang / flock</span><b>Belum disiapkan</b></div><div class="setting-row"><span>Saldo awal stok</span><b>Belum direkonsiliasi</b></div><div class="setting-row"><span>Peran aktif</span><b>${roleForDisplay()==='petugas'?'Staff':esc(roleForDisplay()||'Tidak ada akses')}</b></div></div></article></div>`;
}

const views = { ringkasan: ['Ringkasan', renderDashboard], produksi: ['Produksi', renderProduction], stok: ['Stok & Penjualan', renderStock], kas: ['Kas & Pengeluaran', renderCash], laporan: ['Laporan', renderReports], kamus: ['Kamus istilah', renderDictionary], pengaturan: ['Pengaturan', renderSettings] };
function render() {
  if (!views[view]) view = 'ringkasan';
  $('#breadcrumbPage').textContent = views[view][0];
  $('#pageContent').innerHTML = views[view][1]();
  $$('.nav-link').forEach(link => link.classList.toggle('active', link.dataset.view === view));
  $('#topDate').textContent = dateLabel(today(), { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  $('#storageHint').textContent = backend === 'supabase' ? 'Data tersinkron ke Supabase.' : 'Demo tersimpan di perangkat ini.';
  const displayName=currentUser?.full_name||currentUser?.email||'Admin Farm';
  const initials=displayName.split(/[\s@.]+/).filter(Boolean).slice(0,2).map(part=>part[0].toUpperCase()).join('')||'RF';
  if($('#profileName'))$('#profileName').textContent=displayName;
  if($('#profileRole'))$('#profileRole').textContent=roleDisplay(roleForDisplay());
  if($('#profileAvatar'))$('#profileAvatar').textContent=initials;
  if($('#topAvatar'))$('#topAvatar').textContent=initials;
  if($('#signOutButton'))$('#signOutButton').hidden=backend!=='supabase';
  const filter = $('#farmFilter'); if (filter) filter.addEventListener('change', e => { selectedFarm = e.target.value; render(); });
  const periodFilter = $('#periodFilter'); if (periodFilter) periodFilter.addEventListener('change', e => { period = e.target.value; render(); });
  const termSearch = $('#termSearch'); if (termSearch) termSearch.addEventListener('input', e => $$('.term-card').forEach(card => { card.hidden = !card.dataset.search.includes(e.target.value.toLowerCase()); }));
}

function toast(message, error = false) {
  const item = document.createElement('div'); item.className = `toast${error ? ' error' : ''}`; item.textContent = message; $('#toastRoot').append(item); setTimeout(() => item.remove(), 3400);
}
function closeModal() {
  const root = $('#modalRoot');
  if (!root.querySelector('.modal')) return;
  root.innerHTML = '';
  const returnFocus = modalReturnFocus;
  modalReturnFocus = null;
  if (returnFocus?.isConnected) returnFocus.focus();
}
function openModal(title, subtitle, body) {
  const root = $('#modalRoot');
  if (!root.querySelector('.modal')) modalReturnFocus = document.activeElement;
  root.innerHTML = `<div class="modal-backdrop" data-close="true"><section class="modal" role="dialog" aria-modal="true" aria-label="${esc(title)}" tabindex="-1"><div class="modal-head"><div><h2>${title}</h2><p>${subtitle}</p></div><button type="button" class="close-button" data-close="true" aria-label="Tutup">×</button></div>${body}</section></div>`;
  root.onclick = e => {
    if (!(e.target instanceof Element)) return;
    if (e.target.matches('.modal-backdrop') || e.target.closest('[data-close="true"]:not(.modal-backdrop)')) closeModal();
  };
  root.querySelector('.modal')?.focus();
}
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && $('#modalRoot .modal')) closeModal();
});
function formField(label, name, type = 'text', value = '', opts = {}) {
  const attrs = `${opts.required ? 'required' : ''} ${opts.step ? `step="${opts.step}"` : ''} ${opts.min !== undefined ? `min="${opts.min}"` : ''} ${opts.max ? `max="${opts.max}"` : ''} ${opts.placeholder ? `placeholder="${esc(opts.placeholder)}"` : ''}`;
  const control = type === 'textarea' ? `<textarea name="${name}" ${attrs}>${esc(value)}</textarea>` : `<input class="input-control" name="${name}" type="${type}" value="${esc(value)}" ${attrs}>`;
  return `<div class="field ${opts.full ? 'full' : ''}"><label>${label}${opts.required ? ' *' : ''}</label>${control}${opts.help ? `<small>${opts.help}</small>` : ''}</div>`;
}
function selectField(label, name, options, value = '', full = false, required = false) {
  return `<div class="field ${full ? 'full' : ''}"><label>${label}</label><div class="select-wrap"><select class="input-control" name="${name}" ${required ? 'required' : ''}>${options.map(item=>{const [optionValue,optionLabel]=Array.isArray(item)?item:[item,item];return `<option value="${esc(optionValue)}" ${optionValue===value?'selected':''}>${esc(optionLabel)}</option>`}).join('')}</select></div></div>`;
}
function showReportForm() {
  const opts = state.farms.map(f=>[f.id,`${f.name} · ${f.status}`]);
  openModal('Catat produksi harian','Produksi dan hasil sortir disimpan terpisah. Angka kosong tidak dianggap nol.', `<form id="reportForm" class="form-grid">${selectField('Lokasi','farm_id',opts,selectedFarm==='semua'?defaultFarmId():selectedFarm)}${formField('Tanggal operasi','date','date',today(),{required:true})}${formField('Telur dihasilkan','eggs','number','',{required:true,min:0,step:'1',help:'Masukkan jumlah butir; kg dicatat terpisah.'})}${formField('Berat total telur (kg)','kg','number','',{required:true,min:0,step:'0.01'})}${formField('SU · sisa utuh (kg)','su','number','',{min:0,step:'0.01'})}${formField('JB · jumbo (kg)','jb','number','',{min:0,step:'0.01'})}${formField('TC · telur cair/rusak (kg)','tc','number','',{min:0,step:'0.01'})}${formField('SST · susut (kg)','sst','number','',{step:'0.01',help:'Nilai bertanda disimpan sesuai input; isi alasan bila ada.'})}${formField('Ayam hidup (ekor)','birds','number','',{min:0,step:'1'})}${formField('Pakan tercatat (kg)','feed','number','',{min:0,step:'0.01',help:'Basis FCR awal: kg pakan ÷ kg massa telur.'})}${formField('Catatan / teks mentah','note','textarea','',{full:true,placeholder:'Kode atau notasi belum dipetakan dapat disimpan di sini.'})}<div class="form-actions"><button type="button" class="btn" data-close="true">Batal</button><button class="btn btn-primary">Simpan laporan</button></div></form>`);
  $('#reportForm').addEventListener('submit', async e=>{e.preventDefault();const f=Object.fromEntries(new FormData(e.currentTarget));const optionalNumber=v=>v===''?null:Number(v);const row={id:crypto.randomUUID(),farm_id:f.farm_id,date:f.date,eggs:Number(f.eggs),kg:Number(f.kg),su:optionalNumber(f.su),jb:optionalNumber(f.jb),tc:optionalNumber(f.tc),sst:optionalNumber(f.sst),birds:optionalNumber(f.birds),feed:optionalNumber(f.feed),note:f.note,status:'Dikirim'};await saveRecord('reports',row);$('#modalRoot').innerHTML='';render();toast('Laporan produksi tersimpan.');});
}
function showSaleForm() {
  const farmOpts=state.farms.map(f=>[f.id,`${f.name} · ${f.status}`]);
  openModal('Catat penjualan','Catat metode pembayaran dan status transaksi. Penjualan tidak otomatis mengubah snapshot stok.', `<form id="saleForm" class="form-grid">${selectField('Lokasi','farm_id',farmOpts,selectedFarm==='semua'?defaultFarmId():selectedFarm)}${formField('Tanggal penjualan','date','date',today(),{required:true})}${formField('Pelanggan','customer','text','',{placeholder:'Opsional'})}${selectField('Kategori','category',['SU','JB','TC','Belum dipetakan'],'SU')}${formField('Jumlah','quantity','number','',{required:true,min:0,step:'0.01'})}${selectField('Satuan','unit',['kg','butir','peti'],'kg')}${formField('Nilai penjualan (Rp)','amount','number','',{min:0,step:'1',help:'Harga/pembayaran opsional.'})}${selectField('Metode pembayaran','payment_method',['Belum dicatat','Tunai','Transfer bank','E-wallet'],'Belum dicatat')}${selectField('Status','status',['Dibayar','Direncanakan','Perlu verifikasi'],'Dibayar')}${formField('Catatan / surat jalan','note','textarea','',{full:true})}<div class="form-actions"><button type="button" class="btn" data-close="true">Batal</button><button class="btn btn-primary">Simpan penjualan</button></div></form>`);
  $('#saleForm').addEventListener('submit',async e=>{e.preventDefault();const f=Object.fromEntries(new FormData(e.currentTarget));const row={id:crypto.randomUUID(),...f,quantity:Number(f.quantity),amount:Number(f.amount||0)};await saveRecord('sales',row);$('#modalRoot').innerHTML='';render();toast('Penjualan tersimpan.');});
}
function showStockForm() {
  const farmOpts=state.farms.map(f=>[f.id,`${f.name} · ${f.status}`]);
  const rows=[['PT','Peti (PT)','peti'],['TU','TU · belum dipetakan','kg'],['TC','Telur cair (TC)','kg'],['JB','Jumbo (JB)','kg'],['SU','Sisa utuh (SU)','kg']];
  openModal('Catat saldo stok','Masukkan saldo fisik yang terlihat pada tanggal snapshot. Setiap kategori dan satuan disimpan terpisah.',`<form id="stockForm" class="form-grid">${selectField('Lokasi','farm_id',farmOpts,selectedFarm==='semua'?defaultFarmId():selectedFarm)}${formField('Tanggal saldo','snapshot_date','date',today(),{required:true})}${rows.map(([category,label,unit])=>formField(`${label} · ${unit}` ,category,'number','',{min:0,step:'0.01',placeholder:'Kosong jika tidak diketahui'})).join('')}${formField('Catatan / teks asli','note','textarea','',{full:true,placeholder:'Contoh: Stok 40pt · Tu 7.4kg · Tc 7.98kg · Jb 4.6kg'})}<div class="form-actions"><button type="button" class="btn" data-close="true">Batal</button><button class="btn btn-primary">Simpan saldo</button></div></form>`);
  $('#stockForm').addEventListener('submit',async e=>{e.preventDefault();const f=Object.fromEntries(new FormData(e.currentTarget));const snapshotRows=rows.filter(([category])=>f[category]!== '').map(([category,,unit])=>({id:crypto.randomUUID(),farm_id:f.farm_id,snapshot_date:f.snapshot_date,category,quantity:Number(f[category]),unit,note:f.note||''}));if(!snapshotRows.length){toast('Isi setidaknya satu saldo stok.',true);return;}try{await Promise.all(snapshotRows.map(row=>saveRecord('stockSnapshots',row,'upsert')));$('#modalRoot').innerHTML='';render();toast('Saldo stok tersimpan.');}catch{}}
  );
}
function showCashForm() {
 const farmOpts=state.farms.map(f=>[f.id,`${f.name} · ${f.status}`]);
 openModal('Tambah transaksi kas','Pembayaran kepada penerima eksternal dicatat sebagai kas keluar. Transfer internal dicatat terpisah.',`<form id="cashForm" class="form-grid">${formField('Tanggal','date','date',today(),{required:true})}${formField('Jumlah (Rp)','amount','number','',{required:true,min:1,step:'1'})}${formField('Penerima','recipient','text','',{required:true,placeholder:'Tukang, pekerja, pemasok…'})}${selectField('Kategori','category',['Upah/tenaga kerja','Alat','Kandang/pembangunan','Operasional','Lainnya'])}${formField('Tujuan / keterangan','purpose','text','',{required:true,full:true})}${selectField('Metode','method',['Transfer bank','E-wallet','Tunai','Pindah dana internal'])}${selectField('Status','status',['Dibayar','Direncanakan','Perlu verifikasi'],'Dibayar')}${selectField('Cakupan','scope',['Grup Cikalong','Lokasi produksi','Proyek pembangunan','Umum/Grup lain','Pindah dana internal'],'Lokasi produksi')}${selectField('Lokasi / proyek','farm_id',farmOpts,selectedFarm==='semua'?defaultFarmId():selectedFarm)}${formField('Referensi transfer','reference','text','',{placeholder:'Opsional'})}${formField('Catatan','note','textarea','',{full:true})}<div class="form-actions"><button type="button" class="btn" data-close="true">Batal</button><button class="btn btn-primary">Simpan transaksi</button></div></form>`);
 $('#cashForm').addEventListener('submit',async e=>{e.preventDefault();const f=Object.fromEntries(new FormData(e.currentTarget));const farm=farmById(f.farm_id);const groupScope=['Grup Cikalong','Umum/Grup lain'].includes(f.scope);const row={id:crypto.randomUUID(),...f,amount:Number(f.amount),farm_id:groupScope?null:f.farm_id,scope_name:groupScope?'':farm?.name||''};await saveRecord('cash',row);$('#modalRoot').innerHTML='';render();toast('Transaksi kas tersimpan.');});
}
function showFarmForm(farm=null) {
 openModal(farm?'Kelola tempat produksi':'Tambah tempat produksi',farm?'Perubahan status dan lokasi tidak menghapus catatan historis.':'Tambahkan lokasi baru. Lokasi nonoperasional tidak masuk agregat produksi aktif.',`<form id="farmForm" class="form-grid">${formField('Nama lokasi','name','text',farm?.name||'',{required:true})}${formField('Kode unik','code','text',farm?.code||'',{required:true})}${formField('Alamat / wilayah','region','text',farm?.region||'',{required:true})}${selectField('Zona waktu','timezone',['Asia/Jakarta','Asia/Makassar','Asia/Jayapura'],farm?.timezone||'Asia/Jakarta')}${selectField('Status','status',['Pembangunan','Persiapan','Beroperasi','Jeda','Ditutup'],farm?.status||'Pembangunan')}${formField('Tanggal mulai operasi','start_date','date',farm?.start_date||'')}${formField('Penanggung jawab','responsible','text',farm?.responsible||'')}${farm?formField('Catatan perubahan','change_note','text','',{required:true,full:true,placeholder:'Alasan perubahan status atau detail lokasi'}):''}<div class="form-actions"><button type="button" class="btn" data-close="true">Batal</button><button class="btn btn-primary">${farm?'Simpan perubahan':'Buat lokasi'}</button></div></form>`);
 $('#farmForm').addEventListener('submit',async e=>{e.preventDefault();const f=Object.fromEntries(new FormData(e.currentTarget));if(state.farms.some(x=>x.code.toLowerCase()===f.code.toLowerCase()&&x.id!==farm?.id)){toast('Kode lokasi sudah digunakan.',true);return;}const row={id:farm?.id||crypto.randomUUID(),...farm,...f};await saveRecord('farms',row,farm?'update':'insert');$('#modalRoot').innerHTML='';render();toast(farm?'Detail lokasi diperbarui.':'Lokasi berhasil ditambahkan.');});
}
function showTermForm(){openModal('Tambah istilah','Simpan arti lokal, unit, dan aturan penggunaan yang sudah dikonfirmasi.',`<form id="termForm" class="form-grid">${formField('Istilah / singkatan','term','text','',{required:true})}${formField('Nama umum','common','text','',{required:true})}${formField('Definisi','definition','textarea','',{required:true,full:true})}${formField('Unit','unit','text','',{required:true})}${formField('Aturan / dampak','rule','textarea','',{full:true})}<div class="form-actions"><button type="button" class="btn" data-close="true">Batal</button><button class="btn btn-primary">Tambah istilah</button></div></form>`);$('#termForm').addEventListener('submit',async e=>{e.preventDefault();const f=Object.fromEntries(new FormData(e.currentTarget));await saveRecord('terms',{id:crypto.randomUUID(),...f});$('#modalRoot').innerHTML='';render();toast('Istilah ditambahkan.');});}

function showInviteStaffForm() {
  if(!(selectedFarm==='semua'?canViewAllFarms():canManageFarm())){toast('Hanya admin yang dapat menambah staff.',true);return;}
  const farmOptions=[['','Pilih lokasi'],...state.farms.map(f=>[f.id,`${f.name} · ${f.status}`])];
  const selectedFarmId=selectedFarm==='semua'?'':selectedFarm;
  openModal('Undang staff','Pilih lokasi akses untuk staff. Undangan login akan dikirim melalui email.',`<form id="inviteStaffForm" class="form-grid">${formField('Nama staff','full_name','text','',{required:true})}${formField('Email staff','email','email','',{required:true,placeholder:'nama@farm.id'})}${selectField('Lokasi akses','farm_id',farmOptions,selectedFarmId,true,true)}<div class="field full"><small class="muted-note">Staff hanya dapat melihat dan mencatat data pada lokasi yang dipilih.</small></div><div class="form-actions"><button type="button" class="btn" data-close="true">Batal</button><button class="btn btn-primary">Kirim undangan</button></div></form>`);
  $('#inviteStaffForm').addEventListener('submit',async e=>{e.preventDefault();if(backend!=='supabase'||!supabase){toast('Undangan staff perlu koneksi Supabase.',true);return;}const f=Object.fromEntries(new FormData(e.currentTarget));const farm=farmById(f.farm_id);if(!farm){toast('Pilih lokasi akses untuk staff.',true);return;}const button=e.currentTarget.querySelector('button.btn-primary');button.disabled=true;button.textContent='Mengirim…';try{const {data,error}=await supabase.functions.invoke('admin-invite-user',{body:{email:f.email,full_name:f.full_name,farm_id:farm.id}});if(error||data?.error)throw new Error(error?.message||data?.error||'Undangan gagal dikirim.');}catch(error){console.error('Undangan staff gagal dikirim',error);toast(error.message||'Undangan gagal dikirim.',true);button.disabled=false;button.textContent='Kirim undangan';return;}closeModal();toast(`Undangan staff dikirim ke ${f.email}.`);await connectSupabase();});
}

async function saveRecord(table,row,operation='insert') {
  if (backend==='supabase' && supabase) {
    try {
      const dbTable=table==='cash'?'cash_transactions':table==='reports'?'daily_reports':table==='terms'?'dictionary_terms':table==='stockSnapshots'?'stock_snapshots':table;
      const payload={...row};
      if(table==='reports') { payload.house_id=null;payload.flock_id=null;payload.created_by=(await supabase.auth.getUser()).data.user?.id;payload.status=payload.status.toLowerCase(); }
      if(table==='sales'||table==='cash') payload.created_by=(await supabase.auth.getUser()).data.user?.id;
      if(table==='terms') payload.confirmed_by=(await supabase.auth.getUser()).data.user?.id;
      if(table==='stockSnapshots') payload.created_by=(await supabase.auth.getUser()).data.user?.id;
      if(table==='farms') { payload.start_date=payload.start_date||null;payload.updated_at=new Date().toISOString();delete payload.change_note; }
      if(table==='farms') { payload.timezone=payload.timezone||'Asia/Jakarta'; }
      const result=operation==='update'?await supabase.from(dbTable).update(payload).eq('id',row.id):operation==='upsert'?await supabase.from(dbTable).upsert(payload,{onConflict:'farm_id,snapshot_date,category,unit'}):await supabase.from(dbTable).insert(payload);
      if(result.error) throw result.error;
      if(table==='farms'&&operation==='insert') {
        const user=(await supabase.auth.getUser()).data.user;
        if(user){const membership=await supabase.from('farm_members').insert({farm_id:row.id,user_id:user.id,role:'admin_sistem'});if(membership.error)throw membership.error;}
      }
    } catch(error) { console.error(error); toast(`Supabase gagal menyimpan: ${error.message}`,true); throw error; }
  }
  if(table==='farms'&&operation==='update') state.farms=state.farms.map(f=>f.id===row.id?row:f);
  else if(table==='terms') state.terms.unshift(row);
  else if(table==='stockSnapshots'&&operation==='upsert') { const i=state.stockSnapshots.findIndex(s=>s.farm_id===row.farm_id&&s.snapshot_date===row.snapshot_date&&s.category===row.category&&s.unit===row.unit);if(i>=0)state.stockSnapshots[i]={...state.stockSnapshots[i],...row};else state.stockSnapshots.unshift(row); }
  else state[table].unshift(row);
  persist();
}

function exportCsv(kind) {
  const maps={production:[state.reports,'Laporan produksi'],sales:[state.sales,'Penjualan'],cash:[state.cash,'Kas dan pengeluaran'],report:[filteredReports(),'Laporan periode']};
  const [rows,name]=maps[kind]; if(!rows.length){toast('Tidak ada data untuk diekspor.');return;}
  const keys=[...new Set(rows.flatMap(r=>Object.keys(r)))];
  const csv=[keys.join(','),...rows.map(row=>keys.map(key=>`"${String(row[key]??'').replaceAll('"','""')}"`).join(','))].join('\r\n');
  const blob=new Blob(['\ufeff'+csv],{type:'text/csv;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`${name.toLowerCase().replaceAll(' ','-')}-${today()}.csv`;a.click();URL.revokeObjectURL(url);toast('CSV berhasil diekspor.');
}
function connectionInfo() { openModal('Hubungkan Supabase','Aktifkan penyimpanan bersama untuk data farm.',`<div class="review-list"><p class="muted-note">Buat proyek Supabase, jalankan file <b>supabase/schema.sql</b> di SQL Editor, lalu salin <b>supabase-config.js.example</b> menjadi <b>supabase-config.js</b> dan isi Project URL serta anon/publishable key. Jangan gunakan service_role key pada browser.</p><p class="muted-note">Setelah halaman dimuat ulang, aplikasi memakai Supabase jika tabel tersedia dan konfigurasi valid. Mode browser lokal tetap menjadi pratinjau tanpa kredensial.</p><div class="form-actions"><button class="btn btn-primary" data-close="true">Mengerti</button></div></div>`); }

async function connectSupabase() {
  const cfg=window.SUPABASE_CONFIG;
  if(!cfg?.url||!cfg?.anonKey||cfg.url.includes('PROJECT_REF')||cfg.anonKey.includes('SUPABASE_')) return;
  try {
    const {createClient}=await import('https://esm.sh/@supabase/supabase-js@2');
    supabase=createClient(cfg.url,cfg.anonKey); loading=true; backend='supabase';
    const sessionResult=await supabase.auth.getSession();
    if(!sessionResult.data.session){showAuthForm();return;}
    currentUser=sessionResult.data.session.user;
    if(['invite','recovery'].includes(authFlowType)){showSetPasswordForm();return;}
    const farmResult=await supabase.from('farms').select('*').order('name');
    if(farmResult.error)throw farmResult.error;
    const farms=farmResult.data||[];
    state.farms=farms;
    const farmIds=farms.map(f=>f.id);
    const membershipQuery=farmIds.length?supabase.from('farm_members').select('farm_id,user_id,role,profiles!farm_members_profile_user_id_fkey(email,full_name)').in('farm_id',farmIds):Promise.resolve({data:[],error:null});
    const profileQuery=supabase.from('profiles').select('full_name,email').eq('user_id',currentUser.id).maybeSingle();
    const queries=[supabase.from('daily_reports').select('*').limit(500),supabase.from('sales').select('*').limit(500),supabase.from('cash_transactions').select('*').limit(500),supabase.from('dictionary_terms').select('*').limit(500),supabase.from('stock_snapshots').select('*').order('snapshot_date',{ascending:false}).limit(500),membershipQuery,profileQuery];
    const results=await Promise.all(queries);
    const error=results.find(r=>r.error)?.error; if(error) throw error;
    const [reports,sales,cash,terms,stock,members,profile]=results.map(r=>r.data);
    memberships=members||[];farmUsers=memberships;
    const ownFarm=memberships.find(m=>m.user_id===currentUser.id)?.farm_id;
    selectedFarm=memberships.some(m=>adminRoles.includes(m.role))?'semua':ownFarm||farms[0]?.id||'semua';
    currentUser={...currentUser,...profile};
    state.stockSnapshots=stock||[];
    state.sales=sales||[];state.cash=cash||[];state.terms=terms||[];
    state.reports=(reports||[]).map(r=>({...r,status:r.status==='disetujui'?'Disetujui':r.status==='draf'?'Draf':'Dikirim'}));
    document.body.classList.remove('auth-required');
    backend='supabase';persist();render();
  } catch(error) { console.error('Supabase connection unavailable',error);backend='supabase';showAuthForm(`Koneksi ke database gagal: ${error.message}. Periksa skema Supabase dan muat ulang.`); }
  finally { loading=false; }
}

function showAuthForm(errorMessage='') {
  document.body.classList.add('auth-required');
  $('#modalRoot').innerHTML='';
  $('#pageContent').innerHTML=`<div class="login-screen"><div class="login-aside"><div class="brand"><span class="brand-mark">◒</span><span><b>ruang<span>farm</span></b><small>OPERASI TELUR</small></span></div><div class="login-aside-copy"><span class="eyebrow">OPERASI FARM TERHUBUNG</span><h1>Data lapangan,<br>lebih mudah dipahami.</h1><p>Produksi, stok, penjualan, dan aktivitas tim dalam satu ruang kerja.</p><div class="login-facts"><span>● Catatan terstruktur</span><span>● Akses per lokasi</span><span>● Perubahan terlacak</span></div></div><small class="login-aside-foot">Ruang Farm · Cianjur</small></div><div class="login-main"><form id="authForm" class="login-card"><span class="eyebrow">SELAMAT DATANG</span><h2>Masuk ke akun Anda</h2><p>Gunakan alamat email undangan dari admin farm.</p>${errorMessage?`<div class="auth-error">${esc(errorMessage)}</div>`:''}<div class="field"><label>Email</label><input class="input-control" name="email" type="email" autocomplete="username" required placeholder="nama@farm.id"></div><div class="field"><label>Kata sandi</label><input class="input-control" name="password" type="password" autocomplete="current-password" required placeholder="Masukkan kata sandi"></div><button class="btn btn-primary login-submit">Masuk <span>→</span></button><small class="login-help">Akun staff dibuat melalui undangan admin. Pendaftaran mandiri tidak tersedia.</small></form></div></div>`;
  $('#authForm').addEventListener('submit',async e=>{e.preventDefault();if(!supabase){toast('Koneksi Supabase belum tersedia.',true);return;}const button=e.currentTarget.querySelector('button[type="submit"],button:not([type])');button.disabled=true;button.textContent='Memeriksa akun…';const f=Object.fromEntries(new FormData(e.currentTarget));const {error}=await supabase.auth.signInWithPassword({email:f.email,password:f.password});if(error){showAuthForm(error.message);return;}await connectSupabase();});
}

function showSetPasswordForm(errorMessage='') {
  document.body.classList.add('auth-required');
  $('#pageContent').innerHTML=`<div class="login-screen"><div class="login-aside"><div class="brand"><span class="brand-mark">◒</span><span><b>ruang<span>farm</span></b><small>OPERASI TELUR</small></span></div><div class="login-aside-copy"><span class="eyebrow">AKUN STAFF</span><h1>Selesaikan<br>pengaturan akun.</h1><p>Buat kata sandi pribadi untuk masuk ke Ruang Farm.</p></div><small class="login-aside-foot">Ruang Farm · Cianjur</small></div><div class="login-main"><form id="setPasswordForm" class="login-card"><span class="eyebrow">AKUN BARU</span><h2>Buat kata sandi</h2><p>Gunakan setidaknya 8 karakter.</p>${errorMessage?`<div class="auth-error">${esc(errorMessage)}</div>`:''}<div class="field"><label>Kata sandi baru</label><input class="input-control" name="password" type="password" autocomplete="new-password" minlength="8" required></div><div class="field"><label>Ulangi kata sandi</label><input class="input-control" name="confirm" type="password" autocomplete="new-password" minlength="8" required></div><button class="btn btn-primary login-submit">Simpan kata sandi <span>→</span></button></form></div></div>`;
  $('#setPasswordForm').addEventListener('submit',async e=>{e.preventDefault();const values=Object.fromEntries(new FormData(e.currentTarget));if(values.password!==values.confirm){showSetPasswordForm('Kedua kata sandi belum sama.');return;}const {error}=await supabase.auth.updateUser({password:values.password});if(error){showSetPasswordForm(error.message);return;}authFlowType='';history.replaceState(null,'',location.pathname+location.search);await connectSupabase();});
}

document.addEventListener('click',e=>{
  const go=e.target.closest('[data-go]'); if(go){location.hash=go.dataset.go;$('#sidebar').classList.remove('open');}
  const nav=e.target.closest('[data-view]'); if(nav){view=nav.dataset.view;location.hash=view;render();$('#sidebar').classList.remove('open');}
  const action=e.target.closest('[data-action]'); if(action){const id=action.dataset.id;switch(action.dataset.action){case'new-report':showReportForm();break;case'new-sale':showSaleForm();break;case'new-stock':showStockForm();break;case'new-cash':showCashForm();break;case'new-farm':showFarmForm();break;case'edit-farm':showFarmForm(farmById(id));break;case'add-term':showTermForm();break;case'invite-staff':showInviteStaffForm();break;case'sign-out':if(supabase)supabase.auth.signOut().then(()=>{currentUser=null;memberships=[];farmUsers=[];showAuthForm();});break;case'export-production':exportCsv('production');break;case'export-sales':exportCsv('sales');break;case'export-cash':exportCsv('cash');break;case'export-report':exportCsv('report');break;case'print':window.print();break;case'connection-info':connectionInfo();break;}}
});
window.addEventListener('hashchange',()=>{view=location.hash.slice(1)||'ringkasan';render();});
$('#mobileMenu').addEventListener('click',()=>$('#sidebar').classList.toggle('open'));
$('#notificationButton').addEventListener('click',()=>toast('Ada laporan menunggu tinjauan dan istilah belum dipetakan.'));
state=loadLocal();
if(window.SUPABASE_CONFIG?.url){document.body.classList.add('auth-required');$('#pageContent').innerHTML='<div class="auth-loading">Menghubungkan ke Ruang Farm…</div>';connectSupabase();}
else render();
