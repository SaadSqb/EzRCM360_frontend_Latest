# EzRCM360 Settings & Configurations Portal

Next.js frontend for **Settings & Configurations** only, themed to match [EzRCM360 staging](https://staging-rcm-portal.crm.ezhubspot.com/settings/geography-resolution). It integrates with the EzRCM360 backend API.

## Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **React 18**

## Folder structure

```
frontend/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Redirects to /settings
│   ├── login/               # Login page (POST /api/Auth/authenticate)
│   └── settings/            # All settings routes
│       ├── layout.tsx       # Settings layout (sidebar + header)
│       ├── page.tsx         # Settings landing (9 config cards)
│       ├── geography-resolution/  # Geography Resolution (integrated)
│       ├── icd-codes/             # ICD Codes (integrated)
│       ├── organization/         # Placeholders / integrate as needed
│       └── ...
├── components/
│   ├── layout/             # Sidebar, Header, MainLayout
│   ├── ui/                  # Button, Card
│   └── settings/            # SettingsCard, PageHeader
├── lib/
│   ├── api.ts               # API client (Bearer token, envelope unwrap)
│   ├── env.ts               # Centralized env config (API URL, tokens, etc.)
│   └── types.ts             # Shared types / DTOs
├── hooks/
└── .env.local.example
```

## Setup

1. **Install dependencies**

   ```bash
   cd frontend
   npm install
   ```

2. **Configure environment**

   Copy `.env.local.example` to `.env.local` and set values:

   ```bash
   cp .env.local.example .env.local
   ```

   Edit `.env.local`:

   ```
   # Local development
   NEXT_PUBLIC_API_URL=https://localhost:5001
   ```

   For production, set `NEXT_PUBLIC_API_URL` to your production API. See `.env.example` for all options (API URL, app name, token keys, etc.). Environment detection:
   - `npm run dev` → local defaults (NODE_ENV=development)
   - `npm run build && npm run start` → production defaults (NODE_ENV=production)
   - Set `NEXT_PUBLIC_APP_ENV=production` or `=local` to override.

3. **Run the app**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000). You are redirected to `/settings`.

## Auth

- **Login:** `/login` — POSTs to `POST /api/Auth/authenticate` with `{ email, password }`. On success, stores `accessToken` (and optionally `refreshToken`) in `localStorage` and redirects to `/settings`.
- **API client:** `lib/api.ts` sends `Authorization: Bearer <accessToken>` on every request when the token is present.
- For protected settings pages, ensure the user is logged in; otherwise the API will return 401. You can add a simple auth check (e.g. redirect to `/login` when token is missing) in the settings layout or in a middleware.

## Backend integration

- **Geography Resolution:** `GET /api/ZipGeoMappings?pageNumber=&pageSize=` — list with pagination.
- **ICD Codes:** `GET /api/IcdCodes?pageNumber=&pageSize=` — list with pagination.
- Other settings pages are placeholders with notes on which backend endpoints to use (e.g. `GET /api/Organizations`, `GET /api/Users`, etc.). The API uses **camelCase** in JSON when the backend is configured with default ASP.NET Core JSON options.

## Theme

- **Primary:** Blue (`primary-600` for buttons and active states).
- **Settings & Configurations** in the sidebar is highlighted with a light blue background and left border when on any `/settings` route.
- Cards use white background, light border, and subtle shadow to match the staging look.

## Build

```bash
npm run build
npm run start
```
