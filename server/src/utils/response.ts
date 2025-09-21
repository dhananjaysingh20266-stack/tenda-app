export interface ApiResponseData<T = any> {
  success: boolean
  data?: T
  message?: string
  errors?: string[]
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export class ApiResponse {
  static success<T>(data?: T, message?: string): ApiResponseData<T> {
    return {
      success: true,
      data,
      message,
    }
  }

  static error(message: string, errors?: string[]): ApiResponseData {
    return {
      success: false,
      message,
      errors,
    }
  }

  static paginated<T>(
    data: T[],
    page: number,
    limit: number,
    total: number,
    message?: string
  ): ApiResponseData<T[]> {
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
    }
  }
}