# Manual Testing Checklist

**Last Updated:** February 23, 2026

Use this checklist to manually verify all features before deployment. Check off each item as you test it.

---

##  Pre-Testing Setup

- [ ] Local Supabase is running (`npx supabase start`)
- [ ] Development server is running (`npm run dev`)
- [ ] Browser DevTools console is open (to catch errors)
- [ ] All automated tests are passing (`npm test`)

---

## Authentication Flow Tests

### Sign Up Flow

- [ ] Navigate to `/signup`
- [ ] Form renders correctly with email and password fields
- [ ] Try submitting with empty fields
  - **Expected:** Validation errors shown
- [ ] Try submitting with invalid email
  - **Expected:** Email validation error
- [ ] Try submitting with short password (< 6 characters)
  - **Expected:** Password validation error
- [ ] Submit with valid credentials
  - **Expected:** Success message or redirect
- [ ] Check Supabase Dashboard → Authentication → Users
  - **Expected:** New user appears in list
- [ ] Check Supabase Dashboard → Table Editor → profiles
  - **Expected:** Profile automatically created with user_id matching auth.users
  - **Expected:** Email matches, display_name is null, avatar_url is null
- [ ] Check email inbox
  - **Expected:** Confirmation email received (if email confirmation enabled)

### Login Flow

- [ ] Navigate to `/login`
- [ ] Form renders correctly
- [ ] Try logging in with incorrect credentials
  - **Expected:** Error message displayed
- [ ] Try logging in with correct credentials
  - **Expected:** Successful login, redirect to dashboard
- [ ] Check that user information is displayed somewhere (e.g., navbar, dashboard)
  - **Expected:** User email or name visible

### Logout Flow

- [ ] While logged in, locate the sign out button
- [ ] Click sign out
  - **Expected:** Redirect to home page or login page
  - **Expected:** User session cleared
- [ ] Try accessing protected route (e.g., `/profile`)
  - **Expected:** Redirect to `/login`

---

## Protected Route Tests

### Access When Logged Out

- [ ] Log out (if logged in)
- [ ] Try to access `/dashboard`
  - **Expected:** Redirect to `/login`
- [ ] Try to access `/profile`
  - **Expected:** Redirect to `/login`

### Access When Logged In

- [ ] Log in with valid credentials
- [ ] Navigate to `/dashboard`
  - **Expected:** Page loads successfully
- [ ] Navigate to `/profile`
  - **Expected:** Page loads successfully
  - **Expected:** Profile data displayed

---

## Profile Management Tests

### View Profile

- [ ] Log in and navigate to `/profile`
- [ ] Verify profile data is displayed:
  - [ ] Email (should match logged-in user)
  - [ ] Display name (may be empty for new users)
  - [ ] Bio (may be empty)
  - [ ] Avatar (default or uploaded image)

### Edit Profile - Display Name

- [ ] On profile page, locate edit form
- [ ] Change display name to something new
- [ ] Submit form
  - **Expected:** Success message displayed
- [ ] Refresh page
  - **Expected:** New display name persists
- [ ] Check Supabase Dashboard → Table Editor → profiles
  - **Expected:** display_name column updated
  - **Expected:** updated_at timestamp changed

### Edit Profile - Bio

- [ ] Change bio text
- [ ] Submit form
  - **Expected:** Success message
- [ ] Refresh page
  - **Expected:** Bio persists

### Edit Profile - Validation

- [ ] Try setting display name to very long text (e.g., 500+ characters)
  - **Expected:** Validation error or truncation
- [ ] Try setting bio to very long text
  - **Expected:** Validation error or truncation

---

## Avatar Upload Tests

### Upload Valid Avatar

- [ ] On profile page, locate avatar upload section
- [ ] Click "Choose file" or upload button
- [ ] Select a valid image file (JPEG, PNG, GIF, or WebP under 5MB)
- [ ] Submit upload
  - **Expected:** Upload progress indicator (if implemented)
  - **Expected:** Success message
  - **Expected:** New avatar displayed immediately
- [ ] Refresh page
  - **Expected:** Avatar persists
