import axios from "axios";
import { ChatApiRequest, ChatApiResponse } from "@/types/chat";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

console.log('API is configured to use:', BASE_URL); // Log the API URL being used

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
  },
  withCredentials: false // Set to true if you need to send cookies
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    console.log('Making request to:', config.baseURL + config.url);
    // You can add any auth tokens here if needed
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('Received successful response from:', response.config.url);
    return response;
  },
  (error) => {
    if (error.response) {
      // Handle specific error cases
      console.error('Response error details:', {
        url: error.config?.url,
        status: error.response.status,
        data: error.response.data
      });
      switch (error.response.status) {
        case 401:
          console.error("Unauthorized access - Check if authentication is required");
          break;
        case 403:
          console.error("Forbidden access - Check API permissions");
          break;
        case 404:
          console.error("Resource not found - Verify the endpoint URL");
          break;
        default:
          console.error("An error occurred:", error.response.data);
      }
    } else if (error.request) {
      console.error("Network error - No response received:", {
        url: error.config?.url,
        method: error.config?.method,
        error: error.request
      });
    } else {
      // Handle other errors
      console.error("Error:", error.message);
    }
    return Promise.reject(error);
  }
);

export const sendMessage = async (request: ChatApiRequest): Promise<ChatApiResponse> => {
  try {
    console.log('Sending message to Azure backend:', {
      url: BASE_URL + '/chat',
      request: request
    });
    const response = await api.post<ChatApiResponse>("/chat", request);
    console.log('Received response from Azure:', {
      status: response.status,
      data: response.data
    });
    return response.data;
  } catch (error) {
    console.error('Failed to send message to Azure:', error);
    throw error;
  }
};

export default api;
