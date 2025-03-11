
import { Chat } from "@/components/Chat";
import { useEffect, useRef, useState } from "react";
import { toast } from "@/hooks/use-toast";

const Index = () => {
  const scriptRef = useRef<HTMLScriptElement | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const scriptAttempts = useRef(0);

  // Function to safely load the Simli script
  const loadSimliScript = () => {
    // Don't try more than 3 times
    if (scriptAttempts.current >= 3) {
      console.error("Failed to load Simli script after multiple attempts");
      toast({
        title: "Loading Error",
        description: "Failed to load avatar service. Please refresh the page.",
        variant: "destructive",
      });
      return;
    }

    scriptAttempts.current++;
    console.log(`Attempting to load Simli script (attempt ${scriptAttempts.current})`);

    // Check if script already exists
    const existingScript = document.querySelector('script[src="https://app.simli.com/simli-widget/index.js"]');
    if (existingScript) {
      console.log("Simli script already exists in the document");
      setScriptLoaded(true);
      return;
    }

    // Create a new script element
    const script = document.createElement('script');
    script.src = "https://app.simli.com/simli-widget/index.js";
    script.async = true;
    script.type = "text/javascript";
    
    // Set up event handlers
    script.onload = () => {
      console.log("Simli script loaded successfully");
      setScriptLoaded(true);
      scriptRef.current = script;
    };
    
    script.onerror = (error) => {
      console.error("Error loading Simli script:", error);
      // Remove the failed script
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      // Try again after a delay
      setTimeout(loadSimliScript, 1500);
    };
    
    // Append to body
    document.body.appendChild(script);
  };

  useEffect(() => {
    // Try to load the script
    loadSimliScript();

    // Cleanup function
    return () => {
      // Only remove the script if we created it
      if (scriptRef.current && document.body.contains(scriptRef.current)) {
        document.body.removeChild(scriptRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#1e2a38]">
      <div className="mx-auto max-w-4xl backdrop-blur-sm bg-white/40 min-h-screen">
        <Chat scriptLoaded={scriptLoaded} />
      </div>
    </div>
  );
};

export default Index;
