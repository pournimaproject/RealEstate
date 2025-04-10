import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Enhanced connection configuration with better error handling
const poolConfig = {
  connectionString: process.env.DATABASE_URL,
  // In production, most cloud providers require SSL
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined
};

console.log('Connecting to database...');
try {
  const hostnameInfo = process.env.DATABASE_URL?.split('@')[1]?.split('/')[0] || 'unknown';
  console.log('(Connection hostname:', hostnameInfo, ')');
} catch (e) {
  console.log('(Could not parse connection string)');
}

// Create pool with error handling
const pool = new Pool(poolConfig);

// Test the connection
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Create the db instance
const db = drizzle(pool, { schema });

// Test the connection
pool.query('SELECT NOW()', [])
  .then(() => {
    console.log('Database connection established successfully');
  })
  .catch((error) => {
    console.error('Failed to connect to database:', error);
    console.error('Error details:', error.message);
    if (error.message.includes('ENOTFOUND')) {
      console.error('DNS error: Cannot resolve the database hostname. Check your DATABASE_URL.');
    }
  });

export { pool, db };