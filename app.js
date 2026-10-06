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
  reportAttachments: [],
  stockRules: [
    ...['PT','SU','JB','TC'].map(category=>({id:`local-${category}`,farm_id:'cikalong',sale_category:category,stock_category:category,kg_per_peti:15,conversion_confirmed:false})),
    {id:'local-telur-jumbo',farm_id:'cikalong',sale_category:'Telur Jumbo',stock_category:'JB',kg_per_peti:15,conversion_confirmed:false},
    {id:'local-telur-bagus',farm_id:'cikalong',sale_category:'Telur bagus',stock_category:'SU',kg_per_peti:15,conversion_confirmed:false},
    {id:'local-telur-ecer',farm_id:'cikalong',sale_category:'Telur ecer',stock_category:'SU',kg_per_peti:15,conversion_confirmed:false},
    {id:'local-telur-retak',farm_id:'cikalong',sale_category:'Telur retak',stock_category:'TC',kg_per_peti:15,conversion_confirmed:false},
    {id:'local-telur-15kg',farm_id:'cikalong',sale_category:'Telur 15 kg',stock_category:'PT',kg_per_peti:15,conversion_confirmed:false},
    {id:'local-telur-15kg-18',farm_id:'cikalong',sale_category:'Telur 15 kg x 18 krat',stock_category:'PT',kg_per_peti:15,conversion_confirmed:false},
    ...['PT','SU','JB','TC'].map(category=>({id:`local-skn-${category}`,farm_id:'sukanagara',sale_category:category,stock_category:category,kg_per_peti:null,conversion_confirmed:false})),
    {id:'local-skn-telur-ecer',farm_id:'sukanagara',sale_category:'Telur ecer',stock_category:'SU',kg_per_peti:null,conversion_confirmed:false}
  ],
  auditEvents: [],
  terms: [
    { term: 'HDP', common: 'Produksi telur harian', definition: 'Hen-Day Production: jumlah telur hari ini ÷ ayam hidup hari ini × 100%.', unit: '%', rule: 'Dari Almanak Istilah Peternakan Ayam. Hitung dari total telur dan total hen-days; basis populasi wajib tersedia.' },
    { term: 'HDEP', common: 'Produksi telur harian berbasis ayam hidup', definition: 'Hen-Day Egg Production; Almanak menyebut istilah ini umumnya setara HDP, yaitu telur hari ini ÷ ayam hidup hari ini × 100%.', unit: '%', rule: 'Pastikan populasi hidup dan tanggal yang dipakai sebagai basis.' },
    { term: 'HD', common: 'Hen-day (hari ayam hidup)', definition: 'Satu hari kehidupan seekor ayam. Untuk periode panjang, hen-days adalah jumlah ayam hidup setiap hari yang dijumlahkan sepanjang periode.', unit: 'hen-days', rule: 'Almanak Istilah Peternakan Ayam. Bukan jumlah telur.' },
    { term: 'HHP', common: 'Produksi telur per ayam awal', definition: 'Hen-Housed Production. Produksi telur berdasarkan jumlah ayam yang ditempatkan pada awal pemeliharaan. Untuk hasil kumulatif, total telur kumulatif ÷ populasi awal.', unit: 'butir/ekor awal; metode dapat berbeda', rule: 'Periksa periode dan satuan laporan; almanak menyebut HHP juga dapat disajikan sebagai persentase.' },
    { term: 'HHEP', common: 'Produksi telur berbasis ayam awal', definition: 'Hen-Housed Egg Production: produksi telur berdasarkan ayam yang ditempatkan pada awal pemeliharaan, memperhitungkan dampak kematian dan afkir.', unit: 'sesuai metode', rule: 'Almanak menyebut ini sebagai indikator berbasis populasi awal; konfirmasi satuan farm.' },
    { term: 'FI / ADFI', common: 'Konsumsi pakan', definition: 'Feed Intake / Average Daily Feed Intake.', unit: 'g/ekor/hari', rule: 'Pastikan apakah angka untuk kelompok atau per ekor.' },
    { term: 'FCR', common: 'Rasio pakan terhadap massa telur', definition: 'Feed Conversion Ratio untuk telur.', unit: 'kg pakan/kg massa telur', rule: 'Gunakan pakan dan massa telur pada periode yang sama.' },
    { term: 'EW / AEW', common: 'Berat telur rata-rata', definition: 'Egg Weight / Average Egg Weight.', unit: 'g/butir', rule: 'Simpan cara pengukuran dan ukuran sampel.' },
    { term: 'SU', common: 'Sisa utuh', definition: 'Telur yang masih utuh secara fisik, tetapi masuk kategori sisa berdasarkan kriteria sortir atau pencatatan internal farm.', unit: 'kg atau butir', rule: 'Almanak menyebut contoh seperti sisa setelah pesanan atau telur yang belum masuk kelas ukuran utama. Dampak stok mengikuti SOP farm.' },
    { term: 'JB', common: 'Jumbo', definition: 'Kategori ukuran besar menurut grading farm.', unit: 'kg atau butir', rule: 'Batas grading dapat berbeda antar farm/pembeli.' },
    { term: 'TC', common: 'Telur cair', definition: 'Telur rusak hingga isi keluar atau merembes.', unit: 'kg atau butir', rule: 'Nonnormal secara default; ikuti SOP farm.' },
    { term: 'SST', common: 'Susut', definition: 'Selisih atau kehilangan di tahap tertentu.', unit: 'sesuai catatan', rule: 'Simpan tanda, tahap, alasan. Jangan hitung kehilangan dua kali.' },
    { term: 'TU', common: 'Telur utuh · padanan terdekat: SU', definition: 'Almanak tidak mencantumkan singkatan TU. Padanan terdekat yang tercantum adalah SU (Sisa Utuh): telur masih utuh secara fisik tetapi masuk kategori sisa menurut kriteria sortir atau pencatatan internal.', unit: 'sesuai catatan mentah', rule: 'Pemetaan sementara berdasarkan kemiripan istilah, bukan sinonim yang telah disahkan. Pertahankan kode TU dan jangan gabungkan dengan SU atau hitung stok layak jual sebelum admin farm mengonfirmasi.' },
    { term: 'HH', common: 'Hen-Housed Production · padanan terdekat: HHP/HHEP', definition: 'Almanak menjelaskan HHP (Hen-Housed Production) dan HHEP (Hen-Housed Egg Production) sebagai produksi telur berbasis jumlah ayam pada awal penempatan. Ini padanan terdekat untuk catatan HH.', unit: 'belum dipastikan', rule: 'Nilai laporan “HH 54.27” tidak memuat satuan dan periode. Simpan sebagai nilai dilaporkan; jangan tampilkan sebagai KPI atau menebak apakah butir/ekor awal atau persen sebelum dikonfirmasi.' },
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
let stockRulesReady = true;
let pendingReportImages = [];
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
function canManageFarm(farmId = selectedFarm) {
  if (backend === 'local') return true;
  return memberships.some(m => adminRoles.includes(m.role)) || adminRoles.includes(roleForFarm(farmId));
}
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
function stockLabel(category) { return category==='TU'?'TU · Telur utuh (padanan SU)':category==='PT'?'Peti':'Telur '+category; }
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
function dashboardStockSnapshotPanel() {
  const farms=selectedFarm==='semua'
    ? state.farms.filter(f=>f.status==='Beroperasi')
    : state.farms.filter(f=>f.id===selectedFarm);
  const groups=farms.map(f=>({farm:f,rows:latestStockForFarm(f.id)})).filter(group=>group.rows.length);
  const order={TU:0,PT:1,JB:2,TC:3,SU:4,LAINNYA:5};
  const action=`<button class="btn btn-sm btn-soft" data-action="new-stock">＋ Catat saldo</button>`;
  return `<article class="panel stock-panel"><div class="panel-heading"><div><h3>Saldo stok fisik terbaru</h3><p>Jumlah per kategori dan satuan dari snapshot terakhir setiap lokasi.</p></div>${action}</div>${groups.length?`<div class="stock-location-list">${groups.map(({farm,rows})=>{const date=rows[0].snapshot_date;const sorted=[...rows].sort((a,b)=>(order[a.category]??99)-(order[b.category]??99));return `<section class="stock-location"><div class="stock-location-heading"><b>${esc(farm.name)}</b><span>Snapshot ${dateLabel(date)}</span></div><div class="stock-grid">${sorted.map(r=>`<div class="stock-balance"><span>${esc(stockLabel(r.category))}</span><b>${num(r.quantity,Number.isInteger(Number(r.quantity))?0:2)} <small>${esc(r.unit)}</small></b></div>`).join('')}</div></section>`;}).join('')}</div><div class="stock-caption">Saldo fisik yang dilaporkan. Peti, kg, dan butir ditampilkan terpisah dari saldo stok terhitung.</div>`:'<div class="empty-state"><strong>Belum ada saldo stok yang dicatat.</strong><span>Catat snapshot per kategori untuk menampilkan saldo peti, kg, atau butir.</span></div>'}</article>`;
}
function stockRuleFor(farmId,saleCategory) {
  return state.stockRules.find(rule=>rule.farm_id===farmId&&rule.sale_category.trim().toLocaleLowerCase()===String(saleCategory||'').trim().toLocaleLowerCase());
}
function normalizeSaleForStock(farmId,category,quantity,unit) {
  const rule=stockRuleFor(farmId,category);
  if(!rule?.stock_category)return {stock_category:null,normalized_quantity:null,normalized_unit:null,rule};
  if(unit==='peti'&&Number(rule.kg_per_peti)>0)return {stock_category:rule.stock_category,normalized_quantity:Number(quantity)*Number(rule.kg_per_peti),normalized_unit:'kg',rule};
  return {stock_category:rule.stock_category,normalized_quantity:Number(quantity),normalized_unit:unit,rule};
}
function saleStockDisplay(sale) {
  const normalized=sale.normalized_unit?{stock_category:sale.stock_category,normalized_quantity:sale.normalized_quantity,normalized_unit:sale.normalized_unit}:normalizeSaleForStock(sale.farm_id,sale.category,sale.quantity,sale.unit);
  return normalized.stock_category?`${num(normalized.normalized_quantity??sale.quantity,2)} ${normalized.normalized_unit||sale.unit} · ${normalized.stock_category}`:'Belum dipetakan';
}
function stockPosition(farmId,category,unit='kg',date=today(),excludeSaleId=null) {
  const rule=state.stockRules.find(item=>item.farm_id===farmId&&item.stock_category===category)||null;
  const kgPerPeti=Number(rule?.kg_per_peti)||0;
  const snapshots=state.stockSnapshots.filter(item=>item.farm_id===farmId&&item.category===category&&item.snapshot_date<=date);
  const snapshotDate=snapshots.reduce((latest,item)=>item.snapshot_date>latest?item.snapshot_date:latest,'');
  const baselineRows=snapshotDate?snapshots.filter(item=>item.snapshot_date===snapshotDate):[];
  const baselineCreatedAt=baselineRows.reduce((latest,item)=>!latest||String(item.created_at||'')>latest?String(item.created_at||''):latest,'');
  const afterSnapshot=item=>!snapshotDate||item.date>snapshotDate||(item.date===snapshotDate&&baselineCreatedAt&&item.created_at&&String(item.created_at)>baselineCreatedAt);
  let available=0,known=true,notes=[];
  if(unit==='butir'){
    const eggs=baselineRows.filter(item=>item.unit==='butir');
    available=eggs.reduce((sum,item)=>sum+Number(item.quantity||0),0);
    if(!snapshotDate){available=0;notes.push('Tanpa saldo awal butir');}
    for(const report of state.reports.filter(item=>item.farm_id===farmId&&item.date<=date&&afterSnapshot(item)))
      notes.push('Produksi kategori tercatat dalam kg, tidak dikonversi menjadi butir');
    for(const sale of state.sales.filter(item=>item.id!==excludeSaleId&&item.farm_id===farmId&&(item.stock_category||stockRuleFor(farmId,item.category)?.stock_category)===category&&item.status==='Dibayar'&&item.date<=date&&afterSnapshot(item))){
      if(sale.normalized_unit==='butir')available-=Number(sale.normalized_quantity||0);
      else if(sale.unit==='butir')available-=Number(sale.quantity||0);
    }
  } else if(unit==='peti'&&!kgPerPeti){
    available=baselineRows.filter(item=>item.unit==='peti').reduce((sum,item)=>sum+Number(item.quantity||0),0);
    if(!snapshotDate)notes.push('Belum ada snapshot saldo peti');
    for(const report of state.reports.filter(item=>item.farm_id===farmId&&item.date<=date&&afterSnapshot(item)))
      notes.push('Produksi kg tidak dapat dikonversi ke peti');
    for(const sale of state.sales.filter(item=>item.id!==excludeSaleId&&item.farm_id===farmId&&(item.stock_category||stockRuleFor(farmId,item.category)?.stock_category)===category&&item.status==='Dibayar'&&item.date<=date&&afterSnapshot(item))){
      if(sale.normalized_unit==='peti')available-=Number(sale.normalized_quantity||0);
      else if(sale.unit==='peti'&&!Number(sale.normalized_quantity))available-=Number(sale.quantity||0);
    }
  } else {
    const compatible=baselineRows.filter(item=>item.unit==='kg'||(item.unit==='peti'&&kgPerPeti));
    available=compatible.reduce((sum,item)=>sum+Number(item.quantity||0)*(item.unit==='peti'?kgPerPeti:1),0);
    if(!snapshotDate)notes.push('Estimasi dari produksi yang tercatat; belum ada saldo awal');
    if(baselineRows.some(item=>item.unit==='peti'&&!kgPerPeti)){known=false;notes.push('Peti belum dapat dikonversi ke kg');}
    if(baselineRows.some(item=>item.unit==='butir'))notes.push('Snapshot butir dipisahkan, tidak dijumlahkan ke kg');
    const field=category.toLocaleLowerCase();
    for(const report of state.reports.filter(item=>item.farm_id===farmId&&item.date<=date&&afterSnapshot(item)))available+=Number(report[field]||0);
    for(const sale of state.sales.filter(item=>item.id!==excludeSaleId&&item.farm_id===farmId&&item.status==='Dibayar'&&item.date<=date&&afterSnapshot(item)&&((item.stock_category||stockRuleFor(farmId,item.category)?.stock_category)===category))){
      let amount=Number(sale.normalized_quantity),normalizedUnit=sale.normalized_unit;
      if(!normalizedUnit){const normalized=normalizeSaleForStock(farmId,sale.category,sale.quantity,sale.unit);amount=normalized.normalized_quantity;normalizedUnit=normalized.normalized_unit;}
      if(normalizedUnit==='kg')available-=amount;
      else if(normalizedUnit==='peti'&&kgPerPeti)available-=amount*kgPerPeti;
    }
  }
  if(!rule)notes.push('Aturan kategori belum dikonfigurasi');
  else if(!rule.conversion_confirmed&&rule.kg_per_peti)notes.push(`Konversi asumsi ${num(rule.kg_per_peti,2)} kg/peti belum disahkan`);
  const requested=unit==='peti'&&kgPerPeti?available/kgPerPeti:available;
  return {available:requested,unit,known,snapshotDate,notes:[...new Set(notes)],rule};
}
function renderStockAvailability() {
  const farms=selectedFarm==='semua'?state.farms.filter(farm=>farm.status==='Beroperasi'):state.farms.filter(farm=>farm.id===selectedFarm);
  const cards=farms.flatMap(farm=>{
    const categories=[...new Set(state.stockRules.filter(rule=>rule.farm_id===farm.id&&rule.stock_category).map(rule=>rule.stock_category))];
    return categories.map(category=>{const position=stockPosition(farm.id,category,'kg');const crateRule=state.stockRules.find(rule=>rule.farm_id===farm.id&&rule.stock_category===category&&Number(rule.kg_per_peti)>0);const crates=crateRule&&position.known?position.available/Number(crateRule.kg_per_peti):null;return `<div class="stock-available-card"><div><b>${esc(farm.name)} · ${esc(category)}</b><small>${position.snapshotDate?`Saldo dasar ${dateLabel(position.snapshotDate)}`:'Belum ada snapshot awal'}</small></div><strong>${position.known?`${num(position.available,2)} kg`:'Perlu konversi'}</strong>${crates!==null?`<small>≈ ${num(crates,2)} peti · ${num(crateRule.kg_per_peti,2)} kg/peti${crateRule.conversion_confirmed?'':' (asumsi)'}</small>`:''}<small>${esc(position.notes.join(' · ')||'Saldo mencakup produksi setelah snapshot dan penjualan dibayar.')}</small></div>`;});
  }).join('');
  return `<article class="panel stock-available-panel"><div class="panel-heading"><div><h3>Stok tersedia setelah penjualan dibayar</h3><p>Saldo per kategori: snapshot terakhir + sortir produksi setelah snapshot − penjualan berstatus Dibayar.</p></div></div>${cards?`<div class="stock-available-grid">${cards}</div>`:'<div class="empty-state">Aturan hubungan kategori belum tersedia. Admin dapat mengaturnya di bawah.</div>'}<p class="muted-note">Untuk transaksi pada tanggal snapshot yang sama, urutan waktu catatannya dipakai bila tersedia. Peti dan kg hanya dikonversi memakai aturan farm.</p></article>`;
}
function renderStockRulesPanel() {
  if(!canViewAllFarms()) return '';
  if(backend==='supabase'&&!stockRulesReady) return `<article class="panel"><div class="panel-heading"><div><h3>Hubungan penjualan dan stok</h3><p>Jalankan migrasi untuk mengaktifkan aturan stok bersama.</p></div></div><p class="muted-note">Jalankan <b>supabase/sales-stock-link.sql</b> di Supabase SQL Editor. Setelah itu muat ulang aplikasi.</p></article>`;
  const farms=selectedFarm==='semua'?state.farms:state.farms.filter(f=>f.id===selectedFarm);
  const rows=state.stockRules.filter(rule=>farms.some(f=>f.id===rule.farm_id)).sort((a,b)=>String(farmById(a.farm_id)?.name).localeCompare(String(farmById(b.farm_id)?.name))||a.sale_category.localeCompare(b.sale_category));
  return `<article class="panel stock-rules-panel"><div class="panel-heading"><div><h3>Aturan kategori dan konversi</h3><p>Aturan ini menentukan stok yang berkurang ketika penjualan berstatus Dibayar.</p></div><button class="btn btn-sm btn-soft" data-action="add-stock-rule">＋ Tambah aturan</button></div>${rows.length?`<div class="table-wrap"><table class="data-table"><thead><tr><th>Lokasi</th><th>Kategori penjualan</th><th>Mengurangi stok</th><th>Konversi peti</th><th></th></tr></thead><tbody>${rows.map(rule=>`<tr><td>${esc(farmById(rule.farm_id)?.name||'—')}</td><td><b>${esc(rule.sale_category)}</b></td><td>${esc(rule.stock_category||'Belum ditautkan')}</td><td>${rule.kg_per_peti?`${num(rule.kg_per_peti,2)} kg/peti · ${rule.conversion_confirmed?'Disahkan':'Asumsi'}`:'Belum diatur'}</td><td>${canManageFarm(rule.farm_id)?`<button class="btn btn-sm" data-action="edit-stock-rule" data-id="${esc(rule.id)}">Ubah</button>`:'—'}</td></tr>`).join('')}</tbody></table></div>`:'<div class="empty-state">Belum ada aturan kategori untuk lokasi ini.</div>'}<p class="muted-note">Produksi sortir SU/JB/TC menambah stok kategori kg setelah snapshot. Telur mentah tidak dianggap otomatis sudah dikemas menjadi peti.</p></article>`;
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
    <div class="section-kicker"><h2>Stok telur saat ini</h2><span>Snapshot fisik dan saldo terhitung ditampilkan terpisah</span></div>${renderStockAvailability()}${dashboardStockSnapshotPanel()}
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
  return `${heading('CATATAN HARIAN','Produksi & sortir','Simpan jumlah butir, berat, hasil sortir, pakan, populasi, KPI laporan, dan screenshot sumber.', '<button class="btn btn-primary" data-action="new-report">＋ Catat produksi</button>')}<div class="filters">${farmSelect()}<span class="muted-note">Kosong berbeda dari nol · KPI laporan terpisah dari hasil hitung</span></div><article class="panel"><div class="panel-heading"><div><h3>Riwayat catatan produksi</h3><p>${rows.length} laporan tersimpan · urut terbaru</p></div><button class="btn btn-sm" data-action="export-production">Ekspor CSV</button></div><div class="table-wrap"><table class="data-table"><thead><tr><th>Tanggal</th><th>Lokasi</th><th>Telur</th><th>Berat (kg)</th><th>Tot (kg)</th><th>SU</th><th>JB</th><th>TC</th><th>Susut</th><th>HD laporan</th><th>FI laporan</th><th>FCR laporan</th><th>Bukti</th><th>Status</th><th>Tindakan</th></tr></thead><tbody>${rows.map(r=>{const attachments=state.reportAttachments.filter(a=>a.report_id===r.id);return `<tr><td><b>${dateLabel(r.date)}</b></td><td>${esc(farmById(r.farm_id)?.name || '—')}</td><td>${maybeNum(r.eggs)} butir</td><td>${maybeNum(r.kg,2)} kg</td><td>${maybeNum(r.total_reported_kg,2)} kg</td><td>${maybeNum(r.su,2)} kg</td><td>${maybeNum(r.jb,2)} kg</td><td>${maybeNum(r.tc,2)} kg</td><td>${maybeNum(r.sst,2)} kg</td><td>${maybeNum(r.hd_reported,2)}%</td><td>${maybeNum(r.fi_reported,2)} g</td><td>${maybeNum(r.fcr_reported,2)}</td><td>${attachments.length?`<button class="btn btn-sm" data-action="view-report-attachment" data-id="${esc(attachments[0].id)}">Lihat (${attachments.length})</button>`:'—'}</td><td>${statusBadge(r.status||'Dikirim')}</td><td>${canManageFarm(r.farm_id)?`<div class="row-actions"><button class="btn btn-sm" data-action="edit-report" data-id="${esc(r.id)}">Edit</button><button class="btn btn-sm btn-danger" data-action="delete-report" data-id="${esc(r.id)}">Hapus</button></div>`:'—'}</td></tr>`}).join('') || '<tr><td colspan="14" class="empty-state">Belum ada catatan produksi.</td></tr>'}</tbody></table></div></article><div class="page-grid" style="margin-top:13px"><article class="panel"><div class="panel-heading"><div><h3>Memahami KPI</h3><p>Nilai laporan dan hasil perhitungan ditampilkan terpisah</p></div></div><div class="setting-list"><div class="setting-row"><span>HD / HDP — telur ÷ ayam hidup × 100%</span><b>${rows.at(0)?.hd_reported!=null?`${num(rows.at(0).hd_reported,2)}% dilaporkan`:rows.at(0)?.birds?`${num(rows.at(0).eggs/rows.at(0).birds*100,2)}% dihitung`:'Belum dicatat'}</b></div><div class="setting-row"><span>FI — konsumsi pakan rata-rata (umumnya per ekor per hari)</span><b>${rows.at(0)?.fi_reported!=null?`${num(rows.at(0).fi_reported,2)} g dilaporkan`:'Belum dicatat'}</b></div><div class="setting-row"><span>Berat telur rata-rata</span><b>${rows.at(0)?.ew_reported!=null?`${num(rows.at(0).ew_reported,2)} g/butir dilaporkan`:rows.at(0)?.eggs?`${num(rows.at(0).kg*1000/rows.at(0).eggs,2)} g/butir dihitung`:'Belum dicatat'}</b></div><div class="setting-row"><span>FCR — kg pakan ÷ kg massa telur</span><b>${rows.at(0)?.fcr_reported!=null?`${num(rows.at(0).fcr_reported,2)} dilaporkan`:rows.at(0)?.kg&&rows.at(0)?.feed?`${num(rows.at(0).feed/rows.at(0).kg,2)} dihitung`:'Belum dicatat'}</b></div></div><p class="muted-note">HD, FI, FCR, dan berat telur dapat disimpan persis sebagai angka yang dilaporkan. Basis FI belum dicantumkan pada sumber. Populasi serta pakan total tetap perlu untuk menghitung ulang KPI.</p></article><article class="panel"><div class="panel-heading"><div><h3>Istilah lain dalam catatan</h3><p>Nilai mentah dipertahankan sampai basisnya dikonfirmasi.</p></div></div><div class="review-list"><div class="review-item"><span class="review-icon">?</span><div><b>HH · padanan terdekat: HHP/HHEP</b><p>Produksi berbasis jumlah ayam awal. Unit dan metode nilai HH 54.51 belum diketahui, jadi disimpan sebagai teks sumber.</p></div></div></div></article></div>`;
}

function renderStock() {
  const sales = state.sales.filter(s => selectedFarm === 'semua' || s.farm_id === selectedFarm).sort((a,b)=>b.date.localeCompare(a.date));
  return `${heading('PERGERAKAN TELUR','Stok & penjualan','Stok tersedia dihitung dari saldo snapshot, produksi sortir setelah snapshot, dan penjualan dibayar.', '<button class="btn btn-primary" data-action="new-stock">＋ Catat saldo stok</button><button class="btn" data-action="new-sale">Catat penjualan</button>')}<div class="filters">${farmSelect()}<span class="muted-note">Peti dikonversi hanya dengan aturan lokasi yang dapat diubah admin.</span></div>${renderStockAvailability()}${stockSnapshotPanel()}${renderStockRulesPanel()}<div class="page-grid" style="margin-top:13px"><article class="panel"><div class="panel-heading"><div><h3>Memahami saldo stok</h3><p>Perhitungan kategori mengikuti data yang tersedia</p></div></div><div class="stock-example"><b>Stok fisik + produksi sortir − penjualan dibayar</b><span>Rencana / perlu verifikasi belum mengurangi saldo</span><span>Telur Jumbo → JB · Telur bagus → SU · Telur retak → TC</span></div><p class="muted-note">Pemetaan dan asumsi 15 kg/peti Cikalong bisa diubah admin. Saldo terhitung adalah estimasi; catat snapshot baru untuk rekonsiliasi fisik.</p><p class="muted-note">Produksi butir/kg mentah tidak otomatis dikemas menjadi peti. Gunakan saldo PT dan catatan pengemasan yang sah untuk penjualan dalam peti.</p></article><article class="panel"><div class="panel-heading"><div><h3>Riwayat penjualan</h3><p>Nilai asli dan satuan transaksi tetap disimpan. Hanya Dibayar mengurangi stok.</p></div><button class="btn btn-sm" data-action="export-sales">Ekspor CSV</button></div><div class="table-wrap"><table class="data-table"><thead><tr><th>Tanggal</th><th>Lokasi</th><th>Pelanggan</th><th>Kategori</th><th>Jumlah</th><th>Setara stok</th><th>Nilai</th><th>Metode bayar</th><th>Status</th><th>Tindakan</th></tr></thead><tbody>${sales.map(s=>`<tr><td><b>${dateLabel(s.date)}</b></td><td>${esc(farmById(s.farm_id)?.name||'—')}</td><td>${esc(s.customer || '—')}</td><td>${esc(s.category)}</td><td>${num(s.quantity,2)} ${esc(s.unit)}</td><td>${esc(saleStockDisplay(s))}</td><td>${Number(s.amount)?rupiah(s.amount):'Belum dicatat'}</td><td>${esc(s.payment_method||'Belum dicatat')}</td><td>${statusBadge(s.status || 'Dibayar')}</td><td>${canManageFarm(s.farm_id)?`<div class="row-actions"><button class="btn btn-sm" data-action="edit-sale" data-id="${esc(s.id)}">Edit</button><button class="btn btn-sm btn-danger" data-action="delete-sale" data-id="${esc(s.id)}">Hapus</button></div>`:'—'}</td></tr>`).join('') || '<tr><td colspan="10" class="empty-state">Belum ada penjualan.</td></tr>'}</tbody></table></div></article></div>`;
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
  return `${heading('REFERENSI FARM','Kamus istilah','Cari singkatan, istilah almanak, dan padanan lokal. Istilah lokal yang belum disahkan tidak otomatis masuk hitungan.', '<button class="btn btn-primary" data-action="add-term">＋ Tambah istilah</button>')}<div class="filters"><input class="input-control" style="max-width:360px" id="termSearch" placeholder="Cari singkatan atau istilah…" aria-label="Cari istilah"><span class="muted-note">${state.terms.length} istilah · almanak sebagai referensi, SOP farm sebagai penentu</span></div><div class="term-grid" id="termGrid">${state.terms.map(t=>`<article class="term-card" data-search="${esc(`${t.term} ${t.common} ${t.definition} ${t.rule}`.toLowerCase())}"><div style="display:flex;justify-content:space-between;gap:8px"><b>${esc(t.term)}</b><span class="pill">${esc(t.unit)}</span></div><p><strong>${esc(t.common)}</strong><br>${esc(t.definition)}</p><small>${esc(t.rule)}</small>${t.farm_id?`<small class="term-scope">Berlaku: ${esc(farmById(t.farm_id)?.name||'lokasi farm')}</small>`:''}</article>`).join('')||'<article class="panel empty-state">Belum ada istilah di kamus.</article>'}</div>`;
}

const auditSources = {
  daily_reports: { label: 'Produksi', rows: () => state.reports, edit: row => showReportForm(row) },
  sales: { label: 'Penjualan', rows: () => state.sales, edit: row => showSaleForm(row) },
  stock_snapshots: { label: 'Saldo stok', rows: () => state.stockSnapshots, edit: row => showStockEditForm(row) },
  farm_stock_rules: { label: 'Aturan kategori stok', rows: () => state.stockRules, edit: row => showStockRuleForm(row) },
  cash_transactions: { label: 'Kas & pengeluaran', rows: () => state.cash, edit: row => showCashForm(row) },
  farms: { label: 'Tempat produksi', rows: () => state.farms, edit: row => showFarmForm(row) },
  dictionary_terms: { label: 'Kamus istilah', rows: () => state.terms, edit: row => showTermForm(row) }
};
function auditActor(event) {
  const user = farmUsers.find(member => member.user_id === event.actor_id)?.profiles;
  return user?.full_name || user?.email || (event.actor_id === currentUser?.id ? currentUser.full_name || currentUser.email : 'Pengguna');
}
function auditChangeSummary(event) {
  const before = event.before_data || {}, after = event.after_data || {};
  if (!event.before_data) return Object.keys(after).filter(key => !['id','created_at','updated_at'].includes(key)).slice(0,5).map(key => `<span class="pill">${esc(key)}</span>`).join(' ');
  const changed = [...new Set([...Object.keys(before), ...Object.keys(after)])].filter(key => !['id','created_at','updated_at'].includes(key) && JSON.stringify(before[key]) !== JSON.stringify(after[key]));
  return changed.slice(0,6).map(key => `<span class="pill">${esc(key)}</span>`).join(' ') || '<span class="muted-note">Tanpa perubahan kolom</span>';
}
function auditDetails(event) {
  const before=event.before_data||{},after=event.after_data||{};
  const keys=[...new Set([...Object.keys(before),...Object.keys(after)])].filter(key=>!['id','created_at','updated_at'].includes(key));
  const changed=event.action==='insert'?keys:keys.filter(key=>JSON.stringify(before[key])!==JSON.stringify(after[key]));
  const value=x=>x===null||x===undefined?'—':typeof x==='object'?JSON.stringify(x):String(x);
  return `<details class="audit-details"><summary>Lihat nilai ${changed.length?'( '+changed.length+' kolom )':''}</summary><div class="audit-values">${changed.map(key=>`<div><b>${esc(key)}</b><span>${event.action==='insert'?'':esc(value(before[key])+' → ') + ' '}${esc(value(after[key]))}</span></div>`).join('')||'<span class="muted-note">Tidak ada nilai detail pada event ini.</span>'}</div></details>`;
}
function auditSourceRow(event) {
  const source = auditSources[event.entity_table];
  return source?.rows().find(row => row.id === event.entity_id) || null;
}
async function editAuditRecord(table,id) {
  if(!canViewAllFarms()){toast('Halaman ini hanya tersedia untuk admin.',true);return;}
  const source=auditSources[table]; if(!source){toast('Jenis data ini belum dapat diedit dari log.',true);return;}
  let record=source.rows().find(row=>row.id===id);
  if(!record&&backend==='supabase'&&supabase){
    const {data,error}=await supabase.from(table).select('*').eq('id',id).maybeSingle();
    if(error){toast(`Data sumber gagal dimuat: ${error.message}`,true);return;}
    record=data;
    if(record&&table==='daily_reports')record={...record,status:record.status==='disetujui'?'Disetujui':record.status==='draf'?'Draf':'Dikirim'};
    if(record){const key=table==='daily_reports'?'reports':table==='sales'?'sales':table==='cash_transactions'?'cash':table==='stock_snapshots'?'stockSnapshots':table==='farm_stock_rules'?'stockRules':table==='farms'?'farms':'terms';state[key].push(record);}
  }
  if(record)source.edit(record);else toast('Data sumber sudah tidak tersedia untuk diedit.',true);
}
function renderLogs() {
  if (!canViewAllFarms()) return `${heading('AKTIVITAS TIM','Log input','Halaman ini hanya tersedia untuk admin.')}`;
  const farmFilter = $('#logsFarmFilter')?.value || 'semua';
  const rows = state.auditEvents.filter(event => farmFilter === 'semua' || event.farm_id === farmFilter)
    .slice().sort((a,b) => String(b.created_at).localeCompare(String(a.created_at)));
  const actionLabel = action => ({insert:'Input baru',update:'Diperbarui',delete:'Dihapus'}[action] || action);
  return `${heading('AKTIVITAS TIM','Log input','Telusuri siapa yang mencatat atau mengubah data. Koreksi dilakukan pada data sumber dan tercatat sebagai aktivitas baru.')}<div class="filters"><label class="filter-label" for="logsFarmFilter">Lokasi</label><div class="select-wrap"><select class="select-control" id="logsFarmFilter"><option value="semua" ${farmFilter==='semua'?'selected':''}>Semua lokasi</option>${state.farms.map(f=>`<option value="${esc(f.id)}" ${farmFilter===f.id?'selected':''}>${esc(f.name)}</option>`).join('')}</select></div><span class="muted-note">${rows.length} aktivitas terakhir · hingga 500 catatan</span></div><article class="panel"><div class="table-wrap"><table class="data-table audit-table"><thead><tr><th>Waktu</th><th>Pengguna</th><th>Lokasi</th><th>Data</th><th>Aktivitas / perubahan</th><th></th></tr></thead><tbody>${rows.map(event=>{const source=auditSources[event.entity_table], farm=event.farm_id?farmById(event.farm_id):null;const moment=event.created_at?new Date(event.created_at).toLocaleString('id-ID',{dateStyle:'medium',timeStyle:'short'}):'—';const canEdit=Boolean(source&&event.action!=='delete');return `<tr><td data-label="Waktu"><b>${esc(moment)}</b></td><td data-label="Pengguna">${esc(auditActor(event))}</td><td data-label="Lokasi">${esc(farm?.name||'Grup / umum')}</td><td data-label="Data">${esc(source?.label||event.entity_table)}<br><small class="muted-note">${esc(event.after_data?.date||event.after_data?.snapshot_date||'')}</small></td><td data-label="Aktivitas">${statusBadge(actionLabel(event.action))}<div class="audit-changes">${auditChangeSummary(event)}</div>${auditDetails(event)}${event.reason?`<small>${esc(event.reason)}</small>`:''}</td><td data-label="Tindakan">${canEdit?`<button class="btn btn-sm" data-action="edit-audit-record" data-table="${esc(event.entity_table)}" data-id="${esc(event.entity_id)}">Lihat / edit</button>`:event.action==='delete'?'<span class="muted-note">Sumber dihapus</span>':'<span class="muted-note">Sumber tidak tersedia</span>'}</td></tr>`;}).join('')||'<tr><td colspan="6" class="empty-state">Belum ada aktivitas audit yang dapat ditampilkan. Pastikan trigger audit sudah aktif dan data dicatat setelah trigger dipasang.</td></tr>'}</tbody></table></div></article>`;
}

function renderSettings() {
  const canManage=selectedFarm==='semua'?canViewAllFarms():canManageFarm();
  const canManageLocations=['manajer','admin_sistem'].includes(roleForFarm());
  const headerAction=canManageLocations?'<button class="btn btn-primary" data-action="new-farm">＋ Tambah lokasi</button>':'';
  const users=selectedFarm==='semua'?farmUsers:farmUsers.filter(m=>m.farm_id===selectedFarm);
  const userPanel=canManage?`<article class="panel" style="margin-bottom:13px"><div class="panel-heading"><div><h3>Pengguna & akses</h3><p>Staff dapat masuk dan mencatat data lokasi. Hanya admin yang dapat mengundang pengguna.</p></div><button class="btn btn-primary" data-action="invite-staff">＋ Tambah staff</button></div><div class="table-wrap"><table class="data-table"><thead><tr><th>Nama</th><th>Email</th><th>Lokasi</th><th>Peran</th><th>Akses akun</th></tr></thead><tbody>${users.map(m=>`<tr><td><b>${esc(m.profiles?.full_name||m.profiles?.email||'Pengguna')}</b></td><td>${esc(m.profiles?.email||'')}</td><td>${esc(farmById(m.farm_id)?.name||'—')}</td><td>${m.role==='petugas'?'Staff':esc(m.role)}</td><td>${m.user_id===currentUser?.id?'<span class="status">Aktif · Anda</span>':'<span class="status neutral">Terdaftar</span>'}</td></tr>`).join('')||'<tr><td colspan="5" class="empty-state">Daftar pengguna belum tersedia di mode demo.</td></tr>'}</tbody></table></div></article>`:selectedFarm==='semua'&&canViewAllFarms()?`<article class="panel" style="margin-bottom:13px"><div class="panel-heading"><div><h3>Pengguna & akses</h3><p>Akun admin dapat melihat seluruh lokasi.</p></div></div><p class="muted-note">Pilih lokasi tertentu untuk mengelola staff dan keanggotaannya.</p></article>`:`<article class="panel" style="margin-bottom:13px"><div class="panel-heading"><div><h3>Akses pengguna</h3><p>Peran Anda: Staff. Minta admin farm jika perlu menambah atau mengubah akses pengguna.</p></div><span class="pill">Staff</span></div><p class="muted-note">Pembuatan akun hanya melalui undangan admin. Tidak ada pendaftaran mandiri.</p></article>`;
  return `${heading('KONFIGURASI','Pengaturan farm','Kelola tempat produksi, pengguna, dan koneksi data.', headerAction)}<div class="filters"><span class="filter-label">Lokasi aktif</span>${farmSelect()}</div>${userPanel}<article class="panel" style="margin-bottom:13px"><div class="panel-heading"><div><h3>Tempat produksi</h3><p>Lokasi nonoperasional tidak masuk agregat produksi aktif.</p></div><span class="pill">${state.farms.length} lokasi</span></div><div class="setting-list">${state.farms.map(f=>`<div class="location-card"><div><h3>${esc(f.name)} <span class="pill">${esc(f.code)}</span></h3><p>${esc(f.region)} · ${f.start_date?`mulai operasi ${dateLabel(f.start_date)}`:'tanggal operasi belum ditetapkan'} · ${esc(f.responsible||'Belum ada penanggung jawab')}</p></div><div style="display:flex;align-items:center;gap:8px">${statusBadge(f.status)}${canManageLocations?`<button class="btn btn-sm" data-action="edit-farm" data-id="${esc(f.id)}">Kelola</button>`:''}</div></div>`).join('')}</div></article><div class="page-grid"><article class="panel"><div class="panel-heading"><div><h3>Penyimpanan</h3><p>Mode aktif untuk sesi ini</p></div><span class="connection-indicator ${backend==='supabase'?'connected':'offline'}"><i></i>${backend==='supabase'?'Supabase':'Lokal'}</span></div><p class="muted-note">${backend==='supabase'?'Data aplikasi dimuat dan disimpan melalui Supabase. Akses dibatasi berdasarkan keanggotaan lokasi.':'Data disimpan pada browser ini untuk pratinjau.'}</p></article><article class="panel"><div class="panel-heading"><div><h3>Konfigurasi awal</h3><p>Nilai yang masih perlu disahkan farm</p></div></div><div class="setting-list"><div class="setting-row"><span>Konversi peti ke kg</span><b>Belum disahkan</b></div><div class="setting-row"><span>Kandang / flock</span><b>Belum disiapkan</b></div><div class="setting-row"><span>Saldo awal stok</span><b>Belum direkonsiliasi</b></div><div class="setting-row"><span>Peran aktif</span><b>${roleForDisplay()==='petugas'?'Staff':esc(roleForDisplay()||'Tidak ada akses')}</b></div></div></article></div>`;
}

const views = { ringkasan: ['Ringkasan', renderDashboard], produksi: ['Produksi', renderProduction], stok: ['Stok & Penjualan', renderStock], kas: ['Kas & Pengeluaran', renderCash], laporan: ['Laporan', renderReports], kamus: ['Kamus istilah', renderDictionary], logs: ['Log input', renderLogs], pengaturan: ['Pengaturan', renderSettings] };
function render() {
  const logsLink=$('#logsNavLink'); if(logsLink)logsLink.hidden=!canViewAllFarms();
  if(view==='logs'&&!canViewAllFarms()){view='ringkasan';history.replaceState(null,'',`${location.pathname}${location.search}#ringkasan`);}
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
  const logsFarmFilter=$('#logsFarmFilter'); if(logsFarmFilter)logsFarmFilter.addEventListener('change',render);
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
async function viewReportAttachment(id) {
  if(!supabase){toast('Lampiran tersedia saat Supabase terhubung.',true);return;}
  const attachment=state.reportAttachments.find(item=>item.id===id);
  if(!attachment){toast('Lampiran tidak ditemukan. Muat ulang data lalu coba lagi.',true);return;}
  const {data,error}=await supabase.storage.from('report-screenshots').createSignedUrl(attachment.storage_path,300);
  if(error){toast(`Screenshot tidak dapat dibuka: ${error.message}`,true);return;}
  openModal(attachment.filename,'Screenshot laporan produksi · tautan aman berlaku 5 menit.',`<div class="attachment-viewer"><img src="${esc(data.signedUrl)}" alt="${esc(attachment.filename)}"></div><div class="form-actions"><a class="btn btn-primary" href="${esc(data.signedUrl)}" target="_blank" rel="noopener">Buka gambar</a><button class="btn" data-close="true">Tutup</button></div>`);
}
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && $('#modalRoot .modal')) closeModal();
});
function formField(label, name, type = 'text', value = '', opts = {}) {
  const attrs = `${opts.required ? 'required' : ''} ${opts.readonly ? 'readonly' : ''} ${opts.step ? `step="${opts.step}"` : ''} ${opts.min !== undefined ? `min="${opts.min}"` : ''} ${opts.max ? `max="${opts.max}"` : ''} ${opts.placeholder ? `placeholder="${esc(opts.placeholder)}"` : ''}`;
  const control = type === 'textarea' ? `<textarea name="${name}" ${attrs}>${esc(value)}</textarea>` : `<input class="input-control" name="${name}" type="${type}" value="${esc(value)}" ${attrs}>`;
  return `<div class="field ${opts.full ? 'full' : ''}"><label>${label}${opts.required ? ' *' : ''}</label>${control}${opts.help ? `<small>${opts.help}</small>` : ''}</div>`;
}
function selectField(label, name, options, value = '', full = false, required = false) {
  return `<div class="field ${full ? 'full' : ''}"><label>${label}</label><div class="select-wrap"><select class="input-control" name="${name}" ${required ? 'required' : ''}>${options.map(item=>{const [optionValue,optionLabel]=Array.isArray(item)?item:[item,item];return `<option value="${esc(optionValue)}" ${optionValue===value?'selected':''}>${esc(optionLabel)}</option>`}).join('')}</select></div></div>`;
}
function renderReportImageQueue() {
  const host=$('#reportImagePreview'); if(!host)return;
  host.innerHTML=pendingReportImages.map((file,index)=>`<div class="report-image-item"><img src="${esc(URL.createObjectURL(file))}" alt="Pratinjau ${esc(file.name)}"><span>${esc(file.name)}</span><button type="button" class="btn btn-sm btn-danger" data-action="remove-report-image" data-index="${index}">Hapus</button></div>`).join('')||'<span class="muted-note">Belum ada screenshot dipilih.</span>';
}
function addReportImages(files) {
  const accepted=[];
  for(const file of files){
    if(!['image/jpeg','image/png','image/webp','image/gif'].includes(file.type)){toast(`${file.name}: gunakan PNG, JPG, WEBP, atau GIF.`,true);continue;}
    if(file.size>10*1024*1024){toast(`${file.name}: ukuran maksimal 10 MB.`,true);continue;}
    if(pendingReportImages.length+accepted.length>=5){toast('Maksimal 5 screenshot per laporan.',true);break;}
    accepted.push(file);
  }
  pendingReportImages.push(...accepted);renderReportImageQueue();
}
function showReportForm(existing=null) {
  pendingReportImages=[];
  const opts = state.farms.map(f=>[f.id,`${f.name} · ${f.status}`]);
  const v=existing||{};
  const savedAttachments=state.reportAttachments.filter(a=>a.report_id===v.id);
  openModal(existing?'Edit laporan produksi':'Catat produksi harian','Produksi, KPI yang dilaporkan, dan hasil hitung disimpan terpisah.', `<form id="reportForm" class="form-grid">${selectField('Lokasi','farm_id',opts,v.farm_id||(selectedFarm==='semua'?defaultFarmId():selectedFarm))}${formField('Tanggal operasi','date','date',v.date||today(),{required:true})}${formField('Telur dihasilkan','eggs','number',v.eggs??'',{required:true,min:0,step:'1',help:'Masukkan jumlah butir; kg dicatat terpisah.'})}${formField('Berat telur utama (kg)','kg','number',v.kg??'',{required:true,min:0,step:'0.01'})}${formField('Tot. dilaporkan (kg)','total_reported_kg','number',v.total_reported_kg??'',{min:0,step:'0.01',help:'Total mentah dari pesan petugas; disimpan terpisah dari berat utama.'})}${formField('SU · sisa utuh (kg)','su','number',v.su??'',{min:0,step:'0.01'})}${formField('JB · jumbo (kg)','jb','number',v.jb??'',{min:0,step:'0.01'})}${formField('TC · telur cair/rusak (kg)','tc','number',v.tc??'',{min:0,step:'0.01'})}${formField('SST · susut (kg)','sst','number',v.sst??'',{step:'0.01',help:'Nilai bertanda disimpan sesuai input; isi alasan bila ada.'})}${formField('Ayam hidup (ekor)','birds','number',v.birds??'',{min:0,step:'1'})}${formField('Pakan tercatat (kg)','feed','number',v.feed??'',{min:0,step:'0.01',help:'Pakan total untuk menghitung FCR; FI yang dilaporkan diisi terpisah.'})}${formField('HD / HDP dilaporkan (%)','hd_reported','number',v.hd_reported??'',{min:0,max:100,step:'0.01',help:'Persentase dari catatan petugas; tidak dihitung ulang.'})}${formField('FI dilaporkan (gram; basis belum dikonfirmasi)','fi_reported','number',v.fi_reported??'',{min:0,step:'0.01',help:'Feed Intake; umumnya g/ekor/hari, tetapi basis catatan Anda belum dipastikan.'})}${formField('Berat telur dilaporkan (g/butir)','ew_reported','number',v.ew_reported??'',{min:0,step:'0.01'})}${formField('FCR dilaporkan','fcr_reported','number',v.fcr_reported??'',{min:0,step:'0.01',help:'Feed Conversion Ratio; nilai laporan terpisah dari FCR hitungan.'})}${formField('HH dilaporkan (teks)','hh_reported','text',v.hh_reported??'',{placeholder:'Contoh: 54.51',help:'Satuan/metode HH belum dipastikan; simpan angka mentah sebagai teks.'})}${formField('Catatan / teks mentah','note','textarea',v.note||'',{full:true,placeholder:'Kode atau notasi yang belum dipetakan dapat disimpan di sini.'})}<div class="field full"><label>Screenshot sumber</label><div id="reportDropzone" class="report-dropzone" tabindex="0"><input id="reportImagePicker" type="file" accept="image/*" multiple hidden><button type="button" class="btn btn-sm" data-action="choose-report-image">Pilih gambar</button><span>atau tempel screenshot (Ctrl+V) / tarik file ke area ini</span><small>Maksimal 5 gambar, 10 MB per gambar.</small></div><div id="reportImagePreview" class="report-image-list"></div>${savedAttachments.length?`<div class="report-saved-files"><b>Screenshot tersimpan</b>${savedAttachments.map(a=>`<button type="button" class="btn btn-sm" data-action="view-report-attachment" data-id="${esc(a.id)}">${esc(a.filename)}</button>`).join('')}</div>`:''}</div><div class="form-actions"><button type="button" class="btn" data-close="true">Batal</button><button class="btn btn-primary">${existing?'Simpan koreksi':'Simpan laporan'}</button></div></form>`);
  const form=$('#reportForm'), picker=$('#reportImagePicker'), dropzone=$('#reportDropzone');
  picker.addEventListener('change',()=>{addReportImages([...picker.files]);picker.value='';});
  form.addEventListener('paste',e=>{const files=[...(e.clipboardData?.items||[])].filter(item=>item.type.startsWith('image/')).map(item=>item.getAsFile()).filter(Boolean);if(files.length){e.preventDefault();addReportImages(files);}});
  for(const eventName of ['dragover','drop'])dropzone.addEventListener(eventName,e=>{e.preventDefault();if(eventName==='drop')addReportImages([...e.dataTransfer.files]);});
  form.addEventListener('submit', async e=>{
    e.preventDefault();const button=form.querySelector('button.btn-primary');button.disabled=true;button.textContent='Menyimpan…';
    const f=Object.fromEntries(new FormData(form));const optionalNumber=x=>x===''?null:Number(x);const row={...v,id:v.id||crypto.randomUUID(),farm_id:f.farm_id,date:f.date,eggs:Number(f.eggs),kg:Number(f.kg),total_reported_kg:optionalNumber(f.total_reported_kg),su:optionalNumber(f.su),jb:optionalNumber(f.jb),tc:optionalNumber(f.tc),sst:optionalNumber(f.sst),birds:optionalNumber(f.birds),feed:optionalNumber(f.feed),hd_reported:optionalNumber(f.hd_reported),fi_reported:optionalNumber(f.fi_reported),ew_reported:optionalNumber(f.ew_reported),fcr_reported:optionalNumber(f.fcr_reported),hh_reported:f.hh_reported.trim()||null,note:f.note,status:v.status||'Dikirim'};
    try {
      await saveRecord('reports',row,existing?'update':'insert');
      if(pendingReportImages.length){
        if(backend!=='supabase'||!supabase)throw new Error('Screenshot hanya dapat diunggah setelah Supabase terhubung. Laporan sudah tersimpan; edit lagi untuk mencoba unggah screenshot.');
        const actor=(await supabase.auth.getUser()).data.user?.id;
        for(const file of [...pendingReportImages]){const ext=(file.name.split('.').pop()||file.type.split('/')[1]||'png').toLowerCase().replace(/[^a-z0-9]/g,'')||'png';const path=`${row.farm_id}/${row.id}/${crypto.randomUUID()}.${ext}`;const uploaded=await supabase.storage.from('report-screenshots').upload(path,file,{contentType:file.type,upsert:false});if(uploaded.error)throw uploaded.error;const inserted=await supabase.from('daily_report_attachments').insert({report_id:row.id,farm_id:row.farm_id,storage_path:path,filename:file.name,content_type:file.type,size_bytes:file.size,uploaded_by:actor}).select('*').single();if(inserted.error){await supabase.storage.from('report-screenshots').remove([path]);throw inserted.error;}state.reportAttachments.unshift(inserted.data);pendingReportImages=pendingReportImages.filter(item=>item!==file);renderReportImageQueue();}
      }
      closeModal();render();toast(existing?'Laporan produksi diperbarui.':'Laporan produksi tersimpan.');
    }catch(error){console.error('Gagal menyimpan laporan produksi',error);toast(`Laporan tersimpan sebagian atau gagal: ${error.message}`,true);button.disabled=false;button.textContent=existing?'Simpan koreksi':'Simpan laporan';}
  });
  renderReportImageQueue();
}
function showStockRuleForm(existing=null) {
  const current=existing||{};
  const farms=state.farms.filter(f=>canManageFarm(f.id));
  if(!farms.length){toast('Admin lokasi diperlukan untuk mengubah aturan stok.',true);return;}
  const farmOpts=farms.map(f=>[f.id,f.name]);
  const targetFarm=current.farm_id||(selectedFarm!=='semua'&&canManageFarm(selectedFarm)?selectedFarm:farms[0].id);
  openModal(existing?'Ubah aturan stok':'Tambah aturan stok','Pemetaan berlaku untuk penjualan di lokasi ini. Konversi peti dapat dibiarkan sebagai asumsi sampai disahkan.',`<form id="stockRuleForm" class="form-grid">${selectField('Lokasi','farm_id',farmOpts,targetFarm)}${formField('Nama kategori penjualan','sale_category','text',current.sale_category||'',{required:true,placeholder:'Contoh: Telur kampung'})}${selectField('Kurangi kategori stok','stock_category',[['','Belum ditautkan'],'PT','SU','JB','TC','TU','LAINNYA'],current.stock_category||'')}${formField('Berat per peti (kg)','kg_per_peti','number',current.kg_per_peti??'',{min:0.001,step:'0.001',help:'Kosongkan bila peti belum punya konversi yang disahkan.'})}<div class="field full"><label><input type="checkbox" name="conversion_confirmed" ${current.conversion_confirmed?'checked':''}> Konversi peti ini sudah dikonfirmasi admin farm</label><small>Nilai awal 15 kg/peti di Cikalong adalah asumsi dari nota 2 peti = 30 kg.</small></div><div class="form-actions"><button type="button" class="btn" data-close="true">Batal</button><button class="btn btn-primary">Simpan aturan</button></div></form>`);
  $('#stockRuleForm').addEventListener('submit',async e=>{e.preventDefault();const f=Object.fromEntries(new FormData(e.currentTarget));const farm=farmById(f.farm_id);if(!farm||!canManageFarm(farm.id)){toast('Anda tidak memiliki hak admin untuk lokasi tersebut.',true);return;}const saleCategory=f.sale_category.trim();if(!saleCategory){toast('Isi kategori penjualan.',true);return;}const duplicate=state.stockRules.find(r=>r.farm_id===farm.id&&r.sale_category.toLocaleLowerCase()===saleCategory.toLocaleLowerCase()&&r.id!==current.id);if(duplicate){toast('Kategori ini sudah memiliki aturan. Edit aturan yang ada.',true);return;}const peti=f.kg_per_peti===''?null:Number(f.kg_per_peti);if(peti!==null&&(!Number.isFinite(peti)||peti<=0)){toast('Berat per peti harus lebih dari nol.',true);return;}const row={...current,id:current.id||crypto.randomUUID(),farm_id:farm.id,sale_category:saleCategory,stock_category:f.stock_category||null,kg_per_peti:peti,conversion_confirmed:$('#stockRuleForm [name="conversion_confirmed"]').checked};try{await saveRecord('stockRules',row,existing?'update':'insert');closeModal();render();toast(existing?'Aturan stok diperbarui.':'Aturan stok ditambahkan.');}catch{}});
}
function showSaleForm(existing=null) {
  if(backend==='supabase'&&!stockRulesReady){toast('Jalankan supabase/sales-stock-link.sql sebelum mencatat penjualan yang terhubung ke stok.',true);return;}
  const v=existing||{};
  const editableFarms=state.farms.filter(f=>backend==='local'||memberships.some(m=>m.farm_id===f.id));
  const farmOpts=editableFarms.map(f=>[f.id,`${f.name} · ${f.status}`]);
  const defaultFarm=v.farm_id||(selectedFarm==='semua'?defaultFarmId():selectedFarm);
  const categoriesFor=farmId=>[...new Set(state.stockRules.filter(r=>r.farm_id===farmId).map(r=>r.sale_category).concat(v.category||[]).filter(Boolean))].sort((a,b)=>a.localeCompare(b));
  const categories=categoriesFor(defaultFarm);if(!categories.length)categories.push('Belum dipetakan');
  const categoryOptions=categories.map(category=>{const rule=stockRuleFor(defaultFarm,category);return [category,rule?.stock_category?`${category} → ${rule.stock_category}`:`${category} · belum dipetakan`];});
  if(!categoryOptions.some(([value])=>value===v.category)&&v.category)categoryOptions.unshift([v.category,v.category]);
  const initialStatus=v.status||'Dibayar';
  openModal(existing?'Edit penjualan':'Catat penjualan','Satuan mentah tetap disimpan. Penjualan dibayar mengurangi stok setelah konversi kategori diperhitungkan.',`<form id="saleForm" class="form-grid">${selectField('Lokasi','farm_id',farmOpts,defaultFarm)}${formField('Tanggal penjualan','date','date',v.date||today(),{required:true})}${formField('Pelanggan','customer','text',v.customer||'',{placeholder:'Opsional'})}${selectField('Kategori','category',categoryOptions,v.category||categories[0])}${formField('Jumlah','quantity','number',v.quantity??'',{required:true,min:0.001,step:'0.001'})}${selectField('Satuan','unit',['kg','butir','peti'],v.unit||'kg')}${formField('Nilai penjualan (Rp)','amount','number',v.amount??'',{min:0,step:'1',help:'Harga/pembayaran opsional.'})}${selectField('Metode pembayaran','payment_method',['Belum dicatat','Tunai','Transfer bank','E-wallet'],v.payment_method||'Belum dicatat')}${selectField('Status','status',['Dibayar','Direncanakan','Perlu verifikasi','Dibatalkan'],initialStatus)}<div id="saleStockPreview" class="sale-stock-preview full" aria-live="polite"></div>${formField('Catatan / surat jalan','note','textarea',v.note||'',{full:true})}<div class="form-actions"><button type="button" class="btn" data-close="true">Batal</button><button class="btn btn-primary">${existing?'Simpan koreksi':'Simpan penjualan'}</button></div></form>`);
  const form=$('#saleForm');
  const updateCategoryOptions=(farmId,selected)=>{const select=form.elements.category;select.innerHTML=categoriesFor(farmId).map(category=>{const rule=stockRuleFor(farmId,category);return `<option value="${esc(category)}" ${category===selected?'selected':''}>${esc(rule?.stock_category?`${category} → ${rule.stock_category}`:`${category} · belum dipetakan`)}</option>`}).join('');if(!select.value&&select.options.length)select.selectedIndex=0;};
  const syncQuantityPrecision=()=>{const whole=form.elements.unit.value==='butir';form.elements.quantity.min=whole?'1':'0.001';form.elements.quantity.step=whole?'1':'0.001';};
  const updatePreview=()=>{const farmId=form.elements.farm_id.value,category=form.elements.category.value,quantity=Number(form.elements.quantity.value||0),unit=form.elements.unit.value,status=form.elements.status.value,date=form.elements.date.value||today();const normalized=normalizeSaleForStock(farmId,category,quantity,unit);const box=$('#saleStockPreview');if(!normalized.stock_category){box.innerHTML='<b>Kategori belum ditautkan ke stok.</b><span>Admin perlu membuat pemetaan pada menu Stok & Penjualan.</span>';return;}const position=stockPosition(farmId,normalized.stock_category,normalized.normalized_unit||unit,date,existing?.id||null);const deduct=status==='Dibayar'?Number(normalized.normalized_quantity||0):0;const after=position.available-deduct;const rule=normalized.rule;const explanation=unit==='peti'&&normalized.normalized_unit==='kg'?`${num(quantity,2)} peti × ${num(rule.kg_per_peti,2)} kg/peti = ${num(normalized.normalized_quantity,2)} kg`: `${num(quantity,2)} ${unit} = ${num(normalized.normalized_quantity,2)} ${normalized.normalized_unit}`;box.innerHTML=`<b>${esc(normalized.stock_category)} · ${esc(explanation)}</b><span>Stok tersedia sebelum transaksi: ${position.known?`${num(position.available,2)} ${esc(position.unit)}`:'Perlu konfirmasi satuan'}${position.snapshotDate?` (saldo dasar ${dateLabel(position.snapshotDate)})`:''}</span><span>${status==='Dibayar'?`Perkiraan saldo setelah dibayar: ${num(after,2)} ${esc(position.unit)}`:'Belum mengurangi stok sampai status Dibayar.'}</span>${rule?.kg_per_peti&&!rule.conversion_confirmed?'<em>Konversi peti masih asumsi admin.</em>':''}${after<-.0001&&status==='Dibayar'?'<em class="stock-error">Jumlah melebihi stok tersedia. Kurangi jumlah atau catat/koreksi saldo stok terlebih dahulu.</em>':''}${position.notes.length?`<small>${esc(position.notes.join(' · '))}</small>`:''}`;};
  form.elements.farm_id.addEventListener('change',()=>{updateCategoryOptions(form.elements.farm_id.value,'');updatePreview();});
  ['category','quantity','unit','status','date'].forEach(name=>form.elements[name].addEventListener('input',updatePreview));
  form.elements.category.addEventListener('change',updatePreview);form.elements.unit.addEventListener('change',()=>{syncQuantityPrecision();updatePreview();});form.elements.status.addEventListener('change',updatePreview);syncQuantityPrecision();updatePreview();
  form.addEventListener('submit',async e=>{e.preventDefault();const f=Object.fromEntries(new FormData(form));const quantity=Number(f.quantity),normalized=normalizeSaleForStock(f.farm_id,f.category,quantity,f.unit);if(!normalized.stock_category){toast('Kategori belum ditautkan ke stok. Admin dapat mengaturnya di menu Stok & Penjualan.',true);return;}if(normalized.rule?.kg_per_peti&&!normalized.rule.conversion_confirmed&&f.unit==='peti'&&!window.confirm(`Konversi ${num(normalized.rule.kg_per_peti,2)} kg/peti masih berstatus asumsi. Lanjutkan dan simpan nilai konversi ini pada transaksi?`))return;if(f.status==='Dibayar'){const position=stockPosition(f.farm_id,normalized.stock_category,normalized.normalized_unit||f.unit,f.date,existing?.id||null);const available=position.available;if(position.known&&(position.snapshotDate||state.reports.some(r=>r.farm_id===f.farm_id&&r.date<=f.date))&&Number(normalized.normalized_quantity)>available+.0001){toast(`Stok ${normalized.stock_category} tidak cukup: tersedia ${num(available,2)} ${position.unit}, diminta ${num(normalized.normalized_quantity,2)} ${normalized.normalized_unit}.`,true);return;}}const row={...v,id:v.id||crypto.randomUUID(),farm_id:f.farm_id,date:f.date,customer:f.customer||null,category:f.category,quantity,unit:f.unit,amount:Number(f.amount||0),payment_method:f.payment_method,status:f.status,note:f.note||'',stock_category:normalized.stock_category,normalized_quantity:normalized.normalized_quantity,normalized_unit:normalized.normalized_unit,created_at:v.created_at||new Date().toISOString()};try{await saveRecord('sales',row,existing?'update':'insert');closeModal();render();toast(existing?'Penjualan diperbarui.':'Penjualan tersimpan.');}catch{}});
}
function showStockForm() {
  const farmOpts=state.farms.map(f=>[f.id,`${f.name} · ${f.status}`]);
  const rows=[['PT','Peti (PT)','peti'],['TU','TU · Telur utuh (padanan terdekat SU)','kg'],['TC','Telur cair (TC)','kg'],['JB','Jumbo (JB)','kg'],['SU','Sisa utuh (SU)','kg']];
  openModal('Catat saldo stok','Masukkan saldo fisik yang terlihat pada tanggal snapshot. Setiap kategori dan satuan disimpan terpisah.',`<form id="stockForm" class="form-grid">${selectField('Lokasi','farm_id',farmOpts,selectedFarm==='semua'?defaultFarmId():selectedFarm)}${formField('Tanggal saldo','snapshot_date','date',today(),{required:true})}${rows.map(([category,label,unit])=>formField(`${label} · ${unit}` ,category,'number','',{min:0,step:'0.01',placeholder:'Kosong jika tidak diketahui'})).join('')}${formField('Catatan / teks asli','note','textarea','',{full:true,placeholder:'Contoh: Stok 40pt · Tu 7.4kg · Tc 7.98kg · Jb 4.6kg'})}<div class="form-actions"><button type="button" class="btn" data-close="true">Batal</button><button class="btn btn-primary">Simpan saldo</button></div></form>`);
  $('#stockForm').addEventListener('submit',async e=>{e.preventDefault();const f=Object.fromEntries(new FormData(e.currentTarget));const snapshotRows=rows.filter(([category])=>f[category]!== '').map(([category,,unit])=>({id:crypto.randomUUID(),farm_id:f.farm_id,snapshot_date:f.snapshot_date,category,quantity:Number(f[category]),unit,note:f.note||''}));if(!snapshotRows.length){toast('Isi setidaknya satu saldo stok.',true);return;}try{await Promise.all(snapshotRows.map(row=>saveRecord('stockSnapshots',row,'upsert')));$('#modalRoot').innerHTML='';render();toast('Saldo stok tersimpan.');}catch{}}
  );
}
function showStockEditForm(snapshot) {
  if(!snapshot)return;
  const farmOpts=state.farms.map(f=>[f.id,`${f.name} · ${f.status}`]);
  const categoryLabels={PT:'Peti (PT)',TU:'TU · belum dipetakan',TC:'Telur cair (TC)',JB:'Jumbo (JB)',SU:'Sisa utuh (SU)',LAINNYA:'Lainnya'};
  openModal('Edit saldo stok','Koreksi saldo snapshot sumber. Riwayat awal tetap tersimpan pada log audit.',`<form id="stockEditForm" class="form-grid">${selectField('Lokasi','farm_id',farmOpts,snapshot.farm_id)}${formField('Tanggal saldo','snapshot_date','date',snapshot.snapshot_date,{required:true})}${formField('Kategori','category','text',snapshot.category,{required:true,readonly:true})}${formField('Jumlah saldo','quantity','number',snapshot.quantity,{required:true,min:0,step:'0.01'})}${selectField('Satuan','unit',['peti','kg','butir'],snapshot.unit)}${formField('Catatan / alasan koreksi','note','textarea',snapshot.note||'',{full:true,required:true})}<div class="form-actions"><button type="button" class="btn" data-close="true">Batal</button><button class="btn btn-primary">Simpan koreksi</button></div></form>`);
  $('#stockEditForm').addEventListener('submit',async e=>{e.preventDefault();const f=Object.fromEntries(new FormData(e.currentTarget));const row={...snapshot,...f,quantity:Number(f.quantity)};await saveRecord('stockSnapshots',row,'update');closeModal();render();toast('Saldo stok diperbarui.');});
}
function showCashForm(existing=null) {
 const farmOpts=state.farms.map(f=>[f.id,`${f.name} · ${f.status}`]);
 const v=existing||{};
 openModal(existing?'Edit transaksi kas':'Tambah transaksi kas','Pembayaran kepada penerima eksternal dicatat sebagai kas keluar. Transfer internal dicatat terpisah.',`<form id="cashForm" class="form-grid">${formField('Tanggal','date','date',v.date||today(),{required:true})}${formField('Jumlah (Rp)','amount','number',v.amount??'',{required:true,min:1,step:'1'})}${formField('Penerima','recipient','text',v.recipient||'',{required:true,placeholder:'Tukang, pekerja, pemasok…'})}${selectField('Kategori','category',['Upah/tenaga kerja','Alat','Kandang/pembangunan','Operasional','Lainnya'],v.category||'Operasional')}${formField('Tujuan / keterangan','purpose','text',v.purpose||'',{required:true,full:true})}${selectField('Metode','method',['Transfer bank','E-wallet','Tunai','Pindah dana internal'],v.method||'Tunai')}${selectField('Status','status',['Dibayar','Direncanakan','Perlu verifikasi','Dibatalkan'],v.status||'Dibayar')}${selectField('Cakupan','scope',['Grup Cikalong','Lokasi produksi','Proyek pembangunan','Umum/Grup lain','Pindah dana internal'],v.scope||'Lokasi produksi')}${selectField('Lokasi / proyek','farm_id',farmOpts,v.farm_id|| (selectedFarm==='semua'?defaultFarmId():selectedFarm))}${formField('Referensi transfer','reference','text',v.reference||'',{placeholder:'Opsional'})}${formField('Catatan','note','textarea',v.note||'',{full:true})}<div class="form-actions"><button type="button" class="btn" data-close="true">Batal</button><button class="btn btn-primary">${existing?'Simpan koreksi':'Simpan transaksi'}</button></div></form>`);
 $('#cashForm').addEventListener('submit',async e=>{e.preventDefault();const f=Object.fromEntries(new FormData(e.currentTarget));const farm=farmById(f.farm_id);const groupScope=['Grup Cikalong','Umum/Grup lain','Pindah dana internal'].includes(f.scope);const row={...v,id:v.id||crypto.randomUUID(),...f,amount:Number(f.amount),farm_id:groupScope?null:f.farm_id,scope_name:groupScope?'':farm?.name||''};await saveRecord('cash',row,existing?'update':'insert');closeModal();render();toast(existing?'Transaksi diperbarui.':'Transaksi kas tersimpan.');});
}
function showFarmForm(farm=null) {
 openModal(farm?'Kelola tempat produksi':'Tambah tempat produksi',farm?'Perubahan status dan lokasi tidak menghapus catatan historis.':'Tambahkan lokasi baru. Lokasi nonoperasional tidak masuk agregat produksi aktif.',`<form id="farmForm" class="form-grid">${formField('Nama lokasi','name','text',farm?.name||'',{required:true})}${formField('Kode unik','code','text',farm?.code||'',{required:true})}${formField('Alamat / wilayah','region','text',farm?.region||'',{required:true})}${selectField('Zona waktu','timezone',['Asia/Jakarta','Asia/Makassar','Asia/Jayapura'],farm?.timezone||'Asia/Jakarta')}${selectField('Status','status',['Pembangunan','Persiapan','Beroperasi','Jeda','Ditutup'],farm?.status||'Pembangunan')}${formField('Tanggal mulai operasi','start_date','date',farm?.start_date||'')}${formField('Penanggung jawab','responsible','text',farm?.responsible||'')}${farm?formField('Catatan perubahan','change_note','text','',{required:true,full:true,placeholder:'Alasan perubahan status atau detail lokasi'}):''}<div class="form-actions"><button type="button" class="btn" data-close="true">Batal</button><button class="btn btn-primary">${farm?'Simpan perubahan':'Buat lokasi'}</button></div></form>`);
 $('#farmForm').addEventListener('submit',async e=>{e.preventDefault();const f=Object.fromEntries(new FormData(e.currentTarget));if(state.farms.some(x=>x.code.toLowerCase()===f.code.toLowerCase()&&x.id!==farm?.id)){toast('Kode lokasi sudah digunakan.',true);return;}const row={id:farm?.id||crypto.randomUUID(),...farm,...f};await saveRecord('farms',row,farm?'update':'insert');$('#modalRoot').innerHTML='';render();toast(farm?'Detail lokasi diperbarui.':'Lokasi berhasil ditambahkan.');});
}
function showTermForm(existing=null){const v=existing||{};openModal(existing?'Edit istilah':'Tambah istilah','Simpan arti lokal, unit, dan aturan penggunaan yang sudah dikonfirmasi.',`<form id="termForm" class="form-grid">${formField('Istilah / singkatan','term','text',v.term||'',{required:true})}${formField('Nama umum','common','text',v.common||'',{required:true})}${formField('Definisi','definition','textarea',v.definition||'',{required:true,full:true})}${formField('Unit','unit','text',v.unit||'',{required:true})}${formField('Aturan / dampak','rule','textarea',v.rule||'',{full:true})}<div class="form-actions"><button type="button" class="btn" data-close="true">Batal</button><button class="btn btn-primary">${existing?'Simpan koreksi':'Tambah istilah'}</button></div></form>`);$('#termForm').addEventListener('submit',async e=>{e.preventDefault();const f=Object.fromEntries(new FormData(e.currentTarget));await saveRecord('terms',{...v,id:v.id||crypto.randomUUID(),...f},existing?'update':'insert');closeModal();render();toast(existing?'Istilah diperbarui.':'Istilah ditambahkan.');});}

