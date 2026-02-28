# Manual Testing Checklist

**Last Updated:** February 23, 2026

Use this checklist to manually verify all features before deployment. Check off each item as you test it.

---

##  Pre-Testing Setup

- [x] Local Supabase is running (`npx supabase start`)
- [x] Development server is running (`npm run dev`)
- [x] Browser DevTools console is open (to catch errors)
- [x] All automated tests are passing (`npm test`)

---

## Authentication Flow Tests

### Sign Up Flow

- [x] Navigate to `/signup`
- [x] Form renders correctly with email and password fields
- [x] Try submitting with empty fields
  - **Expected:** Validation errors shown
- [x] Try submitting with invalid email
  - **Expected:** Email validation error
- [x] Try submitting with short password (< 6 characters)
  - **Expected:** Password validation error
- [x] Submit with valid credentials
  - **Expected:** Success message or redirect
- [x] Check Supabase Dashboard → Authentication → Users
  - **Expected:** New user appears in list
- [x] Check Supabase Dashboard → Table Editor → profiles
  - **Expected:** Profile automatically created with user_id matching auth.users
  - **Expected:** Email matches, full_name is null, avatar_url is null
- [x] Check email inbox
  - **Expected:** Confirmation email received (if email confirmation enabled)

### Login Flow

- [x] Navigate to `/login`
- [x] Form renders correctly
- [x] Try logging in with incorrect credentials
  - **Expected:** Error message displayed
- [x] Try logging in with correct credentials
  - **Expected:** Successful login, redirect to dashboard
- [x] Check that user information is displayed somewhere (e.g., navbar, dashboard)
  - **Expected:** User email or name visible

### Logout Flow

- [x] While logged in, locate the sign out button
- [x] Click sign out
  - **Expected:** Redirect to home page or login page
  - **Expected:** User session cleared
- [x] Try accessing protected route (e.g., `/profile`)
  - **Expected:** Redirect to `/login`

---

## Protected Route Tests

### Access When Logged Out

- [x] Log out (if logged in)
- [x] Try to access `/dashboard`
  - **Expected:** Redirect to `/login`
- [x] Try to access `/profile`
  - **Expected:** Redirect to `/login`

### Access When Logged In

- [x] Log in with valid credentials
- [x] Navigate to `/dashboard`
  - **Expected:** Page loads successfully
- [x] Navigate to `/profile`
  - **Expected:** Page loads successfully
  - **Expected:** Profile data displayed

---

## Profile Management Tests

### View Profile

- [x] Log in and navigate to `/profile`
- [x] Verify profile data is displayed:
  - [x] Email (should match logged-in user)
  - [x] Display name (may be empty for new users)
  - [x] Bio (may be empty)
  - [x] Avatar (default or uploaded image)

### Edit Profile - Display Name

- [x] On profile page, locate edit form
- [x] Change display name to something new
- [x] Submit form
  - **Expected:** Success message displayed
- [x] Refresh page
  - **Expected:** New display name persists
- [x] Check Supabase Dashboard → Table Editor → profiles
  - **Expected:** full_name column updated
  - **Expected:** updated_at timestamp changed

### Edit Profile - Bio

- [x] Change bio text
- [x] Submit form
  - **Expected:** Success message
- [x] Refresh page
  - **Expected:** Bio persists

### Edit Profile - Validation

- [x] Try setting display name to very long text (e.g., 500+ characters)
  - **Expected:** Validation error or truncation
- [x] Try setting bio to very long text
  - **Expected:** Validation error or truncation

---

## Avatar Upload Tests

### Upload Valid Avatar

- [x] On profile page, locate avatar upload section
- [x] Click "Choose file" or upload button
- [x] Select a valid image file (JPEG, PNG, GIF, or WebP under 5MB)
- [x] Submit upload
  - **Expected:** Upload progress indicator (if implemented)
  - **Expected:** Success message
  - **Expected:** New avatar displayed immediately
