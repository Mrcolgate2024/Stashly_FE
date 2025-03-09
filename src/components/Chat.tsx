
import { useState } from "react";
import { useChat } from "@/hooks/useChat";
import { ChatInput } from "./ChatInput";
import { ChatControls } from "./ChatControls";
import { ChatMessagesArea } from "./ChatMessagesArea";
import { AvatarChatHandler } from "./AvatarChatHandler";

type ChatMode = "text" | "avatar";

export const Chat = () => {
  const [chatMode, setChatMode] = useState<ChatMode>("text");
  const [userName, setUserName] = useState("");
  
  const {
    messages,
    isLoading,
    handleSendMessage,
    handleSuggestedQuestionClick,
    handleRetryLastMessage
  } = useChat();

  const handleAvatarMessage = (response: string) => {
    // This function handles responses from the avatar interface
    const { handleSendMessage: originalHandleSendMessage } = useChat();
    originalHandleSendMessage(response);
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
    <div className="flex h-[calc(100vh-4rem)] flex-col gap-4 p-4">
      <ChatControls
        chatMode={chatMode}
        setChatMode={setChatMode}
        userName={userName}
        setUserName={setUserName}
        isLoading={isLoading}
        messagesExist={messages.length > 0}
        onRetry={handleRetry}
      />
      
      <div className="flex-1 space-y-4 overflow-y-auto rounded-lg bg-background p-4 shadow-sm">
        {chatMode === "text" ? (
          <ChatMessagesArea
            messages={messages}
            onQuestionClick={handleQuestionClick}
          />
        ) : (
          <AvatarChatHandler onMessageReceived={handleAvatarMessage} />
        )}
      </div>
      
      {chatMode === "text" && (
        <div className="w-full">
          <ChatInput onSend={handleMessageSend} disabled={isLoading} />
        </div>
      )}
    </div>
  );
};