function showInviteStaffForm() {
  if(!(selectedFarm==='semua'?canViewAllFarms():canManageFarm())){toast('Hanya admin yang dapat menambah staff.',true);return;}
  const farmOptions=[['','Pilih lokasi'],...state.farms.map(f=>[f.id,`${f.name} · ${f.status}`])];
  const selectedFarmId=selectedFarm==='semua'?'':selectedFarm;
  const suggestedStaffByCode={CKL:{full_name:'Staff Cikalong',email:'staff.cikalong@eggfarm.com'},SKN:{full_name:'Staff Sukanagara',email:'staff.sukanagara@eggfarm.com'}};
  let suggestion=farmById(selectedFarmId)?suggestedStaffByCode[farmById(selectedFarmId).code]||null:null;
  openModal('Undang staff','Pilih lokasi akses untuk staff. Undangan login akan dikirim melalui email.',`<form id="inviteStaffForm" class="form-grid">${formField('Nama staff','full_name','text',suggestion?.full_name||'',{required:true})}${formField('Email staff','email','email',suggestion?.email||'',{required:true,placeholder:'nama@farm.id'})}${selectField('Lokasi akses','farm_id',farmOptions,selectedFarmId,true,true)}<div class="field full"><small class="muted-note">Staff hanya dapat melihat dan mencatat data pada lokasi yang dipilih.</small></div><div class="form-actions"><button type="button" class="btn" data-close="true">Batal</button><button class="btn btn-primary">Kirim undangan</button></div></form>`);
  $('#inviteStaffForm select[name="farm_id"]').addEventListener('change',e=>{const nextFarm=farmById(e.currentTarget.value);const nextSuggestion=nextFarm?suggestedStaffByCode[nextFarm.code]||null:null;const fullNameInput=$('#inviteStaffForm [name="full_name"]');const emailInput=$('#inviteStaffForm [name="email"]');if(!fullNameInput.value||fullNameInput.value===suggestion?.full_name)fullNameInput.value=nextSuggestion?.full_name||'';if(!emailInput.value||emailInput.value===suggestion?.email)emailInput.value=nextSuggestion?.email||'';suggestion=nextSuggestion;});
  $('#inviteStaffForm').addEventListener('submit',async e=>{e.preventDefault();if(backend!=='supabase'||!supabase){toast('Undangan staff perlu koneksi Supabase.',true);return;}const f=Object.fromEntries(new FormData(e.currentTarget));const farm=farmById(f.farm_id);if(!farm){toast('Pilih lokasi akses untuk staff.',true);return;}const button=e.currentTarget.querySelector('button.btn-primary');button.disabled=true;button.textContent='Mengirim…';try{const {data,error}=await supabase.functions.invoke('admin-invite-user',{body:{email:f.email,full_name:f.full_name,farm_id:farm.id}});if(error||data?.error)throw new Error(error?.message||data?.error||'Undangan gagal dikirim.');}catch(error){console.error('Undangan staff gagal dikirim',error);const rawMessage=error.message||'Undangan gagal dikirim.';const message=rawMessage.includes('Failed to send a request to the Edge Function')?'Fungsi undangan belum dapat dijangkau. Pastikan admin-invite-user sudah di-deploy ke proyek Supabase.':rawMessage;toast(message,true);button.disabled=false;button.textContent='Kirim undangan';return;}closeModal();toast(`Undangan staff dikirim ke ${f.email}.`);await connectSupabase();});
}

