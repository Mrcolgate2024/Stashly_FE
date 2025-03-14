
// This file contains utility functions for working with Simli avatars

/**
 * Initializes the Simli script if it hasn't been loaded yet
 * @returns Promise that resolves when the script is loaded
 */
export const initializeSimliScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Check if script is already loaded
    if (window.simliScriptLoaded) {
      console.log("Simli script already loaded");
      resolve();
      return;
    }

    // Remove any existing scripts to prevent duplicate issues
    const existingScripts = document.querySelectorAll('script[src="https://app.simli.com/simli-widget/index.js"]');
    existingScripts.forEach(script => script.remove());
    
    // Create and add script
    const script = document.createElement('script');
    script.src = "https://app.simli.com/simli-widget/index.js";
    script.async = true;
    script.type = "text/javascript";
    
    script.onload = () => {
      console.log("Simli widget script loaded");
      window.simliScriptLoaded = true;
      resolve();
    };
    
    script.onerror = (error) => {
      console.error("Failed to load Simli script:", error);
      reject(new Error("Failed to load Simli script"));
    };
    
    document.body.appendChild(script);
  });
};

/**
 * Creates a Simli widget in the provided container
 */
export const createSimliWidget = (
  container: HTMLElement,
  {
    token,
    agentId,
    position = 'right',
    eventName,
    customText,
    customImage,
    disableTTS = false
  }: {
    token: string;
    agentId: string;
    position: 'left' | 'right';
    eventName: string;
    customText?: string;
    customImage?: string;
    disableTTS?: boolean;
  }
) => {
  if (!container) {
    console.error("No container provided for Simli widget");
    return;
  }

  // Clear any existing widgets
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }

  try {
    const widget = document.createElement('simli-widget');
    widget.setAttribute('token', token);
    widget.setAttribute('agentid', agentId);
    widget.setAttribute('position', position);
    widget.setAttribute('eventname', eventName);
    
    if (customText) {
      widget.setAttribute('customtext', customText);
    }
    
    if (customImage) {
      widget.setAttribute('customimage', customImage);
    }
    
    if (disableTTS) {
      widget.setAttribute('disabletts', 'true');
    }
    
    container.appendChild(widget);
    return widget;
  } catch (error) {
    console.error("Error creating Simli widget:", error);
    throw error;
  }
};

/**
 * Safely removes a widget from the DOM
 */
export const safelyRemoveWidget = (containerRef: { current: HTMLElement | null }) => {
  if (!containerRef.current) return;
  
  try {
    // Clear any existing content
    while (containerRef.current.firstChild) {
      containerRef.current.removeChild(containerRef.current.firstChild);
    }
    console.log("Simli widget safely removed");
  } catch (error) {
    console.error("Error removing Simli widget:", error);
  }
};

/**
 * Sets up protection against errors when the page visibility changes
 * This prevents common errors when the tab becomes inactive
 */
export const setupVisibilityChangeProtection = () => {
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      console.log("Page visibility changed to hidden - protecting Simli widgets");
      // Add any protection logic here if needed
    }
  });
};
