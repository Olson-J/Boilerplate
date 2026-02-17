# Project Rules & Guidelines

**Last Updated:** February 11, 2026

This document serves as the authoritative guide for development practices, conventions, and requirements for this Next.js + Supabase project. **All development must adhere to these rules.**

---

## 🎯 Project Objectives

1. **Integrate Next.js with Supabase** for authentication and database operations
2. **Implement automatic profile creation** when a user signs up
3. **Configure Row Level Security (RLS) policies** correctly on the profile model
4. **Use Supabase declarative schemas** for database models
5. **Create a setup script** that automates project initialization
6. **Follow best practices** for Next.js + Supabase integration

---

## 📋 Core Technical Requirements

### Technology Stack
- **Framework:** Next.js 13+ (App Router)
- **Language:** TypeScript (strictly typed, no `any` types unless absolutely necessary)
- **Backend/Auth:** Supabase with `@supabase/ssr` for SSR support
- **Testing:** Vitest or Jest with React Testing Library
- **Directory Structure:** Use `app/` directory, NOT `pages/`

### Non-Negotiable Rules

#### 1. TypeScript Everywhere
- ✅ All files must use TypeScript (`.ts`, `.tsx`)
- ✅ Properly type all function parameters and return values
- ✅ Use interfaces/types for data structures
- ❌ Avoid `any` types - use `unknown` if type is truly unknown
- ✅ Enable strict mode in `tsconfig.json`

#### 2. Next.js App Router Conventions
- ✅ Use `app/` directory structure
- ✅ Follow file-based routing conventions
- ✅ Use Server Components by default
- ✅ Mark Client Components explicitly with `'use client'`
- ✅ Use Server Actions for mutations when appropriate
- ❌ Do NOT use legacy `pages/` directory

#### 3. Supabase Integration
- ✅ Use `@supabase/ssr` for all Supabase operations
- ✅ Create separate client instances for:
  - Server Components (`lib/supabase/server.ts`)
  - Client Components (`lib/supabase/client.ts`)
  - Middleware/Route Handlers (as needed)
- ✅ Always handle auth state properly in SSR context
- ✅ Use environment variables for Supabase credentials

#### 4. Database Schema Management
- ✅ **ALL schema changes must be in migration files**
- ✅ Use declarative schemas in `supabase/schemas/`
- ✅ Generate migrations from schemas (never write migrations manually first)
- ❌ **NEVER execute SQL manually** in Supabase dashboard for schema changes
- ✅ Version control all migration files
- ✅ Use descriptive migration names with timestamps

#### 5. Row Level Security (RLS)
- ✅ Enable RLS on ALL tables
- ✅ Define policies in declarative schema files
- ✅ Test RLS policies for each user role/scenario
- ✅ Document what each policy does
- ❌ Never bypass RLS in production code

---

## 🏗️ Code Organization

### Directory Structure
```
app/                    # Next.js App Router pages and layouts
  ├── (auth)/          # Auth-related pages (login, signup, etc.)
  ├── (dashboard)/     # Protected dashboard pages
  └── api/             # API routes

lib/                   # Utility functions and core logic
  ├── supabase/        # Supabase client configurations
  ├── hooks/           # Custom React hooks
  ├── utils/           # Pure utility functions
  └── types/           # Shared TypeScript types

components/            # React components
  ├── ui/              # Reusable UI components (buttons, inputs, etc.)
  ├── auth/            # Authentication-related components
  └── shared/          # Shared feature components

supabase/
  ├── schemas/         # Declarative database schemas
  └── migrations/      # Generated migration files

__tests__/             # Test files (mirror src structure)
  ├── components/
  ├── lib/
  └── integration/
```

### File Naming Conventions
- **Components:** PascalCase (`UserProfile.tsx`, `LoginForm.tsx`)
- **Utilities:** camelCase (`formatDate.ts`, `validateEmail.ts`)
- **Hooks:** camelCase with `use` prefix (`useAuth.ts`, `useUser.ts`)
- **Types:** PascalCase (`User.ts`, `AuthState.ts`)
- **Test files:** Same as source file + `.test.ts(x)` (`UserProfile.test.tsx`)

---

## 🔐 Authentication Patterns

### Standardized Auth Utilities

#### For Client Components
```typescript
// lib/hooks/useAuth.ts
export function useAuth() {
  // Returns user, loading state, and auth methods
}
```
- ✅ Use `useAuth()` hook in all client components needing auth
- ✅ Handle loading states properly
- ✅ Redirect unauthenticated users consistently

#### For Server Components
```typescript
// lib/auth/server.ts
export async function getUser() {
  // Returns user from server-side session
}

export async function requireAuth() {
  // Throws or redirects if not authenticated
}
```
- ✅ Use `getUser()` or `requireAuth()` in server components
- ✅ Always handle null user case
- ✅ Use middleware for route-level protection when appropriate

### Auth Flow Requirements
- ✅ Automatic profile creation on signup (use database trigger)
- ✅ Email verification flow implemented
- ✅ Proper session management with cookies
- ✅ Logout clears all client-side state
- ✅ Handle token refresh automatically

---

## 🧪 Testing Requirements (Test-First Approach)

### Testing Philosophy
**Write tests BEFORE implementing features.** This ensures:
- Clear requirements understanding
- Better code design
- Confidence in refactoring

