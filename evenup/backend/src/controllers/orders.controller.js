const { query } = require('../config/database');
const logger = require('../utils/logger');

// Create new order
const createOrder = async (req, res, next) => {
  try {
    const { group_id, menu_item_id, quantity, special_instructions } = req.body;
    const user_id = req.user.id;

    // Get menu item price
    const menuItemResult = await query(
      'SELECT price FROM menu_items WHERE id = $1',
      [menu_item_id]
    );

    if (menuItemResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Menu item not found'
      });
    }

    const unit_price = menuItemResult.rows[0].price;
    const total_price = unit_price * quantity;

    const result = await query(
      `INSERT INTO orders (group_id, user_id, menu_item_id, quantity, unit_price, 
                          total_price, special_instructions, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
       RETURNING id, group_id, user_id, menu_item_id, quantity, unit_price,
                 total_price, special_instructions, status, created_at, updated_at`,
      [group_id, user_id, menu_item_id, quantity, unit_price, total_price, special_instructions]
    );

    const order = result.rows[0];

    logger.info('Order created', { orderId: order.id, userId: user_id });

    res.status(201).json({
      success: true,
      data: {
        order
      }
    });
  } catch (error) {
    logger.error('Create order error:', error);
    next(error);
  }
};

// Get user's orders
const getUserOrders = async (req, res, next) => {
  try {
    const user_id = req.user.id;

    const result = await query(
      `SELECT o.*, mi.name as menu_item_name, mi.price as menu_item_price,
              r.name as restaurant_name, g.name as group_name
       FROM orders o
       JOIN menu_items mi ON o.menu_item_id = mi.id
       JOIN groups g ON o.group_id = g.id
       JOIN restaurants r ON g.restaurant_id = r.id
       WHERE o.user_id = $1
       ORDER BY o.created_at DESC`,
      [user_id]
    );

    res.json({
      success: true,
      data: {
        orders: result.rows
      }
    });
  } catch (error) {
    logger.error('Get user orders error:', error);
    next(error);
  }
};

// Update order
const updateOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { quantity, special_instructions } = req.body;
    const user_id = req.user.id;

    // Check if order belongs to user
    const orderCheck = await query(
      'SELECT * FROM orders WHERE id = $1 AND user_id = $2',
      [id, user_id]
    );

    if (orderCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Order not found or access denied'
      });
    }

    const order = orderCheck.rows[0];

    // Can only update pending orders
    if (order.status !== 'pending') {
      return res.status(400).json({
        success: false,
        error: 'Can only update pending orders'
      });
    }

    // Calculate new total if quantity changed
    let total_price = order.total_price;
    if (quantity && quantity !== order.quantity) {
      total_price = order.unit_price * quantity;
    }

    const result = await query(
      `UPDATE orders 
       SET quantity = $1, total_price = $2, special_instructions = $3, updated_at = NOW()
       WHERE id = $4
       RETURNING id, group_id, user_id, menu_item_id, quantity, unit_price,
                 total_price, special_instructions, status, created_at, updated_at`,
      [quantity || order.quantity, total_price, special_instructions || order.special_instructions, id]
    );

    logger.info('Order updated', { orderId: id, userId: user_id });

    res.json({
      success: true,
      data: {
        order: result.rows[0]
      }
    });
  } catch (error) {
    logger.error('Update order error:', error);
    next(error);
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  updateOrder
};