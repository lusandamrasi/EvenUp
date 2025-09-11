const { query } = require('../config/database');
const logger = require('../utils/logger');

// Get menu items for a restaurant
const getMenuItems = async (req, res, next) => {
  try {
    const { restaurantId } = req.params;
    const { category } = req.query;

    let queryText = `
      SELECT id, restaurant_id, name, description, price, category, 
             dietary_info, image_url, is_available, created_at, updated_at
      FROM menu_items 
      WHERE restaurant_id = $1
    `;
    const queryParams = [restaurantId];

    if (category) {
      queryText += ` AND category = $2`;
      queryParams.push(category);
    }

    queryText += ` ORDER BY category, name`;

    const result = await query(queryText, queryParams);

    res.json({
      success: true,
      data: {
        menuItems: result.rows
      }
    });
  } catch (error) {
    logger.error('Get menu items error:', error);
    next(error);
  }
};

// Get menu item by ID
const getMenuItemById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await query(
      `SELECT id, restaurant_id, name, description, price, category,
              dietary_info, image_url, is_available, created_at, updated_at
       FROM menu_items WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Menu item not found'
      });
    }

    res.json({
      success: true,
      data: {
        menuItem: result.rows[0]
      }
    });
  } catch (error) {
    logger.error('Get menu item by ID error:', error);
    next(error);
  }
};

// Create menu item (admin only)
const createMenuItem = async (req, res, next) => {
  try {
    const {
      restaurant_id,
      name,
      description,
      price,
      category,
      dietary_info,
      image_url,
      is_available = true
    } = req.body;

    const result = await query(
      `INSERT INTO menu_items (restaurant_id, name, description, price, category,
                               dietary_info, image_url, is_available, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
       RETURNING id, restaurant_id, name, description, price, category,
                 dietary_info, image_url, is_available, created_at, updated_at`,
      [restaurant_id, name, description, price, category, dietary_info, image_url, is_available]
    );

    const menuItem = result.rows[0];

    logger.info('Menu item created', { menuItemId: menuItem.id, name });

    res.status(201).json({
      success: true,
      data: {
        menuItem
      }
    });
  } catch (error) {
    logger.error('Create menu item error:', error);
    next(error);
  }
};

module.exports = {
  getMenuItems,
  getMenuItemById,
  createMenuItem
};