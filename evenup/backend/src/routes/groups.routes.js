const express = require('express');
const { authMiddleware } = require('../middleware/auth.middleware');
const { validate, schemas } = require('../middleware/validation.middleware');
const {
  createGroup,
  joinGroup,
  getGroupDetails,
  getUserGroups
} = require('../controllers/groups.controller');

const router = express.Router();

/**
 * @swagger
 * /api/v1/groups:
 *   post:
 *     summary: Create new group
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Group'
 *     responses:
 *       201:
 *         description: Group created successfully
 */
router.post('/', authMiddleware, validate(schemas.group), createGroup);

/**
 * @swagger
 * /api/v1/groups/join:
 *   post:
 *     summary: Join group with code
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               groupCode:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully joined group
 */
router.post('/join', authMiddleware, joinGroup);

/**
 * @swagger
 * /api/v1/groups/{id}:
 *   get:
 *     summary: Get group details
 *     tags: [Groups]
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
 *         description: Group details
 */
router.get('/:id', authMiddleware, validate(schemas.id, 'params'), getGroupDetails);

/**
 * @swagger
 * /api/v1/groups:
 *   get:
 *     summary: Get user's groups
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user groups
 */
router.get('/', authMiddleware, getUserGroups);

module.exports = router;