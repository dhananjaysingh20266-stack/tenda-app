"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResponse = void 0;
class ApiResponse {
    static success(data, message) {
        return {
            success: true,
            data,
            message,
        };
    }
    static error(message, errors) {
        return {
            success: false,
            message,
            errors,
        };
    }
    static paginated(data, page, limit, total, message) {
        return {
            success: true,
            data,
            message,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
}
exports.ApiResponse = ApiResponse;
