# Software Development Plan
**Next.js + Supabase Starter Application**

**Reference:** [Copilot Instructions](.github/copilot-instructions.md)

---

## 📋 Project Overview

This plan outlines the development of a production-ready Next.js + Supabase starter application with authentication, automatic profile creation, and proper Row Level Security policies. The project follows a **test-first approach** and emphasizes best practices for modern web development.

---

## 📈 Progress Tracking

**Current Status:** Phase 1 Complete ✅

| Phase | Status | Completion | Notes |
|-------|--------|-----------|-------|
| Phase 1: Project Foundation | ✅ COMPLETE | 100% | Project structure, config, and code quality setup finished. All verification checks passed. |
| Phase 2: Testing Framework | ⏳ PENDING | 0% | Ready to start: Install Vitest, configure tests, create mocks |
| Phase 3: Supabase Config | ⏳ PENDING | 0% | |
| Phase 4: Auth Utilities | ⏳ PENDING | 0% | |
| Phase 5: Database Schema | ⏳ PENDING | 0% | |
| Phase 6: UI Components | ⏳ PENDING | 0% | |
| Phase 7: Page Implementation | ⏳ PENDING | 0% | |
| Phase 8: Avatar Upload | ⏳ PENDING | 0% | |
| Phase 9: Setup Script | ⏳ PENDING | 0% | |
| Phase 10: GitHub Actions | ⏳ PENDING | 0% | |
| Phase 11: Documentation | ⏳ PENDING | 0% | Ongoing throughout development |
| Phase 12: Final QA | ⏳ PENDING | 0% | |
| Phase 13: Deployment | ⏳ PENDING | 0% | |

**Overall Progress:** 1/13 phases complete (7.7%)

---

## 📝 Phase 1 Summary

### ✅ What Was Completed

**Project Foundation & Configuration - COMPLETE**

All tasks for Phase 1 have been successfully completed and verified:

- ✅ Created complete directory structure:
  - `components/` (ui, auth, shared subdirectories) with README
  - `lib/` (hooks, utils, types, auth, supabase subdirectories) with README
  - `__tests__/` (unit, components, integration, helpers) with README
  - `supabase/schemas/` with README
  - `app/` updated with new metadata

- ✅ Configuration files added:
  - `.prettierrc` - Code formatting rules
  - `.prettierignore` - Formatting ignore patterns
  - `.env.local.example` - Environment template
  - Updated `package.json` with 10 npm scripts

- ✅ Code quality improvements:
  - Fixed `lib/supabase/server.ts` - Async cookie handling corrected
  - Fixed `lib/supabase/client.ts` - Added "use client" directive
  - Fixed `proxy.ts` - Middleware regex and async patterns corrected
  - Updated `lib/supabase.js` - Deprecated with migration guidance

- ✅ All verification checks passed:
  - `npm run type-check` ✅
  - `npm run lint` ✅
  - `npm run build` ✅

---

## Key Deliverables

1.  Fully functional Next.js 13+ application with TypeScript
2.  Supabase integration with authentication
3.  Automatic profile creation via database triggers
4.  Row Level Security policies on all tables
5.  Automated setup script for project initialization
6.  Comprehensive test suite (unit, component, integration)
7.  Complete documentation (README + inline comments)
8.  GitHub Actions workflow for migrations

---

##  Development Phases

### Phase 1: Project Foundation & Configuration
**Goal:** Set up the development environment and project structure

#### 1.1 Initial Project Setup
- [ ] Verify Next.js application is properly configured
- [ ] Ensure TypeScript strict mode is enabled in `tsconfig.json`
- [ ] Review and update `package.json` dependencies
- [ ] Set up ESLint and Prettier configurations
- [ ] Create `.env.local.example` template file

**Files to Review/Create:**
- `package.json`
- `tsconfig.json`
- `.eslintrc.json`
- `.prettierrc`
- `.env.local.example`

