# Deployment Guide

**Last Updated:** February 23, 2026

This guide covers deploying your Next.js + Supabase application to production using Vercel and Supabase Cloud.

---

## Deployment Overview

This application uses:
- **Vercel** - Hosts the Next.js application (frontend + serverless functions)
- **Supabase Cloud** - Managed PostgreSQL database, authentication, and storage
- **GitHub Actions** - Automated database migrations on deployment

**Deployment Architecture:**

```
Developer → GitHub (main branch)
                ↓
          GitHub Actions
          (Auto-migrates DB)
                ↓
          Vercel Deploy
          (Auto-deploys app)
                ↓
          Production Live 
```

---

## Prerequisites

Before deploying, ensure you have:

- [ ] GitHub account with repository for this project
- [ ] Vercel account (free tier works fine) - https://vercel.com
- [ ] Supabase account (free tier works fine) - https://supabase.com
- [ ] All local tests passing (`npm test`)
- [ ] Local build successful (`npm run build`)
- [ ] Code committed to Git

---

## Deployment Checklist

### Phase 1: Create Production Supabase Project

1. **Log in to Supabase Dashboard**
   - Go to https://supabase.com
   - Click "New Project"

2. **Configure Project**
   - **Name:** Choose a descriptive name (e.g., "my-app-production")
   - **Database Password:** Generate a strong password (save it somewhere secure)
   - **Region:** Choose closest to your users (e.g., US East, EU West)
   - **Plan:** Free tier is fine for most projects
   - Click "Create new project"

3. **Wait for Provisioning**
   - Takes 2-3 minutes to spin up database

4. **Note Your Project Details**
   - Go to **Settings → API**
   - Copy and save:
     - **Project URL** (e.g., `https://xxx.supabase.co`)
     - **Anon/Public Key** (safe to expose in frontend)
     - **Service Role Key** (secret - for admin operations only)
   - Go to **Settings → General**
   - Copy **Project ID** (needed for GitHub Actions)

---

### Phase 2: Apply Database Migrations

You have two options: Automated (recommended) or Manual.

#### Option A: Automated with GitHub Actions (Recommended)

1. **Create Supabase Access Token**
   - Go to https://supabase.com/dashboard/account/tokens
   - Click "Generate new token"
   - Name it: "GitHub Actions Migration"
   - Copy the token immediately (shown only once!)

2. **Add Secrets to GitHub Repository**
   - Go to your GitHub repository
   - Click **Settings → Secrets and variables → Actions**
   - Click **New repository secret**
   
   **Add these two secrets:**
   
   **Secret 1:**
   - Name: `SUPABASE_PROJECT_ID`
   - Value: Your project ID (from Supabase Settings → General)
   
   **Secret 2:**
   - Name: `SUPABASE_ACCESS_TOKEN`
   - Value: The access token you just created

3. **Push Migrations to Main Branch**
   ```bash
   git add supabase/migrations/
   git commit -m "Initial migration"
   git push origin main
   ```

   If Git says there is nothing to commit, that means the migration files are already in the repo.
   In that case, run the workflow manually from GitHub Actions instead of creating a no-op commit.

4. **Verify Migration Workflow**
   - Go to **GitHub → Actions tab**
   - Open workflow **"Migrate Supabase Database"**
   - Click **Run workflow** (manual trigger) if no new migration files were pushed
   - Click on it to view logs
   - Verify it completes successfully (green checkmark ✅)

5. **Verify in Supabase**
   - Go to Supabase Dashboard → **Table Editor**
   - You should see `profiles` table
   - Go to **Authentication → Policies**
   - Verify RLS policies are active

#### Option B: Manual Migration

If you prefer to apply migrations manually or GitHub Actions fails:

```bash
# Install Supabase CLI globally (if not already installed)
npm install -g supabase

# Log in to Supabase (opens browser for authentication)
npx supabase login

# Link your local project to remote
npx supabase link --project-ref YOUR_PROJECT_ID

# Push migrations to production
npx supabase db push
```

