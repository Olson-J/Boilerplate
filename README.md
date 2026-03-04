# Assignment 2: Boilerplate

This app will be the basis of future projects. It demonstrates best practices for building a Next.js application with Supabase authentication, including automatic profile creation, Row Level Security policies, and comprehensive testing.

---

## Using as a Starter App for New Projects

This boilerplate is designed to be reused as a foundation for new projects. Here's how to use it:

### Option 1: Clone and Customize
1. **Start with this boilerplate:**
   ```bash
   git clone <this-repo-url> my-new-project
   cd my-new-project
   ```

2. **Update project identification:**
   - Edit [package.json](package.json): Change `name`, `description`, and `version` fields
   - Edit [README.md](README.md): Update the title and project description
   - Edit [app/layout.tsx](app/layout.tsx): Update metadata and app name

3. **Customize for your project:**
   - Modify [supabase/schemas/profiles.sql](supabase/schemas/profiles.sql) to add project-specific fields
   - Update authentication flows in [app/(auth)/](app/(auth)/) if needed
   - Customize dashboard layout in [app/(dashboard)/](app/(dashboard)/)
   - Add your own components and utilities

4. **Follow the setup instructions below** and develop your app

### What's Included
-  Complete authentication system (signup, login, logout)
-  Automatic user profile creation
-  Row Level Security (RLS) policies
-  User avatar upload to Supabase Storage
-  Account deletion functionality
-  Comprehensive test suite
-  TypeScript with strict typing
-  ESLint and Prettier configuration
-  GitHub Actions for database migrations

