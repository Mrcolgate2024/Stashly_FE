
import React, { useEffect, useRef } from "react";
import { Message } from "@/types/chat";
import { ChatMessage } from "./ChatMessage";
import { WelcomeMessage } from "./WelcomeMessage";

interface ChatMessagesAreaProps {
  messages: Message[];
  onQuestionClick: (question: string) => void;
}

export const ChatMessagesArea = ({
  messages,
  onQuestionClick
}: ChatMessagesAreaProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <>
      {messages.length === 0 && <WelcomeMessage />}
      {messages.map((message) => (
        <ChatMessage 
          key={message.id} 
          message={message} 
          onQuestionClick={onQuestionClick}
        />
      ))}
      <div ref={messagesEndRef} />
    </>
  );
};
