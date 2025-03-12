
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

      {/* Financial Analyst Avatar */}
      <SimliAvatar 
        onMessageReceived={handleFinancialAvatarMessage}
        token="gAAAAABnzdaSAK9eo1dXkjVPB4_sVJG_nvq_ThvMivYcfoVrYJOusk52PhgOtaEvqhmFbXbkJp9W06_DP4NWnN7v_TWO7dGKmi92oeC1aMmIHky98JNaYF4fBMn-6JqaEy_act99q0g46P7C571b2Sa9oA9NuqS6qi0OhQx1zKG67JsKtGj0ECL5Xj_KksIeXjvnUMcDeiDQEE1mBQAA6yO_yRV1l--P4WJSrLMQffvMdwGS6i36EH184LHY-ZWo-spsrVhZaY-e2jQukFkS__Ydv2XPz5DnIdp6K92KC3qFVsIDUltHEeTVKwGklz67_AkQwkHClFDYHseeM301guXCvGxk0F7icSHFyAaryiKyfBsIirJ5UR8-rbBf-XSrgspGqwMG6ue6ZiLJYoCQ2qPNIzLKgMFyOQ=="
        agentId="b36e9ae6-5a88-4235-9e7a-eab88fd52d7b"
        customText="Financial Analyst"
      />

      {/* Market Analyst Avatar - Updated token */}
      <SimliAvatar2 
        onMessageReceived={handleMarketAvatarMessage}
        token="gAAAAABnzdwxawWJB42YOEqaY00TMUfLdeBF-bpx9sLtTFBULBqXgE62aTR-7H2KCNjyhpnbVUMSAOk1l4JZflfYbOqBVXoRzKZi4yLd9SDTRKtQlc5FCfdYgQjUDUaTwl-iM07v5ZgQIRwzulH0wCbPIv3RZfIBb7r0xBe_dK2pxrPPTrHB0TnqEJdFPH_FdJWUbDrdFXgBM9WQ50YS3NM4EoXb-QLO5YRjmNLRYfuuVNi3Wm9W-3QfXqJNJrK5jPrlx0TP2_Dm0fW0-4Uya0UCJBFM7n2d2XD0VZaPxNDn3LPL33W3NqlGP14TdEeR6iTPpv8d2CsLY-bAiSxxr0WL23iLAhPxQoQXsT9Lk-EKQ98UJ6xnRE4="
        agentId="a730e183-fc16-48d2-9d25-42d64b1a238a"
        customText="Market Analyst"
      />
    </div>
  );
};
