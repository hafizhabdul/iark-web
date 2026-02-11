# PLAN: Shared Auth, Profile Enhancement & Donation Improvements

## Overview

Mengintegrasikan auth yang sudah ada agar bisa digunakan di semua subdomain (main, event, donasi), memperkaya profile user dengan field penting, dan memperbaiki flow donasi agar mirip kitabisa.com.

---

## 1. Shared Auth Across Subdomains

### Current State
- Auth sudah menggunakan Supabase Auth (Google OAuth)
- Cookies domain sudah di-set untuk `.ia-rk.com` (shared)
- Login di main domain otomatis berlaku di subdomain

### Changes Needed
Tidak ada perubahan signifikan. Auth sudah shared. Hanya perlu:
- Pastikan `updateSession()` di middleware jalan di semua subdomain ✅
- UI login/register konsisten di semua portal

### Auth Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER VISITS                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   donasi.ia-rk.com/beasiswa/checkout                            │
│   atau                                                           │
│   event.ia-rk.com/event-name/register                           │
│                                                                  │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
              ┌─────────────────────────┐
              │   Check Auth Status     │
              │   (via Supabase)        │
              └────────────┬────────────┘
                           │
           ┌───────────────┴───────────────┐
           │                               │
           ▼                               ▼
    ┌─────────────┐                 ┌─────────────────┐
    │  LOGGED IN  │                 │   NOT LOGGED IN │
    └──────┬──────┘                 └────────┬────────┘
           │                                  │
           ▼                                  ▼
    ┌─────────────────┐              ┌────────────────────┐
    │ Auto-fill form: │              │ Show options:      │
    │ - Name          │              │ 1. Login/Register  │
    │ - Email         │              │ 2. Continue as     │
    │ - Phone (opt)   │              │    Guest/Hamba     │
    │ - Angkatan      │              │    Allah           │
    │ - Regional      │              └─────────┬──────────┘
    └────────┬────────┘                        │
             │                     ┌───────────┴───────────┐
             │                     │                       │
             ▼                     ▼                       ▼
    ┌───────────────┐      ┌─────────────┐        ┌───────────────┐
    │ Complete form │      │ Login flow  │        │ Guest form:   │
    │ & Submit      │      │ → redirect  │        │ Name, Email   │
    └───────────────┘      │   back      │        │ (required)    │
                           └─────────────┘        └───────────────┘
```

---

## 2. Profile Enhancement

### New Profile Fields

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `name` | text | ✅ | Nama lengkap |
| `email` | text | ✅ | Email (dari auth) |
| `phone` | text | ❌ | No HP (opsional) |
| `photo` | text | ❌ | URL foto profile (opsional) |
| `angkatan` | integer | ❌ | Tahun angkatan RK (e.g., 2015) |
| `regional` | text | ❌ | Regional RK (pilihan dari list) |
| `kampus` | text | ❌ | Nama kampus/universitas |
| `asrama` | text | ❌ | Asrama RK (existing field) |

### Regional Options (Dropdown)
```
- Aceh
- Sumatera Utara
- Riau
- Sumatera Barat
- Jambi
- Sumatera Selatan
- Bengkulu
- Lampung
- Kepulauan Bangka Belitung
- Kepulauan Riau
- DKI Jakarta
- Jawa Barat
- Banten
- Jawa Tengah
- DI Yogyakarta
- Jawa Timur
- Bali
- Nusa Tenggara Barat
- Nusa Tenggara Timur
- Kalimantan Barat
- Kalimantan Tengah
- Kalimantan Selatan
- Kalimantan Timur
- Kalimantan Utara
- Sulawesi Utara
- Gorontalo
- Sulawesi Tengah
- Sulawesi Selatan
- Sulawesi Barat
- Sulawesi Tenggara
- Maluku
- Maluku Utara
- Papua
- Papua Barat
- Papua Selatan
- Papua Tengah
- Papua Pegunungan
```

### Database Migration

```sql
-- Add new columns to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS regional TEXT,
ADD COLUMN IF NOT EXISTS kampus TEXT;

