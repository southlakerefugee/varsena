# VARSENA — Dokumen Desain Game
*Judul kerja. Versi 0.1 — draf diskusi, belum ada kode.*

---

## 1. Ringkasan

**Varsena** adalah game simulasi membangun negara dengan gaya kehidupan sehari-hari ala life sim klasik dan rekrutmen banyak tokoh ala RPG politik era 32-bit.

Perang saudara di wilayah Hal-Doran sudah berakhir. Republik Varsena baru dideklarasikan. Kamu adalah pemimpin muda yang memenangkan perang dan kini menjabat sebagai **Presiden** pertama republik, dan sekarang harus memimpin negeri yang hancur: membangun ulang kota, merekrut orang-orang yang tepat, menjaga persatuan, dan bertahan dari ancaman dalam maupun luar.

**Kalimat inti:** *Memenangkan perang itu mudah. Memimpin perdamaian jauh lebih sulit.*

### Genre
Nation builder + city sim + life sim + rekrutmen, dengan perang pasukan sesekali.

### Platform
Game browser (HTML5) untuk demo pertama.

---

## 2. Pilar Desain

1. **Orang adalah sumber daya utama.** Bangunan, penemuan, dan kebijakan bergantung pada siapa yang kamu rekrut dan percayai.
2. **Turun ke lapangan atau tetap di kantor.** Kantor itu efisien, tapi kebenaran ada di jalanan.
3. **Damai itu rapuh.** Tiap keputusan punya dampak pada stabilitas, kepercayaan, dan wilayah.
4. **Kota yang hidup.** Warga pindah masuk, punya kebutuhan, dan bereaksi pada kebijakanmu.
5. **Perang itu pilihan dan beban, bukan inti.** Perang bisa dimainkan, di-skip, atau didelegasikan, tapi biayanya selalu terasa.

---

## 3. Dunia

### 3.1 Sejarah singkat
- Wilayah **Hal-Doran** dulu dikuasai **Kerajaan Hal**.
- Dua tahun lalu, **Pangeran Kerajaan Hal** melakukan genosida di **Brennhold**, dan hanya 20% penduduknya yang tersisa.
- Peristiwa itu memicu **perang saudara**. Kota-kota bersatu melawan kerajaan, dibantu **Republik Solmar** dari selatan.
- **Pangeran Hal tewas** di akhir perang.
- **Adik sang pangeran** mengasingkan diri ke utara, ke **Republik Suci Myrrhen**.
- Kerajaan Hal runtuh. Ibu kotanya, **Eternal City**, ditaklukkan.
- **Republik Varsena** dideklarasikan dengan Brennhold sebagai ibu kota.

### 3.2 Kota-kota Republik Varsena

| Kota | Lokasi | Identitas | Fokus potensial | Bibit masalah |
|---|---|---|---|---|
| **Brennhold** (ibu kota) | Kota benteng di tengah padang rumput, utara Danau Doran | Setengah hancur, penduduk tinggal 20% | Pusat pembangunan | Trauma, kota kosong, menarik warga kembali |
| **Greenleaf City** | Barat Brennhold, dikelilingi hutan | Kota universitas | **Sains** | Akademisi yang menolak campur tangan negara |
| **Gold Mines City** | Ujung barat kontinen, dipisahkan pegunungan dari Greenleaf | Kota tambang, paling jauh dari ibu kota | **Keuangan dan industri** | Korupsi, pencurian, saingan Federasi Iskander |
| **South Lake City** | Selatan Danau Doran | Kota tertua | **Pertanian dan perikanan** | Bangsawan lama, sengketa lahan |
| **Twin River** | Barat Danau Doran | Tiga ras baru rukun karena perang | Diplomasi dan perdagangan | Harmoni yang rapuh |
| **Fort Wendel** (Kota Militer Utara) | Utara Brennhold | Kota para ksatria | **Militer** | Kesetiaan pada tradisi atau pada republik? |
| **Kastil Lakeward** (Kota Militer Selatan) | Utara South Lake City | Bekas markas besar pasukan pemberontak selama perang saudara. Dipimpin **Jenderal Hassan** | **Militer** | Tentara rakyat vs ksatria Fort Wendel, biaya pemeliharaan di masa damai |
| **Eternal City** | Timur Brennhold | Bekas ibu kota Kerajaan Hal, bergabung karena ditaklukkan | Ekonomi dan budaya lama | Loyalis kerajaan, pemberontakan |
| **Kairos** | Selatan Eternal City | Kota wisata pegunungan | **Pariwisata dan budaya** | Bergantung pada keamanan dan reputasi negara |

