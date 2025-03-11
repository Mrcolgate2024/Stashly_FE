
import { Chat } from "@/components/Chat";
import { useEffect, useRef } from "react";
import { toast } from "@/hooks/use-toast";

const Index = () => {
  const scriptLoadAttempts = useRef(0);
  const scriptLoadedRef = useRef(false);

  useEffect(() => {
    // Function to load Simli script
    const loadSimliScript = () => {
      if (scriptLoadAttempts.current > 5) {
        console.error("Too many script loading attempts, giving up");
        return;
      }
      
      scriptLoadAttempts.current += 1;
      
      const existingScript = document.querySelector('script[src="https://app.simli.com/simli-widget/index.js"]');
      if (!existingScript) {
        console.log("Loading Simli script");
        const script = document.createElement('script');
        script.src = "https://app.simli.com/simli-widget/index.js";
        script.async = true;
        script.type = "text/javascript";
        
        script.onload = () => {
          console.log("Simli script loaded successfully");
          scriptLoadedRef.current = true;
        };
        
        script.onerror = (error) => {
          console.error("Error loading Simli script:", error);
          scriptLoadedRef.current = false;
        };
        
        document.body.appendChild(script);
      }
    };

    loadSimliScript();

    return () => {
      const script = document.querySelector('script[src="https://app.simli.com/simli-widget/index.js"]');
      if (script && script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#1e2a38]">
      <div className="mx-auto max-w-4xl backdrop-blur-sm bg-white/40 min-h-screen">
        <Chat />
      </div>
    </div>
  );
};

export default Index;
