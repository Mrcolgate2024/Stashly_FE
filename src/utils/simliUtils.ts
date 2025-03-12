
export const initializeSimliScript = () => {
  // Only add the script if it's not already present
  if (!document.querySelector('script[src="https://app.simli.com/simli-widget/index.js"]')) {
    const script = document.createElement('script');
    script.src = "https://app.simli.com/simli-widget/index.js";
    script.async = true;
    script.type = "text/javascript";
    document.body.appendChild(script);
    
    return new Promise<void>((resolve, reject) => {
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Failed to load Simli script"));
    });
  }
  
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
  if (!containerRef.current) return null;
  
  try {
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
    
    // Append the widget to the container
    containerRef.current.appendChild(simliWidget);
    
    // Set a listener to handle TTS API Key errors better
    const handleApiError = (event: Event) => {
      if (event instanceof CustomEvent && event.detail) {
        const errorDetails = event.detail;
        if (
          (typeof errorDetails === 'string' && errorDetails.includes("TTS API Key")) ||
          (errorDetails.detail && errorDetails.detail.includes("TTS API Key"))
        ) {
          console.warn("TTS API Key error detected, this may be expected behavior:", errorDetails);
          // We don't want to propagate this as a critical error, just log it
          event.stopPropagation();
        }
      }
    };
    
    window.addEventListener(`${eventName}:error`, handleApiError as EventListener);
    
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
      // Remove any existing widget to prevent leave() errors
      const existingWidget = containerRef.current.querySelector('simli-widget');
      if (existingWidget) {
        // Try to gracefully disconnect before removal
        try {
          // Set a flag to prevent leave() call during disconnectedCallback
          (existingWidget as any)._isManuallyRemoved = true;
        } catch (e) {
          console.log("Could not set manual removal flag", e);
        }
        
        // First try removing the child element
        try {
          containerRef.current.removeChild(existingWidget);
        } catch (e) {
          console.log("Failed with removeChild, using innerHTML instead", e);
          containerRef.current.innerHTML = '';
        }
      }
    } catch (err) {
      console.error("Error safely removing widget:", err);
      // Last resort, clear the container
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    }
  }
};

// Add this function to handle the scenario when the document visibility changes
export const setupVisibilityChangeProtection = () => {
  const originalVisibilityChangeHandler = document.onvisibilitychange;
  
  document.onvisibilitychange = (event) => {
    // Call the original handler if it exists
    if (typeof originalVisibilityChangeHandler === 'function') {
      originalVisibilityChangeHandler.call(document, event);
    }
    
    // Protection against "Cannot read properties of null (reading 'leave')" error
    try {
      const widgets = document.querySelectorAll('simli-widget');
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