### 3.3 Ras di Twin River
- **Manusia**
- **Kaum Amfibi**: hidup di sungai, ahli air, perahu, dan irigasi
- **Kaum Rubah**: lincah, pedagang ulung, punya jaringan informasi

Kotanya dibangun di atas air: rumah panggung, kanal, dan jembatan.

### 3.4 Negara tetangga

| Negara | Lokasi | Karakter | Peran dalam cerita |
|---|---|---|---|
| **Republik Solmar** | Selatan South Lake, dipisahkan padang tandus sisa perang kuno | Negara besar, bersahabat | Sekutu yang membantu perang saudara. Varsena berutang budi, dan utang itu bisa ditagih |
| **Republik Suci Myrrhen** | Utara Fort Wendel, dipisahkan pegunungan es | Negara keagamaan | Ketegangan ideologi, misionaris, bisa memengaruhi ksatria Fort Wendel |
| **Federasi Iskander** | Barat Gold Mines, dipisahkan pegunungan batu | Gabungan klan pegunungan yang baru bersatu, keras, menjunjung kehormatan, kaya batu dan logam | Saingan alami Gold Mines. Bisa jadi rival, mitra dagang, atau ancaman perbatasan |
| **Keratuan Polania** | Kontinen lain di seberang laut, selatan Solmar | Adidaya lama, netral, punya senjata berbahaya | Kartu liar. Diplomasi tingkat tinggi |
| **Republik Islania** | Barat Polania | Negara maritim lama | Mitra dagang laut, sumber teknologi kapal |

---

## 4. Cerita

### 4.1 Prolog: "Malam Terakhir Perang"
Game dibuka di malam setelah kemenangan terakhir. Pemain berbicara dengan para veteran satu per satu, dan pilihan dialog serta keputusan kecil di prolog menentukan **siapa yang tetap tinggal dan siapa yang pergi**.

- Veteran yang pergi meninggalkan **posisi kosong** yang harus diisi lewat rekrutmen.
- Beberapa veteran yang pergi bisa **kembali** di kemudian hari lewat quest khusus.
- Tiap playthrough dimulai dengan tim yang berbeda.

### 4.2 Veteran perang (original, nama sementara)

| Nama | Peran semasa perang | Jika tetap tinggal | Jika pergi |
|---|---|---|---|
| **Aldric Vane** | Ahli strategi | Menjadi **sekretaris pemimpin** (lihat 4.4) | Elin Marrow menjadi sekretaris. Posisi ahli strategi perang harus direkrut dari Fort Wendel |
| **Mira Thessan** | Tabib lapangan | Membangun rumah sakit pertama | Rumah sakit butuh dokter dari Greenleaf |
| **Garran Holt** | Ksatria veteran dari Fort Wendel | Menjembatani republik dengan para ksatria | Fort Wendel lebih sulit dikendalikan |
| **Seren Ashby** | Mata-mata | Membangun jaringan intelijen | Krisis sulit diselidiki tanpa informan |
| **Toma Brick** | Insinyur lapangan | Memimpin rekonstruksi Brennhold | Pembangunan lebih lambat sampai arsitek direkrut |
| **Lys Amberline** | Penyanyi kelana penyemangat pasukan | Mendirikan teater pertama | Budaya berkembang lebih lambat |

### 4.3 Jenderal Hassan
- Komandan front selatan pasukan pemberontak. Sekarang memimpin Kastil Lakeward.
- Berasal dari keluarga petani South Lake, naik pangkat dari prajurit biasa.
- Pragmatis, dekat dengan tentara rakyat, kurang sabar dengan politik ibu kota.
- **Kaitan dengan demo:** dalam sengketa lahan South Lake, Hassan cenderung membela petani. Keputusan pemain bisa menguatkan atau merenggangkan kesetiaannya.
- Rival halus para ksatria Fort Wendel, karena tentara rakyat dan ksatria bangsawan punya cara pandang berbeda soal militer republik.

### 4.4 Sekretaris
Siapa yang menjadi sekretaris ditentukan di prolog.

