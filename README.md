# Assignment 2: Boilerplate

This app will be the basis of future projects.

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
