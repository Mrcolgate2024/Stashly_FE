import { Chat } from "@/components/Chat";
import { Logo } from "@/components/Logo";
import { YahooMarketData } from "@/components/YahooMarketData";
import { ChatControls } from "@/components/ChatControls";
import { useState } from "react";
import { useChat } from "@/hooks/useChat";

const Index = () => {
  const [userName, setUserName] = useState("");
  
  const {
    messages,
    isLoading,
    handleSendMessage,
    handleSuggestedQuestionClick,
    handleRetryLastMessage,
    clearMessages
  } = useChat();

  const handleRetry = () => {
    handleRetryLastMessage(userName);
  };

  return (
    <>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap" />
      <div 
        className="min-h-screen w-full"
        style={{
          backgroundImage: "url('/images/Stashlylogobackground.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }}
      >
        <div className="mx-auto max-w-4xl backdrop-blur-sm bg-white/40 min-h-screen">
          <div className="p-4">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
              <div className="flex flex-col gap-2">
                <Logo />
                <div className="mt-2">
                  <ChatControls
                    userName={userName}
                    setUserName={setUserName}
                    isLoading={isLoading}
                    messagesExist={messages.length > 0}
                    onRetry={handleRetry}
                    onClear={clearMessages}
                  />
                </div>
              </div>
              <div className="market-data-container">
                <YahooMarketData />
              </div>
            </div>
            <Chat 
              showControlsInHeader={true}
              userName={userName}
              messages={messages}
              isLoading={isLoading}
              handleSendMessage={handleSendMessage}
              handleSuggestedQuestionClick={handleSuggestedQuestionClick}
              handleRetryLastMessage={handleRetryLastMessage}
              clearMessages={clearMessages}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Index;
