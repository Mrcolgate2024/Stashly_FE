
import { useState } from "react";
import { useChat } from "@/hooks/useChat";
import { ChatInput } from "./ChatInput";
import { ChatControls } from "./ChatControls";
import { ChatMessagesArea } from "./ChatMessagesArea";
import { SimliAvatar } from "./SimliAvatar";
import { SimliAvatar2 } from "./SimliAvatar2";
import { Logo } from "./Logo";
import { toast } from "sonner";

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
    console.log("Message from Financial Analyst received in Chat:", message);
    if (!message || message.trim() === "") {
      console.warn("Empty message received from Financial Analyst, ignoring");
      return;
    }

    try {
      const formattedMessage = `Financial Analyst: ${message}`;
      handleSendMessage(formattedMessage, userName);
    } catch (error) {
      console.error("Error handling Financial Analyst message:", error);
      toast.error("Failed to process Financial Analyst message");
    }
  };

  const handleMarketAvatarMessage = (message: string) => {
    console.log("Message from Market Analyst received in Chat:", message);
    if (!message || message.trim() === "") {
      console.warn("Empty message received from Market Analyst, ignoring");
      return;
    }

    try {
      const formattedMessage = `Market Analyst: ${message}`;
      handleSendMessage(formattedMessage, userName);
    } catch (error) {
      console.error("Error handling Market Analyst message:", error);
      toast.error("Failed to process Market Analyst message");
    }
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

      {/* Financial Analyst Avatar - Temporary disabled the token for debugging */}
      <SimliAvatar 
        onMessageReceived={handleFinancialAvatarMessage}
        token="gAAAAABn1AQO5Xo4ymtgLPIGwESisjZw3uf4-Gs3K16t-UGKYaMb9E09W-D3hfdNKTqKGQ2uOJJZDYZLB-Vwg3mXnI3xQdZUJ0gzv-M5i_qwEDvyJy7uHNbzD7a60Kph8wEiurlV8wMEOw48r-g4w67jXb2TDOdP46dKBgJjLiXZR1TUHJbXuYCRljC3kUbIYOmV0UqWuI8MXnUHvt9jKrjECKSp7FwoCsE8Xdz-JXqLcjKnXXjpQ5k3CqNGn2hfGEzRO-5fJh8MH4WiCGi-fDtK1-UzQQZGtOkRQgkXkl-JpWrL1I_fv-cxbXxHo8hJ96a9nw1Ps9mE0_uVmAkK79XQZFmkAH6KGKLyuXzrNyhNuOGgLQpUiDk="
        agentId="b36e9ae6-5a88-4235-9e7a-eab88fd52d7b"
        customText="Financial Analyst"
      />

      {/* Market Analyst Avatar - Temporary disabled the token for debugging */}
      <SimliAvatar2 
        onMessageReceived={handleMarketAvatarMessage}
        token="gAAAAABn1AQO5Xo4ymtgLPIGwESisjZw3uf4-Gs3K16t-UGKYaMb9E09W-D3hfdNKTqKGQ2uOJJZDYZLB-Vwg3mXnI3xQdZUJ0gzv-M5i_qwEDvyJy7uHNbzD7a60Kph8wEiurlV8wMEOw48r-g4w67jXb2TDOdP46dKBgJjLiXZR1TUHJbXuYCRljC3kUbIYOmV0UqWuI8MXnUHvt9jKrjECKSp7FwoCsE8Xdz-JXqLcjKnXXjpQ5k3CqNGn2hfGEzRO-5fJh8MH4WiCGi-fDtK1-UzQQZGtOkRQgkXkl-JpWrL1I_fv-cxbXxHo8hJ96a9nw1Ps9mE0_uVmAkK79XQZFmkAH6KGKLyuXzrNyhNuOGgLQpUiDk="
        agentId="a730e183-fc16-48d2-9d25-42d64b1a238a"
        customText="Market Analyst"
      />
    </div>
  );
};