### Next Steps After Cloning
1. Run `npm run setup` to initialize the project
2. Explore [ARCHITECTURE.md](ARCHITECTURE.md) to understand design decisions
3. Read [DATABASE.md](DATABASE.md) for schema and RLS policy details
4. Check [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment

---

## Quick Start (Automated Setup)

The easiest way to get started is using the automated setup script:

```bash
# Install tsx (if not already installed)
npm install

# Run the setup script
npm run setup
```

The setup script will automatically:
-  Check prerequisites (Node.js, npm, Supabase CLI)
-  Install project dependencies
-  Start Supabase local instance
-  Configure environment variables in `.env.local`
-  Run database migrations
-  Run tests to verify everything works

After setup completes, start the development server:
```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Manual Setup (Alternative)

If you prefer to set up manually or need to troubleshoot:

### Prerequisites
- Node.js (v18 or higher) and npm
- Docker Desktop (for Supabase local development)
- Supabase CLI (will be installed via npx)

### Step-by-Step Instructions

1. **Clone and install dependencies**
   ```bash
   npm install
   ```

2. **Start Supabase**
   ```bash
   npx supabase start
   ```
   This will start all Supabase services in Docker. First run may take a few minutes.

3. **Get Supabase credentials**
   ```bash
   npx supabase status
   ```
   Note the `API URL` and `anon key` values.

4. **Configure environment variables**
   
   Create `.env.local` file (or copy from `.env.example`):
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=<API URL from status>
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key from status>
   SUPABASE_SERVICE_ROLE_KEY=<service_role key from status>
   ```
   
   **Important:** The `SUPABASE_SERVICE_ROLE_KEY` is required for admin operations like account deletion. Keep this secret and never expose it in client-side code!

5. **Run database migrations**
   ```bash
   npx supabase db reset
   ```

6. **Run tests to verify**
   ```bash
   npm test
   ```

7. **Start development server**
   ```bash
   npm run dev
   ```

---

## Testing

This project uses **Vitest** as the testing framework with **React Testing Library** for component tests.

### Running Tests

```bash
# Run all tests once
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Test Structure

Tests are organized in `__tests__/` directory:
- `unit/` - Unit tests for utilities and pure functions
- `components/` - Component tests using React Testing Library
- `integration/` - Integration tests for auth flows and RLS policies
- `hooks/` - Custom hook tests
- `helpers/` - Test utilities and mocks

### Writing Tests

See example test files for implementation patterns:

#### Testing Utility Functions
- Example: [__tests__/unit/formatDate.test.ts](__tests__/unit/formatDate.test.ts)
- Pattern: Import function, test with expected inputs/outputs
- Use Vitest's `describe()`, `it()`, and `expect()` functions

#### Testing React Components  
- Example: [__tests__/components/ui/Button.test.tsx](__tests__/components/ui/Button.test.tsx)
- Pattern: Render component, simulate user interaction, assert behavior
- Use `@testing-library/react` for rendering and `userEvent` for interactions

#### Testing Authentication Code
- Example: [__tests__/hooks/useAuth.test.tsx](__tests__/hooks/useAuth.test.tsx)
- Pattern: Mock Supabase client, render hook, verify auth state
- Use `renderHook()` from React Testing Library and `waitFor()` for async

### Adding New Tests

1. Create test file matching source file: `MyComponent.tsx` → `MyComponent.test.tsx`
2. Place in corresponding `__tests__/` subdirectory
3. Use descriptive test names: `it('should do X when Y happens')`
4. Follow AAA pattern: Arrange, Act, Assert
5. Mock external dependencies (Supabase, APIs)

See [__tests__/README.md](__tests__/README.md) for detailed testing guidelines.

---

## Supabase Local Setup

### Common Supabase Commands

#### Start/Stop Local Supabase
```bash
npx supabase start   # Start all services
npx supabase stop    # Stop all services
```

#### Check Status
```bash
npx supabase status  # View running services and credentials
```

#### Database Operations
```bash
# Reset database (runs migrations + seeds)
npx supabase db reset

# Generate migration from schema changes
npx supabase db diff -f <migration_name>

# Create a new migration file
npx supabase migration new <migration_name>
```

#### Access Supabase Studio
Local dashboard: [http://localhost:54323](http://localhost:54323)

### Developer Reference: supabase/ Directory

For detailed information about database schemas, migrations, and workflows, see [supabase/README.md](supabase/README.md).

This guide includes:
- **Schema Guidelines** - How to define tables and RLS policies
- **Migration Workflow** - Local development and production deployment processes
- **Directory Structure** - What's in `schemas/`, `migrations/`, and `config.toml`
- **Production Deployment** - How GitHub Actions automatically applies migrations

---

## Environment Variables

All environment variables are stored in `.env.local` (local development) and configured in production hosting (Vercel, etc.). **Never commit secrets to version control.**

### Required Environment Variables

| Variable | Type | Required | Description |
|----------|------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Public |  Yes | Your Supabase project URL (publicly safe) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public |  Yes | Supabase anonymous key for client-side auth (publicly safe) |
| `SUPABASE_SERVICE_ROLE_KEY` | Secret |  Yes | Service role key for admin operations (keep secret!) |

### Getting Your Credentials

**Local Development:**
```bash
# Start Supabase
npx supabase start

# Get credentials
npx supabase status
```

Copy the values from output:
- `API URL` → `NEXT_PUBLIC_SUPABASE_URL`
- `anon key` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `service_role key` → `SUPABASE_SERVICE_ROLE_KEY`

**Production (Supabase Dashboard):**
1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project
3. Click **Settings → API**
4. Copy credentials from the API section

### Setting Up `.env.local`

**Option 1: Copy from template**
```bash
cp .env.example .env.local
# Then edit .env.local with your actual values
```

**Option 2: Manual creation**
```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

### Security Best Practices

1. **`NEXT_PUBLIC_*` variables** are safe to expose (used in browser)
2. **`SUPABASE_SERVICE_ROLE_KEY`** should NEVER be in client-side code or browser
3. **Private keys** are only used in:
   - Server Components
   - Route Handlers (API routes)
   - Server Actions
   - Build scripts
4. **Keep `.env.local` in `.gitignore`** - it should never be committed
5. **Use `.env.example`** to document required variables (without values)

### Troubleshooting

- **"Cannot find .env.local"**: Run setup script or create it manually
- **"Unauthorized" errors**: Check that keys match your Supabase project
- **"Invalid API URL"**: Verify URL includes `https://` and ends with `.supabase.co`

---

## Database Schema Overview

The application uses PostgreSQL (via Supabase) with Row Level Security (RLS) policies. For complete documentation, see [DATABASE.md](DATABASE.md).

### Core Tables

**`public.profiles`** - User profile data
- Linked to auth.users (one-to-one relationship)
- Stores: email, full_name, avatar_url, bio
- Auto-created when user signs up (via trigger)
- RLS policies: Users can only view/edit their own profile

**`storage.avatars`** - Avatar file storage bucket
- Stores user profile images
- Public read access (images are viewable by all)
- Authenticated write access (users can only upload their own)

### Key Features

- **RLS Enabled**: All tables have Row Level Security policies
- **Data Privacy**: Users can only access their own data
- **Cascading Deletes**: Deleting a user deletes their profile automatically
- **Automatic Timestamps**: `created_at` and `updated_at` managed by database
- **Triggers**: Profile auto-created when a user signs up

### Schema Management

Schemas are defined in [supabase/schemas/](supabase/schemas/):
- [profiles.sql](supabase/schemas/profiles.sql) - User profiles table and RLS policies
- [avatars.sql](supabase/schemas/avatars.sql) - Avatar storage bucket and policies

Migrations are automatically generated from schemas:
```bash
# Generate migration from schema changes
npx supabase db diff --file <name_of_change>

# Apply migrations locally
npx supabase db reset

# Apply to production
npx supabase db push
```

For detailed schema documentation including column descriptions, RLS policies, and triggers, see [DATABASE.md](DATABASE.md).

---

## Project Structure

```
├── app/                      # Next.js App Router pages
│   ├── (auth)/              # Authentication pages (login, signup)
│   ├── (dashboard)/         # Protected dashboard pages
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home page
├── components/               # React components
│   ├── auth/                # Authentication-related components
│   ├── shared/              # Shared components
│   └── ui/                  # Reusable UI components
├── lib/                      # Utilities and core logic
│   ├── auth/                # Server-side auth utilities
│   ├── hooks/               # Custom React hooks
│   ├── supabase/            # Supabase client configurations
│   ├── types/               # TypeScript type definitions
│   └── utils/               # Utility functions
├── supabase/                 # Supabase configuration
│   ├── migrations/          # Database migration files
│   ├── schemas/             # Declarative schema definitions
│   └── seed.sql             # Database seed data
├── __tests__/                # Test files
│   ├── components/          # Component tests
│   ├── helpers/             # Test utilities
│   ├── hooks/               # Hook tests
│   ├── integration/         # Integration tests
│   └── unit/                # Unit tests
└── setup.ts                  # Automated setup script
```

---

## Authentication Patterns

This project implements **standardized authentication patterns** for consistency across the application.

### For Server Components

Use auth utilities from [lib/auth/server.ts](lib/auth/server.ts):

**Available Functions:**
- `getUser()` - Returns current user or null; doesn't redirect
- `requireAuth()` - Returns current user or redirects to login

**Usage Examples:**
- Optional auth: [app/page.tsx](app/page.tsx) (handles both authenticated and guest users)
- Required auth: [app/(dashboard)/dashboard/page.tsx](app/(dashboard)/dashboard/page.tsx) (redirects if not authenticated)

### For Client Components

Use the `useAuth()` hook from [lib/hooks/useAuth.ts](lib/hooks/useAuth.ts):

**Hook Returns:**
- `user` - Current user object or null
- `loading` - Boolean indicating auth state is being loaded
- `signOut()` - Function to sign out current user

**Usage Example:** See [components/auth/ProfilePageClient.tsx](components/auth/ProfilePageClient.tsx)

### Supabase Client Usage

**Don't** create Supabase clients directly. **Always** use provided utilities:

- **Server-side**: [lib/supabase/server.ts](lib/supabase/server.ts) - For Server Components, Route Handlers, Server Actions
- **Client-side**: [lib/supabase/client.ts](lib/supabase/client.ts) - For Client Components

This ensures proper cookie handling and session management.  
**See implementation examples:** Any file in `app/(dashboard)/` or `components/auth/`

---

## Key Features

### User Authentication
- Email/password signup and login
- Automatic profile creation via database trigger
- Protected routes with middleware
- Server-side and client-side auth utilities

### Profile Management
- User profile with full name and bio
- Avatar upload to Supabase Storage
- Real-time profile updates
- **Account deletion** - Users can permanently delete their accounts
  - Implemented with server-side API route using service role key
  - Cascading deletion removes user profile automatically
  - Confirmation dialog prevents accidental deletions

### Security
- Row Level Security (RLS) policies on all tables
- Users can only view/edit their own data
- Service role key kept secret (server-side only)
- Proper authentication checks on all protected routes

### Testing
- Comprehensive test suite with Vitest
- Unit tests for utilities and hooks
- Component tests with React Testing Library
- Integration tests for auth flows and RLS policies

---

## Technical Requirements

This project implements the following technical best practices:

### TypeScript
-  **Strict Mode Enabled** - TypeScript runs with `strict: true` in [tsconfig.json](tsconfig.json)
-  **Full Coverage** - All files use `.ts` or `.tsx` extensions
-  **Proper Typing** - Functions have typed parameters and return types
-  **Type Definitions** - Shared types in [lib/types/database.ts](lib/types/database.ts)
-  **No `any` Types** - Uses `unknown` when necessary, properly typed elsewhere

**Example:** See [lib/supabase/server.ts](lib/supabase/server.ts) for proper TypeScript with Database type

### Next.js 13+ App Router
-  **App Directory** - Uses [app/](app/) directory structure (not `pages/`)
-  **File-Based Routing** - Routes organized in `app/(auth)/`, `app/(dashboard)/`, etc.
-  **Server Components by Default** - Async Server Components for data fetching
-  **Client Components Marked** - `'use client'` directive on client-only components
-  **Grouped Routes** - Uses route groups `(auth)`, `(dashboard)` for layout isolation

**See structure:** [app/README.md](app/README.md) for route organization details

### Supabase Server-Side Rendering
-  **@supabase/ssr Integration** - Package `@supabase/ssr@^0.8.0` for proper SSR support
-  **Server Client** - [lib/supabase/server.ts](lib/supabase/server.ts) for Server Components with cookie handling
-  **Client Client** - [lib/supabase/client.ts](lib/supabase/client.ts) for Client Components
-  **Middleware** - [proxy.ts](proxy.ts) handles token refresh between requests
-  **Type Safety** - Database types generated from Supabase schema

**Usage Example:** See [app/(dashboard)/profile/page.tsx](app/(dashboard)/profile/page.tsx)

### Database Schema Management
-  **Declarative Schemas** - SQL schemas in [supabase/schemas/](supabase/schemas/) (e.g., `profiles.sql`)
-  **Migration Generation** - Schemas generate migrations via `npx supabase db diff`
-  **No Manual SQL** - Migrations automatically generated, never edited manually
-  **Version Controlled** - All migrations in [supabase/migrations/](supabase/migrations/) with timestamps
-  **With Comments** - Schema files include documentation comments

**Schema Examples:**
- [supabase/schemas/profiles.sql](supabase/schemas/profiles.sql) - User profiles table with triggers and RLS
- [supabase/schemas/avatars.sql](supabase/schemas/avatars.sql) - Avatar storage bucket with policies

**See workflow:** [supabase/README.md](supabase/README.md)

### Error Handling
-  **Authentication Errors** - Handled in `lib/auth/server.ts` with proper error checking
-  **Database Errors** - Checked in RLS policies and query responses
-  **Component Errors** - Error states displayed in forms with user-friendly messages
-  **Try-Catch Blocks** - Wrap async operations with proper error handling
-  **Error Messages** - Clear, actionable messages for users

**Examples:**
- Auth error handling: [lib/auth/server.ts](lib/auth/server.ts#L11-L23) - See `getUser()` function
- Component error handling: [components/auth/LoginForm.tsx](components/auth/LoginForm.tsx) - Form validation and errors
- API error handling: [app/api/account/delete/route.ts](app/api/account/delete/route.ts) - Proper status codes

### Code Organization
-  **Directory Structure** - See [Project Structure](#project-structure) section above
-  **Reusable Components** - `components/ui/` for buttons, forms, inputs, cards
-  **Custom Hooks** - `lib/hooks/` for React hooks like `useAuth()`
-  **Utility Functions** - `lib/utils/` for pure functions (formatDate, uploadAvatar, etc.)
-  **Auth Patterns** - Standardized in `lib/auth/server.ts` and `lib/hooks/useAuth.ts`
-  **Naming Conventions** - PascalCase for components, camelCase for utilities
-  **Documentation** - Each major directory has its own README.md explaining contents

### Documentation & Comments
-  **JSDoc Comments** - Functions documented with purpose and examples
-  **Inline Comments** - Complex logic explained with comments
-  **Schema Comments** - Database tables and triggers documented
-  **README References** - Comprehensive documentation in root and subdirectories
-  **Architecture Doc** - [ARCHITECTURE.md](ARCHITECTURE.md) details design decisions

**Examples:**
- JSDoc: [lib/supabase/server.ts](lib/supabase/server.ts)
- Schema comments: [supabase/schemas/profiles.sql](supabase/schemas/profiles.sql)
- Directory READMEs: [lib/README.md](lib/README.md), [components/README.md](components/README.md), [__tests__/README.md](__tests__/README.md)

---

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
npm run format       # Format code with Prettier
npm run type-check   # Check TypeScript types
npm test             # Run tests once
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Generate coverage report
npm run setup        # Run automated setup script
```

---

## Deployment Guidelines (Vercel)

### 1. Create Production Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be provisioned
3. Note your project URL and API keys from Settings > API

### 2. Run Migrations on Production
```bash
# Link to your production project
npx supabase link --project-ref <your-project-ref>

# Push migrations to production
npx supabase db push
```

### 3. Deploy to Vercel
1. Push your code to GitHub
2. Import project in Vercel
3. Configure environment variables in Vercel project settings:
   ```
   NEXT_PUBLIC_SUPABASE_URL=<your-production-url>
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-production-anon-key>
   SUPABASE_SERVICE_ROLE_KEY=<your-production-service-role-key>
   ```
   **Important:** Get the `SUPABASE_SERVICE_ROLE_KEY` from your Supabase project dashboard (Settings > API). This is required for account deletion and other admin operations.
4. Deploy

### Platform-Specific Considerations
- **Environment Variables**: Set in Vercel dashboard under Settings > Environment Variables
- **Build Command**: `npm run build` (default)
- **Output Directory**: `.next` (default)
- **Node Version**: Specify in `package.json` engines field if needed

---

## GitHub Actions for Database Migrations

Automate database migrations to production using GitHub Actions. The workflow runs whenever you push migration files to the `main` branch, ensuring your production database stays in sync with your code.

### How It Works

**Workflow Triggers:**
-  Push to `main` branch with changes in `supabase/migrations/` 
-  Manual trigger via GitHub Actions tab (workflow_dispatch)
-  Validates all required secrets before running
-  Shows migration plan before applying changes
-  Provides clear error messages if something fails

**Security:**
- Only uses GitHub Secrets (credentials never exposed in code or logs)
- Validates secrets exist before attempting migration
- Connections are encrypted

### Setup Instructions

#### Step 1: Create Supabase Access Token

1. Go to **[Supabase Dashboard](https://supabase.com/dashboard/account/tokens)**
2. Click **"Generate new token"**
3. Name it: `"GitHub Actions Migration"`
4. Click **"Generate token"**
5. **Copy the token immediately** (shown only once!)

#### Step 2: Add GitHub Secrets

In your GitHub repository:

1. Go to **Settings → Secrets and variables → Actions**
2. Click **"New repository secret"**

**Add three secrets:**

**Secret 1: Project ID**
- Name: `SUPABASE_PROJECT_ID`
- Value: Your Supabase project ID (found in Settings → General)

**Secret 2: Access Token**
- Name: `SUPABASE_ACCESS_TOKEN`
- Value: The token you just generated

**Secret 3: Database Password**
- Name: `SUPABASE_DB_PASSWORD`
- Value: The database password you set when creating your Supabase project

**Verify All Secrets Added:**
```
 SUPABASE_PROJECT_ID
 SUPABASE_ACCESS_TOKEN
 SUPABASE_DB_PASSWORD
```

#### Step 3: Workflow is Ready!

The workflow file is **already included** in `.github/workflows/migrate.yml`. No additional setup needed!

### Testing the Workflow

**To test the workflow manually:**

1. Go to your GitHub repository
2. Click **Actions** tab
3. Select **"Migrate Supabase Database"** workflow
4. Click **"Run workflow"** → **"Run workflow"** button
5. Wait for the workflow to complete (usually 30-60 seconds)

**To test with a migration:**

1. Create a new migration locally:
   ```bash
   npx supabase migration new add_new_column
   ```
2. Edit the migration file in `supabase/migrations/`
3. Commit and push to main:
   ```bash
   git add supabase/migrations/
   git commit -m "Add database migration"
   git push origin main
   ```
4. Go to GitHub Actions tab and watch it run
5. Verify in Supabase dashboard that changes were applied

### Workflow File Details

The workflow (`.github/workflows/migrate.yml`) includes:

- **Secret validation:** Checks all required secrets exist before running
- **Migration plan:** Shows which migrations will be applied
- **Error handling:** Clear messages if anything fails
- **Success confirmation:** Confirms successful migration
- **Troubleshooting:** Displays common issues if migration fails

**Key Scripts in Workflow:**
```bash
# Show which migrations will be applied
supabase migration list

# Apply pending migrations to production
supabase db push --password ${{ secrets.SUPABASE_DB_PASSWORD }}
```

### Troubleshooting

**Workflow not triggering?**
- Ensure migration files are in `supabase/migrations/` directory
- Check GitHub Actions is enabled in repo settings
- Manually trigger via GitHub Actions tab

**"Missing SUPABASE_PROJECT_ID" error?**
- Go to GitHub Settings → Secrets and verify the secret exists
- Check the exact name matches (case-sensitive)
- Verify it's under "Secrets and variables → Actions" (not encrypt variables)

**"Invalid migration SQL" error?**
- Check the migration file for syntax errors
- Test migration locally: `npx supabase db push` (with local Supabase running)
- Review Supabase logs for specific error details

**"Authentication failed" error?**
- Regenerate the access token (it may have expired)
- Update the GitHub secret with the new token
- Verify SUPABASE_PROJECT_ID matches your actual project ID

### Manual Migration (If Needed)

If the workflow fails and you need to apply migrations manually:

```bash
# Link to your production project
npx supabase link --project-ref <YOUR_PROJECT_ID>

# Apply migrations
npx supabase db push --password <YOUR_DB_PASSWORD>
```

## Troubleshooting

### Supabase won't start
- **Check Docker**: Make sure Docker Desktop is running
- **Port conflicts**: Another service might be using required ports
  ```bash
  npx supabase stop
  npx supabase start
  ```
- **Reset**: If issues persist:
  ```bash
  npx supabase stop
  docker system prune -a  # WARNING: Removes all Docker data
  npx supabase start
  ```

### Tests failing
- **Database**: Ensure Supabase is running (`npx supabase status`)
- **Environment**: Check `.env.local` has correct values
- **Dependencies**: Try `npm install` again
- **Cache**: Clear test cache with `npm test -- --clearCache`

### Build errors
- **Type errors**: Run `npm run type-check` to see issues
- **ESLint**: Run `npm run lint` to check for code issues
- **Clean build**: Delete `.next` folder and rebuild

### Authentication issues
- **Credentials**: Verify `.env.local` has correct Supabase URL and key
- **RLS policies**: Check policies in Supabase Studio
- **Session**: Try signing out and back in
- **Cookies**: Clear browser cookies for localhost

---

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase + Next.js Guide](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Vitest Documentation](https://vitest.dev/)

---