async function saveRecord(table,row,operation='insert') {
  if (backend==='supabase' && supabase) {
    try {
      const dbTable=table==='cash'?'cash_transactions':table==='reports'?'daily_reports':table==='terms'?'dictionary_terms':table==='stockSnapshots'?'stock_snapshots':table==='stockRules'?'farm_stock_rules':table;
      const payload={...row};
      const actor=(await supabase.auth.getUser()).data.user?.id;
      if(table==='reports') { payload.house_id=null;payload.flock_id=null;if(operation!=='update')payload.created_by=actor;payload.status=payload.status.toLowerCase();payload.updated_at=new Date().toISOString(); }
      if((table==='sales'||table==='cash'||table==='stockSnapshots')&&operation!=='update') payload.created_by=actor;
      if(table==='terms'&&operation!=='update') payload.confirmed_by=actor;
      if(table==='stockRules') { payload.updated_by=actor;payload.updated_at=new Date().toISOString(); }
      if(table==='farms') { payload.start_date=payload.start_date||null;payload.updated_at=new Date().toISOString();delete payload.change_note; }
      if(table==='farms') { payload.timezone=payload.timezone||'Asia/Jakarta'; }
      const result=operation==='update'
        ?table==='sales'?await supabase.from(dbTable).update(payload).eq('id',row.id).select('id'):await supabase.from(dbTable).update(payload).eq('id',row.id)
        :operation==='upsert'?await supabase.from(dbTable).upsert(payload,{onConflict:'farm_id,snapshot_date,category,unit'}):await supabase.from(dbTable).insert(payload);
      if(result.error) throw result.error;
      if(operation==='update'&&table==='sales'&&!result.data?.length) throw new Error('Penjualan tidak tersimpan: tidak ada baris yang diperbarui. Periksa akses admin lokasi atau muat ulang data penjualan.');
      if(Object.hasOwn(auditSources,dbTable)){
        const auditResult=await supabase.from('audit_events').select('*').order('created_at',{ascending:false}).limit(500);
        if(!auditResult.error)state.auditEvents=auditResult.data||[];
      }
      if(table==='farms'&&operation==='insert') {
        const user=(await supabase.auth.getUser()).data.user;
        if(user){const membership=await supabase.from('farm_members').insert({farm_id:row.id,user_id:user.id,role:'admin_sistem'});if(membership.error)throw membership.error;}
      }
    } catch(error) { console.error(error); toast(`Supabase gagal menyimpan: ${error.message}`,true); throw error; }
  }
  const stateKey=table==='cash'?'cash':table;
  if(operation==='update') state[stateKey]=state[stateKey].map(item=>item.id===row.id?{...item,...row}:item);
  else if(table==='terms') state.terms.unshift(row);
  else if(table==='stockSnapshots'&&operation==='upsert') { const i=state.stockSnapshots.findIndex(s=>s.farm_id===row.farm_id&&s.snapshot_date===row.snapshot_date&&s.category===row.category&&s.unit===row.unit);if(i>=0)state.stockSnapshots[i]={...state.stockSnapshots[i],...row};else state.stockSnapshots.unshift(row); }
  else state[table].unshift(row);
  persist();
}

