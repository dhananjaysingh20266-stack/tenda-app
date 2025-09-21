import { Request, Response, NextFunction } from 'express'
import Joi from 'joi'
import { ApiResponse } from '@/utils/response'

export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    })

    if (error) {
      const errors = error.details.map(detail => detail.message)
      res.status(400).json(ApiResponse.error('Validation failed', errors))
      return
    }

    req.body = value
    next()
  }
}

export const validateQuery = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true,
    })

    if (error) {
      const errors = error.details.map(detail => detail.message)
      res.status(400).json(ApiResponse.error('Query validation failed', errors))
      return
    }

    req.query = value
    next()
  }
}

export const validateParams = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.params, {
      abortEarly: false,
      stripUnknown: true,
    })

    if (error) {
      const errors = error.details.map(detail => detail.message)
      res.status(400).json(ApiResponse.error('Parameter validation failed', errors))
      return
    }

    req.params = value
    next()
  }
}