-- Create index for filtering
CREATE INDEX IF NOT EXISTS idx_profiles_angkatan ON profiles(angkatan);
CREATE INDEX IF NOT EXISTS idx_profiles_regional ON profiles(regional);
CREATE INDEX IF NOT EXISTS idx_profiles_kampus ON profiles(kampus);
```

### Profile Edit Page

Location: `/dashboard/profile`

UI Components:
- Profile photo upload (optional)
- Name (required, editable)
- Email (read-only, from auth)
- Phone (optional)
- Angkatan (dropdown: 2010-current year)
- Regional (dropdown from list above)
- Kampus (text input with autocomplete suggestion)
- Asrama (dropdown: existing dormitories)

---

## 3. Donation Flow Improvements

### Current vs New Flow

| Aspect | Current | New |
|--------|---------|-----|
| Amount | Preset buttons only | Preset + custom input |
| Auth | Required name/email | Login OR Hamba Allah (email only) |
| Min amount | Rp 10.000 | Rp 1.000 (more accessible) |
| History | No user history | Logged-in users see their donation history |

### Donation Form States

#### State 1: Not Logged In
```
┌────────────────────────────────────────┐
│  Donasi untuk: [Campaign Name]         │
├────────────────────────────────────────┤
│                                        │
│  ┌──────────────────────────────────┐  │
│  │ 🔐 Masuk dengan Google           │  │
│  │    Untuk menyimpan riwayat       │  │
│  └──────────────────────────────────┘  │
│                                        │
│            ── atau ──                  │
│                                        │
│  ┌──────────────────────────────────┐  │
│  │ 🙏 Lanjut sebagai Hamba Allah    │  │
│  │    Donasi tanpa login            │  │
│  └──────────────────────────────────┘  │
│                                        │
└────────────────────────────────────────┘
```

#### State 2: Logged In (Auto-fill)
```
┌────────────────────────────────────────┐
│  Donasi untuk: [Campaign Name]         │
├────────────────────────────────────────┤
│  ✅ Masuk sebagai: John Doe            │
│     john@example.com                   │
│                                        │
│  Nominal Donasi                        │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌─────┐  │
│  │50rb│ │100k│ │250k│ │500k│ │ 1jt │  │
│  └────┘ └────┘ └────┘ └────┘ └─────┘  │
│                                        │
│  Atau masukkan nominal:                │
│  ┌─────────────────────────────────┐   │
│  │ Rp  │ 0                         │   │
│  └─────────────────────────────────┘   │
│                                        │
│  Pesan/Doa (opsional):                 │
│  ┌─────────────────────────────────┐   │
│  │                                 │   │
│  └─────────────────────────────────┘   │
│                                        │
│  ☐ Sembunyikan nama saya               │
│                                        │
│  ┌──────────────────────────────────┐  │
│  │      💖 Donasi Rp 100.000        │  │
│  └──────────────────────────────────┘  │
└────────────────────────────────────────┘
```

#### State 3: Hamba Allah (Guest)
```
┌────────────────────────────────────────┐
│  Donasi untuk: [Campaign Name]         │
├────────────────────────────────────────┤
│  🙏 Donasi sebagai Hamba Allah         │
│                                        │
│  Email (untuk notifikasi pembayaran):  │
│  ┌─────────────────────────────────┐   │
│  │ email@example.com               │   │
│  └─────────────────────────────────┘   │
│                                        │
│  Nominal Donasi                        │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌─────┐  │
│  │50rb│ │100k│ │250k│ │500k│ │ 1jt │  │
│  └────┘ └────┘ └────┘ └────┘ └─────┘  │
│                                        │
│  Atau masukkan nominal:                │
│  ┌─────────────────────────────────┐   │
│  │ Rp  │ 0                         │   │
│  └─────────────────────────────────┘   │
│                                        │
│  Pesan/Doa (opsional):                 │
│  ┌─────────────────────────────────┐   │
│  │                                 │   │
│  └─────────────────────────────────┘   │
│                                        │
│  ┌──────────────────────────────────┐  │
│  │      💖 Donasi Rp 100.000        │  │
│  └──────────────────────────────────┘  │
└────────────────────────────────────────┘
```

### Database Changes

```sql
-- Update donations table to properly link user
ALTER TABLE donations
ADD COLUMN IF NOT EXISTS is_guest BOOLEAN DEFAULT false;

