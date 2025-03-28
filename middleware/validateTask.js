const { body } = require('express-validator');

const validateTask = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('content').trim().notEmpty().withMessage('Content is required'),
  body('creator').trim().notEmpty().withMessage('Creator is required'),
  body('priority').isIn(['low', 'medium', 'high']).withMessage('Priority must be low, medium, or high'),
  body('status').isIn(['pending', 'completed']).withMessage('Status must be pending or completed'),
];

module.exports = validateTask;
