
export const initializeSimliScript = () => {
  // Only add the script if it's not already present
  if (!document.querySelector('script[src="https://app.simli.com/simli-widget/index.js"]')) {
    console.log("Creating Simli script tag");
    const script = document.createElement('script');
    script.src = "https://app.simli.com/simli-widget/index.js";
    script.async = true;
    script.type = "text/javascript";
    document.body.appendChild(script);
    
    return new Promise<void>((resolve, reject) => {
      script.onload = () => {
        console.log("Simli script loaded successfully");
        resolve();
      };
      script.onerror = () => {
        console.error("Failed to load Simli script");
        reject(new Error("Failed to load Simli script"));
      };
    });
  }
  
  console.log("Simli script already exists");
  return Promise.resolve();
};

export const createSimliWidget = (
  containerRef: React.RefObject<HTMLDivElement>,
  token: string,
  agentId: string,
  position: 'left' | 'right',
  eventName: string,
  customText?: string,
  customImage?: string
) => {
  if (!containerRef.current) {
    console.error("Container ref is null, cannot create widget");
    return null;
  }
  
  if (!token || token.trim() === '') {
    console.error("Token is empty or invalid");
    // Dispatch a custom error event
    const errorEvent = new CustomEvent(eventName + ':error', { 
      detail: { message: "unauthorized" } 
    });
    window.dispatchEvent(errorEvent);
    return null;
  }
  
  try {
    // First ensure we clean up properly
    safelyRemoveWidget(containerRef);
    
    console.log(`Creating Simli widget for ${customText || "avatar"} with agentId: ${agentId}`);
    
    // Clear any existing content
    containerRef.current.innerHTML = '';
    
    // Create the widget element
    const simliWidget = document.createElement('simli-widget');
    
    simliWidget.setAttribute('token', token);
    simliWidget.setAttribute('agentid', agentId);
    simliWidget.setAttribute('position', position);
    simliWidget.setAttribute('eventname', eventName);
    
    if (customText) {
      simliWidget.setAttribute('customtext', customText);
    }
    
    if (customImage) {
      simliWidget.setAttribute('customimage', customImage);
    }
    
    // Setup error listeners
    const checkErrors = () => {
      setTimeout(() => {
        const shadowRoot = simliWidget.shadowRoot;
        if (shadowRoot) {
          // Check for error elements
          const errorElements = shadowRoot.querySelectorAll('.error-message');
          for (const errorEl of Array.from(errorElements)) {
            const errorText = errorEl.textContent || '';
            processErrorMessage(errorText, eventName);
          }
          
          // Check console outputs within shadow DOM
          const consoleOutputs = shadowRoot.querySelectorAll('.console-output');
          for (const consoleEl of Array.from(consoleOutputs)) {
            const consoleText = consoleEl.textContent || '';
            if (consoleText.includes('TTS API Key') || consoleText.includes('Invalid TTS')) {
              const errorEvent = new CustomEvent(eventName + ':error', { 
                detail: { message: "Invalid TTS API Key" } 
              });
              window.dispatchEvent(errorEvent);
            }
          }
        }
      }, 1000); // Check after 1 second
    };
    
    // Helper to process error messages and dispatch events
    const processErrorMessage = (errorText: string, eventName: string) => {
      if (errorText.toLowerCase().includes('unauthorized') || 
          errorText.toLowerCase().includes('authentication') ||
          errorText.toLowerCase().includes('permission')) {
        console.error('Authentication error detected in widget:', errorText);
        const errorEvent = new CustomEvent(eventName + ':error', { 
          detail: { message: "unauthorized" } 
        });
        window.dispatchEvent(errorEvent);
      }
      
      if (errorText.toLowerCase().includes('tts api key') || 
          errorText.toLowerCase().includes('invalid tts')) {
        console.error('TTS API Key error detected in widget:', errorText);
        const errorEvent = new CustomEvent(eventName + ':error', { 
          detail: { message: "Invalid TTS API Key" } 
        });
        window.dispatchEvent(errorEvent);
      }
    };
    
    simliWidget.addEventListener('error', (e) => {
      console.log('Error event from widget:', e);
      checkErrors();
    });
    
    // Listen for console errors that might indicate TTS API issues
    const originalConsoleError = console.error;
    const errorHandler = (...args: any[]) => {
      originalConsoleError.apply(console, args);
      const errorString = args.join(' ');
      if (errorString.includes('TTS API Key') || errorString.includes('Invalid TTS')) {
        const errorEvent = new CustomEvent(eventName + ':error', { 
          detail: { message: "Invalid TTS API Key" } 
        });
        window.dispatchEvent(errorEvent);
      }
    };
    
    console.error = errorHandler;
    
    // Append the widget to the container
    containerRef.current.appendChild(simliWidget);
    console.log(`Simli widget created and appended to DOM for ${customText || "avatar"}`);
    
    // Check for errors after a delay
    checkErrors();
    
    // Reset console.error after a delay to avoid affecting other components
    setTimeout(() => {
      console.error = originalConsoleError;
    }, 5000);
    
    return simliWidget;
  } catch (err) {
    console.error("Error creating Simli widget:", err);
    return null;
  }
};

// Helper function to safely remove widget
export const safelyRemoveWidget = (containerRef: React.RefObject<HTMLDivElement>) => {
  if (containerRef.current) {
    try {
      console.log("Safely removing existing widget");
      // Remove any existing widget to prevent leave() errors
      const existingWidget = containerRef.current.querySelector('simli-widget');
      if (existingWidget) {
        console.log("Found existing widget, attempting to remove");
        // Try to gracefully disconnect before removal
        try {
          // Set a flag to prevent leave() call during disconnectedCallback
          (existingWidget as any)._isManuallyRemoved = true;
          console.log("Set manual removal flag");
        } catch (e) {
          console.log("Could not set manual removal flag", e);
        }
        
        // First try removing the child element
        try {
          containerRef.current.removeChild(existingWidget);
          console.log("Successfully removed widget with removeChild");
        } catch (e) {
          console.log("Failed with removeChild, using innerHTML instead", e);
          containerRef.current.innerHTML = '';
        }
      } else {
        console.log("No existing widget found to remove");
      }
    } catch (err) {
      console.error("Error safely removing widget:", err);
      // Last resort, clear the container
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    }
  } else {
    console.warn("Container ref is null in safelyRemoveWidget");
  }
};

// Add this function to handle the scenario when the document visibility changes
export const setupVisibilityChangeProtection = () => {
  console.log("Setting up visibility change protection");
  const originalVisibilityChangeHandler = document.onvisibilitychange;
  
  document.onvisibilitychange = (event) => {
    // Call the original handler if it exists
    if (typeof originalVisibilityChangeHandler === 'function') {
      originalVisibilityChangeHandler.call(document, event);
    }
    
    // Protection against "Cannot read properties of null (reading 'leave')" error
    try {
      const widgets = document.querySelectorAll('simli-widget');
      console.log(`Found ${widgets.length} widgets during visibility change`);
      widgets.forEach(widget => {
        if (widget.shadowRoot) {
          const shadowElements = widget.shadowRoot.querySelectorAll('*');
          shadowElements.forEach(element => {
            // Add a safety check for any leave methods
            if (element && (element as any).leave && typeof (element as any).leave === 'function') {
              const originalLeave = (element as any).leave;
              (element as any).leave = function(...args: any[]) {
                try {
                  return originalLeave.apply(this, args);
                } catch (error) {
                  console.warn('Protected against leave() error:', error);
                  return null;
                }
              };
            }
          });
        }
      });
    } catch (error) {
      console.warn('Error in visibility change protection:', error);
    }
  };
};
