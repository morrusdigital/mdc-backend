# BE: Tasking Backend MDC

## Objective

Jelaskan kemampuan API atau perubahan domain yang ingin dicapai, konsumen endpoint, dan hasil yang harus tersedia.

## Business Rules

- Cantumkan method, path, request, response, status HTTP, dan endpoint atau module terkait.
- Jelaskan aturan akses: publik/admin, autentikasi, role, permission, dan resource ownership bila ada.
- Sebutkan validasi body, params, query, file, aturan bisnis, error response, dan data sensitif yang harus disaring.
- Jelaskan dampak pada `prisma/schema.prisma`, PostgreSQL, migrasi, seed, data lama, dan relasi bila ada.
- Wajib menyebutkan pembaruan `src/swagger.json` untuk endpoint atau perubahan kontrak.

## Acceptance Criteria

- Route, controller, validasi, authorization, use-case, dan response mengikuti pola module yang ada.
- Kasus sukses, invalid input, unauthorized/forbidden, not found, conflict, dan error internal ditangani dengan aman.
- Schema/migrasi dapat diterapkan, tidak merusak data lama, dan kontrak Swagger sesuai implementasi.

## Testing

- Jalankan `npm run build`.
- Jika schema berubah, jalankan `npm run prisma:generate` dan verifikasi `npm run prisma:migrate` pada database pengembangan.
- Uji endpoint dengan akses valid dan invalid serta periksa response dan Swagger.