**Jika Aldric Vane tetap tinggal → Aldric menjadi sekretaris**
- Ahli strategi perang yang jenius, dingin, dan blak-blakan.
- Sering mengkritik keputusan pemain secara terbuka, tapi analisisnya hampir selalu tepat.
- Laporannya **akurat**, tapi dia punya agenda sendiri: dia akan mengambil keputusan "paling efektif" walaupun keras (misalnya menekan loyalis Hal dengan tangan besi). Makin tinggi delegasi, makin besar pengaruh agendanya pada negara.
- Hubungan dengan pemain menentukan apakah dia menahan diri atau bertindak semaunya.

**Jika Aldric pergi → Elin Marrow menjadi sekretaris**
- Juru tulis muda dari Greenleaf, efisien, rapi, dan pendiam.
- Laporannya **kurang lengkap** di awal, lalu membaik seiring pengalaman.
- **Rahasia (alur cerita):** keluarganya dulu pejabat di Kerajaan Hal. Pemain bisa menemukannya lewat penyelidikan di lapangan. Responsnya menentukan apakah Elin menjadi orang paling setia atau justru pengkhianat.

Kedua jalur memberi pengalaman berbeda: Aldric berarti **akurat tapi berbahaya kalau dibiarkan**, Elin berarti **lemah di awal tapi bisa tumbuh**.

### 4.5 Alur besar (game penuh)
1. **Babak 1 — Puing:** membangun ulang Brennhold, mengisi posisi kosong, krisis kecil.
2. **Babak 2 — Retak:** loyalis Hal di Eternal City, korupsi di Gold Mines, ketegangan di Twin River.
3. **Babak 3 — Tekanan dari luar:** Solmar menagih utang budi, Myrrhen menyebarkan pengaruh, Iskander di perbatasan.
4. **Babak 4 — Pilihan zaman:** invasi besar atau krisis diplomatik dengan Polania. Ending ditentukan oleh fokus negara, wilayah, tokoh yang direkrut, dan keputusan moral.

**Benang cerita: adik Pangeran Hal di pengasingan**
- Adik sang pangeran adalah pewaris sah terakhir Kerajaan Hal, dan sekarang tinggal di Myrrhen.
- Loyalis Hal di Eternal City melihatnya sebagai simbol harapan untuk mengembalikan kerajaan.
- Myrrhen bisa memanfaatkannya sebagai alat tekanan politik terhadap Varsena.
- Sikapnya sendiri belum jelas: ingin balas dendam, ingin kembali berkuasa, atau justru ingin damai dan menebus dosa kakaknya. Ini bisa jadi kejutan di babak akhir.
- **Kalais** (lihat 4.6) pernah mengenalnya secara pribadi di istana.

### 4.6 Pemimpin daerah dan pejabat

| Nama | Jabatan | Catatan dan potensi cerita |
|---|---|---|
| **Elena** | Kepala Universitas Greenleaf | Kunci riset dan penemuan. Menjaga kebebasan akademik |
| **Helena** | Walikota Greenleaf | Mengurus kota. Bisa berbeda pendapat dengan Elena soal anggaran universitas vs kota |
| **Michael** | Walikota Twin River | Menjaga harmoni Manusia, Kaum Amfibi, dan Kaum Rubah |
| **Frederick** | Walikota South Lake | Kota tertua, berhadapan dengan bangsawan lama. Pihak utama dalam krisis sengketa lahan di demo |
| **Isam** | Walikota Gold Mines | Kota terjauh dari ibu kota. Paling dekat dengan isu korupsi dan rivalitas Iskander |
| **Kalistov** | Jenderal Fort Wendel | Pemimpin para ksatria (Kota Militer Utara). Rival halus Jenderal Hassan |
| **Jenderal Hassan** | Pemimpin Kastil Lakeward | Kota Militer Selatan (lihat 4.3) |
| **Kalais** | Pejabat Sementara Walikota Eternal City dan Kairos | Mantan ahli strategi Kerajaan Hal yang membelot ke pihak pemberontak |

**Kalais: benang cerita**
- Dibenci loyalis Hal sebagai pengkhianat, dan dicurigai sebagian veteran karena dulu musuh.
- Memegang dua kota sekaligus, jadi kekuasaannya besar. Pemain harus memutuskan: mempercayainya, membatasinya, atau mencari walikota definitif.
- Kalau Aldric menjadi sekretaris, keduanya bisa saling menghormati sebagai sesama ahli strategi, atau justru saling curiga.

