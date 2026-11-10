'use strict';
/* Varsena — peta Tahap 1: alun-alun Balai Republik, pemukiman selatan, dan dalam Balai. */
window.V = window.V || {};
(function (V) {
  const A = V.art, P = A.P;

  function base(id, name, w, h, seed, indoor) {
    const bg = A.canvas(w, h);
    return { id, name, w, h, bg, k: A.kit(bg.getContext('2d'), seed), indoor: !!indoor, props: [], solids: [], warps: [], inter: [], lights: [] };
  }
  function prop(m, c, x, y, solid) {
    m.props.push({ c, x: Math.round(x - c.width / 2), y: Math.round(y - c.height), base: y });
    if (solid) m.solids.push(solid);
  }

  /* ---------- 1. Alun-alun Balai Republik ---------- */
  function plaza() {
    const m = base('plaza', 'Alun-alun Balai Republik', 720, 528, 21), k = m.k;
    k.blocks(0, 0, 720, 528, P.tile, 16, 10, .07);
    for (let i = 0; i < 90; i++) { const a = k.R() * 720, b = 150 + k.R() * 320; k.px(a, b, '#5d7a3a'); k.px(a + 1, b, '#4a6a2e'); }
    // teras atas kiri + bangunan + tangga
    k.blocks(0, 0, 150, 108, A.light(P.tile, .06), 16, 10, .07);
    k.blocks(0, 0, 48, 80, P.sand, 10, 5, .1); k.windowS(14, 18, 12, 16); k.windowS(14, 48, 12, 16); k.r(0, 78, 48, 3, A.dark(P.sand, .4));
    k.balus(0, 106, 40); k.balus(110, 106, 40);
    k.blocks(0, 120, 40, 60, P.sand2, 10, 5, .1); k.blocks(110, 120, 40, 60, P.sand2, 10, 5, .1);
    for (let i = 0; i < 12; i++) { const ya = 120 + i * 5; k.blocks(40, ya, 70, 3, A.light(P.sand, .1), 12, 3, .07); k.r(40, ya + 3, 70, 2, A.dark(P.sand, .38)); }
    k.shade(150, 108, 8, 72, .32); k.shade(0, 180, 150, 5, .25);
    m.solids.push([0, 0, 48, 92], [0, 104, 40, 76], [110, 104, 40, 76]);
    // Balai Republik
    const bx = 180, bw = 360, dc = 360;
    for (let xx = bx; xx < bx + bw; xx++) for (let yy = 0; yy < 12; yy++) { let c = k.nz(yy < 7 ? A.light(P.slate, .1) : P.slate, .06); if (yy % 3 === 2) c = A.dark(P.slate, .3); k.px(xx, yy, c); }
    k.blocks(bx, 12, bw, 120, P.sand, 14, 6, .09);
    k.r(bx - 3, 12, bw + 6, 4, A.light(P.sand, .3)); k.r(bx - 3, 16, bw + 6, 2, A.dark(P.sand, .45));
    for (const wx of [196, 236, 276, 316, 392, 432, 472, 512]) k.windowS(wx, 26, 12, 18);
    k.windowS(352, 24, 16, 22);
    k.r(bx - 3, 50, bw + 6, 4, A.light(P.sand, .32)); for (let xx = bx - 3; xx < bx + bw + 3; xx += 4) k.r(xx, 54, 2, 2, A.light(P.sand, .15)); k.r(bx - 3, 56, bw + 6, 2, A.dark(P.sand, .45));
    for (const wx of [196, 236, 276, 432, 472, 512]) k.windowS(wx, 72, 12, 22);
    k.crest(dc, 64); k.doorStone(dc - 14, 90, 28, 38); k.lampWall(dc - 34, 80); k.lampWall(dc + 34, 80);
    for (const cxp of [dc - 46, dc + 40]) { k.blocks(cxp, 58, 6, 70, A.light(P.sand, .15), 6, 4, .06); k.r(cxp + 5, 58, 1, 70, A.dark(P.sand, .4)); }
    k.blocks(bx, 124, bw, 8, A.dark(P.sand, .12), 12, 4, .08);
    k.shade(bx, 132, bw, 6, .3); k.shade(bx + bw, 12, 7, 126, .3);
    k.steps(dc - 20, 132, 40, 3, 4);
    m.solids.push([bx, 0, 166, 132], [374, 0, 166, 132], [346, 0, 28, 98]);
    m.warps.push({ r: [346, 118, 28, 14], to: 'balai', x: 288, y: 306, dir: 'up' });
    m.lights.push({ x: dc - 34, y: 86, r: 46 }, { x: dc + 34, y: 86, r: 46 });
    m.inter.push({ r: [dc - 20, 60, 40, 30], text: ['Lambang Republik Varsena: perisai teal dengan seberkas gandum emas. Gandum untuk rakyat yang memberi makan negeri, teal untuk Danau Doran yang menyatukan kota-kota.'] });
    // taman kanan atas
    k.bed(560, 0, 160, 140);
    prop(m, A.props.cypress(3, 56), 596, 136); prop(m, A.props.cypress(4, 64), 690, 132);
    m.solids.push([560, 0, 160, 140]);
    // logistik di depan Balai
    prop(m, A.props.crates(5), 478, 162, [462, 150, 32, 12]); prop(m, A.props.barrels(6), 515, 160, [500, 150, 30, 10]); prop(m, A.props.urns(7), 250, 152, [240, 144, 22, 8]);
    // kios Rinka
    prop(m, A.props.stall(8), 600, 246, [570, 222, 60, 24]);
    // monumen peringatan
    prop(m, A.props.monument(9), 360, 334, [338, 306, 44, 28]);
    m.inter.push({ r: [334, 300, 52, 38], text: [
      'MONUMEN PERINGATAN BRENNHOLD',
      '"Untuk 9.412 jiwa yang direnggut pada malam api, dua tahun lalu. Kota ini berdiri kembali agar nama kalian tidak berhenti dibaca."',
      'Di kaki monumen ada bunga-bunga segar dan sebuah sapu kecil.'] });
    // lampu taman
    for (const [lx, ly] of [[284, 300], [436, 300], [284, 392], [436, 392]]) { prop(m, A.props.lampPost(lx), lx, ly, [lx - 4, ly - 4, 8, 4]); m.lights.push({ x: lx, y: ly - 36, r: 64 }); }
    prop(m, A.props.bench(11), 210, 424, [196, 416, 28, 8]); prop(m, A.props.bench(12), 510, 424, [496, 416, 28, 8]);
    // taman bawah
    k.bed(20, 380, 110, 60); k.bed(590, 380, 110, 60);
    prop(m, A.props.cypress(13, 50), 75, 432); prop(m, A.props.cypress(14, 50), 645, 432);
    m.solids.push([20, 380, 110, 60], [590, 380, 110, 60]);
    // tepi bawah: balustrade, atap rumah, tangga turun
    k.balus(0, 470, 312); k.balus(408, 470, 312);
    k.r(0, 484, 720, 44, '#3a352c');
    k.roofTop(0, 486, 300, 42); k.roofTop(420, 490, 300, 38);
    for (let i = 0; i < 9; i++) { const ya = 484 + i * 5; k.blocks(312, ya, 96, 3, A.light(P.sand, .1), 12, 3, .07); k.r(312, ya + 3, 96, 2, A.dark(P.sand, .38)); }
    k.shade(0, 484, 720, 5, .35);
    m.solids.push([0, 468, 312, 60], [408, 468, 312, 60]);
    m.warps.push({ r: [312, 514, 96, 14], to: 'kampung', x: 384, y: 74, dir: 'down' });
    m.inter.push({ r: [190, 470, 100, 14], text: ['Dari balustrade ini terlihat atap-atap pemukiman selatan. Banyak yang masih hitam bekas terbakar.'] });
    return m;
  }

  /* ---------- 2. Pemukiman selatan ---------- */
  function kampung() {
    const m = base('kampung', 'Pemukiman Selatan', 768, 576, 33), k = m.k;
    k.ground(0, 0, 768, 576, 3);
    k.path(352, 56, 64, 400); k.path(20, 250, 728, 32);
    // tembok kota atas + tangga naik
    k.blocks(0, 0, 336, 56, P.sand2, 14, 6, .1); k.blocks(432, 0, 336, 56, P.sand2, 14, 6, .1);
    k.r(0, 0, 336, 3, A.light(P.sand, .3)); k.r(432, 0, 336, 3, A.light(P.sand, .3));
    for (let i = 0; i < 11; i++) { const ya = i * 5; k.blocks(336, ya, 96, 3, A.light(P.sand, .1), 12, 3, .07); k.r(336, ya + 3, 96, 2, A.dark(P.sand, .38)); }
    k.shade(0, 56, 768, 5, .3);
    m.solids.push([0, 0, 336, 58], [432, 0, 336, 58]);
    m.warps.push({ r: [336, 0, 96, 8], to: 'plaza', x: 360, y: 500, dir: 'up' });
    // rumah
    const house = (a, w, wy, burnt, lit) => {
      k.found(a - 2, wy + 40, w + 4, 6); k.wall(a, wy, w, 40, P.plank, [56]);
      if (burnt) for (let yy = 0; yy < 40; yy++) for (let xx = 0; xx < w; xx++) { const sx = xx / w; if (k.R() < (1 - yy / 40) * .65 * sx + .05 * sx) k.px(a + xx, wy + yy, k.nz('#241a16', .15)); }
      k.win(a + 14, wy + 12, 16, 14, lit, burnt); if (!burnt) k.shutters(a + 14, wy + 12, 16, 14); k.win(a + w - 30, wy + 12, 16, 14, lit, burnt);
      k.doorWood(a + w / 2 - 8, wy + 14, 16, 26);
      if (burnt) for (const yy of [wy + 19, wy + 30]) k.r(a + w / 2 - 11, yy, 22, 3, '#5a4636');
      k.steps(a + w / 2 - 11, wy + 47, 22, 2, 0, P.stone);
      if (!burnt) { k.roof(a - 10, wy - 46, w + 20, 48, 16, P.shingle); k.r(a + w - 28, wy - 56, 8, 14, P.stone); k.r(a + w - 28, wy - 56, 8, 2, '#9a9488'); }
      else {
        k.roof(a - 10, wy - 46, 62, 48, 16, P.shingle); k.r(a + 52, wy - 32, w - 42, 34, '#120d0b');
        for (let i = 0; i < 6; i++) { const xa = a + 56 + i * 11; k.r(xa, wy - 38 + (i % 2) * 4, 3, 40 - (i % 2) * 4, '#2e2018'); k.r(xa, wy - 38 + (i % 2) * 4, 1, 40 - (i % 2) * 4, '#4a3424'); }
        k.r(a + 50, wy - 32, w - 38, 3, '#2e2018'); k.r(a + 50, wy - 16, w - 38, 2, '#2e2018');
        k.rubble(a + w - 20, wy + 42, 44, 50);
      }
      k.eaveShadow(a, wy, w, 4);
      m.solids.push([a - 10, wy - 50, w + 20, 96]);
      if (lit) m.lights.push({ x: a + 22, y: wy + 19, r: 30, win: true }, { x: a + w - 22, y: wy + 19, r: 30, win: true });
      m.inter.push({ r: [a + w / 2 - 12, wy + 40, 24, 12], text: burnt
        ? ['Rumah ini hangus pada malam api. Pintunya dipalang papan. Di ambang pintu ada sepatu anak-anak yang menghitam.', 'Suatu hari, rumah ini bisa dibangun ulang.']
        : ['Rumah warga. Dari dalam terdengar suara panci dan anak-anak. Lebih baik tidak mengganggu.'] });
    };
    house(40, 116, 110, false, true); house(200, 116, 110, true); house(480, 116, 110, false, true); house(630, 116, 110, true);
    // petak kosong
    for (const [a, b, w, h] of [[40, 320, 120, 72], [190, 320, 120, 72]]) {
      for (let yy = b; yy < b + h; yy++) for (let xx = a; xx < a + w; xx++) k.px(xx, yy, k.nz(A.mix(P.dirt, P.grass, .15), .07));
      for (let xx = a; xx < a + w; xx += 2) { k.px(xx, b, '#d8c690'); k.px(xx, b + h - 1, '#d8c690'); }
      for (let yy = b; yy < b + h; yy += 2) { k.px(a, yy, '#d8c690'); k.px(a + w - 1, yy, '#d8c690'); }
      for (const [sx, sy] of [[a, b], [a + w - 1, b], [a, b + h - 1], [a + w - 1, b + h - 1]]) k.r(sx - 1, sy - 4, 3, 5, P.wood2);
      prop(m, A.props.sign(a), a + w / 2, b + 24, [a + w / 2 - 4, b + 18, 8, 6]);
      m.inter.push({ r: [a, b, w, h], text: ['Petak kosong. Patok dan tali sudah dipasang oleh Barro.', 'Di sini bisa dibangun rumah baru untuk warga yang pulang. (Membangun akan tersedia di Tahap 2.)'] });
    }
    // ladang berpagar
    const fx = 460, fy = 300, fw = 260, fh = 130;
    for (let yy = fy; yy < fy + fh; yy++) for (let xx = fx; xx < fx + fw; xx++) k.px(xx, yy, k.nz(P.soil, .06));
    for (let yy = fy + 6, row = 0; yy < fy + fh - 4; yy += 8, row++) { k.r(fx + 4, yy, fw - 8, 3, P.soil2); for (let xx = fx + 8 + (row % 2) * 3; xx < fx + fw - 8; xx += 7) if (k.R() < .82) { k.px(xx, yy - 1, P.sprout); k.px(xx - 1, yy - 2, P.sprout); k.px(xx + 1, yy - 2, A.light(P.sprout, .25)); k.px(xx, yy - 3, A.light(P.sprout, .15)); } }
    const post = (x, y) => { k.r(x - 1, y - 6, 3, 8, P.wood); k.r(x - 1, y - 6, 1, 8, A.light(P.wood, .25)); };
    for (let xx = fx; xx <= fx + fw; xx += 12) { post(xx, fy); post(xx, fy + fh); }
    for (let yy = fy; yy <= fy + fh; yy += 12) { if (yy < fy + 30 || yy > fy + 64) post(fx, yy); post(fx + fw, yy); }
    k.r(fx, fy - 4, fw, 1, P.wood2); k.r(fx, fy + fh - 4, fw, 1, P.wood2); k.r(fx + fw, fy - 4, 1, fh, P.wood2);
    m.solids.push([fx - 2, fy - 6, fw + 4, 6], [fx - 2, fy + fh - 6, fw + 4, 8], [fx + fw - 2, fy - 6, 5, fh + 6], [fx - 2, fy - 6, 5, 36], [fx - 2, fy + 64, 5, fh - 64]);
    m.inter.push({ r: [fx + 10, fy + 10, fw - 20, fh - 20], text: ['Lobak, kacang, dan sedikit gandum. Daunnya masih muda tapi hijau pekat.'] });
    // danau
    for (let xx = 0; xx < 768; xx++) { const st = Math.round(458 + Math.sin(xx * .05) * 3); for (let yy = st; yy < 480; yy++) k.px(xx, yy, k.nz(P.sand3, .08)); }
    k.water(0, 480, 768, 96); for (let xx = 0; xx < 768; xx++) k.px(xx, 480, A.light(P.water, .35));
    for (const [a, b] of [[20, 120], [300, 400]]) for (let xx = a; xx < b; xx += 3) if (k.R() < .6) { k.r(xx, 464 - k.R() * 4, 1, 8, '#3d5a28'); }
    k.r(610, 440, 36, 136, P.wood); for (let yy = 443; yy < 576; yy += 4) k.r(610, yy, 36, 1, P.wood2); k.r(608, 440, 2, 136, P.beam); k.r(646, 440, 2, 136, P.beam);
    prop(m, A.props.boat(40), 708, 540);
    m.solids.push([0, 478, 608, 98], [648, 478, 120, 98]);
    m.inter.push({ r: [100, 474, 200, 10], text: ['Danau Doran. Airnya dingin dan jernih. Di kejauhan terlihat samar-samar menara South Lake City.'] });
    prop(m, A.props.lampPost(41), 650, 452, [646, 448, 8, 4]); m.lights.push({ x: 650, y: 416, r: 64 });
    prop(m, A.props.lampPost(42), 432, 246, [428, 242, 8, 4]); m.lights.push({ x: 432, y: 210, r: 64 });
    // pohon
    for (const [tx, ty, ts] of [[18, 232, 40], [748, 236, 38], [330, 430, 34], [446, 452, 30], [160, 446, 36], [740, 452, 34], [12, 440, 30]]) prop(m, A.props.tree(tx + ty, ts), tx, ty, [tx - 5, ty - 10, 10, 8]);
    prop(m, A.props.barrels(43), 30, 170, [16, 162, 28, 8]); prop(m, A.props.crates(44), 610, 172, [594, 162, 32, 10]);
    return m;
  }

  /* ---------- 3. Di dalam Balai Republik ---------- */
  function balai() {
    const m = base('balai', 'Balai Republik', 576, 336, 55, true), k = m.k;
    // lantai papan
    for (let yy = 64; yy < 336; yy++) { const row = Math.floor((yy - 64) / 6); for (let xx = 0; xx < 576; xx++) { const seam = (xx + row * 17) % 48 === 0; let c = k.nz(row % 2 ? P.floor : A.light(P.floor, .05), .05); if ((yy - 64) % 6 === 0 || seam) c = A.dark(P.floor, .35); k.px(xx, yy, c); } }
    // dinding atas
    for (let yy = 0; yy < 64; yy++) for (let xx = 0; xx < 576; xx++) k.px(xx, yy, k.nz(yy < 40 ? P.wallIn : P.wood, .05));
    for (let xx = 0; xx < 576; xx += 4) k.r(xx, 40, 1, 24, A.dark(P.wood, .3));
    k.r(0, 38, 576, 3, P.beam); k.r(0, 61, 576, 3, A.dark(P.wood, .5)); k.r(0, 0, 576, 4, P.beam);
    for (let xx = 0; xx < 576; xx += 48) k.r(xx, 0, 4, 40, P.beam);
    k.shade(0, 64, 576, 6, .3);
    // jendela
    for (const wx of [70, 470, 520]) { k.r(wx - 2, 8, 24, 26, P.beam); k.r(wx, 10, 20, 22, '#9cc4d4'); k.r(wx + 9, 10, 2, 22, P.beam); k.r(wx, 20, 20, 2, P.beam); k.r(wx, 10, 20, 3, '#c8e0e8'); }
    // panji di lobi
    k.banner(214, 6, 14, 30); k.banner(348, 6, 14, 30);
    // permadani lobi
    k.r(258, 64, 60, 264, '#5a1e1e'); k.r(262, 64, 52, 264, P.carpet); for (let yy = 70; yy < 328; yy += 12) k.r(266, yy, 44, 1, A.light(P.carpet, .15)); k.r(262, 64, 2, 264, P.gold); k.r(312, 64, 2, 264, P.gold);
    // permadani kamar & kantor
    k.r(36, 180, 100, 70, '#2f4a5a'); k.r(40, 184, 92, 62, '#3a5a6a'); k.r(40, 184, 92, 2, P.gold);
    k.r(430, 230, 120, 80, '#4a3a2a'); k.r(434, 234, 112, 72, '#5a4632'); k.r(434, 234, 112, 2, P.gold);
    // dinding sekat
    const wallV = (x) => { k.r(x, 64, 8, 120, P.beam); k.r(x, 64, 2, 120, A.light(P.beam, .25)); k.r(x, 240, 8, 96, P.beam); k.r(x, 240, 2, 96, A.light(P.beam, .25)); k.shade(x + 8, 64, 4, 120, .3); k.shade(x + 8, 240, 4, 96, .3); };
    wallV(176); wallV(392);
    k.r(0, 64, 6, 272, P.beam); k.r(570, 64, 6, 272, P.beam);
    k.r(0, 328, 268, 8, P.beam); k.r(308, 328, 268, 8, P.beam); k.r(268, 330, 40, 6, '#1a120c');
    m.solids.push([0, 0, 576, 66], [176, 64, 8, 120], [176, 240, 8, 96], [392, 64, 8, 120], [392, 240, 8, 96], [0, 64, 6, 272], [570, 64, 6, 272], [0, 326, 268, 10], [308, 326, 268, 10]);
    m.warps.push({ r: [268, 330, 40, 6], to: 'plaza', x: 360, y: 152, dir: 'down' });
    // lobi: meja penerima
    prop(m, A.props.reception(1), 288, 150, [238, 126, 100, 24]);
    m.inter.push({ r: [238, 112, 100, 50], npc: 'elin' });
    prop(m, A.props.plant(2), 210, 100, [202, 92, 16, 8]); prop(m, A.props.plant(3), 366, 100, [358, 92, 16, 8]);
    m.lights.push({ x: 288, y: 110, r: 90 }, { x: 288, y: 250, r: 90 });
    // kantor
    prop(m, A.props.shelf(4), 432, 70, [408, 62, 48, 8]); prop(m, A.props.shelf(5), 552, 70, [528, 62, 42, 8]);
    prop(m, A.props.desk(6), 494, 196, [454, 168, 80, 28]);
    m.inter.push({ r: [454, 160, 80, 40], act: 'office', text: null });
    prop(m, A.props.mapTable(7), 480, 300, [450, 270, 60, 28]);
    m.inter.push({ r: [450, 266, 60, 38], text: ['Peta wilayah Republik Varsena. Delapan kota ditandai pin: Brennhold, Greenleaf, Gold Mines, South Lake, Twin River, Fort Wendel, Eternal City, dan Kairos.', 'Pin merah di South Lake. Pin hitam di Eternal City. Seseorang menulis di pinggir peta dengan tulisan rapi: "prioritas".'] });
    m.inter.push({ r: [408, 62, 48, 14], text: ['Buku-buku hukum Kerajaan Hal, sebagian besar dicoret. Di sebelahnya, buku tipis berjudul "Undang-Undang Dasar Republik Varsena — draf ketiga".'] });
    m.lights.push({ x: 518, y: 166, r: 70 });
    // kamar presiden
    prop(m, A.props.bedFurn(8), 60, 144, [40, 84, 40, 60]);
    m.inter.push({ r: [36, 80, 48, 70], act: 'sleep' });
    prop(m, A.props.wardrobe(9), 140, 100, [122, 70, 36, 30]);
    m.inter.push({ r: [122, 70, 36, 34], text: ['Lemari pakaian. Isinya: dua setel pakaian resmi, satu jubah perang yang sudah dijahit ulang, dan sepasang sepatu yang belum pernah dipakai.'] });
    prop(m, A.props.plant(10), 20, 320, [12, 312, 16, 8]);
    m.lights.push({ x: 100, y: 96, r: 70 });
    return m;
  }

  const builders = { plaza, kampung, balai };
  const cache = {};
  V.maps = { get(id) { if (!cache[id]) cache[id] = builders[id](); return cache[id]; } };
})(window.V);
