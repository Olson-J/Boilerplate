# Assignment 2: Boilerplate

This app will be the basis of future projects. It demonstrates best practices for building a Next.js application with Supabase authentication, including automatic profile creation, Row Level Security policies, and comprehensive testing.

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
   
   Create `.env.local` file:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=<API URL from status>
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key from status>
   ```

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

Run the test suite:
```bash
# Run all tests once
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

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

This project uses `@supabase/ssr` for proper server-side rendering support.

### Server Components
```typescript
import { getUser, requireAuth } from '@/lib/auth/server';

// Get user (returns null if not authenticated)
const user = await getUser();

// Require authentication (throws/redirects if not authenticated)
const user = await requireAuth();
```

### Client Components
```typescript
'use client';
import { useAuth } from '@/lib/hooks/useAuth';

function MyComponent() {
  const { user, loading, signOut } = useAuth();
  // ...
}
```

### Supabase Clients
- **Server**: `lib/supabase/server.ts` - For Server Components, Route Handlers, Server Actions
- **Client**: `lib/supabase/client.ts` - For Client Components

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
   ```
4. Deploy

### Platform-Specific Considerations
- **Environment Variables**: Set in Vercel dashboard under Settings > Environment Variables
- **Build Command**: `npm run build` (default)
- **Output Directory**: `.next` (default)
- **Node Version**: Specify in `package.json` engines field if needed

---

## GitHub Actions for Database Migrations

Automate database migrations on deployment using GitHub Actions.

### Setup Instructions

1. **Get Supabase credentials**
   - Project ID: Found in project settings
   - Access Token: Generate in Supabase dashboard (Account > Access Tokens)

2. **Configure GitHub Secrets**
   
   In your GitHub repository, go to Settings > Secrets and add:
   ```
   SUPABASE_ACCESS_TOKEN=<your-access-token>
   SUPABASE_PROJECT_ID=<your-project-id>
   ```

3. **Create workflow file**
   
   Create `.github/workflows/migrate.yml`:
   ```yaml
   name: Run Supabase Migrations

   on:
     push:
       branches:
         - main
       paths:
         - 'supabase/migrations/**'

   jobs:
     migrate:
       runs-on: ubuntu-latest
       
       steps:
         - name: Checkout code
           uses: actions/checkout@v4

         - name: Setup Node.js
           uses: actions/setup-node@v4
           with:
             node-version: '20'

         - name: Install Supabase CLI
           run: npm install -g supabase

         - name: Link Supabase project
           run: supabase link --project-ref ${{ secrets.SUPABASE_PROJECT_ID }}
           env:
             SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}

         - name: Run migrations
           run: supabase db push
           env:
             SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}

         - name: Notify on failure
           if: failure()
           run: echo "Migration failed! Check logs above."
   ```

### How It Works
- **Trigger**: Runs on push to `main` branch when migration files change
- **Security**: Uses GitHub Secrets for credentials (never commit tokens)
- **Process**: Connects to production database and applies pending migrations
- **Notifications**: Can be extended with Slack/email notifications

### Testing the Workflow
1. Create a new migration locally
2. Commit and push to main branch
3. Check Actions tab in GitHub to see workflow run
4. Verify migrations applied in Supabase dashboard

---

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