**Enter your database password when prompted.**

You can find your project ID in Supabase Dashboard → Settings → General.

---

### Phase 3: Test Database & Auth

Before deploying the app, verify Supabase is working:

1. **Test Sign Up (via Supabase Dashboard)**
   - Go to **Authentication → Users**
   - Click "Add user" → "Invite user by email"
   - Enter a test email
   - User should appear in Users list

2. **Verify Profile Created**
   - Go to **Table Editor → profiles**
   - You should see a profile with the test user's ID
   - This confirms the trigger is working!

3. **Test RLS Policies**
   - Go to **SQL Editor**
   - Run this query:
   ```sql
   -- Set session to test user
   SET LOCAL ROLE authenticated;
   SET LOCAL request.jwt.claim.sub = 'test-user-id-here';
   
   SELECT * FROM profiles;
   ```
   - Should return only that user's profile

---

### Phase 4: Deploy to Vercel

1. **Log in to Vercel**
   - Go to https://vercel.com
   - Sign in with GitHub

2. **Import Repository**
   - Click "Add New..." → "Project"
   - Select your GitHub repository
   - Click "Import"

3. **Configure Project**
   - **Framework Preset:** Next.js (should auto-detect)
   - **Root Directory:** `./` (leave as is)
   - **Build Command:** `npm run build` (default is fine)
   - **Output Directory:** `.next` (default is fine)

4. **Add Environment Variables**
   - Expand "Environment Variables" section
   
   **Add these variables:**
   
   **Variable 1:**
   - Name: `NEXT_PUBLIC_SUPABASE_URL`
   - Value: Your Supabase project URL (from Step 1.4)
   - Environment: Production, Preview, Development (check all)
   
   **Variable 2:**
   - Name: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Value: Your Supabase anon/public key (from Step 1.4)
   - Environment: Production, Preview, Development (check all)

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes for build to complete
   - Vercel will show build logs in real-time

6. **Verify Deployment**
   - Once complete, Vercel shows your production URL (e.g., `your-app.vercel.app`)
   - Click "Visit" to open your live site
   - You should see your homepage

---

### Phase 5: Test Production Application

**Critical Tests to Perform:**

1. **Test Sign Up Flow**
   ```
    Go to /signup
    Enter email and password
    Submit form
    Check for confirmation email
    Verify email confirmation works
    Check profile was created in Supabase Dashboard
   ```

2. **Test Login Flow**
   ```
    Log out if logged in
    Go to /login
    Enter credentials
    Submit form
    Should redirect to dashboard
   ```

3. **Test Protected Routes**
   ```
    While logged out, try to visit /profile
    Should redirect to /login
    Log in
    Try /profile again
    Should load successfully
   ```

4. **Test Profile Editing**
   ```
    Go to /profile page
    Edit display name
    Save changes
    Refresh page
    Changes should persist
    Verify in Supabase Dashboard (Table Editor → profiles)
   ```

5. **Test Avatar Upload (if implemented)**
   ```
    Go to profile page
    Upload an avatar image
    Image should appear
    Check Supabase Storage bucket for file
   ```

6. **Test Sign Out**
   ```
    Click sign out button
    Should redirect to home page
    Try accessing /profile
    Should redirect to /login
   ```

7. **Test RLS Security**
   ```
    Create two test accounts
    Log in as User A
    Try to access User B's profile directly (manipulate URL if needed)
    Should not see User B's data
   ```

---

##  Configuration Details

### Environment Variables

**Required Environment Variables:**

| Variable | Description | Location | Public? |
|----------|-------------|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Supabase Dashboard → Settings → API | Yes (NEXT_PUBLIC prefix) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Supabase Dashboard → Settings → API | Yes (safe to expose) |

**Why `NEXT_PUBLIC_`?**
- Required prefix for environment variables used in browser code
- Next.js inlines these at build time into the JavaScript bundle
- They are publicly visible in the browser - never use this prefix for secrets!

**Optional Environment Variables:**

