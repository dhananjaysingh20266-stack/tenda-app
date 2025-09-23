import axios from "axios";
import type { AxiosInstance, AxiosRequestConfig } from "axios";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api";

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        const { token } = useAuthStore.getState();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        // Check if the response has showToast flag and handle success messages
        const responseData = response.data;
        if (responseData?.showToast !== false && responseData?.success && responseData?.message) {
          // Only show success toasts for non-GET requests to avoid noise
          const isGetRequest = response.config.method?.toLowerCase() === "get";
          if (!isGetRequest) {
            toast.success(responseData.message);
          }
        }
        return response;
      },
      (error) => {
        const { status } = error.response || {};
        const responseData = error.response?.data;

        if (status === 401) {
          useAuthStore.getState().logout();
          // window.location.href = '/login'
          toast.error("Session expired. Please login again.");
        } else if (status === 403) {
          toast.error("Access denied");
        } else if (status >= 500) {
          toast.error("Server error. Please try again later.");
        } else if (responseData?.showToast !== false && responseData?.message) {
          // Show error message from API response if showToast is not explicitly false
          toast.error(responseData.message);
        } else if (responseData?.showToast !== false && responseData?.errors?.length > 0) {
          // Show validation errors if showToast is not explicitly false
          responseData.errors.forEach((errorMsg: string) => toast.error(errorMsg));
        }

        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, config?: AxiosRequestConfig) {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig) {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig) {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig) {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }
}

export const apiClient = new ApiClient();