- [ ] Check Supabase Dashboard → Storage → avatars bucket
  - **Expected:** File appears with path `{user_id}/{timestamp}-{filename}`
- [ ] Check Supabase Dashboard → Table Editor → profiles
  - **Expected:** avatar_url column contains public URL

### Upload Invalid Files

- [ ] Try uploading a file larger than 5MB
  - **Expected:** Error message "File size must be less than 5MB"
- [ ] Try uploading a non-image file (e.g., .txt, .pdf)
  - **Expected:** Error message about file type
- [ ] Try uploading without selecting a file
  - **Expected:** Error message or validation

### Replace Existing Avatar

- [ ] Upload avatar successfully (if not already done)
- [ ] Upload a different avatar
  - **Expected:** Old avatar replaced with new one
  - **Expected:** Only one avatar file per user in storage (or older one kept for history)

---

## Row Level Security (RLS) Tests

**Important:** These tests verify database security. They require creating multiple test accounts.

### Setup for RLS Tests

- [ ] Create two test user accounts:
  - **User A:** email1@test.com
  - **User B:** email2@test.com

### Test: User Cannot View Other Profiles

- [ ] Log in as User A
- [ ] Open browser DevTools → Console
- [ ] Run this query (using Supabase client in console):
  ```javascript
  // This would require exposing client for testing
  // In production, this would be done via API
  ```
- [ ] Alternatively, use Supabase Dashboard → SQL Editor:
  ```sql
  -- Set session as User A
  SET LOCAL ROLE authenticated;
  SET LOCAL request.jwt.claim.sub = 'user-a-id-here';
  
  -- Try to query User B's profile
  SELECT * FROM profiles WHERE user_id = 'user-b-id-here';
  ```
  - **Expected:** Query returns 0 rows (not an error, just empty)

### Test: User Cannot Update Other Profiles

- [ ] While logged in as User A, use SQL Editor:
  ```sql
  SET LOCAL ROLE authenticated;
  SET LOCAL request.jwt.claim.sub = 'user-a-id';
  
  UPDATE profiles
  SET display_name = 'Hacked!'
  WHERE user_id = 'user-b-id';
  ```
  - **Expected:** 0 rows affected (update silently fails)
- [ ] Verify User B's profile unchanged in Table Editor

### Test: User Can Only Update Own Profile

- [ ] Log in as User A
- [ ] Go to profile page
- [ ] Update display name
  - **Expected:** Update succeeds
- [ ] Check database:
  ```sql
  SELECT * FROM profiles WHERE user_id = 'user-a-id';
  ```
  - **Expected:** display_name updated for User A only

---

## UI Component Tests

### Button Component

- [ ] Check all pages for buttons
- [ ] Verify buttons have consistent styling
- [ ] Verify hover states work
- [ ] Verify disabled state displays correctly
- [ ] Verify loading state displays correctly (if implemented)

### Input Component

- [ ] Check all forms for inputs
- [ ] Verify inputs have consistent styling
- [ ] Verify placeholder text displays
- [ ] Verify error states display correctly
- [ ] Verify focus states work (outline/border highlight)

### Card Component

- [ ] Check pages that use Card component
- [ ] Verify cards have consistent styling
- [ ] Verify padding and spacing look good

### Form Component

- [ ] Test all forms in the app
- [ ] Verify form validation works
- [ ] Verify error messages display correctly
- [ ] Verify success messages display correctly

---

## Responsive Design Tests

### Desktop (1920x1080)

- [ ] Navigate through all pages
- [ ] Verify layout looks good
- [ ] Verify no horizontal scroll
- [ ] Verify text is readable
- [ ] Verify images scale appropriately

### Tablet (768x1024)

- [ ] Open DevTools → Toggle device toolbar
- [ ] Select iPad or similar
- [ ] Navigate through all pages
- [ ] Verify layout adapts correctly
- [ ] Verify navigation still works

### Mobile (375x667)

- [ ] Select iPhone SE or similar
- [ ] Navigate through all pages
- [ ] Verify layout stacks vertically
- [ ] Verify text is still readable
- [ ] Verify touch targets are large enough
- [ ] Verify no content is cut off

---

