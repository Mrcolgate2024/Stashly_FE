
import { Chat } from "@/components/Chat";
import { useEffect } from "react";

const Index = () => {
  useEffect(() => {
    // Load Simli widget script if it hasn't been loaded yet
    if (!document.querySelector('script[src="https://app.simli.com/simli-widget/index.js"]')) {
      const script = document.createElement('script');
      script.src = "https://app.simli.com/simli-widget/index.js";
      script.async = true;
      script.type = "text/javascript";
      document.body.appendChild(script);
    }
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
