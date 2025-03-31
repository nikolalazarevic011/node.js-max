const { body } = require('express-validator');

const validateTask = [
  body('title')
    .exists({ checkFalsy: true })
    .withMessage('Title is required'),

  body('content')
    .exists({ checkFalsy: true })
    .withMessage('Content is required'),

  body('creator')
    .exists({ checkFalsy: true })
    .withMessage('Creator is required'),

  body('priority')
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be low, medium, or high'),

  body('status')
    .isIn(['pending', 'completed'])
    .withMessage('Status must be pending or completed'),
];

module.exports = validateTask;
