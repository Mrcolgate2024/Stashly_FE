
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Add the script before the app renders
const loadSimliScript = () => {
  // Check if script is already loaded
  if (!document.querySelector('script[src="https://app.simli.com/simli-widget/index.js"]')) {
    const script = document.createElement('script');
    script.src = "https://app.simli.com/simli-widget/index.js";
    script.async = true;
    script.type = "text/javascript";
    script.onload = () => {
      console.log("Simli widget script loaded globally");
      window.simliScriptLoaded = true;
    };
    document.body.appendChild(script);
  }
};

// Load the script first
loadSimliScript();

// Then render the app
createRoot(document.getElementById("root")!).render(<App />);
