
import { toast } from "sonner";

// Track script loading state
let scriptLoading = false;
let scriptLoaded = false;
let widgetInstances: Record<string, HTMLElement> = {};

// Load the Simli script once for the entire app
export const loadSimliScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // If already loaded, resolve immediately
    if (scriptLoaded) {
      console.log("Simli script already loaded");
      resolve();
      return;
    }
    
    // If currently loading, wait
    if (scriptLoading) {
      console.log("Simli script is currently loading");
      const checkLoaded = setInterval(() => {
        if (scriptLoaded) {
          clearInterval(checkLoaded);
          resolve();
        }
      }, 100);
      return;
    }
    
    // Start loading
    scriptLoading = true;
    console.log("Loading Simli script");
    
    const existingScript = document.getElementById('simli-widget-script');
    if (existingScript) {
      console.log("Found existing script element");
      scriptLoaded = true;
      scriptLoading = false;
      resolve();
      return;
    }
    
    const script = document.createElement('script');
    script.src = "https://app.simli.com/simli-widget/index.js";
    script.async = true;
    script.type = "text/javascript";
    script.id = "simli-widget-script";
    
    script.onload = () => {
      console.log("Simli script loaded successfully");
      scriptLoaded = true;
      scriptLoading = false;
      resolve();
    };
    
    script.onerror = (error) => {
      console.error("Error loading Simli script:", error);
      scriptLoading = false;
      toast.error("Failed to load avatar script");
      reject(error);
    };
    
    document.body.appendChild(script);
  });
};

// Helper to create and initialize a Simli widget
export const createSimliWidget = async (
  containerId: string, 
  instanceId: string,
  token: string,
  agentId: string,
  customText: string,
  customImage?: string,
  onMessage?: (message: string) => void
): Promise<() => void> => {
  console.log(`Creating Simli widget: ${instanceId}`);
  
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Container not found: ${containerId}`);
    return () => {};
  }
  
  try {
    // Load script first
    await loadSimliScript();
    
    // Clear existing content
    container.innerHTML = '';
    
    // Create new widget element
    const simliWidget = document.createElement('simli-widget');
    simliWidget.setAttribute('token', token);
    simliWidget.setAttribute('agentid', agentId);
    simliWidget.setAttribute('position', 'relative');
    simliWidget.setAttribute('customtext', customText);
    simliWidget.setAttribute('data-instance-id', instanceId);
    
    if (customImage) {
      simliWidget.setAttribute('customimage', customImage);
    }
    
    // Append to container
    container.appendChild(simliWidget);
    
    // Store reference
    widgetInstances[instanceId] = simliWidget;
    
    console.log(`Widget ${instanceId} created successfully`);
    
    // Set up message handler if provided
    let messageHandler: EventListener | null = null;
    
    if (onMessage) {
      messageHandler = ((event: Event) => {
        const customEvent = event as CustomEvent;
        if (customEvent.detail && customEvent.detail.message) {
          const targetElement = customEvent.target as HTMLElement;
          const elementId = targetElement.getAttribute('data-instance-id');
          
          if (elementId === instanceId) {
            console.log(`Message from ${instanceId}:`, customEvent.detail.message);
            onMessage(customEvent.detail.message);
          }
        }
      }) as EventListener;
      
      window.addEventListener('simli:message', messageHandler);
    }
    
    // Return cleanup function
    return () => {
      console.log(`Cleaning up widget: ${instanceId}`);
      if (messageHandler) {
        window.removeEventListener('simli:message', messageHandler);
      }
      
      if (container) {
        container.innerHTML = '';
      }
      
      if (widgetInstances[instanceId]) {
        delete widgetInstances[instanceId];
      }
    };
  } catch (error) {
    console.error(`Error creating widget ${instanceId}:`, error);
    toast.error(`Failed to initialize ${customText}`);
    return () => {};
  }
};
