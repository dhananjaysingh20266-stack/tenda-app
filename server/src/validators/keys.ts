import Joi from 'joi'

export const generateKeysSchema = Joi.object({
  gameId: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.base': 'Game ID must be a number',
      'number.integer': 'Game ID must be an integer',
      'number.positive': 'Game ID must be positive',
      'any.required': 'Game ID is required',
    }),
  maxDevices: Joi.number()
    .integer()
    .min(1)
    .max(10)
    .required()
    .messages({
      'number.base': 'Max devices must be a number',
      'number.integer': 'Max devices must be an integer',
      'number.min': 'Max devices must be at least 1',
      'number.max': 'Max devices cannot exceed 10',
      'any.required': 'Max devices is required',
    }),
  durationHours: Joi.number()
    .integer()
    .valid(1, 3, 5, 12, 24, 168) // 1h, 3h, 5h, 12h, 24h, 1week
    .required()
    .messages({
      'number.base': 'Duration must be a number',
      'any.only': 'Duration must be 1, 3, 5, 12, 24, or 168 hours',
      'any.required': 'Duration is required',
    }),
  bulkQuantity: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(1)
    .messages({
      'number.base': 'Bulk quantity must be a number',
      'number.integer': 'Bulk quantity must be an integer',
      'number.min': 'Bulk quantity must be at least 1',
      'number.max': 'Bulk quantity cannot exceed 100',
    }),
  customKey: Joi.string()
    .min(3)
    .max(50)
    .pattern(/^[A-Za-z0-9_-]+$/)
    .optional()
    .messages({
      'string.min': 'Custom key must be at least 3 characters',
      'string.max': 'Custom key cannot exceed 50 characters',
      'string.pattern.base': 'Custom key can only contain letters, numbers, underscores, and hyphens',
    }),
  description: Joi.string()
    .max(255)
    .optional()
    .messages({
      'string.max': 'Description cannot exceed 255 characters',
    }),
})