import React, { useEffect, useRef } from "react";
import { Message } from "@/types/chat";
import { ChatMessage } from "./ChatMessage";
import { WelcomeMessage } from "./WelcomeMessage";
import { ThinkingIndicator } from "./ThinkingIndicator";

interface ChatMessagesAreaProps {
  messages: Message[];
  onQuestionClick?: (question: string) => void;
  isThinking?: boolean;
  clearMessages?: () => void;
}

export const ChatMessagesArea: React.FC<ChatMessagesAreaProps> = ({
  messages,
  onQuestionClick,
  isThinking = false,
  clearMessages,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="py-1 w-full">
      {messages.length === 0 && (
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)] w-full">
          <WelcomeMessage onRefresh={clearMessages} />
        </div>
      )}
      <div className="space-y-4 w-full">
        {messages.map((message, index) => (
          <ChatMessage
            key={index}
            message={message}
            onQuestionClick={onQuestionClick}
          />
        ))}
        {isThinking && <ThinkingIndicator />}
      </div>
      <div ref={messagesEndRef} />
    </div>
  );
};
