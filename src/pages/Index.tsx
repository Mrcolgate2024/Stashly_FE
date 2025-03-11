
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
        toast({
          title: "Error Loading Avatars",
          description: "We're having trouble loading the analysts. Please refresh the page.",
          variant: "destructive",
        });
        return;
      }
      
      scriptLoadAttempts.current += 1;
      
      if (!document.querySelector('script[src="https://app.simli.com/simli-widget/index.js"]')) {
        console.log("Loading Simli script");
        const script = document.createElement('script');
        script.src = "https://app.simli.com/simli-widget/index.js";
        script.async = true;
        script.type = "text/javascript";
        
        script.onload = () => {
          console.log("Simli script loaded successfully");
          scriptLoadedRef.current = true;
          toast({
            title: "Analyst Avatars",
            description: "Click on either analyst avatar to start a conversation.",
          });
        };
        
        script.onerror = (error) => {
          console.error("Error loading Simli script:", error);
          scriptLoadedRef.current = false;
          toast({
            title: "Avatar Error",
            description: "Failed to load analyst avatars. Please refresh the page.",
            variant: "destructive",
          });
        };
        
        document.body.appendChild(script);
      } else {
        console.log("Simli script already exists in the document");
        
        // Check if it's actually working
        if (!window.customElements || !window.customElements.get('simli-widget')) {
          console.log("Simli script exists but custom element is not defined. Removing and reloading script.");
          
          // Remove the existing script
          const existingScript = document.querySelector('script[src="https://app.simli.com/simli-widget/index.js"]');
          if (existingScript && existingScript.parentNode) {
            try {
              existingScript.parentNode.removeChild(existingScript);
              // Try loading again after a short delay
              setTimeout(loadSimliScript, 500);
            } catch (error) {
              console.error("Error removing existing Simli script:", error);
            }
          }
        } else {
          scriptLoadedRef.current = true;
        }
      }
    };

    // Load Simli script immediately
    loadSimliScript();
    
    // Also check every 3 seconds if script is still there (some frameworks might remove it)
    const intervalId = setInterval(() => {
      if (!document.querySelector('script[src="https://app.simli.com/simli-widget/index.js"]') || 
          !window.customElements || 
          !window.customElements.get('simli-widget')) {
        console.log("Simli script was removed or is not working, reloading it");
        scriptLoadedRef.current = false;
        loadSimliScript();
      }
    }, 3000);

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
