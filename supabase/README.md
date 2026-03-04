# supabase Directory

This directory contains Supabase configuration, schemas, and migrations.

## Structure

- **`config.toml`** - Supabase local development configuration
- **`schemas/`** - Declarative database schema definitions (SQL)
  - Schemas are used to generate migrations
  - Each table gets its own schema file
  - Include RLS policies in schema files

- **`migrations/`** - Auto-generated database migration files
  - Generated from schemas using `npx supabase db diff`
  - NEVER edit migrations manually
  - Always regenerate from schemas if changes needed

## Schema Guidelines

- Use declarative schemas to define tables
- Include all column definitions with types
- Define RLS policies in schema files
- Define trigger functions in schema files
- Use consistent naming conventions
- Add comments documenting the purpose of policies

## Migration Workflow

### Local Development Workflow

1. Create or update schema in `supabase/schemas/`
2. Generate migration: `npx supabase db diff -f migration_name`
3. Review generated migration file
4. Test locally: `npx supabase db reset`
5. Commit migration to version control

### Production Deployment Workflow (Automated)

1. Push your migration files to GitHub `main` branch
2. GitHub Actions automatically:
   -  Validates all required secrets exist
   -  Shows which migrations will be applied
   -  Applies migrations to production database
   -  Provides feedback on success or failure
3. Verify changes in [Supabase Dashboard](https://supabase.com/dashboard)

**No manual steps needed!** The workflow handles everything.

### Production Deployment (Manual Fallback)

If the GitHub Actions workflow fails:

```bash
# 1. Link to production project
npx supabase link --project-ref <YOUR_PROJECT_ID>

# 2. Apply migrations
npx supabase db push --password <YOUR_DB_PASSWORD>

# 3. Verify in Supabase dashboard
```

## Local Supabase Commands

```bash
# Start local Supabase
npx supabase start

# Stop local Supabase
npx supabase stop

# Reset database (apply all migrations from scratch)
npx supabase db reset

# Check Supabase status
npx supabase status
```