---

## 5. Peran Pemain dan Loop Harian

### 5.1 Waktu (gaya Metropolismania)
- Satu hari (06:00–24:00) berjalan sekitar **10 menit nyata**, dibagi pagi, siang, sore, malam.
- **Hari berganti sendiri pukul 24:00.** Pemain tidak wajib tidur; tempat tidur hanya untuk melompat ke pagi berikutnya.
- Laporan harian dan penyimpanan otomatis terjadi saat hari berganti.
- **Pembangunan berjalan dalam waktu nyata:** dengan 6 pekerja, rumah sekitar 3 menit, toko sekitar 5 menit. Setiap 3 pekerja membentuk satu tim; pekerjaan di luar jumlah tim menunggu giliran. Pekerja tambahan mempercepat semua pekerjaan.
- Rombongan pendatang tiba sepanjang hari dan pindah masuk begitu ada bangunan yang cocok. Rombongan yang tidak mendapat tempat dalam 2 hari pergi ke Twin River.
- **4 musim**, masing-masing 30 hari.

### 5.2 Dua mode bermain

**Di lapangan** (gaya life sim, jalan-jalan bebas)
- Jalan-jalan di Brennhold dan kota-kota lain.
- Ngobrol dengan warga dan membangun hubungan.
- Merekrut tokoh lewat quest dan syarat khusus.
- Inspeksi proyek, selidiki kasus, hadiri festival.
- Mendapat **informasi asli** yang tidak muncul di laporan.

**Di kantor** (gaya menu dan keputusan)
- Membaca laporan harian dari tiap kota.
- Mengeluarkan dekrit dan kebijakan.
- Mengatur anggaran.
- Mengangkat dan memberhentikan pejabat.
- Menyetujui proyek bangunan dan penemuan.
- Menerima utusan dan diplomat.

### 5.3 Sistem sekretaris
Pemain bisa menyerahkan tugas rutin ke sekretaris:

| Tingkat delegasi | Efek |
|---|---|
| **Rendah** | Sekretaris hanya merangkum laporan. Pemain memutuskan semuanya |
| **Sedang** | Sekretaris menyetujui izin kecil dan menjadwalkan rapat |
| **Tinggi** | Sekretaris menangani hampir semua urusan rutin. Pemain bebas di lapangan |

**Trade-off:** makin tinggi delegasi, makin hemat waktu. Tapi laporan bisa tidak lengkap, keputusan kecil bisa keliru, dan masalah seperti korupsi bisa tersembunyi. Dengan Elin, risikonya laporan kurang akurat. Dengan Aldric, risikonya keputusan yang terlalu keras dibuat atas nama pemain.

---

## 6. Sistem Kota (gaya Metropolismania)

### 6.1 Konsep
Kota tumbuh karena **orang mau pindah ke sana**. Pemain tidak menempatkan warga, tapi menciptakan kondisi yang menarik mereka.

### 6.2 Alur
1. Pemain membangun rumah dan fasilitas di petak kosong.
2. **Calon warga** datang dengan kebutuhan tertentu (misalnya keluarga petani butuh rumah dekat ladang dan pasar).
3. Pemain bisa **menemui calon warga langsung** di lapangan untuk membujuk dan mencocokkan mereka dengan rumah.
4. Warga yang puas mengajak kerabatnya datang. Warga yang kecewa pergi.

### 6.3 Kebutuhan warga
- Tempat tinggal
- Pekerjaan
- Makanan
- Keamanan
- Kesehatan
- Pendidikan
- Hiburan dan budaya
- Ibadah (penting untuk pengaruh Myrrhen)

### 6.4 Kategori bangunan
| Kategori | Contoh |
|---|---|
| Hunian | Rumah sederhana, rumah keluarga, rumah tingkat, asrama, rumah bangsawan |
| Ekonomi | Pasar, toko, bengkel, gudang, bank |
| Pangan | Ladang, peternakan, dermaga ikan, lumbung |
| Layanan publik | Rumah sakit, sekolah, pos penjaga, pengadilan |
| Pemerintahan | Kantor pemimpin, balai kota, kantor pajak |
| Budaya | Teater, alun-alun, taman, monumen peringatan genosida |
| Militer | Barak, tembok, menara pengawas, gudang senjata |
| Khusus | Bangunan yang terbuka lewat rekrutmen atau penemuan |

