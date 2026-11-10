'use strict';
/* Varsena — seni piksel prosedural (gaya Opsi D, 32-bit Klasik).
   Semua sprite dan latar digambar lewat kode. Bisa diganti gambar artist nanti
   selama ukurannya sama (sprite 24x40, potret 64x64, ubin 24). */
window.V = window.V || {};
(function (V) {
  const hx = h => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
  const toH = (r, g, b) => '#' + [r, g, b].map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
  const mix = (a, b, t) => { t = Math.max(0, Math.min(1, t)); const A = hx(a), B = hx(b); return toH(A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t, A[2] + (B[2] - A[2]) * t); };
  const rng = s => () => { s |= 0; s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  const dark = (c, t) => mix(c, '#1c1426', t), light = (c, t) => mix(c, '#fff1cf', t);
  const OUTLINE = '#18110f';
  const CW = 24, CH = 40, PW = 64;
  const PR = { hy: .2, hrx: .3, hry: .17, by0: .4, by1: .74, tw0: .5, tw1: .46, ay1: .7, lx: .19, armW: .12, eyeX: .12 };

  function canvas(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }

  /* ---------- grid piksel ---------- */
  function Grid(w, h, px, py) { this.w = w; this.h = h; this.px = px; this.py = py; this.c = new Array(w * h).fill(null); this.f = new Uint8Array(w * h); }
  Grid.prototype.set = function (x, y, c, f) { x = Math.floor(x) + this.px; y = Math.floor(y) + this.py; if (x < 0 || y < 0 || x >= this.w || y >= this.h) return; const i = y * this.w + x; this.c[i] = c; this.f[i] = f || 0; };
  Grid.prototype.at = function (x, y) { x = Math.floor(x) + this.px; y = Math.floor(y) + this.py; if (x < 0 || y < 0 || x >= this.w || y >= this.h) return null; return this.c[y * this.w + x]; };
  function painter(g) {
    const fill = (test, c, f, x0, y0, x1, y1) => { for (let y = Math.floor(y0) - 1; y <= Math.ceil(y1) + 1; y++) for (let x = Math.floor(x0) - 1; x <= Math.ceil(x1) + 1; x++) if (test(x + .5, y + .5)) g.set(x, y, c, f); };
    return {
      fill,
      ell: (cx, cy, rx, ry, c, f, ex) => fill((x, y) => ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1 && (!ex || ex(x, y)), c, f, cx - rx, cy - ry, cx + rx, cy + ry),
      rect: (x0, y0, x1, y1, c, f) => fill((x, y) => x >= x0 && x < x1 && y >= y0 && y < y1, c, f, x0, y0, x1, y1),
      tri: (a, b, d, c, f) => { const s = (p, q, r) => (p[0] - r[0]) * (q[1] - r[1]) - (q[0] - r[0]) * (p[1] - r[1]); fill((x, y) => { const P = [x, y], d1 = s(P, a, b), d2 = s(P, b, d), d3 = s(P, d, a); return !((d1 < 0 || d2 < 0 || d3 < 0) && (d1 > 0 || d2 > 0 || d3 > 0)); }, c, f, Math.min(a[0], b[0], d[0]), Math.min(a[1], b[1], d[1]), Math.max(a[0], b[0], d[0]), Math.max(a[1], b[1], d[1])); },
      line: (x0, y0, x1, y1, c, th) => { const n = Math.ceil(Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0))) * 2 + 1; for (let i = 0; i <= n; i++) { const t = i / n, x = x0 + (x1 - x0) * t, y = y0 + (y1 - y0) * t; for (let k = 0; k < th; k++) g.set(x + k, y, c); } }
    };
  }
  /* bayangan 3–4 tingkat + garis tepi gelap */
  function finish(g) {
    const W = g.w, H = g.h, out = g.c.slice();
    const same = (i, j) => j >= 0 && g.c[j] !== null && (g.c[j] === g.c[i] || g.f[j] === 1);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const i = y * W + x; if (!g.c[i] || g.f[i]) continue;
      const r1 = x + 1 < W ? i + 1 : -1, r2 = x + 2 < W ? i + 2 : -1, l1 = x > 0 ? i - 1 : -1, u1 = y > 0 ? i - W : -1, d1 = y + 1 < H ? i + W : -1;
      const eR1 = !same(i, r1), eR2 = !eR1 && !same(i, r2), eL = !same(i, l1), eU = !same(i, u1), eB = !same(i, d1);
      if (eR1) out[i] = dark(g.c[i], .4); else if (eR2) out[i] = dark(g.c[i], .22); else if (eB) out[i] = dark(g.c[i], .18);
      else if (eU) out[i] = light(g.c[i], .2); else if (eL) out[i] = light(g.c[i], .13); else if (x > W * .56) out[i] = dark(g.c[i], .09);
    }
    const res = out.slice();
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const i = y * W + x; if (g.c[i]) continue;
      if ((x > 0 && g.c[i - 1]) || (x + 1 < W && g.c[i + 1]) || (y > 0 && g.c[i - W]) || (y + 1 < H && g.c[i + W])) res[i] = OUTLINE;
    }
    return res;
  }
  function gridCanvas(g, cols, flip) {
    const cv = canvas(g.w, g.h), x = cv.getContext('2d');
    for (let i = 0; i < cols.length; i++) if (cols[i]) { x.fillStyle = cols[i]; const gx = i % g.w; x.fillRect(flip ? g.w - 1 - gx : gx, Math.floor(i / g.w), 1, 1); }
    return cv;
  }

  /* ---------- sprite karakter 4 arah, 4 frame jalan ----------
     dir: 'down' | 'up' | 'left' | 'right'; frame: 0 diam, 1 langkah A, 2 diam, 3 langkah B */
  function drawChar(sp, dir, frame) {
    dir = dir || 'down'; frame = frame || 0;
    const flip = dir === 'left'; if (flip) dir = 'right';
    const side = dir === 'right', back = dir === 'up', front = dir === 'down';
    const step = frame === 1 ? 1 : frame === 3 ? -1 : 0;
    const W = CW, H0 = CH, px = 1 + Math.ceil(W * .32), py = 1 + Math.ceil(H0 * .11);
    const H = sp.hm ? Math.round(H0 * sp.hm) : H0, wm = sp.wm || 1;
    const g = new Grid(W + 2 * px, H0 + py + 1, px, py + (H0 - H)), p = painter(g);
    const cx = W / 2, hcx = side ? cx + W * .04 : cx;
    const hy = H * PR.hy, hrx = W * PR.hrx, hry = H * PR.hry, by0 = H * PR.by0, by1 = H * PR.by1, bl = by1 - by0;
    const tw0 = W * PR.tw0 * wm * (side ? .72 : 1), tw1 = W * PR.tw1 * wm * (side ? .72 : 1);
    const tw = y => tw0 + (tw1 - tw0) * Math.max(0, Math.min(1, (y - by0) / (by1 - by0)));
    const bcx = side ? cx - W * .02 : cx;
    const inHead = (x, y, e) => ((x - hcx) / (hrx + e)) ** 2 + ((y - hy) / (hry + e)) ** 2 <= 1;

    // jubah di belakang tubuh
    if (sp.cape && !back) {
      if (side) for (let y = Math.floor(by0); y < H * .9; y++) { const h = W * .2 + (y - by0) * .06; p.rect(bcx - h - W * .06, y, bcx + W * .04, y + 1, sp.cape); }
      else for (let y = Math.floor(by0); y < H * .9; y++) { const h = W * .34 * wm + (y - by0) * .09; p.rect(cx - h, y, cx + h, y + 1, sp.cape); }
    }
    if (sp.tail && !back) {
      if (side) { p.ell(cx - W * .42, H * .7, W * .17, H * .1, sp.skin); p.ell(cx - W * .52, H * .62, W * .1, H * .06, sp.muzzle); }
      else { p.ell(cx + W * .44, H * .7, W * .17, H * .1, sp.skin); p.ell(cx + W * .52, H * .62, W * .1, H * .06, sp.muzzle); }
    }
    if (sp.hairStyle === 'long' && front) p.rect(cx - hrx * .95, hy, cx + hrx * .95, H * .62, sp.hair);

    // kaki
    const lx = W * PR.lx * Math.min(wm, 1.12), shoeH = Math.max(1, Math.round(H * .11)), feet = sp.shoes || sp.skin;
    const leg = (x0, x1, raise, shade) => {
      const yb = H - raise, pc = shade ? dark(sp.pants, .18) : sp.pants, fc = shade ? dark(feet, .18) : feet;
      p.rect(x0, by1 - 1, x1, yb, pc); p.rect(x0 - .4, yb - shoeH, x1 + .4, yb, fc);
      if (sp.shoes) p.rect(x0 - .4, yb - shoeH, x1 + .4, yb - shoeH + 1, mix(fc, '#ffffff', .18));
    };
    if (side) {
      const lw = W * .2, o = step * 3;
      leg(bcx - lw / 2 - o, bcx + lw / 2 - o, step ? 1 : 0, true);
      leg(bcx - lw / 2 + o, bcx + lw / 2 + o, 0, false);
    } else {
      leg(cx - lx, cx - W * .03, step === 1 ? 2 : 0, false);
      leg(cx + W * .03, cx + lx, step === -1 ? 2 : 0, false);
    }
    // tubuh
    const bottom = sp.long ? H * .93 : by1;
    for (let y = Math.floor(by0); y < bottom; y++) {
      const h = y < by1 ? tw(y) / 2 : tw1 / 2 + (y - by1) * .16;
      for (let x = Math.floor(bcx - h - 1); x <= bcx + h + 1; x++) {
        const xc = x + .5; if (xc < bcx - h || xc > bcx + h) continue;
        let c = sp.outfit;
        if (sp.vest) { if (side) { if (xc < bcx - h * .1) c = sp.vest; } else if (Math.abs(xc - bcx) > h * .42 || back) c = sp.vest; }
        g.set(x, y, c);
      }
    }
    if (sp.skirt) for (let y = Math.floor(by0 + bl * .6); y < by1 + (H - by1) * .45; y++) { const h = tw1 / 2 + (y - (by0 + bl * .6)) * .22; p.rect(bcx - h, y, bcx + h, y + 1, sp.skirt); }
    if (sp.belly && front) p.ell(cx, by0 + bl * .53, W * .12, bl * .33, sp.belly);
    if (!sp.armor) for (let y = Math.floor(by0 + bl * .35); y < bottom - 1; y++) g.set(Math.floor(bcx + tw1 * .28), y, mix(sp.outfit, '#000000', .18));
    if (sp.trim && front) for (let y = Math.floor(by0 + 1); y < bottom; y++) g.set(Math.floor(cx - .01), y, sp.trim);
    if (!sp.skirt && !sp.armor && !sp.belly) {
      const y = Math.round(by0 + bl * .67), bc = sp.belt || '#4a3220';
      p.rect(bcx - tw(y) / 2, y, bcx + tw(y) / 2, y + 2, bc);
      if (front) { g.set(Math.floor(cx - .01), y, sp.trim || '#e0b84a', 1); g.set(Math.floor(cx - .01), y + 1, sp.trim || '#e0b84a', 1); }
    }
    if (sp.armor) {
      if (front) p.ell(cx - W * .06, by0 + H * .09, W * .09, H * .05, mix(sp.outfit, '#ffffff', .35));
      const pc = mix(sp.outfit, '#ffffff', .15);
      if (side) p.ell(bcx, by0 + H * .03, W * .14, H * .055, pc);
      else { p.ell(cx - tw0 / 2, by0 + H * .03, W * .16, H * .055, pc); p.ell(cx + tw0 / 2, by0 + H * .03, W * .16, H * .055, pc); }
    }
    if (sp.sash && !side) { if (front) p.line(cx - tw0 / 2 + .5, by0 + 1, cx + tw1 / 2 - 1.5, by1 - 1.5, sp.sash, 2); else p.line(cx + tw0 / 2 - 2.5, by0 + 1, cx - tw1 / 2 + .5, by1 - 1.5, sp.sash, 2); }
    if (sp.cape && back) for (let y = Math.floor(by0); y < H * .9; y++) { const h = W * .3 * wm + (y - by0) * .09; p.rect(cx - h, y, cx + h, y + 1, sp.cape); }
    if (sp.tail && back) { p.ell(cx + W * .1, H * .74, W * .14, H * .1, sp.skin); p.ell(cx + W * .14, H * .8, W * .08, H * .05, sp.muzzle); }
    if (sp.hairStyle === 'long' && back) p.rect(cx - hrx * .9, hy, cx + hrx * .9, H * .6, sp.hair);
    // lengan
    const aw = Math.max(1.6, W * PR.armW * Math.min(wm, 1.15)), sl = sp.sleeve || sp.outfit, ay1 = H * PR.ay1, handH = Math.max(1, H * .06);
    if (side) {
      const ax = bcx - aw / 2 + step * 2;
      p.rect(ax, by0 + .5, ax + aw, ay1 - handH, sl); p.rect(ax, ay1 - handH, ax + aw, ay1, sp.skin);
    } else {
      const s1 = front ? step : -step;
      p.rect(cx - tw0 / 2 - aw, by0 + .5 + s1, cx - tw0 / 2, ay1 - handH + s1, sl); p.rect(cx - tw0 / 2 - aw, ay1 - handH + s1, cx - tw0 / 2, ay1 + s1, sp.skin);
      p.rect(cx + tw0 / 2, by0 + .5 - s1, cx + tw0 / 2 + aw, ay1 - handH - s1, sl); p.rect(cx + tw0 / 2, ay1 - handH - s1, cx + tw0 / 2 + aw, ay1 - s1, sp.skin);
    }
    if (sp.scarf) {
      p.rect(bcx - tw0 / 2 - .3, by0, bcx + tw0 / 2 + .3, by0 + Math.max(1.2, H * .06), sp.scarf);
      if (front) p.rect(cx + W * .08, by0, cx + W * .08 + Math.max(1.2, W * .08), by0 + bl * .5, sp.scarf);
      if (side) p.rect(bcx - tw0 / 2 - 2, by0, bcx - tw0 / 2, by0 + bl * .4, sp.scarf);
    }
    // telinga / sirip (di belakang kepala)
    if (sp.ears) {
      if (side) p.tri([hcx - hrx * .25, hy - hry - H * .1], [hcx - hrx * .75, hy - hry * .4], [hcx + hrx * .2, hy - hry * .8], sp.skin);
      else {
        p.tri([cx - hrx * .62, hy - hry - H * .1], [cx - hrx * 1.02, hy - hry * .35], [cx - hrx * .12, hy - hry * .8], sp.skin);
        p.tri([cx + hrx * .62, hy - hry - H * .1], [cx + hrx * 1.02, hy - hry * .35], [cx + hrx * .12, hy - hry * .8], sp.skin);
        if (front) { p.tri([cx - hrx * .6, hy - hry - H * .04], [cx - hrx * .82, hy - hry * .55], [cx - hrx * .35, hy - hry * .75], '#3a2418'); p.tri([cx + hrx * .6, hy - hry - H * .04], [cx + hrx * .82, hy - hry * .55], [cx + hrx * .35, hy - hry * .75], '#3a2418'); }
      }
    }
    if (sp.fins) {
      if (side) p.tri([hcx - hrx * .6, hy - hry * .35], [hcx - hrx - W * .2, hy - hry * .75], [hcx - hrx * .6, hy + hry * .35], sp.fins);
      else {
        p.tri([cx - hrx * .75, hy - hry * .35], [cx - hrx - W * .2, hy - hry * .75], [cx - hrx * .75, hy + hry * .35], sp.fins);
        p.tri([cx + hrx * .75, hy - hry * .35], [cx + hrx + W * .2, hy - hry * .75], [cx + hrx * .75, hy + hry * .35], sp.fins);
      }
      p.tri([hcx - W * .1, hy - hry * .6], [hcx - W * .02, hy - hry - H * .09], [hcx + W * .12, hy - hry * .6], sp.fins);
    }
    // kepala
    p.ell(hcx, hy, hrx, hry, sp.skin);
    if (sp.muzzle) {
      if (front) p.ell(cx, hy + hry * .5, hrx * .62, hry * .45, sp.muzzle, 0, (x, y) => inHead(x, y, 0));
      if (side) { p.ell(hcx + hrx * .7, hy + hry * .35, hrx * .5, hry * .35, sp.muzzle); g.set(Math.floor(hcx + hrx * 1.12), Math.round(hy + hry * .2), '#2a1a10', 1); }
    }
    // rambut
    const hs = sp.hairStyle;
    if (['short', 'bun', 'long'].includes(hs)) {
      if (front) {
        const wave = x => sp.neat ? 0 : ((Math.floor(x) % 3 === 0) ? hry * .22 : 0);
        p.fill((x, y) => inHead(x, y, .6) && (y < hy - hry * .12 + wave(x) || (Math.abs(x - cx) > hrx * .74 && y < hy + hry * (hs === 'short' ? .2 : .55))), sp.hair, 0, cx - hrx - 1, hy - hry - 1, cx + hrx + 1, hy + hry);
      } else if (back) {
        p.fill((x, y) => inHead(x, y, .6) && y < hy + hry * (hs === 'short' ? .7 : .95), sp.hair, 0, cx - hrx - 1, hy - hry - 1, cx + hrx + 1, hy + hry + 1);
      } else {
        p.fill((x, y) => inHead(x, y, .6) && (y < hy - hry * .2 || (x < hcx + hrx * .1 && y < hy + hry * (hs === 'short' ? .45 : .8))), sp.hair, 0, hcx - hrx - 1, hy - hry - 1, hcx + hrx + 1, hy + hry);
      }
      if (hs === 'bun') { if (side) p.ell(hcx - hrx * .85, hy - hry * .45, W * .11, H * .05, sp.hair); else p.ell(cx, hy - hry * .98, W * .13, H * .045, sp.hair); }
      p.fill((x, y) => g.at(x, y) === sp.hair && Math.floor(x) % 3 === 1 && y > hy - hry * .7, mix(sp.hair, '#000000', .2), 0, hcx - hrx - 1, hy - hry - 2, hcx + hrx + 1, hy + hry);
    }
    if (hs === 'hat') {
      p.fill((x, y) => inHead(x, y, .5) && (y < hy - hry * .1 || back), sp.hair, 0, hcx - hrx - 1, hy - hry - 1, hcx + hrx + 1, hy + hry);
      p.ell(hcx, hy - hry * .32, hrx * 1.35, hry * .3, sp.hat); p.ell(hcx, hy - hry * .75, hrx * .7, hry * .42, sp.hat);
    }
    if (sp.beard) {
      if (front) p.fill((x, y) => inHead(x, y, 0) && ((y > hy + hry * .38 && Math.abs(x - cx) < hrx * .9) || (y > hy - hry * .05 && Math.abs(x - cx) > hrx * .72)), sp.beard, 0, cx - hrx, hy - hry, cx + hrx, hy + hry);
      if (side) p.fill((x, y) => inHead(x, y, 0) && y > hy + hry * .3 && x > hcx - hrx * .3, sp.beard, 0, hcx - hrx, hy - hry, hcx + hrx, hy + hry);
    }
    if (hs === 'bald') g.set(Math.floor(hcx - hrx * .4), Math.floor(hy - hry * .65), mix(sp.skin, '#ffffff', .35), 1);
    // wajah
    const ey = Math.round(hy + hry * .12), dk = '#1d1620';
    if (front) {
      const exL = Math.floor(cx - W * PR.eyeX), exR = W - 1 - exL;
      for (const ex of [exL, exR]) {
        g.set(ex, ey, dk, 1); g.set(ex, ey + 1, sp.eye, 1);
        if (sp.bigEye) { g.set(ex + (ex === exL ? -1 : 1), ey, '#f4f4f0', 1); g.set(ex + (ex === exL ? -1 : 1), ey + 1, '#f4f4f0', 1); }
      }
      if (sp.glasses) for (let x = exL - 1; x <= exR + 1; x++) { if (x === exL || x === exR) continue; g.set(x, ey, sp.glasses, 1); }
      if (sp.muzzle) g.set(Math.floor(cx - .01), Math.round(hy + hry * .42), '#2a1a10', 1);
    } else if (side) {
      const ex = Math.floor(hcx + hrx * .45);
      g.set(ex, ey, dk, 1); g.set(ex, ey + 1, sp.eye, 1);
      if (sp.bigEye) { g.set(ex + 1, ey, '#f4f4f0', 1); g.set(ex + 1, ey + 1, '#f4f4f0', 1); }
      if (sp.glasses) { g.set(ex - 1, ey, sp.glasses, 1); g.set(ex + 1, ey, sp.glasses, 1); for (let x = Math.floor(hcx - hrx * .4); x < ex - 1; x++) g.set(x, ey, sp.glasses, 1); }
    }
    return gridCanvas(g, finish(g), flip);
  }

  /* ---------- potret dialog 64x64 ---------- */
  function drawPortrait(sp) {
    const P = PW, g = new Grid(P + 2, P + 2, 1, 1), p = painter(g), cx = P / 2;
    const fcy = P * .47, frx = P * .25, fry = P * .27;
    const inFace = (x, y) => { const dy = (y - fcy) / fry; if (Math.abs(dy) > 1) return false; const rx = dy < 0 ? frx * 1.05 * Math.sqrt(1 - dy * dy) : frx * Math.sqrt(1 - dy * dy) * (1 - .22 * dy); return Math.abs(x - cx) <= rx; };
    const inBody = (x, y) => ((x - cx) / (P * .47)) ** 2 + ((y - P * 1.04) / (P * .3)) ** 2 <= 1;
    p.ell(cx, P * 1.04, P * .47, P * .3, sp.outfit);
    if (sp.cape) p.fill((x, y) => inBody(x, y) && Math.abs(x - cx) > P * .27, sp.cape, 0, 0, P * .7, P, P);
    if (sp.vest) p.fill((x, y) => inBody(x, y) && Math.abs(x - cx) > P * .13, sp.vest, 0, 0, P * .7, P, P);
    if (sp.armor) { p.ell(cx - P * .33, P * .82, P * .15, P * .09, mix(sp.outfit, '#ffffff', .15)); p.ell(cx + P * .33, P * .82, P * .15, P * .09, mix(sp.outfit, '#ffffff', .15)); }
    if (sp.sash) p.line(cx - P * .3, P * .78, cx + P * .12, P * 1.02, sp.sash, 4);
    p.rect(cx - P * .08, P * .6, cx + P * .08, P * .8, mix(sp.skin, '#5a3020', .2));
    const vTop = P * .76;
    if (!sp.armor && !sp.belly) p.fill((x, y) => y > vTop && Math.abs(x - cx) < (y - vTop) * .55, sp.vest ? sp.outfit : mix(sp.skin, '#5a3020', .12), 0, cx - P * .2, vTop, cx + P * .2, P);
    if (sp.belly) p.fill((x, y) => y > vTop && Math.abs(x - cx) < (y - vTop) * .7, sp.belly, 0, cx - P * .25, vTop, cx + P * .25, P);
    if (sp.trim) p.fill((x, y) => y > vTop && Math.abs(Math.abs(x - cx) - (y - vTop) * .55) < .9, sp.trim, 0, cx - P * .2, vTop, cx + P * .2, P);
    if (sp.scarf) p.rect(cx - P * .15, P * .69, cx + P * .15, P * .78, sp.scarf);
    if (sp.hairStyle === 'bun') p.ell(cx, P * .16, P * .13, P * .1, sp.hair);
    if (sp.hairStyle === 'long') p.rect(cx - frx * 1.15, P * .4, cx + frx * 1.15, P * .82, sp.hair);
    if (sp.ears) {
      p.tri([cx - P * .2, P * .02], [cx - P * .33, P * .34], [cx - P * .05, P * .26], sp.skin); p.tri([cx + P * .2, P * .02], [cx + P * .33, P * .34], [cx + P * .05, P * .26], sp.skin);
      p.tri([cx - P * .2, P * .1], [cx - P * .27, P * .3], [cx - P * .11, P * .26], '#f0b8a0'); p.tri([cx + P * .2, P * .1], [cx + P * .27, P * .3], [cx + P * .11, P * .26], '#f0b8a0');
    }
    if (sp.fins) {
      p.tri([cx - frx * .85, P * .36], [cx - frx - P * .17, P * .24], [cx - frx * .85, P * .62], sp.fins); p.tri([cx + frx * .85, P * .36], [cx + frx + P * .17, P * .24], [cx + frx * .85, P * .62], sp.fins);
      p.tri([cx - P * .07, P * .24], [cx - P * .01, P * .04], [cx + P * .09, P * .24], sp.fins);
    }
    if (!sp.ears && !sp.fins) { p.ell(cx - frx * 1.02, P * .5, P * .045, P * .065, sp.skin); p.ell(cx + frx * 1.02, P * .5, P * .045, P * .065, sp.skin); }
    p.fill(inFace, sp.skin, 0, cx - frx * 1.1, fcy - fry, cx + frx * 1.1, fcy + fry);
    if (sp.wrinkles) for (const [a, b] of [[-.12, .58], [.1, .58], [-.14, .4], [.12, .4]]) g.set(Math.floor(cx + P * a), Math.floor(P * b), mix(sp.skin, '#5a3020', .35), 1);
    if (sp.muzzle) { p.fill((x, y) => inFace(x, y) && y > P * .5 && Math.abs(x - cx) < P * .15, sp.muzzle, 0, 0, P * .5, P, P * .8); p.fill((x, y) => inFace(x, y) && Math.abs(x - cx) > frx * .72 && y > P * .48, sp.muzzle, 0, 0, P * .45, P, P * .8); }
    if (sp.fins) for (const [a, b] of [[-.16, .36], [.15, .34], [.19, .4]]) g.set(Math.floor(cx + P * a), Math.floor(P * b), mix(sp.skin, '#1a3a3a', .3), 1);
    const capR = frx * 1.2, capY = P * .39, inCap = (x, y) => ((x - cx) / capR) ** 2 + ((y - capY) / (fry * .98)) ** 2 <= 1;
    if (['short', 'bun', 'long'].includes(sp.hairStyle)) {
      const step = Math.max(2, P * .08), amp = sp.neat ? P * .015 : P * .045;
      const wave = x => (Math.floor((x - cx) / step) % 2 === 0 ? amp : 0);
      const sideTo = sp.hairStyle === 'short' ? (sp.neat ? P * .5 : P * .55) : P * .62;
      p.fill((x, y) => inCap(x, y) && (y < P * .33 + wave(x) || (Math.abs(x - cx) > frx * .8 && y < sideTo)), sp.hair, 0, cx - capR, capY - fry, cx + capR, sideTo);
      if (sp.neat) p.fill((x, y) => inCap(x, y) && y < P * .33 && Math.abs(x - cx + P * .06) < .7, mix(sp.hair, '#000000', .25), 0, cx - capR, capY - fry, cx + capR, P * .4);
    }
    if (sp.hairStyle === 'hat') {
      p.fill((x, y) => inCap(x, y) && y < P * .36, sp.hair, 0, cx - capR, capY - fry, cx + capR, P * .4);
      p.ell(cx, P * .27, P * .36, P * .07, sp.hat); p.ell(cx, P * .17, P * .2, P * .11, sp.hat); p.rect(cx - P * .2, P * .22, cx + P * .2, P * .25, mix(sp.hat, '#5a3020', .4));
    }
    if (sp.hairStyle === 'bald') p.ell(cx - P * .08, P * .27, P * .05, P * .025, mix(sp.skin, '#ffffff', .35), 1);
    if (sp.beard) { p.fill((x, y) => inFace(x, y) && ((y > P * .58) || (y > P * .46 && Math.abs(x - cx) > frx * .72)), sp.beard, 0, 0, P * .4, P, P); p.rect(cx - P * .1, P * .585, cx + P * .1, P * .62, sp.beard); }
    const ew = Math.max(2, Math.round(P * (sp.bigEye ? .1 : .07))), eh = Math.max(2, Math.round(P * (sp.bigEye ? .12 : .09)));
    const ey0 = Math.round(P * .47), lx0 = Math.round(cx - P * .105 - ew / 2), rx0 = P - lx0 - ew;
    for (const x0 of [lx0, rx0]) {
      for (let yy = 0; yy < eh; yy++) for (let xx = 0; xx < ew; xx++) { let c = yy === 0 ? '#1d1620' : sp.eye; if (yy === eh - 1 && eh > 2) c = mix(sp.eye, '#ffffff', .25); g.set(x0 + xx, ey0 + yy, c, 1); }
      g.set(x0 + (x0 === lx0 ? ew - 1 : 0), ey0 + 1, '#ffffff', 1);
      if (sp.bigEye) for (let yy = 1; yy < eh; yy++) g.set(x0 + (x0 === lx0 ? 0 : ew - 1), ey0 + yy, '#f4f4f0', 1);
    }
    const brY = ey0 - Math.max(2, Math.round(P * .06)), brC = sp.beard || mix(sp.hair || sp.skin, '#000000', .35);
    if (!sp.fins) for (const x0 of [lx0, rx0]) for (let xx = -1; xx <= ew; xx++) {
      let yy = brY; if (sp.brow === 'stern') { const inner = x0 === lx0 ? xx >= ew - 1 : xx <= 0; if (inner) yy += 1; }
      g.set(x0 + xx, yy, brC, 1); if (sp.brow === 'bushy') g.set(x0 + xx, yy - 1, brC, 1);
    }
    if (sp.glasses) {
      for (const x0 of [lx0, rx0]) { for (let xx = -1; xx <= ew; xx++) { g.set(x0 + xx, ey0 - 1, sp.glasses, 1); g.set(x0 + xx, ey0 + eh, sp.glasses, 1); } for (let yy = -1; yy <= eh; yy++) { g.set(x0 - 1, ey0 + yy, sp.glasses, 1); g.set(x0 + ew, ey0 + yy, sp.glasses, 1); } }
      for (let x = lx0 + ew; x < rx0; x++) g.set(x, ey0, sp.glasses, 1);
    }
    if (sp.muzzle) p.rect(cx - P * .04, P * .56, cx + P * .04, P * .6, '#2a1a10', 1);
    else if (!sp.fins) g.set(Math.floor(cx), Math.round(P * .555), mix(sp.skin, '#5a2a1a', .3), 1);
    const my = Math.round(P * .65), mw = Math.max(2, Math.round(P * .09)), mx0 = Math.round(cx - mw / 2), mc = sp.beard ? '#2a1410' : mix(sp.skin, '#8a2a2a', .45);
    for (let i = 0; i < mw; i++) g.set(mx0 + i, my, mc, 1);
    if (sp.mouth === 'smile') { g.set(mx0 - 1, my - 1, mc, 1); g.set(mx0 + mw, my - 1, mc, 1); }
    if (!sp.beard && !sp.muzzle && !sp.fins) { const bc = mix(sp.skin, '#e88a8a', .45); for (const x0 of [lx0 - 1, rx0 + ew - 1]) for (let k = 0; k < 2; k++) g.set(x0 + k, ey0 + eh + 1, bc, 1); }
    return gridCanvas(g, finish(g), false);
  }

  /* cache sprite: 4 arah x 4 frame */
  const cache = new Map();
  function sprite(key, sp, dir, frame) {
    const k = key + '|' + dir + '|' + frame;
    let c = cache.get(k); if (!c) { c = drawChar(sp, dir, frame); cache.set(k, c); }
    return c;
  }
  const pcache = new Map();
  function portrait(key, sp) { let c = pcache.get(key); if (!c) { c = drawPortrait(sp); pcache.set(key, c); } return c; }

  /* ---------- perkakas latar (bangunan, ubin, properti) ---------- */
  const P = {
    sand: '#c4b083', sand2: '#b19c6e', tile: '#8f8e88', slate: '#4d5056', wood: '#6a4a30', wood2: '#4a321f', beam: '#3e2c1f',
    plank: '#6b5038', plaster: '#b5a585', stone: '#7f786c', shingle: '#5e4a3c', dirt: '#76664a', grass: '#4a6232',
    hedge: '#3e6a2c', leaf: '#34512a', teal: '#24605e', gold: '#d0a43e', glow: '#f2c466', iron: '#2a2622', clay: '#9a5a36',
    soil: '#6e4a30', soil2: '#573a24', sprout: '#5b9a35', water: '#2f6f9a', water2: '#6fa8c8', sand3: '#c9b483',
    cloth1: '#8a3a30', cloth2: '#d8ccb0', floor: '#8a6a48', carpet: '#7a2e2e', wallIn: '#a89878'
  };
  function kit(x, seed) {
    const R = rng(seed || 1);
    const px = (a, b, c) => { x.fillStyle = c; x.fillRect(Math.round(a), Math.round(b), 1, 1); };
    const r = (a, b, w, h, c) => { if (w <= 0 || h <= 0) return; x.fillStyle = c; x.fillRect(Math.round(a), Math.round(b), Math.max(1, Math.round(w)), Math.max(1, Math.round(h))); };
    const nz = (c, v) => R() < .5 ? dark(c, R() * v) : light(c, R() * v);
    const shade = (a, b, w, h, al) => { x.fillStyle = `rgba(24,14,30,${al})`; x.fillRect(Math.round(a), Math.round(b), Math.round(w), Math.round(h)); };
    const k = { x, R, px, r, nz, shade, P };
    k.blocks = (a, b, w, h, base, bw, bh, v) => {
      for (let yy = 0, row = 0; yy < h; yy += bh, row++) {
        const off = row % 2 ? Math.floor(bw / 2) : 0;
        for (let xx = -off; xx < w; xx += bw) {
          const xa = Math.max(a, a + xx), xe = Math.min(a + w, a + xx + bw), ye = Math.min(b + h, b + yy + bh); if (xe <= xa) continue;
          const c = nz(base, v || .1);
          for (let y2 = b + yy; y2 < ye; y2++) for (let x2 = xa; x2 < xe; x2++) {
            let cc = c; if (R() < .25) cc = nz(c, .06);
            if (y2 === b + yy) cc = light(c, .22); else if (x2 === xa) cc = light(c, .12);
            if (y2 === ye - 1) cc = dark(c, .35); if (x2 === xe - 1) cc = dark(c, .28);
            px(x2, y2, cc);
          }
        }
      }
    };
    k.ground = (a, b, w, h, sd) => {
      for (let yy = b; yy < b + h; yy++) for (let xx = a; xx < a + w; xx++) {
        const n = Math.sin(xx * .07 + yy * .03 + sd) + Math.sin(yy * .1 - xx * .05 + 2) + Math.sin((xx - yy) * .045);
        let c = P.dirt; if (n > .6 || (n > .35 && (xx + yy) % 2)) c = P.grass; else if (n < -1.3) c = light(P.dirt, .12);
        px(xx, yy, nz(c, .09));
      }
      for (let i = 0; i < w * h / 70; i++) px(a + R() * w, b + R() * h, dark(P.dirt, .3));
      for (let i = 0; i < w * h / 400; i++) { const fx = a + R() * w, fy = b + R() * h; px(fx, fy, '#e8cf6a'); px(fx + 1, fy, '#f2e4a0'); }
    };
    k.path = (a, b, w, h) => {
      for (let yy = b; yy < b + h; yy++) for (let xx = a; xx < a + w; xx++) px(xx, yy, nz(light(P.dirt, .08), .08));
      for (let i = 0; i < w * h / 30; i++) px(a + R() * w, b + R() * h, dark(P.dirt, .28));
      for (let yy = b; yy < b + h; yy++) { if (R() < .4) px(a, yy, P.grass); if (R() < .4) px(a + w - 1, yy, P.grass); }
    };
    k.steps = (a, b, w, n, grow, col) => {
      const c0 = col || P.sand;
      for (let i = 0; i < n; i++) { const ww = w + i * (grow || 0) * 2, xa = a - i * (grow || 0), ya = b + i * 5; k.blocks(xa, ya, ww, 3, light(c0, .12), 12, 3, .08); r(xa, ya + 3, ww, 2, dark(c0, .35)); r(xa, ya + 3, ww, 1, dark(c0, .5)); }
    };
    k.balus = (a, b, w) => {
      r(a, b, w, 3, light(P.sand, .2)); r(a, b + 3, w, 1, dark(P.sand, .4));
      for (let xx = a + 2; xx < a + w - 2; xx += 4) { r(xx, b + 4, 2, 7, P.sand); r(xx, b + 4, 1, 7, light(P.sand, .25)); r(xx + 1, b + 6, 1, 3, dark(P.sand, .3)); }
      r(a, b + 11, w, 3, P.sand2); r(a, b + 13, w, 1, dark(P.sand, .5));
    };
    k.windowS = (a, b, w, h) => {
      r(a - 3, b - 3, w + 6, h + 6, light(P.sand, .25)); r(a - 3, b + h + 2, w + 6, 2, dark(P.sand, .25)); r(a, b, w, h, '#1a1612');
      const sw = Math.floor(w / 2);
      for (const sx of [a, a + sw]) { for (let yy = 0; yy < h; yy++) r(sx, b + yy, sw - (sx === a ? 1 : 0), 1, yy % 2 ? P.wood : light(P.wood, .15)); r(sx, b, 1, h, dark(P.wood, .3)); }
      r(a, b, w, 1, dark(P.wood, .5));
    };
    k.lampWall = (a, b) => { r(a, b, 1, 4, P.iron); r(a - 2, b + 3, 5, 1, P.iron); r(a - 2, b + 4, 5, 6, P.iron); r(a - 1, b + 5, 3, 4, P.glow); };
    k.crest = (cx, b) => {
      r(cx - 10, b, 20, 16, light(P.sand, .3)); r(cx - 10, b + 15, 20, 1, dark(P.sand, .4)); r(cx - 7, b + 2, 14, 9, P.teal);
      for (let yy = 0; yy < 4; yy++) r(cx - 6 + yy, b + 11 + yy, 12 - yy * 2, 1, P.teal);
      r(cx - 1, b + 4, 2, 9, P.gold); r(cx - 4, b + 6, 8, 2, P.gold); px(cx - 3, b + 4, P.gold); px(cx + 2, b + 4, P.gold);
    };
    k.doorStone = (a, b, w, h) => {
      r(a - 4, b - 4, w + 8, h + 4, light(P.sand, .28)); r(a - 4, b - 4, w + 8, 1, light(P.sand, .45)); r(a, b, w, h, '#140f0b');
      const lw = Math.floor((w - 1) / 2);
      for (const lx of [a, a + lw + 1]) for (let yy = 0; yy < h; yy++) for (let xx = 0; xx < lw; xx++) {
        let c = nz(P.wood, .07); if (xx % 4 === 0) c = dark(P.wood, .35); if (yy === 4 || yy === h - 5) c = dark(P.wood, .5); if ((yy === 8 || yy === h - 9) && xx % 3 === 1) c = P.gold; px(lx + xx, b + yy, c);
      }
    };
    k.roofTop = (a, b, w, h) => {
      const mid = b + Math.floor(h * .45);
      for (let yy = b; yy < b + h; yy++) { const base = yy < mid ? light(P.slate, .12) : dark(P.slate, .12); for (let xx = a; xx < a + w; xx++) { let c = nz(base, .06); if ((yy - b) % 3 === 2) c = dark(base, .35); else if ((xx + ((Math.floor((yy - b) / 3)) % 2 ? 2 : 0)) % 6 === 0) c = dark(base, .2); px(xx, yy, c); } }
      r(a, mid - 1, w, 2, light(P.slate, .35)); r(a, b, w, 1, dark(P.slate, .4)); r(a, b, 1, h, dark(P.slate, .3)); r(a + w - 1, b, 1, h, dark(P.slate, .5));
    };
    k.hedge = (a, b, w, h) => {
      for (let i = 0; i < w * h / 6; i++) {
        const cx = a + R() * w, cy = b + R() * h, rr = 2 + R() * 2.5;
        for (let yy = -rr; yy <= rr; yy++) for (let xx = -rr; xx <= rr; xx++) if (xx * xx + yy * yy <= rr * rr) {
          const X = cx + xx, Y = cy + yy; if (X < a || X >= a + w || Y < b || Y >= b + h) continue;
          px(X, Y, nz(yy < 0 && (Y - b) < h * .5 ? light(P.hedge, .15) : (Y - b) > h * .7 ? dark(P.hedge, .3) : P.hedge, .08));
        }
      }
    };
    k.bed = (a, b, w, h, l) => { // pembatas taman batu + pagar tanaman
      k.blocks(a, b, w, h, P.sand2, 10, 5, .08); r(a, b, w, 3, light(P.sand, .3)); k.hedge(a + 3, b + 3, w - 6, h - 6); shade(a, b + h, w, 3, .28);
    };
    // pemukiman (kayu)
    k.roof = (a, b, w, h, inset, c) => {
      for (let yy = 0; yy < h; yy++) {
        const t = yy / h, le = a + inset * (1 - t), ri = a + w - inset * (1 - t), row = Math.floor(yy / 3), off = row % 2 ? 2 : 0;
        const rc = mix(light(c, .2 * (1 - t)), dark(c, .3), Math.max(0, t - .55) * 1.6);
        for (let xx = Math.floor(le); xx < ri; xx++) { let col = nz(rc, .07); if (yy % 3 === 2) col = dark(rc, .35); else if ((xx + off) % 5 === 0) col = dark(rc, .2); if (xx - le < 2) col = light(col, .15); if (ri - xx <= 2.5) col = dark(col, .3); px(xx, b + yy, col); }
      }
      r(a + inset, b - 1, w - 2 * inset, 2, light(c, .32)); r(a + inset, b + 1, w - 2 * inset, 1, dark(c, .2)); r(a, b + h - 1, w, 2, dark(c, .6));
    };
    k.wall = (a, b, w, h, c, posts) => {
      const rows = []; for (let i = 0; i < Math.ceil(h / 3); i++) rows.push(nz(c, .14));
      for (let yy = 0; yy < h; yy++) { const rc = rows[Math.floor(yy / 3)]; for (let xx = 0; xx < w; xx++) { let col = nz(rc, .05); if (yy % 3 === 0) col = dark(rc, .38); if (R() < .008) col = dark(rc, .45); px(a + xx, b + yy, col); } }
      const pp = [0, w - 3].concat(posts || []);
      for (const q of pp) { r(a + q, b, 3, h, P.beam); r(a + q, b, 1, h, light(P.beam, .22)); r(a + q + 2, b, 1, h, dark(P.beam, .35)); }
      r(a, b, w, 3, P.beam); r(a, b, w, 1, light(P.beam, .2));
    };
    k.found = (a, b, w, h) => { for (let yy = 0; yy < h; yy += 3) { const off = (yy / 3) % 2 ? 3 : 0; for (let xx = -off; xx < w; xx += 6) { const c = nz(P.stone, .15), xa = a + Math.max(0, xx), ww = Math.min(5, w - Math.max(0, xx)); if (ww <= 0) continue; r(xa, b + yy, ww, 2, c); r(xa, b + yy, ww, 1, light(c, .2)); r(xa, b + yy + 2, ww, 1, dark(P.stone, .45)); } } };
    k.eaveShadow = (a, b, w, h) => { shade(a, b, w, h, .5); shade(a, b + h, w, 2, .25); };
    k.win = (a, b, w, h, lit, broken) => {
      r(a - 2, b - 2, w + 4, h + 4, P.beam); r(a - 2, b - 2, w + 4, 1, light(P.beam, .25)); r(a - 3, b + h + 2, w + 6, 2, light(P.wood, .15));
      r(a, b, w, h, lit ? '#3a2a18' : '#16130f');
      for (let yy = 0; yy < h; yy++) for (let xx = 0; xx < w; xx++) if ((xx % 3 === 1) || (yy % 3 === 1)) px(a + xx, b + yy, broken && R() < .5 ? '#16130f' : (lit ? mix(P.glow, '#8a6a3a', R() * .4) : mix('#8c836c', '#5a5446', R() * .6)));
      if (broken) for (let i = 0; i < 6; i++) px(a + R() * w, b + h * .5 + R() * h * .5, '#0c0a08');
    };
    k.shutters = (a, b, w, h) => { for (const sx of [a - 2 - Math.round(w * .45) - 1, a + w + 3]) { const sw = Math.round(w * .45); r(sx, b - 2, sw, h + 4, P.wood2); for (let xx = 1; xx < sw; xx += 2) r(sx + xx, b - 2, 1, h + 4, dark(P.wood2, .3)); r(sx, b - 2, sw, 1, light(P.wood2, .25)); } };
    k.doorWood = (a, b, w, h) => {
      r(a - 3, b - 3, w + 6, h + 3, P.beam); r(a - 3, b - 3, w + 6, 1, light(P.beam, .25)); r(a, b, w, h, '#140f0b');
      for (let xx = 0; xx < w; xx++) for (let yy = 0; yy < h; yy++) { let c = nz(P.plank, .08); if (xx % 4 === 0) c = dark(P.plank, .35); if (yy === Math.floor(h * .25) || yy === Math.floor(h * .75)) c = dark(P.plank, .5); px(a + xx, b + yy, c); }
      px(a + w - 3, b + h * .55, P.gold);
    };
    k.barrel = (a, b) => { for (let yy = 0; yy < 12; yy++) { const bu = (yy > 1 && yy < 10) ? 1 : 0; for (let xx = -bu; xx < 9 + bu; xx++) { let c = nz(P.wood, .06); const t = (xx + bu) / (9 + 2 * bu); c = t < .3 ? light(c, .18) : t > .7 ? dark(c, .32) : c; if (yy === 2 || yy === 9) c = '#3c3a3a'; px(a + xx, b + yy, c); } } r(a, b - 2, 9, 3, light(P.wood, .2)); shade(a + 2, b + 12, 10, 2, .35); };
    k.sack = (a, b) => { for (let yy = 0; yy < 9; yy++) { const hw = Math.round(Math.sin((yy + 2) / 11 * Math.PI) * 5); for (let xx = -hw; xx < hw; xx++) px(a + xx, b + yy, nz(xx < 0 ? '#cdbb92' : '#a8966e', .06)); } r(a - 2, b - 2, 4, 2, '#8a7a58'); shade(a - 4, b + 9, 9, 2, .3); };
    k.crate = (a, b, s) => { r(a, b, s, s, P.wood); for (let i = 0; i < s; i += 3) r(a, b + i, s, 1, dark(P.wood, .3)); r(a, b, s, 1, light(P.wood, .25)); r(a + s - 1, b, 1, s, dark(P.wood, .45)); for (let i = 0; i < s; i++) px(a + i, b + i, P.wood2); shade(a + 2, b + s, s, 2, .3); };
    k.urn = (a, b) => { for (let yy = 0; yy < 10; yy++) { const hw = yy < 2 ? 2 : Math.round(Math.sin(yy / 11 * Math.PI) * 5); for (let xx = -hw; xx < hw; xx++) px(a + xx, b + yy, nz(xx < -1 ? '#a8673e' : xx > 1 ? '#6e3e24' : '#8a5232', .05)); } r(a - 3, b - 1, 6, 2, '#6e3e24'); shade(a - 4, b + 10, 9, 2, .3); };
    k.rubble = (a, b, w, n) => { for (let i = 0; i < n; i++) { const c = [P.stone, dark(P.stone, .2), P.wood2, '#2a201a'][R() * 4 | 0], xa = a + R() * w, ya = b + R() * 8; r(xa, ya, 2 + R() * 4, 2, c); px(xa, ya, light(c, .2)); } };
    k.water = (a, b, w, h) => { for (let yy = b; yy < b + h; yy++) for (let xx = a; xx < a + w; xx++) px(xx, yy, nz(mix(P.water, dark(P.water, .3), (yy - b) / h), .05)); for (let i = 0; i < w * h / 60; i++) r(a + R() * w, b + 3 + R() * (h - 4), 3 + R() * 5, 1, P.water2); };
    k.banner = (a, b, w, h) => { r(a - 1, b - 1, w + 2, 2, P.beam); r(a, b, w, h, P.teal); r(a, b, 1, h, light(P.teal, .2)); r(a + w - 1, b, 1, h, dark(P.teal, .35)); r(a + w / 2 - 1, b + h * .22, 2, h * .42, P.gold); r(a + w / 2 - 3, b + h * .34, 6, 2, P.gold); r(a + w / 2 - 1, b + h - 2, 2, 2, dark(P.teal, .6)); };
    return k;
  }

  /* ---------- properti berdiri (diurutkan dengan karakter) ---------- */
  function propCanvas(w, h, seed, fn) { const c = canvas(w, h); fn(kit(c.getContext('2d'), seed), w, h); return c; }
  const props = {
    tree: (seed, s) => propCanvas(Math.round(s * 1.4), Math.round(s * 1.6), seed, (k, w, h) => {
      const a = w / 2, b = h - 4; k.x.fillStyle = 'rgba(14,8,16,.35)'; k.x.beginPath(); k.x.ellipse(a + 3, b, s * .55, s * .16, 0, 0, 7); k.x.fill();
      k.r(a - 2, b - s * .5, 4, s * .5, P.beam); k.r(a - 2, b - s * .5, 1, s * .5, light(P.beam, .2));
      for (let i = 0; i < s * 2.2; i++) {
        const ang = k.R() * 6.28, rad = Math.sqrt(k.R()) * s * .55, cx = a + Math.cos(ang) * rad, cy = b - s * .95 + Math.sin(ang) * rad * .8, rr = 2 + k.R() * s * .12, lit = (cx - a) + (cy - (b - s * .95)) < 0;
        for (let yy = -rr; yy <= rr; yy++) for (let xx = -rr; xx <= rr; xx++) if (xx * xx + yy * yy <= rr * rr) k.px(cx + xx, cy + yy, k.nz(lit && yy < 0 ? light(P.leaf, .18) : (yy > 0 ? dark(P.leaf, .25) : P.leaf), .08));
      }
    }),
    cypress: (seed, h) => propCanvas(18, h + 10, seed, (k, w, H) => {
      const a = 9, b = H - 2; k.shade(a - 6, b - 2, 14, 3, .3); k.r(a - 1, b - 5, 3, 5, P.wood2);
      for (let yy = 0; yy < h; yy++) { const t = yy / h, hw = Math.max(1, Math.sin(Math.min(1, t * 1.15) * Math.PI * .5) * 6 * (t < .85 ? 1 : (1 - t) * 6.6)); for (let xx = -hw; xx < hw; xx++) { let c = P.leaf; if (xx < -hw * .3) c = light(c, .18); if (xx > hw * .4) c = dark(c, .3); if ((xx + yy) % 3 === 0) c = dark(c, .15); k.px(a + xx, b - 5 - h + yy, k.nz(c, .07)); } }
    }),
    lampPost: seed => propCanvas(12, 42, seed, (k) => { k.shade(1, 38, 10, 3, .3); k.r(5, 10, 2, 30, P.iron); k.r(3, 38, 6, 2, P.iron); k.r(2, 2, 8, 9, P.iron); k.r(3, 3, 6, 7, P.glow); k.r(4, 4, 2, 5, '#fff0b8'); k.r(1, 1, 10, 2, P.iron); }),
    barrels: seed => propCanvas(30, 26, seed, k => { k.barrel(2, 12); k.barrel(14, 12); k.barrel(8, 3); }),
    crates: seed => propCanvas(34, 26, seed, k => { k.crate(2, 12, 12); k.crate(6, 2, 10); k.sack(24, 15); }),
    urns: seed => propCanvas(22, 14, seed, k => { k.urn(6, 2); k.urn(15, 3); }),
    bench: seed => propCanvas(30, 14, seed, k => { k.shade(2, 11, 28, 3, .3); k.r(1, 4, 28, 4, P.wood); k.r(1, 4, 28, 1, light(P.wood, .25)); k.r(1, 7, 28, 1, dark(P.wood, .4)); k.r(3, 8, 3, 5, P.sand2); k.r(24, 8, 3, 5, P.sand2); }),
    stall: seed => propCanvas(64, 48, seed, k => {
      const X = 4, Y = 10, w = 56; k.shade(X + 2, Y + 36, w, 4, .3);
      k.r(X, Y, 3, 30, P.wood2); k.r(X + w - 3, Y, 3, 30, P.wood2);
      k.r(X, Y + 20, w, 16, P.wood); k.r(X, Y + 20, w, 2, light(P.wood, .25)); k.r(X, Y + 35, w, 1, dark(P.wood, .5));
      const goods = ['#8a3a30', '#c99a3c', '#5b8a3a', '#7a6a9a', '#b86a3a', '#d8ccb0']; for (let xx = X + 3; xx < X + w - 5; xx += 5) { const c = goods[k.R() * goods.length | 0]; k.r(xx, Y + 16, 4, 4, c); k.r(xx, Y + 16, 4, 1, light(c, .3)); }
      for (let xx = -3; xx < w + 3; xx++) { const c = Math.floor((xx + 3) / 7) % 2 ? P.cloth2 : P.cloth1; for (let yy = 0; yy < 11; yy++) k.px(X + xx, Y - 8 + yy, k.nz(yy > 7 ? dark(c, .2) : c, .05)); if ((xx + 3) % 7 === 3) k.px(X + xx, Y + 3, c); }
    }),
    monument: seed => propCanvas(48, 84, seed, k => {
      k.shade(6, 76, 40, 6, .3);
      k.blocks(2, 62, 44, 16, P.sand2, 11, 4, .08); k.r(2, 62, 44, 2, light(P.sand, .3));
      k.blocks(8, 52, 32, 12, P.sand, 8, 4, .08);
      for (let yy = 0; yy < 50; yy++) { const hw = 7 - yy * .06; for (let xx = -hw; xx < hw; xx++) k.px(24 + xx, 52 - yy, k.nz(xx < -2 ? light(P.sand, .2) : xx > 3 ? dark(P.sand, .25) : P.sand, .05)); }
      k.r(19, 0, 10, 4, light(P.sand, .25)); k.r(21, -1, 6, 2, P.gold);
      k.r(14, 66, 20, 8, '#5a4a32'); for (let i = 0; i < 3; i++) k.r(16, 68 + i * 2, 16 - i * 3, 1, '#c8b890');
      k.r(18, 22, 12, 12, P.teal); k.r(23, 24, 2, 8, P.gold); k.r(20, 27, 8, 2, P.gold);
    }),
    fence: (seed, len) => propCanvas(len, 12, seed, k => { for (let xx = 0; xx < len; xx += 10) { k.r(xx, 2, 3, 10, P.wood); k.r(xx, 2, 1, 10, light(P.wood, .2)); } k.r(0, 4, len, 2, P.wood2); k.r(0, 8, len, 2, P.wood2); }),
    sign: seed => propCanvas(22, 26, seed, k => { k.r(10, 10, 2, 16, P.beam); k.r(1, 2, 20, 11, P.wood); k.r(1, 2, 20, 1, light(P.wood, .25)); k.r(1, 12, 20, 1, dark(P.wood, .5)); k.r(4, 5, 14, 1, '#2a1e14'); k.r(4, 8, 10, 1, '#2a1e14'); }),
    boat: seed => propCanvas(48, 18, seed, k => { k.x.fillStyle = P.wood2; k.x.beginPath(); k.x.ellipse(24, 9, 22, 7, 0, 0, 7); k.x.fill(); k.x.fillStyle = P.wood; k.x.beginPath(); k.x.ellipse(24, 8, 18, 5, 0, 0, 7); k.x.fill(); k.r(20, 4, 8, 9, dark(P.wood, .3)); }),
    bedFurn: seed => propCanvas(40, 64, seed, k => { k.shade(4, 58, 36, 4, .35); k.r(2, 4, 36, 56, P.wood2); k.r(2, 4, 36, 2, light(P.wood2, .3)); k.r(5, 8, 30, 48, '#e8e0cc'); k.r(5, 8, 30, 10, '#f4efe2'); k.r(8, 10, 24, 6, '#ffffff'); k.r(5, 22, 30, 34, '#2f5a6a'); for (let yy = 24; yy < 56; yy += 4) k.r(5, yy, 30, 1, '#264a58'); k.r(5, 22, 30, 2, '#d0a43e'); }),
    desk: seed => propCanvas(80, 40, seed, k => { k.shade(4, 34, 76, 5, .35); k.r(2, 6, 76, 22, P.wood); k.r(2, 6, 76, 3, light(P.wood, .25)); k.r(2, 27, 76, 3, dark(P.wood, .45)); k.r(4, 28, 6, 10, P.wood2); k.r(70, 28, 6, 10, P.wood2); k.r(10, 8, 14, 10, '#e8dcc0'); k.r(12, 10, 10, 1, '#6a5a4a'); k.r(12, 13, 8, 1, '#6a5a4a'); k.r(30, 9, 12, 8, '#efe6d0'); k.r(56, 6, 4, 8, P.iron); k.r(55, 3, 6, 4, P.glow); k.r(64, 10, 8, 5, '#3a6a6a'); }),
    reception: seed => propCanvas(100, 30, seed, k => { k.shade(4, 24, 96, 5, .35); k.r(2, 4, 96, 20, P.wood); k.r(2, 4, 96, 3, light(P.wood, .3)); for (let xx = 8; xx < 96; xx += 12) k.r(xx, 9, 1, 14, dark(P.wood, .3)); k.r(2, 23, 96, 2, dark(P.wood, .5)); k.r(14, 0, 16, 6, '#e8dcc0'); k.r(70, 0, 6, 6, P.glow); }),
    shelf: seed => propCanvas(48, 52, seed, k => { k.r(2, 2, 44, 48, P.wood2); for (let s = 0; s < 4; s++) { const y = 6 + s * 11; k.r(4, y, 40, 9, '#1e1610'); for (let xx = 5; xx < 43; xx += 3) { const c = ['#7a2e2e', '#2f5a6a', '#5a6a3a', '#8a6a3a', '#4a3a5a'][k.R() * 5 | 0]; const hh = 6 + (k.R() * 3 | 0); k.r(xx, y + 9 - hh, 2, hh, c); } k.r(4, y + 9, 40, 2, light(P.wood2, .2)); } }),
    plant: seed => propCanvas(20, 30, seed, k => { k.shade(3, 26, 16, 3, .3); k.urn(10, 18); for (let i = 0; i < 40; i++) { const a = 10 + (k.R() - .5) * 14, b = 4 + k.R() * 14; k.px(a, b, k.nz(P.hedge, .2)); k.px(a + 1, b, light(P.hedge, .1)); } }),
    wardrobe: seed => propCanvas(40, 58, seed, k => { k.shade(3, 54, 36, 4, .35); k.r(2, 2, 36, 52, P.wood); k.r(2, 2, 36, 3, light(P.wood, .3)); k.r(19, 6, 2, 46, dark(P.wood, .45)); k.r(15, 26, 2, 4, P.gold); k.r(23, 26, 2, 4, P.gold); }),
    mapTable: seed => propCanvas(60, 40, seed, k => { k.shade(4, 34, 56, 5, .35); k.r(2, 6, 56, 24, P.wood); k.r(5, 8, 50, 18, '#d8c89a'); k.r(10, 11, 18, 10, '#9ab07a'); k.r(30, 12, 16, 8, '#6f9ac0'); k.r(12, 14, 2, 2, '#8a3a30'); k.r(38, 15, 2, 2, '#24605e'); k.r(4, 30, 5, 8, P.wood2); k.r(51, 30, 5, 8, P.wood2); })
  };

  V.art = { mix, rng, dark, light, canvas, kit, drawChar, drawPortrait, sprite, portrait, props, P, CW, CH, PW };
})(window.V);
