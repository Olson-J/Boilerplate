# Architecture Documentation

**Last Updated:** February 23, 2026

This document explains the key architectural decisions and patterns used in this Next.js + Supabase boilerplate.

---

## 📐 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Browser                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │         Next.js App (App Router)                      │ │
│  │                                                         │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐ │ │
│  │  │   Public     │  │  Auth Pages  │  │  Protected  │ │ │
│  │  │   Routes     │  │  (/login,    │  │   Routes    │ │ │
│  │  │   (/)        │  │  /signup)    │  │  (/profile) │ │ │
│  │  └──────────────┘  └──────────────┘  └─────────────┘ │ │
│  │                                                         │ │
│  │  ┌──────────────────────────────────────────────────┐ │ │
│  │  │           Middleware (Auth Check)                │ │ │
│  │  └──────────────────────────────────────────────────┘ │ │
│  └───────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    Supabase Backend                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │     Auth     │  │  PostgreSQL  │  │   Storage    │    │
│  │   (GoTrue)   │  │   Database   │  │   (S3-like)  │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
│                                                             │
│  ┌────────────────────────────────────────────────────┐   │
│  │       Row Level Security (RLS) Policies            │   │
│  └────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 Core Architectural Decisions

### 1. Next.js App Router (Not Pages Router)

**Decision:** Use Next.js 13+ App Router with the `app/` directory.

**Rationale:**
- Modern React Server Components by default (better performance)
- Improved data fetching patterns with async components
- Better layout and loading state management
- Native support for streaming and suspense
- Route groups for logical organization `(auth)`, `(dashboard)`

**Trade-offs:**
- Steeper learning curve than Pages Router
- Need to explicitly mark Client Components with `'use client'`
- Some third-party libraries may not yet support Server Components

### 2. Supabase SSR with @supabase/ssr

**Decision:** Use `@supabase/ssr` instead of the basic Supabase client.

**Rationale:**
- Proper server-side rendering support with cookie-based sessions
- Separate client instances for different contexts:
  - `lib/supabase/client.ts` - Client Components
  - `lib/supabase/server.ts` - Server Components
  - Middleware client - Route protection
- Automatic session refresh
- Cookie management handled correctly in Next.js environment

**Implementation Pattern:**
```typescript
// Server Components (async)
import { createClient } from '@/lib/supabase/server'
const supabase = await createClient()

// Client Components
import { createClient } from '@/lib/supabase/client'
const supabase = createClient()
```

### 3. TypeScript Strict Mode

**Decision:** Enable strict TypeScript with no `any` types.

**Rationale:**
- Catch errors at compile time, not runtime
- Better IDE support and autocomplete
- Self-documenting code through types
- Easier refactoring with confidence

**Implementation:**
- All files use `.ts` or `.tsx` extensions
- `tsconfig.json` has `"strict": true`
- Database types generated from Supabase schema
- Proper typing for all function parameters and return values

### 4. Test-First Development

**Decision:** Write tests before implementing features (TDD).

**Rationale:**
- Clarifies requirements before coding
- Ensures all features are testable
- Provides regression protection
- Acts as living documentation

**Testing Stack:**
- **Vitest** - Fast, Vite-native test runner
- **React Testing Library** - Component testing
- **jsdom** - DOM environment for tests

**Test Organization:**
```
__tests__/
├── unit/           # Pure function tests
├── components/     # React component tests  
├── integration/    # Multi-component/flow tests
└── helpers/        # Test utilities and mocks
```

### 5. Automatic Profile Creation

**Decision:** Use database trigger for profile creation, not application code.

**Rationale:**
- **Reliability:** Guaranteed to run even if app code fails
- **Consistency:** Single source of truth in the database
- **Security:** Can't be bypassed by API calls
- **Simplicity:** No need for complex signup logic