---

## 7. Rekrutmen dan Posisi

### 7.1 Konsep
Banyak posisi di pemerintahan dan kota kosong, baik karena ditinggal veteran maupun karena posisi itu baru dibutuhkan oleh negara muda. Tiap posisi diisi oleh tokoh bernama yang direkrut lewat quest.

### 7.2 Cara merekrut
- Quest pribadi
- Tingkat hubungan
- Syarat negara (misalnya rektor baru mau bergabung kalau anggaran sains cukup)
- Menyelesaikan krisis tertentu
- Memilih di antara dua kandidat yang saling bersaing

### 7.3 Contoh posisi
| Posisi | Efek |
|---|---|
| Menteri Keuangan | Pajak, anggaran, perdagangan |
| Menteri Pertanian | Hasil panen, lahan |
| Kepala Perikanan | Hasil danau dan sungai |
| Kepala Arsitek | Kecepatan dan biaya pembangunan |
| Kepala Penjaga Kota | Pencurian, keamanan |
| Hakim Agung | Sengketa lahan, pengadilan |
| Kepala Pengawas | Anti-korupsi |
| Diplomat | Hubungan dengan negara tetangga |
| Rektor Akademi | Riset dan penemuan |
| Jenderal | Pasukan, perang |
| Kepala Intelijen | Informasi tersembunyi, penyelidikan |
| Direktur Teater | Pertunjukan, moral |
| Kepala Rumah Sakit | Kesehatan |
| Bendahara Kota | Pengelolaan keuangan per kota |

### 7.4 Atribut tokoh
- Kemampuan (sesuai bidang)
- Kesetiaan
- Integritas (tinggi berarti sulit korupsi)
- Hubungan dengan pemain
- Hubungan dengan tokoh lain (ada yang saling cocok, ada yang saling bermusuhan)

---

## 8. Fokus Negara dan Wilayah

### 8.1 Fokus
- **Pertanian**
- **Perikanan**
- **Keuangan**
- **Militer**
- **Sains**

Fokus **tidak dipilih sekali**. Fokus tumbuh dari anggaran, kebijakan, wilayah, dan tokoh yang direkrut. Tiap fokus punya pohon perkembangan sendiri yang membuka bangunan, penemuan, dan kebijakan.

### 8.2 Ekspansi wilayah

| Jalur | Cara | Konsekuensi |
|---|---|---|
| **Penaklukan** | Perang | Cepat, tapi kepuasan warga rendah dan rawan pemberontakan |
| **Bergabung sukarela** | Daerah tetangga mengajukan diri karena negara makmur, stabil, dan budayanya menarik | Lambat, tapi integrasi mulus |

Daerah baru membawa keunggulannya sendiri, tokoh baru yang bisa direkrut, dan masalah baru.

### 8.3 Jaringan kota militer
| Kota militer | Status | Lokasi | Fungsi |
|---|---|---|---|
| **Utara** | Ada: Fort Wendel | Utara Brennhold | Menjaga perbatasan dengan Republik Suci Myrrhen |
| **Selatan** | Ada: Kastil Lakeward | Utara South Lake City | Melindungi lumbung pangan dan jalur ke Republik Solmar |
| **Barat** | Wacana | Dekat Gold Mines | Menjaga tambang dan perbatasan dengan Federasi Iskander |
| **Timur** | Wacana | Dekat Eternal City | Mengawasi loyalis Hal dan menjaga Kairos |

Kota militer Barat dan Timur muncul sebagai **wacana politik** yang harus diputuskan pemain:
- **Biaya:** anggaran besar dan pasukan yang ditarik dari tempat lain.
- **Reaksi dalam negeri:** warga Eternal City bisa melihat kota militer Timur sebagai pendudukan. Gold Mines bisa menyambutnya sebagai perlindungan.
- **Reaksi luar negeri:** Federasi Iskander bisa menganggap kota militer Barat sebagai ancaman.
- **Siapa pemimpinnya:** butuh jenderal baru yang harus direkrut.

