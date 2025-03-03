
export interface Message {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
  imageData?: string;
  metrics?: Record<string, any>;
  suggestedQuestions?: string[];
  tableHtml?: string;
}

export interface ChatState {
  messages: Message[];
  threadId: string;
  isLoading: boolean;
}

export interface ChatApiResponse {
  response: string;
  thread_id: string;
  has_image: boolean;
  image_data?: string;
  metrics?: Record<string, any>;
  suggested_questions?: string[];
  has_table: boolean;
  table_html?: string;
}

export interface ChatApiRequest {
  message: string;
  thread_id?: string;
  user_name?: string;
}
