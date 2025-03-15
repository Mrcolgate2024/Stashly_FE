
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'

// Ensure the DOM is ready before rendering
document.addEventListener('DOMContentLoaded', () => {
  // Create root first to ensure DOM is ready
  const root = createRoot(document.getElementById("root")!)

  // Render with BrowserRouter
  root.render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
});
