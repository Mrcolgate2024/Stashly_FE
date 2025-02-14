
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
});

interface ChatRequest {
  message: string;
  thread_id?: string;
}

interface ChatResponse {
  response: string;
  thread_id: string;
}

export const sendMessage = async (request: ChatRequest): Promise<ChatResponse> => {
  try {
    console.log('Sending message:', request);
    const response = await api.post<ChatResponse>("/chat", request);
    console.log('Received response:', response.data);
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
