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

1. Create or update schema in `supabase/schemas/`
2. Generate migration: `npx supabase db diff -f migration_name`
3. Review generated migration file
4. Test locally: `npx supabase db reset`
5. Commit migration to version control

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
