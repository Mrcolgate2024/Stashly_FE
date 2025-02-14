
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000",
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
  const response = await api.post<ChatResponse>("/chat", request);
  return response.data;
};
