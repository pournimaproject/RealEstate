# Deployment Guide for Real Estate Website on Render

Follow these steps to deploy your Real Estate Website on Render:

## 1. Prerequisites

- [GitHub account](https://github.com/join)
- [Render account](https://render.com/)
- A PostgreSQL database (can be created on Render or use services like Neon, Supabase, or Railway)

## 2. Set Up a Git Repository

1. Create a new repository on GitHub
2. Push your code to the repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

## 3. Set Up a PostgreSQL Database

### Option 1: Create a PostgreSQL Database on Render

1. In your Render dashboard, go to "New +"
2. Select "PostgreSQL"
3. Fill in the details:
   - Name: `real-estate-db`
   - Database: `real_estate_db`
   - User: `real_estate_user`
   - Region: Choose closest to your users
4. Click "Create Database"
5. Once created, note down the "Internal Database URL" - you'll need this later

### Option 2: Use an External PostgreSQL Provider

You can use services like:
- [Neon](https://neon.tech/)
- [Supabase](https://supabase.com/)
- [Railway](https://railway.app/)

Follow their documentation to create a PostgreSQL database and get your connection string.

## 4. Deploy the Web Service on Render

1. In your Render dashboard, go to "New +"
2. Select "Web Service"
3. Connect your GitHub repository
4. Fill in the details:
   - Name: `real-estate-website`
   - Region: Choose closest to your users
   - Branch: `main` (or your default branch)
   - Runtime: `Node`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Instance Type: Free (or choose a paid plan for production)

5. Add Environment Variables:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `SESSION_SECRET`: A random string for session encryption (e.g., use `openssl rand -hex 32` to generate)
   - `NODE_ENV`: `production`

6. Click "Create Web Service"

## 5. Initialize Database (if needed)

If your app needs to create database tables on first run, make sure your server code handles this properly.

## 6. Monitor & Debug

1. Once deployed, monitor your app's logs in the Render dashboard
2. If you encounter issues, check:
   - Database connection
   - Environment variables
   - Build logs
   - Runtime logs

## 7. Set Up a Custom Domain (Optional)

1. In your Render dashboard, go to your web service
2. Navigate to "Settings" > "Custom Domain"
3. Follow the instructions to add and verify your domain

## 8. Enable HTTPS (Optional)

Render automatically provisions SSL certificates for custom domains.

## Troubleshooting Common Issues

1. **Database Connection Errors**: Verify your `DATABASE_URL` is correct and the database is accessible from Render
2. **Build Failures**: Check your `build` script in package.json and build logs in Render
3. **Runtime Errors**: Review your application logs in the Render dashboard
4. **Missing Environment Variables**: Ensure all required environment variables are set correctly

Remember to never commit sensitive data like API keys, database credentials, or session secrets to your repository.