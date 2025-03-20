
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
          className="h-full w-full flex flex-col"
          style={{
            backgroundImage: "url('/images/Stashlylogobackgroundsmaller.webp'), url('/images/Stashlylogobackgroundsmaller.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat"
          }}
        >
          <div className="mx-auto w-full max-w-4xl backdrop-blur-sm bg-white/40 h-full flex flex-col px-6">
            {/* Market data banner at the top */}
            <div className="flex-shrink-0 sticky top-0 z-30 -mx-6">
              <YahooMarketData />
            </div>
            
            {/* Logo only shown if not on mobile */}
            {!isMobile && <Logo />}
            
            {/* Mobile logo positioning */}
            {isMobile && (
              <div className="relative flex justify-center my-4">
                <div className="rounded-full bg-[#1e2a38] p-1 shadow-md border-2 border-[#d4af37]">
                  <picture>
                    <source srcSet="/images/Stashlylogotype.webp" type="image/webp" />
                    <img 
                      src="/images/Stashlylogotype.png" 
                      alt="$tashly Logo" 
                      className="h-16 w-16 object-contain rounded-full"
                    />
                  </picture>
                </div>
                <div className="absolute -right-2 top-14">
                  <div className="font-space-grotesk text-[#1e2a38] font-extrabold text-2xl tracking-wider drop-shadow-md">
                    <span className="text-[#1e2a38] font-black">$</span>TASHLY
                  </div>
                </div>
              </div>
            )}
            
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

