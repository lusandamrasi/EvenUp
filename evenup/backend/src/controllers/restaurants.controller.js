const { query } = require('../config/database');
const logger = require('../utils/logger');

// Get all restaurants
const getRestaurants = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, cuisine_type } = req.query;
    const offset = (page - 1) * limit;

    let queryText = `
      SELECT id, name, address, phone, cuisine_type, description, 
             latitude, longitude, created_at, updated_at
      FROM restaurants
      WHERE 1=1
    `;
    const queryParams = [];
    let paramCount = 0;

    if (search) {
      paramCount++;
      queryText += ` AND (name ILIKE $${paramCount} OR description ILIKE $${paramCount})`;
      queryParams.push(`%${search}%`);
    }

    if (cuisine_type) {
      paramCount++;
      queryText += ` AND cuisine_type = $${paramCount}`;
      queryParams.push(cuisine_type);
    }

    queryText += ` ORDER BY name ASC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    queryParams.push(limit, offset);

    const result = await query(queryText, queryParams);

    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) FROM restaurants WHERE 1=1';
    const countParams = [];
    let countParamCount = 0;

    if (search) {
      countParamCount++;
      countQuery += ` AND (name ILIKE $${countParamCount} OR description ILIKE $${countParamCount})`;
      countParams.push(`%${search}%`);
    }

    if (cuisine_type) {
      countParamCount++;
      countQuery += ` AND cuisine_type = $${countParamCount}`;
      countParams.push(cuisine_type);
    }

    const countResult = await query(countQuery, countParams);
    const totalCount = parseInt(countResult.rows[0].count);

    res.json({
      success: true,
      data: {
        restaurants: result.rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: totalCount,
          pages: Math.ceil(totalCount / limit)
        }
      }
    });
  } catch (error) {
    logger.error('Get restaurants error:', error);
    next(error);
  }
};

// Get restaurant by ID
const getRestaurantById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await query(
      `SELECT id, name, address, phone, cuisine_type, description,
              latitude, longitude, created_at, updated_at
       FROM restaurants WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Restaurant not found'
      });
    }

    res.json({
      success: true,
      data: {
        restaurant: result.rows[0]
      }
    });
  } catch (error) {
    logger.error('Get restaurant by ID error:', error);
    next(error);
  }
};

// Create restaurant (admin only)
const createRestaurant = async (req, res, next) => {
  try {
    const {
      name,
      address,
      phone,
      cuisine_type,
      description,
      latitude,
      longitude
    } = req.body;

    const result = await query(
      `INSERT INTO restaurants (name, address, phone, cuisine_type, description,
                               latitude, longitude, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
       RETURNING id, name, address, phone, cuisine_type, description,
                 latitude, longitude, created_at, updated_at`,
      [name, address, phone, cuisine_type, description, latitude, longitude]
    );

    const restaurant = result.rows[0];

    logger.info('Restaurant created', { restaurantId: restaurant.id, name });

    res.status(201).json({
      success: true,
      data: {
        restaurant
      }
    });
  } catch (error) {
    logger.error('Create restaurant error:', error);
    next(error);
  }
};

// Update restaurant (admin only)
const updateRestaurant = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      name,
      address,
      phone,
      cuisine_type,
      description,
      latitude,
      longitude
    } = req.body;

    const result = await query(
      `UPDATE restaurants 
       SET name = $1, address = $2, phone = $3, cuisine_type = $4,
           description = $5, latitude = $6, longitude = $7, updated_at = NOW()
       WHERE id = $8
       RETURNING id, name, address, phone, cuisine_type, description,
                 latitude, longitude, created_at, updated_at`,
      [name, address, phone, cuisine_type, description, latitude, longitude, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Restaurant not found'
      });
    }

    logger.info('Restaurant updated', { restaurantId: id });

    res.json({
      success: true,
      data: {
        restaurant: result.rows[0]
      }
    });
  } catch (error) {
    logger.error('Update restaurant error:', error);
    next(error);
  }
};

// Delete restaurant (admin only)
const deleteRestaurant = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await query(
      'DELETE FROM restaurants WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Restaurant not found'
      });
    }

    logger.info('Restaurant deleted', { restaurantId: id });

    res.json({
      success: true,
      message: 'Restaurant deleted successfully'
    });
  } catch (error) {
    logger.error('Delete restaurant error:', error);
    next(error);
  }
};

module.exports = {
  getRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant
};