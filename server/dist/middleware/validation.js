"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateParams = exports.validateQuery = exports.validate = void 0;
const response_1 = require("@/utils/response");
const validate = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true,
        });
        if (error) {
            const errors = error.details.map(detail => detail.message);
            res.status(400).json(response_1.ApiResponse.error('Validation failed', errors));
            return;
        }
        req.body = value;
        next();
    };
};
exports.validate = validate;
const validateQuery = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.query, {
            abortEarly: false,
            stripUnknown: true,
        });
        if (error) {
            const errors = error.details.map(detail => detail.message);
            res.status(400).json(response_1.ApiResponse.error('Query validation failed', errors));
            return;
        }
        req.query = value;
        next();
    };
};
exports.validateQuery = validateQuery;
const validateParams = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.params, {
            abortEarly: false,
            stripUnknown: true,
        });
        if (error) {
            const errors = error.details.map(detail => detail.message);
            res.status(400).json(response_1.ApiResponse.error('Parameter validation failed', errors));
            return;
        }
        req.params = value;
        next();
    };
};
exports.validateParams = validateParams;