**Implementation:**
```sql
-- Trigger function
CREATE FUNCTION public.handle_new_user()...

-- Trigger on auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

### 6. Row Level Security (RLS) Policies

**Decision:** Enable RLS on all tables with explicit policies.

**Rationale:**
- **Security by default:** Data isolated at database level
- **Defense in depth:** Works even if app logic has bugs
- **Multi-tenancy support:** Users can only access their own data
- **Clear intent:** Policies document access rules

**RLS Pattern:**
```sql
-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = user_id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = user_id);
```

### 7. Declarative Schema Management

**Decision:** Define schemas in SQL files, then generate migrations.

**Rationale:**
- Single source of truth for schema definition
- Version controlled schema files
- Clear diff when schema changes
- Easier to review and understand

**Workflow:**
1. Edit `supabase/schemas/profiles.sql`
2. Run `npx supabase db diff -f migration_name`
3. Review generated migration
4. Apply with `npx supabase db reset` (local) or `npx supabase db push` (production)

---

## 🏗️ Directory Structure & Responsibilities

### `/app` - Next.js Application

**Responsibility:** User-facing pages and API routes.

**Organization:**
- **Route groups:** `(auth)`, `(dashboard)` for logical grouping without URL nesting
- **Nested layouts:** Shared UI across route groups
- **Server Components by default:** Use `'use client'` only when needed

**Key Files:**
- `layout.tsx` - Root layout (HTML structure, global styles)
- `page.tsx` - Home page
- `(auth)/layout.tsx` - Auth layout (centered, minimal)
- `(dashboard)/layout.tsx` - Dashboard layout (with navigation)

### `/lib` - Business Logic & Utilities

**Responsibility:** Reusable functions and core application logic.

**Subdirectories:**
- **`auth/`** - Authentication utilities
  - `server.ts` - Server-side auth functions (`getUser`, `requireAuth`)
  - `ensureUser.ts` - User validation helper
- **`supabase/`** - Supabase client configurations
  - `client.ts` - Client Component Supabase client
  - `server.ts` - Server Component Supabase client
- **`hooks/`** - Custom React hooks
  - `useAuth.ts` - Client-side auth state management
- **`types/`** - TypeScript type definitions
  - `database.ts` - Generated database types
- **`utils/`** - Pure utility functions
  - `formatDate.ts` - Date formatting
  - `uploadAvatar.ts` - File upload logic

**Design Principle:** No business logic in components - keep them in `lib/`.

### `/components` - React Components

**Responsibility:** Reusable UI components.

**Subdirectories:**
- **`ui/`** - Generic UI components (Button, Input, Card, Form)
- **`auth/`** - Authentication-specific components (LoginForm, SignupForm)
- **`shared/`** - Shared feature components (Greeting)

**Design Principles:**
- Small, focused components
- Composition over prop drilling
- TypeScript interfaces for props
- Testable (no direct API calls - those go in hooks or server actions)

### `/supabase` - Database & Infrastructure

**Responsibility:** Database schema, migrations, and configuration.

**Subdirectories:**
- **`schemas/`** - Declarative SQL schema files
- **`migrations/`** - Generated timestamped migrations
- `config.toml` - Supabase local configuration
- `seed.sql` - Development seed data

---

## Authentication Architecture

### Authentication Flow

```
1. User clicks "Sign Up"
   ↓
2. SignupForm calls supabase.auth.signUp()
   ↓
3. Supabase creates user in auth.users table
   ↓
4. Database trigger automatically creates profile
   ↓
5. User receives confirmation email
   ↓
6. User confirms email
   ↓
7. Session cookie set in browser
   ↓
8. Middleware checks session on protected routes
   ↓
