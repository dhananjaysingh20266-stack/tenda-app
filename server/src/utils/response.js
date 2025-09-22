class ApiResponse {
  static success(data, message, showToast = true) {
    return {
      success: true,
      data,
      message,
      showToast,
    }
  }

  static error(message, errors, showToast = true) {
    return {
      success: false,
      message,
      errors,
      showToast,
    }
  }

  static paginated(data, page, limit, total, message, showToast = true) {
    return {
      success: true,
      data,
      message,
      showToast,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  }
}

module.exports = { ApiResponse }