async function deleteRecord(table,id) {
  if(!['reports','sales'].includes(table)){toast('Jenis data ini tidak dapat dihapus dari sini.',true);return;}
  const rows=table==='reports'?state.reports:state.sales;
  const row=rows.find(item=>item.id===id);
  if(!row||!canManageFarm(row.farm_id)){toast('Hanya admin lokasi yang dapat menghapus data ini.',true);return;}
  const label=table==='reports'?'laporan produksi':'transaksi penjualan';
  if(!window.confirm(`Hapus ${label} tanggal ${dateLabel(row.date)}? Aksi ini menghapus data sumber. Perubahan dan nilai sebelum dihapus tetap tercatat di Log input.`))return;
  try{
    if(backend==='supabase'&&supabase){
      const dbTable=table==='reports'?'daily_reports':'sales';
      const result=await supabase.from(dbTable).delete().eq('id',id).select('id');
      if(result.error)throw result.error;
      if(!result.data?.length)throw new Error('Tidak ada baris yang terhapus. Periksa hak admin dan muat ulang data.');
      const auditResult=await supabase.from('audit_events').select('*').order('created_at',{ascending:false}).limit(500);
      if(!auditResult.error)state.auditEvents=auditResult.data||[];
    }
    if(table==='reports')state.reports=state.reports.filter(item=>item.id!==id);
    else state.sales=state.sales.filter(item=>item.id!==id);
    persist();render();toast(`${label[0].toUpperCase()+label.slice(1)} dihapus.`);
  }catch(error){console.error(error);toast(`Tidak dapat menghapus ${label}: ${error.message}`,true);}
}

