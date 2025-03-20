import React from "react";
import { cn } from "@/lib/utils";
import { Message } from "@/types/chat";
import { format } from "date-fns";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { Button } from "@/components/ui/button";
import { Copy, Loader2 } from "lucide-react";

interface ChatMessageProps {
  message: Message;
  onQuestionClick?: (question: string) => void;
  isThinking?: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  onQuestionClick,
  isThinking = false,
}) => {
  const isBot = message.sender === "bot";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className={`flex flex-col mb-4 ${isBot ? "items-start" : "items-end"}`}>
      <div className={`max-w-[85%] rounded-lg p-4 ${
        isBot 
          ? "bg-white/80 backdrop-blur-sm shadow-md relative" 
          : "bg-[#1e2a38] text-white"
      }`}>
        {isBot && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCopy}
            className="absolute top-2 right-2 h-6 w-6 opacity-50 hover:opacity-100"
          >
            <Copy className="h-3 w-3" />
          </Button>
        )}
        <div className="prose prose-[8px] max-w-none">
          <MarkdownRenderer content={message.content} />
        </div>
        
        {message.imageData && (
          <div className="message-image">
            <img 
              src={`data:image/png;base64,${message.imageData}`} 
              alt="Generated content"
              className="financial-chart"
            />
          </div>
        )}

        {message.tableHtml && (
          <div 
            className="table-container"
            dangerouslySetInnerHTML={{ 
              __html: message.tableHtml
            }}
          />
        )}

        {message.metrics && (
          <div className="metrics-container">
            <p className="text-[8px] font-semibold mb-2">Performance Metrics:</p>
            <div className="metrics-grid">
              {Object.entries(message.metrics).map(([key, value]) => (
                <div key={key} className="metric-item">
                  <div className="text-[8px] metric-label">{key}</div>
                  <div className={cn(
                    "text-[8px] metric-value",
                    typeof value === 'number' && value > 0 && "positive",
                    typeof value === 'number' && value < 0 && "negative"
                  )}>
                    {typeof value === 'number' 
                      ? `${value.toFixed(2)}${key.toLowerCase().includes('return') || key.toLowerCase().includes('cagr') ? '%' : ''}`
                      : value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {isBot && message.suggestedQuestions && message.suggestedQuestions.length > 0 && (
          <div className="suggested-questions">
            <p className="text-[8px] font-semibold text-muted-foreground mb-2">Suggested questions:</p>
            <div className="questions-container">
              {message.suggestedQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => onQuestionClick?.(question)}
                  className="bg-muted hover:bg-accent text-foreground text-[8px] rounded-full px-3 py-1.5 transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}
        
        <span className="mt-1 block text-[10px] opacity-50">
          {format(message.timestamp, "HH:mm")}
        </span>
      </div>
      {isThinking && isBot && (
        <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Thinking...</span>
        </div>
      )}
    </div>
  );
};
