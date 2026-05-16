<div align="center">

<img src="public/banner.png" alt="Lingoura AI Banner" width="100%" />

# Lingoura AI
### The Intelligent Bridge to English Fluency

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![ASP.NET Core](https://img.shields.io/badge/ASP.NET_Core-9-512BD4)](https://dotnet.microsoft.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791)](https://www.postgresql.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38B2AC)](https://tailwindcss.com/)

**Lingoura AI** helps you organize lessons, generate notes, create quizzes, and stay on track — all powered by AI. Experience a state-of-the-art platform designed to master English fluency through interactive labs and real-time intelligence analytics.

</div>

---

## Key Modules

<table>
  <tr>
    <td width="50%">
      <h3>Fluency Analytics</h3>
      <p>Precision tracking of CEFR levels across all four core domains. Understand your growth with data-driven insights and AI-predicted trajectories.</p>
    </td>
    <td width="50%">
      <h3>Speaking Lab</h3>
      <p>Interactive oral practice sessions. High-fidelity feedback on pronunciation, grammar, and professional delivery in real-time.</p>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3>Listening Lab</h3>
      <p>Immersive audio environments. Sharpen your comprehension through diverse accents and complex professional scenarios.</p>
    </td>
    <td width="50%">
      <h3>Writing Intelligence</h3>
      <p>AI-assisted writing practice that generates personalized notes, corrects advanced syntax, and builds your technical vocabulary.</p>
    </td>
  </tr>
</table>

---

## Repository Structure

```
lingoura-ai/
├── src/                        # Next.js 15 frontend (App Router)
│   └── app/
│       ├── (dashboard)/        # Protected pages — Dashboard, Lessons, Labs
│       ├── auth/               # Login, Onboarding
│       └── case-studies/
├── public/
├── backend/                    # ASP.NET Core 9 API (Clean Architecture)
│   ├── src/
│   │   ├── Lingoura.Domain/
│   │   ├── Lingoura.Common/
│   │   ├── Lingoura.Shared/
│   │   ├── Lingoura.Application/
│   │   ├── Lingoura.Infrastructure/
│   │   └── Lingoura.Api/
│   ├── tests/
│   │   ├── Lingoura.Application.Tests/
│   │   └── Lingoura.Api.IntegrationTests/
│   └── ARCHITECTURE.md         # Full architecture docs + auth flow diagrams
└── README.md
```

See [backend/ARCHITECTURE.md](backend/ARCHITECTURE.md) for the complete layer dependency rules, authentication sequence diagrams, database schema, and middleware pipeline.

---

## Frontend — Getting Started

**Stack:** Next.js 15 (App Router) · React 19 · TypeScript 5 · Tailwind CSS v4 · Framer Motion

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:3000)
npm run dev

# Production build
npm run build
npm run start

# Lint
npm run lint
```

---

## Backend — Getting Started

**Stack:** ASP.NET Core 9 · PostgreSQL 16 · EF Core 9 · ASP.NET Identity · JWT · MediatR · Serilog

### Prerequisites
- [.NET 9 SDK](https://dotnet.microsoft.com/download/dotnet/9)
- PostgreSQL 16 running locally (or via Docker)

### 1. Configure secrets

```bash
cd backend

dotnet user-secrets set "Database:ConnectionString" \
  "Host=localhost;Port=5432;Database=lingoura;Username=postgres;Password=YOUR_PASSWORD" \
  --project src/Lingoura.Api

dotnet user-secrets set "Jwt:SecretKey" \
  "$(openssl rand -base64 32)" \
  --project src/Lingoura.Api

dotnet user-secrets set "GoogleAuth:ClientId" \
  "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com" \
  --project src/Lingoura.Api
```

### 2. Create the database

```bash
# Create database in PostgreSQL (run once)
psql -U postgres -c "CREATE DATABASE lingoura;"
```

### 3. Apply migrations

```bash
cd backend
dotnet ef database update \
  --project src/Lingoura.Infrastructure \
  --startup-project src/Lingoura.Api
```

### 4. Run the API

```bash
dotnet run --project src/Lingoura.Api --environment Development
# API: http://localhost:5030
# Swagger: http://localhost:5030/swagger
```

### Auth Endpoints

| Method | Endpoint                      | Description                    |
|--------|-------------------------------|--------------------------------|
| POST   | `/api/v1/auth/register`       | Register + issue JWT tokens    |
| POST   | `/api/v1/auth/login`          | Login + issue JWT tokens       |
| POST   | `/api/v1/auth/refresh`        | Rotate refresh token           |
| POST   | `/api/v1/auth/logout`         | Revoke refresh token           |
| POST   | `/api/v1/auth/google`         | Google OAuth (backend-validated) |

### Adding a new EF migration

```bash
cd backend
dotnet ef migrations add <MigrationName> \
  --project src/Lingoura.Infrastructure \
  --startup-project src/Lingoura.Api
```

---

## Design & UX

Lingoura AI is built with a **Premium SaaS Aesthetic**, focusing on deep work and cognitive ease:

- **Adaptive Theming** — Seamless light/dark mode with CSS custom properties
- **Motion Sync** — Framer Motion layout engine with staggered entrance animations
- **Glassmorphism** — `backdrop-blur-2xl` sidebar with CSS variable color system
- **Search-First** — Global Cmd+K search across lessons, quizzes, and notes

---

<div align="center">
  Developed with care by <a href="https://github.com/kumaresh-rgb">Kumaresh</a>
</div>
