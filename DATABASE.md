# Database Documentation

**Last Updated:** February 23, 2026

This document provides comprehensive documentation for the database schema, Row Level Security (RLS) policies, triggers, and migration management.

---

## Database Overview

**Database Type:** PostgreSQL (via Supabase)

**Schema Management:** Declarative schemas with generated migrations

**Security:** Row Level Security (RLS) enabled on all tables

**Version Control:** All schema changes tracked in `supabase/migrations/`

---

## Schema Design

### Tables

#### `public.profiles`

The profiles table stores user profile information with a one-to-one relationship to `auth.users`.

**Purpose:** Extended user profile data beyond basic authentication info.

**Relationship:** Each profile is linked to exactly one user in `auth.users` via `id`.

**Schema:**

```sql
CREATE TABLE public.profiles (
    id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email           TEXT NOT NULL,
    full_name       TEXT,
    avatar_url      TEXT,
    bio             TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
```

**Column Descriptions:**

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| `id` | UUID | NOT NULL | Primary key, foreign key to auth.users(id) |
| `email` | TEXT | NOT NULL | User's email address (synced from auth) |
| `full_name` | TEXT | NULL | User's full name |
| `avatar_url` | TEXT | NULL | URL to user's avatar image in Supabase Storage |
| `bio` | TEXT | NULL | User's biography or description (max 160 chars) |
| `created_at` | TIMESTAMPTZ | NOT NULL | Timestamp when profile was created |
| `updated_at` | TIMESTAMPTZ | NOT NULL | Timestamp when profile was last updated |

**Indexes:**

```sql
-- No additional indexes needed for current use case
-- If querying by full_name becomes common, consider:
-- CREATE INDEX idx_profiles_full_name ON profiles(full_name);
```

**Constraints:**

- **Primary Key:** `user_id` ensures one profile per user
- **Foreign Key:** References `auth.users(id)` with `ON DELETE CASCADE`
  - When a user is deleted from auth.users, their profile is automatically deleted
- **NOT NULL:** `email`, `created_at`, `updated_at` must have values

---

## Row Level Security (RLS) Policies

RLS is enabled on all tables to ensure users can only access their own data.

### Enabling RLS

```sql
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
```

**Why RLS?**
- **Security by default:** Even if application code has bugs, database enforces access control
- **Multi-tenancy:** Each user's data is isolated
- **Defense in depth:** Multiple layers of security
- **Clear intent:** Policies document who can access what

---

### Profile RLS Policies

#### 1. SELECT Policy - "Users can view own profile"

```sql
CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = user_id);
```

**Purpose:** Allows users to read their own profile data.

**How it works:**
- `auth.uid()` returns the authenticated user's ID from the JWT token
- `USING` clause filters rows to only those where `user_id` matches `auth.uid()`
- Users attempting to read other users' profiles will get zero results

**Example Query:**
```sql
-- User A (auth.uid() = 'aaa-bbb-ccc') queries:
SELECT * FROM profiles;

-- Result: Only returns profile where user_id = 'aaa-bbb-ccc'
```

#### 2. INSERT Policy - "Users can insert own profile"

```sql
CREATE POLICY "Users can insert own profile"
ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() = user_id);
```

**Purpose:** Allows users to create their own profile (used by trigger).

**How it works:**
- `WITH CHECK` validates the data being inserted
- Only allows inserts where `user_id` matches the authenticated user's ID
- Prevents users from creating profiles for other users

**Note:** In practice, this is primarily used by the database trigger during signup. Application code typically doesn't directly insert profiles.

#### 3. UPDATE Policy - "Users can update own profile"

```sql
CREATE POLICY "Users can update own profile"
ON public.profiles
FOR UPDATE
USING (auth.uid() = user_id);
```

**Purpose:** Allows users to edit their own profile information.

**How it works:**
- `USING` clause determines which rows can be updated
- Users can only update profiles where they are the owner
- Prevents users from modifying other users' profiles

