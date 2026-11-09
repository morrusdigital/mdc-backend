# Panduan Kontribusi MDC Backend

## Ruang Lingkup

Repository ini menyediakan API untuk website publik dan CMS MDC. Tidak ada UI di repository ini.

## Teknologi dan Pola Implementasi

- Gunakan Express 5, TypeScript, Prisma, PostgreSQL, Zod, dan middleware yang sudah tersedia.
- Pertahankan pemisahan route, controller, schema/validasi, helper, dan use-case pada masing-masing module di `src/modules`. Route mengatur wiring, controller menangani HTTP, dan use-case menangani aturan bisnis.
- Akses database menggunakan Prisma melalui konfigurasi yang ada. Jangan menaruh query database di route atau mencampur aturan bisnis ke middleware HTTP tanpa kebutuhan.
- Validasi seluruh input dari boundary HTTP dengan schema yang sesuai. Jangan mempercayai body, params, query, file, atau identitas pengguna dari klien.
- Gunakan format response dan `AppError`/error middleware yang sudah ada. Jangan mengirim stack trace, query, secret, token, atau detail internal kepada klien.
- Endpoint admin harus menggunakan middleware authorization dan memeriksa permission sesuai tindakan; autentikasi saja tidak otomatis berarti berwenang.

## Schema, Migrasi, dan Dokumentasi

- Perubahan model PostgreSQL dilakukan melalui `prisma/schema.prisma` dan migrasi Prisma yang dapat direproduksi. Jangan mengubah database produksi secara manual tanpa migrasi.
- Pertimbangkan data lama, constraint, nullability, index, relasi, dan rollback sebelum mengubah schema.
- Setiap endpoint atau perubahan kontrak harus memperbarui `src/swagger.json` agar dokumentasi API tetap dapat dikonsumsi frontend.
- Pertahankan pemisahan route publik dan admin serta pola modul yang sudah ada.

## Verifikasi

- Jalankan `npm run build` untuk memeriksa kompilasi TypeScript.
- Jika schema Prisma berubah, jalankan `npm run prisma:generate` dan verifikasi migrasi dengan `npm run prisma:migrate` pada database pengembangan yang sesuai.
- Uji response sukses, validasi 4xx, authorization, error 5xx, dan dokumentasi Swagger untuk endpoint yang berubah.
