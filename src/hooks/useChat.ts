
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { nanoid } from "nanoid";
import { Message } from "@/types/chat";
import { sendMessage } from "@/lib/api";

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [threadId, setThreadId] = useState("default");
  const { toast } = useToast();

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
      // Check if this is a greeting message
      const isGreeting = content.toLowerCase().match(/^(hi|hello|hey|greetings|sup|yo)(\s|$)/);

      const response = await sendMessage({
        message: isGreeting ? "initial_greeting" : content,
        thread_id: threadId,
        user_name: userName || undefined,
      });

      // Check if response contains an error message
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

      const botMessage: Message = {
        id: nanoid(),
        content: response.response,
        sender: "bot",
        timestamp: new Date(),
        imageData: response.has_image ? response.image_data : undefined,
        metrics: response.metrics,
        suggestedQuestions: response.suggested_questions,
        tableHtml: response.has_table ? response.table_html : undefined,
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

  return {
    messages,
    isLoading,
    threadId,
    handleSendMessage,
    handleSuggestedQuestionClick,
    handleRetryLastMessage
  };
}
