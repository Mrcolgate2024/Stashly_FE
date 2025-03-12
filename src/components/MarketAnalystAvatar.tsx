
import React, { useRef, useState, useEffect } from "react";
import { Button } from "./ui/button";

interface MarketAnalystAvatarProps {
  onMessageReceived: (message: string) => void;
  token: string;
  agentId: string;
  customText?: string;
}

export const MarketAnalystAvatar: React.FC<MarketAnalystAvatarProps> = ({
  onMessageReceived,
  token,
  agentId,
  customText = "Market Analyst",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isActivated, setIsActivated] = useState(false);
  const [hasError, setHasError] = useState(false);
  
  useEffect(() => {
    // Listen for errors from Simli
    const handleError = (event: Event) => {
      if (event instanceof CustomEvent && event.detail && 
         (event.detail.error || event.detail.message?.includes('error'))) {
        console.error("Simli error detected:", event.detail);
        setHasError(true);
      }
    };
    
    window.addEventListener('simli:error' as any, handleError as EventListener);
    
    return () => {
      window.removeEventListener('simli:error' as any, handleError as EventListener);
    };
  }, []);
  
  const initializeSimli = () => {
    if (isActivated) return; // Already initialized
    setHasError(false); // Reset error state on retry
    console.log("Initializing Market Analyst avatar...");
    setIsActivated(true);

    // Create a custom event listener for Simli messages
    const handleSimliMessage = (event: CustomEvent) => {
      if (event.detail && event.detail.message) {
        onMessageReceived(event.detail.message);
      }
    };

    // Add custom event listener for Simli messages
    window.addEventListener('simli:market:message' as any, handleSimliMessage as EventListener);

    // We'll only add the script when initializing for the first time
    if (!document.querySelector('script[src="https://app.simli.com/simli-widget/index.js"]')) {
      const script = document.createElement('script');
      script.src = "https://app.simli.com/simli-widget/index.js";
      script.async = true;
      script.type = "text/javascript";
      document.body.appendChild(script);
      
      // Listen for script load errors
      script.onerror = () => {
        console.error("Failed to load Simli script");
        setHasError(true);
        setIsActivated(false);
      };
    }

    // Create and append the Simli widget to our container
    setTimeout(() => {
      if (containerRef.current) {
        try {
          // Clear any existing content
          containerRef.current.innerHTML = '';
          
          // Create the widget element
          const simliWidget = document.createElement('simli-widget');
          // Use the updated token
          simliWidget.setAttribute('token', "gAAAAABn0TcMqd4UKDdYzx8H7ApwZ4GVn-1kN1sTkzjoSPwvhBH-iHc8tcPJWXQ-ochA-dAX6tUMfhHxxuHcVZkuHkFvFPoNmGfoi8HEI7Nj0JXUUeT0ONH4ng2H23UFe4RFvURmefQh-N8jd997YIORJGnhrAVeJPm0F1WrBtN4-CKGc0LJ6v2sc-mg3KytY_F_dbBfhYYAc7FeLuWjB4CU0w-HGG1Eq1aOgVOBGICmeNK61hBXDIx9fTS6mH-_2ibb0x8wi98ZitWz48RGEfJfTUIff8z_EuulXfQvYP_Wiw7zrCXbp4uMp2QO9EKJ2AnCtMzvGKOzTfJwdysMvgc28hQyZeTrVRirdFxUNOZX9d0cyGdbB-Fsm03CiQ9A_-0mR9f0s5Ag3FesfxbzGM6Co2RqsjNizQEY548iPkw31lVrX_XB4a0e0XvsHa3r1gDApUk7ZOL3nFJ7KFE4YwbekHTuaa4qnG_OKWrlCLJ4KiQs6LMYbnde4d_XzjTxXPLvcBcC1f6V");
          simliWidget.setAttribute('agentid', agentId);
          simliWidget.setAttribute('position', 'left'); // Position on the left
          simliWidget.setAttribute('customtext', customText);
          
          // Set a custom event name for this specific avatar
          simliWidget.setAttribute('eventname', 'simli:market:message');
          
          // Add error listener to the widget
          simliWidget.addEventListener('error', (e) => {
            console.error("Widget error:", e);
            setHasError(true);
          });
          
          // Append the widget to the container
          containerRef.current.appendChild(simliWidget);
          console.log("Market Analyst avatar widget added to DOM");
        } catch (err) {
          console.error("Error initializing Simli widget:", err);
          setHasError(true);
          setIsActivated(false);
        }
      }
    }, 500); // Short delay to ensure DOM is ready
  };

  return (
    <div className="fixed bottom-[80px] left-4 sm:bottom-10 sm:left-10 z-10">
      {!isActivated ? (
        <Button 
          onClick={initializeSimli}
          className="bg-green-500 text-white rounded-full p-3 shadow-lg hover:bg-green-600 transition-colors"
        >
          <div className="w-12 h-12 flex items-center justify-center">
            <span className="text-xl font-bold">MA</span>
          </div>
        </Button>
      ) : (
        <div className="relative">
          {hasError && (
            <Button 
              onClick={() => {
                setIsActivated(false);
                setTimeout(initializeSimli, 100);
              }}
              className="absolute -top-10 left-0 bg-red-500 hover:bg-red-600 text-white text-xs py-1 px-2 rounded"
            >
              Retry
            </Button>
          )}
          <div ref={containerRef} className="min-h-[60px] min-w-[60px] bg-gray-100/30 rounded-full">
            {/* Simli widget will be inserted here programmatically */}
          </div>
        </div>
      )}
    </div>
  );
};
