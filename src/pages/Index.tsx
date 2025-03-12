
import { Chat } from "@/components/Chat";
import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

// Global variable to track script loading state across component remounts
declare global {
  interface Window {
    simliScriptLoaded?: boolean;
    simliAvatarActive?: boolean;
  }
}

const Index = () => {
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    // Check if we've already loaded the script in this session
    if (window.simliScriptLoaded) {
      setScriptLoaded(true);
      return;
    }

    // Remove any existing Simli scripts to prevent duplicate issues
    const existingScripts = document.querySelectorAll('script[src="https://app.simli.com/simli-widget/index.js"]');
    existingScripts.forEach(script => script.remove());

    // Load Simli widget script if it hasn't been loaded yet
    const script = document.createElement('script');
    script.src = "https://app.simli.com/simli-widget/index.js";
    script.async = true;
    script.type = "text/javascript";
    
    script.onload = () => {
      console.log("Simli widget script loaded");
      window.simliScriptLoaded = true;
      setScriptLoaded(true);

      // Add a global error handler for any DailyJS errors
      window.addEventListener('error', (event) => {
        if (event.message && (
            event.message.includes('DailyIframe') || 
            event.message.includes('daily-js') ||
            event.message.includes('duplicate')
          )) {
          console.warn("Caught DailyIframe error:", event.message);
          event.preventDefault();
          
          // Reset the avatar state if there's a duplicate instance error
          if (event.message.includes('Duplicate DailyIframe')) {
            window.simliAvatarActive = false;
          }
          
          return true;
        }
        return false;
      });
    };
    
    document.body.appendChild(script);
    
    return () => {
      // Don't remove the script on unmount to prevent reloading issues
    };
  }, []);

  return (
    <>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap" />
      <div className="min-h-screen w-full bg-[#1e2a38]">
        <div className="mx-auto max-w-4xl backdrop-blur-sm bg-white/40 min-h-screen p-6">
          <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/financial-analyst">
              <Button className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600">
                Financial Analyst Avatar
              </Button>
            </Link>
            <Link to="/market-analyst">
              <Button className="w-full sm:w-auto bg-green-500 hover:bg-green-600">
                Market Analyst Avatar
              </Button>
            </Link>
          </div>
          <Chat />
        </div>
      </div>
      <Toaster />
    </>
  );
};

export default Index;
