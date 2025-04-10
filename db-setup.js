/**
 * Database setup script
 * 
 * This script checks if the database exists and sets up the necessary tables
 * using Drizzle ORM's schema definitions.
 * 
 * Usage: node db-setup.js
 */

const { Pool } = require('@neondatabase/serverless');
const { drizzle } = require('drizzle-orm/neon-serverless');
const { migrate } = require('drizzle-orm/neon-serverless/migrator');
const path = require('path');

// Validate environment variables
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL is not set');
  process.exit(1);
}

console.log('✨ Starting database setup...');

// Connect to the database
const poolConfig = {
  connectionString: process.env.DATABASE_URL,
  // In production, most cloud providers require SSL
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined
};

async function setupDatabase() {
  try {
    console.log('🔄 Connecting to database...');
    const pool = new Pool(poolConfig);
    
    // Test connection
    const { rows } = await pool.query('SELECT current_timestamp as now');
    console.log(`✅ Connected to database successfully at ${rows[0].now}`);
    
    // Import the schema
    console.log('📋 Setting up database tables...');
    
    // Create tables programmatically
    const db = drizzle(pool);
    
    // Check if users table exists
    try {
      await pool.query('SELECT 1 FROM users LIMIT 1');
      console.log('✅ Users table already exists');
    } catch (error) {
      if (error.code === '42P01') { // table does not exist
        console.log('⚙️ Creating users table...');
        await pool.query(`
          CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(50) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            email VARCHAR(100) NOT NULL UNIQUE,
            first_name VARCHAR(50),
            last_name VARCHAR(50),
            phone VARCHAR(20),
            role VARCHAR(20) NOT NULL DEFAULT 'user',
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
          )
        `);
        console.log('✅ Users table created successfully');
      } else {
        console.error('❌ Error checking users table:', error);
      }
    }
    
    // Check if properties table exists
    try {
      await pool.query('SELECT 1 FROM properties LIMIT 1');
      console.log('✅ Properties table already exists');
    } catch (error) {
      if (error.code === '42P01') { // table does not exist
        console.log('⚙️ Creating properties table...');
        await pool.query(`
          CREATE TABLE IF NOT EXISTS properties (
            id SERIAL PRIMARY KEY,
            title VARCHAR(100) NOT NULL,
            description TEXT NOT NULL,
            price NUMERIC NOT NULL,
            property_type VARCHAR(50) NOT NULL,
            status VARCHAR(20) NOT NULL DEFAULT 'available',
            location VARCHAR(100) NOT NULL,
            address TEXT NOT NULL, 
            bedrooms INTEGER NOT NULL,
            bathrooms INTEGER NOT NULL,
            area NUMERIC NOT NULL,
            amenities TEXT[] NOT NULL DEFAULT '{}',
            images TEXT[] NOT NULL DEFAULT '{}',
            featured BOOLEAN NOT NULL DEFAULT false,
            user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
          )
        `);
        console.log('✅ Properties table created successfully');
      } else {
        console.error('❌ Error checking properties table:', error);
      }
    }
    
    // Check if inquiries table exists
    try {
      await pool.query('SELECT 1 FROM inquiries LIMIT 1');
      console.log('✅ Inquiries table already exists');
    } catch (error) {
      if (error.code === '42P01') { // table does not exist
        console.log('⚙️ Creating inquiries table...');
        await pool.query(`
          CREATE TABLE IF NOT EXISTS inquiries (
            id SERIAL PRIMARY KEY,
            message TEXT NOT NULL,
            status VARCHAR(20) NOT NULL DEFAULT 'pending',
            user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            property_id INTEGER NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
          )
        `);
        console.log('✅ Inquiries table created successfully');
      } else {
        console.error('❌ Error checking inquiries table:', error);
      }
    }
    
    // Check if favorites table exists
    try {
      await pool.query('SELECT 1 FROM favorites LIMIT 1');
      console.log('✅ Favorites table already exists');
    } catch (error) {
      if (error.code === '42P01') { // table does not exist
        console.log('⚙️ Creating favorites table...');
        await pool.query(`
          CREATE TABLE IF NOT EXISTS favorites (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            property_id INTEGER NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(user_id, property_id)
          )
        `);
        console.log('✅ Favorites table created successfully');
      } else {
        console.error('❌ Error checking favorites table:', error);
      }
    }
    
    // Create a session store table for connect-pg-simple if used
    try {
      await pool.query('SELECT 1 FROM session LIMIT 1');
      console.log('✅ Session table already exists');
    } catch (error) {
      if (error.code === '42P01') { // table does not exist
        console.log('⚙️ Creating session table...');
        await pool.query(`
          CREATE TABLE IF NOT EXISTS "session" (
            "sid" varchar NOT NULL COLLATE "default",
            "sess" json NOT NULL,
            "expire" timestamp(6) NOT NULL,
            CONSTRAINT "session_pkey" PRIMARY KEY ("sid")
          )
        `);
        console.log('✅ Session table created successfully');
      } else {
        console.error('❌ Error checking session table:', error);
      }
    }
    
    console.log('🎉 Database setup completed successfully!');
    await pool.end();
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    console.error('Error details:', error.message);
    if (error.message.includes('ENOTFOUND')) {
      console.error('DNS error: Cannot resolve the database hostname. Check your DATABASE_URL.');
    }
    process.exit(1);
  }
}

setupDatabase();