**Example Query:**
```sql
-- User A (auth.uid() = 'aaa-bbb-ccc') attempts:
UPDATE profiles
SET full_name = 'New Name'
WHERE id = 'xxx-yyy-zzz';  -- Different user

-- Result: UPDATE fails silently (0 rows affected)
```

#### 4. DELETE Policy - Not Implemented

**Decision:** Profile deletion is not allowed via application code.

**Rationale:**
- Profiles are automatically deleted when auth.users record is deleted (CASCADE)
- Account deletion should go through proper authentication flow
- Prevents accidental data loss

**To delete a profile:**
```sql
-- Must delete the user from auth.users (admin operation)
DELETE FROM auth.users WHERE id = 'user-id';
-- Profile is automatically deleted via CASCADE
```

---

### Testing RLS Policies

**Test Case 1: User can read own profile**
```sql
-- Set session to user A
SET LOCAL ROLE authenticated;
SET LOCAL request.jwt.claim.sub = 'user-a-uuid';

SELECT * FROM profiles WHERE id = 'user-a-uuid';
-- Expected: Returns 1 row
```

**Test Case 2: User cannot read other profiles**
```sql
-- Still as user A
SELECT * FROM profiles WHERE id = 'user-b-uuid';
-- Expected: Returns 0 rows (not an error, just empty)
```

**Test Case 3: User can update own profile**
```sql
-- As user A
UPDATE profiles
SET full_name = 'New Name'
WHERE id = 'user-a-uuid';
-- Expected: 1 row updated
```

**Test Case 4: User cannot update other profiles**
```sql
-- As user A
UPDATE profiles
SET full_name = 'Hacked'
WHERE id = 'user-b-uuid';
-- Expected: 0 rows updated (silently fails)
```

**Automated RLS Tests:** See `__tests__/integration/profileRLS.test.ts`

---

## Database Triggers

### Profile Creation Trigger

**Purpose:** Automatically create a profile record when a new user signs up.

**Why use a trigger instead of application code?**
- **Guaranteed execution:** Runs at database level, can't be bypassed
- **Atomic operation:** Profile creation is part of the user creation transaction
- **Reliability:** Works even if application code fails or is missing
- **Simplicity:** No need to remember to create profile in signup logic

---

