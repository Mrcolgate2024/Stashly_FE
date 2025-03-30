import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { nanoid } from "nanoid";
import { Message, MessageForApi } from "@/types/chat";
import { sendMessage } from "@/lib/api";

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [threadId, setThreadId] = useState("default");
  const { toast } = useToast();

  // Reset threadId and messages on page load
  useEffect(() => {
    setThreadId("default");
    setMessages([]);
  }, []);

  const handleSendMessage = async (content: string, userName?: string) => {
    const userMessage: Message = {
      id: nanoid(),
      content,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const isGreeting = content.toLowerCase().match(/^(hi|hello|hey|greetings|sup|yo)(\s|$)/);

      // Format recent messages for the API
      const recentMessages: MessageForApi[] = messages.slice(-10).map(msg => ({
        content: msg.content,
        sender: msg.sender
      }));

      const response = await sendMessage({
        message: isGreeting ? "initial_greeting" : content,
        thread_id: threadId,
        user_name: userName || undefined,
        message_history: recentMessages
      });

      const isErrorResponse = 
        response.response.includes("I'm sorry, I encountered an error") ||
        response.response.includes("Error:") ||
        response.response.includes("could you please try again");

      if (isErrorResponse) {
        toast({
          title: "Backend Error",
          description: "The AI assistant encountered an error. Please try a different question or try again later.",
          variant: "destructive",
        });
      }

      let messageContent = response.response;
      let chartData = null;

      // Handle line breaks in the message content
      messageContent = messageContent
        .replace(/\\n/g, '\n')  // Replace escaped newlines
        .replace(/\n{3,}/g, '\n\n')  // Replace multiple newlines with double newlines
        .trim();

      // Check if the response contains chart data from the API
      if (response.chart_data) {
        chartData = response.chart_data;
      } else if (response.vega_lite_spec) {
        // Handle legacy vega_lite_spec format
        chartData = {
          description: "Market Data Chart",
          vega_lite_spec: response.vega_lite_spec
        };
      } else {
        // If API doesn't provide chart data, try to extract from message content
        try {
          // Look for both JSON blocks and Vega-Lite specification text
          const jsonBlockMatch = messageContent.match(/```json\n([\s\S]*?)\n```/);
          
          if (jsonBlockMatch) {
            const jsonString = jsonBlockMatch[1];
            
            try {
              const jsonData = JSON.parse(jsonString);
              
              // Check if it's a Vega-Lite spec
              if (jsonData && 
                 (jsonData.$schema?.includes('vega-lite') || 
                  (jsonData.mark && jsonData.encoding && jsonData.data))) {
                
                chartData = {
                  description: jsonData.description || "Market Data Chart",
                  vega_lite_spec: jsonData
                };
                
                // Don't remove the code from the message since we want to keep it
                // Just clean up any potential markdown chart links
                messageContent = messageContent
                  .replace(/\[([^\]]+)\]\([^)]*\)/g, (match, linkText) => {
                    if (linkText.toLowerCase().includes('chart') || 
                        linkText.toLowerCase().includes('graph') || 
                        linkText.toLowerCase().includes('index') || 
                        linkText.toLowerCase().includes('figure') || 
                        linkText.toLowerCase().includes('plot') || 
                        linkText.toLowerCase().includes('visualization') || 
                        linkText.toLowerCase().includes('data')) {
                      return '';
                    }
                    return match;
                  })
                  // Still clean up stray punctuation at beginning
                  .replace(/^[\s\*\)\(\[\]\.,:;\'\"\`]+/, '')
                  .trim();
              }
            } catch (err) {
              console.error('Error parsing JSON from code block:', err);
            }
          } else {
            // If no code block, try to parse direct JSON from the message content
            const vegaLiteMatch = messageContent.match(/\{[\s\S]*"\$schema"[\s\S]*"https:\/\/vega\.github\.io\/schema\/vega-lite\/[\s\S]*\}/);
            
            if (vegaLiteMatch) {
              try {
                const firstMatch = vegaLiteMatch[0];
                const vegaLiteSpec = JSON.parse(firstMatch);
                
                if (vegaLiteSpec && 
                   (vegaLiteSpec.$schema?.includes('vega-lite') || 
                    (vegaLiteSpec.mark && vegaLiteSpec.encoding && vegaLiteSpec.data))) {
                  
                  chartData = {
                    description: vegaLiteSpec.description || "Market Data Chart",
                    vega_lite_spec: vegaLiteSpec
                  };
                  
                  // Again, don't remove the content since we want to keep it
                  messageContent = messageContent
                    // Clean up stray punctuation at beginning
                    .replace(/^[\s\*\)\(\[\]\.,:;\'\"\`]+/, '')
                    .trim();
                }
              } catch (err) {
                console.error('Error parsing Vega-Lite spec JSON:', err);
              }
            }
          }
        } catch (err) {
          console.error('Error extracting Vega-Lite spec from message:', err);
        }
      }

      // Format the response as bullet points if it contains a list of capabilities
      if (messageContent.includes("Here's a list of things I can do") || 
          messageContent.includes("Here's what I can do") ||
          messageContent.includes("I can help you with")) {
        
        // Split the message into introduction and capabilities
        const parts = messageContent.split(/(?=Would you like me to:|Or is there anything else)/);
        if (parts.length > 1) {
          const intro = parts[0];
          const capabilities = parts[1];
          
          // Format capabilities as numbered list
          const formattedCapabilities = capabilities
            .replace(/(Would you like me to:|Or is there anything else)/, '\n\n$1')
            .replace(/(\d+\.\s*)([A-Za-z\s]+):\s*([^:]+?)(?=\n|$)/g, '\n$1**$2:** $3')
            .replace(/(\d+\.\s*)([A-Za-z\s]+):\s*([^:]+?)(?=\n|$)/g, '\n$1**$2:** $3')
            .replace(/(\d+\.\s*)([A-Za-z\s]+):\s*([^:]+?)(?=\n|$)/g, '\n$1**$2:** $3')
            .replace(/(\d+\.\s*)([A-Za-z\s]+):\s*([^:]+?)(?=\n|$)/g, '\n$1**$2:** $3')
            .replace(/(\d+\.\s*)([A-Za-z\s]+):\s*([^:]+?)(?=\n|$)/g, '\n$1**$2:** $3')
            .replace(/(\d+\.\s*)([A-Za-z\s]+):\s*([^:]+?)(?=\n|$)/g, '\n$1**$2:** $3')
            .replace(/(\d+\.\s*)([A-Za-z\s]+):\s*([^:]+?)(?=\n|$)/g, '\n$1**$2:** $3')
            .replace(/(\d+\.\s*)([A-Za-z\s]+):\s*([^:]+?)(?=\n|$)/g, '\n$1**$2:** $3');
          
          messageContent = intro + formattedCapabilities;
        }
      }

      // Clean up chart references if chart data is present
      if (chartData) {
        // Remove markdown links to the chart and standalone chart references
        messageContent = messageContent
          // Remove markdown image links specifically (![text](url) format)
          .replace(/!\[([^\]]+)\]\([^)]*\)/g, '')
          // Remove standalone chart references (any word followed by "Chart" on its own line)
          .replace(/\n+([A-Za-z0-9\s&]+)\s+Chart\n+/g, '\n')
          .replace(/\n+([A-Za-z0-9\s&]+)\s+chart\n+/g, '\n')
          // Remove any isolated "Chart" text on its own line
          .replace(/\n+Chart\n+/g, '\n')
          .replace(/\n+chart\n+/g, '\n')
          // Remove markdown links containing chart-related keywords
          .replace(/\[([^\]]+)\]\([^)]*\)/g, (match, linkText) => {
            if (linkText.toLowerCase().includes('chart') || 
                linkText.toLowerCase().includes('graph') || 
                linkText.toLowerCase().includes('index') || 
                linkText.toLowerCase().includes('figure') || 
                linkText.toLowerCase().includes('plot') || 
                linkText.toLowerCase().includes('visualization') || 
                linkText.toLowerCase().includes('data')) {
              return '';
            }
            return match;
          })
          // Remove "you can view it here" and similar phrases
          .replace(/[Yy]ou can view it here\.?\s*/g, '')
          .replace(/[Hh]ere(?:'s| is) (?:the|a|your) chart(?:[^.])*\./g, '')
          .replace(/[Hh]ere(?:'s| is) (?:the|a|your) (?:requested|created) chart(?:[^.])*\./g, '')
          // Clean up multiple newlines
          .replace(/\n{3,}/g, '\n\n')
          // Clean up stray punctuation at beginning of message
          .replace(/^[\s\*\)\(\[\]\.,:;\'\"\`]+/, '')
          .trim();
      }

      const botMessage: Message = {
        id: nanoid(),
        content: messageContent,
        sender: "bot",
        timestamp: new Date(),
        imageData: response.has_image ? response.image_data : undefined,
        metrics: response.metrics,
        suggestedQuestions: response.suggested_questions,
        tableHtml: response.has_table ? response.table_html : undefined,
        chartData: chartData
      };

      setMessages((prev) => [...prev, botMessage]);
      setThreadId(response.thread_id);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestedQuestionClick = (question: string, userName?: string) => {
    handleSendMessage(question, userName);
  };

  const handleRetryLastMessage = (userName?: string) => {
    const lastUserMessage = [...messages]
      .reverse()
      .find(message => message.sender === "user");
    
    if (lastUserMessage) {
      handleSendMessage(lastUserMessage.content, userName);
    } else {
      toast({
        title: "No previous message",
        description: "There is no previous message to retry.",
      });
    }
  };

  const clearMessages = () => {
    setMessages([]);
    setThreadId("default");
    toast({
      title: "Chat cleared",
      description: "All messages have been cleared.",
    });
  };

  return {
    messages,
    isLoading,
    threadId,
    handleSendMessage,
    handleSuggestedQuestionClick,
    handleRetryLastMessage,
    clearMessages
  };
}