9. User can access dashboard and profile
```

### Session Management

**Storage:** HTTP-only cookies (set by Supabase)

**Refresh:** Automatic token refresh handled by `@supabase/ssr`

**Validation:**
- **Middleware:** Checks session for protected routes
- **Server Components:** `getUser()` validates session
- **Client Components:** `useAuth()` hook provides session state

### Protected Routes

**Implementation:** Middleware + layout-level checks

```typescript
// middleware.ts - Route-level protection
export async function middleware(request: NextRequest) {
  const { supabase, response } = await updateSession(request)
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  return response
}
```

```typescript
// app/(dashboard)/layout.tsx - Layout-level check
export default async function DashboardLayout({ children }) {
  const user = await requireAuth() // Throws if not authenticated
  return <>{children}</>
}
```

---

## Data Flow Patterns

### Server Component Data Fetching

```typescript
// app/(dashboard)/profile/page.tsx
export default async function ProfilePage() {
  const supabase = await createClient()
  
  // Direct database query in Server Component
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .single()
  
  return <ProfilePageClient profile={profile} />
}
```

**Benefits:**
- No client-side loading states for initial data
- Better SEO (data rendered on server)
- Reduced client bundle size

### Client Component Mutations

```typescript
// components/auth/ProfileForm.tsx
'use client'

export default function ProfileForm({ initialProfile }) {
  const supabase = createClient()
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Client-side mutation
    const { error } = await supabase
      .from('profiles')
      .update({ display_name: name })
      .eq('user_id', initialProfile.user_id)
    
    if (error) {
      setError(error.message)
    }
  }
  
  return <form onSubmit={handleSubmit}>...</form>
}
```

**Pattern:**
- Server Component fetches initial data
- Passes data to Client Component as props
- Client Component handles user interactions and mutations

---

## Testing Architecture

### Test Types & Coverage

1. **Unit Tests** (`__tests__/unit/`)
   - Pure functions in `lib/utils/`
   - No dependencies on React or Supabase
   - Fast, isolated tests

2. **Component Tests** (`__tests__/components/`)
   - React components with mocked Supabase
   - Test rendering, user interactions, and state
   - Use React Testing Library

3. **Integration Tests** (`__tests__/integration/`)
   - Multi-component flows (signup → profile creation)
   - Mocked Supabase responses
   - Test complete user journeys

### Mocking Strategy

**Supabase Client Mock:**
```typescript
// __tests__/helpers/mockSupabase.ts
export const mockSupabaseClient = {
  auth: {
    signUp: vi.fn(),
    signInWithPassword: vi.fn(),
    signOut: vi.fn(),
    getUser: vi.fn(),
  },
  from: vi.fn(() => ({
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    single: vi.fn(),
  })),
}
```

**Why Mock:**
- No need for running Supabase instance in tests
- Faster test execution
- Predictable test results
- Test error cases easily

---

## Deployment Architecture

### Development Environment

```
Local Machine
├── Next.js Dev Server (localhost:3000)
├── Supabase Local (Docker containers)
│   ├── PostgreSQL (localhost:54322)
│   ├── GoTrue Auth (localhost:54321)
│   └── Storage API (localhost:54321)
└── Environment: .env.local
```

### Production Environment (Vercel + Supabase Cloud)

```
┌─────────────────────────────────────────────┐
│              Vercel Edge Network            │
│  ┌─────────────────────────────────────┐   │
│  │     Next.js App (Serverless)        │   │
│  │  - Server Components                │   │
│  │  - API Routes                       │   │
│  │  - Edge Middleware                  │   │
│  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
                    ↓ HTTPS
┌─────────────────────────────────────────────┐
│           Supabase Cloud                    │
│  ┌──────────────────────────────────────┐  │
│  │     Managed PostgreSQL               │  │
│  │  - RLS Policies                      │  │
│  │  - Triggers                          │  │
│  │  - Migrations via GitHub Actions     │  │
│  └──────────────────────────────────────┘  │
│  ┌──────────────────────────────────────┐  │
│  │     Auth Service (GoTrue)            │  │
│  └──────────────────────────────────────┘  │
│  ┌──────────────────────────────────────┐  │
│  │     Storage Service (S3-compatible)  │  │
│  └──────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

### CI/CD Pipeline (GitHub Actions)

