#!/usr/bin/env node

/**
 * Database Migration Runner
 * Runs SQL migration files in the migrations directory
 */

const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

// Database configuration from environment
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'evenup_development',
  user: process.env.DB_USER || 'evenup_user',
  password: process.env.DB_PASSWORD,
};

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

const log = {
  info: (msg) => console.log(`${colors.blue}[INFO]${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}[SUCCESS]${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}[WARNING]${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}[ERROR]${colors.reset} ${msg}`),
};

async function createMigrationsTable(client) {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS migrations (
      id SERIAL PRIMARY KEY,
      filename VARCHAR(255) NOT NULL UNIQUE,
      executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `;
  
  await client.query(createTableQuery);
  log.info('Migrations table ready');
}

async function getExecutedMigrations(client) {
  try {
    const result = await client.query('SELECT filename FROM migrations ORDER BY executed_at');
    return result.rows.map(row => row.filename);
  } catch (error) {
    // Table might not exist yet
    return [];
  }
}

async function getMigrationFiles() {
  const migrationsDir = path.join(__dirname, '..', 'backend', 'src', 'migrations');
  
  if (!fs.existsSync(migrationsDir)) {
    log.error(`Migrations directory not found: ${migrationsDir}`);
    process.exit(1);
  }
  
  const files = fs.readdirSync(migrationsDir)
    .filter(file => file.endsWith('.sql'))
    .sort();
  
  return files.map(file => ({
    filename: file,
    path: path.join(migrationsDir, file)
  }));
}

async function executeMigration(client, migration) {
  log.info(`Executing migration: ${migration.filename}`);
  
  try {
    const sql = fs.readFileSync(migration.path, 'utf8');
    
    // Begin transaction
    await client.query('BEGIN');
    
    // Execute migration SQL
    await client.query(sql);
    
    // Record migration
    await client.query(
      'INSERT INTO migrations (filename) VALUES ($1)',
      [migration.filename]
    );
    
    // Commit transaction
    await client.query('COMMIT');
    
    log.success(`Migration completed: ${migration.filename}`);
  } catch (error) {
    // Rollback transaction
    await client.query('ROLLBACK');
    throw error;
  }
}

async function runMigrations() {
  const client = new Client(dbConfig);
  
  try {
    log.info('Connecting to database...');
    await client.connect();
    log.success('Connected to database');
    
    // Create migrations table if it doesn't exist
    await createMigrationsTable(client);
    
    // Get already executed migrations
    const executedMigrations = await getExecutedMigrations(client);
    log.info(`Found ${executedMigrations.length} executed migrations`);
    
    // Get all migration files
    const migrationFiles = await getMigrationFiles();
    log.info(`Found ${migrationFiles.length} migration files`);
    
    // Filter out already executed migrations
    const pendingMigrations = migrationFiles.filter(
      migration => !executedMigrations.includes(migration.filename)
    );
    
    if (pendingMigrations.length === 0) {
      log.success('No pending migrations');
      return;
    }
    
    log.info(`Executing ${pendingMigrations.length} pending migrations...`);
    
    // Execute pending migrations
    for (const migration of pendingMigrations) {
      await executeMigration(client, migration);
    }
    
    log.success('All migrations completed successfully');
    
  } catch (error) {
    log.error(`Migration failed: ${error.message}`);
    if (error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  } finally {
    await client.end();
  }
}

// Check if this script is being run directly
if (require.main === module) {
  // Load environment variables
  require('dotenv').config({ path: path.join(__dirname, '..', 'backend', '.env') });
  
  runMigrations().catch(error => {
    log.error(`Unexpected error: ${error.message}`);
    process.exit(1);
  });
}

module.exports = { runMigrations };