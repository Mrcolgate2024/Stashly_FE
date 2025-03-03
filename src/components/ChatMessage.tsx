
import { cn } from "@/lib/utils";
import { Message } from "@/types/chat";
import { format } from "date-fns";

interface ChatMessageProps {
  message: Message;
  onQuestionClick?: (question: string) => void;
}

export const ChatMessage = ({ message, onQuestionClick }: ChatMessageProps) => {
  const isBot = message.sender === "bot";

  return (
    <div
      className={cn(
        "flex w-full",
        isBot ? "justify-start" : "justify-end"
      )}
    >
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-2 text-sm",
          isBot
            ? "bg-secondary text-secondary-foreground"
            : "bg-primary text-primary-foreground"
        )}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
        
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
            <p className="font-semibold mb-2">Performance Metrics:</p>
            <div className="metrics-grid">
              {Object.entries(message.metrics).map(([key, value]) => (
                <div key={key} className="metric-item">
                  <div className="metric-label">{key}</div>
                  <div className={cn(
                    "metric-value",
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
            <p className="text-xs font-semibold text-muted-foreground mb-2">Suggested questions:</p>
            <div className="questions-container">
              {message.suggestedQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => onQuestionClick?.(question)}
                  className="bg-muted hover:bg-accent text-foreground text-xs rounded-full px-3 py-1.5 transition-colors"
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
    </div>
  );
};
