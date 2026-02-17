# components Directory

This directory contains all React components organized by purpose.

## Structure

- **`ui/`** - Reusable UI components (buttons, forms, cards, etc.)
  - Low-level, generic components
  - Should be framework-agnostic when possible
  - Can be used across multiple features

- **`auth/`** - Authentication-related components
  - LoginForm
  - SignupForm
  - ProfileForm

- **`shared/`** - Shared feature components
  - Components specific to a feature but used in multiple places
  - Navigation components
  - Layout components

## Component Guidelines

- One component per file
- Use descriptive PascalCase file names
- Add TypeScript prop types/interfaces
- Include JSDoc comments explaining component purpose
- Write component tests before implementation
- Keep components focused and reusable
- Use composition over prop drilling

## File Naming

- Component files: `ComponentName.tsx`
- Component test files: `ComponentName.test.tsx`
- Avoid generic names like `Item.tsx` or `Card.tsx` (use more specific names)
