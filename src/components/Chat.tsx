
import { useState } from "react";
import { useChat } from "@/hooks/useChat";
import { ChatInput } from "./ChatInput";
import { ChatControls } from "./ChatControls";
import { ChatMessagesArea } from "./ChatMessagesArea";
import { SimliAvatar } from "./SimliAvatar";
import { Logo } from "./Logo";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Chat = () => {
  const [userName, setUserName] = useState("");
  const [activeAnalyst, setActiveAnalyst] = useState("financial");
  const [showSelector, setShowSelector] = useState(false);
  
  const {
    messages,
    isLoading,
    handleSendMessage,
    handleSuggestedQuestionClick,
    handleRetryLastMessage,
    clearMessages
  } = useChat();

  const handleAvatarMessage = (message: string) => {
    // When we receive a message from the avatar, send it to the chat
    handleSendMessage(message, userName);
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

  // Avatar configuration for each analyst
  const analysts = {
    financial: {
      token: "gAAAAABnzdaSAK9eo1dXkjVPB4_sVJG_nvq_ThvMivYcfoVrYJOusk52PhgOtaEvqhmFbXbkJp9W06_DP4NWnN7v_TWO7dGKmi92oeC1aMmIHky98JNaYF4fBMn-6JqaEy_act99q0g46P7C571b2Sa9oA9NuqS6qi0OhQx1zKG67JsKtGj0ECL5Xj_KksIeXjvnUMcDeiDQEE1mBQAA6yO_yRV1l--P4WJSrLMQffvMdwGS6i36EH184LHY-ZWo-spsrVhZaY-e2jQukFkS__Ydv2XPz5DnIdp6K92KC3qFVsIDUltHEeTVKwGklz67_AkQwkHClFDYHseeM301guXCvGxk0F7icSHFyAaryiKyfBsIirJ5UR8-rbBf-XSrgspGqwMG6ue6ZiLJYoCQ2qPNIzLKgMFyOQ==",
      agentId: "b36e9ae6-5a88-4235-9e7a-eab88fd52d7b",
      customText: "Financial Analyst",
      customImage: "/lovable-uploads/c54ad77b-c6fd-43b7-8063-5803ecec8c64.png",
    },
    market: {
      token: "gAAAAABnzdaSAK9eo1dXkjVPB4_sVJG_nvq_ThvMivYcfoVrYJOusk52PhgOtaEvqhmFbXbkJp9W06_DP4NWnN7v_TWO7dGKmi92oeC1aMmIHky98JNaYF4fBMn-6JqaEy_act99q0g46P7C571b2Sa9oA9NuqS6qi0OhQx1zKG67JsKtGj0ECL5Xj_KksIeXjvnUMcDeiDQEE1mBQAA6yO_yRV1l--P4WJSrLMQffvMdwGS6i36EH184LHY-ZWo-spsrVhZaY-e2jQukFkS__Ydv2XPz5DnIdp6K92KC3qFVsIDUltHEeTVKwGklz67_AkQwkHClFDYHseeM301guXCvGxk0F7icSHFyAaryiKyfBsIirJ5UR8-rbBf-XSrgspGqwMG6ue6ZiLJYoCQ2qPNIzLKgMFyOQ==",
      agentId: "a730e183-fc16-48d2-9d25-42d64b1a238a",
      customText: "Market Analyst",
      customImage: "/lovable-uploads/23035374-c781-4ada-b7fa-a716c19a244f.png",
    }
  };

  const toggleAnalyst = () => {
    setActiveAnalyst(activeAnalyst === "financial" ? "market" : "financial");
    setShowSelector(false);
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
        <div className="mb-4">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center justify-between w-full max-w-[240px] text-sm bg-white/90 shadow-sm"
            onClick={() => setShowSelector(!showSelector)}
          >
            <span>Speaking with: {analysts[activeAnalyst as keyof typeof analysts].customText}</span>
            {showSelector ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
          
          {showSelector && (
            <div className="absolute mt-1 w-[240px] bg-white border rounded-md shadow-lg z-20 transition-all duration-200 ease-in-out">
              <div 
                className={`p-2 cursor-pointer hover:bg-gray-100 ${activeAnalyst === "financial" ? "bg-gray-50" : ""}`}
                onClick={() => {
                  setActiveAnalyst("financial");
                  setShowSelector(false);
                }}
              >
                Financial Analyst
              </div>
              <div 
                className={`p-2 cursor-pointer hover:bg-gray-100 ${activeAnalyst === "market" ? "bg-gray-50" : ""}`}
                onClick={() => {
                  setActiveAnalyst("market");
                  setShowSelector(false);
                }}
              >
                Market Analyst
              </div>
            </div>
          )}
        </div>
        
        <ChatMessagesArea
          messages={messages}
          onQuestionClick={handleQuestionClick}
        />
      </div>
      
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#1e2a38]/80 backdrop-blur-sm sm:static sm:bg-transparent sm:backdrop-blur-none">
        <ChatInput onSend={handleMessageSend} disabled={isLoading} />
      </div>

      {/* Position the active avatar */}
      <div className="fixed bottom-[80px] right-4 sm:bottom-10 sm:right-10">
        <SimliAvatar 
          onMessageReceived={handleAvatarMessage}
          token={analysts[activeAnalyst as keyof typeof analysts].token}
          agentId={analysts[activeAnalyst as keyof typeof analysts].agentId}
          customText={analysts[activeAnalyst as keyof typeof analysts].customText}
          customImage={analysts[activeAnalyst as keyof typeof analysts].customImage}
        />
      </div>
    </div>
  );
};