#### 1.2 Directory Structure Setup
- [ ] Create `components/` directory structure:
  - `components/ui/` - Reusable UI components
  - `components/auth/` - Authentication components
  - `components/shared/` - Shared feature components
- [ ] Create `lib/` directory structure:
  - `lib/hooks/` - Custom React hooks
  - `lib/utils/` - Pure utility functions
  - `lib/types/` - Shared TypeScript types
  - `lib/auth/` - Auth utility functions
- [ ] Create `__tests__/` directory structure:
  - `__tests__/unit/` - Pure function tests
  - `__tests__/components/` - Component tests
  - `__tests__/integration/` - Integration tests
  - `__tests__/helpers/` - Test utilities and mocks
- [ ] Create `supabase/schemas/` directory for declarative schemas

**Deliverable:** Well-organized project structure following [Project Rules](.github/copilot-instructions.md#-code-organization)

---

### Phase 2: Testing Framework Setup
**Goal:** Establish testing infrastructure BEFORE writing application code

#### 2.1 Install Testing Dependencies
- [ ] Install Vitest (or Jest)
- [ ] Install React Testing Library
- [ ] Install testing utilities (@testing-library/user-event, @testing-library/jest-dom)
- [ ] Configure Vitest/Jest configuration file

**Commands:**
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

#### 2.2 Configure Testing Environment
- [ ] Create `vitest.config.ts` (or `jest.config.js`)
- [ ] Set up test utilities in `__tests__/helpers/`
- [ ] Create mock Supabase client for testing
- [ ] Add test scripts to `package.json`:
  - `test` - Run all tests
  - `test:watch` - Watch mode
  - `test:coverage` - Generate coverage report

**Files to Create:**
- `vitest.config.ts`
- `__tests__/helpers/mockSupabase.ts`
- `__tests__/helpers/testUtils.tsx`

#### 2.3 Write Example Tests
- [ ] Create example component test (`__tests__/components/Button.test.tsx`)
- [ ] Create example utility test (`__tests__/unit/formatDate.test.ts`)
- [ ] Create example integration test stub for auth flow
- [ ] Verify all tests run successfully

**Deliverable:** Functional testing framework with example tests passing

---

### Phase 3: Supabase Configuration & Client Setup
**Goal:** Configure Supabase for local development and create client utilities

#### 3.1 Supabase Local Setup
- [ ] Verify Supabase CLI is installed
- [ ] Review existing `supabase/config.toml`
- [ ] Document Supabase initialization commands in README
- [ ] Create Supabase client type definitions

**Files to Review:**
- `supabase/config.toml`

#### 3.2 Supabase Client Utilities (Test-First)
**⚠️ Write tests BEFORE implementation**

- [ ] **TEST:** Write tests for server-side Supabase client
  - Test cookie handling
  - Test session retrieval
  - Test error handling
- [ ] **IMPLEMENT:** Create `lib/supabase/server.ts`
  - Use `@supabase/ssr`
  - Implement cookie-based auth
  - Handle server-side session management

- [ ] **TEST:** Write tests for client-side Supabase client
  - Test client initialization
  - Test browser storage
- [ ] **IMPLEMENT:** Create `lib/supabase/client.ts`
  - Use `@supabase/ssr`
  - Implement browser-based auth

- [ ] **TEST:** Write tests for middleware
  - Test token refresh logic
  - Test route protection
- [ ] **IMPLEMENT:** Update/create `middleware.ts`
  - Implement automatic token refresh
  - Add route protection logic

**Files to Create/Update:**
- `__tests__/unit/supabase/server.test.ts`
- `__tests__/unit/supabase/client.test.ts`
- `__tests__/unit/middleware.test.ts`
- `lib/supabase/server.ts` (update if exists)
- `lib/supabase/client.ts` (update if exists)
- `middleware.ts`

**Deliverable:** Properly configured Supabase clients with passing tests

---

### Phase 4: Authentication Utilities (Test-First)
**Goal:** Create reusable authentication patterns

#### 4.1 Server-Side Auth Utilities
**⚠️ Write tests BEFORE implementation**

- [ ] **TEST:** Write tests for `getUser()` function
  - Test successful user retrieval
  - Test handling null user
  - Test error cases
- [ ] **IMPLEMENT:** Create `lib/auth/server.ts`
  - Implement `getUser()` function
  - Implement `requireAuth()` function

**Files to Create:**
- `__tests__/unit/auth/server.test.ts`
- `lib/auth/server.ts`

#### 4.2 Client-Side Auth Hook
**⚠️ Write tests BEFORE implementation**

- [ ] **TEST:** Write tests for `useAuth()` hook
  - Test loading states
  - Test user state management
  - Test sign out functionality
  - Test error handling
- [ ] **IMPLEMENT:** Create `lib/hooks/useAuth.ts`
  - Return user, loading, error states
  - Provide sign out method
  - Handle auth state changes

**Files to Create:**
- `__tests__/hooks/useAuth.test.ts`
- `lib/hooks/useAuth.ts`

**Deliverable:** Standardized auth patterns with comprehensive tests

---

### Phase 5: Database Schema & Migrations
**Goal:** Create profiles table with RLS policies and automatic creation trigger

#### 5.1 Declarative Schema Definition
- [ ] Create `supabase/schemas/profiles.sql` with declarative schema:
  - `id` (UUID, primary key, references auth.users)
  - `email` (TEXT, NOT NULL)
  - `full_name` (TEXT)
  - `avatar_url` (TEXT)
  - `created_at` (TIMESTAMPTZ, default NOW())
  - `updated_at` (TIMESTAMPTZ, default NOW())
- [ ] Define RLS policies in schema:
  - Enable RLS
  - SELECT policy: users can read own profile
  - UPDATE policy: users can update own profile
  - INSERT policy: users can insert own profile
- [ ] Define trigger function for `updated_at` auto-update
- [ ] Define trigger function for automatic profile creation
- [ ] Document schema design decisions

**Files to Create:**
- `supabase/schemas/profiles.sql`

#### 5.2 Generate and Review Migration
- [ ] Run `npx supabase db diff -f create_profiles_table` to generate migration
- [ ] Review generated migration file in `supabase/migrations/`
- [ ] Verify all RLS policies are included
- [ ] Verify trigger functions are included
- [ ] Test migration locally with `npx supabase db reset`
- [ ] Verify profile creation trigger works (test signup)

**Files Generated:**
- `supabase/migrations/YYYYMMDDHHMMSS_create_profiles_table.sql`

#### 5.3 Test Database Policies (Integration Tests)
- [ ] Write integration test for automatic profile creation
- [ ] Write integration test for RLS SELECT policy
- [ ] Write integration test for RLS UPDATE policy
- [ ] Write integration test for RLS policy violations
- [ ] Run tests against local Supabase instance

**Files to Create:**
- `__tests__/integration/profileCreation.test.ts`
- `__tests__/integration/profileRLS.test.ts`

**Deliverable:** Production-ready database schema with tested RLS policies

---

### Phase 6: UI Components (Test-First)
**Goal:** Create reusable UI components with tests

#### 6.1 Basic UI Components
**⚠️ Write tests BEFORE implementation**

For each component:
1. Write component tests first
2. Implement component to pass tests
3. Add proper TypeScript types
4. Add JSDoc comments

**Components to Create:**

- [ ] **Button Component**
  - [ ] TEST: `__tests__/components/ui/Button.test.tsx`
  - [ ] IMPLEMENT: `components/ui/Button.tsx`
  - Variants: primary, secondary, danger
  - Loading state support
  - Disabled state

- [ ] **Input Component**
  - [ ] TEST: `__tests__/components/ui/Input.test.tsx`
  - [ ] IMPLEMENT: `components/ui/Input.tsx`
  - Types: text, email, password
  - Error state display
  - Label support

- [ ] **Form Component**
  - [ ] TEST: `__tests__/components/ui/Form.test.tsx`
  - [ ] IMPLEMENT: `components/ui/Form.tsx`
  - Form submission handling
  - Error display
  - Loading state

- [ ] **Card Component**
  - [ ] TEST: `__tests__/components/ui/Card.test.tsx`
  - [ ] IMPLEMENT: `components/ui/Card.tsx`
  - Layout wrapper
  - Title/description support

#### 6.2 Auth Components
**⚠️ Write tests BEFORE implementation**

- [ ] **LoginForm Component**
  - [ ] TEST: `__tests__/components/auth/LoginForm.test.tsx`
  - [ ] IMPLEMENT: `components/auth/LoginForm.tsx`
  - Email/password fields
  - Error handling
  - Loading state
  - Submit handler

- [ ] **SignupForm Component**
  - [ ] TEST: `__tests__/components/auth/SignupForm.test.tsx`
  - [ ] IMPLEMENT: `components/auth/SignupForm.tsx`
  - Email/password fields
  - Password confirmation
  - Error handling
  - Loading state

- [ ] **ProfileForm Component**
  - [ ] TEST: `__tests__/components/auth/ProfileForm.test.tsx`
  - [ ] IMPLEMENT: `components/auth/ProfileForm.tsx`
  - Full name field
  - Avatar upload
  - Save button
  - Error/success states

**Deliverable:** Fully tested, reusable component library

---

### Phase 7: Page Implementation (Test-First)
**Goal:** Build all required pages with proper authentication

#### 7.1 Public Pages

- [ ] **Home Page (`app/page.tsx`)**
  - [ ] TEST: Integration test for home page rendering
  - [ ] IMPLEMENT: Home page component
  - Welcome message
  - Auth status display
  - Conditional navigation links
  - Server Component (default)

- [ ] **Login Page (`app/(auth)/login/page.tsx`)**
  - [ ] TEST: Integration test for login flow
  - [ ] IMPLEMENT: Login page
  - Use LoginForm component
  - Redirect logic after successful login
  - Error handling
  - Client Component (for form interactivity)

- [ ] **Signup Page (`app/(auth)/signup/page.tsx`)**
  - [ ] TEST: Integration test for signup flow
  - [ ] IMPLEMENT: Signup page
  - Use SignupForm component
  - Redirect logic after successful signup
  - Error handling
  - Client Component

#### 7.2 Protected Pages

- [ ] **Dashboard Page (`app/(dashboard)/dashboard/page.tsx`)**
  - [ ] TEST: Integration test for auth protection
  - [ ] TEST: Test user info display
  - [ ] IMPLEMENT: Dashboard page
  - Use `requireAuth()` for protection
  - Display user profile info
  - Navigation links
  - Sign out button
  - Server Component with client components for interactive parts

- [ ] **Profile Page (`app/(dashboard)/profile/page.tsx`)**
  - [ ] TEST: Integration test for profile loading
  - [ ] TEST: Test profile update flow
  - [ ] TEST: Test avatar upload
  - [ ] IMPLEMENT: Profile page
  - Use `requireAuth()` for protection
  - Use ProfileForm component
  - Load current profile data
  - Handle updates
  - Avatar upload functionality

#### 7.3 Layouts

- [ ] **Root Layout (`app/layout.tsx`)**
  - [ ] Update with proper metadata
  - [ ] Add global styles
  - [ ] Add providers if needed

- [ ] **Auth Layout (`app/(auth)/layout.tsx`)**
  - [ ] Create layout for auth pages
  - [ ] Redirect to dashboard if already logged in

- [ ] **Dashboard Layout (`app/(dashboard)/layout.tsx`)**
  - [ ] Create layout for protected pages
  - [ ] Add navigation
  - [ ] Add sign out button

**Files to Create:**
- `app/(auth)/login/page.tsx`
- `app/(auth)/signup/page.tsx`
- `app/(auth)/layout.tsx`
- `app/(dashboard)/dashboard/page.tsx`
- `app/(dashboard)/profile/page.tsx`
- `app/(dashboard)/layout.tsx`
- `__tests__/integration/auth-flow.test.ts`
- `__tests__/integration/profile-page.test.ts`

**Deliverable:** Fully functional pages with authentication flows

---

### Phase 8: Avatar Upload Functionality
**Goal:** Implement file upload to Supabase Storage

#### 8.1 Supabase Storage Setup
- [ ] Create storage bucket in Supabase (via migration or manually for local dev)
- [ ] Configure storage policies (public read, authenticated write)
- [ ] Document bucket configuration

#### 8.2 Upload Utility (Test-First)
**⚠️ Write tests BEFORE implementation**

- [ ] **TEST:** Write tests for `uploadAvatar()` utility
  - Test file validation (size, type)
  - Test successful upload
  - Test error handling
  - Mock Supabase storage
- [ ] **IMPLEMENT:** Create `lib/utils/uploadAvatar.ts`
  - File validation
  - Upload to Supabase Storage
  - Generate public URL
  - Error handling

**Files to Create:**
- `__tests__/unit/utils/uploadAvatar.test.ts`
- `lib/utils/uploadAvatar.ts`

#### 8.3 Integrate Upload into ProfileForm
- [ ] Add file input to ProfileForm
- [ ] Add upload handler
- [ ] Update profile with avatar URL
- [ ] Display uploaded avatar
- [ ] Add loading/error states for upload

**Deliverable:** Fully functional avatar upload with tests

---

### Phase 9: Setup Script Development
**Goal:** Create automated setup script for project initialization

#### 9.1 Design Setup Script
- [ ] Choose implementation approach (bash vs Node.js)
- [ ] Plan script flow and error handling
- [ ] Identify all required steps

#### 9.2 Implement Setup Script (Test Each Step)

**Script Requirements:**
- [ ] Check prerequisites (Node.js, Supabase CLI)
- [ ] Install npm dependencies (`npm install`)
- [ ] Check if Supabase is already running
- [ ] Start Supabase (`npx supabase start`)
- [ ] Extract credentials from `npx supabase status`:
  - API URL
  - Anon Key
  - (Optional) Service Role Key
- [ ] Create or update `.env.local` file
- [ ] Run database migrations (`npx supabase db reset`)
- [ ] Provide clear success message with next steps
- [ ] Handle errors gracefully with helpful messages

**Files to Create:**
- `setup.sh` (or `setup.js` or `setup.ts`)
- Make script executable: `chmod +x setup.sh`

#### 9.3 Test Setup Script
- [ ] Test on clean environment (delete `node_modules`, `.env.local`)
- [ ] Test when Supabase already running
- [ ] Test when `.env.local` already exists
- [ ] Test error handling (e.g., Supabase CLI not installed)
- [ ] Verify all environment variables are set correctly
- [ ] Verify migrations run successfully
- [ ] Verify app starts and works after setup

**Deliverable:** Robust, idempotent setup script

---

### Phase 10: GitHub Actions Workflow
**Goal:** Automate database migrations on deployment

#### 10.1 Create GitHub Actions Workflow
- [ ] Create `.github/workflows/` directory
- [ ] Create migration workflow file (e.g., `migrate.yml`)
- [ ] Configure workflow to run on push to main
- [ ] Set up Supabase project linking
- [ ] Test workflow (push to GitHub and verify)

**Files to Create:**
- `.github/workflows/migrate.yml`

**Workflow Should:**
- Install Supabase CLI
- Link to Supabase project
- Run migrations
- Report success/failure

**Deliverable:** Automated migration workflow

---

### Phase 11: Documentation (Ongoing Throughout Development)
**Goal:** Document as you build - don't leave it for the end

#### 11.1 Documentation Strategy
**Documentation should be completed alongside each phase, not as a separate task.**

For each phase, documentation tasks include:
- [ ] Add JSDoc comments to all exported functions as they're created
- [ ] Add inline comments explaining WHY (not WHAT) for complex logic
- [ ] Document component props with TypeScript types
- [ ] Update relevant sections of README.md as features are implemented
- [ ] Create README files in new directories explaining their purpose

#### 11.2 Phase-by-Phase Documentation Checklist

**During Phase 1-2 (Foundation & Testing):**
- [ ] Document project structure in README
- [ ] Document testing setup and how to run tests
- [ ] Create initial README with project overview and prerequisites

**During Phase 3-5 (Supabase & Auth):**
- [ ] Document Supabase setup and configuration
- [ ] Document authentication patterns (useAuth hook, getUser, requireAuth)
- [ ] Add comments to auth-related utility functions
- [ ] Document database schema design decisions

**During Phase 6-7 (Components & Pages):**
- [ ] Add JSDoc comments to all component files
- [ ] Document component prop interfaces
- [ ] Add comments to complex component logic
- [ ] Document page-level routing structure

**During Phase 8-9 (Features & Setup):**
- [ ] Document avatar upload process and validation
- [ ] Document setup script usage and troubleshooting
- [ ] Document how to create and run migrations

**During Phase 10 (GitHub Actions):**
- [ ] Document CI/CD workflow and how it works

#### 11.3 Final Documentation Review (Phase 12)
Before final QA, complete any remaining documentation:
- [ ] Ensure all exported functions have JSDoc comments
- [ ] Review all comments for accuracy and clarity
- [ ] Complete comprehensive README.md with all sections:
  - Project overview and objectives
  - Tech stack with versions
  - Prerequisites and installation
  - Quick start guide (using setup script)
  - Manual setup instructions (step-by-step)
  - Project structure explanation
  - Authentication patterns documentation
  - Testing instructions (how to run, how to add tests, coverage info)
  - Deployment guide
  - Environment variables reference
  - Troubleshooting section
  - Contributing guidelines
- [ ] Create `ARCHITECTURE.md` documenting key architectural decisions
- [ ] Create `DEPLOYMENT.md` with detailed production deployment steps
- [ ] Create `DATABASE.md` documenting schema, RLS policies, and triggers
- [ ] Add README files in major directories:
  - `lib/README.md` - Utility and helper functions
  - `components/README.md` - Component organization and usage
  - `app/README.md` - Page structure and routing
  - `supabase/README.md` - Schema and migration information

**Deliverable:** Professional, comprehensive, up-to-date documentation throughout the project

**Key Principle:** Never say "I'll document this later" - it never happens. Write documentation as you implement features.

---

### Phase 12: Final Testing & Quality Assurance
**Goal:** Ensure everything works end-to-end

#### 12.1 Full Test Suite Run
- [ ] Run all unit tests
- [ ] Run all component tests
- [ ] Run all integration tests
- [ ] Check test coverage (aim for >80% on critical paths)
- [ ] Fix any failing tests

#### 12.2 Manual Testing Checklist
- [ ] Test complete signup flow
- [ ] Verify automatic profile creation
- [ ] Test login flow
- [ ] Test protected route access (when logged out)
- [ ] Test protected route access (when logged in)
- [ ] Test profile viewing
- [ ] Test profile editing
- [ ] Test avatar upload
- [ ] Test sign out
- [ ] Test RLS policies (try to access other users' data)

#### 12.3 Code Quality Checks
- [ ] Run TypeScript compiler (`npx tsc --noEmit`)
- [ ] Run ESLint (`npm run lint`)
- [ ] Format code with Prettier
- [ ] Review for any `any` types
- [ ] Check for console.log statements to remove
- [ ] Review error handling coverage

#### 12.4 Fresh Setup Test
- [ ] Delete `node_modules/`
- [ ] Delete `.env.local`
- [ ] Stop Supabase (`npx supabase stop`)
- [ ] Run setup script
- [ ] Verify app works correctly
- [ ] Test all features again

**Deliverable:** Production-ready application

---

### Phase 13: Deployment Preparation
**Goal:** Prepare for production deployment

#### 13.1 Production Checklist
- [ ] Create production Supabase project
- [ ] Run migrations on production database
- [ ] Configure production environment variables
- [ ] Test deployment on Vercel/Netlify (or chosen platform)
- [ ] Verify authentication works in production
- [ ] Verify RLS policies work in production
- [ ] Test avatar upload in production

#### 13.2 Performance & Security Review
- [ ] Verify all routes have proper authentication
- [ ] Check for exposed secrets
- [ ] Review RLS policies one final time
- [ ] Test with slow network connection
- [ ] Check bundle size
- [ ] Run Lighthouse audit

**Deliverable:** Deployed, production-ready application

---

## 📊 Project Milestones

| Milestone | Phases | Completion Criteria |
|-----------|--------|---------------------|
| **M1: Foundation** | 1-2 | Project structure set up, testing framework working |
| **M2: Backend Ready** | 3-5 | Supabase configured, auth working, database schema deployed |
| **M3: UI Complete** | 6-7 | All components and pages implemented with tests |
| **M4: Features Done** | 8-9 | Avatar upload working, setup script functional |
| **M5: Ready to Ship** | 10-13 | Documentation complete, all tests passing, deployed |

---

## 🔄 Daily Workflow

1. **Review current phase tasks**
2. **Write tests first** (for new features)
3. **Implement code** to pass tests
4. **Run test suite** to ensure nothing broke
5. **Update documentation** if needed
6. **Commit with descriptive message**
7. **Update this plan** with progress

---

## 📝 Notes & Decisions

### Key Architectural Decisions
- Using `@supabase/ssr` for SSR support
- Implementing automatic profile creation via database trigger (not application code)
- Using declarative schemas and generated migrations (never manual SQL)
- Test-first approach for all new features
- Separate client utilities for server vs client components

### Testing Strategy
- **Unit tests:** All utility functions, pure functions
- **Component tests:** All UI components, forms
- **Integration tests:** Authentication flows, database operations, RLS policies
- Mock Supabase clients in tests
- Aim for >80% coverage on critical paths

### Technology Choices
- **Testing:** Vitest (faster than Jest, better ESM support)
- **Styling:** TailwindCSS (utility-first, rapid development)
- **Storage:** Supabase Storage (integrated, RLS support)
- **Deployment:** Vercel (optimal Next.js support)

---

## 🚨 Risk Management

| Risk | Mitigation |
|------|------------|
| RLS policies not working correctly | Write comprehensive integration tests for all policies |
| Automatic profile creation fails | Test trigger function thoroughly, add error handling |
| Setup script fails on different OS | Test on Windows, Mac, Linux; provide fallback instructions |
| Authentication state issues in SSR | Use `@supabase/ssr` correctly, test both server and client |
| Migration conflicts | Use descriptive names, version control all migrations |

---

## ✅ Definition of Done

A task is considered complete when:
- [ ] Tests are written and passing
- [ ] Code is implemented and working
- [ ] TypeScript types are properly defined
- [ ] Error handling is in place
- [ ] Code is documented (JSDoc + inline comments)
- [ ] No ESLint errors
- [ ] Committed to version control
- [ ] Documentation updated if needed

---

## 📚 References

- [Copilot Instructions](.github/copilot-instructions.md) - Project rules and conventions
- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)

---

**Last Updated:** February 11, 2026  
**Status:** Planning Phase  
**Next Action:** Begin Phase 1 - Project Foundation & Configuration