### 8.4 Pendanaan ibu kota: perjanjian pangan Gold Mines (Tahap 2)
- **Masalah:** Brennhold kekurangan orang dan uang. Gold Mines kelebihan uang tapi kekurangan pangan, karena pasokan dari desa-desa sekitar Brennhold dan ikan dari desa nelayan South Lake terhambat.
- **Surat Walikota Isam** datang di pagi hari ke-2. Pemain membalas lewat halaman Surat di meja kerja dengan tiga pilihan:
  - **Harga adil:** uang muka 300, sekitar 40 keping/hari, hubungan Gold Mines naik.
  - **Dana pembangunan di muka:** uang muka 800, sekitar 20 keping/hari.
  - **Harga tinggi:** uang muka 200, sekitar 70 keping/hari, hubungan Gold Mines turun dan ada keluhan berkala.
  - Jika delegasi **Tinggi** dan surat dibiarkan, Aldric menandatangani "harga tinggi" atas nama Presiden.
- **Pendapatan baru mengalir setelah jalur dibuka** lewat dua proyek:
  - **Jalur Desa Barat** (Brennhold): separuh pendapatan masuk kas ibu kota. Juga mendatangkan lebih banyak rombongan petani.
  - **Dermaga dan Rumah Asap Ikan South Lake:** separuh lainnya; 40% untuk kas ibu kota, 60% untuk South Lake. Lebih cepat jika Kaum Oolo diminta membantu.
- **Tenaga kerja:** tukang tetap, prajurit Lakeward (bantuan Hassan), pekerja harian sewaan, dan rombongan tukang yang pindah masuk.

---

## 9. Penemuan

Penemuan dibuka lewat riset di Greenleaf atau oleh tokoh tertentu.

| Bidang | Contoh |
|---|---|
| Pertanian | Irigasi kincir air, rotasi tanaman, pupuk baru |
| Perikanan | Jaring baru, kolam ikan, pengawetan |
| Keuangan | Bank negara, uang kertas, bursa dagang |
| Militer | Ketapel baru, baju zirah ringan, sistem sinyal |
| Sains | Mesin cetak, lampu jalan, observatorium |
| Sipil | Saluran air, jalan batu, pemadam kebakaran |

---

## 10. Budaya

- **Teater:** pertunjukan menaikkan moral, menarik wisatawan, dan bisa menyampaikan pesan politik (dengan risiko).
- **Parade:** merayakan kemenangan, hari jadi republik, atau menyambut daerah baru.
- **Festival musiman:** panen (South Lake), lampion air (Twin River), turnamen ksatria (Fort Wendel), festival gunung (Kairos).
- **Monumen:** misalnya monumen peringatan genosida Brennhold, yang membantu memulihkan trauma kota.

---

## 11. Krisis

| Krisis | Contoh | Cara penyelesaian |
|---|---|---|
| **Pencurian** | Gudang pangan Brennhold dibobol | Selidiki di lapangan, perkuat penjaga, cari pelakunya |
| **Sengketa lahan** | Bangsawan lama South Lake vs keluarga pengungsi | Pengadilan, kompromi, keputusan pemimpin |
| **Korupsi** | Pejabat Gold Mines menggelapkan hasil tambang | Investigasi, rekrut Kepala Pengawas, ganti pejabat |
| **Pemberontakan** | Loyalis Hal di Eternal City | Diplomasi, konsesi, atau perang |
| **Invasi** | Pasukan asing di perbatasan | Diplomasi atau perang |

Tiap krisis bisa diselesaikan dengan beberapa cara. Tiap cara punya biaya dan dampak berbeda pada stabilitas, kepercayaan warga, dan hubungan antar tokoh.

---

## 12. Perang

### 12.1 Bentuk
- Hanya untuk **perang terbuka**.
- Battle pasukan di peta: unit, jenderal, medan, dan moral.
- Turn-based.

### 12.2 Tiga cara menghadapinya
1. **Mainkan manual:** hasil paling optimal kalau strateginya bagus.
2. **Skip (tombol cepat):** hasil langsung dihitung dari kekuatan pasukan, jenderal, logistik, dan moral.
3. **Delegasikan:** kirim jenderal untuk memimpin, sementara pemain tetap mengurus negeri. Hasil datang sebagai laporan, dipengaruhi kemampuan dan kesetiaan jenderal.

