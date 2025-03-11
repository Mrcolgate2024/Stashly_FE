
import { Chat } from "@/components/Chat";
import { useEffect } from "react";

const Index = () => {
  useEffect(() => {
    // Ensure the Simli script is loaded
    const loadSimliScript = () => {
      const scriptSrc = "https://app.simli.com/simli-widget/index.js";
      if (!document.querySelector(`script[src="${scriptSrc}"]`)) {
        const script = document.createElement('script');
        script.src = scriptSrc;
        script.async = true;
        script.type = "text/javascript";
        document.body.appendChild(script);
        console.log("Simli script added to page");
        
        // Make sure it's fully loaded
        script.onload = () => {
          console.log("Simli script loaded successfully");
          // Force a refresh of any existing widgets
          const event = new CustomEvent('simli-script-loaded');
          document.dispatchEvent(event);
        };
      }
    };
    
    // Initial load
    loadSimliScript();
    
    // Also set up an interval to check if the script is still available
    // (sometimes scripts can be removed from the DOM)
    const intervalId = setInterval(() => {
      if (!document.querySelector(`script[src="https://app.simli.com/simli-widget/index.js"]`)) {
        console.log("Simli script missing, reloading it");
        loadSimliScript();
      }
    }, 5000);
    
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap" />
      <div 
        className="min-h-screen w-full bg-[#1e2a38]"
      >
        <div className="mx-auto max-w-4xl backdrop-blur-sm bg-white/40 min-h-screen">
          <Chat />
        </div>
      </div>
    </>
  );
};

export default Index;
