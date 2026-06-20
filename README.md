# personal-finance-web

Next.js 15 frontend for personal finance management. Consumes a NestJS backend.

## Stack

- Next.js 15 (App Router) + TypeScript + Tailwind CSS
- shadcn/ui components
- TanStack Query for data fetching
- Feature-based folder structure (`src/features/`)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Environment Variables

Copy `.env.example` to `.env.local` and configure:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
```
