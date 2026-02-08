# PLAN: Subdomain Event & Donasi IARK

## Konsep Utama

**Website Compro (ia-rk.com)** dan **Website Event (event.ia-rk.com)** TERPISAH, tapi **1 CMS Admin** yang sama.

| Domain | Fungsi | Target User |
|--------|--------|-------------|
| `ia-rk.com` | Company profile, tentang IARK, berita, dll | Publik |
| `event.ia-rk.com` | Registrasi event/kegiatan | Alumni yang mau daftar event |
| `donasi.ia-rk.com` | Portal donasi | Donatur |
| `ia-rk.com/admin` | CMS untuk kelola semua | Admin IARK |

---

## Arsitektur

```
┌─────────────────────────────────────────────────────────────────────┐
│                         FRONTEND (Public)                           │
├─────────────────────┬─────────────────────┬─────────────────────────┤
│   ia-rk.com         │  event.ia-rk.com    │   donasi.ia-rk.com      │
│   (Compro)          │  (Event Portal)     │   (Donasi Portal)       │
│                     │                     │                         │
│ • Homepage          │ • List events       │ • Landing donasi        │
│ • Tentang           │ • Detail event      │ • Checkout + Pakasir    │
│ • Berita/Cerita     │ • Form registrasi   │ • Success page          │
│ • Bidang            │ • My events         │ • Wall of fame          │
│ • Kontak            │                     │                         │
└─────────────────────┴─────────────────────┴─────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    ADMIN CMS (ia-rk.com/admin)                      │
│                         Satu Dashboard                              │
├─────────────────────────────────────────────────────────────────────┤
│ • Manage Events          • Manage Registrations                     │
│ • Manage Donations       • Manage Users                             │
│ • Manage Stories         • Manage Hero Slides                       │
│ • Manage Testimonials    • Dashboard Analytics                      │
└─────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                          BACKEND                                    │
├──────────────────────┬──────────────────────┬───────────────────────┤
│      Supabase        │      Pakasir         │      Sumopod          │
│   (DB + Auth)        │   (Payment)          │   (Email SMTP)        │
│                      │                      │                       │
│ • PostgreSQL         │ • QRIS               │ • Transactional       │
│ • Google OAuth       │ • Virtual Account    │ • Reminder emails     │
│ • Row Level Security │ • Webhook callback   │ • Confirmation        │
│ • Storage            │ • PayPal             │                       │
└──────────────────────┴──────────────────────┴───────────────────────┘
```

---

## Apa yang Berubah dari Existing?

### Existing Structure (Sekarang)
```
app/
├── admin/           # Tetap, akan di-extend
├── bidang/          # Pindah ke (compro)/bidang/
├── cerita/          # Pindah ke (compro)/cerita/
├── daftar/          # Pindah ke (compro)/daftar/
├── dashboard/       # Pindah ke (compro)/dashboard/
├── donasi/          # Tetap di app/donasi/ — jadi subdomain via middleware rewrite
├── kegiatan/        # Pindah ke (compro)/kegiatan/ (archive readonly)
├── masuk/           # Pindah ke (compro)/masuk/
├── tentang/         # Pindah ke (compro)/tentang/
├── page.tsx         # Pindah ke (compro)/page.tsx
├── template.tsx     # Pindah ke (compro)/template.tsx
└── layout.tsx       # Tetap (root layout, shared providers)
```

### New Structure (Setelah Update)

