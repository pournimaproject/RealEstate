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

### Option 1: Create a PostgreSQL Database on Render (RECOMMENDED)

1. In your Render dashboard, go to "New +"
2. Select "PostgreSQL"
3. Fill in the details:
   - Name: `real-estate-db`
   - Database: `real_estate_db`
   - User: `real_estate_user`
   - Region: Choose closest to your users
4. Click "Create Database"
5. Once created, note down the "Internal Database URL" - you'll need this in the next step
6. **IMPORTANT**: Make sure to copy the "Internal Database URL" and not the "External Database URL" if you're connecting from another Render service

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

5. **CRITICAL**: Add Environment Variables (this is required for the app to work):
   - `DATABASE_URL`: Your PostgreSQL connection string from step 3
   - `SESSION_SECRET`: A random string for session encryption (e.g., use `openssl rand -hex 32` to generate)
   - `NODE_ENV`: `production`

6. Click "Create Web Service"

## 5. Create Database Tables

After deploying, if you get the error "DATABASE_URL must be set", it means the environment variable isn't properly set.

To fix this:
1. Go to your web service in Render dashboard
2. Click on "Environment" tab
3. Verify that `DATABASE_URL` is correctly set to your PostgreSQL connection URL
4. If needed, update the value and click "Save Changes"
5. Trigger a manual deploy by clicking the "Manual Deploy" button and select "Clear build cache & deploy"

### Setting up your database tables manually

If your application fails to create tables automatically, you can use the provided `db-setup.js` script:

1. SSH into your Render instance or use the Render Shell feature
2. Run the database setup script:
   ```bash
   node db-setup.js
   ```
   
Or run it locally by setting the DATABASE_URL environment variable:
```bash
DATABASE_URL="your-database-url" node db-setup.js
```

## 6. Monitor & Debug

1. Once deployed, monitor your app's logs in the Render dashboard
2. Common deployment errors and solutions:
   - **"DATABASE_URL must be set"**: The environment variable isn't set or is incorrect
   - **Connection errors**: Check if your database is accessible from Render (use "Internal Database URL" if both services are on Render)
   - **Build failures**: Check your build logs for specific errors

## 7. Set Up a Custom Domain (Optional)

1. In your Render dashboard, go to your web service
2. Navigate to "Settings" > "Custom Domain"
3. Follow the instructions to add and verify your domain

## 8. Enable HTTPS (Optional)

Render automatically provisions SSL certificates for custom domains.

## Troubleshooting Common Issues

1. **Database Connection Errors**: 
   - If using Render PostgreSQL, make sure you're using the "Internal Database URL"
   - If using an external database, make sure the connection string is correct and the database allows connections from Render

2. **Deployment Errors**:
   - Check the application logs in the Render dashboard
   - If you see "DATABASE_URL must be set", follow the instructions in section 5
   - If tables don't exist, you may need to manually create them or implement a migration system

3. **Environment Variables**:
   - Verify all environment variables are correctly set in the Render dashboard
   - After changing environment variables, you need to redeploy the application

Remember to never commit sensitive data like API keys, database credentials, or session secrets to your repository.