- [x] Refresh page
  - **Expected:** Avatar persists
- [x] Check Supabase Dashboard → Storage → avatars bucket
  - **Expected:** File appears with path `{user_id}/{timestamp}-{filename}`
- [x] Check Supabase Dashboard → Table Editor → profiles
  - **Expected:** avatar_url column contains public URL


### Replace Existing Avatar

- [x] Upload avatar successfully (if not already done)
- [x] Upload a different avatar
  - **Expected:** Old avatar replaced with new one
  - **Expected:** Only one avatar file per user in storage (or older one kept for history)

---

## Row Level Security (RLS) Tests

**Important:** These tests verify database security. They require creating multiple test accounts.

### Setup for RLS Tests

- [x] Create two test user accounts:
  - **User A:** email1@test.com
  - **User B:** email2@test.com

### Test: User Cannot View Other Profiles

- [x] Log in as User A
- [x] Use Supabase Dashboard → SQL Editor:
  ```sql
  -- Set session as User A
  SET LOCAL ROLE authenticated;
  SET LOCAL request.jwt.claim.sub = 'user-a-id-here';
  
  -- Try to query User B's profile
  SELECT * FROM profiles WHERE profiles.id = 'user-b-id-here';
  ```
  - **Expected:** Query returns 0 rows (not an error, just empty)

### Test: User Cannot Update Other Profiles

- [x] While logged in as User A, use SQL Editor:
  ```sql
  SET LOCAL ROLE authenticated;
  SET LOCAL request.jwt.claim.sub = 'user-a-id';
  
  UPDATE profiles
  SET full_name = 'Hacked!'
  WHERE profiles.id = 'user-b-id';
  ```
  - **Expected:** 0 rows affected (update silently fails)
- [x] Verify User B's profile unchanged in Table Editor

### Test: User Can Only Update Own Profile

- [x] Log in as User A
- [x] Go to profile page
- [x] Update display name
  - **Expected:** Update succeeds
- [x] Check database:
  ```sql
  SELECT * FROM profiles WHERE profiles.id = 'user-a-id';
  ```
  - **Expected:** full_name updated for User A only

---

## UI Component Tests

### Button Component

- [x] Check all pages for buttons
- [x] Verify buttons have consistent styling
- [x] Verify hover states work
- [x] Verify disabled state displays correctly

### Input Component

- [x] Check all forms for inputs
- [x] Verify inputs have consistent styling
- [x] Verify placeholder text displays
- [x] Verify error states display correctly
- [x] Verify focus states work (outline/border highlight)

### Card Component

- [x] Check pages that use Card component
- [x] Verify cards have consistent styling
- [x] Verify padding and spacing look good

### Form Component

- [x] Test all forms in the app
- [x] Verify form validation works
- [x] Verify error messages display correctly
- [x] Verify success messages display correctly

---

## Responsive Design Tests

### Desktop (1920x1080)

- [x] Navigate through all pages
- [x] Verify layout looks good
- [x] Verify no horizontal scroll
- [x] Verify text is readable
- [x] Verify images scale appropriately

### Tablet (768x1024)

- [x] Open DevTools → Toggle device toolbar
- [x] Select iPad or similar
- [x] Navigate through all pages
- [x] Verify layout adapts correctly
- [x] Verify navigation still works

### Mobile (375x667)

- [x] Select iPhone SE or similar
- [x] Navigate through all pages
- [x] Verify layout stacks vertically
- [x] Verify text is still readable
- [x] Verify touch targets are large enough
- [x] Verify no content is cut off

## Error Handling Tests

### Network Errors

- [x] Turn off internet (or use DevTools → Offline mode)
- [x] Try to log in
  - **Expected:** User-friendly error message (not raw API error)
- [ ] Try to update profile
  - **Expected:** Network error message

### Session Expiration

- [x] Log in
- [x] Wait for session to expire (or manually delete auth cookies)
- [x] Try to access profile page
  - **Expected:** Redirect to login (not crash)

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