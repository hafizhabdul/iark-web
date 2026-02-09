# IARK - Ikatan Alumni Rumah Kepemimpinan

Official website for IARK (Ikatan Alumni Rumah Kepemimpinan), a collaborative platform for alumni of Rumah Kepemimpinan to foster leadership, collaboration, and positive impact across Indonesia.

🌐 **Live**: [https://ia-rk.com](https://ia-rk.com)

---

## 📋 Project Overview

**IARK** is a multi-portal web platform connecting alumni of Rumah Kepemimpinan through:
- **Company Profile**: Public-facing website with stories, testimonials, and information
- **Event Portal**: Event discovery, registration, and ticket management
- **Donation Portal**: Secure donation processing with payment gateway integration
- **Admin CMS**: Content management for stories, events, and donations

---

## 🏗️ Architecture

The platform uses a **subdomain-based architecture** to separate concerns:

| Domain | Purpose | Route Group |
|--------|---------|-------------|
| `ia-rk.com` | Company Profile | `app/(compro)` |
| `event.ia-rk.com` | Event Portal | `app/event` |
| `donasi.ia-rk.com` | Donation Portal | `app/donasi` |
| `ia-rk.com/admin` | CMS Dashboard | `app/admin` |

### Subdomain Routing

Middleware (`middleware.ts`) handles subdomain detection and rewrites:
- Requests to `event.*` → `/event/*` routes
- Requests to `donasi.*` → `/donasi/*` routes
- Main domain serves company profile from `/(compro)` route group

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS 4 |
| **Database** | Supabase (PostgreSQL) |
| **Auth** | Supabase Auth |
| **Data Fetching** | TanStack Query |
| **Payment Gateway** | Pakasir |
| **Email** | Nodemailer + Sumopod SMTP |
| **Bot Protection** | Cloudflare Turnstile |
| **Animations** | Framer Motion |
| **Icons** | Lucide React |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended)

### Installation

```bash
# Clone the repository
git clone https://github.com/hafizhabdul/iark-web.git
cd iark-web

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env.local

# Run development server
pnpm dev
```

### Local Subdomain Testing

To test subdomains locally, add these entries to your hosts file:

**Linux/macOS**: `/etc/hosts`
**Windows**: `C:\Windows\System32\drivers\etc\hosts`

```
127.0.0.1 localhost
127.0.0.1 event.localhost
127.0.0.1 donasi.localhost
```

Then access:
- Main site: http://localhost:3000
- Event portal: http://event.localhost:3000
- Donation portal: http://donasi.localhost:3000

### Available Commands

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm test         # Run unit tests (Vitest)
pnpm test:e2e     # Run E2E tests (Playwright)
```

---

## 📁 Project Structure

```
iark-web/
├── app/
│   ├── (compro)/              # Company Profile (ia-rk.com)
│   │   ├── page.tsx           # Landing page
│   │   ├── cerita/            # Stories section
│   │   ├── masuk/             # Sign in
│   │   └── daftar/            # Sign up
│   │
│   ├── event/                 # Event Portal (event.ia-rk.com)
│   │   ├── page.tsx           # Event listing
│   │   ├── [slug]/            # Event detail & registration
│   │   └── tiket/             # Ticket management
│   │
│   ├── donasi/                # Donation Portal (donasi.ia-rk.com)
│   │   ├── page.tsx           # Donation campaigns
│   │   ├── [slug]/            # Campaign detail
│   │   └── riwayat/           # Donation history
│   │
│   ├── admin/                 # CMS Dashboard (ia-rk.com/admin)
│   │   ├── page.tsx           # Dashboard overview
│   │   ├── stories/           # Story management
│   │   ├── events/            # Event management
│   │   └── donations/         # Donation management
│   │
│   ├── api/                   # API routes
│   │   ├── auth/              # Auth callbacks
│   │   ├── payment/           # Payment webhooks
│   │   └── cron/              # Scheduled tasks
│   │
│   └── auth/                  # Auth pages
│
├── components/
│   ├── ui/                    # shadcn/ui components
│   ├── layout/                # Header, Footer, etc.
│   └── features/              # Feature-specific components
│
├── lib/
│   ├── supabase/              # Supabase client config
│   ├── pakasir/               # Payment gateway utils
│   └── utils.ts               # Shared utilities
│
├── __tests__/                 # Unit tests (Vitest)
├── e2e/                       # E2E tests (Playwright)
└── public/                    # Static assets
```

---

## 🔐 Environment Variables

Create a `.env.local` file with the following variables:

### Supabase

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Cloudflare Turnstile

```env
NEXT_PUBLIC_TURNSTILE_SITE_KEY=your-site-key
TURNSTILE_SECRET_KEY=your-secret-key
```

### Pakasir Payment Gateway

```env
NEXT_PUBLIC_PAKASIR_API_URL=https://api.pakasir.com
PAKASIR_API_KEY=your-api-key
PAKASIR_WEBHOOK_SECRET=your-webhook-secret
```

### SMTP (Nodemailer + Sumopod)

```env
SMTP_HOST=smtp.sumopod.com
SMTP_PORT=587
SMTP_USER=your-smtp-user
SMTP_PASS=your-smtp-password
SMTP_FROM_EMAIL=noreply@ia-rk.com
SMTP_FROM_NAME=IARK
```

### Cron Jobs

```env
CRON_SECRET=your-cron-secret
```

---

## 🧪 Testing

### Unit Tests (Vitest)

```bash
# Run all tests
pnpm test

# Run with coverage
pnpm test:coverage

# Watch mode
pnpm test:watch
```

### E2E Tests (Playwright)

```bash
# Run all E2E tests
pnpm test:e2e

# Run in UI mode
pnpm test:e2e --ui

# Run specific test file
pnpm test:e2e e2e/donation.spec.ts
```

---

## 🚢 Deployment

### Vercel Deployment

The project is deployed on Vercel with the following subdomain configuration:

1. **Add domains in Vercel**:
   - `ia-rk.com` (primary)
   - `event.ia-rk.com`
   - `donasi.ia-rk.com`

2. **DNS Configuration** (Cloudflare or your DNS provider):
   ```
   A     ia-rk.com       76.76.21.21
   CNAME event           cname.vercel-dns.com
   CNAME donasi          cname.vercel-dns.com
   ```

3. **Environment Variables**: Add all variables from the Environment Variables section to Vercel project settings.

---

## 📄 License

This project is proprietary and confidential. All rights reserved by IARK (Ikatan Alumni Rumah Kepemimpinan).

---

## 📞 Contact

- **Website**: [https://ia-rk.com](https://ia-rk.com)
- **Email**: info@ia-rk.com
- **Instagram**: [@iark.official](https://instagram.com/iark.official)

---

**Built with ❤️ by the IARK Development Team**
