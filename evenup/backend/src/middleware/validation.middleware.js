const Joi = require('joi');
const logger = require('../utils/logger');

const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error } = schema.validate(req[property]);
    
    if (error) {
      const errorMessage = error.details.map(detail => detail.message).join(', ');
      logger.warn('Validation error:', { error: errorMessage, body: req.body });
      
      return res.status(400).json({
        success: false,
        error: errorMessage
      });
    }
    
    next();
  };
};

// Common validation schemas
const schemas = {
  // User registration
  register: Joi.object({
    firstName: Joi.string().min(2).max(50).required(),
    lastName: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
  }),

  // User login
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),

  // Restaurant creation
  restaurant: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    address: Joi.string().min(5).max(200).required(),
    phone: Joi.string().pattern(/^[\+]?[1-9][\d]{0,15}$/),
    cuisine_type: Joi.string().max(50),
    description: Joi.string().max(500),
    latitude: Joi.number().min(-90).max(90),
    longitude: Joi.number().min(-180).max(180)
  }),

  // Menu item creation
  menuItem: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    description: Joi.string().max(300),
    price: Joi.number().positive().precision(2).required(),
    category: Joi.string().max(50),
    dietary_info: Joi.array().items(Joi.string().max(20)),
    is_available: Joi.boolean().default(true)
  }),

  // Group creation
  group: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    restaurant_id: Joi.number().integer().positive().required(),
    table_number: Joi.string().max(20)
  }),

  // Order creation
  order: Joi.object({
    group_id: Joi.number().integer().positive().required(),
    menu_item_id: Joi.number().integer().positive().required(),
    quantity: Joi.number().integer().positive().required(),
    special_instructions: Joi.string().max(200)
  }),

  // ID parameter validation
  id: Joi.object({
    id: Joi.number().integer().positive().required()
  })
};

module.exports = {
  validate,
  schemas
};