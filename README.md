# 📚 Manga Directory

> Direktori situs manga berbasis komunitas yang sepenuhnya berjalan tanpa database. Seluruh data disimpan dalam file JSON dan dapat dikelola oleh komunitas melalui Pull Request di GitHub.

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live-brightgreen?logo=github)](https://yourusername.github.io/manga-directory)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Validation](https://github.com/YOUR_USERNAME/manga-directory/actions/workflows/validate.yml/badge.svg)](https://github.com/YOUR_USERNAME/manga-directory/actions/workflows/validate.yml)

---

## ✨ Fitur

- **Tanpa Database** - Seluruh data disimpan dalam file JSON di repository
- **Komunitas-Driven** - Siapa saja dapat menambahkan situs melalui Pull Request
- **Validasi Otomatis** - GitHub Actions memeriksa setiap PR untuk memastikan data valid
- **Pencarian & Filter** - Cari berdasarkan nama, bahasa, negara, genre, dan status
- **Sorting** - Urutkan berdasarkan nama, tanggal ditambahkan, atau popularitas
- **Dark Mode Modern** - Desain dashboard profesional dengan tema gelap
- **Responsive** - Optimal untuk desktop, tablet, dan mobile
- **Loading Skeleton** - Animasi loading yang halus saat data dimuat
- **Badge System** - Penanda untuk situs baru, offline, NSFW, dan bahasa

---

## 🏗️ Struktur Repository

```
manga-directory/
├── .github/
│   ├── ISSUE_TEMPLATE/
│   │   └── add-site.md          # Template untuk Issue penambahan situs
│   └── workflows/
│       └── validate.yml          # GitHub Actions untuk validasi otomatis
├── sites/
│   ├── indonesia.json            # Situs berbahasa Indonesia
│   ├── english.json              # Situs berbahasa Inggris
│   ├── japanese.json             # Situs berbahasa Jepang
│   └── korean.json               # Situs berbahasa Korea
├── css/
│   └── style.css                 # Styling utama
├── js/
│   └── app.js                    # Logic aplikasi
├── index.html                    # Halaman utama
└── README.md                     # Dokumentasi ini
```

---

## 📋 Format Data

Setiap file JSON di folder `sites/` berisi array objek dengan struktur berikut:

```json
{
  "name": "Nama Situs",
  "url": "https://example.com",
  "language": ["Indonesia"],
  "country": "Indonesia",
  "genres": ["Action", "Romance", "Fantasy"],
  "status": "online",
  "nsfw": false,
  "added_at": "2026-06-27",
  "description": "Deskripsi singkat tentang situs (maksimal 500 karakter).",
  "popularity": 85
}
```

### Field Wajib

| Field | Tipe | Deskripsi |
|-------|------|-----------|
| `name` | String | Nama situs (maksimal 100 karakter) |
| `url` | String | URL lengkap dengan protokol (https://) |
| `language` | Array | Bahasa yang didukung situs |
| `country` | String | Negara asal situs |
| `genres` | Array | Genre manga yang tersedia |
| `status` | String | `"online"` atau `"offline"` |
| `nsfw` | Boolean | `true` jika berisi konten dewasa |
| `added_at` | String | Tanggal ditambahkan (format: YYYY-MM-DD) |

### Field Opsional

| Field | Tipe | Deskripsi |
|-------|------|-----------|
| `description` | String | Deskripsi singkat situs |
| `popularity` | Number | Skala 0-100 untuk tingkat popularitas |

---

## 🚀 Cara Menambahkan Situs Baru

Ada dua cara untuk menambahkan situs ke direktori:

### Cara 1: Menggunakan GitHub Web Interface (Mudah)

1. **Fork repository** ini ke akun GitHub Anda
2. Buka folder `sites/` dan pilih file JSON sesuai bahasa utama situs
   - `indonesia.json` untuk situs berbahasa Indonesia
   - `english.json` untuk situs berbahasa Inggris
   - `japanese.json` untuk situs berbahasa Jepang
   - `korean.json` untuk situs berbahasa Korea
3. Klik ikon **Edit** (pensil) di pojok kanan atas
4. Tambahkan objek baru ke array JSON dengan format yang benar
5. Scroll ke bawah, isi **Commit changes**:
   - Pilih **"Create a new branch for this commit and start a pull request"**
   - Beri nama branch: `add-site/nama-situs`
   - Commit message: `Add [Nama Situs] to directory`
6. Klik **Propose changes**
7. Isi deskripsi Pull Request dengan informasi situs
8. Klik **Create pull request**

### Cara 2: Menggunakan Command Line (Untuk Pengguna Git)

```bash
# 1. Fork repository di GitHub, lalu clone fork Anda
git clone https://github.com/YOUR_USERNAME/manga-directory.git
cd manga-directory

# 2. Buat branch baru
git checkout -b add-site/nama-situs

# 3. Edit file JSON yang sesuai (contoh: sites/indonesia.json)
# Tambahkan objek baru ke array

# 4. Commit perubahan
git add sites/indonesia.json
git commit -m "Add [Nama Situs] to directory"

# 5. Push ke fork Anda
git push origin add-site/nama-situs

# 6. Buat Pull Request melalui GitHub web interface
```

### Cara 3: Menggunakan Issue (Alternatif)

Jika Anda tidak familiar dengan Pull Request, Anda dapat:

1. Klik tombol **"Tambah Situs"** di website
2. Pilih template **"Tambah Situs Manga Baru"**
3. Isi informasi yang diminta
4. Maintainer akan menambahkan situs untuk Anda

---

## 🖥️ Menjalankan Website Secara Lokal

Karena ini adalah static site, Anda dapat menjalankannya dengan sangat mudah:

### Menggunakan Python (Built-in HTTP Server)

```bash
# Python 3
cd manga-directory
python -m http.server 8000

# Buka http://localhost:8000 di browser
```

### Menggunakan Node.js (live-server)

```bash
# Install live-server secara global
npm install -g live-server

# Jalankan
cd manga-directory
live-server --port=8000

# Browser akan terbuka otomatis
```

### Menggunakan VS Code (Live Server Extension)

1. Install ekstensi **"Live Server"** oleh Ritwick Dey
2. Klik kanan pada `index.html`
3. Pilih **"Open with Live Server"**

### Menggunakan PHP (Built-in Server)

```bash
cd manga-directory
php -S localhost:8000
```

> **Catatan:** Karena website mengambil data dari file JSON lokal menggunakan `fetch()`, Anda **harus** menggunakan HTTP server. Tidak dapat dibuka langsung dengan `file://` protocol karena browser akan memblokir request CORS.

---

## 🌐 Deploy ke GitHub Pages

### Langkah 1: Persiapan Repository

1. Push repository ke GitHub (jika belum)
2. Buka **Settings** → **Pages** di repository GitHub Anda
3. Di bagian **Source**, pilih **Deploy from a branch**
4. Pilih branch `main` dan folder `/ (root)`
5. Klik **Save**

### Langkah 2: Update Konfigurasi (Penting!)

Setelah deploy, Anda **harus** mengupdate URL GitHub di beberapa file:

**1. Update `index.html`:**

Cari dan ganti semua kemunculan:
```
YOUR_USERNAME/manga-directory
```
Menjadi username dan nama repository Anda yang sebenarnya.

Contoh:
```html
<!-- Sebelum -->
<a href="https://github.com/YOUR_USERNAME/manga-directory" ...>

<!-- Sesudah -->
<a href="https://github.com/johndoe/manga-directory" ...>
```

**2. Update `js/app.js` (jika menggunakan absolute URL):**

Jika Anda ingin mengambil data dari raw.githubusercontent.com (opsional):

```javascript
const CONFIG = {
    dataFiles: [
        'https://raw.githubusercontent.com/YOUR_USERNAME/manga-directory/main/sites/indonesia.json',
        'https://raw.githubusercontent.com/YOUR_USERNAME/manga-directory/main/sites/english.json',
        'https://raw.githubusercontent.com/YOUR_USERNAME/manga-directory/main/sites/japanese.json',
        'https://raw.githubusercontent.com/YOUR_USERNAME/manga-directory/main/sites/korean.json'
    ]
};
```

Namun, jika website dan data berada di repository yang sama, path relatif seperti `sites/indonesia.json` sudah cukup dan lebih direkomendasikan.

### Langkah 3: Verifikasi

- GitHub Pages akan mem-build dalam beberapa menit
- Kunjungi `https://yourusername.github.io/manga-directory`
- Pastikan data muncul dan filter berfungsi

---

## 🔧 Menambahkan Validasi Baru pada GitHub Actions

File validasi berada di `.github/workflows/validate.yml`. Anda dapat menambahkan aturan validasi baru dengan mengedit file `validate-structure.js` yang di-generate dalam workflow.

### Contoh: Menambahkan Validasi Domain yang Dilarang

Tambahkan kode berikut di dalam fungsi `validateFile`:

```javascript
const BLOCKED_DOMAINS = ['example-bad-site.com', 'spam-site.net'];

if (site.url) {
  const urlCheck = validateUrl(site.url);
  if (urlCheck.valid) {
    if (BLOCKED_DOMAINS.includes(urlCheck.domain)) {
      errors.push(`${prefix}: Domain "${urlCheck.domain}" is blocked.`);
    }
  }
}
```

### Contoh: Menambahkan Validasi Genre Wajib

```javascript
const REQUIRED_GENRES = ['Action', 'Romance', 'Comedy', 'Drama', 'Fantasy'];

if (site.genres && site.genres.length > 0) {
  const hasValidGenre = site.genres.some(g => REQUIRED_GENRES.includes(g));
  if (!hasValidGenre) {
    warnings.push(`${prefix}: Site does not have any standard genre.`);
  }
}
```

### Contoh: Menambahkan Validasi URL Harus HTTPS

```javascript
function validateUrl(url) {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:') {
      return { valid: false, error: 'URL must use HTTPS protocol' };
    }
    return { valid: true, domain: parsed.hostname.toLowerCase() };
  } catch (e) {
    return { valid: false, error: 'Invalid URL format' };
  }
}
```

### Contoh: Menambahkan Check SSL Certificate

```javascript
const tls = require('tls');

async function checkSSL(url) {
  return new Promise((resolve) => {
    const parsed = new URL(url);
    const options = {
      host: parsed.hostname,
      port: 443,
      servername: parsed.hostname,
      timeout: 5000
    };

    const socket = tls.connect(options, () => {
      const cert = socket.getPeerCertificate();
      const valid = cert && cert.valid_to && new Date(cert.valid_to) > new Date();
      socket.end();
      resolve({ valid, expires: cert.valid_to });
    });

    socket.on('error', () => resolve({ valid: false }));
    socket.on('timeout', () => { socket.destroy(); resolve({ valid: false }); });
  });
}

// Gunakan dalam validasi
if (site.url && site.url.startsWith('https')) {
  const ssl = await checkSSL(site.url);
  if (!ssl.valid) {
    warnings.push(`${prefix}: SSL certificate issue or expired.`);
  }
}
```

### Struktur Workflow

```yaml
name: Validate Site Data

on:
  pull_request:
    paths:
      - 'sites/**.json'
  push:
    branches: [ main ]
    paths:
      - 'sites/**.json'

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - name: Validate JSON
        run: node validate-script.js
```

---

## 🛠️ Teknologi yang Digunakan

- **HTML5** - Struktur semantic
- **CSS3** - Custom properties, Grid, Flexbox, Animations
- **Vanilla JavaScript** - ES6+, Fetch API, No framework
- **GitHub Pages** - Static hosting gratis
- **GitHub Actions** - CI/CD untuk validasi otomatis
- **JSON** - Format data tanpa database

---

## 🤝 Berkontribusi

Kontribusi sangat diterima! Beberapa cara untuk berkontribusi:

1. **Menambahkan Situs** - Tambahkan situs manga baru melalui Pull Request
2. **Memperbarui Data** - Update status situs yang offline atau URL yang berubah
3. **Meningkatkan Kode** - Kirim PR untuk bug fix atau fitur baru
4. **Menerjemahkan** - Bantu terjemahkan dokumentasi ke bahasa lain
5. **Melaporkan Bug** - Buat Issue jika menemukan masalah

### Panduan Kontribusi

- Pastikan JSON valid sebelum membuat PR
- Jangan menambahkan situs yang sudah ada (cek duplikat)
- Pastikan URL valid dan dapat diakses
- Gunakan bahasa Indonesia atau Inggris untuk deskripsi
- Ikuti format data yang sudah ditentukan

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah [MIT License](LICENSE).

---

## 🙏 Kredit

- Data dikelola oleh komunitas manga lovers
- Desain terinspirasi dari dashboard modern dan dark mode UI trends
- Dibuat dengan ❤️ untuk komunitas pembaca manga

---

<div align="center">
  <p><strong>⭐ Star repository ini jika Anda merasa terbantu!</strong></p>
  <p>Made with 📚 by the community</p>
</div>
