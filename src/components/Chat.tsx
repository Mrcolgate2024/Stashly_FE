
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
    // When we receive a message from the Financial Analyst avatar, send it to the chat
    console.log("Message from Financial Analyst received and forwarded to chat:", message);
    try {
      handleSendMessage(`Financial Analyst: ${message}`, userName);
      toast.success("Received message from Financial Analyst");
    } catch (error) {
      console.error("Error handling Financial Analyst message:", error);
      toast.error("Failed to process Financial Analyst message");
    }
  };

  const handleMarketAvatarMessage = (message: string) => {
    // When we receive a message from the Market Analyst avatar, send it to the chat
    console.log("Message from Market Analyst received and forwarded to chat:", message);
    try {
      handleSendMessage(`Market Analyst: ${message}`, userName);
      toast.success("Received message from Market Analyst");
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

      {/* Financial Analyst Avatar (right side) */}
      <SimliAvatar 
        onMessageReceived={handleFinancialAvatarMessage}
        token="gAAAAABnzdaSAK9eo1dXkjVPB4_sVJG_nvq_ThvMivYcfoVrYJOusk52PhgOtaEvqhmFbXbkJp9W06_DP4NWnN7v_TWO7dGKmi92oeC1aMmIHky98JNaYF4fBMn-6JqaEy_act99q0g46P7C571b2Sa9oA9NuqS6qi0OhQx1zKG67JsKtGj0ECL5Xj_KksIeXjvnUMcDeiDQEE1mBQAA6yO_yRV1l--P4WJSrLMQffvMdwGS6i36EH184LHY-ZWo-spsrVhZaY-e2jQukFkS__Ydv2XPz5DnIdp6K92KC3qFVsIDUltHEeTVKwGklz67_AkQwkHClFDYHseeM301guXCvGxk0F7icSHFyAaryiKyfBsIirJ5UR8-rbBf-XSrgspGqwMG6ue6ZiLJYoCQ2qPNIzLKgMFyOQ=="
        agentId="b36e9ae6-5a88-4235-9e7a-eab88fd52d7b"
        customText="Financial Analyst"
      />

      {/* Market Analyst Avatar (left side) */}
      <SimliAvatar2 
        onMessageReceived={handleMarketAvatarMessage}
        token="gAAAAABn0S1jLCExW5IjIuT_Kq_J4DZUfZCkWwWPgAATyRikZb86rwF94Sp5XWT_U9a2pIRoYKAoEcdhss-_Q4YDNm7i_MfZwHIYM6A_-J1actfzX7mVi9II_9XXCHCj4idT6JH5aTgsAugUZWc04Meb5CIETV4W5ORQotGNQirLi6voQ_Y5QGJo23IjorymDB4Rv_xE-CgyYOaYUV5tV4t7cjPM4k0-Rz0FD680ohxgU6ENBf0yZJdc_497VQp_ENvckTuji4h54ZrowdgLZkAdST-mVrI_DYE1Xsmm1Q1qyXDdUIqvM7uaieT5GPRHLv_Dlb8Oe8He5-bInsIbFztVqRwmlTQKojotFjKLJSh8DqZjWwhc_-Y58s1PIyoCoEC9GCCfrXZWXhmGqhMyogMbZJQbUch3wyr19_3BdRWVrYTqQEwHH42tgpoweu0dV-GQxMjDc0dmXK3t0eJ6H1RnViLl2YQIyqxWRIpH4XXxA0z_Adl8J7xnW63hjSnSiPS-GcEjSOej"
        agentId="a730e183-fc16-48d2-9d25-42d64b1a238a"
        customText="Market Analyst"
      />
    </div>
  );
};
