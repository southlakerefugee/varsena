'use strict';
/* Varsena — Tahap 2: kota yang tumbuh.
   Petak bangun, konstruksi harian, rombongan pendatang, proyek jalur pangan,
   dan perjanjian dagang pangan dengan Gold Mines. */
window.V = window.V || {};
(function (V) {
  const A = V.art, P = A.P;

  /* ---------- jenis bangunan ---------- */
  const TYPES = {
    rumah: { name: 'Rumah Warga', cost: 250, work: 180, fits: ['petani', 'tukang'], desc: 'Tempat tinggal satu rombongan petani atau tukang, sekitar 30 jiwa.' },
    panggung: { name: 'Rumah Panggung', cost: 200, work: 180, fits: ['nelayan'], desc: 'Rumah di atas tiang di tepi danau untuk nelayan Kaum Amfibi. Menambah tangkapan ikan untuk kota.' },
    toko: { name: 'Toko dan Rumah Pedagang', cost: 400, work: 300, fits: ['pedagang'], desc: 'Lantai bawah toko, lantai atas tempat tinggal. Menambah pajak harian.' },
    lumbung: { name: 'Lumbung Pangan', cost: 300, work: 210, fits: [], desc: 'Gudang pangan yang kering dan terkunci. Cadangan pangan lebih awet dan lebih sulit dicuri.' }
  };
  const PLOT_ALLOW = { empty: ['rumah', 'toko', 'lumbung'], lake: ['panggung'], burnt: ['rumah', 'toko'] };
  const PLOTS = {
    kampung: [
      { id: 'p1', kind: 'empty', label: 'Petak kosong barat', r: [40, 320, 120, 72] },
      { id: 'p2', kind: 'empty', label: 'Petak kosong tengah', r: [190, 320, 120, 72] },
      { id: 'lake', kind: 'lake', label: 'Petak tepi danau', r: [470, 412, 120, 56] },
      { id: 'b1', kind: 'burnt', label: 'Rumah terbakar (bekas rumah penjahit)', r: [196, 140, 124, 26], house: [200, 110, 116] },
      { id: 'b2', kind: 'burnt', label: 'Rumah terbakar timur', r: [626, 140, 124, 26], house: [630, 110, 116] }
    ]
  };
  const plotById = id => { for (const m in PLOTS) for (const p of PLOTS[m]) if (p.id === id) return Object.assign({ map: m }, p); return null; };
  function costOf(plot, type) { const t = TYPES[type]; return plot.kind === 'burnt' ? { cost: Math.round(t.cost * .6), work: Math.round(t.work * .7) } : { cost: t.cost, work: t.work }; }

  /* ---------- proyek negara ---------- */
  const PROJECTS = {
    jalurDesa: { name: 'Buka Kembali Jalur Desa Barat', cost: 350, work: 300, desc: 'Perbaiki jembatan Sungai Tessin dan pasang pos jaga di jalan desa barat Brennhold. Hasil kebun dan ternak desa bisa sampai ke pasar, dan dijual ke Gold Mines.' },
    dermagaSL: { name: 'Dermaga dan Rumah Asap Ikan South Lake', cost: 300, work: 360, desc: 'Perbaiki dermaga desa nelayan di tepi selatan danau dan bangun rumah pengasapan, supaya ikan tahan berhari-hari dan bisa dikirim sampai Gold Mines.' }
  };
  /* ---------- pilihan perjanjian dengan Gold Mines ---------- */
  const DEALS = [
    { id: 'adil', name: 'Harga adil', advance: 300, daily: 40, gm: 15, kep: 2, text: 'Gold Mines membayar harga pasar yang wajar: uang muka 300 keping untuk pembangunan, lalu sekitar 40 keping per hari setelah jalur pangan dibuka.' },
    { id: 'muka', name: 'Dana pembangunan di muka', advance: 800, daily: 20, gm: 5, kep: 1, text: 'Minta 800 keping di muka untuk membangun ibu kota sekarang juga. Sebagai gantinya, harga harian lebih murah: sekitar 20 keping per hari.' },
    { id: 'tinggi', name: 'Harga tinggi', advance: 200, daily: 70, gm: -20, kep: -1, text: 'Manfaatkan kebutuhan Gold Mines: sekitar 70 keping per hari. Isam terpaksa setuju, tapi dia tidak akan lupa.' }
  ];

  /* ---------- rombongan pendatang ---------- */
  const ORIGIN = {
    petani: ['Desa Halden', 'Desa Mirefold', 'Lembah Tessin', 'Desa Orrow', 'Desa Kalvin'],
    tukang: ['Greenleaf', 'Fort Wendel', 'Desa Orrow', 'Twin River'],
    nelayan: ['Twin River', 'Desa Tepi Doran', 'Muara Tessin'],
    pedagang: ['Kairos', 'Twin River', 'Gold Mines', 'South Lake']
  };
  const LEADERS = {
    petani: ['Pak Harun', 'Bu Lisbet', 'Pak Odran', 'Bu Wenna', 'Pak Teo'],
    tukang: ['Mandor Gavran', 'Bu Ressa', 'Pak Ilmar'],
    nelayan: ['Ulu', 'Pebbo', 'Moora'],
    pedagang: ['Tuan Varo', 'Nyonya Kessa', 'Fennic']
  };
  const WISH = {
    petani: 'Kami petani. Kami butuh Rumah Warga, sebaiknya dekat ladang.',
    tukang: 'Kami tukang batu dan kayu. Beri kami Rumah Warga, dan kami akan ikut membangun kota ini.',
    nelayan: 'Kaum kami nelayan. Kami butuh Rumah Panggung di tepi danau. Rumah di darat terlalu kering.',
    pedagang: 'Kami pedagang. Beri kami Toko, dan pasar Brennhold akan ramai lagi.'
  };
  function groupSpec(g) {
    const r = A.rng(g.seed), pick = a => a[Math.floor(r() * a.length)];
    const skins = ['#f1c7a0', '#e2b08a', '#c99068', '#b07a52', '#f6d2b4'], hairs = ['#3a2a1e', '#5a3a24', '#1e1a18', '#a9542e', '#c8a060'];
    if (g.kind === 'nelayan') return { hm: .9, wm: 1.05, skin: pick(['#5fae9e', '#6aa8b8', '#7ab08a']), belly: '#c4e6cc', hairStyle: 'none', fins: pick(['#3d7fa0', '#4a6aa0', '#3a8a6a']), eye: '#1a2a3a', bigEye: true, outfit: '#5fae9e', vest: pick(['#d9c27a', '#c98a5a', '#8ab0c0']), pants: '#5a6a7a', shoes: null, mouth: 'smile' };
    if (g.kind === 'pedagang' && r() < .5) return { hm: .86, skin: pick(['#d9782e', '#c86a3a', '#e0a050']), muzzle: '#f3e2c4', hairStyle: 'none', ears: true, tail: true, eye: '#2a1a10', outfit: pick(['#2f5a6a', '#6a3a3a', '#4a6a3a']), trim: '#e0b84a', pants: '#4a3a2a', shoes: '#3a2a20', scarf: pick(['#d0b070', '#8a3a30']), mouth: 'smile' };
    const base = { hm: .9 + r() * .1, wm: .9 + r() * .2, skin: pick(skins), hair: pick(hairs), eye: '#2a1e16', pants: pick(['#4a4038', '#3a3a40', '#5a4a3a']), shoes: '#3a2a20', mouth: 'smile' };
    if (g.kind === 'petani') return Object.assign(base, { hairStyle: 'hat', hat: pick(['#e2c27a', '#c8a860']), outfit: pick(['#b36a3a', '#7a8a4a', '#8a6a4a']) });
    if (g.kind === 'tukang') return Object.assign(base, { hairStyle: 'short', outfit: pick(['#6f7f5a', '#7a6a5a', '#5a6a7a']), vest: '#8a6446', scarf: '#d0b070' });
    return Object.assign(base, { hairStyle: pick(['short', 'bun']), outfit: pick(['#6a4a8a', '#2f5a6a', '#7a2e3a']), trim: '#e0b84a' });
  }

  /* ---------- keadaan awal & migrasi simpanan ---------- */
  function ensure(s) {
    s.workers = s.workers || 6; s.hire = !!s.hire;
    s.builds = s.builds || {}; s.projects = s.projects || {};
    s.waiting = s.waiting || []; s.residents = s.residents || {};
    s.letters = s.letters || { isam: 'none' };
    s.deal = s.deal || null; s.gm = s.gm == null ? 50 : s.gm;
    s.southLake = s.southLake || 0; s.dealIncome = s.dealIncome || 0;
    s.nextGroup = s.nextGroup || 1; s.jobSeq = s.jobSeq || 1;
    s.today = s.today || []; s.arriveT = s.arriveT || 0;
    // simpanan lama (kerja dalam "hari-kerja") diubah ke detik nyata
    const fix = j => { if (j && !j.done && !j.sec) { const f = j.prog / j.work; j.work = 180; j.prog = f * 180; j.sec = true; j.order = j.order || s.jobSeq++; } };
    for (const k in s.builds) fix(s.builds[k]); for (const k in s.projects) fix(s.projects[k]);
    if (!s.waiting.length && !s.flags.seeded) { s.flags.seeded = true; s.waiting.push(newGroup(s, A.rng(99), 'petani'), newGroup(s, A.rng(7), 'tukang')); }
    return s;
  }
  const absDay = s => s.day + s.season * 30 + (s.year - 1) * 120;
  function newGroup(s, rand, kind) {
    if (!kind) { const w = [['petani', s.projects.jalurDesa && s.projects.jalurDesa.done ? 5 : 3], ['tukang', 2], ['nelayan', s.projects.dermagaSL && s.projects.dermagaSL.done ? 3 : 1.5], ['pedagang', s.deal ? 2.5 : 1]]; let t = w.reduce((a, b) => a + b[1], 0) * rand(); kind = w.find(x => (t -= x[1]) < 0)[0]; }
    const id = s.nextGroup++; const pick = a => a[Math.floor(rand() * a.length)];
    return { id, kind, origin: pick(ORIGIN[kind]), leader: pick(LEADERS[kind]), size: 18 + Math.floor(rand() * 22), day: absDay(s), seed: id * 97 + 13 };
  }

  /* ---------- tindakan pemain ----------
     Lama pembangunan dihitung dalam detik nyata (seperti Metropolismania):
     dengan 6 pekerja, rumah selesai sekitar 3 menit, toko sekitar 5 menit. */
  function canBuild(s, plotId, type) { const p = plotById(plotId); const c = costOf(p, type); return s.stats.kas >= c.cost && !s.builds[plotId]; }
  function startBuild(s, plotId, type) {
    const p = plotById(plotId), c = costOf(p, type);
    if (s.stats.kas < c.cost || s.builds[plotId]) return false;
    s.stats.kas -= c.cost; s.builds[plotId] = { type, work: c.work, prog: 0, done: false, sec: true, order: s.jobSeq++ };
    return true;
  }
  function startProject(s, id) {
    const pr = PROJECTS[id]; if (s.projects[id] || s.stats.kas < pr.cost) return false;
    s.stats.kas -= pr.cost; s.projects[id] = { work: id === 'dermagaSL' && s.flags.ooloHelp ? Math.round(pr.work / 2) : pr.work, prog: 0, done: false, sec: true, order: s.jobSeq++ };
    return true;
  }
  function signDeal(s, id, byAldric) {
    const d = DEALS.find(x => x.id === id);
    s.deal = { id, daily: d.daily, advance: d.advance, pending: true, byAldric: !!byAldric };
    s.letters.isam = 'answered'; s.gm = Math.max(0, Math.min(100, s.gm + d.gm));
    s.stats.kepercayaan = Math.max(0, Math.min(100, s.stats.kepercayaan + d.kep));
  }
  function workforce(s) { return s.workers + (s.hire ? 4 : 0) + (s.flags.hassanHelp ? 4 : 0); }
  const teams = s => Math.max(1, Math.floor(workforce(s) / 3));
  const speed = s => 1 + (workforce(s) - 6) * .06;
  function activeJobs(s) {
    const j = [];
    for (const k in s.builds) if (!s.builds[k].done) j.push(s.builds[k]);
    for (const k in s.projects) if (!s.projects[k].done) j.push(s.projects[k]);
    return j.sort((a, b) => (a.order || 0) - (b.order || 0));
  }
  function isQueued(s, job) { return activeJobs(s).indexOf(job) >= teams(s); }
  function minutesLeft(s, job) { return Math.max(1, Math.ceil((job.work - job.prog) / speed(s) / 60)); }
  function etaText(s, job) {
    if (isQueued(s, job)) return 'menunggu tim kerja kosong';
    const m = minutesLeft(s, job); return m <= 1 ? 'kurang dari 1 menit lagi' : `sekitar ${m} menit lagi`;
  }

  /* ---------- proses berjalan (setiap frame saat bermain) ---------- */
  function moveIn(s, events) {
    const st = s.stats;
    for (const k in s.builds) {
      const b = s.builds[k]; if (!b.done || s.residents[k] || !TYPES[b.type].fits.length) continue;
      const gi = s.waiting.findIndex(g => TYPES[b.type].fits.includes(g.kind));
      if (gi < 0) continue;
      const g = s.waiting.splice(gi, 1)[0]; s.residents[k] = g;
      st.populasi += g.size; st.moral = Math.min(100, st.moral + 2); st.stabilitas = Math.min(100, st.stabilitas + 1);
      if (g.kind === 'tukang') s.workers += 2;
      const t = `Rombongan ${g.leader} dari ${g.origin} (${g.size} jiwa) pindah ke ${TYPES[b.type].name}.` + (g.kind === 'tukang' ? ' Dua tukang langsung ikut membangun.' : '');
      events.push(t); s.today.push(t);
    }
  }
  function tick(s, dt, rand) {
    const events = [], st = s.stats;
    const jobs = activeJobs(s), n = Math.min(teams(s), jobs.length), sp = speed(s);
    let changed = false;
    for (let i = 0; i < n; i++) {
      const j = jobs[i]; j.prog += dt * sp;
      const step = Math.floor(j.prog / j.work * 4); if (step !== j.step) { j.step = step; changed = true; }
      if (j.prog >= j.work) {
        j.done = true; changed = true;
        let t;
        const bk = Object.keys(s.builds).find(k => s.builds[k] === j);
        if (bk) { t = `${TYPES[j.type].name} di ${plotById(bk).label.toLowerCase()} selesai dibangun!`; st.moral = Math.min(100, st.moral + 2); }
        else {
          const pk = Object.keys(s.projects).find(k => s.projects[k] === j);
          if (pk === 'jalurDesa') { t = 'Jalur desa barat dibuka kembali! Gerobak sayur dan domba mulai masuk ke pasar Brennhold.'; st.stabilitas = Math.min(100, st.stabilitas + 2); st.pangan += 2; }
          else { t = 'Dermaga dan rumah asap ikan South Lake selesai! Walikota Frederick mengirim ikan asap terbesar sebagai ucapan terima kasih.'; st.kepercayaan = Math.min(100, st.kepercayaan + 2); }
        }
        events.push(t); s.today.push(t);
      }
    }
    // rombongan baru datang sepanjang hari
    s.arriveT += dt;
    if (s.arriveT >= 45) {
      s.arriveT = 0;
      const chance = .3 + st.moral / 250 + (s.projects.jalurDesa && s.projects.jalurDesa.done ? .15 : 0);
      if (s.waiting.length < 5 && rand() < chance) { const g = newGroup(s, rand); s.waiting.push(g); const t = `Rombongan ${g.leader} dari ${g.origin} (${g.size} jiwa, ${g.kind}) tiba di alun-alun.`; events.push(t); s.today.push(t); changed = true; }
    }
    const before = s.waiting.length; moveIn(s, events); if (s.waiting.length !== before) changed = true;
    return { events, changed };
  }

  /* ---------- pergantian hari (otomatis pukul 24:00) ---------- */
  function daily(s, rand) {
    ensure(s);
    const notes = s.today.slice(), st = s.stats, today = absDay(s);
    s.today = [];
    if (s.hire) st.kas -= 32;
    for (const j of activeJobs(s)) {
      const k = Object.keys(s.builds).find(x => s.builds[x] === j);
      notes.push(`${k ? TYPES[j.type].name : PROJECTS[Object.keys(s.projects).find(x => s.projects[x] === j)].name}: ${Math.min(99, Math.round(j.prog / j.work * 100))}% (${etaText(s, j)}).`);
    }
    // surat Isam
    if (s.letters.isam === 'none' && today >= 1) { s.letters.isam = 'received'; notes.unshift('Surat dari Walikota Isam (Gold Mines): harga roti dan ikan di Gold Mines naik tiga kali lipat. Ia menawarkan kerja sama. Lihat di halaman Surat.'); }
    if (s.letters.isam === 'received' && s.delegasi === 'tinggi' && today >= 4) { signDeal(s, 'tinggi', true); notes.unshift('Aldric menjawab surat Walikota Isam atas namamu, dengan syarat harga tinggi. "Kebutuhan mereka adalah posisi tawar kita," tulisnya.'); }
    // perjanjian
    if (s.deal && s.deal.pending) {
      s.deal.pending = false; st.kas += s.deal.advance;
      const d = DEALS.find(x => x.id === s.deal.id);
      notes.unshift(`Utusan Gold Mines tiba membawa ${s.deal.advance} keping uang muka. Perjanjian "${d.name}" berlaku.` + (s.deal.id === 'tinggi' ? ' Isam menandatanganinya tanpa sepatah kata pun.' : ' Isam menulis: "Gold Mines tidak akan melupakan ini."'));
    } else if (s.deal) {
      const desa = s.projects.jalurDesa && s.projects.jalurDesa.done, ikan = s.projects.dermagaSL && s.projects.dermagaSL.done;
      let cap = 0, sl = 0;
      if (desa) cap += Math.round(s.deal.daily * .5 * (.9 + rand() * .2));
      if (ikan) { const f = Math.round(s.deal.daily * .5 * (.9 + rand() * .2)); cap += Math.round(f * .4); sl += f - Math.round(f * .4); }
      if (cap || sl) { st.kas += cap; s.southLake += sl; s.dealIncome += cap; notes.push(`Penjualan pangan ke Gold Mines: kas ibu kota +${cap} keping${sl ? `, South Lake +${sl} keping` : ''}.`); }
      else if (today % 2 === 0) notes.push('Perjanjian dengan Gold Mines sudah ditandatangani, tapi pangan belum bisa dikirim. Jalur desa barat dan dermaga South Lake masih rusak.');
      if (s.deal.id === 'tinggi' && today % 5 === 0) { notes.push('Pedagang Gold Mines mengeluh soal harga pangan dari Brennhold. Hubungan dengan Gold Mines memburuk.'); s.gm = Math.max(0, s.gm - 2); }
    }
    // efek bangunan
    let fish = 0, shop = 0, barn = false;
    for (const k in s.builds) { const b = s.builds[k]; if (!b.done) continue; if (b.type === 'panggung' && s.residents[k]) fish++; if (b.type === 'toko' && s.residents[k]) shop++; if (b.type === 'lumbung') barn = true; }
    if (fish) st.pangan += fish;
    if (shop) st.kas += shop * 15;
    if (barn && rand() < .5) st.pangan += 1;
    // rombongan yang terlalu lama menunggu pergi
    for (let i = s.waiting.length - 1; i >= 0; i--) { const g = s.waiting[i]; if (today - g.day >= 2) { s.waiting.splice(i, 1); st.moral = Math.max(0, st.moral - 2); notes.push(`Rombongan ${g.leader} dari ${g.origin} pergi ke Twin River karena tidak mendapat tempat tinggal.`); } }
    return notes;
  }

  /* ---------- gambar bangunan ---------- */
  function houseArt(type, prog, w) {
    w = w || 100;
    const W = w + 28, H = 132, c = A.canvas(W, H), k = A.kit(c.getContext('2d'), w * 7 + (type || 'x').length);
    const a = 14, wy = 66, base = H - 4;
    if (type === 'site') {
      k.shade(a, base - 4, w, 4, .25);
      for (const [sx, sy] of [[a, base - 2], [a + w - 2, base - 2]]) k.r(sx - 1, sy - 6, 3, 7, P.wood2);
      if (prog > .1) k.found(a - 2, wy + 40, w + 4, 6);
      if (prog > .25) { const top = wy + 40 - Math.min(1, (prog - .25) / .45) * 86; for (const px of [a, a + w / 2 - 1, a + w - 3]) { k.r(px, top, 3, wy + 40 - top, P.beam); k.r(px, top, 1, wy + 40 - top, A.light(P.beam, .25)); } k.r(a, top, w, 3, P.beam); }
      if (prog > .5) { const hh = Math.min(40, (prog - .5) / .3 * 40); k.wall(a, wy + 40 - hh, w, hh, P.plank, [w / 2 - 1]); }
      if (prog > .8) for (let i = 0; i < 7; i++) { const x0 = a + i * (w / 6); k.r(x0 - 1, wy - 40 + (i % 2) * 2, 2, 46, P.wood2); }
      // tumpukan bahan
      for (let i = 0; i < 5; i++) { k.r(W - 26, base - 6 - i * 3, 22, 2, A.light(P.wood, i * .04)); k.r(W - 26, base - 5 - i * 3, 22, 1, P.wood2); }
      for (let i = 0; i < 9; i++) k.r(2 + (i % 3) * 5, base - 5 - Math.floor(i / 3) * 3, 4, 3, i % 2 ? P.stone : A.dark(P.stone, .2));
      k.r(a + w / 2 - 10, base - 22, 2, 18, P.beam); k.r(a + w / 2 - 18, base - 30, 22, 10, P.wood); k.r(a + w / 2 - 16, base - 27, 18, 1, '#2a1e14'); k.r(a + w / 2 - 16, base - 24, 12, 1, '#2a1e14');
      return { c, base };
    }
    if (type === 'rumah') {
      k.found(a - 2, wy + 40, w + 4, 6); k.wall(a, wy, w, 40, P.plank, [Math.round(w / 2 - 2)]);
      k.win(a + 12, wy + 12, 16, 14, true); k.shutters(a + 12, wy + 12, 16, 14); k.win(a + w - 28, wy + 12, 16, 14, true);
      k.doorWood(a + w / 2 - 8, wy + 14, 16, 26); k.steps(a + w / 2 - 11, wy + 47, 22, 2, 0, P.stone);
      k.roof(a - 10, wy - 46, w + 20, 48, 16, P.shingle); k.r(a + w - 28, wy - 56, 8, 14, P.stone); k.r(a + w - 28, wy - 56, 8, 2, '#9a9488');
      k.eaveShadow(a, wy, w, 4); k.barrel(a - 10, wy + 30);
    } else if (type === 'panggung') {
      const fy = base - 26;
      for (const px of [a + 2, a + 30, a + w - 32, a + w - 6]) { k.r(px, fy, 4, base - fy, P.beam); k.r(px, fy, 1, base - fy, A.light(P.beam, .25)); }
      k.r(a - 4, fy - 4, w + 8, 6, P.wood); for (let xx = a - 4; xx < a + w + 4; xx += 4) k.r(xx, fy - 4, 1, 6, P.wood2);
      k.wall(a + 6, fy - 34, w - 12, 30, '#7a6a48', [Math.round(w / 2 - 8)]);
      k.win(a + 18, fy - 26, 14, 12, true); k.win(a + w - 34, fy - 26, 14, 12, true);
      k.doorWood(a + w / 2 - 7, fy - 24, 14, 20);
      for (let i = 0; i < 5; i++) { k.r(a + w / 2 - 6, fy + 2 + i * 6, 12, 2, P.wood); }
      k.r(a + w / 2 - 8, fy + 2, 2, base - fy - 2, P.wood2); k.r(a + w / 2 + 6, fy + 2, 2, base - fy - 2, P.wood2);
      k.roof(a - 6, fy - 72, w + 12, 40, 14, '#8a7a4a');
      for (let i = 0; i < 4; i++) { k.r(a - 2 + i * 5, fy + 4, 1, 10, '#c8b890'); k.r(a - 3 + i * 5, fy + 13, 3, 4, '#8aa0a8'); }
      for (let yy = 0; yy < 14; yy += 2) for (let xx = 0; xx < 14; xx += 2) k.px(a + w - 4 + xx * .5, fy + 6 + yy, '#c8b890');
      k.eaveShadow(a + 6, fy - 34, w - 12, 3);
    } else if (type === 'toko') {
      k.found(a - 2, wy + 40, w + 4, 6);
      k.wall(a, wy - 30, w, 30, P.wood2, [Math.round(w / 2 - 2)]);
      k.win(a + 12, wy - 22, 14, 14, true); k.win(a + w - 26, wy - 22, 14, 14, false);
      k.r(a, wy - 2, w, 4, P.beam);
      k.wall(a, wy + 2, w, 38, P.plaster, []);
      k.r(a + 8, wy + 8, w - 16, 24, '#1d1712');
      const goods = ['#8a3a30', '#c99a3c', '#5b8a3a', '#7a6a9a', '#b86a3a']; for (let i = 0; i < (w - 24) / 7; i++) { const cc = goods[i % 5]; k.r(a + 12 + i * 7, wy + 14, 5, 4, cc); k.r(a + 12 + i * 7, wy + 14, 5, 1, A.light(cc, .3)); }
      k.r(a + 6, wy + 26, w - 12, 8, P.wood); k.r(a + 6, wy + 26, w - 12, 1, A.light(P.wood, .25));
      for (let xx = 0; xx < w + 12; xx++) { const cc = Math.floor(xx / 8) % 2 ? P.cloth2 : P.cloth1; for (let yy = 0; yy < 8; yy++) k.px(a - 6 + xx, wy + yy, k.nz(yy > 5 ? A.dark(cc, .2) : cc, .05)); }
      k.roof(a - 10, wy - 72, w + 20, 44, 16, P.slate); k.eaveShadow(a, wy - 30, w, 3);
      k.r(a + w / 2 - 14, wy - 40, 28, 8, P.wood); for (let i = 0; i < 4; i++) k.r(a + w / 2 - 10 + i * 6, wy - 38, 3, 4, P.gold);
      k.crate(a - 12, wy + 34, 9);
    } else if (type === 'lumbung') {
      k.found(a - 2, wy + 40, w + 4, 6);
      const bc = '#7a3a2a';
      k.wall(a, wy - 4, w, 44, bc, [Math.round(w / 2 - 2)]);
      k.r(a + w / 2 - 16, wy + 8, 32, 32, P.wood2); k.r(a + w / 2 - 15, wy + 9, 14, 31, P.wood); k.r(a + w / 2 + 1, wy + 9, 14, 31, P.wood);
      k.x.strokeStyle = P.beam; k.x.lineWidth = 2; k.x.beginPath(); k.x.moveTo(a + w / 2 - 15, wy + 9); k.x.lineTo(a + w / 2 - 1, wy + 40); k.x.moveTo(a + w / 2 + 15, wy + 9); k.x.lineTo(a + w / 2 + 1, wy + 40); k.x.stroke();
      k.roof(a - 12, wy - 56, w + 24, 54, 10, P.shingle); k.eaveShadow(a, wy - 4, w, 4);
      k.sack(a + 8, wy + 34); k.sack(a + 16, wy + 36); k.sack(a + w - 10, wy + 35);
    }
    return { c, base };
  }

  /* ---------- hias peta dengan bangunan dinamis ---------- */
  function decorate(map, s) {
    map.dyn = []; map.dynSolids = []; map.dynInter = [];
    const plots = PLOTS[map.id]; if (!plots || !s) return;
    for (const p of plots) {
      const b = s.builds[p.id];
      if (p.kind === 'burnt') {
        const [hx, wy, hw] = p.house;
        if (b) {
          const art = houseArt(b.done ? b.type : 'site', b.done ? 1 : b.prog / b.work, hw);
          map.dyn.push({ c: art.c, x: hx - 14, y: wy - 66, base: wy + 50 });
        }
      } else if (b) {
        const w = p.r[2] - 20, art = houseArt(b.done ? b.type : 'site', b.done ? 1 : b.prog / b.work, w);
        const base = p.r[1] + p.r[3] - 2;
        map.dyn.push({ c: art.c, x: p.r[0] + 10 - 14, y: base - art.base, base });
        map.dynSolids.push([p.r[0] + 8, base - 70, p.r[2] - 16, 56]);
      }
      map.dynInter.push({ r: p.kind === 'burnt' ? p.r : [p.r[0], p.r[1], p.r[2], p.r[3]], plot: p.id });
    }
  }
  function residentNpcs(map, s) {
    const out = []; const plots = PLOTS[map.id]; if (!plots || !s) return out;
    for (const p of plots) {
      const g = s.residents[p.id]; if (!g) continue;
      const x = p.kind === 'burnt' ? p.house[0] + p.house[2] / 2 + 20 : p.r[0] + p.r[2] / 2 + 22;
      const y = p.kind === 'burnt' ? p.house[1] + 70 : p.r[1] + p.r[3] + 14;
      out.push({ group: g, x, y });
    }
    return out;
  }
  function waitingNpcs(s) {
    const slots = [[300, 452], [344, 444], [420, 444], [464, 452], [250, 448]];
    return s.waiting.slice(0, 5).map((g, i) => ({ group: g, x: slots[i][0], y: slots[i][1] }));
  }
  function groupTalk(g, s, resident) {
    const kindName = { petani: 'petani', tukang: 'tukang', nelayan: 'nelayan', pedagang: 'pedagang' }[g.kind];
    if (resident) {
      const l = {
        petani: ['Tanah di belakang rumah kami sudah mulai kami cangkul. Terima kasih, Presiden.', 'Anak-anak kami tidur nyenyak semalam. Pertama kalinya sejak kami mengungsi.'],
        tukang: ['Kami sedang memeriksa tembok kota bagian selatan. Banyak yang bisa diselamatkan.', 'Tukang tanpa rumah itu cuma pengembara. Sekarang kami warga Brennhold.'],
        nelayan: ['Gluk! Rumah ini basah dengan cara yang benar. Ikan pagi ini banyak.', 'Kami menjemur jaring di tiang rumah. Pipin suka bermain di bawahnya.'],
        pedagang: ['Toko kami buka setiap hari kecuali hari hujan. Hujan buruk untuk kain.', 'Kalau jalur ke Gold Mines lancar, toko ini bisa membayar pajak dua kali lipat.']
      }[g.kind];
      return [l[(s.day + g.id) % l.length]];
    }
    const waited = absDay(s) - g.day;
    return [`Kami rombongan dari ${g.origin}, ${g.size} jiwa. Saya ${g.leader}, yang memimpin.`, WISH[g.kind], waited >= 1 ? 'Kami sudah menunggu sejak kemarin, Presiden. Kalau besok belum ada tempat, kami terpaksa pergi ke Twin River.' : 'Untuk sementara kami tidur di serambi Balai. Penjaga Anda baik sekali.'];
  }

  V.city = { tick, etaText, isQueued, minutesLeft, teams, TYPES, PLOTS, PLOT_ALLOW, PROJECTS, DEALS, plotById, costOf, ensure, canBuild, startBuild, startProject, signDeal, workforce, activeJobs, daily, decorate, residentNpcs, waitingNpcs, groupSpec, groupTalk, absDay };
})(window.V);