function exportCsv(kind) {
  const maps={production:[state.reports,'Laporan produksi'],sales:[state.sales,'Penjualan'],cash:[state.cash,'Kas dan pengeluaran'],report:[filteredReports(),'Laporan periode']};
  const [rows,name]=maps[kind]; if(!rows.length){toast('Tidak ada data untuk diekspor.');return;}
  const keys=[...new Set(rows.flatMap(r=>Object.keys(r)))];
  const csv=[keys.join(','),...rows.map(row=>keys.map(key=>`"${String(row[key]??'').replaceAll('"','""')}"`).join(','))].join('\r\n');
  const blob=new Blob(['\ufeff'+csv],{type:'text/csv;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`${name.toLowerCase().replaceAll(' ','-')}-${today()}.csv`;a.click();URL.revokeObjectURL(url);toast('CSV berhasil diekspor.');
}
function connectionInfo() { openModal('Hubungkan Supabase','Aktifkan penyimpanan bersama untuk data farm.',`<div class="review-list"><p class="muted-note">Buat proyek Supabase, jalankan file <b>supabase/schema.sql</b> di SQL Editor, lalu salin <b>supabase-config.js.example</b> menjadi <b>supabase-config.js</b> dan isi Project URL serta anon/publishable key. Jangan gunakan service_role key pada browser.</p><p class="muted-note">Untuk stok penjualan, jalankan juga <b>supabase/sales-stock-link.sql</b>. File itu aman dijalankan ulang dan menambahkan pemetaan kategori serta kolom konversi penjualan.</p><p class="muted-note">Setelah halaman dimuat ulang, aplikasi memakai Supabase jika tabel tersedia dan konfigurasi valid. Mode browser lokal tetap menjadi pratinjau tanpa kredensial.</p><div class="form-actions"><button class="btn btn-primary" data-close="true">Mengerti</button></div></div>`); }

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
    const queries=[supabase.from('daily_reports').select('*').limit(500),supabase.from('sales').select('*').limit(500),supabase.from('cash_transactions').select('*').limit(500),supabase.from('dictionary_terms').select('*').limit(500),supabase.from('stock_snapshots').select('*').order('snapshot_date',{ascending:false}).limit(500),membershipQuery,profileQuery,supabase.from('audit_events').select('*').order('created_at',{ascending:false}).limit(500),supabase.from('daily_report_attachments').select('*').order('created_at',{ascending:false}).limit(1000)];
    const results=await Promise.all(queries);
    const error=results.find(r=>r.error)?.error; if(error) throw error;
    const [reports,sales,cash,terms,stock,members,profile,auditEvents,reportAttachments]=results.map(r=>r.data);
    memberships=members||[];farmUsers=memberships;
    const ownFarm=memberships.find(m=>m.user_id===currentUser.id)?.farm_id;
    selectedFarm=memberships.some(m=>adminRoles.includes(m.role))?'semua':ownFarm||farms[0]?.id||'semua';
    currentUser={...currentUser,...profile};
    state.stockSnapshots=stock||[];
    state.sales=sales||[];state.cash=cash||[];
    const rulesResult=await supabase.from('farm_stock_rules').select('*').order('farm_id').order('sale_category');
    if(rulesResult.error){if(['PGRST205','42P01'].includes(rulesResult.error.code)){stockRulesReady=false;state.stockRules=[];}else throw rulesResult.error;}
    else {stockRulesReady=true;state.stockRules=rulesResult.data||[];}
    const builtinTerms=defaultState().terms;
    const glossary=new Map(builtinTerms.map(term=>[`${term.term.trim().toLocaleUpperCase()}|`,term]));
    const builtinKeys=new Set(builtinTerms.map(term=>term.term.trim().toLocaleUpperCase()));
    (terms||[]).forEach(term=>{
      const normalized=term.term.trim().toLocaleUpperCase();
      if(term.farm_id)glossary.set(`${normalized}|${term.farm_id}`,term);
      else if(!builtinKeys.has(normalized))glossary.set(`${normalized}|`,term);
    });
    state.terms=[...glossary.values()];
    state.auditEvents=auditEvents||[];
    state.reportAttachments=reportAttachments||[];
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
  const action=e.target.closest('[data-action]'); if(action){const id=action.dataset.id;switch(action.dataset.action){case'new-report':showReportForm();break;case'edit-report':showReportForm(state.reports.find(row=>row.id===id));break;case'delete-report':deleteRecord('reports',id);break;case'choose-report-image':$('#reportImagePicker')?.click();break;case'remove-report-image':pendingReportImages.splice(Number(action.dataset.index),1);renderReportImageQueue();break;case'view-report-attachment':viewReportAttachment(id);break;case'new-sale':showSaleForm();break;case'edit-sale':showSaleForm(state.sales.find(row=>row.id===id));break;case'delete-sale':deleteRecord('sales',id);break;case'new-stock':showStockForm();break;case'add-stock-rule':showStockRuleForm();break;case'edit-stock-rule':showStockRuleForm(state.stockRules.find(row=>row.id===id));break;case'new-cash':showCashForm();break;case'new-farm':showFarmForm();break;case'edit-farm':showFarmForm(farmById(id));break;case'add-term':showTermForm();break;case'edit-audit-record':editAuditRecord(action.dataset.table,id);break;case'invite-staff':showInviteStaffForm();break;case'sign-out':if(supabase)supabase.auth.signOut().then(()=>{currentUser=null;memberships=[];farmUsers=[];showAuthForm();});break;case'export-production':exportCsv('production');break;case'export-sales':exportCsv('sales');break;case'export-cash':exportCsv('cash');break;case'export-report':exportCsv('report');break;case'print':window.print();break;case'connection-info':connectionInfo();break;}}
});
window.addEventListener('hashchange',()=>{view=location.hash.slice(1)||'ringkasan';render();});
$('#mobileMenu').addEventListener('click',()=>$('#sidebar').classList.toggle('open'));
$('#notificationButton').addEventListener('click',()=>toast('Ada laporan menunggu tinjauan dan istilah belum dipetakan.'));
state=loadLocal();
if(window.SUPABASE_CONFIG?.url){document.body.classList.add('auth-required');$('#pageContent').innerHTML='<div class="auth-loading">Menghubungkan ke Ruang Farm…</div>';connectSupabase();}
else render();
