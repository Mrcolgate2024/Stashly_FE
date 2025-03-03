
import axios from "axios";
import { ChatApiRequest, ChatApiResponse } from "@/types/chat";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
});

export const sendMessage = async (request: ChatApiRequest): Promise<ChatApiResponse> => {
  try {
    console.log('Sending message:', request);
    const response = await api.post<ChatApiResponse>("/chat", request);
    console.log('Received response:', response.data);
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
