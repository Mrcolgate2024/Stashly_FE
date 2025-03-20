
import { Chat } from "@/components/Chat";
import { Logo } from "@/components/Logo";
import { YahooMarketData } from "@/components/YahooMarketData";
import { useChat } from "@/hooks/useChat";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const {
    messages,
    isLoading,
    handleSendMessage,
    handleSuggestedQuestionClick,
    handleRetryLastMessage,
    clearMessages
  } = useChat();
  
  const isMobile = useIsMobile();

  return (
    <>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap" />
      
      <div className="h-full w-full flex flex-col overflow-hidden">
        <div
          className="h-full w-full flex flex-col overflow-hidden"
          style={{
            backgroundImage: "url('/images/Stashlylogobackgroundsmaller.webp'), url('/images/Stashlylogobackgroundsmaller.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat"
          }}
        >
          <div className="mx-auto w-full max-w-4xl backdrop-blur-sm bg-white/40 h-full flex flex-col px-6 overflow-hidden relative">
            {/* Market data banner at the top */}
            <div className="flex-shrink-0 sticky top-0 z-30 -mx-6">
              <YahooMarketData />
            </div>
            
            {/* Logo only shown if not on mobile AND messages exist */}
            {!isMobile && messages.length > 0 && <Logo />}
            
            {/* Chat section */}
            <div className="flex-1 content-area relative overflow-hidden">
              <div className="h-full pl-4 pr-4 sm:pr-12 pb-16">
                <Chat 
                  showControlsInHeader={true}
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
        </div>
      </div>
    </>
  );
};

export default Index;