```
git push to main
    ↓
GitHub Actions Triggered
    ↓
1. Install Supabase CLI
2. Link to production project
3. Run: npx supabase db push
4. Apply migrations to production
    ↓
Vercel Deploy (automatic)
    ↓
Production Updated
```

---

## Configuration Management

### Environment Variables

**Local Development (`.env.local`):**
```bash
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<local-anon-key>
```

**Production (Vercel Environment Variables):**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<production-anon-key>
```

**Why `NEXT_PUBLIC_`?**
- Required prefix for environment variables used in browser
- Next.js inlines these at build time
- Never store secrets with this prefix (they're publicly visible)

### Typed Configuration

```typescript
// lib/supabase/client.ts
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}
```

**Validation:** Fail fast if configuration is missing.

---

## Performance Considerations

### 1. Server Components by Default
- Reduced JavaScript bundle size
- Faster initial page loads
- Better SEO

### 2. Streaming & Suspense
```typescript
export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <AsyncComponent />
    </Suspense>
  )
}
```

### 3. Image Optimization
- Use Next.js `<Image>` component for automatic optimization
- Lazy loading by default
- Responsive images with srcset

### 4. Database Indexes
```sql
-- Index for fast profile lookups by user_id
CREATE INDEX idx_profiles_user_id ON profiles(user_id);
```

---

## Security Considerations

### 1. Row Level Security (RLS)
- **Always enabled** on all tables
- Defense in depth - even if app has bugs
- Can't be bypassed by API calls

### 2. Environment Variables
- Never commit `.env.local` to version control
- Use Vercel secrets for production
- GitHub Secrets for CI/CD workflows

### 3. Input Validation
- TypeScript types for compile-time validation
- Runtime validation for user inputs
- Sanitize file uploads

### 4. Authentication
- HTTP-only cookies (not localStorage)
- Automatic session refresh
- Email confirmation required

### 5. Content Security Policy (CSP)
- Configure in `next.config.ts`
- Restrict script sources
- Prevent XSS attacks

---

## Key Architectural Patterns

### 1. Separation of Concerns
- **Components:** UI rendering only
- **Hooks:** Client-side state management
- **lib/:** Business logic
- **Database:** Data integrity and security

### 2. Composition Over Inheritance
- Small, focused components
- Compose complex UIs from simple components
- Use children props and slots

### 3. Single Source of Truth
- Database types generated from Supabase schema
- Environment variables in one place
- Centralized auth utilities

### 4. Fail Fast
- TypeScript strict mode
- Required environment variables validated at startup
- Clear error messages

### 5. Progressive Enhancement
- Server Components for initial render
- Client Components for interactivity
- Works without JavaScript for basic functionality

---

## Migration Strategy

### Schema Changes Workflow

1. **Edit Declarative Schema**
   ```bash
   # Edit supabase/schemas/profiles.sql
   ```

2. **Generate Migration**
   ```bash
   npx supabase db diff -f add_new_column
   ```

3. **Review Migration**
   ```bash
   # Check supabase/migrations/YYYYMMDDHHMMSS_add_new_column.sql
   ```

4. **Test Locally**
   ```bash
   npx supabase db reset  # Applies all migrations
   npm test              # Run test suite
   ```

5. **Commit & Push**
   ```bash
   git add supabase/
   git commit -m "Add new column to profiles"
   git push origin main
   ```

6. **GitHub Actions Applies to Production**
   - Automatic via `.github/workflows/migrate.yml`
   - Only runs when migration files change

---

## Learning Resources

For deeper understanding of the architectural choices:

- **Next.js App Router:** https://nextjs.org/docs/app
- **Supabase SSR:** https://supabase.com/docs/guides/auth/server-side/nextjs
- **React Server Components:** https://react.dev/reference/rsc/server-components
- **TypeScript Best Practices:** https://www.typescriptlang.org/docs/handbook/
- **Testing Library:** https://testing-library.com/docs/react-testing-library/intro/
- **PostgreSQL RLS:** https://supabase.com/docs/guides/auth/row-level-security