##  Browser Compatibility Tests

### Chrome (Primary)

- [ ] Test all features
- [ ] Check console for errors
- [ ] Verify no visual glitches

### Firefox

- [ ] Sign up flow works
- [ ] Login flow works
- [ ] Profile editing works
- [ ] Avatar upload works

### Safari (if on Mac/iOS)

- [ ] Sign up flow works
- [ ] Login flow works
- [ ] Profile editing works
- [ ] Avatar upload works

### Edge

- [ ] Sign up flow works
- [ ] Login flow works
- [ ] Profile editing works

---

## Performance Tests

### Lighthouse Audit

- [ ] Open DevTools → Lighthouse
- [ ] Run audit on home page
  - **Target:** Performance score > 90
  - **Target:** Accessibility score > 90
  - **Target:** Best Practices score > 90
  - **Target:** SEO score > 90
- [ ] Run audit on login page
  - **Target:** Similar scores
- [ ] Run audit on profile page (while logged in)
  - **Target:** Similar scores

### Page Load Times

- [ ] Open DevTools → Network tab
- [ ] Clear cache
- [ ] Reload home page
  - **Target:** DOMContentLoaded < 1s
  - **Target:** Load complete < 2s
- [ ] Navigate to profile page
  - **Target:** Similar load times

### Image Optimization

- [ ] Check Network tab when loading avatars
- [ ] Verify images are optimized (WebP if supported)
- [ ] Verify images are lazy-loaded
- [ ] Verify images have appropriate dimensions (not oversized)

---

## Error Handling Tests

### Network Errors

- [ ] Turn off internet (or use DevTools → Offline mode)
- [ ] Try to log in
  - **Expected:** User-friendly error message (not raw API error)
- [ ] Try to update profile
  - **Expected:** Network error message

### Invalid Data

- [ ] Manually edit form values in DevTools
- [ ] Try to submit invalid data
  - **Expected:** Validation catches it

### Session Expiration

- [ ] Log in
- [ ] Wait for session to expire (or manually delete auth cookies)
- [ ] Try to access profile page
  - **Expected:** Redirect to login (not crash)

---

## Console & Error Checks

### No Console Errors

- [ ] Navigate through entire app with DevTools console open
- [ ] Check for any console errors (red X icons)
  - **Expected:** No errors
- [ ] Check for console warnings
  - **Expected:** Minimal warnings (some from frameworks are okay)

### No Console Logs in Production

- [ ] Build app for production (`npm run build`)
- [ ] Run production build (`npm start` or `npx serve .next`)
- [ ] Navigate through app
  - **Expected:** No `console.log` statements (errors are okay for debugging)

---

## Security Checks

### No Exposed Secrets

- [ ] View page source (Ctrl+U)
- [ ] Search for "password", "secret", "key"
  - **Expected:** No sensitive data exposed
- [ ] Check Network tab → Click any request → Check request/response
  - **Expected:** No passwords or service role keys in requests

### HTTPS Enforcement (Production only)

- [ ] Once deployed, check that HTTP redirects to HTTPS
- [ ] Verify lock icon in browser address bar

### SQL Injection Prevention

- [ ] Try entering SQL code in form fields:
  - `'; DROP TABLE profiles; --`
  - `1' OR '1'='1`
  - **Expected:** Treated as literal text, not executed

---

## Final Verification

### All Tests Passing

- [ ] Automated tests: `npm test`
  - **Expected:** All tests pass
- [ ] Type check: `npx tsc --noEmit`
  - **Expected:** No type errors
- [ ] Lint check: `npm run lint`
  - **Expected:** No lint errors
- [ ] Build check: `npm run build`
  - **Expected:** Build succeeds

### Documentation Complete

- [ ] README.md is up to date
- [ ] ARCHITECTURE.md exists and is accurate
- [ ] DATABASE.md exists and is accurate
- [ ] DEPLOYMENT.md exists and is accurate
- [ ] All JSDoc comments are present

### Ready for Deployment

- [ ] All manual tests above are passing
- [ ] No known critical bugs
- [ ] Performance is acceptable
- [ ] Security checks passed
- [ ] Environment variables documented