### Test Coverage Requirements
- ✅ Unit tests for all utility functions
- ✅ Component tests for UI components
- ✅ Integration tests for auth flows
- ✅ E2E tests for critical user journeys (optional but recommended)

### Testing Framework Setup
- **Framework:** Vitest (or Jest)
- **Component Testing:** React Testing Library
- **Mocking:** Mock Supabase clients in tests
- **Coverage:** Aim for >80% coverage on critical paths

### Test File Organization
```
__tests__/
  ├── unit/           # Pure function tests
  ├── components/     # Component tests
  ├── integration/    # Integration tests
  └── helpers/        # Test utilities and mocks
```

### Testing Conventions
- ✅ Test file names match source files with `.test.ts(x)` suffix
- ✅ Use descriptive test names: `it('should create profile when user signs up')`
- ✅ Follow AAA pattern: Arrange, Act, Assert
- ✅ Mock external dependencies (Supabase, APIs)
- ✅ Test error cases, not just happy paths

### Running Tests
```bash
npm run test          # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

---

## 🛡️ Error Handling

### Error Handling Principles
- ✅ Always handle errors explicitly (no silent failures)
- ✅ Provide user-friendly error messages
- ✅ Log errors appropriately (server-side)
- ✅ Use try-catch blocks for async operations
- ✅ Return structured error responses from API routes

### Error Handling Patterns
```typescript
// For async operations
try {
  const result = await someOperation();
  return { data: result, error: null };
} catch (error) {
  console.error('Operation failed:', error);
  return { data: null, error: 'User-friendly message' };
}
```

### Supabase Error Handling
- ✅ Check for `error` in Supabase responses
- ✅ Handle specific error codes (auth, RLS violations, etc.)
- ✅ Don't expose internal error details to users

---

## 📝 Code Quality Standards

### Code Style
- ✅ Use ESLint configuration (enforce with pre-commit hooks)
- ✅ Format with Prettier
- ✅ Use meaningful variable names
- ✅ Keep functions small and focused (single responsibility)
- ✅ Avoid deep nesting (max 3-4 levels)

### Comments
- ✅ Comment WHY, not WHAT
- ✅ Add JSDoc comments to exported functions
- ✅ Document complex business logic
- ✅ Add TODO comments with ticket references
- ❌ Don't comment obvious code

### Component Design
- ✅ Prefer composition over props drilling
- ✅ Keep components focused (single responsibility)
- ✅ Extract reusable logic to hooks
- ✅ Use proper TypeScript prop types
- ✅ Implement proper loading and error states

---

## 🚀 Setup & Deployment

### Initial Setup Script
- ✅ Must include `setup.sh` or `setup.ts` script
- ✅ Script should:
  - Install dependencies
  - Set up environment variables
  - Initialize Supabase
  - Run migrations
  - Seed development data
  - Run initial tests

### Environment Variables
```bash
# Required variables
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```
- ✅ Use `.env.local` for local development
- ✅ Never commit secrets to version control
- ✅ Document all required env vars in README

### Pre-Deployment Checklist
- [ ] All tests passing
- [ ] TypeScript compiles without errors
- [ ] ESLint shows no errors
- [ ] RLS policies tested
- [ ] Environment variables configured
- [ ] Migrations applied

---

## 📚 Documentation Requirements

### README.md Must Include
1. **Project overview** and objectives
2. **Tech stack** with versions
3. **Setup instructions** (step-by-step)
4. **Authentication patterns** documentation
5. **Code organization** and conventions
6. **Testing** instructions and examples
7. **Deployment** guide
8. **Troubleshooting** common issues

### Code Documentation
- ✅ JSDoc comments on exported functions
- ✅ Inline comments for complex logic
- ✅ Component prop documentation
- ✅ README in major directories explaining purpose

---

## ⚠️ Common Pitfalls to Avoid

❌ **Don't:**
- Use `any` types excessively
- Execute SQL manually in Supabase dashboard
- Skip RLS policies ("I'll add them later")
- Commit environment variables
- Mix Server and Client Component patterns incorrectly
- Use `pages/` directory
- Skip writing tests
- Hard-code configuration values

✅ **Do:**
- Write tests first
- Use TypeScript strictly
- Follow the App Router conventions
- Handle all error cases
- Document your decisions
- Use migration files for schema changes
- Enable and test RLS policies
- Create reusable patterns

---

## 🔄 Development Workflow

### Feature Development Process
1. **Write tests first** (TDD approach)
2. **Implement feature** to pass tests
3. **Refactor** if needed
4. **Update documentation** if behavior changes
5. **Run full test suite**
6. **Commit with descriptive message**

### Git Commit Convention
```
feat: Add user profile creation
fix: Resolve RLS policy for profiles
docs: Update authentication patterns
test: Add tests for signup flow
refactor: Extract auth utilities to separate file
```

---

## 📞 When in Doubt

If you encounter a situation not covered by these rules:

1. **Check Next.js documentation** for App Router best practices
2. **Check Supabase documentation** for SSR patterns
3. **Maintain consistency** with existing code patterns
4. **Document your decision** and add to this rules document
5. **Write tests** to validate your approach

---

## 🎓 Learning Resources

- [Next.js App Router Docs](https://nextjs.org/docs/app)
- [Supabase + Next.js Guide](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [TypeScript Best Practices](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

---

**Remember:** These rules exist to maintain consistency, quality, and best practices. Follow them strictly for a maintainable, robust application.