| Variable | Description | Use Case |
|----------|-------------|----------|
| `SUPABASE_SERVICE_ROLE_KEY` | Admin key with full access | Server-side admin operations only |
| `NEXT_PUBLIC_SITE_URL` | Your production URL | Email redirects, OAuth callbacks |

---

### Supabase Configuration

**Email Settings (for Authentication):**

1. Go to **Authentication → Email Templates**
2. Customize email templates (optional):
   - Confirmation email
   - Password reset email
   - Magic link email

3. Go to **Authentication → URL Configuration**
4. Set **Site URL** to your Vercel domain:
   - Example: `https://your-app.vercel.app`
   - This is where users are redirected after email confirmation

5. Add **Redirect URLs** (if using OAuth):
   - `https://your-app.vercel.app/auth/callback`

**Storage Settings (for Avatar Upload):**

1. Go to **Storage → Policies**
2. Verify storage bucket exists: `avatars`
3. Check policies allow authenticated users to upload

---

##  Continuous Deployment Setup

Once deployed, any push to your main branch will automatically:

1. **Trigger GitHub Actions:**
   - Runs migration workflow (`.github/workflows/migrate.yml`)
   - Applies any new migrations to production database
   - Shows success/failure in GitHub Actions tab

2. **Trigger Vercel Deployment:**
   - Automatic when you push to main
   - Builds and deploys your Next.js app
   - Shows deployment status in Vercel dashboard

**To Deploy Changes:**

```bash
# Make your changes
git add .
git commit -m "feat: Add new feature"
git push origin main

# That's it! GitHub Actions and Vercel handle the rest.
```

**Monitoring Deployments:**

- **GitHub Actions:** Check Actions tab for migration status
- **Vercel:** Check dashboard for build status and logs
- Vercel sends notifications on build success/failure

---

##  Troubleshooting

### Vercel Build Fails

**Symptom:** Build fails with TypeScript or lint errors

**Solution:**

```bash
# Test build locally first
npm run build

# Fix any errors
npm run type-check
npm run lint

# Commit fixes and push again
```

---

### Environment Variables Not Working

**Symptom:** App can't connect to Supabase in production

**Debug:**
- Go to Vercel Dashboard → Project → Settings → Environment Variables
- Verify both `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set
- Verify they're enabled for Production environment
- Check for typos in variable names (must match exactly)

**Solution:**
- Re-add environment variables
- Trigger a new deployment:
  ```bash
  git commit --allow-empty -m "Trigger redeploy"
  git push origin main
  ```

---

### Migration Fails on GitHub Actions

**Symptom:** GitHub Actions workflow fails with "Authentication error"

**Debug:**
- Go to GitHub → Settings → Secrets
- Verify `SUPABASE_PROJECT_ID` and `SUPABASE_ACCESS_TOKEN` exist
- Check for typos in secret names

**Solution:**
- Regenerate Supabase access token
- Update GitHub secret with new token
- Re-run workflow (GitHub Actions → select failed workflow → Re-run jobs)

---

### RLS Policies Block Access in Production

**Symptom:** Users can log in but can't see their profile

**Debug:**
1. Check Supabase logs:
   - Go to **Supabase Dashboard → Logs → Postgres**
   - Look for policy violation errors

2. Verify policies exist:
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'profiles';
   ```

3. Test policy manually:
   ```sql
   SET LOCAL ROLE authenticated;
   SET LOCAL request.jwt.claim.sub = 'user-id-here';
   SELECT * FROM profiles;
   ```

**Solution:**
- Verify migrations applied correctly
- Check policy syntax in migration files
- Re-apply migrations if needed

---

### Email Confirmation Not Working

**Symptom:** Users don't receive confirmation emails

**Debug:**
- Check **Supabase Dashboard → Authentication → Users**
- Look for user with `email_confirmed_at = null`

**Causes & Solutions:**

1. **Email provider blocking Supabase emails**
   - Check spam folder
   - Use a different email provider for testing

