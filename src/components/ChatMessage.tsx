import React, { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { Message } from "@/types/chat";
import { format } from "date-fns";
import { User, Loader2, Bot, ChevronDown, ChevronUp, Code, Image } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import ChartComponent from "./ChartComponent";
import { useToast } from "@/components/ui/use-toast";

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
  const isUser = message.sender === "user";
  const [showSpec, setShowSpec] = useState(false);
  const [chartImageUrl, setChartImageUrl] = useState<string | null>(null);
  const { toast } = useToast();
  
  const timestamp = new Date(message.timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleCopy = async (content: string = message.content) => {
    try {
      await navigator.clipboard.writeText(content);
      toast({
        title: "Copied to clipboard",
        duration: 2000,
      });
    } catch (err) {
      console.error('Failed to copy text: ', err);
      toast({
        title: "Failed to copy",
        description: "Could not copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const handleCopyChart = async () => {
    if (message.chartData?.vega_lite_spec) {
      try {
        await navigator.clipboard.writeText(JSON.stringify(message.chartData.vega_lite_spec, null, 2));
        toast({
          title: "Chart spec copied to clipboard",
          duration: 2000,
        });
      } catch (err) {
        console.error('Failed to copy chart specification: ', err);
        toast({
          title: "Failed to copy",
          description: "Could not copy chart specification to clipboard",
          variant: "destructive",
        });
      }
    }
  };

  const handleCaptureImage = (imageUrl: string) => {
    setChartImageUrl(imageUrl);
  };

  const handleCopyImage = async () => {
    if (!chartImageUrl) return;

    try {
      // For modern browsers that support clipboard API with images
      const response = await fetch(chartImageUrl);
      const blob = await response.blob();
      
      if (navigator.clipboard && navigator.clipboard.write) {
        await navigator.clipboard.write([
          new ClipboardItem({
            [blob.type]: blob
          })
        ]);
        toast({
          title: "Chart image copied to clipboard",
          duration: 2000,
        });
      } else {
        // Fallback for browsers that don't support clipboard API with images
        // Create a temporary link to download the image
        const link = document.createElement('a');
        link.href = chartImageUrl;
        link.download = 'chart.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast({
          title: "Chart image downloaded",
          description: "Your browser doesn't support copying images directly to clipboard",
          duration: 3000,
        });
      }
    } catch (err) {
      console.error('Failed to copy chart image: ', err);
      toast({
        title: "Failed to copy image",
        description: "Could not copy chart image to clipboard",
        variant: "destructive",
      });
    }
  };

  // Define a common table styling class
  const tableStyles = `
    .markdown-table {
      border-collapse: collapse;
      width: 100%;
      font-size: 13px;
      margin-top: 8px;
      margin-bottom: 8px;
      overflow-x: auto;
    }
    .markdown-table th, .markdown-table td {
      border: 1px solid rgba(229, 231, 235, 0.6);
      padding: 4px 8px;
      text-align: left;
    }
    .markdown-table th {
      background-color: rgba(229, 231, 235, 0.3);
      font-weight: 600;
    }
    .markdown-table td:not(:first-child) {
      text-align: right;
    }
  `;

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
          <style>
            {tableStyles}
          </style>
          <div className="prose prose-xs max-w-none dark:prose-invert prose-ol:list-decimal prose-li:my-0 prose-p:my-0">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={{
                ol: ({ node, ...props }) => (
                  <ol className="list-decimal pl-4 my-0 text-[13px]" {...props} />
                ),
                ul: ({ node, ...props }) => (
                  <ul className="list-disc pl-4 my-0 text-[13px]" {...props} />
                ),
                li: ({ node, ...props }) => (
                  <li className="my-0 text-[13px]" {...props} />
                ),
                p: ({ node, ...props }) => (
                  <p className="my-0 text-[13px]" {...props} />
                ),
                h1: ({ node, ...props }) => (
                  <h1 className="text-lg font-bold mb-1 mt-1" {...props} />
                ),
                h2: ({ node, ...props }) => (
                  <h2 className="text-md font-bold mb-1 mt-1" {...props} />
                ),
                h3: ({ node, ...props }) => (
                  <h3 className="text-[15px] font-bold mb-1 mt-1" {...props} />
                ),
                h4: ({ node, ...props }) => (
                  <h4 className="text-[14px] font-bold mb-1 mt-1" {...props} />
                ),
                a: ({ node, ...props }) => (
                  <a className="text-blue-500 underline" {...props} />
                ),
                code: ({ node, inline, ...props }: { node: any, inline?: boolean } & React.HTMLAttributes<HTMLElement>) => (
                  inline 
                    ? <code className="bg-gray-200 px-1 rounded text-[13px]" {...props} />
                    : <code className="block bg-gray-200 p-2 rounded text-[13px] my-1 overflow-x-auto" {...props} />
                ),
                pre: ({ node, ...props }) => (
                  <pre className="bg-gray-200 p-2 rounded text-[13px] my-1 overflow-x-auto" {...props} />
                ),
                blockquote: ({ node, ...props }) => (
                  <blockquote className="border-l-2 border-gray-400 pl-2 italic text-[13px]" {...props} />
                ),
                strong: ({ node, ...props }) => (
                  <strong className="font-bold" {...props} />
                ),
                table: ({ node, ...props }) => (
                  <div className="overflow-x-auto w-full">
                    <table className="markdown-table" {...props} />
                  </div>
                ),
                thead: ({ node, ...props }) => (
                  <thead {...props} />
                ),
                tbody: ({ node, ...props }) => (
                  <tbody {...props} />
                ),
                tr: ({ node, ...props }) => (
                  <tr {...props} />
                ),
                th: ({ node, ...props }) => (
                  <th className="text-[13px]" {...props} />
                ),
                td: ({ node, ...props }) => (
                  <td className="text-[13px]" {...props} />
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
              className="table-container mt-2 overflow-x-auto"
              dangerouslySetInnerHTML={{ 
                __html: `<style>
                  .table-container table {
                    border-collapse: collapse;
                    width: 100%;
                    font-size: 13px;
                  }
                  .table-container th, .table-container td {
                    border: 1px solid rgba(229, 231, 235, 0.6);
                    padding: 4px 8px;
                  }
                  .table-container th {
                    background-color: rgba(229, 231, 235, 0.3);
                    font-weight: 600;
                  }
                  .table-container td:not(:first-child) {
                    text-align: right;
                  }
                </style>${message.tableHtml}` 
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

          {message.chartData && (
            <div className="mt-4 w-full max-w-full overflow-x-auto">
              <div className="flex justify-between items-center mb-2">
                <div className="text-[13px] font-semibold">{message.chartData.description}</div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleCopyImage}
                    className="h-6 w-6 opacity-50 hover:opacity-100"
                    title="Copy chart as image"
                    disabled={!chartImageUrl}
                  >
                    <Image className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowSpec(!showSpec)}
                    className="h-6 w-6 opacity-50 hover:opacity-100"
                    title={showSpec ? "Hide code" : "View code"}
                  >
                    <Code className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div className="bg-white/90 p-2 rounded-lg shadow-md w-full">
                {message.chartData.vega_lite_spec && (
                  <ChartComponent 
                    spec={message.chartData.vega_lite_spec} 
                    className="w-full"
                    onCaptureImage={handleCaptureImage}
                  />
                )}
                
                {showSpec && (
                  <div className="mt-2 text-[11px] text-gray-700 bg-gray-100/90 p-2 rounded overflow-auto max-h-60">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold">Vega-Lite Specification</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleCopyChart}
                        className="h-4 w-4 opacity-50 hover:opacity-100"
                        title="Copy code"
                      >
                        <Copy className="h-2 w-2" />
                      </Button>
                    </div>
                    <pre className="whitespace-pre-wrap text-[10px]">
                      {JSON.stringify(message.chartData.vega_lite_spec, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          )}

          {!isUser && message.suggestedQuestions && message.suggestedQuestions.length > 0 && (
            <div className="suggested-questions mt-1">
              <p className="text-[13px] font-semibold text-muted-foreground mb-1">Suggested questions:</p>
              <div className="questions-container">
                {message.suggestedQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="text-[13px] bg-white/80 backdrop-blur-sm text-[#1e2a38] hover:bg-white/90"
                    onClick={() => onQuestionClick?.(question)}
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </div>
          )}
          
          <div className="mt-1 flex items-center justify-between text-[11px] opacity-50">
            <span>{timestamp}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleCopy()}
              className="h-3 w-3 opacity-50 hover:opacity-100 ml-2 p-0.5"
              title="Copy message"
            >
              <Copy className="h-1.5 w-1.5" />
            </Button>
          </div>
        </div>
      </div>
      {isThinking && !isUser && (
        <div className="flex items-center gap-2 mt-2 text-sm bg-[#1e2a38] text-white px-2 py-1 rounded-lg">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Thinking...</span>
        </div>
      )}
    </div>
  );
};
