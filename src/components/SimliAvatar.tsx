
import React, { useRef, useState, useEffect } from "react";
import { Button } from "./ui/button";
import axios from "axios";

interface SimliAvatarProps {
  onMessageReceived: (message: string) => void;
  token: string;
  agentId: string;
  customText?: string;
}

export const SimliAvatar: React.FC<SimliAvatarProps> = ({
  onMessageReceived,
  token: initialToken,
  agentId,
  customText = "Financial Analyst",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const customImageUrl = "/lovable-uploads/c54ad77b-c6fd-43b7-8063-5803ecec8c64.png";
  const [isActivated, setIsActivated] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isTokenRefreshing, setIsTokenRefreshing] = useState(false);

  // Function to generate a new token - in a real implementation, this would call your backend
  const generateNewToken = async () => {
    try {
      setIsTokenRefreshing(true);
      
      // In a real implementation, you would call your backend to get a fresh token
      // For now we'll just return a sample token to demonstrate the flow
      // This is a placeholder token and won't actually work with Simli API
      const demoToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzaW1saS1kZW1vLXRva2VuIiwiaWF0IjoxNjQ3MzU2Nzg5LCJleHAiOjE2Nzg4OTI3ODl9.lWpH7Y9g6aFP0TySByRLWjmDZvS_TCRcEzCiJqy45rY";
      
      console.log("Generated a new token for Financial Analyst avatar");
      return demoToken;
    } catch (error) {
      console.error("Error generating token:", error);
      throw error;
    } finally {
      setIsTokenRefreshing(false);
    }
  };

  useEffect(() => {
    // Listen for errors from Simli
    const handleError = (event: Event) => {
      if (event instanceof CustomEvent && event.detail) {
        const errorDetails = event.detail;
        console.error("Simli error detected:", errorDetails);
        
        // Check if it's a token error
        let message = "Unknown error";
        let isTokenError = false;
        
        if (errorDetails.error) message = errorDetails.error;
        if (errorDetails.message) message = errorDetails.message;
        if (typeof errorDetails === 'string') message = errorDetails;
        
        // Check if it's a token-related error
        if (message.includes("token") || message.includes("401") || message.includes("auth")) {
          isTokenError = true;
          message = "Your session has expired. Please try again.";
        }
        
        setErrorMessage(message);
        setHasError(true);
        
        // If it's a token error, deactivate so user can retry
        if (isTokenError) {
          setIsActivated(false);
        }
      }
    };
    
    window.addEventListener('simli:error' as any, handleError as EventListener);
    // Also listen for financial specific errors
    window.addEventListener('simli:financial:error' as any, handleError as EventListener);
    
    return () => {
      window.removeEventListener('simli:error' as any, handleError as EventListener);
      window.removeEventListener('simli:financial:error' as any, handleError as EventListener);
    };
  }, []);

  const initializeSimli = async () => {
    if (isActivated) return; // Already initialized
    setHasError(false); // Reset error state on retry
    setErrorMessage(""); // Clear any previous error messages
    
    try {
      console.log("Initializing Financial Analyst avatar...");
      setIsActivated(true);

      // Get a fresh token - in a real app this would call your backend
      const freshToken = await generateNewToken();

      // Create a custom event listener for Simli messages
      const handleSimliMessage = (event: CustomEvent) => {
        if (event.detail && event.detail.message) {
          onMessageReceived(event.detail.message);
        }
      };

      // Add custom event listener for Simli messages
      window.addEventListener('simli:financial:message' as any, handleSimliMessage as EventListener);

      // Only add the script if it's not already present
      if (!document.querySelector('script[src="https://app.simli.com/simli-widget/index.js"]')) {
        const script = document.createElement('script');
        script.src = "https://app.simli.com/simli-widget/index.js";
        script.async = true;
        script.type = "text/javascript";
        document.body.appendChild(script);
        
        // Listen for script load errors
        script.onerror = () => {
          console.error("Failed to load Simli script");
          setErrorMessage("Failed to load Simli widget");
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
            
            simliWidget.setAttribute('token', freshToken);
            simliWidget.setAttribute('agentid', agentId);
            simliWidget.setAttribute('position', 'right');
            simliWidget.setAttribute('customimage', customImageUrl);
            simliWidget.setAttribute('customtext', customText);
            
            // Set a custom event name for this specific avatar
            simliWidget.setAttribute('eventname', 'simli:financial:message');
            
            // Add error listener to the widget
            simliWidget.addEventListener('error', (e) => {
              console.error("Widget error:", e);
              setHasError(true);
            });
            
            // Append the widget to the container
            containerRef.current.appendChild(simliWidget);
            console.log("Financial Analyst avatar widget added to DOM");
          } catch (err) {
            console.error("Error initializing Simli widget:", err);
            setErrorMessage("Error initializing avatar");
            setHasError(true);
            setIsActivated(false);
          }
        }
      }, 500); // Short delay to ensure DOM is ready
    } catch (error) {
      console.error("Error in initialization:", error);
      setErrorMessage("Failed to connect to avatar service");
      setHasError(true);
      setIsActivated(false);
    }
  };

  return (
    <div className="fixed bottom-[80px] right-4 sm:bottom-10 sm:right-10 z-10">
      {!isActivated ? (
        <Button 
          onClick={initializeSimli}
          className="bg-blue-500 text-white rounded-full p-3 shadow-lg hover:bg-blue-600 transition-colors"
          disabled={isTokenRefreshing}
        >
          {isTokenRefreshing ? (
            <div className="w-12 h-12 flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : (
            <div className="w-12 h-12 flex items-center justify-center">
              <img 
                src={customImageUrl} 
                alt={customText} 
                className="w-10 h-10 rounded-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://via.placeholder.com/40";
                }}
              />
            </div>
          )}
        </Button>
      ) : (
        <div className="relative">
          {hasError && (
            <div className="absolute -top-16 right-0 bg-white p-2 rounded-md shadow-md text-sm max-w-[200px]">
              <p className="text-red-500 mb-1">{errorMessage || "Error connecting to avatar"}</p>
              <Button 
                onClick={() => {
                  setIsActivated(false);
                  setTimeout(initializeSimli, 100);
                }}
                className="bg-red-500 hover:bg-red-600 text-white text-xs py-1 px-2 rounded w-full"
                disabled={isTokenRefreshing}
              >
                Retry with new token
              </Button>
            </div>
          )}
          <div ref={containerRef} className="min-h-[60px] min-w-[60px] bg-gray-100/30 rounded-full">
            {/* Simli widget will be inserted here programmatically */}
          </div>
        </div>
      )}
    </div>
  );
};
