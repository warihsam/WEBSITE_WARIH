# WS FASHION

E-commerce fashion sederhana dengan React + Vite + Supabase.

## 1. Install

```bash
npm install
```

## 2. Environment

Salin `.env.example` menjadi `.env` lalu isi:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_SUPABASE_PUBLISHABLE_KEY
VITE_WHATSAPP_NUMBER=628XXXXXXXXXX
```

Jangan pernah memasukkan service role/secret key ke frontend.

## 3. Supabase

Jalankan isi `supabase/schema.sql` pada SQL Editor project WS-FASHION.

Lalu:
- buat bucket `product-images` sesuai policy pada SQL
- buat user admin melalui Authentication > Users
- jalankan SQL admin profile setelah user dibuat dengan mengganti UUID admin
- upload gambar produk ke Storage
- isi URL/path gambar pada tabel products

## 4. Jalankan

```bash
npm run dev
```

## 5. Build

```bash
npm run build
```

## 6. Vercel

Import repository ke Vercel, Root Directory jika repo hanya berisi app ini adalah root. Tambahkan Environment Variables yang sama dengan `.env`.
