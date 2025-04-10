/**
 * This script can be used to initialize your database on Render
 * Run it after setting the DATABASE_URL environment variable
 * 
 * Usage: node db-setup.js
 */

const { Pool } = require('pg');

// Check for DATABASE_URL
if (!process.env.DATABASE_URL) {
  console.error('\x1b[31mERROR: DATABASE_URL environment variable is not set\x1b[0m');
  console.log('Please make sure to set the DATABASE_URL environment variable in your Render dashboard.');
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function createTables() {
  console.log('📊 Connecting to database...');
  
  try {
    const client = await pool.connect();
    
    console.log('✅ Connected to database');
    console.log('📝 Creating tables...');
    
    // Create users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        first_name TEXT,
        last_name TEXT,
        phone TEXT,
        role TEXT NOT NULL DEFAULT 'buyer',
        avatar TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ Users table created or already exists');
    
    // Create properties table
    await client.query(`
      CREATE TABLE IF NOT EXISTS properties (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        price INTEGER NOT NULL,
        address TEXT NOT NULL,
        city TEXT NOT NULL,
        state TEXT NOT NULL,
        zip_code TEXT NOT NULL,
        country TEXT NOT NULL,
        property_type TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'for_sale',
        bedrooms INTEGER NOT NULL,
        bathrooms INTEGER NOT NULL,
        area INTEGER NOT NULL,
        year_built INTEGER,
        images JSONB DEFAULT '[]',
        features JSONB DEFAULT '[]',
        user_id INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ Properties table created or already exists');
    
    // Create inquiries table
    await client.query(`
      CREATE TABLE IF NOT EXISTS inquiries (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        message TEXT NOT NULL,
        property_id INTEGER,
        user_id INTEGER,
        created_at TIMESTAMP DEFAULT NOW(),
        status TEXT DEFAULT 'pending'
      );
    `);
    console.log('✅ Inquiries table created or already exists');
    
    // Create favorites table
    await client.query(`
      CREATE TABLE IF NOT EXISTS favorites (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        property_id INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ Favorites table created or already exists');
    
    // Create session table for PostgreSQL session store
    await client.query(`
      CREATE TABLE IF NOT EXISTS session (
        sid VARCHAR NOT NULL,
        sess JSON NOT NULL,
        expire TIMESTAMP(6) NOT NULL,
        PRIMARY KEY (sid)
      );
    `);
    console.log('✅ Session table created or already exists');
    
    console.log('🎉 All tables created successfully!');
    
    // Release client back to pool
    client.release();
  } catch (err) {
    console.error('\x1b[31mERROR: Failed to create tables\x1b[0m', err);
    process.exit(1);
  } finally {
    // Close pool
    await pool.end();
  }
}

createTables();