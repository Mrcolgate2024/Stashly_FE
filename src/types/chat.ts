export interface Message {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
  imageData?: string;
  metrics?: Record<string, number | string>;
  suggestedQuestions?: string[];
  tableHtml?: string;
  vegaLiteSpec?: any; // Vega-Lite specification for charts
}

// Simplified message type for API requests
export interface MessageForApi {
  content: string;
  sender: "user" | "bot";
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
  metrics?: Record<string, number | string>;
  suggested_questions?: string[];
  has_table: boolean;
  table_html?: string;
  vega_lite_spec?: any; // Vega-Lite specification for charts
  tools?: Array<{
    name?: string;
    description?: string;
    toString: () => string;
  }>;
}

export interface ChatApiRequest {
  message: string;
  thread_id: string;
  user_name?: string;
  message_history?: MessageForApi[];
}
