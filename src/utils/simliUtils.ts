
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
  if (!containerRef.current) return;
  
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
    
    return simliWidget;
  } catch (err) {
    console.error("Error creating Simli widget:", err);
    throw err;
  }
};
