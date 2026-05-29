# TechCare IT Services

Website đặt lịch dịch vụ IT tích hợp chatbot tư vấn — **Next.js 16**, **Tailwind CSS 4**, **Supabase**, deploy **Vercel**.

## Tính năng

- Trang công khai tiếng Việt: dịch vụ, bảng giá, đặt lịch, liên hệ/lead, chatbot
- Dashboard admin: lịch hẹn, khách hàng, dịch vụ
- **Demo mode**: chạy đầy đủ UI khi chưa có biến môi trường Supabase
- **Production mode**: Supabase Auth + RLS + API bảo vệ admin

## Chạy local

```bash
npm install
npm run dev
```

```bash
npm run lint
npm run build
```

Mở [http://localhost:3000](http://localhost:3000).

---

## Chế độ Demo vs Production

| | **Demo mode** | **Production mode** |
|---|---------------|---------------------|
| Kích hoạt khi | Thiếu `NEXT_PUBLIC_SUPABASE_URL` hoặc `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Đủ 2 biến Supabase public |
| Dữ liệu | `lib/demo-data.ts` + bộ nhớ tạm | Supabase PostgreSQL |
| Đăng nhập admin | `admin@techcare.vn` / `admin` | Supabase Auth + `admin_profiles` |
| Cookie admin | `demo-session-token` (httpOnly) | JWT access token (httpOnly) |
| RLS | Không áp dụng | Áp dụng theo `supabase/schema.sql` |

Form công khai (đặt lịch, liên hệ, chatbot) vẫn hoạt động ở demo mode và hiển thị thông báo thành công.

---

## Biến môi trường

Tạo `.env.local` ở thư mục gốc:

```env
# Bắt buộc cho production (client + server đọc URL/anon)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Khuyến nghị production — CHỈ dùng server-side (API routes, middleware)
# Không import vào component client ('use client')
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Tùy chọn — Gemini AI chatbot (server-side only)
# Nếu không đặt, chatbot sẽ dùng chế độ rule-based tự động
GEMINI_API_KEY=your_gemini_api_key_here
```

> Không commit `.env.local`. Không bao giờ đặt `SUPABASE_SERVICE_ROLE_KEY` vào biến `NEXT_PUBLIC_*`.

---

## Supabase setup (production)

### Bước 1: Tạo project

1. [supabase.com](https://supabase.com) → New project  
2. Lưu **Project URL** và **anon public key** (Settings → API)

### Bước 2: Chạy SQL schema

File schema đầy đủ:

```
supabase/schema.sql
```

**Cách chạy:**

1. Supabase Dashboard → **SQL Editor** → **New query**
2. Copy toàn bộ nội dung `supabase/schema.sql`
3. **Run**

File này tạo:

- Bảng: `admin_profiles`, `services`, `customers`, `appointments`, `contact_leads`, `chat_sessions`, `chat_messages`
- Hàm `is_admin()`, trigger `updated_at`
- Index cho dashboard
- **RLS** trên tất cả bảng
- **Seed** dịch vụ + dữ liệu mẫu admin

### Bước 3: Tạo admin đầu tiên

1. **Authentication** → **Users** → **Add user**  
   - Email: `admin@techcare.vn`  
   - Password: (mật khẩu mạnh)

2. Copy **User UID** (UUID)

3. SQL Editor → chạy (thay UUID):

```sql
insert into public.admin_profiles (id, email, full_name, role)
values (
  'PASTE_AUTH_USER_UUID_HERE',
  'admin@techcare.vn',
  'Quản trị viên TechCare',
  'admin'
);
```

### Bước 4: Cấu hình env local / Vercel

Thêm 3 biến như mục [Biến môi trường](#biến-môi-trường), redeploy nếu trên Vercel.

### Bước 5: Đăng nhập

- URL: `/admin/login`  
- Dùng email/password vừa tạo trong Supabase Auth

---

## Row Level Security (tóm tắt)

| Bảng | Public (anon) | Admin (authenticated + `admin_profiles`) |
|------|----------------|------------------------------------------|
| `services` | SELECT (`is_active = true`) | Full CRUD |
| `appointments` | INSERT | SELECT, UPDATE, DELETE |
| `contact_leads` | INSERT | SELECT, UPDATE, DELETE |
| `chat_sessions` | INSERT, UPDATE | SELECT |
| `chat_messages` | INSERT | SELECT |
| `customers` | — | Full CRUD |
| `admin_profiles` | — | SELECT own / admin |

API admin (`GET /api/appointments`, v.v.) yêu cầu cookie `techcare_admin_session` hợp lệ.  
Server dùng `SUPABASE_SERVICE_ROLE_KEY` để đọc/ghi dashboard sau khi xác thực admin.

---

## Bảo mật admin

- **Middleware** (`middleware.ts`): chặn `/admin/*` (trừ `/admin/login`) nếu chưa đăng nhập
- **API** `requireAdmin()`: bảo vệ GET/PATCH admin
- **Login/Logout**: `POST /api/auth/login`, `POST /api/auth/logout` — cookie **httpOnly**
- **Demo login**: chỉ khi không có env Supabase public

---

## Routes

| Route | Mô tả |
|-------|--------|
| `/` | Trang chủ |
| `/services` | Dịch vụ |
| `/pricing` | Bảng giá |
| `/booking` | Đặt lịch |
| `/contact` | Liên hệ & lead |
| `/admin/login` | Đăng nhập admin |
| `/admin` | Dashboard |
| `/admin/appointments` | Lịch hẹn |
| `/admin/customers` | Khách hàng & lead |
| `/admin/services` | Dịch vụ |
| `/admin/chats` | Chatbot (ẩn khỏi sidebar) |

### API công khai

- `GET /api/services`
- `POST /api/appointments`
- `POST /api/contacts`
- `POST /api/chatbot`

### API admin (cần đăng nhập)

- `GET /api/appointments`, `PATCH /api/appointments/[id]`
- `GET /api/contacts`, `GET /api/customers`, `GET /api/chats`
- `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/session`

---

## Deploy Vercel

1. Push GitHub → Import Vercel  
2. Environment Variables: 3 biến Supabase + `GEMINI_API_KEY` (tùy chọn cho AI chatbot)  
3. Deploy  
4. (Tuỳ chọn) Custom domain + Cloudflare DNS/SSL

---

## Công nghệ

Next.js 16 · React 19 · Tailwind 4 · Supabase · Zod · Lucide · Gemini AI

Chi tiết nghiệp vụ: [`master.md`](./master.md)
