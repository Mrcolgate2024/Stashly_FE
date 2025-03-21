import axios from "axios";
import { ChatApiRequest, ChatApiResponse } from "@/types/chat";

// Get the API URL from environment variables, with a clear fallback
const BASE_URL = import.meta.env.VITE_API_URL || "https://stashlybackendapp.azurewebsites.net";

// Log the API URL being used (only in development)
if (import.meta.env.DEV) {
  console.log('API is configured to use:', BASE_URL);
}

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
  },
  withCredentials: false
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    if (import.meta.env.DEV) {
      console.log('Making request to:', config.baseURL + config.url);
    }
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
    if (import.meta.env.DEV) {
      console.log('Received successful response from:', response.config.url);
    }
    return response;
  },
  (error) => {
    if (error.response) {
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
          console.error("API endpoint not found - Check if the URL is correct");
          break;
        case 500:
          console.error("Server error - Please try again later");
          break;
        default:
          console.error(`Error ${error.response.status}: ${error.response.statusText}`);
      }
    } else if (error.request) {
      console.error('Network error - Check your connection and the API URL');
    } else {
      console.error('Error setting up the request:', error.message);
    }
    return Promise.reject(error);
  }
);

export const sendMessage = async (request: ChatApiRequest): Promise<ChatApiResponse> => {
  try {
    if (import.meta.env.DEV) {
      console.log('Sending message to Azure backend:', request);
    }
    const response = await api.post<ChatApiResponse>("/chat", {
      message: request.message,
      thread_id: request.thread_id,
      user_name: request.user_name,
      message_history: request.message_history,
    });
    if (import.meta.env.DEV) {
      console.log('Received response from Azure backend:', response.data);
    }
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

export default api;
