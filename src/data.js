'use strict';
/* Varsena — data tokoh, dialog, dan laporan harian (Tahap 1). */
window.V = window.V || {};
(function (V) {
  /* ---------- penampilan tokoh ---------- */
  const SPEC = {
    presiden: { hm: .96, skin: '#f1c7a0', hair: '#5a3a24', hairStyle: 'short', eye: '#3b2a1e', outfit: '#2f6f73', trim: '#e0b84a', pants: '#3a3340', shoes: '#4a2e1e', cape: '#1f4a55', belt: '#6b4a2a', mouth: 'smile' },
    aldric: { hm: 1, wm: .88, skin: '#eac2a0', hair: '#b9bcc4', hairStyle: 'short', neat: true, eye: '#2b3a4a', outfit: '#7a2e3a', trim: '#d8c9a0', long: true, pants: '#2e2a33', shoes: '#2a1e1a', glasses: '#c9a64a', brow: 'stern' },
    elin: { hm: .88, wm: .9, skin: '#f6d2b4', hair: '#a9542e', hairStyle: 'bun', eye: '#3d6a3a', outfit: '#ece2c8', vest: '#7a5236', skirt: '#5f4330', pants: '#5f4330', shoes: '#3a2a20', mouth: 'smile' },
    hassan: { hm: 1, wm: 1.25, skin: '#b07a52', hairStyle: 'bald', beard: '#3a2a20', eye: '#2a1e16', outfit: '#8f9aa6', armor: true, sleeve: '#5a4a3a', sash: '#4f7a3a', pants: '#4a4038', shoes: '#3a2a20', cape: '#6a3a2a', brow: 'bushy' },
    oolo: { hm: .9, wm: 1.05, skin: '#5fae9e', belly: '#c4e6cc', hairStyle: 'none', fins: '#3d7fa0', eye: '#1a2a3a', bigEye: true, outfit: '#5fae9e', vest: '#d9c27a', pants: '#5a6a7a', shoes: null, mouth: 'smile' },
    rinka: { hm: .86, skin: '#d9782e', muzzle: '#f3e2c4', hairStyle: 'none', ears: true, tail: true, eye: '#2a1a10', outfit: '#6a4a8a', trim: '#e0b84a', pants: '#4a3a2a', shoes: '#3a2a20', scarf: '#c94a3a', mouth: 'smile' },
    dirun: { hm: .94, skin: '#e8b890', hairStyle: 'hat', hat: '#e2c27a', hair: '#3a2a1e', eye: '#2a1e16', outfit: '#b36a3a', pants: '#5a4a3a', shoes: '#3a2a20', mouth: 'smile' },
    barro: { hm: 1, wm: 1.1, skin: '#c99068', hair: '#1e1a18', hairStyle: 'short', eye: '#2a1e16', outfit: '#6f7f5a', vest: '#8a6446', pants: '#3a3a40', shoes: '#2a2018', scarf: '#d0b070' },
    marta: { hm: .84, wm: .95, skin: '#e2b896', hair: '#c8c4bc', hairStyle: 'bun', eye: '#4a3a2a', outfit: '#5a4a6a', vest: '#3a3044', skirt: '#3a3044', pants: '#3a3044', shoes: '#2a2018', wrinkles: true },
    pipin: { hm: .66, wm: .82, skin: '#f0c49c', hair: '#c88a3a', hairStyle: 'short', eye: '#3a5a2a', outfit: '#c9a24a', pants: '#5a4a3a', shoes: '#4a2e1e', mouth: 'smile' },
    penjaga: { hm: 1, wm: 1.08, skin: '#d8a882', hair: '#3a2a1e', hairStyle: 'short', neat: true, eye: '#2a1e16', outfit: '#6f7a86', armor: true, sleeve: '#24605e', pants: '#2f3a44', shoes: '#2a2018', cape: '#24605e' }
  };

  /* ---------- tokoh (NPC) ----------
     jadwal: per periode waktu → { map, x, y, dir, wander } atau null (tidak muncul) */
  const P = { pagi: 'pagi', siang: 'siang', sore: 'sore', malam: 'malam' };
  const NPCS = [
    {
      id: 'aldric', name: 'Aldric Vane', title: 'Sekretaris Presiden', spec: 'aldric',
      at: { pagi: { map: 'balai', x: 440, y: 214, dir: 'down' }, siang: { map: 'balai', x: 512, y: 250, dir: 'left' }, sore: { map: 'balai', x: 440, y: 214, dir: 'down' }, malam: { map: 'balai', x: 520, y: 290, dir: 'up' } },
      talk(s) {
        if (!s.flags.metAldric) {
          s.flags.metAldric = true;
          return { pages: [
            `Presiden ${s.name}. Kau terlambat dua menit dari jadwal yang kubuat. Untuk hari pertama, akan kuanggap itu kebiasaan lama dari masa perang.`,
            'Perang sudah selesai. Musuh kita sekarang bukan pasukan Hal, melainkan gudang yang kosong, rumah yang hangus, dan orang-orang yang belum mau pulang.',
            'Meja kerja di belakangku milikmu. Setiap pagi aku menaruh laporan di sana: kas, pangan, populasi, dan hal-hal yang menurutku perlu kau ketahui.',
            'Kau juga bisa menentukan seberapa banyak urusan yang kau serahkan padaku. Kuingatkan saja: aku akan memilih jalan yang paling efektif, bukan yang paling disukai rakyat.'
          ], choices: [{ label: 'Buka meja kerja', act: 'office' }, { label: 'Nanti saja', act: null }] };
        }
        const lines = {
          pagi: ['Laporan pagi sudah di meja. Bacalah sebelum kau berjalan-jalan dan berjabat tangan dengan semua orang.', 'Pangan adalah angka yang paling penting minggu ini. Orang yang lapar tidak peduli siapa presidennya.'],
          siang: ['Sore nanti aku butuh tanda tanganmu. Atau tidak. Itu tergantung seberapa banyak yang kau serahkan padaku.', 'Brennhold dulu punya hampir dua belas ribu jiwa. Sekarang tinggal seperlimanya. Setiap rumah yang berdiri lagi adalah alasan bagi satu keluarga untuk pulang.'],
          sore: ['Matahari hampir tenggelam. Rakyat menilai pemimpinnya dari apa yang dia kerjakan sebelum gelap, bukan dari pidatonya.'],
          malam: ['Tidurlah, Presiden. Negara ini tidak akan runtuh dalam satu malam. Kalau runtuh, setidaknya kau sudah cukup tidur untuk memperbaikinya.', 'Aku masih membaca surat dari South Lake. Frederick menulis dengan sangat sopan. Itu biasanya pertanda masalah besar.']
        };
        const arr = lines[s.period]; return { pages: [arr[s.day % arr.length]], choices: [{ label: 'Buka meja kerja', act: 'office' }, { label: 'Tutup', act: null }] };
      }
    },
    {
      id: 'elin', name: 'Elin Marrow', title: 'Juru tulis Balai', spec: 'elin',
      at: { pagi: { map: 'balai', x: 288, y: 116, dir: 'down' }, siang: { map: 'balai', x: 288, y: 116, dir: 'down' }, sore: { map: 'balai', x: 250, y: 200, dir: 'down', wander: 30 }, malam: null },
      talk(s) {
        if (!s.flags.metElin) {
          s.flags.metElin = true;
          return { pages: [
            'Ah! Presiden! Maaf, saya Elin Marrow, juru tulis baru di Balai. Saya dari Greenleaf.',
            'Kamar Anda ada di sisi barat, lewat pintu kiri. Tempat tidurnya sudah saya rapikan. Kalau Anda tidur di sana, saya akan mencatat semua kejadian hari itu ke buku besar.',
            'Ruang kerja ada di sisi timur. Tuan Aldric biasanya di sana. Dia... agak menakutkan. Tapi kata orang, dia tidak pernah salah hitung.'
          ] };
        }
        const l = {
          pagi: ['Selamat pagi, Presiden! Hari ini ada tiga keluarga yang menanyakan rumah. Saya bilang Anda sedang memikirkannya.', 'Tinta di Balai hampir habis. Saya menulis kecil-kecil dulu.'],
          siang: ['Banyak orang datang hanya untuk melihat Balai masih berdiri. Kata mereka, itu membuat mereka berani tinggal.', 'Di Greenleaf, perpustakaan kami tidak pernah sesunyi kota ini. Tapi saya suka di sini. Rasanya seperti membantu sesuatu tumbuh.'],
          sore: ['Saya sedang menyalin daftar penduduk. Setiap nama yang kembali saya tulis dengan tinta biru.', 'Hati-hati di pemukiman selatan kalau sudah gelap, Presiden. Lampunya belum banyak.']
        };
        const arr = l[s.period] || l.pagi; return { pages: [arr[s.day % arr.length]] };
      }
    },
    {
      id: 'hassan', name: 'Jenderal Hassan', title: 'Kastil Lakeward', spec: 'hassan',
      at: { pagi: { map: 'plaza', x: 430, y: 330, dir: 'left' }, siang: { map: 'plaza', x: 430, y: 330, dir: 'left' }, sore: { map: 'plaza', x: 76, y: 70, dir: 'down' }, malam: null },
      talk(s) {
        if (!s.flags.metHassan) {
          s.flags.metHassan = true;
          return { pages: [
            'Hah! Presiden! Lihat dirimu, berjalan tanpa pedang. Dua tahun lalu aku tidak akan percaya hari ini datang.',
            'Aku hanya mampir beberapa hari. Kastil Lakeward tidak bisa ditinggal lama. Para prajurit lebih suka mencangkul daripada berbaris, dan jujur saja, aku juga.',
            'Satu hal, Presiden. Di South Lake, para bangsawan lama mulai mengukur ulang ladang yang ditinggal pemiliknya saat perang. Petani yang pulang menemukan pagar baru di tanah mereka sendiri.',
            'Aku prajurit, bukan hakim. Tapi kalau republik ini tidak membela orang kecil, untuk apa kami berperang?'
          ] };
        }
        const l = {
          pagi: ['Aku bangun sebelum ayam. Kebiasaan lama. Kota ini terlalu sepi di pagi hari.', 'Monumen itu... Setiap kali aku lewat, aku menghitung nama-nama yang kukenal. Belum pernah selesai.'],
          siang: ['Kalistov dari Fort Wendel menulis surat, menanyakan kapan anggaran ksatria dibahas. Ksatria selalu ingat anggaran mereka.', 'Kalau kau butuh orang untuk mengangkat batu, kirim surat ke Lakeward. Prajuritku sudah bosan latihan.'],
          sore: ['Dari teras ini kau bisa melihat seluruh kota. Separuhnya masih hitam. Tapi lihat asap dapur itu, Presiden. Tahun lalu tidak ada.']
        };
        const arr = l[s.period] || l.pagi; return { pages: [arr[s.day % arr.length]] };
      }
    },
    {
      id: 'rinka', name: 'Rinka', title: 'Pedagang dari Twin River', spec: 'rinka',
      at: { pagi: { map: 'plaza', x: 600, y: 268, dir: 'down' }, siang: { map: 'plaza', x: 600, y: 268, dir: 'down' }, sore: { map: 'plaza', x: 600, y: 268, dir: 'down' }, malam: null },
      talk(s) {
        if (!s.flags.metRinka) {
          s.flags.metRinka = true;
          return { pages: [
            'Wah, wah. Presiden sendiri mampir ke kiosku! Rinka, dari Twin River. Kain, garam, jarum, apa saja yang dibutuhkan kota yang sedang dibangun.',
            'Harga? Ah, jangan lihat aku begitu. Jalan dari Twin River masih rusak, dan karavan harus dikawal. Kalau jalannya diperbaiki, harga ikut turun. Itu janji pedagang.',
            'Satu kabar gratis, karena kau pelanggan baru: ada yang membeli karung gandum dalam jumlah besar di pasar gelap. Gandum dengan cap gudang republik.'
          ] };
        }
        const l = ['Garam dari Islania, jarum dari Gold Mines, kain dari Greenleaf. Lengkap, kecuali pembeli.', 'Di Twin River, kaum Amfibi, Rubah, dan manusia dulu tidak saling menyapa. Perang mengajari kami bahwa tetangga lebih berguna daripada musuh.', 'Kabar dari jalan: penjaga gudang timur sering mabuk. Bukan urusanku, tentu saja.'];
        return { pages: [l[s.day % l.length]] };
      }
    },
    {
      id: 'marta', name: 'Nenek Marta', title: 'Warga Brennhold', spec: 'marta',
      at: { pagi: { map: 'plaza', x: 330, y: 352, dir: 'up' }, siang: { map: 'plaza', x: 330, y: 352, dir: 'up' }, sore: { map: 'plaza', x: 330, y: 352, dir: 'up' }, malam: null },
      talk(s) {
        if (!s.flags.metMarta) {
          s.flags.metMarta = true;
          return { pages: [
            'Oh... Presiden. Maaf, Nenek tidak bisa berdiri cepat lagi.',
            'Anak dan dua cucu Nenek ada di monumen ini. Malam itu, saat pasukan sang pangeran masuk kota, Nenek sedang di pasar. Ketika Nenek pulang, rumahnya sudah tidak ada.',
            'Nenek tidak minta apa-apa. Hanya... tolong jangan biarkan kota ini dilupakan. Biarkan anak-anak bermain lagi di alun-alun ini.'
          ] };
        }
        const l = ['Setiap pagi Nenek membersihkan nama-nama itu. Mereka suka kalau namanya terbaca jelas.', 'Pipin, anak tetangga, setiap hari bermain di sini. Suaranya seperti cucu Nenek dulu.', 'Kemarin ada keluarga baru yang pulang dari Kairos. Nenek memberi mereka roti. Rasanya seperti dulu.'];
        return { pages: [l[s.day % l.length]] };
      }
    },
    {
      id: 'pipin', name: 'Pipin', title: 'Anak Brennhold', spec: 'pipin',
      at: { pagi: { map: 'plaza', x: 250, y: 400, dir: 'down', wander: 60 }, siang: { map: 'kampung', x: 200, y: 250, dir: 'down', wander: 70 }, sore: { map: 'plaza', x: 470, y: 400, dir: 'down', wander: 60 }, malam: null },
      talk(s) {
        const l = ['Presiden! Presiden! Benarkah Presiden pernah melawan seratus prajurit sendirian?', 'Aku mau jadi ksatria Fort Wendel! Atau pedagang seperti Kak Rinka. Atau dua-duanya!', 'Kak Oolo bisa menahan napas di danau lama sekali! Aku sudah coba, tapi aku batuk.', 'Kata Ibu, kalau rumah kami sudah dibangun lagi, aku boleh punya kamar sendiri!'];
        return { pages: [l[s.day % l.length]] };
      }
    },
    {
      id: 'penjaga1', name: 'Penjaga Balai', title: 'Pengawal Republik', spec: 'penjaga',
      at: { pagi: { map: 'plaza', x: 318, y: 172, dir: 'down' }, siang: { map: 'plaza', x: 318, y: 172, dir: 'down' }, sore: { map: 'plaza', x: 318, y: 172, dir: 'down' }, malam: { map: 'plaza', x: 318, y: 172, dir: 'down' } },
      talk(s) {
        const l = { pagi: 'Selamat pagi, Presiden! Balai aman sepanjang malam.', siang: 'Banyak warga datang menanyakan rumah, Presiden. Kami arahkan ke juru tulis Elin.', sore: 'Pergantian jaga sebentar lagi, Presiden.', malam: 'Malam yang tenang, Presiden. Jangan terlalu larut di luar.' };
        return { pages: [l[s.period]] };
      }
    },
    {
      id: 'barro', name: 'Barro', title: 'Tukang kayu', spec: 'barro',
      at: { pagi: { map: 'kampung', x: 262, y: 222, dir: 'up' }, siang: { map: 'kampung', x: 262, y: 222, dir: 'up' }, sore: { map: 'kampung', x: 300, y: 240, dir: 'left' }, malam: null },
      talk(s) {
        if (!s.flags.metBarro) {
          s.flags.metBarro = true;
          return { pages: [
            'Presiden. Barro, tukang kayu. Aku sedang menghitung balok yang masih bisa dipakai dari rumah ini.',
            'Jawabannya: hampir tidak ada. Api memakan semuanya. Kita butuh kayu dari hutan Greenleaf, paku dari Gold Mines, dan seseorang yang paham menggambar rencana. Aku hanya bisa memaku.',
            'Kalau ada arsitek di republik ini, cari dia, Presiden. Dengan satu arsitek dan sepuluh orang sepertiku, petak-petak kosong itu bisa jadi rumah sebelum musim dingin.'
          ] };
        }
        const l = ['Petak di sebelah sana sudah kupatok. Tinggal izin dan bahan.', 'Rumah ini dulu milik keluarga penjahit. Kalau mereka pulang, aku ingin mereka menemukan rumah, bukan abu.', 'Tanganku gatal. Tukang tanpa kayu itu seperti prajurit tanpa pedang.'];
        return { pages: [l[s.day % l.length]] };
      }
    },
    {
      id: 'dirun', name: 'Pak Dirun', title: 'Petani', spec: 'dirun',
      at: { pagi: { map: 'kampung', x: 560, y: 360, dir: 'down', wander: 50 }, siang: { map: 'kampung', x: 620, y: 380, dir: 'left', wander: 50 }, sore: { map: 'kampung', x: 470, y: 296, dir: 'down' }, malam: null },
      talk(s) {
        if (!s.flags.metDirun) {
          s.flags.metDirun = true;
          return { pages: [
            'Eh, Presiden! Lihat, lobak dan kacang sudah tumbuh. Tanah Brennhold ini subur. Darah dan abu, kata orang tua, membuat tanah jadi gemuk. Ah, maaf, itu bukan lelucon yang baik.',
            'Ladang ini cuma cukup untuk lima puluh perut. Kota butuh sepuluh kali lipat. Selama ini gandum datang dari South Lake, tapi kabarnya di sana sedang ribut soal tanah.',
            'Kalau ada lebih banyak tangan dan benih, Presiden, padang di luar tembok bisa jadi lumbung lagi.'
          ] };
        }
        const l = { pagi: ['Pagi adalah waktu terbaik untuk menyiram. Matahari belum galak.', 'Burung gagak makin berani. Mungkin aku butuh orang-orangan sawah berwajah Tuan Aldric.'], siang: ['Panas sekali. Tapi tanaman suka.', 'Di South Lake, satu keluarga bisa menggarap tiga petak. Di sini aku sendirian.'], sore: ['Hari ini cukup. Besok kita mulai lagi, seperti biasa.'] };
        const arr = l[s.period] || l.pagi; return { pages: [arr[s.day % arr.length]] };
      }
    },
    {
      id: 'oolo', name: 'Oolo', title: 'Nelayan dari Twin River', spec: 'oolo',
      at: { pagi: { map: 'kampung', x: 628, y: 520, dir: 'down' }, siang: { map: 'kampung', x: 628, y: 520, dir: 'down' }, sore: { map: 'kampung', x: 628, y: 520, dir: 'down' }, malam: { map: 'kampung', x: 628, y: 520, dir: 'down' } },
      talk(s) {
        if (!s.flags.metOolo) {
          s.flags.metOolo = true;
          return { pages: [
            'Gluk! Oh, Presiden manusia. Oolo. Oolo dari Twin River. Datang untuk menangkap ikan untuk kota.',
            'Danau Doran besar dan dingin. Ikannya banyak, tapi perahu sedikit. Manusia di sini lupa cara membuat jaring sejak perang.',
            'Kaum Oolo bisa mengajari. Tapi kaum Oolo butuh tempat tinggal di dekat air. Rumah di darat terlalu kering, kulit Oolo jadi gatal.'
          ] };
        }
        const l = { malam: ['Malam adalah waktu terbaik. Ikan naik ke permukaan untuk melihat bulan.'], pagi: ['Hari ini dapat tujuh ikan. Kemarin sembilan. Danau sedang malas.', 'Pipin kecil mencoba berenang seperti Oolo. Hampir tenggelam. Oolo menangkapnya seperti ikan.'], siang: ['Matahari terlalu terang. Oolo menyiram kepala setiap jam.'], sore: ['Air danau berwarna emas sore ini. Di Twin River, kami menyebutnya air harapan.'] };
        const arr = l[s.period]; return { pages: [arr[s.day % arr.length]] };
      }
    }
  ];

  /* ---------- statistik & laporan harian ---------- */
  function newState(name) {
    return {
      v: 1, name: name || 'Aren', day: 1, season: 0, year: 1, minutes: 7 * 60,
      map: 'balai', x: 100, y: 190, dir: 'down',
      stats: { populasi: 2340, kas: 1200, pangan: 18, stabilitas: 52, kepercayaan: 61, moral: 44 },
      prev: null, delegasi: 'rendah', flags: {}, notes: [], log: []
    };
  }
  const SEASONS = ['Semi', 'Panas', 'Gugur', 'Dingin'];
  const EVENTS = [
    { text: 'Tiga keluarga pengungsi kembali dari Twin River dan menginap sementara di aula Balai.', fx: { populasi: 11, moral: 1 } },
    { text: 'Penjaga gudang timur melaporkan dua karung gandum hilang. Ia menduga salah hitung.', fx: { pangan: -1 }, flag: 'theftHint' },
    { text: 'Surat dari Walikota Frederick (South Lake): ia meminta waktu untuk membicarakan sengketa lahan bangsawan dan petani yang pulang.', flag: 'landHint' },
    { text: 'Karavan Rinka tiba membawa garam dan jarum. Harga turun sedikit di pasar.', fx: { moral: 1, kas: 10 } },
    { text: 'Hujan semalam merusak atap gudang barat. Barro menambalnya dengan papan bekas.', fx: { kas: -15 } },
    { text: 'Oolo dan dua nelayan dari Twin River menyumbangkan ikan asap untuk dapur umum.', fx: { pangan: 1, moral: 1 } },
    { text: 'Ada coretan di dinding Eternal City: "Hal belum mati." Walikota sementara Kalais meminta tambahan penjaga.', fx: { stabilitas: -2 } },
    { text: 'Rektor Elena dari Greenleaf mengirim dua mahasiswa untuk mendata bangunan yang masih bisa diselamatkan.', fx: { kepercayaan: 1 } },
    { text: 'Anak-anak bermain di alun-alun sampai sore. Para penjaga bilang itu pertama kalinya sejak perang.', fx: { moral: 2 } },
    { text: 'Seorang pedagang dari Gold Mines mengeluh pajak jalan dipungut dua kali oleh petugas berbeda.', fx: { kepercayaan: -1 }, flag: 'corruptHint' },
    { text: 'Jenderal Kalistov dari Fort Wendel menanyakan jadwal pembahasan anggaran ksatria.', fx: {} },
    { text: 'Nenek Marta menanam bunga di kaki monumen. Beberapa warga ikut membantu.', fx: { moral: 1, stabilitas: 1 } }
  ];
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  function advanceDay(s, rand) {
    s.prev = Object.assign({}, s.stats);
    const st = s.stats;
    st.pangan = st.pangan - 1 + (rand() < .55 ? 1 : 0);
    st.kas = st.kas + Math.round(18 + rand() * 20) - Math.round(30 + rand() * 12);
    st.populasi = st.populasi + Math.round(rand() * 6);
    st.moral = clamp(st.moral + (rand() < .5 ? 1 : -1), 0, 100);
    if (st.pangan < 10) { st.moral = clamp(st.moral - 2, 0, 100); st.stabilitas = clamp(st.stabilitas - 1, 0, 100); }
    const picks = [], pool = EVENTS.slice();
    const n = 2 + (rand() < .4 ? 1 : 0);
    for (let i = 0; i < n && pool.length; i++) {
      const e = pool.splice(Math.floor(rand() * pool.length), 1)[0];
      picks.push(e.text);
      for (const k in (e.fx || {})) st[k] = k === 'kas' || k === 'populasi' || k === 'pangan' ? st[k] + e.fx[k] : clamp(st[k] + e.fx[k], 0, 100);
      if (e.flag) s.flags[e.flag] = true;
    }
    st.pangan = Math.max(0, st.pangan);
    s.notes = picks;
    s.day += 1; if (s.day > 30) { s.day = 1; s.season = (s.season + 1) % 4; if (s.season === 0) s.year += 1; }
  }
  function advice(s) {
    const st = s.stats;
    if (s.delegasi === 'tinggi') return 'Aku sudah menandatangani dua belas izin atas namamu kemarin. Semuanya masuk akal. Kau boleh membacanya kalau sempat.';
    if (st.pangan <= 12) return 'Persediaan pangan tinggal ' + st.pangan + ' hari. Kalau South Lake berhenti mengirim gandum, kita punya masalah dalam dua minggu. Aku menyarankan menyelesaikan urusan tanah di sana secepatnya.';
    if (st.moral < 45) return 'Moral rakyat rendah. Mereka butuh sesuatu untuk dirayakan, atau setidaknya sesuatu untuk dikerjakan. Rumah baru akan membantu keduanya.';
    if (s.flags.theftHint) return 'Gandum yang hilang dari gudang timur bukan salah hitung. Aku tidak percaya kebetulan. Kalau kau punya waktu, periksalah sendiri.';
    return 'Tidak ada yang mendesak hari ini. Itu sendiri sudah langka. Gunakan untuk berjalan dan mendengar rakyat.';
  }

  V.data = { SPEC, NPCS, SEASONS, newState, advanceDay, advice };
})(window.V);