**PENTING**: `(compro)` pakai parentheses (route group, URL tidak berubah).
`event/` dan `donasi/` TANPA parentheses (regular folder, URL = /event/* dan /donasi/*).
Middleware rewrite subdomain ke path ini.

```
app/
├── (compro)/                  # Route group untuk ia-rk.com
│   ├── layout.tsx             # Layout compro (Header + Footer)
│   ├── template.tsx           # Page transition wrapper
│   ├── page.tsx               # Homepage
│   ├── tentang/
│   │   └── page.tsx
│   ├── bidang/
│   │   └── page.tsx
│   ├── cerita/
│   │   ├── page.tsx
│   │   └── [id]/
│   │       └── page.tsx
│   ├── kegiatan/              # Archive kegiatan (read-only, data dari activities)
│   │   └── page.tsx
│   ├── daftar/
│   │   └── page.tsx
│   ├── masuk/
│   │   └── page.tsx
│   └── dashboard/             # Member dashboard (protected)
│       ├── layout.tsx
│       ├── page.tsx
│       ├── profile/
│       ├── alumni/
│       ├── events/
│       └── stories/
│
├── event/                     # TANPA parentheses — URL /event/*
│   ├── layout.tsx             # Layout event portal (simplified header)
│   ├── page.tsx               # List upcoming events
│   ├── [slug]/
│   │   └── page.tsx           # Event detail + CTA daftar
│   ├── register/
│   │   └── [slug]/
│   │       └── page.tsx       # Form registrasi (Google + Guest)
│   └── my-events/
│       └── page.tsx           # Events yang sudah didaftar (protected)
│
├── donasi/                    # TANPA parentheses — URL /donasi/*
│   ├── layout.tsx             # Layout donasi portal (streamlined)
│   ├── page.tsx               # Landing donasi (extend existing)
│   ├── checkout/
│   │   └── page.tsx           # Pilih nominal + redirect Pakasir
│   ├── success/
│   │   └── page.tsx           # Thank you page
│   └── donors/
│       └── page.tsx           # Wall of fame
│
├── admin/                     # Tetap, di-extend
│   ├── layout.tsx             # Existing admin layout
│   ├── page.tsx               # Dashboard (extend dengan event + donasi stats)
│   ├── events/
│   │   ├── page.tsx           # Existing event management
│   │   └── [id]/
│   │       └── registrations/
│   │           └── page.tsx   # BARU: List peserta per event
│   ├── donations/
│   │   └── page.tsx           # BARU: List donasi masuk
│   └── ...existing...
│
├── api/
│   ├── webhooks/
│   │   └── pakasir/
│   │       └── route.ts       # BARU: Webhook callback dari Pakasir
│   └── ...existing...
│
├── auth/                      # Tetap
├── layout.tsx                 # Root layout (shared providers: Auth, Query, etc.)
└── globals.css
```

### Kenapa Struktur Ini?

| Keputusan | Alasan |
|-----------|--------|
| `(compro)` pakai route group | URL tetap sama (`/tentang`, `/bidang`, dll). Hanya organizational. Bisa punya layout sendiri (Header + Footer compro). |
| `event/` tanpa parentheses | Middleware rewrite `event.ia-rk.com/*` ke `/event/*`. Butuh URL segment `/event`. |
| `donasi/` tanpa parentheses | Same reason. `donasi.ia-rk.com/*` → `/donasi/*`. Existing folder tinggal extend. |
| Root layout minimal | Hanya shared providers (Auth, Query, fonts). Tiap domain punya layout sendiri. |

---

## Subdomain Routing

### middleware.ts (Updated)

```ts
import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  const host = request.headers.get('host') || '';
  const url = request.nextUrl.clone();

  // Subdomain detection
  const isEventSubdomain = host.startsWith('event.');
  const isDonasiSubdomain = host.startsWith('donasi.');

  // Redirect: ia-rk.com/event/* → event.ia-rk.com/*
  if (!isEventSubdomain && url.pathname.startsWith('/event')) {
    const eventUrl = new URL(url);
    eventUrl.host = host.replace(/^(www\.)?/, 'event.');
    eventUrl.pathname = url.pathname.replace(/^\/event/, '') || '/';
    return NextResponse.redirect(eventUrl, 301);
  }

  // Redirect: ia-rk.com/donasi/* → donasi.ia-rk.com/*
  if (!isDonasiSubdomain && url.pathname.startsWith('/donasi')) {
    const donasiUrl = new URL(url);
    donasiUrl.host = host.replace(/^(www\.)?/, 'donasi.');
    donasiUrl.pathname = url.pathname.replace(/^\/donasi/, '') || '/';
    return NextResponse.redirect(donasiUrl, 301);
  }

  // Rewrite subdomain ke internal path
  if (isEventSubdomain && !url.pathname.startsWith('/event')) {
    url.pathname = `/event${url.pathname}`;
    const response = NextResponse.rewrite(url);
    return response;
  }

  if (isDonasiSubdomain && !url.pathname.startsWith('/donasi')) {
    url.pathname = `/donasi${url.pathname}`;
    const response = NextResponse.rewrite(url);
    return response;
  }

  // Default: main domain + session update (existing auth logic)
  return await updateSession(request);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
```

**Perubahan dari plan lama:**
- Tambah redirect `ia-rk.com/donasi` → `donasi.ia-rk.com` (dan event juga)
- Session update tetap jalan untuk semua domain
- Existing auth protection (admin, dashboard) tetap works karena ada di `updateSession()`

### next.config.ts (Add rewrites for local dev)

```ts
const nextConfig = {
  // ...existing config (images, etc.)
  async rewrites() {
    return {
      beforeFiles: [
        // Local dev: event.localhost:3000 -> /event/*
        {
          source: '/:path*',
          has: [{ type: 'host', value: 'event.localhost' }],
          destination: '/event/:path*',
        },
        {
          source: '/:path*',
          has: [{ type: 'host', value: 'donasi.localhost' }],
          destination: '/donasi/:path*',
        },
      ],
    };
  },
};
```

**Local dev setup:**
Tambah di file hosts (`C:\Windows\System32\drivers\etc\hosts`):
```
127.0.0.1  event.localhost
127.0.0.1  donasi.localhost
```
Akses: `event.localhost:3000` dan `donasi.localhost:3000`

---

## Integrasi Pakasir (Payment Gateway)

### Flow Donasi

```
User pilih nominal donasi
        │
        ▼
Klik "Donasi Sekarang"
        │
        ▼
Generate order_id (DON-{timestamp}-{random})
Save ke Supabase dengan status 'pending'
        │
        ▼
Redirect ke Pakasir:
https://app.pakasir.com/pay/{slug}/{amount}?order_id={order_id}&redirect={success_url}
        │
        ▼
User bayar via QRIS/VA
        │
        ▼
Pakasir kirim webhook ke /api/webhooks/pakasir
        │
        ▼
Update status donasi ke 'completed'
Kirim email thank you via Sumopod
        │
        ▼
User redirect ke donasi.ia-rk.com/success?order_id={order_id}
```

### API Route: /api/webhooks/pakasir/route.ts

```ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  const body = await request.json();

  // Webhook payload dari Pakasir
  const { amount, order_id, project, status, payment_method, completed_at } = body;

  if (status !== 'completed') {
    return NextResponse.json({ received: true });
  }

  const supabase = await createClient();

  // Verify dan update donation
  const { data: donation, error } = await supabase
    .from('donations')
    .update({
      payment_status: 'paid',
      payment_method,
      paid_at: completed_at,
    })
    .eq('order_id', order_id)
    .eq('amount', amount)
    .select()
    .single();

  if (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }

  // TODO: Kirim email thank you via Sumopod
  // await sendDonationThankYou(donation.donor_email, donation.amount, donation.donor_name);

  return NextResponse.json({ success: true });
}
```

### Environment Variables (baru)

```env
# Pakasir
PAKASIR_PROJECT_SLUG=iark
PAKASIR_API_KEY=xxx
PAKASIR_WEBHOOK_SECRET=xxx

# Sumopod SMTP
SMTP_HOST=smtp.sumopod.com
SMTP_PORT=587
SMTP_USER=xxx
SMTP_PASS=xxx
SMTP_FROM=noreply@ia-rk.com

# Cloudflare Turnstile
NEXT_PUBLIC_TURNSTILE_SITE_KEY=xxx
TURNSTILE_SECRET_KEY=xxx
```

---

## Email via Sumopod SMTP

### lib/email/send.ts

```ts
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendEmail(to: string, subject: string, html: string) {
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject,
    html,
  });
}

// Specific email functions
export async function sendRegistrationConfirmation(email: string, eventName: string, eventDate: string) {
  await sendEmail(email, `Pendaftaran Berhasil - ${eventName}`, `
    <h1>Pendaftaran Berhasil!</h1>
    <p>Terima kasih telah mendaftar untuk <strong>${eventName}</strong>.</p>
    <p>Tanggal: ${eventDate}</p>
  `);
}

export async function sendDonationThankYou(email: string, amount: number, donorName: string) {
  await sendEmail(email, `Terima Kasih atas Donasi Anda`, `
    <h1>Terima Kasih, ${donorName}!</h1>
    <p>Donasi Anda sebesar <strong>Rp ${amount.toLocaleString('id-ID')}</strong> telah kami terima.</p>
    <p>Kontribusi Anda membantu kami membangun komunitas alumni yang lebih baik.</p>
  `);
}

export async function sendEventReminder(email: string, eventName: string, daysLeft: number) {
  await sendEmail(email, `${daysLeft} Hari Lagi - ${eventName}`, `
    <h1>${daysLeft} Hari Lagi!</h1>
    <p>Jangan lupa, acara <strong>${eventName}</strong> akan berlangsung dalam ${daysLeft} hari.</p>
  `);
}
```

---

## Database Schema (Migrations)

### 1. Extend events table

```sql
-- Add registration fields to events
ALTER TABLE events ADD COLUMN IF NOT EXISTS registration_enabled BOOLEAN DEFAULT true;
ALTER TABLE events ADD COLUMN IF NOT EXISTS max_participants INTEGER;
ALTER TABLE events ADD COLUMN IF NOT EXISTS registration_deadline TIMESTAMPTZ;
ALTER TABLE events ADD COLUMN IF NOT EXISTS event_type VARCHAR(50) DEFAULT 'offline';
ALTER TABLE events ADD COLUMN IF NOT EXISTS meeting_link TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS contact_person TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS contact_whatsapp TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS price BIGINT DEFAULT 0; -- 0 = gratis
```

### 2. Create/update event_registrations table

Note: `event_registrations` table sudah ada di existing schema tapi perlu di-extend.

```sql
-- Drop existing (kalau masih simple) dan buat ulang yang lengkap
-- ATAU alter existing table. Cek dulu existing columns.

CREATE TABLE IF NOT EXISTS event_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id), -- NULL jika guest

  -- Data peserta
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  angkatan INTEGER,
  asrama VARCHAR(100),
  organization VARCHAR(255),

  -- Status
  status VARCHAR(20) DEFAULT 'registered'
    CHECK (status IN ('registered', 'confirmed', 'cancelled', 'waitlisted')),
  payment_status VARCHAR(20) DEFAULT 'free'
    CHECK (payment_status IN ('free', 'pending', 'paid')),
  order_id VARCHAR(100), -- untuk event berbayar

  -- Metadata
  registered_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  reminder_h3_sent BOOLEAN DEFAULT false,
  reminder_h1_sent BOOLEAN DEFAULT false,
  attended BOOLEAN DEFAULT false,
  notes TEXT,

  UNIQUE(event_id, email)
);

CREATE TRIGGER event_registrations_updated_at
  BEFORE UPDATE ON event_registrations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX IF NOT EXISTS idx_reg_event ON event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_reg_status ON event_registrations(status);
```

### 3. Create donations table

```sql
CREATE TABLE IF NOT EXISTS donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id VARCHAR(100) UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id),

  -- Donor info
  donor_name VARCHAR(255) NOT NULL,
  donor_email VARCHAR(255) NOT NULL,
  donor_phone VARCHAR(20),
  is_anonymous BOOLEAN DEFAULT false,

  -- Donasi
  amount BIGINT NOT NULL,
  donation_type VARCHAR(20) DEFAULT 'onetime',
  tier VARCHAR(20),
  program VARCHAR(100),
  message TEXT,

  -- Payment
  payment_status VARCHAR(20) DEFAULT 'pending'
    CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  payment_method VARCHAR(50),
  paid_at TIMESTAMPTZ,
  webhook_processed_at TIMESTAMPTZ, -- idempotency: NULL = belum diproses

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_donation_status ON donations(payment_status);
CREATE INDEX IF NOT EXISTS idx_donation_date ON donations(created_at DESC);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER donations_updated_at
  BEFORE UPDATE ON donations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

---

## Auth Flow

### Registrasi Event (Google OAuth + Guest)

Event subdomain (event.ia-rk.com) support 2 mode registrasi:

1. **Login Google** → auto-fill data dari profile, simpan user_id
2. **Guest** → isi form manual, user_id = NULL

```tsx
// Simplified flow di event/register/[slug]/page.tsx

// Kalau sudah login:
// - Auto-fill nama, email dari session
// - Tampilkan form tambahan (phone, angkatan, asrama)
// - Submit langsung ke event_registrations

// Kalau belum login:
// - Tombol "Daftar dengan Google" → OAuth → redirect balik
// - Tombol "Daftar sebagai Tamu" → form manual lengkap
```

---

## Cron Job: Email Reminder (PHASE SELANJUTNYA)

> Note: Cron reminder ditunda. Phase awal fokus ke SMTP setup dulu
> (email konfirmasi registrasi & donasi). Cron reminder H-3/H-1
> akan diimplementasi setelah core flow stable.

### Rencana (untuk nanti):
- Vercel Cron (`vercel.json`) jalan tiap hari jam 8 pagi
- `/api/cron/reminder` cek events H-3 dan H-1
- Kirim email reminder ke semua peserta yang belum dikirim
- Butuh env var `CRON_SECRET` untuk security

---

## UI/UX Considerations

### Event Portal (event.ia-rk.com)
- Branding sama tapi lebih "event-focused"
- Header simplified (hanya: Home, My Events, Login)
- Hero menampilkan featured/upcoming event
- Cards dengan countdown timer
- Flow: Browse events → Lihat detail → Daftar

### Donasi Portal (donasi.ia-rk.com)
- Extend existing `/donasi` page (DonasiPageSection.tsx 699 lines)
- Tambah sub-pages: checkout, success, donors
- Impact metrics prominent
- Trust badges (secure payment, transparent)

### Shared Design Tokens
- Warna utama: iark-red (#E21C24), iark-blue (#1E40AF), iark-yellow (#FBBF24)
- Font: Geist Sans (sudah di root layout)
- Animasi: framer-motion (sudah installed)

---

## Security

### 1. Webhook Signature Validation (KRITIS)

Pakasir webhook HARUS divalidasi supaya gak bisa di-fake.

```ts
// api/webhooks/pakasir/route.ts
import crypto from 'crypto';

function verifyWebhookSignature(payload: string, signature: string): boolean {
  const expected = crypto
    .createHmac('sha256', process.env.PAKASIR_WEBHOOK_SECRET!)
    .update(payload)
    .digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expected)
  );
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get('x-pakasir-signature') || '';

  if (!verifyWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  const body = JSON.parse(rawBody);
  // ... proses webhook
}
```

Env var baru: `PAKASIR_WEBHOOK_SECRET`

### 2. Row Level Security (RLS) — Tabel Baru

```sql
-- event_registrations: user hanya bisa lihat registrasi sendiri
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own registrations"
  ON event_registrations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own registrations"
  ON event_registrations FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL); -- NULL = guest

CREATE POLICY "Admins can do everything"
  ON event_registrations FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- donations: user hanya bisa lihat donasi sendiri
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own donations"
  ON donations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can insert donations"
  ON donations FOR INSERT
  WITH CHECK (true); -- donasi bisa tanpa login

CREATE POLICY "Admins can do everything"
  ON donations FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Public read untuk wall of fame (donors yang non-anonymous)
CREATE POLICY "Public can view non-anonymous donations"
  ON donations FOR SELECT
  USING (is_anonymous = false AND payment_status = 'paid');
```

### 3. Subdomain Isolation

Middleware HARUS block akses admin/dashboard dari subdomain:

```ts
// Di middleware.ts
if (isEventSubdomain || isDonasiSubdomain) {
  // Block admin & dashboard routes dari subdomain
  if (url.pathname.startsWith('/admin') || url.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/', request.url));
  }
}
```

### 4. Anti-Spam: Cloudflare Turnstile

Untuk form registrasi (guest mode) dan form donasi:

```
npm install @marsidev/react-turnstile
```

Env vars:
```env
NEXT_PUBLIC_TURNSTILE_SITE_KEY=xxx
TURNSTILE_SECRET_KEY=xxx
```

Flow:
1. Client: render Turnstile widget di form
2. Client: submit form + turnstile token
3. Server: verify token via Cloudflare API sebelum proses
4. Reject kalau token invalid

```ts
// lib/turnstile.ts — server-side verification
export async function verifyTurnstile(token: string): Promise<boolean> {
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      secret: process.env.TURNSTILE_SECRET_KEY,
      response: token,
    }),
  });
  const data = await res.json();
  return data.success === true;
}
```

Diterapkan pada:
- Guest registration form (`event/register/[slug]/`)
- Donation checkout form (`donasi/checkout/`)

### 5. Input Validation (Server-Side)

Semua form submission HARUS divalidasi di server, bukan cuma client:

```ts
// lib/validation.ts — contoh dengan zod atau manual
// Validate: email format, phone format, amount range, string length
// Sanitize: strip HTML tags, trim whitespace
// Reject: suspicious patterns, SQL injection attempts
```

Supabase RLS + server-side validation = double protection.

### 6. Webhook Idempotency (KRITIS)

Pakasir bisa kirim webhook yang sama 2x (network retry, timeout, dll).
Tanpa idempotency, donasi bisa di-update 2x dan kirim 2 email thank you.

**Solusi**: Tambah kolom `webhook_processed_at` di donations table + check before processing.

```ts
// api/webhooks/pakasir/route.ts — idempotency check
export async function POST(request: NextRequest) {
  // ... signature validation ...

  const { order_id, amount, status, payment_method, completed_at } = body;

  if (status !== 'completed') {
    return NextResponse.json({ received: true });
  }

  const supabase = await createAdminClient(); // bypass RLS untuk webhook

  // Check apakah webhook sudah pernah diproses
  const { data: existing } = await supabase
    .from('donations')
    .select('id, payment_status, webhook_processed_at')
    .eq('order_id', order_id)
    .single();

  if (!existing) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }

  // IDEMPOTENCY: kalau sudah pernah diproses, return 200 (jangan proses ulang)
  if (existing.webhook_processed_at) {
    return NextResponse.json({ success: true, message: 'Already processed' });
  }

  // Update donasi + set webhook_processed_at (atomic)
  const { error } = await supabase
    .from('donations')
    .update({
      payment_status: 'paid',
      payment_method,
      paid_at: completed_at,
      webhook_processed_at: new Date().toISOString(),
    })
    .eq('order_id', order_id)
    .eq('amount', amount)
    .is('webhook_processed_at', null); // double-check: hanya update kalau belum diproses

  if (error) {
    console.error('Webhook update error:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }

  // Kirim email (setelah DB update sukses)
  // await sendDonationThankYou(...);

  return NextResponse.json({ success: true });
}
```

Kolom tambahan di migrations:
```sql
ALTER TABLE donations ADD COLUMN IF NOT EXISTS webhook_processed_at TIMESTAMPTZ;
```

### 7. Race Condition: Event Registration (KRITIS)

Problem: 2 orang daftar bersamaan di event yang tinggal 1 slot → oversell.

**Solusi**: Database-level constraint + atomic check-and-insert.

```sql
-- Function untuk registrasi dengan capacity check (atomic)
CREATE OR REPLACE FUNCTION register_for_event(
  p_event_id UUID,
  p_user_id UUID,
  p_full_name VARCHAR,
  p_email VARCHAR,
  p_phone VARCHAR DEFAULT NULL,
  p_angkatan INTEGER DEFAULT NULL,
  p_asrama VARCHAR DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
  v_max INTEGER;
  v_current INTEGER;
  v_reg_id UUID;
BEGIN
  -- Lock the event row to prevent concurrent reads
  SELECT max_participants INTO v_max
  FROM events
  WHERE id = p_event_id
  FOR UPDATE;

  -- NULL max_participants = unlimited
  IF v_max IS NOT NULL THEN
    SELECT COUNT(*) INTO v_current
    FROM event_registrations
    WHERE event_id = p_event_id AND status != 'cancelled';

    IF v_current >= v_max THEN
      RAISE EXCEPTION 'Event is full';
    END IF;
  END IF;

  -- Insert registration
  INSERT INTO event_registrations (event_id, user_id, full_name, email, phone, angkatan, asrama)
  VALUES (p_event_id, p_user_id, p_full_name, p_email, p_phone, p_angkatan, p_asrama)
  RETURNING id INTO v_reg_id;

  RETURN v_reg_id;
END;
$$ LANGUAGE plpgsql;
```

Dipanggil dari app via Supabase RPC:
```ts
const { data, error } = await supabase.rpc('register_for_event', {
  p_event_id: eventId,
  p_user_id: userId,
  p_full_name: formData.fullName,
  p_email: formData.email,
  // ...
});

if (error?.message === 'Event is full') {
  // Tampilkan pesan "Event sudah penuh"
}
```

`FOR UPDATE` lock di row event memastikan hanya 1 transaksi bisa check+insert pada satu waktu. Gak bisa oversell.

### 8. Security Headers

Tambah di `next.config.ts`:

```ts
async headers() {
  return [
    {
      source: '/(.*)',
      headers: [
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
      ],
    },
  ];
},
```

---

## Performance

### 1. Rendering Strategy per Page

| Page | Strategy | Alasan |
|------|----------|--------|
| `event/page.tsx` (list) | ISR (revalidate: 60) | Data berubah tiap ada event baru, tapi gak realtime |
| `event/[slug]/page.tsx` (detail) | ISR (revalidate: 60) | Sama, plus countdown dihitung client-side |
| `event/register/[slug]/` | Dynamic (SSR) | Perlu cek auth + kapasitas realtime |
| `event/my-events/` | Dynamic (SSR) | Per-user data |
| `donasi/page.tsx` (landing) | ISR (revalidate: 300) | Jarang berubah |
| `donasi/checkout/` | Dynamic (SSR) | Form interaktif |
| `donasi/success/` | Dynamic (SSR) | Per-transaction data |
| `donasi/donors/` | ISR (revalidate: 120) | Wall of fame, update tiap ada donasi baru |
| Compro pages | ISR (revalidate: 300) | Konten statis, jarang berubah |

### 2. Caching Strategy (React Query)

```ts
// Extend lib/queries/index.ts
export const staleTime = {
  static: 5 * 60 * 1000,        // 5 min — hero slides, testimonials
  semiDynamic: 1 * 60 * 1000,   // 1 min — event list, stories
  dynamic: 0,                    // always fresh — registrations, donations
  realtime: 10 * 1000,           // 10 sec — kapasitas event
  long: 15 * 60 * 1000,         // 15 min — donasi landing, donors wall
};
```

### 3. Code Splitting per Subdomain

Next.js App Router otomatis code-split per route. Tapi perlu pastiin:
- `event/layout.tsx` TIDAK import Header/Footer compro yang berat
- `donasi/layout.tsx` TIDAK import komponen event
- Shared utilities (Supabase client, auth) di-share via root layout — ini OK karena tree-shaked

### 4. Image Optimization

```tsx
// Semua gambar event/donasi pakai Next/Image
import Image from 'next/image';

// Supabase Storage with transform (resize on-the-fly)
const imageUrl = supabase.storage
  .from('events')
  .getPublicUrl('image.jpg', {
    transform: { width: 800, height: 400, resize: 'cover' }
  });
```

Remote patterns udah di-config untuk `*.supabase.co` (existing).

### 5. Database Query Optimization

```sql
-- Composite index untuk query yang sering
CREATE INDEX IF NOT EXISTS idx_events_active_date
  ON events(is_live, date DESC)
  WHERE is_live = true;

-- Untuk donors wall of fame
CREATE INDEX IF NOT EXISTS idx_donations_public
  ON donations(payment_status, is_anonymous, created_at DESC)
  WHERE payment_status = 'paid' AND is_anonymous = false;

-- Count registrations tanpa full scan
CREATE INDEX IF NOT EXISTS idx_reg_event_status
  ON event_registrations(event_id, status);
```

### 6. Middleware Performance

Middleware jalan di Edge — harus cepat:
- Host detection: string comparison, sangat cepat
- Rewrite/redirect: single operation
- Session update: existing, sudah optimized
- JANGAN tambah DB call di middleware

---

## Error Handling (KRITIS)

### 1. Error Boundaries per Route Group

Setiap route group HARUS punya `error.tsx` dan `not-found.tsx`:

```
app/
├── (compro)/
│   ├── error.tsx          # Error page untuk compro
│   ├── not-found.tsx      # 404 untuk compro
│   └── ...
├── event/
│   ├── error.tsx          # Error page untuk event portal
│   ├── not-found.tsx      # 404 untuk event (misal: event gak ditemukan)
│   └── ...
├── donasi/
│   ├── error.tsx          # Error page untuk donasi portal
│   ├── not-found.tsx      # 404 untuk donasi
│   └── ...
└── global-error.tsx       # Fallback error untuk root layout
```

Setiap error page:
- Tampilkan pesan user-friendly (bukan stack trace)
- Tombol "Coba Lagi" (reset error boundary)
- Link balik ke homepage domain yang sesuai
- Log error ke console (dan nanti ke monitoring service)

### 2. API Error Response Format

Semua API routes harus return format konsisten:

```ts
// Success
{ success: true, data: { ... } }

// Error
{ success: false, error: { code: 'EVENT_FULL', message: 'Event sudah penuh' } }
```

Error codes yang dipakai:
| Code | Meaning |
|------|---------|
| `VALIDATION_ERROR` | Input tidak valid |
| `EVENT_FULL` | Kapasitas event habis |
| `EVENT_CLOSED` | Registrasi sudah ditutup |
| `ALREADY_REGISTERED` | Email sudah terdaftar di event ini |
| `TURNSTILE_FAILED` | Captcha verification gagal |
| `WEBHOOK_INVALID` | Webhook signature tidak valid |
| `ORDER_NOT_FOUND` | Order ID tidak ditemukan |
| `INTERNAL_ERROR` | Server error (jangan expose detail) |

### 3. Graceful Failure pada Email

Email gagal kirim TIDAK boleh gagalkan seluruh flow:

```ts
// Di webhook handler / registration handler
try {
  await sendDonationThankYou(email, amount, name);
} catch (emailError) {
  // Log error tapi JANGAN throw — payment sudah sukses
  console.error('Failed to send thank you email:', emailError);
  // Nanti bisa retry via admin CMS atau queue
}
```

Prinsip: **Payment/registration = source of truth**. Email = best effort.

### 4. Double Submit Prevention

Prevent user klik tombol "Daftar" atau "Donasi" 2x:

```tsx
// Client-side: disable button setelah klik
const [isSubmitting, setIsSubmitting] = useState(false);

const handleSubmit = async () => {
  if (isSubmitting) return;
  setIsSubmitting(true);
  try {
    await submitRegistration(formData);
  } finally {
    setIsSubmitting(false);
  }
};
```

Server-side: UNIQUE constraint `(event_id, email)` di DB handle duplicate insert.

---

## Testing Strategy (KRITIS)

### Tooling

```
vitest          — Unit tests + integration tests (fast, ESM-native)
@testing-library/react — Component testing
playwright      — E2E tests (optional, Phase 4)
```

### Test Priorities

Fokus test pada **critical paths** yang melibatkan uang atau data sensitif:

| Priority | What to Test | Type |
|----------|-------------|------|
| P0 | Webhook idempotency (gak proses 2x) | Unit |
| P0 | Webhook signature validation (reject fake) | Unit |
| P0 | Race condition registration (gak oversell) | Integration |
| P0 | Turnstile verification (reject invalid token) | Unit |
| P1 | Registration form validation (server-side) | Unit |
| P1 | Donation checkout flow (order_id generation) | Unit |
| P1 | Middleware subdomain routing | Unit |
| P1 | Middleware subdomain isolation (block admin) | Unit |
| P2 | Event list query + filtering | Integration |
| P2 | Auth flow (Google OAuth redirect) | E2E |
| P3 | UI components rendering | Component |

### Contoh Test Cases

```ts
// __tests__/api/webhook-pakasir.test.ts
describe('Pakasir Webhook', () => {
  it('should reject invalid signature', async () => { ... });
  it('should process valid payment', async () => { ... });
  it('should not process duplicate webhook (idempotency)', async () => { ... });
  it('should return 404 for unknown order_id', async () => { ... });
  it('should not fail if email sending fails', async () => { ... });
});

// __tests__/middleware.test.ts
describe('Subdomain Middleware', () => {
  it('should rewrite event.ia-rk.com to /event/*', () => { ... });
  it('should rewrite donasi.ia-rk.com to /donasi/*', () => { ... });
  it('should redirect ia-rk.com/donasi to donasi.ia-rk.com', () => { ... });
  it('should block /admin from event subdomain', () => { ... });
  it('should block /admin from donasi subdomain', () => { ... });
});

// __tests__/registration.test.ts
describe('Event Registration', () => {
  it('should reject registration when event is full', async () => { ... });
  it('should reject duplicate email for same event', async () => { ... });
  it('should reject invalid turnstile token', async () => { ... });
  it('should auto-fill data for logged-in user', async () => { ... });
});
```

### Kapan Test Ditulis?

- **Phase 1**: Setup vitest + test middleware routing + subdomain isolation
- **Phase 2**: Test registration flow (validation, race condition, idempotency)
- **Phase 3**: Test webhook handler (signature, idempotency, error handling)
- **Phase 4**: E2E tests (optional, kalau ada waktu)

---

## Implementation Checklist

### Phase 1: Foundation
- [ ] Move existing compro pages ke `(compro)/` route group
- [ ] Buat `(compro)/layout.tsx` (Header + Footer)
- [ ] Buat `(compro)/error.tsx` dan `(compro)/not-found.tsx`
- [ ] Buat `event/layout.tsx` (simplified header)
- [ ] Buat `event/error.tsx` dan `event/not-found.tsx`
- [ ] Extend `donasi/layout.tsx` (streamlined)
- [ ] Buat `donasi/error.tsx` dan `donasi/not-found.tsx`
- [ ] Buat `app/global-error.tsx` (fallback)
- [ ] Update root `layout.tsx` (providers only, no Header/Footer)
- [ ] Update `middleware.ts` untuk subdomain routing + redirect + isolation
- [ ] Update `next.config.ts` dengan rewrites + security headers
- [ ] Run database migrations (extend events, create donations, RLS, register_for_event function)
- [ ] Update Supabase types (`lib/supabase/types.ts`)
- [ ] Setup env variables (Pakasir, Sumopod, Turnstile)
- [ ] Install nodemailer, @marsidev/react-turnstile, vitest
- [ ] Setup `lib/email/send.ts`
- [ ] Setup `lib/turnstile.ts`
- [ ] Setup `lib/validation.ts` (shared server-side validation)
- [ ] Test: middleware routing + subdomain isolation

### Phase 2: Event Subdomain (event.ia-rk.com)
- [ ] `event/page.tsx` — List upcoming events dengan filter (ISR)
- [ ] `event/[slug]/page.tsx` — Event detail + countdown + CTA (ISR)
- [ ] `event/register/[slug]/page.tsx` — Form registrasi (Google + Guest + Turnstile)
- [ ] Registration via `register_for_event` RPC (race condition safe)
- [ ] Double submit prevention (client + server)
- [ ] `event/my-events/page.tsx` — Events yang sudah didaftar (SSR)
- [ ] Event query hooks (`lib/queries/events.ts` extend)
- [ ] Server-side validation untuk registration form
- [ ] Admin: `admin/events/[id]/registrations/page.tsx` — List peserta
- [ ] Email: Registration confirmation via Sumopod (graceful failure)
- [ ] Test: registration validation, race condition, Turnstile

### Phase 3: Donasi Subdomain (donasi.ia-rk.com)
- [ ] Extend `donasi/page.tsx` (existing DonasiPageSection, ISR)
- [ ] `donasi/checkout/page.tsx` — Form + Turnstile + redirect Pakasir
- [ ] `donasi/success/page.tsx` — Thank you page (SSR)
- [ ] `donasi/donors/page.tsx` — Wall of fame (ISR)
- [ ] `api/webhooks/pakasir/route.ts` — Webhook handler + signature + idempotency
- [ ] Admin: `admin/donations/page.tsx` — List donasi
- [ ] Email: Donation thank you via Sumopod (graceful failure)
- [ ] Test: webhook signature, idempotency, error handling

### Phase 4: Polish & Automation (nanti)
- [ ] Setup Vercel cron untuk email reminder
- [ ] Email reminder H-3 dan H-1
- [ ] E2E testing (Playwright)
- [ ] DNS setup untuk subdomain
- [ ] Performance audit (Lighthouse, bundle analysis)

---

## DNS Setup (Vercel)

Di Vercel dashboard:
1. Add domain `event.ia-rk.com` → point ke project yang sama
2. Add domain `donasi.ia-rk.com` → point ke project yang sama

Di DNS provider:
```
CNAME  event   cname.vercel-dns.com
CNAME  donasi  cname.vercel-dns.com
```

---

## Existing Code yang Terpengaruh

| File/Folder | Perubahan |
|-------------|-----------|
| `app/page.tsx` | Pindah ke `app/(compro)/page.tsx` |
| `app/template.tsx` | Pindah ke `app/(compro)/template.tsx` |
| `app/tentang/` | Pindah ke `app/(compro)/tentang/` |
| `app/bidang/` | Pindah ke `app/(compro)/bidang/` |
| `app/cerita/` | Pindah ke `app/(compro)/cerita/` |
| `app/kegiatan/` | Pindah ke `app/(compro)/kegiatan/` |
| `app/masuk/` | Pindah ke `app/(compro)/masuk/` |
| `app/daftar/` | Pindah ke `app/(compro)/daftar/` |
| `app/dashboard/` | Pindah ke `app/(compro)/dashboard/` |
| `app/donasi/page.tsx` | Tetap di tempat, extend dengan layout + sub-pages |
| `app/layout.tsx` | Simplify: providers only, Header/Footer pindah ke (compro)/layout |
| `middleware.ts` | Extend: subdomain routing + redirect logic |
| `next.config.ts` | Extend: rewrites untuk local dev |
| `lib/supabase/types.ts` | Extend: donations table types |
| `components/layout/Header.tsx` | Tetap, dipakai di (compro)/layout |
| `components/layout/Footer.tsx` | Tetap, dipakai di (compro)/layout |

**Yang TIDAK berubah:**
- `app/admin/` — tetap di root, di-extend
- `app/auth/` — tetap di root
- `app/api/` — tetap di root, ditambah webhooks
- Semua component imports (pakai `@/` alias, path tidak berubah)
- Supabase setup (client, server, middleware)
- AuthContext, QueryProvider, dll

---

## Cost Estimate

| Service | Tier | Cost |
|---------|------|------|
| Supabase | Free | $0 |
| Vercel | Hobby/Pro | $0-20/mo |
| Pakasir | Per transaction | ~0.7-1% |
| Sumopod | Free tier | $0 |
| **Total** | | **~$0-20/mo + tx fee** |

---

## Keputusan yang Sudah Final

| Pertanyaan | Jawaban |
|------------|---------|
| Data storage | Supabase (PostgreSQL) |
| Payment gateway | Pakasir (QRIS, VA, PayPal) |
| Registrasi login | Google OAuth + Guest option |
| Email service | Sumopod SMTP |
| Arsitektur | Compro & Event & Donasi terpisah, 1 CMS |
| Folder structure | `(compro)` route group + `event/` dan `donasi/` regular |
| Main domain redirect | `ia-rk.com/donasi` → redirect 301 ke `donasi.ia-rk.com` |
| Cron reminder | Ditunda, SMTP dulu |
| Anti-spam | Cloudflare Turnstile (gratis, privacy-friendly) |
| Webhook security | HMAC SHA-256 signature validation |
| DB security | Row Level Security (RLS) pada semua tabel baru |
| Subdomain isolation | Block admin/dashboard routes dari subdomain |
| Webhook idempotency | `webhook_processed_at` column + NULL check |
| Race condition | DB function `register_for_event` dengan `FOR UPDATE` lock |
| Error handling | `error.tsx` + `not-found.tsx` per route group, consistent API errors |
| Testing | Vitest untuk unit/integration, fokus critical paths (payment, registration) |

---

*Last updated: 2026-02-06*
