
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
          <div className="mt-2">
            <img 
              src={`data:image/png;base64,${message.imageData}`} 
              alt="Generated content"
              className="max-w-full rounded-md"
            />
          </div>
        )}

        {message.tableHtml && (
          <div 
            className="mt-2 overflow-x-auto rounded-md bg-background p-2"
            dangerouslySetInnerHTML={{ 
              __html: `<style>
                table { border-collapse: collapse; width: 100%; font-size: 0.875rem; }
                th, td { border: 1px solid #ddd; padding: 0.5rem; text-align: left; }
                th { background-color: #f2f2f2; }
                tr:nth-child(even) { background-color: #f9f9f9; }
              </style>${message.tableHtml}` 
            }}
          />
        )}

        {message.metrics && (
          <div className="mt-2 space-y-1 rounded-md bg-background p-2 text-xs text-foreground">
            <p className="font-semibold">Performance Metrics:</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              {Object.entries(message.metrics).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span>{key}:</span>
                  <span className="font-medium">
                    {typeof value === 'number' ? `${value}%` : value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {isBot && message.suggestedQuestions && message.suggestedQuestions.length > 0 && (
          <div className="mt-2 space-y-1">
            <p className="text-xs font-semibold">Suggested questions:</p>
            <div className="flex flex-col gap-1">
              {message.suggestedQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => onQuestionClick?.(question)}
                  className="rounded bg-background px-2 py-1 text-left text-xs text-foreground hover:bg-accent"
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
