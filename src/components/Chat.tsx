
import { useState, useEffect } from "react";
import { useChat } from "@/hooks/useChat";
import { ChatInput } from "./ChatInput";
import { ChatControls } from "./ChatControls";
import { ChatMessagesArea } from "./ChatMessagesArea";
import { SimliAvatar } from "./SimliAvatar";
import { Logo } from "./Logo";
import { toast } from "@/hooks/use-toast";

export const Chat = () => {
  const [userName, setUserName] = useState("");
  const [selectedAnalyst, setSelectedAnalyst] = useState<string | null>(null);
  const [simliScriptLoaded, setSimliScriptLoaded] = useState(false);
  const [avatarsReady, setAvatarsReady] = useState(0);
  
  const {
    messages,
    isLoading,
    handleSendMessage,
    handleSuggestedQuestionClick,
    handleRetryLastMessage,
    clearMessages
  } = useChat();

  // Check if Simli script is loaded
  useEffect(() => {
    const checkScriptLoaded = () => {
      if (window.customElements && window.customElements.get('simli-widget')) {
        console.log("Simli custom element is defined, script is fully loaded");
        setSimliScriptLoaded(true);
        
        // Notify user once the script is loaded
        toast({
          title: "Avatars Loading",
          description: "Please wait while the analyst avatars are initializing. Click on either avatar when they appear.",
        });
      }
    };

    // Check immediately and then on an interval
    checkScriptLoaded();
    const checkInterval = setInterval(checkScriptLoaded, 2000);
    
    // If it doesn't load within 10 seconds, show a message
    const timeoutId = setTimeout(() => {
      if (!simliScriptLoaded) {
        toast({
          title: "Slow Loading",
          description: "Avatar initialization is taking longer than expected. Please be patient or try refreshing the page.",
        });
      }
    }, 10000);
    
    return () => {
      clearInterval(checkInterval);
      clearTimeout(timeoutId);
    };
  }, []);

  // Track when an avatar notifies us it's ready
  useEffect(() => {
    if (avatarsReady === 2) {
      toast({
        title: "Both Analysts Ready",
        description: "Click on either analyst avatar to start a conversation.",
      });
    }
  }, [avatarsReady]);

  const handleAvatarMessage = (message: string) => {
    console.log("Avatar message received:", message);
    // When we receive a message from the avatar, send it to the chat
    handleSendMessage(message, userName);
  };

  const handleAvatarReady = () => {
    setAvatarsReady(prev => prev + 1);
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

      {/* Financial Analyst */}
      <SimliAvatar 
        onMessageReceived={handleAvatarMessage}
        onAvatarReady={handleAvatarReady}
        token="gAAAAABnzdaSAK9eo1dXkjVPB4_sVJG_nvq_ThvMivYcfoVrYJOusk52PhgOtaEvqhmFbXbkJp9W06_DP4NWnN7v_TWO7dGKmi92oeC1aMmIHky98JNaYF4fBMn-6JqaEy_act99q0g46P7C571b2Sa9oA9NuqS6qi0OhQx1zKG67JsKtGj0ECL5Xj_KksIeXjvnUMcDeiDQEE1mBQAA6yO_yRV1l--P4WJSrLMQffvMdwGS6i36EH184LHY-ZWo-spsrVhZaY-e2jQukFkS__Ydv2XPz5DnIdp6K92KC3qFVsIDUltHEeTVKwGklz67_AkQwkHClFDYHseeM301guXCvGxk0F7icSHFyAaryiKyfBsIirJ5UR8-rbBf-XSrgspGqwMG6ue6ZiLJYoCQ2qPNIzLKgMFyOQ=="
        agentId="b36e9ae6-5a88-4235-9e7a-eab88fd52d7b"
        customText="Financial Analyst"
        position="right"
        customClassName="fixed bottom-[80px] right-4 sm:bottom-10 sm:right-10 z-10 cursor-pointer hover:opacity-80 transition-opacity"
      />

      {/* Market Analyst */}
      <SimliAvatar 
        onMessageReceived={handleAvatarMessage}
        onAvatarReady={handleAvatarReady}
        token="gAAAAABnzdaSAK9eo1dXkjVPB4_sVJG_nvq_ThvMivYcfoVrYJOusk52PhgOtaEvqhmFbXbkJp9W06_DP4NWnN7v_TWO7dGKmi92oeC1aMmIHky98JNaYF4fBMn-6JqaEy_act99q0g46P7C571b2Sa9oA9NuqS6qi0OhQx1zKG67JsKtGj0ECL5Xj_KksIeXjvnUMcDeiDQEE1mBQAA6yO_yRV1l--P4WJSrLMQffvMdwGS6i36EH184LHY-ZWo-spsrVhZaY-e2jQukFkS__Ydv2XPz5DnIdp6K92KC3qFVsIDUltHEeTVKwGklz67_AkQwkHClFDYHseeM301guXCvGxk0F7icSHFyAaryiKyfBsIirJ5UR8-rbBf-XSrgspGqwMG6ue6ZiLJYoCQ2qPNIzLKgMFyOQ=="
        agentId="a730e183-fc16-48d2-9d25-42d64b1a238a"
        customText="Market Analyst"
        position="left"
        customClassName="fixed bottom-[80px] left-4 sm:bottom-10 sm:left-10 z-10 cursor-pointer hover:opacity-80 transition-opacity"
      />
    </div>
  );
};