2. **Site URL not configured**
   - Go to **Authentication → URL Configuration**
   - Set Site URL to your Vercel domain

3. **Development mode enabled**
   - In Supabase Dashboard → Settings → API
   - Ensure "Email confirmations" is enabled

**Temporary Workaround:**
- Manually confirm user in Supabase Dashboard:
  - Go to Users table
  - Find user
  - Click "..." → Confirm email

---

### Avatar Upload Fails in Production

**Symptom:** File upload returns 403 or 404 error

**Debug:**
- Check **Supabase Dashboard → Storage**
- Verify `avatars` bucket exists
- Check bucket policies

**Solution:**

1. **Create bucket if missing:**
   - Go to Storage → New bucket
   - Name: `avatars`
   - Public: No (using signed URLs is more secure)

2. **Add storage policies:**
   ```sql
   -- Allow authenticated users to upload avatars
   CREATE POLICY "Users can upload own avatar"
   ON storage.objects FOR INSERT
   TO authenticated
   WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
   
   -- Allow users to read their own avatars
   CREATE POLICY "Users can read own avatar"
   ON storage.objects FOR SELECT
   TO authenticated
   USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
   ```

---

##  Monitoring & Maintenance

### Vercel Monitoring

**Built-in Metrics:**
- Go to Vercel Dashboard → Project → Analytics
- View:
  - Request volume
  - Response times
  - Error rates
  - Geographic distribution

**Logs:**
- Go to Vercel Dashboard → Project → Deployments → [Select Deployment]
- Click "View Function Logs"
- Real-time logs for debugging

### Supabase Monitoring

**Database Metrics:**
- Go to Supabase Dashboard → Reports
- Monitor:
  - Database size
  - Connection count
  - Query performance
  - Storage usage

**Auth Metrics:**
- Go to Authentication → Reports
- Track:
  - Sign-ups per day
  - Active users
  - Failed login attempts

**Logs:**
- Go to Logs → Postgres Logs
- View database queries and errors

---

##  Security Best Practices

### 1. Environment Variables

-  Never commit `.env.local` to Git
-  Use Vercel's environment variables (not hardcoded)
-  Rotate secrets periodically
-  Never expose `SUPABASE_SERVICE_ROLE_KEY` to browser

### 2. RLS Policies

-  Always enable RLS on all tables
-  Test policies thoroughly before production
-  Use `auth.uid()` to enforce user-level isolation
-  Never use `true` for all policies (public access)

### 3. HTTPS Only

-  Vercel enforces HTTPS automatically
-  Configure Supabase to allow only HTTPS redirects
-  Use secure cookies (automatic with Supabase)

### 4. CORS Configuration

-  Configure allowed origins in Supabase:
  - Go to Settings → API → CORS
  - Add your Vercel domain
  - Don't use wildcard (`*`) in production

### 5. Rate Limiting

-  Supabase has built-in rate limiting
-  Consider adding rate limiting on sensitive endpoints
-  Monitor for unusual activity in logs

---

## Performance Optimization

### 1. Next.js Optimizations

 **Already Configured:**
- Static page generation where possible
- Automatic code splitting
- Image optimization with `next/image`
- Font optimization

 **Additional Optimizations:**
```typescript
// next.config.ts
const config = {
  images: {
    domains: ['YOUR_PROJECT_ID.supabase.co'], // Allow Supabase storage
    formats: ['image/avif', 'image/webp'], // Modern formats
  },
  // Enable React strict mode
  reactStrictMode: true,
}
```

### 2. Database Optimizations

 **Indexing:**
```sql
-- Already created by default
CREATE INDEX idx_profiles_user_id ON profiles(user_id);

-- Add more indexes for frequently queried columns
CREATE INDEX idx_profiles_email ON profiles(email);
```

 **Connection Pooling:**
- Supabase automatically pools connections
- No additional configuration needed

### 3. Caching

 **Next.js Data Caching:**
```typescript
// Cache fetch requests (Next.js 13+)
const data = await fetch('https://api.example.com/data', {
  next: { revalidate: 3600 } // Cache for 1 hour
})
```

 **Supabase Caching:**
