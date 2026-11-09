# Standar Desain Kontrak API MDC

Repository ini tidak memiliki UI. Dokumen ini bukan panduan visual; standar desain diterapkan pada kontrak API yang digunakan website dan CMS.

## Acceptance Criteria Kontrak

- Endpoint memiliki penamaan, method, path, status HTTP, bentuk response, dan bentuk error yang konsisten dengan API yang sudah ada.
- Request divalidasi di boundary dengan pesan yang aman dan dapat ditindaklanjuti. Input tidak valid tidak boleh mencapai use-case atau database.
- Response mudah dikonsumsi frontend: struktur stabil, field yang relevan, pagination/filter yang terdokumentasi, dan tidak ada variasi bentuk tanpa alasan.
- Endpoint admin membedakan autentikasi dan authorization; setiap operasi memeriksa permission yang tepat.
- Data publik hanya mengembalikan field yang memang diperlukan. Jangan mengekspos password hash, token, secret, audit detail internal, query, stack trace, atau informasi sensitif lain.
- Error menggunakan status dan format yang konsisten, tanpa membocorkan detail internal; logging internal boleh lebih detail daripada response publik.
- Perubahan schema mempertahankan integritas relasi, constraint, dan kompatibilitas data yang sudah ada.
- Semua endpoint baru atau perubahan kontrak tercermin di `src/swagger.json` dan dapat dipahami oleh konsumen frontend.

## Pemeriksaan Kontrak

- Cocokkan implementasi route, schema, controller, use-case, response, dan Swagger.
- Verifikasi kasus sukses, input invalid, tanpa autentikasi, tanpa permission, resource tidak ditemukan, konflik, dan kegagalan internal.
