
import { useState } from "react";
import { useChat } from "@/hooks/useChat";
import { ChatInput } from "./ChatInput";
import { ChatControls } from "./ChatControls";
import { ChatMessagesArea } from "./ChatMessagesArea";
import { SimliAvatar } from "./SimliAvatar";
import { Button } from "@/components/ui/button";
import { RefreshCcw, Trash2 } from "lucide-react";
import { Message } from "@/types/chat";

interface ChatProps {
  showControlsInHeader?: boolean;
  userName?: string;
  messages?: Message[];
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

  const handleClear = () => {
    clearMessagesFn();
  };

  // Render the chat controls
  const renderChatControls = () => (
    <ChatControls
      isLoading={isLoading}
      messagesExist={messages.length > 0}
      onRetry={handleRetry}
      onClear={handleClear}
    />
  );

  return (
    <div className="flex flex-col h-full relative">
      {!showControlsInHeader && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2 mb-2">
          {renderChatControls()}
        </div>
      )}
      
      <div className="relative flex-1 flex flex-col">
        <div className="absolute top-2 left-2 flex gap-2 z-10">
          {messages.length > 0 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRetry}
                disabled={isLoading}
                className="h-8 w-8 bg-transparent hover:bg-transparent opacity-30 hover:opacity-50"
              >
                <RefreshCcw className="h-4 w-4 text-white" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClear}
                className="h-8 w-8 bg-transparent hover:bg-transparent opacity-30 hover:opacity-50"
              >
                <Trash2 className="h-4 w-4 text-white" />
              </Button>
            </>
          )}
        </div>
        <div className="flex-1 overflow-y-auto px-4 mb-[110px]">
          <ChatMessagesArea
            messages={messages}
            onQuestionClick={handleQuestionClick}
            isThinking={isLoading}
          />
        </div>
      </div>

      {/* Simli avatar with adjusted positioning for mobile */}
      <div className="avatar-container">
        <SimliAvatar
          onMessageReceived={handleAvatarMessage}
          agentId="b36e9ae6-5a88-4235-9e7a-eab88fd52d7b"
          customText="Financial Assistant"
        />
      </div>
      
      <div className="fixed-bottom p-3 pt-4 bg-[#1e2a38]/80 backdrop-blur-sm border-t border-white/10">
        <div className="max-w-3xl mx-auto">
          <ChatInput onSend={handleMessageSend} disabled={isLoading} />
        </div>
      </div>
    </div>
  );
};
