import { VisualizationSpec } from 'vega-embed';

export interface Message {
  id: string;
  content: string;
  sender: "user" | "bot" | "assistant";
  timestamp: Date;
  imageData?: string;
  metrics?: Record<string, number | string>;
  suggestedQuestions?: string[];
  tableHtml?: string;
  vegaLiteSpec?: any; // Vega-Lite specification for charts
  chartData?: {
    description: string;
    vega_lite_spec: VisualizationSpec;
  };
}

// Simplified message type for API requests
export interface MessageForApi {
  content: string;
  sender: "user" | "bot" | "assistant";
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
  chart_data?: {
    description: string;
    vega_lite_spec: VisualizationSpec;
  };
}

export interface ChatApiRequest {
  message: string;
  thread_id: string;
  user_name?: string;
  message_history?: MessageForApi[];
}
