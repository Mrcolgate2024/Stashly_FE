
import { useState } from "react";
import { useChat } from "@/hooks/useChat";
import { ChatInput } from "./ChatInput";
import { ChatControls } from "./ChatControls";
import { ChatMessagesArea } from "./ChatMessagesArea";
import { SimliAvatar } from "./SimliAvatar";
import { MarketAnalystAvatar } from "./MarketAnalystAvatar";
import { Logo } from "./Logo";

export const Chat = () => {
  const [userName, setUserName] = useState("");
  
  const {
    messages,
    isLoading,
    handleSendMessage,
    handleSuggestedQuestionClick,
    handleRetryLastMessage,
    clearMessages
  } = useChat();

  const handleFinancialAvatarMessage = (message: string) => {
    // When we receive a message from the financial avatar, send it to the chat
    handleSendMessage("Financial Analyst: " + message, userName);
  };

  const handleMarketAvatarMessage = (message: string) => {
    // When we receive a message from the market avatar, send it to the chat
    handleSendMessage("Market Analyst: " + message, userName);
  };

  const handleMessageSend = (content: string) => {
    handleSendMessage(content, userName);
  };

  const handleQuestionClick = (question: string) => {
    handleSuggestedQuestionClick(question, userName);
  };

  const handleRetry = () => {
    handleRetryLastMessage(userName);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col gap-4 p-4 relative">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <Logo />
        <ChatControls
          userName={userName}
          setUserName={setUserName}
          isLoading={isLoading}
          messagesExist={messages.length > 0}
          onRetry={handleRetry}
          onClear={clearMessages}
        />
      </div>
      
      <div className="flex-1 space-y-4 overflow-y-auto rounded-lg bg-white/80 backdrop-blur-sm p-4 shadow-md mb-20 sm:mb-4">
        <ChatMessagesArea
          messages={messages}
          onQuestionClick={handleQuestionClick}
        />
      </div>
      
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#1e2a38]/80 backdrop-blur-sm sm:static sm:bg-transparent sm:backdrop-blur-none">
        <ChatInput onSend={handleMessageSend} disabled={isLoading} />
      </div>

      {/* Financial Analyst avatar with dynamic token refresh */}
      <SimliAvatar 
        onMessageReceived={handleFinancialAvatarMessage}
        token="dummy-token" /* Token will be refreshed in the component */
        agentId="b36e9ae6-5a88-4235-9e7a-eab88fd52d7b"
        customText="Financial Analyst"
      />

      {/* Market Analyst avatar with dynamic token refresh */}
      <MarketAnalystAvatar 
        onMessageReceived={handleMarketAvatarMessage}
        token="dummy-token" /* Token will be refreshed in the component */
        agentId="a730e183-fc16-48d2-9d25-42d64b1a238a"
        customText="Market Analyst"
      />
    </div>
  );
};
