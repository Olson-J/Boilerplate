# app Directory

This directory contains all Next.js App Router pages and layouts.

## Structure

Pages are organized using Next.js file-based routing with route groups for logical organization:

- **`(auth)/`** - Authentication routes (login, signup)
- **`(dashboard)/`** - Protected dashboard routes (requires authentication)
- **`api/`** - API routes and handlers
- **`layout.tsx`** - Root layout

## Route Groups

Route groups (folders with parentheses) are used for organization and do NOT appear in URLs:

- `(auth)/login` → `/login`
- `(auth)/signup` → `/signup`
- `(dashboard)/dashboard` → `/dashboard`
- `(dashboard)/profile` → `/profile`

## Page Guidelines

- Each page is a Server Component by default
- Use `'use client'` directive only for client-side interactivity
- Import and use `requireAuth()` for protected pages
- Handle loading and error states
- Include proper metadata for SEO

## Layout Hierarchy

- `app/layout.tsx` - Root layout (shared by all pages)
- `app/(auth)/layout.tsx` - Auth-specific layout
- `app/(dashboard)/layout.tsx` - Dashboard-specific layout

Each layout can have its own navbar, sidebar, or other shared UI elements.
