import { useState } from "react";
import { useChat } from "@/hooks/useChat";
import { ChatInput } from "./ChatInput";
import { ChatControls } from "./ChatControls";
import { ChatMessagesArea } from "./ChatMessagesArea";
import { SimliAvatar } from "./SimliAvatar";

interface ChatProps {
  showControlsInHeader?: boolean;
  userName?: string;
  messages?: any[];
  isLoading?: boolean;
  handleSendMessage?: (content: string, userName: string) => void;
  handleSuggestedQuestionClick?: (question: string, userName: string) => void;
  handleRetryLastMessage?: (userName: string) => void;
  clearMessages?: () => void;
}

export const Chat = ({ 
  showControlsInHeader = false,
  userName: externalUserName,
  messages: externalMessages,
  isLoading: externalIsLoading,
  handleSendMessage: externalHandleSendMessage,
  handleSuggestedQuestionClick: externalHandleSuggestedQuestionClick,
  handleRetryLastMessage: externalHandleRetryLastMessage,
  clearMessages: externalClearMessages
}: ChatProps) => {
  // Use internal state if external state is not provided
  const [internalUserName, setInternalUserName] = useState("");
  
  const {
    messages: internalMessages,
    isLoading: internalIsLoading,
    handleSendMessage: internalHandleSendMessage,
    handleSuggestedQuestionClick: internalHandleSuggestedQuestionClick,
    handleRetryLastMessage: internalHandleRetryLastMessage,
    clearMessages: internalClearMessages
  } = useChat();

  // Use external state if provided, otherwise use internal state
  const userName = externalUserName || internalUserName;
  const messages = externalMessages || internalMessages;
  const isLoading = externalIsLoading !== undefined ? externalIsLoading : internalIsLoading;
  const handleSendMessageFn = externalHandleSendMessage || internalHandleSendMessage;
  const handleSuggestedQuestionClickFn = externalHandleSuggestedQuestionClick || internalHandleSuggestedQuestionClick;
  const handleRetryLastMessageFn = externalHandleRetryLastMessage || internalHandleRetryLastMessage;
  const clearMessagesFn = externalClearMessages || internalClearMessages;

  const handleAvatarMessage = (message: string) => {
    // When we receive a message from the avatar, send it to the chat
    handleSendMessageFn(message, userName);
  };

  const handleMessageSend = (content: string) => {
    handleSendMessageFn(content, userName);
  };

  const handleQuestionClick = (question: string) => {
    handleSuggestedQuestionClickFn(question, userName);
  };

  const handleRetry = () => {
    handleRetryLastMessageFn(userName);
  };

  // Render the chat controls
  const renderChatControls = () => (
    <ChatControls
      userName={userName}
      setUserName={setInternalUserName}
      isLoading={isLoading}
      messagesExist={messages.length > 0}
      onRetry={handleRetry}
      onClear={clearMessagesFn}
    />
  );

  return (
    <div className="flex h-[calc(100vh-12rem)] flex-col gap-4 relative">
      {!showControlsInHeader && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2 mb-2">
          {renderChatControls()}
        </div>
      )}
      
      <div className="flex-1 space-y-4 overflow-y-auto rounded-lg bg-white/80 backdrop-blur-sm p-4 shadow-md mb-20 sm:mb-4">
        <ChatMessagesArea
          messages={messages}
          onQuestionClick={handleQuestionClick}
        />
      </div>
      
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#1e2a38]/80 backdrop-blur-sm sm:static sm:bg-transparent sm:backdrop-blur-none">
        <ChatInput onSend={handleMessageSend} disabled={isLoading} />
      </div>

      {/* Simli avatar with adjusted positioning for mobile */}
      <SimliAvatar 
        onMessageReceived={handleAvatarMessage}
        token="gAAAAABnzdaSAK9eo1dXkjVPB4_sVJG_nvq_ThvMivYcfoVrYJOusk52PhgOtaEvqhmFbXbkJp9W06_DP4NWnN7v_TWO7dGKmi92oeC1aMmIHky98JNaYF4fBMn-6JqaEy_act99q0g46P7C571b2Sa9oA9NuqS6qi0OhQx1zKG67JsKtGj0ECL5Xj_KksIeXjvnUMcDeiDQEE1mBQAA6yO_yRV1l--P4WJSrLMQffvMdwGS6i36EH184LHY-ZWo-spsrVhZaY-e2jQukFkS__Ydv2XPz5DnIdp6K92KC3qFVsIDUltHEeTVKwGklz67_AkQwkHClFDYHseeM301guXCvGxk0F7icSHFyAaryiKyfBsIirJ5UR8-rbBf-XSrgspGqwMG6ue6ZiLJYoCQ2qPNIzLKgMFyOQ=="
        agentId="b36e9ae6-5a88-4235-9e7a-eab88fd52d7b"
        customText="Financial Analyst"
      />
    </div>
  );
};
