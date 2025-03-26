import React from "react";
import { cn } from "@/lib/utils";
import { Message } from "@/types/chat";
import { format } from "date-fns";
import { User, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";

interface ChatMessageProps {
  message: Message;
  onQuestionClick?: (question: string) => void;
  isThinking?: boolean;
}

export function ChatMessage({ message, onQuestionClick, isThinking = false }: ChatMessageProps) {
  const isUser = message.sender === "user";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className={`flex flex-col mb-3 ${!isUser ? "items-start" : "items-end"}`}>
      <div className={`flex items-start gap-2 ${!isUser ? "flex-row" : "flex-row-reverse"}`}>
        <div className="flex-shrink-0 mt-1">
          {!isUser ? (
            <img 
              src="/images/Ashley.webp" 
              alt="AI Assistant" 
              className="w-6 h-6 rounded-full"
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center">
              <User className="w-4 h-4 text-[#1e2a38]" />
            </div>
          )}
        </div>
        <div className={`max-w-[85%] rounded-lg p-2 ${
          !isUser 
            ? "bg-[#1e2a38] text-white" 
            : "bg-white/80 backdrop-blur-sm shadow-md relative"
        }`}>
          <div className="prose prose-xs max-w-none dark:prose-invert prose-ol:list-decimal prose-li:my-0 prose-p:my-0">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={{
                ol: ({ node, ...props }) => (
                  <ol className="list-decimal pl-4 my-0 text-[13px]" {...props} />
                ),
                li: ({ node, ...props }) => (
                  <li className="my-0 text-[13px]" {...props} />
                ),
                p: ({ node, ...props }) => (
                  <p className="my-0 text-[13px]" {...props} />
                ),
                strong: ({ node, ...props }) => (
                  <strong className="font-bold" {...props} />
                )
              }}
            >
              {message.content}
            </ReactMarkdown>
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
            <div className="metrics-container mt-1">
              <p className="text-[13px] font-semibold mb-1">Performance Metrics:</p>
              <div className="metrics-grid">
                {Object.entries(message.metrics).map(([key, value]) => (
                  <div key={key} className="metric-item">
                    <div className="text-[13px] metric-label">{key}</div>
                    <div className={cn(
                      "text-[13px] metric-value",
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

          {!isUser && message.suggestedQuestions && message.suggestedQuestions.length > 0 && (
            <div className="suggested-questions mt-1">
              <p className="text-[13px] font-semibold text-muted-foreground mb-1">Suggested questions:</p>
              <div className="questions-container">
                {message.suggestedQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => onQuestionClick?.(question)}
                    className="bg-muted hover:bg-accent text-foreground text-[13px] rounded-full px-2 py-1 transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          <div className="mt-1 flex items-center justify-between text-[11px] opacity-50">
            <span>{format(message.timestamp, "HH:mm")}</span>
            {isUser && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCopy}
                className="h-3 w-3 opacity-50 hover:opacity-100 ml-2 p-0.5"
              >
                <Copy className="h-1.5 w-1.5" />
              </Button>
            )}
          </div>
        </div>
      </div>
      {isThinking && !isUser && (
        <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Thinking...</span>
        </div>
      )}
    </div>
  );
}