### 12.3 Biaya perang
- Anggaran
- Pangan (dari sektor pertanian dan perikanan)
- Korban jiwa. **Tokoh bisa gugur permanen**: posisinya kosong dan harus diisi ulang, dan kematiannya berdampak pada moral serta hubungan dengan tokoh lain
- Moral warga
- Reputasi internasional

---

## 13. Statistik Negara

| Statistik | Arti |
|---|---|
| **Kas negara** | Uang |
| **Pangan** | Persediaan makanan |
| **Populasi** | Jumlah warga per kota |
| **Stabilitas** | Risiko pemberontakan dan kerusuhan |
| **Kepercayaan publik** | Dukungan warga pada pemimpin |
| **Moral** | Semangat warga dan pasukan |
| **Reputasi** | Pandangan negara tetangga |
| **Kekuatan militer** | Kesiapan pasukan |

---

## 14. Visual dan Audio

### 14.1 Gaya visual: **Opsi D, "32-bit Klasik"** (dipilih)
- Pixel art 2D, sudut pandang top-down miring (3/4)
- **Sprite 24 × 40 px**, proporsi sekitar 2,7 kepala (tidak chibi)
- Siluet berbeda tiap tokoh (Hassan lebar, Aldric ramping, Elin lebih kecil)
- Bayangan 3–4 tingkat, cahaya dari kiri atas, garis tepi gelap tipis
- Warna kaya dan agak gelap: batu, tanah, kayu tua
- **Potret dialog 64 × 64 px**, kotak dialog berbingkai logam gelap
- Pencahayaan hangat yang redup dengan tepi layar lebih gelap

**Dua suasana kota Brennhold:**
- **Pusat ibu kota:** gedung batu pasir (Balai Republik), alun-alun dan jalan berubin batu **abu-abu** (beda dari dinding krem), tangga megah, balustrade, pagar tanaman, cemara
- **Pemukiman pinggiran:** rumah kayu, atap sirap, rumah-rumah terbakar yang menunggu dibangun ulang, petak kosong, ladang

Referensi sketsa: halaman "Opsi Visual Varsena". Semua aset original, tidak menyalin game lain.

### 14.2 Untuk demo
Pixel art dibuat langsung lewat kode, jadi tampilannya lebih sederhana. Bisa diganti aset buatan artist nanti.

### 14.3 Audio
Demo bisa tanpa musik atau dengan musik sederhana. Musik original menyusul.

---

## 15. Teknis (usulan)

- **Platform:** browser (HTML5), bisa dimainkan lewat link
- **Engine:** Phaser 3 (JavaScript)
- **Save:** disimpan di browser
- **Struktur data:** tokoh, bangunan, krisis, dan penemuan disimpan sebagai data terpisah agar mudah ditambah

---

## 16. Lingkup Demo Pertama

**Tujuan:** membuktikan loop inti terasa menyenangkan.

### Isi demo
- **Prolog singkat:** menentukan 2–3 veteran yang tinggal atau pergi
- **Lokasi:** Brennhold (bisa dijelajahi) dan South Lake (kunjungan untuk satu krisis)
- **Tokoh:** pemain, sekretaris (Aldric atau Elin), Jenderal Hassan, 3–4 veteran, sekitar 8 posisi yang bisa direkrut
- **Waktu:** 1 musim (30 hari)
- **Sistem:**
  - Jalan-jalan di lapangan dan mode kantor
  - Sistem sekretaris (3 tingkat delegasi)
  - Membangun rumah dan fasilitas, dengan warga yang pindah masuk
  - 2 krisis: **pencurian** (Brennhold) dan **sengketa lahan** (South Lake)
  - 1 teater dan 1 festival akhir musim
  - 3–4 penemuan sederhana
- **Klimaks:** 1 pemberontakan kecil loyalis Hal sebagai perang (bisa dimainkan, di-skip, atau didelegasikan)

### Di luar demo
Kota lain, negara tetangga, ekspansi wilayah, pohon fokus lengkap, pernikahan, babak 2–4.

---

## 17. Pertanyaan Terbuka

1. Ada sistem hubungan romantis atau pernikahan seperti di life sim?
2. Adik Pangeran Hal: laki-laki atau perempuan, dan siapa namanya?
3. Nama default Presiden (pemain), atau pemain mengisi nama sendiri?
