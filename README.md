# SmartCodeConveyor: Otomasi Lab (MVP Level 1)

> **Prototipe Media Pembelajaran Game Edukasi Berbasis Web dengan Fitur *Learning Analytics* untuk Melatih Logika Percabangan Siswa SMK**  
> *Pengembangan Tugas Akhir / Skripsi — Program Studi S1 Pendidikan Teknologi Informasi, Universitas Negeri Surabaya*

---

## 📌 Gambaran Singkat Proyek
**SmartCodeConveyor** adalah media pembelajaran interaktif berbasis simulasi pabrik otomasi (*industrial conveyor belt*). Media ini dirancang khusus untuk memfasilitasi pemahaman struktur kontrol logika **Percabangan (*Branching: IF-ELSE*)** pada mata pelajaran Informatika (Fase E SMK). 

Melalui metafora penyortiran paket otomatis, siswa belajar mengevaluasi kondisi logika (*boolean evaluation*) tanpa dibebani intimidasi sintaks teks konvensional, sekaligus memungkinkan perekaman perilaku berpikir siswa melalui instrumen *in-game telemetry*.

---

## 📸 Tampilan Antarmuka (MVP)

<img width="1167" height="698" alt="MVP CodeConveyor" src="https://github.com/user-attachments/assets/00c5d777-d244-46f8-b48f-f256a2c42147" />

---

## 🕹️ Mekanisme Gameplay & Konsep Pembelajaran (Level 1)
1. **Skenario Masalah:**
   * Paket bergerak di atas sabuk konveyor menuju dua wadah penampung:
     * **Bin A (Lurus):** Khusus paket normal berwana **Biru**.
     * **Bin B (Bawah):** Khusus paket cacat (*hazard/recycle*) berwarna **Merah**.
2. **Interaksi Logika Pemrograman:**
   * Siswa bertindak sebagai teknisi sistem kendali dengan merumuskan aturan sensor:
     $$\text{JIKA } (\text{Warna} == \text{MERAH}) \longrightarrow \text{Arahkan ke BIN B}, \quad \text{SELAIN ITU} \longrightarrow \text{Arahkan ke BIN A}$$
3. **Eksekusi & Notional Machine:**
   * Ketika tombol **Jalankan Konveyor** ditekan, mesin bergerak dan mengevaluasi alur logika secara visual, menunjukkan bagaimana sistem komputasi membuat keputusan percabangan.

---

## 📊 Integrasi Learning Analytics (In-Game Telemetry)
Setiap kali tombol eksekusi dijalankan, sistem mencatat data telemetri kognitif ke konsol sistem/database untuk analisis pola penalaran:
* **`attempt_number`**: Jumlah percobaan yang dibutuhkan siswa hingga berhasil.
* **`duration_seconds`**: Waktu berpikir siswa sebelum memutuskan eksekusi logika.
* **`rules_constructed`**: Kombinasi aturan *IF-ELSE* yang disusun oleh siswa.
* **`error_message`**: Deteksi miskonsepsi (contoh: paket cacat lolos ke Bin A atau paket normal terbuang ke Bin B).

---

## 🛠️ Tech Stack
* **Framework:** Next.js (App Router, TypeScript)
* **Game Engine:** Phaser 3 (Canvas/WebGL rendering & tween animation)
* **Styling:** Tailwind CSS
* **Version Control:** Git & GitHub

---