### Trigger Function

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (user_id, email, created_at, updated_at)
    VALUES (
        NEW.id,
        NEW.email,
        NOW(),
        NOW()
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

**Function Details:**

- **Language:** PL/pgSQL (PostgreSQL's procedural language)
- **Security:** `SECURITY DEFINER` - runs with privileges of function creator
  - Necessary to bypass RLS when creating profile
  - Function runs as database owner, not as the new user
- **`NEW.id`:** The UUID of the newly inserted user from `auth.users`
- **`NEW.email`:** The email of the newly inserted user
- **`RETURNS TRIGGER`:** Special return type for trigger functions

**How it works:**
1. User signs up via Supabase Auth
2. Supabase creates record in `auth.users` table
3. Trigger fires AFTER INSERT
4. `handle_new_user()` function executes
5. Profile record inserted into `public.profiles`
6. Transaction commits (or rolls back entirely if profile creation fails)

---

### Trigger Definition

```sql
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();
```

**Trigger Details:**

- **Name:** `on_auth_user_created`
- **Event:** `AFTER INSERT ON auth.users`
  - Fires after a new user is inserted into auth.users
  - `AFTER` ensures auth.users record exists before creating profile
- **Granularity:** `FOR EACH ROW`
  - Executes once per inserted row
  - If bulk insert occurs, runs for each user
- **Action:** Executes `handle_new_user()` function

---

### Trigger Testing

**Manual Test:**
```sql
-- Create a test user
INSERT INTO auth.users (id, email)
VALUES ('test-uuid', 'test@example.com');

-- Check if profile was created
SELECT * FROM profiles WHERE user_id = 'test-uuid';
-- Expected: 1 row with email 'test@example.com'
```

**Automated Test:** See `__tests__/integration/profileCreation.test.ts`

---

## Migration Management

### Migration Workflow

This project uses a **declarative schema approach** rather than writing migrations manually.

**Workflow:**

```
1. Edit Schema File
   ↓
2. Generate Migration
   ↓
3. Review Migration
   ↓
4. Apply Locally
   ↓
5. Run Tests
   ↓
6. Commit to Git
   ↓
7. Auto-Deploy to Production
```

---

### 1. Edit Declarative Schema

Edit the schema file in `supabase/schemas/`.

**Example: Add a new column**

```sql
-- supabase/schemas/profiles.sql
CREATE TABLE public.profiles (
    id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email           TEXT NOT NULL,
    full_name       TEXT,
    avatar_url      TEXT,
    bio             TEXT,
    phone_number    TEXT,  -- NEW COLUMN
    created_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
```

---

### 2. Generate Migration

Use Supabase CLI to generate a migration based on the diff:

```bash
npx supabase db diff -f add_phone_number_to_profiles
```

**What this does:**
- Compares current database state with schema files
- Generates SQL migration in `supabase/migrations/`
- Names it with timestamp: `20260223120000_add_phone_number_to_profiles.sql`

**Generated Migration:**
```sql
-- supabase/migrations/20260223120000_add_phone_number_to_profiles.sql
ALTER TABLE public.profiles ADD COLUMN phone_number TEXT;
```

---

### 3. Review Migration

**Always review the generated migration!**

Check for:
-  Correct SQL syntax
-  Proper column types and constraints
-  Index additions/changes
-  No unintended changes
-  Data migration if needed (e.g., set default values)

**If migration looks wrong:**
- Don't apply it
- Edit schema file again
- Delete the bad migration file
- Regenerate

---

### 4. Apply Migration Locally

Apply migrations to local development database:

```bash
npx supabase db reset
```

**What this does:**
- Stops and resets local Supabase instance
- Applies all migrations in order
- Runs seed data from `supabase/seed.sql`
- Fresh, clean database state

**Why `reset` instead of `push`?**
- Ensures migrations work from scratch
- Catches migration order issues
- Verifies seed data compatibility

---

### 5. Run Tests

After applying migration, run test suite:

```bash
npm test
```

**What to check:**
-  All tests still pass
-  No type errors due to schema changes
-  Update `lib/types/database.ts` if needed

**Updating Types:**

If schema changed, regenerate types:

```bash
npx supabase gen types typescript --local > lib/types/database.ts
```

---

### 6. Commit to Git

```bash
git add supabase/migrations/
git add supabase/schemas/
git add lib/types/database.ts  # If updated
git commit -m "Add phone_number column to profiles"
git push origin main
```

**What to commit:**
-  Schema files (source of truth)
-  Migration files (generated, but version controlled)
-  Updated type definitions
-  Any test updates

---

### 7. Auto-Deploy to Production

When you push to main branch, GitHub Actions workflow automatically:

1. Checks out code
2. Installs Supabase CLI
3. Links to production Supabase project
4. Runs `npx supabase db push`
5. Applies new migrations to production database

**Workflow File:** `.github/workflows/migrate.yml`

**To set up:**
1. Create Supabase access token
2. Add to GitHub Secrets:
   - `SUPABASE_PROJECT_ID`
   - `SUPABASE_ACCESS_TOKEN`

---

## Migration Files

### Current Migrations

#### `20260218175514_create_profiles_table.sql`

**Purpose:** Initial profiles table creation

**Contents:**
- Creates `public.profiles` table
- Adds all initial columns
- Sets up foreign key to `auth.users`
- Enables RLS
- Creates RLS policies (SELECT, INSERT, UPDATE)
- Creates trigger function `handle_new_user()`
- Creates trigger `on_auth_user_created`

**Applied:** Initial setup

---

### Migration Best Practices

####  DO:

- **Write migrations that can be applied to an existing database**
  - Add columns with default values or NULL allowed
  - Use `IF NOT EXISTS` for creating objects
  - Use `DROP ... IF EXISTS` carefully with confirmation

- **Keep migrations small and focused**
  - One logical change per migration
  - Easier to review
  - Easier to debug if something goes wrong

- **Test migrations locally before pushing**
  - Run `npx supabase db reset`
  - Verify data integrity
  - Run full test suite

- **Add comments to complex migrations**
  ```sql
  -- Add phone_number column for two-factor authentication
  ALTER TABLE profiles ADD COLUMN phone_number TEXT;
  ```

- **Update TypeScript types after schema changes**
  ```bash
  npx supabase gen types typescript --local > lib/types/database.ts
  ```

####  DON'T:

- **Don't skip the declarative schema file**
  - Always update `supabase/schemas/` first
  - Don't write migrations manually

- **Don't apply schema changes through Supabase Dashboard**
  - Dashboard changes aren't version controlled
  - Can't be replicated to other environments
  - Breaks the migration workflow

- **Don't delete migration files**
  - Migrations are applied in order
  - Deleting breaks the sequence
  - If a migration is wrong, create a new migration to revert it

- **Don't modify applied migrations**
  - Once pushed to production, consider it immutable
  - Create a new migration to make changes
  - Exception: Local development before first push

---

##  Querying the Database

### Using Supabase Client (Application Code)

#### Select Query
```typescript
const { data, error } = await supabase
  .from('profiles')
  .select('id, full_name, avatar_url')
  .eq('id', userId)
  .single()
```

#### Insert Query
```typescript
const { data, error } = await supabase
  .from('profiles')
  .insert({
    id: userId,
    email: email,
    full_name: fullName
  })
```

#### Update Query
```typescript
const { data, error } = await supabase
  .from('profiles')
  .update({ full_name: newName })
  .eq('id', userId)
```

#### Delete Query
```typescript
// Not typically used - profiles deleted via CASCADE
const { error } = await supabase
  .from('profiles')
  .delete()
  .eq('id', userId)
```

**Note:** All queries automatically respect RLS policies.

---

### Using SQL (Direct Database Access)

**Local Development:**

```bash
# Connect to local database
npx supabase db psql

# Or use connection string
psql postgresql://postgres:postgres@localhost:54322/postgres
```

**Example Queries:**

```sql
-- View all profiles
SELECT * FROM profiles;

-- View profile with user info
SELECT 
    p.*,
    u.email as auth_email,
    u.created_at as user_created_at
FROM profiles p
JOIN auth.users u ON p.id = u.id;

-- Count profiles
SELECT COUNT(*) FROM profiles;

-- Find profiles without names
SELECT * FROM profiles WHERE full_name IS NULL;
```

---

##  Common Database Operations

### Add a New Column

```sql
-- 1. Edit supabase/schemas/profiles.sql
-- Add: phone_number TEXT

-- 2. Generate migration
npx supabase db diff -f add_phone_number

-- 3. Apply locally
npx supabase db reset

-- 4. Update types
npx supabase gen types typescript --local > lib/types/database.ts

-- 5. Run tests
npm test

-- 6. Commit and push
```

---

### Create a New Table

```sql
-- 1. Create new schema file: supabase/schemas/posts.sql
CREATE TABLE public.posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Add policies
CREATE POLICY "Users can view own posts"
ON public.posts FOR SELECT
USING (auth.uid() = user_id);

-- 2. Generate migration
npx supabase db diff -f create_posts_table

-- 3. Apply and test
npx supabase db reset
npm test
```

---

### Modify RLS Policy

```sql
-- 1. Edit supabase/schemas/profiles.sql
-- Change existing policy or add new one

-- Example: Allow public profile viewing
CREATE POLICY "Profiles are publicly readable"
ON public.profiles FOR SELECT
USING (true);  -- Everyone can read all profiles

-- 2. Generate migration
npx supabase db diff -f update_profile_policies

-- 3. Review migration carefully - RLS changes are security-critical!

-- 4. Apply and test
npx supabase db reset
npm test -- profileRLS  # Run RLS-specific tests
```

---

### Seed Data

Add test/development data in `supabase/seed.sql`:

```sql
-- supabase/seed.sql

-- Insert test user (would normally be created by auth)
-- Note: In production, users come from auth.users automatically

-- Update test profile
INSERT INTO profiles (id, email, full_name, bio)
VALUES (
    'test-user-uuid',
    'test@example.com',
    'Test User',
    'This is a test account'
)
ON CONFLICT (id) DO UPDATE
SET 
    full_name = EXCLUDED.full_name,
    bio = EXCLUDED.bio;
```

**Apply seed data:**
```bash
npx supabase db reset  # Automatically runs seed.sql
```

---

##  Testing Database Operations

### Integration Tests

See `__tests__/integration/` for examples:

- `profileCreation.test.ts` - Tests trigger creates profile
- `profileRLS.test.ts` - Tests RLS policies work correctly

### Manual Testing

```sql
-- Connect to local database
npx supabase db psql

-- Test RLS policy as specific user
BEGIN;
  SET LOCAL ROLE authenticated;
  SET LOCAL request.jwt.claim.sub = 'user-uuid-here';
  
  SELECT * FROM profiles;  -- Should only see own profile
  
ROLLBACK;  -- Don't commit test changes
```

---

##  Monitoring & Debugging

### View Applied Migrations

```sql
SELECT * FROM supabase_migrations.schema_migrations
ORDER BY version;
```

### Check RLS Policies

```sql
SELECT
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE schemaname = 'public';
```

### Check Triggers

```sql
SELECT
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement
FROM information_schema.triggers
WHERE trigger_schema = 'public';
```

### View Foreign Keys

```sql
SELECT
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_schema = 'public';
```

---

##  Common Issues & Solutions

### Issue: RLS policy blocking legitimate access

**Symptom:** User can't access their own data

**Debug:**
```sql
-- Check if RLS is enabled
SELECT tablename, rowsecurity FROM pg_tables
WHERE schemaname = 'public' AND tablename = 'profiles';

-- Check policies
SELECT * FROM pg_policies WHERE tablename = 'profiles';

-- Test as user
BEGIN;
  SET LOCAL ROLE authenticated;
  SET LOCAL request.jwt.claim.sub = 'user-uuid';
  SELECT * FROM profiles;
ROLLBACK;
```

**Solution:** Verify `auth.uid()` matches `user_id` in your query.

---

### Issue: Profile not created on signup

**Symptom:** User exists in auth.users but not in profiles

**Debug:**
```sql
-- Check if trigger exists
SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';

-- Check if function exists
SELECT proname FROM pg_proc WHERE proname = 'handle_new_user';

-- Manually test trigger function
SELECT handle_new_user();  -- Should fail - needs NEW context

-- Check for trigger errors in logs
SELECT * FROM pg_stat_statements WHERE query LIKE '%handle_new_user%';
```

**Solution:**
- Recreate trigger: `DROP TRIGGER ... CREATE TRIGGER ...`
- Check function permissions (`SECURITY DEFINER`)
- Verify foreign key constraint exists

---

### Issue: Migration fails to apply

**Symptom:** `npx supabase db push` errors

**Debug:**
```bash
# Check migration syntax locally
npx supabase db reset

# View migration history
npx supabase migration list

# Check for conflicts
npx supabase db diff
```

**Solution:**
- Review migration SQL for syntax errors
- Check if migration already applied
- Verify schema state matches expectations
- Create new migration to fix issues

---

##  Additional Resources

- **Supabase Database Docs:** https://supabase.com/docs/guides/database
- **PostgreSQL RLS:** https://www.postgresql.org/docs/current/ddl-rowsecurity.html
- **Supabase Migrations:** https://supabase.com/docs/guides/cli/local-development
- **SQL Best Practices:** https://www.sqlstyle.guide/

---

**Questions about the database?** Check the [Architecture Guide](ARCHITECTURE.md) 
