#!/usr/bin/env bash
# Render build script for the real estate application

set -o errexit

echo "🚀 Starting build process..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the application
echo "🔨 Building the application..."
npm run build

# Check database connection and setup tables
echo "🛢️ Verifying database..."
node db-setup.js

echo "✅ Build process completed successfully!"