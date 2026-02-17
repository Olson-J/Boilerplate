# lib Directory

This directory contains utility functions, hooks, and core application logic.

## Structure

- **`auth/`** - Authentication-related utility functions (server-side helpers)
  - `getUser()` - Retrieve current user from session
  - `requireAuth()` - Guard function for protected routes

- **`hooks/`** - Custom React hooks
  - `useAuth()` - Client-side authentication hook

- **`supabase/`** - Supabase client configurations
  - `server.ts` - Server-side Supabase client (SSR support)
  - `client.ts` - Client-side Supabase client

- **`types/`** - Shared TypeScript type definitions
  - Application-wide types and interfaces

- **`utils/`** - Pure utility functions
  - Helper functions for common operations
  - Data validation and formatting functions

## Usage Guidelines

- Keep functions pure and side-effect free when possible
- Export all functions that are used across multiple components
- Add JSDoc comments to all exported functions
- Write unit tests for utility functions
- Document complex logic with inline comments
