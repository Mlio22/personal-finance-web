# Cursor Rules - Personal Finance Web (Next.js)

## Project Overview

- Next.js 15 App Router + TypeScript + Tailwind + shadcn/ui
- Consumes NestJS backend

## Code Style

- Use Server Components by default
- Client Components only when necessary (`"use client"`)
- Feature-based folder structure (`src/features/transactions/`, `src/features/accounts/`)
- All API calls should go through a centralized API client

## UI/UX Rules

- Use shadcn/ui components whenever possible
- Mobile-first responsive design
- Proper loading states and error handling
- Use TanStack Query for data fetching and caching

## Type Safety

- Strong TypeScript usage
- Share types with backend when possible (or duplicate DTOs)

## Auth

- Handle JWT from identity.iico.online
- Use httpOnly cookies or secure local storage strategy (decide one)
