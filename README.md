# Varsena

Game simulasi membangun negara dengan gaya pixel art 32-bit: kehidupan sehari-hari ala life sim, kota yang tumbuh ala city sim, rekrutmen banyak tokoh, dan perang pasukan sesekali.

Republik Varsena baru dideklarasikan setelah perang saudara di wilayah Hal-Doran. Kamu adalah Presiden pertamanya, dan harus membangun ulang ibu kota Brennhold yang setengah hancur.

## Cara memainkan

Buka `index.html` lewat server lokal, misalnya:

```bash
python3 -m http.server 8000
```

lalu buka http://localhost:8000. Kontrol: panah/WASD berjalan, Shift berlari, Z/Spasi bicara dan periksa, X/Esc menu. Di HP muncul tombol sentuh.

## Isi repository

- `index.html`, `src/`: game (JavaScript tanpa library, seni piksel dibuat lewat kode)
  - `src/art.js`: sprite 4 arah, potret, bangunan dan properti
  - `src/maps.js`: peta Brennhold
  - `src/data.js`: tokoh, dialog, laporan harian
  - `src/city.js`: bangunan, konstruksi, rombongan pendatang, proyek, perjanjian Gold Mines
  - `src/game.js`: mesin permainan
- `docs/dokumen-desain.md`: dokumen desain game (dunia, cerita, sistem, lingkup demo)
- `docs/sketsa/opsi-visual.html`: sketsa gaya visual (buka di browser). Gaya yang dipilih: **Opsi D, 32-bit Klasik**

## Status

- [x] Desain awal
- [x] Gaya visual
- [x] Tahap 1: Fondasi (jalan-jalan, waktu, dialog, kantor, tidur, simpan)
- [x] Tahap 2: Kota (membangun, pendatang, proyek jalur pangan, perjanjian pangan Gold Mines)
- [ ] Tahap 3: Orang
- [ ] Tahap 4: Krisis
- [ ] Tahap 5: Klimaks
- [ ] Tahap 6: Prolog dan poles
