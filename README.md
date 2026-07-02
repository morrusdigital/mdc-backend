# MDC Backend API

Repositori ini adalah backend API untuk project **Morrus Digital Connecting (MDC)**, dibangun menggunakan **Express.js**, **TypeScript**, **Prisma ORM**, dan didokumentasikan dengan **Swagger UI**.

---

## 🚀 Teknologi yang Digunakan

- **Runtime & Language**: Node.js (v18+) & TypeScript
- **Framework**: Express.js
- **Database & ORM**: PostgreSQL & Prisma ORM
- **Security & Logging**: Helmet & Morgan
- **Dokumentasi API**: Swagger UI (via `swagger-ui-express`)

---

## 🛠️ Prasyarat (Prerequisites)

Pastikan Anda telah menginstal tools berikut di lokal Anda:
- [Node.js](https://nodejs.org/) (versi LTS direkomendasikan)
- [PostgreSQL](https://www.postgresql.org/) (database server sedang berjalan)

---

## 📦 Setup & Instalasi Project

Ikuti langkah-langkah di bawah ini untuk menjalankan project ini di komputer lokal Anda:

### 1. Clone Repositori
```bash
git clone https://github.com/morrusdigital/mdc-backend.git
cd mdc-backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Konfigurasi Environment Variables
Salin berkas `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```
Buka file `.env` yang baru dibuat, lalu sesuaikan nilai variabel berikut dengan pengaturan database PostgreSQL lokal Anda:
```env
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_USER=username_database_anda
DB_PASSWORD=password_database_anda
DB_NAME=nama_database_anda

DATABASE_URL="postgresql://username_database_anda:password_database_anda@localhost:5432/nama_database_anda?schema=public"
```

### 4. Setup Database & Prisma
Jalankan migrasi database untuk menyinkronkan schema database lokal Anda dan mengenerate Prisma Client:
```bash
# Menjalankan migrasi database
npx prisma migrate dev --name init

# Generate Prisma Client
npx prisma generate
```

---

## 🏃 Menjalankan Aplikasi

Berikut adalah perintah npm yang tersedia:

- **Mode Development (Watch Mode)**:
  Menjalankan aplikasi secara lokal dengan reload otomatis jika ada perubahan kode menggunakan `tsx`.
  ```bash
  npm run dev
  ```

- **Build untuk Production**:
  Mengompilasi file TypeScript (`.ts`) menjadi JavaScript (`.js`) di dalam folder `dist/`.
  ```bash
  npm run build
  ```

- **Menjalankan Hasil Build (Production)**:
  Menjalankan aplikasi dari kode terkompilasi (`dist/server.js`).
  ```bash
  npm run start
  ```

---

## 📄 Dokumentasi API (Swagger)

Aplikasi ini sudah terintegrasi dengan Swagger UI untuk dokumentasi API yang interaktif.

- **URL Swagger**: Halaman dokumentasi dapat diakses secara lokal di **`http://localhost:3000/api-docs`** saat server dev sedang berjalan.
- **Konfigurasi API**: Spesifikasi OpenAPI didefinisikan secara statis pada berkas [src/swagger.json](src/swagger.json).
- **Menambah Endpoint Baru**: Jika Anda membuat API endpoint baru, silakan update spesifikasi path, parameter, dan skema response di dalam file `src/swagger.json` agar dokumentasi tetap mutakhir.
