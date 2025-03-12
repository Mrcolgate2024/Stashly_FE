
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

      {/* Financial Analyst avatar - hardcoded token directly */}
      <SimliAvatar 
        onMessageReceived={handleFinancialAvatarMessage}
        token="gAAAAABn0Tst5Mfzk1Q8yAihj1maQrzRbn5bIydW0-_rTiyXFQB2nZhYN-P5DQtwZUO4wDOfDU6l1m009COmB6Hl4Cx7iPLkowc7dBHb6byl0qcpUK9zDRss2iM5uOSdn2zpwHsRDtDN7j9NPOYYIHTOZ2z2WvwzdU1Kgx70DqkJLTOaeh6SR0y-puUYDTn3GGFDGC0OAAotQjj10-gVVGov_eRCxcX5SvgzD4fEbJT5XY8JjfnZNHlbj6_LFqovf6fq11TH9wU0zoXmZM2yJsza-9fWD-EG2xg5JP6OQVqEoPr-9aFgymVYBEuBYe5g4DBZLfqQ5pDNT_CcdtnzVzRPhwW9UTdSz-flLKSzzxNs5PzOoFIbg9Po9is8DpI_M-w-sLU5Jnt9gJAM8cDJasruJK6DT9JwbgYreUTlr0KoUURXGEIXG1IciUkgw2AYe5hUPNnc4d8S44cqtJUbX6Xcig-qzcawao0UnPNjfA00R965WPjijqzWZvohMhmhsBeXk5N7n2hS"
        agentId="b36e9ae6-5a88-4235-9e7a-eab88fd52d7b"
        customText="Financial Analyst"
      />

      {/* Market Analyst avatar - hardcoded token directly */}
      <MarketAnalystAvatar 
        onMessageReceived={handleMarketAvatarMessage}
        token="gAAAAABn0TcMqd4UKDdYzx8H7ApwZ4GVn-1kN1sTkzjoSPwvhBH-iHc8tcPJWXQ-ochA-dAX6tUMfhHxxuHcVZkuHkFvFPoNmGfoi8HEI7Nj0JXUUeT0ONH4ng2H23UFe4RFvURmefQh-N8jd997YIORJGnhrAVeJPm0F1WrBtN4-CKGc0LJ6v2sc-mg3KytY_F_dbBfhYYAc7FeLuWjB4CU0w-HGG1Eq1aOgVOBGICmeNK61hBXDIx9fTS6mH-_2ibb0x8wi98ZitWz48RGEfJfTUIff8z_EuulXfQvYP_Wiw7zrCXbp4uMp2QO9EKJ2AnCtMzvGKOzTfJwdysMvgc28hQyZeTrVRirdFxUNOZX9d0cyGdbB-Fsm03CiQ9A_-0mR9f0s5Ag3FesfxbzGM6Co2RqsjNizQEY548iPkw31lVrX_XB4a0e0XvsHa3r1gDApUk7ZOL3nFJ7KFE4YwbekHTuaa4qnG_OKWrlCLJ4KiQs6LMYbnde4d_XzjTxXPLvcBcC1f6V"
        agentId="a730e183-fc16-48d2-9d25-42d64b1a238a"
        customText="Market Analyst"
      />
    </div>
  );
};
