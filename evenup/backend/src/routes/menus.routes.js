const express = require('express');
const { authMiddleware, optionalAuth } = require('../middleware/auth.middleware');
const { validate, schemas } = require('../middleware/validation.middleware');
const {
  getMenuItems,
  getMenuItemById,
  createMenuItem
} = require('../controllers/menus.controller');

const router = express.Router();

/**
 * @swagger
 * /api/v1/menus/restaurant/{restaurantId}:
 *   get:
 *     summary: Get menu items for a restaurant
 *     tags: [Menu]
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of menu items
 */
router.get('/restaurant/:restaurantId', optionalAuth, getMenuItems);

/**
 * @swagger
 * /api/v1/menus/{id}:
 *   get:
 *     summary: Get menu item by ID
 *     tags: [Menu]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Menu item details
 */
router.get('/:id', validate(schemas.id, 'params'), optionalAuth, getMenuItemById);

/**
 * @swagger
 * /api/v1/menus:
 *   post:
 *     summary: Create new menu item (admin only)
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MenuItem'
 *     responses:
 *       201:
 *         description: Menu item created successfully
 */
router.post('/', authMiddleware, validate(schemas.menuItem), createMenuItem);

module.exports = router;