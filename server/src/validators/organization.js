const Joi = require('joi')

const CreateOrganizationSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  description: Joi.string().max(500).optional(),
  website: Joi.string().uri().optional(),
  industry: Joi.string().max(50).optional(),
  companySize: Joi.string().valid('1-10', '11-50', '51-200', '201-500', '500+').optional(),
  billingEmail: Joi.string().email().optional()
})

const UpdateUserSchema = Joi.object({
  firstName: Joi.string().min(1).max(50).optional(),
  lastName: Joi.string().min(1).max(50).optional(),
  role: Joi.string().valid('admin', 'member', 'viewer').optional(),
  status: Joi.string().valid('active', 'inactive', 'pending').optional()
})

module.exports = {
  CreateOrganizationSchema,
  UpdateUserSchema
}