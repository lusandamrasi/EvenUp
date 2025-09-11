#!/usr/bin/env node

/**
 * Database Seeding Script
 * Populates the database with sample data for development
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

async function getSeedFiles() {
  const seedsDir = path.join(__dirname, '..', 'backend', 'src', 'seeds');
  
  if (!fs.existsSync(seedsDir)) {
    log.error(`Seeds directory not found: ${seedsDir}`);
    process.exit(1);
  }
  
  const files = fs.readdirSync(seedsDir)
    .filter(file => file.endsWith('.sql'))
    .sort();
  
  return files.map(file => ({
    filename: file,
    path: path.join(seedsDir, file)
  }));
}

async function checkIfSeeded(client) {
  try {
    const result = await client.query('SELECT COUNT(*) FROM restaurants');
    const count = parseInt(result.rows[0].count);
    return count > 0;
  } catch (error) {
    // Table might not exist yet
    return false;
  }
}

async function executeSeedFile(client, seedFile) {
  log.info(`Executing seed file: ${seedFile.filename}`);
  
  try {
    const sql = fs.readFileSync(seedFile.path, 'utf8');
    
    // Begin transaction
    await client.query('BEGIN');
    
    // Execute seed SQL
    await client.query(sql);
    
    // Commit transaction
    await client.query('COMMIT');
    
    log.success(`Seed file completed: ${seedFile.filename}`);
  } catch (error) {
    // Rollback transaction
    await client.query('ROLLBACK');
    throw error;
  }
}

async function clearExistingData(client) {
  log.warning('Clearing existing data...');
  
  try {
    await client.query('BEGIN');
    
    // Delete in order to respect foreign key constraints
    await client.query('DELETE FROM payments');
    await client.query('DELETE FROM orders');
    await client.query('DELETE FROM group_members');
    await client.query('DELETE FROM groups');
    await client.query('DELETE FROM menu_items');
    await client.query('DELETE FROM restaurants');
    await client.query('DELETE FROM users WHERE email LIKE \'%example.com\''); // Only delete test users
    
    // Reset sequences
    await client.query('ALTER SEQUENCE restaurants_id_seq RESTART WITH 1');
    await client.query('ALTER SEQUENCE menu_items_id_seq RESTART WITH 1');
    await client.query('ALTER SEQUENCE groups_id_seq RESTART WITH 1');
    await client.query('ALTER SEQUENCE orders_id_seq RESTART WITH 1');
    await client.query('ALTER SEQUENCE payments_id_seq RESTART WITH 1');
    
    await client.query('COMMIT');
    log.success('Existing data cleared');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  }
}

async function runSeeds(options = {}) {
  const { force = false } = options;
  const client = new Client(dbConfig);
  
  try {
    log.info('Connecting to database...');
    await client.connect();
    log.success('Connected to database');
    
    // Check if database is already seeded
    const isSeeded = await checkIfSeeded(client);
    
    if (isSeeded && !force) {
      log.warning('Database appears to be already seeded');
      log.info('Use --force flag to re-seed the database');
      return;
    }
    
    if (force && isSeeded) {
      await clearExistingData(client);
    }
    
    // Get all seed files
    const seedFiles = await getSeedFiles();
    log.info(`Found ${seedFiles.length} seed files`);
    
    if (seedFiles.length === 0) {
      log.warning('No seed files found');
      return;
    }
    
    log.info('Executing seed files...');
    
    // Execute seed files
    for (const seedFile of seedFiles) {
      await executeSeedFile(client, seedFile);
    }
    
    log.success('All seed files executed successfully');
    log.info('Sample data has been loaded into the database');
    
    // Print some helpful information
    const restaurantCount = await client.query('SELECT COUNT(*) FROM restaurants');
    const menuItemCount = await client.query('SELECT COUNT(*) FROM menu_items');
    
    log.info(`Created ${restaurantCount.rows[0].count} restaurants`);
    log.info(`Created ${menuItemCount.rows[0].count} menu items`);
    
  } catch (error) {
    log.error(`Seeding failed: ${error.message}`);
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
  
  // Parse command line arguments
  const args = process.argv.slice(2);
  const force = args.includes('--force') || args.includes('-f');
  
  runSeeds({ force }).catch(error => {
    log.error(`Unexpected error: ${error.message}`);
    process.exit(1);
  });
}

module.exports = { runSeeds };