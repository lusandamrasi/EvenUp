const redis = require('redis');
const logger = require('../utils/logger');

const client = redis.createClient({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  retry_strategy: (options) => {
    if (options.error && options.error.code === 'ECONNREFUSED') {
      logger.error('The Redis server refused the connection');
      return new Error('The Redis server refused the connection');
    }
    if (options.total_retry_time > 1000 * 60 * 60) {
      logger.error('Redis retry time exhausted');
      return new Error('Retry time exhausted');
    }
    if (options.attempt > 10) {
      return undefined;
    }
    return Math.min(options.attempt * 100, 3000);
  }
});

client.on('connect', () => {
  logger.info('Connected to Redis server');
});

client.on('error', (err) => {
  logger.error('Redis client error:', err);
});

client.on('ready', () => {
  logger.info('Redis client ready to use');
});

client.on('end', () => {
  logger.info('Redis client connection closed');
});

// Helper functions for common Redis operations
const setWithExpiry = async (key, value, expiryInSeconds = 3600) => {
  try {
    await client.setEx(key, expiryInSeconds, JSON.stringify(value));
  } catch (error) {
    logger.error('Redis set error:', error);
    throw error;
  }
};

const get = async (key) => {
  try {
    const value = await client.get(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    logger.error('Redis get error:', error);
    throw error;
  }
};

const del = async (key) => {
  try {
    await client.del(key);
  } catch (error) {
    logger.error('Redis delete error:', error);
    throw error;
  }
};

module.exports = {
  client,
  setWithExpiry,
  get,
  del
};