- Consider using React Query or SWR for client-side caching
- Reduces unnecessary API calls

---

##  Rollback Strategy

### Rollback Application Code

**Via Vercel:**
1. Go to Vercel Dashboard → Deployments
2. Find previous working deployment
3. Click "..." → Promote to Production
4. Previous version is now live

**Via Git:**
```bash
# Revert to previous commit
git revert HEAD
git push origin main

# Or reset to specific commit
git reset --hard <commit-hash>
git push origin main --force
```

### Rollback Database Migration

** Warning:** Database rollbacks are risky. Test thoroughly in development first.

**Option 1: Create Reversal Migration**
```bash
# Create new migration that undoes changes
npx supabase migration new revert_last_change

# Edit the new migration to reverse previous one
# Example: If you added a column, drop it
ALTER TABLE profiles DROP COLUMN phone_number;

# Apply migration
npx supabase db push
```

**Option 2: Manual SQL (Emergency Only)**
```bash
# Connect to production database
npx supabase db remote --project-ref YOUR_PROJECT_ID

# Run SQL to revert changes
ALTER TABLE profiles DROP COLUMN problematic_column;
```

**Better Approach:**
- Always test migrations locally first
- Use staging environment before production
- Create backup before major changes:
  ```bash
  npx supabase db dump > backup.sql
  ```

---

##  Production Checklist

Before declaring your app "production-ready", verify:

### Code Quality
- [ ] All tests passing (`npm test`)
- [ ] Build successful (`npm run build`)
- [ ] No TypeScript errors (`npx tsc --noEmit`)
- [ ] No ESLint errors (`npm run lint`)
- [ ] Code formatted (`npm run format`)

### Security
- [ ] RLS enabled on all tables
- [ ] RLS policies tested and working
- [ ] Environment variables secured (not committed)
- [ ] Secrets rotated (if previously exposed)
- [ ] CORS configured correctly

### Functionality
- [ ] Sign up flow working end-to-end
- [ ] Email confirmation working
- [ ] Login flow working
- [ ] Password reset working (if implemented)
- [ ] Protected routes redirecting correctly
- [ ] Profile CRUD operations working
- [ ] Avatar upload working (if implemented)

### Performance
- [ ] Lighthouse score > 90 (run in Chrome DevTools)
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3.5s
- [ ] No console errors or warnings

### Documentation
- [ ] README updated with production deployment steps
- [ ] Environment variables documented
- [ ] API documented (if applicable)
- [ ] Known issues documented

### Monitoring
- [ ] Vercel analytics enabled
- [ ] Error tracking set up (Sentry, optional)
- [ ] Supabase logs reviewed for errors
- [ ] Alert notifications configured

---

##  Post-Deployment

### Share Your App!

Your app is now live! 

**Next Steps:**
1. **Custom Domain (optional):**
   - Go to Vercel → Project → Settings → Domains
   - Add your custom domain
   - Update DNS records as shown
   - Update Supabase Site URL to match

2. **SSL Certificate:**
   - Automatic with Vercel
   - Vercel provides SSL for all domains

3. **Monitoring:**
   - Check Vercel and Supabase dashboards regularly
   - Set up uptime monitoring (UptimeRobot, etc.)

4. **Backup Strategy:**
   - Supabase performs automatic daily backups
   - Consider additional backups for critical data:
     ```bash
     npx supabase db dump --remote > backup-$(date +%Y%m%d).sql
     ```

5. **User Feedback:**
   - Monitor user reports
   - Track errors in production
   - Iterate based on real usage

---

## Support Resources

- **Vercel Docs:** https://vercel.com/docs
- **Supabase Docs:** https://supabase.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **GitHub Actions Docs:** https://docs.github.com/en/actions

**Need Help?**
- Vercel Community: https://github.com/vercel/next.js/discussions
- Supabase Community: https://github.com/supabase/supabase/discussions

---

**Congratulations on deploying your app! **
