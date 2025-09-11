const { query } = require('../config/database');
const logger = require('../utils/logger');

// Create new group
const createGroup = async (req, res, next) => {
  try {
    const { name, restaurant_id, table_number } = req.body;
    const creator_id = req.user.id;

    const result = await query(
      `INSERT INTO groups (name, restaurant_id, creator_id, table_number, created_at, updated_at)
       VALUES ($1, $2, $3, $4, NOW(), NOW())
       RETURNING id, name, restaurant_id, creator_id, group_code, table_number,
                 status, total_amount, tip_amount, tax_amount, created_at, updated_at`,
      [name, restaurant_id, creator_id, table_number]
    );

    const group = result.rows[0];

    // Add creator to group members
    await query(
      'INSERT INTO group_members (group_id, user_id) VALUES ($1, $2)',
      [group.id, creator_id]
    );

    logger.info('Group created', { groupId: group.id, creatorId: creator_id });

    res.status(201).json({
      success: true,
      data: {
        group
      }
    });
  } catch (error) {
    logger.error('Create group error:', error);
    next(error);
  }
};

// Join group with code
const joinGroup = async (req, res, next) => {
  try {
    const { group_code } = req.body;
    const user_id = req.user.id;

    // Find group by code
    const groupResult = await query(
      'SELECT * FROM groups WHERE group_code = $1 AND status = $2',
      [group_code, 'active']
    );

    if (groupResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Group not found or inactive'
      });
    }

    const group = groupResult.rows[0];

    // Check if user is already a member
    const memberCheck = await query(
      'SELECT id FROM group_members WHERE group_id = $1 AND user_id = $2',
      [group.id, user_id]
    );

    if (memberCheck.rows.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Already a member of this group'
      });
    }

    // Add user to group
    await query(
      'INSERT INTO group_members (group_id, user_id) VALUES ($1, $2)',
      [group.id, user_id]
    );

    logger.info('User joined group', { groupId: group.id, userId: user_id });

    res.json({
      success: true,
      data: {
        group,
        message: 'Successfully joined group'
      }
    });
  } catch (error) {
    logger.error('Join group error:', error);
    next(error);
  }
};

// Get group details
const getGroupDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    // Check if user is a member of the group
    const memberCheck = await query(
      'SELECT id FROM group_members WHERE group_id = $1 AND user_id = $2',
      [id, user_id]
    );

    if (memberCheck.rows.length === 0) {
      return res.status(403).json({
        success: false,
        error: 'Access denied to this group'
      });
    }

    // Get group details with restaurant info
    const groupResult = await query(
      `SELECT g.*, r.name as restaurant_name, r.address as restaurant_address
       FROM groups g
       JOIN restaurants r ON g.restaurant_id = r.id
       WHERE g.id = $1`,
      [id]
    );

    if (groupResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Group not found'
      });
    }

    const group = groupResult.rows[0];

    // Get group members
    const membersResult = await query(
      `SELECT gm.*, u.first_name, u.last_name, u.email
       FROM group_members gm
       JOIN users u ON gm.user_id = u.id
       WHERE gm.group_id = $1`,
      [id]
    );

    // Get group orders
    const ordersResult = await query(
      `SELECT o.*, mi.name as menu_item_name, mi.price as menu_item_price,
              u.first_name, u.last_name
       FROM orders o
       JOIN menu_items mi ON o.menu_item_id = mi.id
       JOIN users u ON o.user_id = u.id
       WHERE o.group_id = $1
       ORDER BY o.created_at DESC`,
      [id]
    );

    res.json({
      success: true,
      data: {
        group: {
          ...group,
          members: membersResult.rows,
          orders: ordersResult.rows
        }
      }
    });
  } catch (error) {
    logger.error('Get group details error:', error);
    next(error);
  }
};

// Get user's groups
const getUserGroups = async (req, res, next) => {
  try {
    const user_id = req.user.id;

    const result = await query(
      `SELECT g.*, r.name as restaurant_name, r.address as restaurant_address
       FROM groups g
       JOIN restaurants r ON g.restaurant_id = r.id
       JOIN group_members gm ON g.id = gm.group_id
       WHERE gm.user_id = $1
       ORDER BY g.created_at DESC`,
      [user_id]
    );

    res.json({
      success: true,
      data: {
        groups: result.rows
      }
    });
  } catch (error) {
    logger.error('Get user groups error:', error);
    next(error);
  }
};

module.exports = {
  createGroup,
  joinGroup,
  getGroupDetails,
  getUserGroups
};