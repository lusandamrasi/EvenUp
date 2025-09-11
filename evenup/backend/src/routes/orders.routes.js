const express = require('express');
const { authMiddleware } = require('../middleware/auth.middleware');
const { validate, schemas } = require('../middleware/validation.middleware');
const {
  createOrder,
  getUserOrders,
  updateOrder
} = require('../controllers/orders.controller');

const router = express.Router();

/**
 * @swagger
 * /api/v1/orders:
 *   post:
 *     summary: Create new order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       201:
 *         description: Order created successfully
 */
router.post('/', authMiddleware, validate(schemas.order), createOrder);

/**
 * @swagger
 * /api/v1/orders:
 *   get:
 *     summary: Get user's orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user orders
 */
router.get('/', authMiddleware, getUserOrders);

/**
 * @swagger
 * /api/v1/orders/{id}:
 *   put:
 *     summary: Update order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Order updated successfully
 */
router.put('/:id', authMiddleware, validate(schemas.id, 'params'), updateOrder);

module.exports = router;