-- is_anonymous = hide name on wall of fame
-- is_guest = user not logged in (Hamba Allah mode)
```

---

## 4. Event Registration Flow

### Reference: 2045hz.id Style

Event listing with:
- Upcoming/Past tabs
- Event cards with: Image, Title, Date/Time, Location, Price (FREE/Rp X), Detail button

Event detail with:
- Hero image
- Title, Date, Time, Location
- Description
- Registration form/button
- Capacity indicator (if limited)

### Registration Form States

#### State 1: Not Logged In
```
┌────────────────────────────────────────┐
│  Daftar Event: [Event Name]            │
├────────────────────────────────────────┤
│                                        │
│  ┌──────────────────────────────────┐  │
│  │ 🔐 Masuk dengan Google           │  │
│  │    Data otomatis terisi          │  │
│  └──────────────────────────────────┘  │
│                                        │
│            ── atau ──                  │
│                                        │
│  ┌──────────────────────────────────┐  │
│  │ 📝 Daftar sebagai Tamu           │  │
│  │    Isi data manual               │  │
│  └──────────────────────────────────┘  │
│                                        │
└────────────────────────────────────────┘
```

#### State 2: Logged In (Auto-fill)
```
┌────────────────────────────────────────┐
│  Daftar Event: [Event Name]            │
├────────────────────────────────────────┤
│  ✅ Masuk sebagai: John Doe            │
│                                        │
│  Nama Lengkap *                        │
│  ┌─────────────────────────────────┐   │
│  │ John Doe                        │   │ (pre-filled)
│  └─────────────────────────────────┘   │
│                                        │
│  Email *                               │
│  ┌─────────────────────────────────┐   │
│  │ john@example.com                │   │ (pre-filled, readonly)
│  └─────────────────────────────────┘   │
│                                        │
│  No WhatsApp                           │
│  ┌─────────────────────────────────┐   │
│  │ 08123456789                     │   │ (pre-filled if exists)
│  └─────────────────────────────────┘   │
│                                        │
│  Angkatan RK                           │
│  ┌─────────────────────────────────┐   │
│  │ 2018                        ▼   │   │ (pre-filled if exists)
│  └─────────────────────────────────┘   │
│                                        │
│  Asal Organisasi (opsional)            │
│  ┌─────────────────────────────────┐   │
│  │ e.g., IARK, Komunitas X         │   │
│  └─────────────────────────────────┘   │
│                                        │
│  ┌──────────────────────────────────┐  │
│  │      ✅ Daftar Sekarang          │  │
│  └──────────────────────────────────┘  │
└────────────────────────────────────────┘
```

#### State 3: Guest (Manual Fill)
```
┌────────────────────────────────────────┐
│  Daftar Event: [Event Name]            │
├────────────────────────────────────────┤
│  📝 Daftar sebagai Tamu                │
│                                        │
│  Nama Lengkap *                        │
│  ┌─────────────────────────────────┐   │
│  │                                 │   │
│  └─────────────────────────────────┘   │
│                                        │
│  Email *                               │
│  ┌─────────────────────────────────┐   │
│  │                                 │   │
│  └─────────────────────────────────┘   │
│                                        │
│  No WhatsApp *                         │
│  ┌─────────────────────────────────┐   │
│  │                                 │   │
│  └─────────────────────────────────┘   │
│                                        │
│  Angkatan RK (jika alumni)             │
│  ┌─────────────────────────────────┐   │
│  │ Pilih angkatan              ▼   │   │
│  └─────────────────────────────────┘   │
│                                        │
│  Asal Organisasi (opsional)            │
│  ┌─────────────────────────────────┐   │
│  │                                 │   │
│  └─────────────────────────────────┘   │
│                                        │
│  ┌──────────────────────────────────┐  │
│  │      ✅ Daftar Sekarang          │  │
│  └──────────────────────────────────┘  │
└────────────────────────────────────────┘
```

---

## 5. CMS Enhancements

### A. User Management (`/admin/users`)

Current: Basic user list
New Features:
- **Search**: By name, email, kampus
- **Filter**: By angkatan (dropdown), regional (dropdown), asrama
- **View**: Profile detail modal (read-only)
- **Export**: CSV with selected filters

```
┌────────────────────────────────────────────────────────────┐
│  Users                                        + Export CSV │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  🔍 Search by name, email, or kampus...                    │
│                                                            │
│  Filters:                                                  │
│  ┌──────────┐ ┌──────────────┐ ┌────────────┐             │
│  │Angkatan ▼│ │ Regional   ▼ │ │ Asrama   ▼ │  [Reset]   │
│  └──────────┘ └──────────────┘ └────────────┘             │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ Photo │ Name      │ Email   │ Angkatan │ Regional    │ │
│  ├───────┼───────────┼─────────┼──────────┼─────────────┤ │
│  │  👤   │ John Doe  │ j@e.com │ 2018     │ Jawa Barat  │ │
│  │  👤   │ Jane Doe  │ x@e.com │ 2019     │ DKI Jakarta │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  Showing 1-10 of 150 users                   < 1 2 3 ... > │
└────────────────────────────────────────────────────────────┘
```

### B. Donations Management (`/admin/donations`)

Existing + Enhancements:
- **Filter by campaign**: Dropdown to select campaign
- **Filter by status**: All, Pending, Paid
- **Search**: By donor name, email, order_id
- **View donation detail**: Modal with full info
- **Stats per campaign**: Quick stats cards at top

### C. Event Registrations (`/admin/events/[id]/registrations`)

Existing + Enhancements:
- **Filter by status**: All, Registered, Confirmed, Attended, Cancelled
- **Search**: By name, email
- **Bulk actions**: Confirm selected, Export CSV
- **Quick stats**: Total registered, confirmed, attended

---

## 6. Implementation Tasks

### Phase 1: Profile Enhancement (Priority: High)

| ID | Task | Priority |
|----|------|----------|
| P-01 | Migration: Add regional, kampus to profiles | High |
| P-02 | Create REGIONAL_OPTIONS constant | High |
| P-03 | Update profile types in types.ts | High |
| P-04 | Create/update profile edit page UI | High |
| P-05 | Add profile photo upload (Supabase Storage) | Medium |
| P-06 | Admin: Add filters to user list | Medium |
| P-07 | Admin: Add search to user list | Medium |
| P-08 | Admin: Export users to CSV | Low |

### Phase 2: Donation Flow (Priority: High)

| ID | Task | Priority |
|----|------|----------|
| D-01 | Update checkout page with auth check | High |
| D-02 | Add "Login" vs "Hamba Allah" choice UI | High |
| D-03 | Update donation form for guest mode | High |
| D-04 | Add custom amount input (free-form) | High |
| D-05 | Update API to handle guest donations | High |
| D-06 | Add is_guest column to donations | Medium |
| D-07 | Create donation history page for logged-in users | Medium |
| D-08 | Lower minimum donation to Rp 1.000 | Low |

### Phase 3: Event Registration Flow (Priority: High)

| ID | Task | Priority |
|----|------|----------|
| E-01 | Update event detail page design (2045hz style) | High |
| E-02 | Update registration form with auth check | High |
| E-03 | Add "Login" vs "Guest" choice UI | High |
| E-04 | Auto-fill form for logged-in users | High |
| E-05 | Update event listing page (Upcoming/Past tabs) | Medium |
| E-06 | Add organization field to registration | Medium |
| E-07 | Create my-events page with registration history | Medium |

### Phase 4: CMS Enhancements (Priority: Medium)

| ID | Task | Priority |
|----|------|----------|
| C-01 | Admin users: Add search | Medium |
| C-02 | Admin users: Add filters (angkatan, regional, asrama) | Medium |
| C-03 | Admin donations: Add campaign filter | Medium |
| C-04 | Admin donations: Add search | Medium |
| C-05 | Admin registrations: Add bulk actions | Low |
| C-06 | Admin: Export functionality | Low |

---

## 7. File Changes Summary

### New Files
```
lib/constants/regional.ts          # Regional options constant
app/dashboard/profile/page.tsx     # Profile edit page (update existing)
app/donasi/[slug]/checkout/        # Updated checkout with auth flow
app/event/[slug]/register/         # Updated registration with auth flow
components/features/auth/AuthChoice.tsx  # Login vs Guest choice component
```

### Modified Files
```
lib/supabase/types.ts              # Add regional, kampus to Profile
lib/queries/profiles.ts            # Update profile queries
app/admin/users/page.tsx           # Add search & filters
app/admin/donations/page.tsx       # Add campaign filter, search
app/event/page.tsx                 # Update event listing UI
app/event/[slug]/page.tsx          # Update event detail UI
```

### Database Migrations
```
scripts/migration_profile_fields.sql
scripts/migration_donation_guest.sql
```

---

## Timeline Estimate

| Phase | Duration | Dependencies |
|-------|----------|--------------|
| Phase 1: Profile | 1-2 days | None |
| Phase 2: Donation | 2-3 days | Phase 1 |
| Phase 3: Event | 2-3 days | Phase 1 |
| Phase 4: CMS | 1-2 days | Phase 1, 2, 3 |

**Total: ~7-10 days**

---

## Questions/Confirmations Needed

1. ✅ Regional = Provinsi di Indonesia
2. ✅ Kampus = Text input (not dropdown)
3. ✅ Hamba Allah = Email only for notification
4. ✅ Preset amounts still shown
5. ✅ Admin cannot edit user profiles
6. ✅ Guest registration allowed for events

Ready to implement when confirmed!
