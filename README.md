# 📝 Quiz App – Technical Test

Aplikasi web **Quiz App** yang memungkinkan pengguna login, mengerjakan quiz berbatas waktu, menyimpan jawaban, dan melihat riwayat hasil quiz.

Aplikasi dapat dijalankan secara **local** maupun **deploy**, dengan seluruh fitur inti telah berfungsi.

---

## 1️⃣ Menjalankan Project

### Prasyarat

* Node.js ≥ 18
* npm / yarn / pnpm
* Backend API aktif

### Menjalankan Secara Local

```bash
npm install
npm run dev
```

Akses aplikasi melalui:

```
http://localhost:3000
```

---

## 2️⃣ Struktur Folder

````bash
MINI-QUIZ/
├── .next/                  # Build output Next.js
├── node_modules/
├── public/                 # Static assets (image, lottie json, dll)
│
├── src/
│   ├── app/                # Next.js App Router (routing & layout)
│   │   ├── (auth)/         # Route group autentikasi (login, register)
│   │   ├── (protected)/    # Route group halaman terproteksi (dashboard, quiz, history)
│   │   ├── api/            # API Routes 
│   │   └── layout.tsx      # Root layout aplikasi
│   │
│   ├── components/         # Reusable UI components
│   │   ├── common/         # Komponen umum (loading, empty state, dll)
│   │   ├── layout/         # Komponen layout (sidebar, header)
│   │   ├── quiz/           # Komponen khusus fitur quiz
│   │   └── ui/             # UI components berbasis shadcn/ui
│   │
│   ├── context/            # Global state menggunakan React Context
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Helper & utilities
│   │   └── helper/         # Helper (localStorage, formatter, dll)
│   │
│   ├── schema/             # Schema & validation
│   ├── types/              # TypeScript type definitions
│   └── proxy.ts            # Sebagai middleware frontend
│
├── .env
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── tsconfig.json
└── README.md
````

---

## 3️⃣ Konfigurasi Environment

Buat file `.env` di root project:

```env
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_SITE_URL=your_base_url
```

### Keterangan Environment

| Variable                | Deskripsi                |
| ----------------------- | ------------------------ |
| NEXT_PUBLIC_API_URL     | Base URL backend API     |
| NEXT_PUBLIC_SITE_URL    | Base URL frontend        |

---

## 4️⃣ Keputusan Teknis Penting

### 🔐 Autentikasi

- Menggunakan **JWT-based authentication** sesuai spesifikasi backend.
- Saat login berhasil, backend mengirimkan **access token** dan **refresh token** melalui **HTTP-only cookie**.
- Token tidak dapat diakses oleh JavaScript sehingga lebih aman dari serangan **XSS**.
- **Next.js Middleware** digunakan sebagai route guard untuk:
  - Mengecek status autentikasi berdasarkan cookie
  - Mengatur akses dan redirect halaman terproteksi
- Request data ke backend dilakukan melalui **Next.js API Routes** sebagai proxy.
- Validasi autentikasi dilakukan di **server side**, baik melalui **middleware** maupun **API/backend** sebagai single source of truth.



### 🧠 State Management

* **React Context** digunakan untuk menyimpan data quiz aktif (`activeQuiz`)
* Local state untuk kebutuhan UI
* Jawaban quiz disimpan sementara di **localStorage** agar tidak hilang saat reload

### ⏱️ Manajemen Quiz & Timer

* Validasi waktu quiz dilakukan di client
* Jika waktu quiz habis:

  * Jawaban otomatis disubmit
  * Data localStorage dibersihkan
  * User diarahkan ke halaman riwayat

### 🧭 Routing

* Menggunakan **Next.js App Router**
* Navigasi client-side dengan `useRouter`
* Deteksi halaman aktif menggunakan `usePathname`

### 🎨 UI & UX

* Tailwind CSS
* shadcn/ui
* react-toastify untuk notifikasi global
* lottie-react untuk animasi

---

