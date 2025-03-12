
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
        token="gAAAAABn0TbcF2qb2t6qsS4vvTzkZ7Cl608bt3qfiaAw1bp1VAJFstT88mQVftN3gwkTr0vtc6dQXaWB7-u8-uE9pPfL5EA1cQu5AUMk3OeOulhlmegNSOOLjxF0agoAYMwrzrqjg29d9uKuvztQPgLJqvVwUlCTRITnZ62AaHuE69O6-u9jObX2wp-4AI3ten2lmzRjeWFJZIJmxYAlmMp9bw4FQtjRN_dT_jE6jIe7Nysrx1MZCDaADMKdsUP2s3RFUROMYkIVVnSpjtt0qyzetf8KSQY9yYgRz6mGF4bxmDB2jf6QhT_ENkP67eIhLuj3NPIscHVJulUvclUWaEVqoSyh1Epg0d9YB4Qw6jySFxMePENVClzeDrUKUvQ7aZuDcZXTfMcU74dokJHThB0RM2pqzwQl_n_iIjhhDc9aHoeMzqNrR9Rkhvuwa3HaDaD0lvBinMd2M99VmQzXcL8Vp8iikJYHWnu0f6VRgoS-p9E7D0_c-CIxFGV-a1xlw0JgFnbkM-JT"
        agentId="b36e9ae6-5a88-4235-9e7a-eab88fd52d7b"
        customText="Financial Analyst"
      />

      {/* Market Analyst Avatar */}
      <SimliAvatar2 
        onMessageReceived={handleMarketAvatarMessage}
        token="gAAAAABn0TcMqd4UKDdYzx8H7ApwZ4GVn-1kN1sTkzjoSPwvhBH-iHc8tcPJWXQ-ochA-dAX6tUMfhHxxuHcVZkuHkFvFPoNmGfoi8HEI7Nj0JXUUeT0ONH4ng2H23UFe4RFvURmefQh-N8jd997YIORJGnhrAVeJPm0F1WrBtN4-CKGc0LJ6v2sc-mg3KytY_F_dbBfhYYAc7FeLuWjB4CU0w-HGG1Eq1aOgVOBGICmeNK61hBXDIx9fTS6mH-_2ibb0x8wi98ZitWz48RGEfJfTUIff8z_EuulXfQvYP_Wiw7zrCXbp4uMp2QO9EKJ2AnCtMzvGKOzTfJwdysMvgc28hQyZeTrVRirdFxUNOZX9d0cyGdbB-Fsm03CiQ9A_-0mR9f0s5Ag3FesfxbzGM6Co2RqsjNizQEY548iPkw31lVrX_XB4a0e0XvsHa3r1gDApUk7ZOL3nFJ7KFE4YwbekHTuaa4qnG_OKWrlCLJ4KiQs6LMYbnde4d_XzjTxXPLvcBcC1f6V"
        agentId="a730e183-fc16-48d2-9d25-42d64b1a238a"
        customText="Market Analyst"
      />
    </div>
  );
};
