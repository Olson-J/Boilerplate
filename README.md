# Assignment 2: Boilerplate

This app will be the basis of future projects.

## Supabase Local Setup

### Prerequisites
- Node.js and npm
- Supabase CLI installed (`npm install -g supabase`)

### Initialize Supabase (once per project)
```bash
npx supabase init
```

### Start/Stop Local Supabase
```bash
npx supabase start
npx supabase stop
```

### Check Status
```bash
npx supabase status
```

### Reset Database (runs migrations + seeds)
```bash
npx supabase db reset
```

### Generate Migrations from Declarative Schemas
```bash
npx supabase db diff -f <migration_name>
```

### Environment Variables
Create a `.env.local` file with:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Use the `@supabase/ssr` clients in:
- `lib/supabase/server.ts`
- `lib/supabase/client.ts`

# Deployment guidelines (Vercel)
## How to set up the production Supabase project
## How to configure environment variables in the deployment platform
## How to link the production databse
## Platform specific considerations


# GitHub actions for database migrations
explain how to set up and configure/Create a GitHub Actions workflow that automatically runs database migrations when code is deployed to production. The workflow should:

   - Trigger on deployment or push to the main/production branch
   - Connect to your production Supabase instance
   - Run pending migrations using the Supabase CLI
   - Handle errors gracefully and provide clear feedback
   - Be secure (use GitHub Secrets for sensitive credentials)
