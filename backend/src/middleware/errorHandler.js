const { AuditLog } = require('../models');

const errorHandler = (error, req, res, next) => {
  console.error('Error occurred:', error);

  // Log security-related errors
  if (req.user && (error.status === 403 || error.status === 401)) {
    AuditLog.create({
      organization_id: req.organizationId,
      user_id: req.userId,
      action: 'security_error',
      resource_type: 'system',
      severity: 'high',
      ip_address: req.ip,
      user_agent: req.get('User-Agent'),
      metadata: {
        error: error.message,
        path: req.path,
        method: req.method,
      },
    }).catch(console.error);
  }

  // Sequelize validation errors
  if (error.name === 'SequelizeValidationError') {
    const validationErrors = error.errors.map(err => ({
      field: err.path,
      message: err.message,
      value: err.value,
    }));
    
    return res.status(400).json({
      error: 'Validation failed',
      details: validationErrors,
    });
  }

  // Sequelize unique constraint errors
  if (error.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({
      error: 'Resource already exists',
      field: error.errors[0]?.path || 'unknown',
    });
  }

  // Sequelize foreign key constraint errors
  if (error.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(400).json({
      error: 'Invalid reference to related resource',
    });
  }

  // JWT errors
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Invalid authentication token',
    });
  }

  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'Authentication token expired',
    });
  }

  // Joi validation errors
  if (error.isJoi) {
    const validationErrors = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message,
      value: detail.context?.value,
    }));
    
    return res.status(400).json({
      error: 'Validation failed',
      details: validationErrors,
    });
  }

  // Custom application errors
  if (error.status || error.statusCode) {
    return res.status(error.status || error.statusCode).json({
      error: error.message || 'An error occurred',
    });
  }

  // Generic server error
  res.status(500).json({
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : error.message,
  });
};

module.exports = errorHandler;