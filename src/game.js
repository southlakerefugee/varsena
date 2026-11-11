'use strict';
/* Varsena — mesin permainan Tahap 1: gerak, tabrakan, kamera, waktu, cahaya, dialog, kantor, menu, simpan. */
(function (V) {
  const A = V.art, D = V.data, M = V.maps, C = V.city;
  const VW = 480, VH = 270, TIME_RATE = 1.8; // menit permainan per detik nyata: satu hari (06:00–24:00) sekitar 10 menit
  const SAVE_KEY = 'varsena.save.v1';
  const $ = id => document.getElementById(id);
  const cv = $('screen'), ctx = cv.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  const lightCv = A.canvas(VW, VH), lctx = lightCv.getContext('2d');
  const gameEl = $('game'), touchEl = $('touch');

  let S = null, mode = 'title', map = null, npcs = [], cam = { x: 0, y: 0 };
  const player = { x: 0, y: 0, dir: 'down', moving: false, anim: 0 };
  let rand = A.rng((Date.now() & 0xffffff) + 7), lastPeriod = null, titleT = 0;

  /* ---------- skala layar ---------- */
  const touchOn = ('ontouchstart' in window) || (window.matchMedia && matchMedia('(pointer: coarse)').matches);
  function resize() {
    touchEl.hidden = !touchOn;
    const w = window.innerWidth, h = window.innerHeight - (touchOn ? 190 : 0);
    let u = Math.min(w / VW, Math.max(120, h) / VH);
    if (u >= 2) u = Math.floor(u);
    u = Math.max(.5, u);
    gameEl.style.width = (VW * u) + 'px'; gameEl.style.height = (VH * u) + 'px';
    document.documentElement.style.setProperty('--u', u);
  }
  window.addEventListener('resize', resize); resize();

  /* ---------- input ---------- */
  const keys = {}, pressed = new Set();
  const KEYMAP = { ArrowUp: 'up', KeyW: 'up', ArrowDown: 'down', KeyS: 'down', ArrowLeft: 'left', KeyA: 'left', ArrowRight: 'right', KeyD: 'right', KeyZ: 'a', Space: 'a', Enter: 'a', KeyX: 'b', Escape: 'b', ShiftLeft: 'run', ShiftRight: 'run' };
  window.addEventListener('keydown', e => {
    if (e.target && e.target.tagName === 'INPUT') return;
    const k = KEYMAP[e.code]; if (!k) return;
    e.preventDefault();
    if (!keys[k]) pressed.add(k);
    keys[k] = true;
  });
  window.addEventListener('keyup', e => { const k = KEYMAP[e.code]; if (k) keys[k] = false; });
  window.addEventListener('blur', () => { for (const k in keys) keys[k] = false; });
  const hit = k => { if (pressed.has(k)) { pressed.delete(k); return true; } return false; };
  touchEl.querySelectorAll('button').forEach(b => {
    const k = b.dataset.k;
    const down = e => { e.preventDefault(); if (!keys[k]) pressed.add(k); keys[k] = true; b.classList.add('on'); try { b.setPointerCapture(e.pointerId); } catch (_) {} };
    const up = e => { e.preventDefault(); keys[k] = false; b.classList.remove('on'); };
    b.addEventListener('pointerdown', down); b.addEventListener('pointerup', up); b.addEventListener('pointercancel', up); b.addEventListener('pointerleave', up);
  });

  /* ---------- waktu ---------- */
  const PERIOD_LABEL = { pagi: 'Pagi', siang: 'Siang', sore: 'Sore', malam: 'Malam' };
  function period(min) { const h = (min / 60) % 24; if (h >= 6 && h < 11) return 'pagi'; if (h >= 11 && h < 15) return 'siang'; if (h >= 15 && h < 18) return 'sore'; return 'malam'; }
  function clock(min) { const h = Math.floor(min / 60) % 24, m = Math.floor(min % 60); return String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0'); }
  function dateLabel() { return D.SEASONS[S.season] + ', Hari ' + S.day + ' · Tahun ' + S.year; }

  /* ---------- peta & tokoh ---------- */
  function spawnNpcs(per) {
    npcs = [];
    for (const def of D.NPCS) {
      const at = def.at[per]; if (!at || at.map !== map.id) continue;
      npcs.push({ def, x: at.x, y: at.y, dir: at.dir, home: at, tx: null, ty: null, wait: 1 + rand() * 3, anim: 0, moving: false });
    }
    if (!S || per === 'malam') return;
    const add = (g, x, y, resident) => {
      const def = { id: 'g' + g.id, name: g.leader, title: resident ? 'Warga Brennhold' : 'Rombongan dari ' + g.origin, spec: 'g' + g.id, specObj: C.groupSpec(g), talk: st => ({ pages: C.groupTalk(g, S, resident) }) };
      const home = { map: map.id, x, y, dir: 'down', wander: resident ? 26 : 0 };
      if (!blocked(x, y, null)) npcs.push({ def, x, y, dir: 'down', home, tx: null, ty: null, wait: 1 + rand() * 3, anim: 0, moving: false });
    };
    if (map.id === 'plaza') for (const w of C.waitingNpcs(S)) add(w.group, w.x, w.y, false);
    for (const r of C.residentNpcs(map, S)) add(r.group, r.x, r.y, true);
  }
  function enterMap(id, x, y, dir) {
    map = M.get(id); player.x = x; player.y = y; player.dir = dir || 'down'; player.moving = false;
    C.decorate(map, S);
    if (S) S.map = id;
    lastPeriod = S ? period(S.minutes) : 'siang';
    spawnNpcs(lastPeriod);
    showPlace(map.name);
  }

  /* ---------- tabrakan ---------- */
  function blocked(x, y, self) {
    const l = x - 6, t = y - 6, r = x + 6, b = y;
    if (l < 0 || t < 0 || r > map.w || b > map.h) return true;
    for (const s of map.solids) if (l < s[0] + s[2] && r > s[0] && t < s[1] + s[3] && b > s[1]) return true;
    if (map.dynSolids) for (const s of map.dynSolids) if (l < s[0] + s[2] && r > s[0] && t < s[1] + s[3] && b > s[1]) return true;
    for (const n of npcs) { if (n === self) continue; if (Math.abs(n.x - x) < 12 && Math.abs(n.y - y) < 7) return true; }
    if (self !== player && Math.abs(player.x - x) < 12 && Math.abs(player.y - y) < 7) return true;
    return false;
  }
  function move(e, dx, dy) {
    let moved = false;
    if (dx && !blocked(e.x + dx, e.y, e)) { e.x += dx; moved = true; }
    if (dy && !blocked(e.x, e.y + dy, e)) { e.y += dy; moved = true; }
    return moved;
  }
  const overlap = (r, x, y) => x + 6 > r[0] && x - 6 < r[0] + r[2] && y > r[1] && y - 6 < r[1] + r[3];

  /* ---------- UI: tempat, toast, petunjuk, HUD ---------- */
  let placeTimer = 0, toastTimer = 0;
  function showPlace(name) { const el = $('place'); el.textContent = name; el.hidden = false; el.classList.remove('fade'); placeTimer = 2.6; }
  function toast(text, sec) { const el = $('toast'); el.textContent = text; el.hidden = false; toastTimer = sec || 2.4; }
  let hudKey = '';
  function updateHud() {
    const key = S ? S.day + '|' + Math.floor(S.minutes / 10) + '|' + S.stats.kas : '';
    if (key === hudKey) return; hudKey = key;
    $('hud-date').textContent = dateLabel();
    $('hud-time').textContent = PERIOD_LABEL[period(S.minutes)] + ' ' + clock(S.minutes);
    $('hud-kas').textContent = 'Kas ' + S.stats.kas.toLocaleString('id-ID') + ' · Pangan ' + S.stats.pangan + ' hari';
  }

  /* ---------- fade ---------- */
  function fadeTo(cb) {
    mode = 'fade'; $('fade').classList.add('on');
    setTimeout(() => { cb(); $('fade').classList.remove('on'); setTimeout(() => { if (mode === 'fade') mode = 'play'; }, 260); }, 300);
  }

  /* ---------- dialog ---------- */
  let dlg = null;
  function openDialog(o) {
    dlg = Object.assign({ i: 0, shown: 0, sel: 0, choicesOpen: false }, o);
    mode = 'dialog';
    const pEl = $('dlg-portrait'); pEl.innerHTML = '';
    if (o.spec) { const src = A.portrait(o.spec, o.specObj || D.SPEC[o.spec]); const c = A.canvas(src.width, src.height); c.getContext('2d').drawImage(src, 0, 0); pEl.appendChild(c); }
    $('dlg-name').textContent = o.name || ''; $('dlg-title').textContent = o.title || '';
    $('dlg-name').parentElement.classList.toggle('none', !o.name);
    $('dlg-choices').hidden = true; $('dlg-choices').innerHTML = '';
    $('dialog').hidden = false; $('hint').hidden = true;
    renderDialog();
  }
  function renderDialog() {
    const page = dlg.pages[dlg.i] || '';
    $('dlg-text').textContent = page.slice(0, Math.floor(dlg.shown));
    $('dlg-next').hidden = dlg.shown < page.length || dlg.choicesOpen;
  }
  function showChoices() {
    dlg.choicesOpen = true; const ul = $('dlg-choices'); ul.innerHTML = '';
    dlg.choices.forEach((c, i) => {
      const li = document.createElement('li'), b = document.createElement('button'); b.type = 'button'; b.textContent = c.label;
      b.addEventListener('click', () => { dlg.sel = i; closeDialog(c.act); });
      li.appendChild(b); ul.appendChild(li);
    });
    ul.hidden = false; markChoice(); $('dlg-next').hidden = true;
  }
  function markChoice() { [...$('dlg-choices').querySelectorAll('button')].forEach((b, i) => b.classList.toggle('sel', i === dlg.sel)); }
  function closeDialog(act) {
    const d = dlg; dlg = null; $('dialog').hidden = true; mode = 'play';
    if (d.npc) { d.npc.dir = d.npc.homeDir || d.npc.dir; }
    if (d.onDone) d.onDone(act);
    else doAct(act);
  }
  function updateDialog(dt) {
    const page = dlg.pages[dlg.i] || '';
    if (dlg.shown < page.length) { dlg.shown = Math.min(page.length, dlg.shown + dt * 55); renderDialog(); }
    if (dlg.choicesOpen) {
      if (hit('up')) { dlg.sel = (dlg.sel + dlg.choices.length - 1) % dlg.choices.length; markChoice(); }
      if (hit('down')) { dlg.sel = (dlg.sel + 1) % dlg.choices.length; markChoice(); }
      if (hit('a')) closeDialog(dlg.choices[dlg.sel].act);
      else if (hit('b')) closeDialog(dlg.choices[dlg.choices.length - 1].act);
      return;
    }
    if (hit('a') || (hit('b') && dlg.shown >= page.length)) {
      if (dlg.shown < page.length) { dlg.shown = page.length; renderDialog(); }
      else if (dlg.i < dlg.pages.length - 1) { dlg.i++; dlg.shown = 0; renderDialog(); }
      else if (dlg.choices && dlg.choices.length) { renderDialog(); showChoices(); }
      else closeDialog(null);
    }
  }
  $('dialog').addEventListener('click', e => { if (e.target.closest('button')) return; if (dlg && !dlg.choicesOpen) pressed.add('a'); });

  /* ---------- aksi ---------- */
  function doAct(act) {
    if (act === 'office') openOffice();
    else if (act === 'sleep') sleep();
    else if (act === 'hassanHelp') { S.flags.hassanHelp = true; S.stats.stabilitas = Math.max(0, S.stats.stabilitas - 1); openDialog({ name: 'Jenderal Hassan', title: 'Kastil Lakeward', spec: 'hassan', pages: ['Bagus! Besok pagi tiga regu prajuritku melapor ke Barro. Mereka akan menggerutu sehari, lalu bekerja seperti kerbau.', 'Kalistov pasti menulis surat soal prajurit yang "dipakai jadi kuli". Biar saja. (Pekerja +4)'] }); }
    else if (act === 'ooloHelp') { S.flags.ooloHelp = true; if (S.projects.dermagaSL && !S.projects.dermagaSL.done) S.projects.dermagaSL.work = Math.round(S.projects.dermagaSL.work / 2); openDialog({ name: 'Oolo', title: 'Nelayan dari Twin River', spec: 'oolo', pages: ['Gluk! Oolo akan mengirim kabar lewat sungai. Saudara-saudara Oolo akan datang ke desa nelayan South Lake untuk menambal jaring dan perahu.', '(Proyek Dermaga dan Rumah Asap Ikan South Lake jadi dua kali lebih cepat.)'] }); }
  }

  /* ---------- petak bangun ---------- */
  let build = null;
  function plotAction(id) {
    const p = C.plotById(id), b = S.builds[id];
    if (!b) return openBuild(id);
    const t = C.TYPES[b.type], g = S.residents[id];
    if (!b.done) return openDialog({ name: 'Barro', title: 'Tukang kayu', spec: 'barro', pages: [`${t.name} di ${p.label.toLowerCase()}: ${Math.round(b.prog / b.work * 100)}% selesai.`, `Dengan ${C.workforce(S)} pekerja: ${C.etaText(S, b)}.`] });
    if (g) return openDialog({ pages: [`${t.name}. Dihuni rombongan ${g.leader} dari ${g.origin}, ${g.size} jiwa.`] });
    if (!t.fits.length) return openDialog({ pages: [`${t.name}. ${t.desc}`] });
    openDialog({ pages: [`${t.name} ini sudah selesai tapi belum berpenghuni. Rombongan yang cocok (${t.fits.join(' atau ')}) akan pindah ke sini begitu ada yang datang.`] });
  }
  function openBuild(id) { mode = 'build'; build = { id, sel: 0 }; $('hint').hidden = true; renderBuild(); $('build').hidden = false; }
  function closeBuild() { $('build').hidden = true; build = null; mode = 'play'; }
  function renderBuild() {
    const p = C.plotById(build.id), types = C.PLOT_ALLOW[p.kind];
    const jobs = C.activeJobs(S).length + 1, per = C.workforce(S) / jobs;
    $('build').innerHTML = `<h2>${p.kind === 'burnt' ? 'Bangun ulang' : 'Bangun'}: ${p.label}</h2><p class="sub">Kas ${S.stats.kas.toLocaleString('id-ID')} keping · ${C.workforce(S)} pekerja · ${C.activeJobs(S).length} pekerjaan berjalan</p>
      <div class="panel-body"><div class="list" style="margin-top:4em">${types.map((k, i) => {
        const t = C.TYPES[k], c = C.costOf(p, k), wait = S.waiting.filter(g => t.fits.includes(g.kind)).length, days = Math.max(1, Math.round(c.work / (1 + (C.workforce(S) - 6) * .06) / 60));
        return `<button type="button" class="act big${i === build.sel ? ' sel' : ''}" data-b="${k}" ${S.stats.kas < c.cost ? 'disabled' : ''}><b>${t.name}</b>${t.desc}<small>${c.cost} keping · sekitar ${days} menit${t.fits.length ? ' · untuk ' + t.fits.join('/') + (wait ? ` · ${wait} rombongan menunggu` : '') : ''}${S.stats.kas < c.cost ? ' · kas tidak cukup' : ''}</small></button>`;
      }).join('')}</div></div>
      <div class="panel-foot"><span>▲ ▼ pilih · Z bangun · X batal</span><button type="button" id="build-close">Batal</button></div>`;
    $('build').querySelectorAll('[data-b]').forEach((b, i) => b.addEventListener('click', () => { build.sel = i; doBuild(); }));
    $('build-close').addEventListener('click', closeBuild);
  }
  function doBuild() {
    const p = C.plotById(build.id), k = C.PLOT_ALLOW[p.kind][build.sel];
    if (!C.startBuild(S, build.id, k)) { toast('Kas tidak cukup'); return; }
    const bid = build.id; closeBuild(); C.decorate(map, S); hudKey = ''; updateHud();
    openDialog({ name: 'Barro', title: 'Tukang kayu', spec: 'barro', pages: [`${C.TYPES[k].name}! Baik, Presiden. Patok sudah siap, bahan akan datang sore ini.`, C.isQueued(S, S.builds[bid]) ? 'Semua tim sedang sibuk, jadi bangunan ini menunggu giliran. Tambah pekerja kalau mau lebih cepat.' : 'Kami mulai sekarang juga. Lihat saja, beberapa menit lagi sudah berdiri.'] });
  }
  function updateBuild() {
    const n = C.PLOT_ALLOW[C.plotById(build.id).kind].length;
    if (hit('b')) return closeBuild();
    if (hit('up')) { build.sel = (build.sel + n - 1) % n; renderBuild(); }
    if (hit('down')) { build.sel = (build.sel + 1) % n; renderBuild(); }
    if (hit('a')) doBuild();
  }
  function npcCtx() { return { name: S.name, period: period(S.minutes), day: S.day, flags: S.flags }; }
  function talkTo(n) {
    const opp = { up: 'down', down: 'up', left: 'right', right: 'left' };
    n.homeDir = n.home.dir; n.dir = opp[player.dir]; n.tx = null; n.moving = false;
    const res = n.def.talk(npcCtx());
    openDialog({ name: n.def.name, title: n.def.title, spec: n.def.spec, specObj: n.def.specObj, pages: res.pages, choices: res.choices, npc: n });
  }
  function facingPoint() { const d = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] }[player.dir]; return [player.x + d[0] * 14, player.y - 3 + d[1] * 14]; }
  function findTarget() {
    const [fx, fy] = facingPoint();
    let best = null, bd = 18;
    for (const n of npcs) { const d = Math.hypot(n.x - fx, n.y - 3 - fy); if (d < bd) { bd = d; best = n; } }
    if (best) return { npc: best, label: 'Bicara' };
    if (map.dynInter) for (const it of map.dynInter) { const r = it.r; if (fx >= r[0] && fx <= r[0] + r[2] && fy >= r[1] && fy <= r[1] + r[3]) { const b = S.builds[it.plot]; return { it, label: b ? (b.done ? 'Periksa' : 'Lihat pembangunan') : (C.plotById(it.plot).kind === 'burnt' ? 'Bangun ulang' : 'Bangun') }; } }
    for (const it of map.inter) { const r = it.r; if (fx >= r[0] && fx <= r[0] + r[2] && fy >= r[1] && fy <= r[1] + r[3]) return { it, label: it.act === 'sleep' ? 'Tidur' : it.act === 'office' ? 'Meja kerja' : it.npc ? 'Bicara' : 'Periksa' }; }
    return null;
  }
  function interact(t) {
    if (t.npc) return talkTo(t.npc);
    const it = t.it;
    if (it.plot) return plotAction(it.plot);
    if (it.npc) { const n = npcs.find(q => q.def.id === it.npc); if (n) return talkTo(n); return openDialog({ pages: ['Tidak ada siapa-siapa di sini sekarang.'] }); }
    if (it.act === 'office') return openOffice();
    if (it.act === 'sleep') return openDialog({ pages: ['Tempat tidurmu. Seprainya baru dicuci dan berbau sabun Greenleaf.', 'Hari berganti sendiri tengah malam, jadi kamu tidak wajib tidur. Mau istirahat dan langsung lompat ke pagi berikutnya?'], choices: [{ label: 'Istirahat sampai pagi', act: 'sleep' }, { label: 'Tidak', act: null }] });
    if (it.text) return openDialog({ pages: it.text });
  }

  /* ---------- tidur & ganti hari ---------- */
  /* hari berganti sendiri pukul 24:00 (gaya Metropolismania); tempat tidur hanya untuk melompat ke pagi */
  function newDay(fromBed) {
    const go = () => {
      D.advanceDay(S, rand);
      S.minutes = 6 * 60;
      C.decorate(map, S); lastPeriod = period(S.minutes); spawnNpcs(lastPeriod);
      hudKey = ''; updateHud();
      saveGame(true);
      toast(D.SEASONS[S.season] + ', Hari ' + S.day + ' · laporan baru di meja kerja', 3.2);
    };
    if (fromBed) fadeTo(go); else go();
  }
  function sleep() { newDay(true); }

  /* ---------- simpan / muat ---------- */
  function snapshotState() { if (!S) return null; if (map) { S.map = map.id; S.x = Math.round(player.x); S.y = Math.round(player.y); S.dir = player.dir; } return S; }
  function saveGame(quiet) {
    snapshotState();
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(S)); if (!quiet) toast('Permainan disimpan'); else toast('Tersimpan otomatis', 1.6); }
    catch (_) { toast('Browser ini tidak mengizinkan penyimpanan'); }
  }
  function loadSave() { try { const t = localStorage.getItem(SAVE_KEY); return t ? JSON.parse(t) : null; } catch (_) { return null; } }

  /* ---------- kantor (mode meja kerja) ---------- */
  const CITIES = [
    ['Brennhold', 'Ibu kota. Setengah hancur, penduduk tinggal seperlima.', 'Pembangunan ulang', true],
    ['Greenleaf City', 'Kota universitas di barat. Walikota Helena, Rektor Elena.', 'Sains'],
    ['Gold Mines City', 'Kota tambang terjauh. Walikota Isam.', 'Keuangan, industri'],
    ['South Lake City', 'Kota tertua, lumbung gandum. Walikota Frederick.', 'Pertanian, perikanan'],
    ['Twin River', 'Manusia, Kaum Amfibi, dan Kaum Rubah hidup berdampingan. Walikota Michael.', 'Diplomasi, dagang'],
    ['Fort Wendel', 'Kota Militer Utara. Jenderal Kalistov.', 'Militer'],
    ['Kastil Lakeward', 'Kota Militer Selatan. Jenderal Hassan.', 'Militer'],
    ['Eternal City', 'Bekas ibu kota Kerajaan Hal. Pejabat sementara Kalais.', 'Rawan'],
    ['Kairos', 'Kota wisata pegunungan. Pejabat sementara Kalais.', 'Pariwisata']
  ];
  const DELEG = [
    ['rendah', 'Rendah', 'Aldric hanya merangkum laporan. Semua keputusan ada di tanganmu. Paling lambat, paling aman.'],
    ['sedang', 'Sedang', 'Aldric menyetujui izin kecil dan menyusun jadwal rapat. Kamu punya lebih banyak waktu di lapangan.'],
    ['tinggi', 'Tinggi', 'Aldric menangani hampir semua urusan rutin atas namamu. Cepat dan akurat, tapi dia akan memilih jalan yang paling efektif, bukan yang paling disukai rakyat.']
  ];
  let office = null;
  const TABS = ['Laporan Harian', 'Proyek', 'Surat', 'Kondisi Negara', 'Delegasi'];
  function openOffice() { mode = 'office'; office = { tab: 0, sel: 0 }; $('hint').hidden = true; renderOffice(); $('office').hidden = false; }
  function closeOffice() { $('office').hidden = true; office = null; mode = 'play'; hudKey = ''; }
  function statCard(key, label, val, prev, bar, unit) {
    const d = prev == null ? 0 : val - prev;
    const ds = d ? `<span class="d ${d > 0 ? 'up' : 'down'}">${d > 0 ? '+' : ''}${d}</span>` : '';
    return `<div class="stat"><div class="k">${label}</div><div><span class="v">${val.toLocaleString('id-ID')}${unit || ''}</span>${ds}</div>${bar ? `<div class="bar"><i style="width:${Math.max(0, Math.min(100, val))}%"></i></div>` : ''}</div>`;
  }
  const pct = j => Math.min(100, Math.round(j.prog / j.work * 100));
  function tabProyek() {
    const wf = C.workforce(S);
    let h = `<div class="list"><div class="item"><h3>Tenaga kerja: ${wf} pekerja</h3><p>${S.workers} tukang tetap${S.flags.hassanHelp ? ' · 4 prajurit Lakeward' : ''}${S.hire ? ' · 4 pekerja harian' : ''}. Pekerja dibagi rata ke semua pembangunan dan proyek yang sedang berjalan.</p>
      <div class="row"><span class="meta">Pekerja harian: 4 orang, 32 keping per hari</span><button type="button" class="act" data-a="hire">${S.hire ? 'Berhenti menyewa' : 'Sewa pekerja harian'}</button></div></div>`;
    for (const id in C.PROJECTS) {
      const pr = C.PROJECTS[id], j = S.projects[id];
      let row;
      if (!j) row = `<span class="meta">${pr.cost} keping · ${pr.work} hari-kerja${id === 'dermagaSL' && S.flags.ooloHelp ? ' (dibantu Kaum Oolo: lebih cepat)' : ''}</span><button type="button" class="act" data-a="proj:${id}" ${S.stats.kas < pr.cost ? 'disabled' : ''}>Mulai proyek</button>`;
      else if (!j.done) row = `<div class="prog"><i style="width:${pct(j)}%"></i></div><span class="meta">${pct(j)}% · ${C.etaText(S, j)}</span>`;
      else row = `<span class="tag">Selesai</span>`;
      h += `<div class="item"><h3>${pr.name}</h3><p>${pr.desc}</p><div class="row">${row}</div></div>`;
    }
    const builds = Object.keys(S.builds);
    h += `<p class="sec-title">Bangunan di kota</p>`;
    if (!builds.length) h += `<p class="empty">Belum ada. Datangi petak kosong atau rumah terbakar di Pemukiman Selatan untuk mulai membangun.</p>`;
    for (const k of builds) {
      const b = S.builds[k], t = C.TYPES[b.type], p = C.plotById(k), g = S.residents[k];
      h += `<div class="item"><h3>${t.name}</h3><p>${p.label}${b.done ? (g ? ` · dihuni rombongan ${g.leader} (${g.size} jiwa)` : t.fits.length ? ' · menunggu penghuni' : ' · berfungsi') : ''}</p><div class="row">${b.done ? '<span class="tag">Selesai</span>' : `<div class="prog"><i style="width:${pct(b)}%"></i></div><span class="meta">${pct(b)}% · ${C.etaText(S, b)}</span>`}</div></div>`;
    }
    h += `<p class="sec-title">Rombongan menunggu tempat tinggal</p>`;
    h += S.waiting.length ? S.waiting.map(g => `<div class="item"><h3>${g.leader} · ${g.origin}</h3><p>${g.size} jiwa, ${g.kind}. Butuh ${g.kind === 'nelayan' ? 'Rumah Panggung' : g.kind === 'pedagang' ? 'Toko' : 'Rumah Warga'}. Menunggu ${C.absDay(S) - g.day} hari.</p></div>`).join('') : `<p class="empty">Tidak ada.</p>`;
    return h + '</div>';
  }
  function tabSurat() {
    const L = S.letters.isam;
    if (L === 'none') return `<p class="empty">Belum ada surat baru. Surat biasanya datang bersama laporan pagi.</p>`;
    const letter = `<div class="letter"><p>Kepada Presiden Republik Varsena,</p>
      <p>Gold Mines punya emas, perak, dan tangan-tangan yang kuat. Yang tidak kami punya adalah roti. Sejak perang, gerobak dari desa-desa di sekitar Brennhold tidak pernah datang lagi, dan ikan asap dari desa nelayan South Lake berhenti di tengah jalan. Harga sekarung gandum di pasar kami tiga kali lipat harga tahun lalu. Para penambang mulai marah.</p>
      <p>Saya mengusulkan kerja sama: Brennhold dan South Lake memasok pangan, Gold Mines membayar dengan emas. Saya bersedia membayar sebagian di muka untuk membantu pembangunan ibu kota. Sebutkan syarat Anda.</p>
      <p class="sig">Isam, Walikota Gold Mines</p></div>`;
    if (L === 'received') return letter + `<p class="sec-title">Balasan Anda</p><div class="list">${C.DEALS.map(d => `<button type="button" class="act big" data-a="deal:${d.id}"><b>${d.name}</b>${d.text}<small>Uang muka ${d.advance} keping · sekitar ${d.daily} keping/hari setelah jalur dibuka</small></button>`).join('')}</div>`;
    const d = C.DEALS.find(x => x.id === S.deal.id), desa = S.projects.jalurDesa && S.projects.jalurDesa.done, ikan = S.projects.dermagaSL && S.projects.dermagaSL.done;
    return `<div class="list"><div class="item"><h3>Perjanjian Pangan Gold Mines: ${d.name}</h3><p>${S.deal.byAldric ? 'Ditandatangani Aldric atas namamu. ' : ''}${S.deal.pending ? 'Jawabanmu sedang dibawa kurir ke Gold Mines. Uang muka tiba besok pagi.' : `Uang muka ${S.deal.advance} keping sudah diterima.`}</p>
      <div class="row"><span class="meta">Jalur desa barat: ${desa ? 'terbuka' : 'rusak'} · Dermaga South Lake: ${ikan ? 'terbuka' : 'rusak'}</span></div>
      <div class="row"><span class="meta">Pendapatan ibu kota: ${S.dealIncome} keping · South Lake: ${S.southLake} keping</span></div></div>
      <div class="item"><h3>Hubungan dengan Gold Mines</h3><div class="row"><div class="prog"><i style="width:${S.gm}%"></i></div><span class="meta">${S.gm}/100</span></div>
      <p>${!desa || !ikan ? 'Pangan baru bisa dikirim setelah jalur diperbaiki. Lihat halaman Proyek.' : 'Pangan mengalir ke Gold Mines setiap hari.'}</p></div></div>` + `<p class="sec-title">Surat asli</p>` + letter;
  }
  function renderOffice() {
    const st = S.stats, pv = S.prev || {};
    let body = '';
    if (office.tab === 0) {
      const notes = S.notes.length ? S.notes : ['Republik Varsena genap berusia tiga bulan.', 'Cadangan pangan cukup untuk 18 hari. Sebagian besar gandum datang dari South Lake.', 'Laporan pertama ini disusun oleh Sekretaris Aldric Vane.'];
      body = `<div class="stats">
        ${statCard('populasi', 'Populasi Brennhold', st.populasi, pv.populasi, false, ' jiwa')}
        ${statCard('kas', 'Kas negara', st.kas, pv.kas, false, ' keping')}
        ${statCard('pangan', 'Cadangan pangan', st.pangan, pv.pangan, false, ' hari')}
        ${statCard('stabilitas', 'Stabilitas', st.stabilitas, pv.stabilitas, true)}
        ${statCard('kepercayaan', 'Kepercayaan publik', st.kepercayaan, pv.kepercayaan, true)}
        ${statCard('moral', 'Moral rakyat', st.moral, pv.moral, true)}
      </div>
      <p class="sec-title">Catatan hari ini</p>
      <ul class="notes">${notes.map(n => `<li>${n}</li>`).join('')}</ul>
      <p class="sec-title">Saran sekretaris</p>
      <div class="advice"><span id="adv-portrait"></span><p><b>Aldric Vane</b>${D.advice(S)}</p></div>`;
    } else if (office.tab === 1) body = tabProyek();
    else if (office.tab === 2) body = tabSurat();
    else if (office.tab === 3) {
      body = `<table class="cities"><thead><tr><th>Kota</th><th>Keadaan</th><th>Kekuatan</th><th>Kunjungan</th></tr></thead><tbody>
        ${CITIES.map(c => `<tr><td class="n">${c[0]}</td><td>${c[1]}</td><td>${c[2]}</td><td>${c[3] ? '<span class="tag">Di sini</span>' : '<span class="tag lock">Tahap berikutnya</span>'}</td></tr>`).join('')}
      </tbody></table>`;
    } else {
      body = `<div class="deleg">${DELEG.map((d, i) => `<button type="button" data-a="deleg:${i}" class="${S.delegasi === d[0] ? 'on' : ''}"><b>${d[1]}${S.delegasi === d[0] ? ' · aktif' : ''}</b><span>${d[2]}</span></button>`).join('')}</div>`;
    }
    const unread = S.letters.isam === 'received' ? ' •' : '';
    $('office').innerHTML = `<h2>Meja Kerja Presiden</h2><p class="sub">${dateLabel()} · ${clock(S.minutes)} · Kas ${st.kas.toLocaleString('id-ID')} keping</p>
      <div class="tabs">${TABS.map((t, i) => `<button type="button" data-t="${i}" class="${i === office.tab ? 'on' : ''}">${t}${i === 2 ? unread : ''}</button>`).join('')}</div>
      <div class="panel-body">${body}</div>
      <div class="panel-foot"><span>${office.tab === 2 && S.letters.isam === 'received' ? 'Gulir ke bawah atau tekan ▼ untuk memilih balasan' : '◀ ▶ ganti halaman · ▲ ▼ pilih · Z tetapkan · X tutup'}</span><button type="button" id="office-close">Tutup</button></div>`;
    $('office').querySelectorAll('[data-t]').forEach(b => b.addEventListener('click', () => { office.tab = +b.dataset.t; office.sel = 0; renderOffice(); }));
    $('office').querySelectorAll('[data-a]').forEach(b => b.addEventListener('click', () => officeAct(b.dataset.a)));
    $('office-close').addEventListener('click', closeOffice);
    const ap = $('adv-portrait'); if (ap) { const src = A.portrait('aldric', D.SPEC.aldric), c = A.canvas(src.width, src.height); c.getContext('2d').drawImage(src, 0, 0); ap.replaceWith(c); }
    markOffice();
  }
  const officeButtons = () => [...$('office').querySelectorAll('.panel-body [data-a]:not(:disabled)')];
  function markOffice() { const bs = officeButtons(); if (office.sel >= bs.length) office.sel = Math.max(0, bs.length - 1); bs.forEach((b, i) => b.classList.toggle('sel', i === office.sel)); const cur = bs[office.sel]; if (cur && office.kb) cur.scrollIntoView({ block: 'nearest' }); }
  function officeAct(a) {
    const [k, v] = a.split(':');
    if (k === 'hire') { S.hire = !S.hire; toast(S.hire ? 'Pekerja harian mulai besok' : 'Pekerja harian dihentikan'); }
    else if (k === 'proj') { if (C.startProject(S, v)) toast('Proyek dimulai besok pagi'); else toast('Kas tidak cukup'); }
    else if (k === 'deal') { C.signDeal(S, v, false); toast('Surat balasan dikirim ke Gold Mines'); }
    else if (k === 'deleg') { const d = DELEG[+v]; if (S.delegasi !== d[0]) { S.delegasi = d[0]; toast('Delegasi: ' + d[1]); } }
    renderOffice();
  }
  function updateOffice() {
    if (hit('b')) return closeOffice();
    if (hit('left')) { office.tab = (office.tab + TABS.length - 1) % TABS.length; office.sel = 0; renderOffice(); }
    if (hit('right')) { office.tab = (office.tab + 1) % TABS.length; office.sel = 0; renderOffice(); }
    const bs = officeButtons();
    if (bs.length) {
      if (hit('up')) { office.sel = (office.sel + bs.length - 1) % bs.length; office.kb = true; markOffice(); }
      if (hit('down')) { office.sel = (office.sel + 1) % bs.length; office.kb = true; markOffice(); }
      if (hit('a')) officeAct(bs[office.sel].dataset.a);
    } else {
      const body = $('office').querySelector('.panel-body');
      if (keys.down) body.scrollTop += 6; if (keys.up) body.scrollTop -= 6;
      if (hit('a')) closeOffice();
    }
  }

  /* ---------- menu ---------- */
  let menu = null;
  const MENU = [['Lanjutkan', 'close'], ['Simpan permainan', 'save'], ['Kontrol', 'keys'], ['Kembali ke layar judul', 'title']];
  function openMenu() { mode = 'menu'; menu = { sel: 0, view: 'list' }; $('hint').hidden = true; renderMenu(); $('menu').hidden = false; }
  function closeMenu() { $('menu').hidden = true; menu = null; mode = 'play'; }
  function renderMenu() {
    if (menu.view === 'keys') {
      $('menu').innerHTML = `<h2>Kontrol</h2><p class="keys"><kbd>Panah</kbd> / <kbd>WASD</kbd> berjalan<br><kbd>Shift</kbd> tahan untuk berlari<br><kbd>Z</kbd> / <kbd>Spasi</kbd> bicara, periksa, lanjut<br><kbd>X</kbd> / <kbd>Esc</kbd> menu, batal<br>Di HP: tombol arah, A, dan B di bawah layar.</p><div class="panel-foot"><span></span><button type="button" id="menu-back">Kembali</button></div>`;
      $('menu-back').addEventListener('click', () => { menu.view = 'list'; renderMenu(); });
      return;
    }
    $('menu').innerHTML = `<h2>Menu</h2><p class="sub">Presiden ${S.name} · ${dateLabel()}</p><ul class="menu-list">${MENU.map((m, i) => `<li><button type="button" data-i="${i}" class="${i === menu.sel ? 'sel' : ''}">${m[0]}</button></li>`).join('')}</ul>`;
    $('menu').querySelectorAll('[data-i]').forEach(b => b.addEventListener('click', () => { menu.sel = +b.dataset.i; menuAct(); }));
  }
  function menuAct() {
    const a = MENU[menu.sel][1];
    if (a === 'close') closeMenu();
    else if (a === 'save') { saveGame(false); closeMenu(); }
    else if (a === 'keys') { menu.view = 'keys'; renderMenu(); }
    else if (a === 'title') { closeMenu(); toTitle(); }
  }
  function updateMenu() {
    if (menu.view === 'keys') { if (hit('a') || hit('b')) { menu.view = 'list'; renderMenu(); } return; }
    if (hit('b')) return closeMenu();
    if (hit('up')) { menu.sel = (menu.sel + MENU.length - 1) % MENU.length; renderMenu(); }
    if (hit('down')) { menu.sel = (menu.sel + 1) % MENU.length; renderMenu(); }
    if (hit('a')) menuAct();
  }

  /* ---------- layar judul ---------- */
  function toTitle() {
    mode = 'title'; S = null; dlg = null;
    ['hud', 'hint', 'dialog', 'office', 'menu', 'build', 'place', 'toast'].forEach(id => $(id).hidden = true);
    map = M.get('plaza'); spawnNpcs('siang'); player.x = 360; player.y = 330;
    $('title').hidden = false; $('title-buttons').hidden = false; $('name-form').hidden = true;
    $('btn-continue').disabled = !loadSave();
    setTimeout(() => ($('btn-continue').disabled ? $('btn-new') : $('btn-continue')).focus(), 50);
  }
  $('btn-new').addEventListener('click', () => { $('title-buttons').hidden = true; $('name-form').hidden = false; setTimeout(() => { $('name-input').focus(); $('name-input').select(); }, 30); });
  $('btn-continue').addEventListener('click', () => { const s = loadSave(); if (s) beginGame(s, false); });
  $('name-form').addEventListener('submit', e => {
    e.preventDefault();
    const name = ($('name-input').value || '').trim().slice(0, 14) || 'Aren';
    beginGame(D.newState(name), true);
  });
  function beginGame(state, fresh) {
    S = C.ensure(state); $('title').hidden = true; $('hud').hidden = false; hudKey = '';
    enterMap(S.map || 'balai', S.x || 100, S.y || 196, S.dir || 'down');
    updateHud(); mode = 'play';
    if (fresh) openDialog({ pages: [
      'Dua tahun lalu, Pangeran Kerajaan Hal membakar Brennhold. Hanya satu dari lima penduduknya yang selamat.',
      'Perang saudara yang menyusul meruntuhkan kerajaan itu. Dari abunya lahir Republik Varsena.',
      'Kamu, ' + S.name + ', yang memimpin perang kemerdekaan, kini menjadi Presiden pertamanya.',
      'Ini pagi pertamamu di Balai Republik. Perang sudah selesai. Pekerjaan yang sesungguhnya baru dimulai.',
      'Berjalan: tombol panah atau WASD (tahan Shift untuk berlari). Bicara dan periksa: Z atau Spasi. Menu: X atau Esc.',
      'Hari berganti sendiri tengah malam, kira-kira setiap 10 menit. Bangunan dan proyek dikerjakan terus selama kamu bermain.'
    ] });
    else toast('Selamat datang kembali, Presiden ' + S.name);
  }

  /* ---------- update ---------- */
  function updateNpcs(dt) {
    for (const n of npcs) {
      n.moving = false;
      if (!n.home.wander || (dlg && dlg.npc === n)) continue;
      if (n.tx == null) { n.wait -= dt; if (n.wait <= 0) { const r = n.home.wander; n.tx = n.home.x + (rand() * 2 - 1) * r; n.ty = n.home.y + (rand() * 2 - 1) * r * .6; } continue; }
      const dx = n.tx - n.x, dy = n.ty - n.y, d = Math.hypot(dx, dy);
      if (d < 2) { n.tx = null; n.wait = 1.5 + rand() * 3.5; continue; }
      const sp = 30 * dt, mx = dx / d * sp, my = dy / d * sp;
      if (!move(n, mx, my)) { n.tx = null; n.wait = 1 + rand() * 2; continue; }
      n.moving = true; n.anim += dt * 6;
      n.dir = Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? 'left' : 'right') : (dy < 0 ? 'up' : 'down');
    }
  }
  function updatePlay(dt) {
    let dx = 0, dy = 0;
    if (keys.left) dx -= 1; if (keys.right) dx += 1; if (keys.up) dy -= 1; if (keys.down) dy += 1;
    if (dx && dy) { dx *= .7071; dy *= .7071; }
    if (dx || dy) player.dir = Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? 'left' : 'right') : (dy < 0 ? 'up' : 'down');
    const sp = (keys.run ? 140 : 90) * dt;
    player.moving = (dx || dy) ? move(player, dx * sp, dy * sp) : false;
    if (player.moving) player.anim += dt * (keys.run ? 10 : 7); else player.anim = 0;
    for (const w of map.warps) if (overlap(w.r, player.x, player.y)) { const W = w; fadeTo(() => enterMap(W.to, W.x, W.y, W.dir)); return; }
    updateNpcs(dt);
    // waktu
    S.minutes += dt * TIME_RATE;
    if (S.minutes >= 24 * 60) { newDay(false); return; }
    const res = C.tick(S, dt, rand);
    for (const t of res.events) toast(t, 3.4);
    if (res.changed) { C.decorate(map, S); if (map.id === 'plaza' || map.id === 'kampung') spawnNpcs(period(S.minutes)); hudKey = ''; }
    const per = period(S.minutes);
    if (per !== lastPeriod) { lastPeriod = per; spawnNpcs(per); toast(PERIOD_LABEL[per] + ' tiba', 1.8); }
    updateHud();
    // interaksi
    const t = findTarget();
    const hint = $('hint');
    if (t) { hint.innerHTML = '<b>' + (touchOn ? 'A' : 'Z') + '</b>' + t.label; hint.hidden = false; } else hint.hidden = true;
    if (hit('a') && t) { hint.hidden = true; interact(t); return; }
    if (hit('b')) openMenu();
  }
  function update(dt) {
    if (placeTimer > 0) { placeTimer -= dt; if (placeTimer <= 0) $('place').classList.add('fade'); }
    if (toastTimer > 0) { toastTimer -= dt; if (toastTimer <= 0) $('toast').hidden = true; }
    if (mode === 'title') { titleT += dt; player.x = 360 + Math.sin(titleT * .08) * 150; player.y = 280 + Math.sin(titleT * .05) * 60; updateNpcs(dt); return; }
    if (mode === 'play') updatePlay(dt);
    else if (mode === 'dialog') updateDialog(dt);
    else if (mode === 'office') updateOffice();
    else if (mode === 'menu') updateMenu();
    else if (mode === 'build') updateBuild();
  }

  /* ---------- gambar ---------- */
  function lightParams(min) {
    const h = (min / 60) % 24; let d = 0, tint = null;
    if (h < 6.5) { d = .5; tint = [255, 170, 120, .08]; }
    else if (h < 8) { const t = 1 - (h - 6.5) / 1.5; d = .5 * t; tint = [255, 190, 140, .1 * t + .03]; }
    else if (h < 15) { d = 0; }
    else if (h < 17) { tint = [255, 200, 120, .08 * (h - 15) / 2]; }
    else if (h < 19) { const t = (h - 17) / 2; tint = [255, 140, 80, .08 + .08 * t]; d = .55 * t; }
    else { d = .58; tint = [40, 60, 140, .12]; }
    return { d, tint };
  }
  function drawEntity(key, spec, x, y, dir, moving, anim) {
    const frame = moving ? Math.floor(anim) % 4 : 0;
    const c = A.sprite(key, spec, dir, frame);
    const sx = Math.round(x - cam.x), sy = Math.round(y - cam.y);
    ctx.fillStyle = 'rgba(14,8,18,.32)'; ctx.beginPath(); ctx.ellipse(sx, sy - 1, 7, 2.5, 0, 0, 7); ctx.fill();
    ctx.drawImage(c, sx - Math.floor(c.width / 2), sy - c.height + 2);
  }
  function render() {
    if (!map) return;
    cam.x = map.w <= VW ? (map.w - VW) / 2 : Math.max(0, Math.min(map.w - VW, player.x - VW / 2));
    cam.y = map.h <= VH ? (map.h - VH) / 2 : Math.max(0, Math.min(map.h - VH, player.y - 16 - VH / 2));
    cam.x = Math.round(cam.x); cam.y = Math.round(cam.y);
    ctx.fillStyle = '#0b0a0c'; ctx.fillRect(0, 0, VW, VH);
    ctx.drawImage(map.bg, -cam.x, -cam.y);
    const list = [];
    for (const p of map.props) if (p.x - cam.x < VW && p.x + p.c.width - cam.x > 0 && p.y - cam.y < VH && p.y + p.c.height - cam.y > 0) list.push({ b: p.base, f: () => ctx.drawImage(p.c, p.x - cam.x, p.y - cam.y) });
    if (map.dyn) for (const p of map.dyn) list.push({ b: p.base, f: () => ctx.drawImage(p.c, p.x - cam.x, p.y - cam.y) });
    for (const n of npcs) list.push({ b: n.y, f: () => drawEntity(n.def.spec, n.def.specObj || D.SPEC[n.def.spec], n.x, n.y, n.dir, n.moving, n.anim) });
    if (mode !== 'title') list.push({ b: player.y + .1, f: () => drawEntity('presiden', D.SPEC.presiden, player.x, player.y, player.dir, player.moving, player.anim) });
    list.sort((a, b) => a.b - b.b).forEach(e => e.f());
    // cahaya
    const lp = lightParams(S ? S.minutes : 12 * 60);
    let d = lp.d * (map.indoor ? .55 : 1);
    if (lp.tint) { ctx.fillStyle = `rgba(${lp.tint[0]},${lp.tint[1]},${lp.tint[2]},${lp.tint[3] * (map.indoor ? .5 : 1)})`; ctx.fillRect(0, 0, VW, VH); }
    if (d > .02) {
      lctx.globalCompositeOperation = 'source-over'; lctx.clearRect(0, 0, VW, VH);
      lctx.fillStyle = `rgba(6,8,24,${d})`; lctx.fillRect(0, 0, VW, VH);
      lctx.globalCompositeOperation = 'destination-out';
      const lights = map.lights.concat(mode !== 'title' ? [{ x: player.x, y: player.y - 18, r: 46, soft: true }] : []);
      for (const L of lights) {
        const x = L.x - cam.x, y = L.y - cam.y; if (x < -L.r || x > VW + L.r || y < -L.r || y > VH + L.r) continue;
        const g = lctx.createRadialGradient(x, y, 0, x, y, L.r); g.addColorStop(0, `rgba(0,0,0,${L.soft ? .55 : 1})`); g.addColorStop(1, 'rgba(0,0,0,0)');
        lctx.fillStyle = g; lctx.fillRect(x - L.r, y - L.r, L.r * 2, L.r * 2);
      }
      ctx.drawImage(lightCv, 0, 0);
      ctx.globalCompositeOperation = 'lighter';
      for (const L of map.lights) {
        const x = L.x - cam.x, y = L.y - cam.y; if (x < -L.r || x > VW + L.r || y < -L.r || y > VH + L.r) continue;
        const g = ctx.createRadialGradient(x, y, 0, x, y, L.r * .7); g.addColorStop(0, `rgba(255,170,80,${.22 * d})`); g.addColorStop(1, 'rgba(255,170,80,0)');
        ctx.fillStyle = g; ctx.fillRect(x - L.r, y - L.r, L.r * 2, L.r * 2);
      }
      ctx.globalCompositeOperation = 'source-over';
    }
  }

  /* ---------- loop ---------- */
  let last = performance.now();
  function frame(t) {
    const dt = Math.min(.05, (t - last) / 1000); last = t;
    try { update(dt); render(); } catch (err) { console.error(err); }
    pressed.clear();
    requestAnimationFrame(frame);
  }

  /* simpan keadaan saat halaman diperbarui di penampil */
  const hot = window.claude && window.claude.hot;
  if (hot && typeof hot.snapshot === 'function') { try { hot.snapshot(() => ({ S: snapshotState(), inGame: mode !== 'title' })); } catch (_) {} }
  function start(data) {
    if (data && data.inGame && data.S) beginGame(data.S, false); else toTitle();
    requestAnimationFrame(frame);
  }
  if (hot && typeof hot.ready === 'function') hot.ready(start); else start((hot && hot.data) || {});

  V.game = { get state() { return S; }, get mode() { return mode; }, player, sleep: () => sleep(false), openOffice: t => { openOffice(); office.tab = t || 0; renderOffice(); }, plot: id => plotAction(id), enterMap: (id, x, y, d) => enterMap(id, x, y, d), setTime: m => { if (S) { S.minutes = m; hudKey = ''; } } };
})(window.V);
