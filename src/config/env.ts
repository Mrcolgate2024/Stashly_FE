
// Environment configuration
export const env = {
  // Alpha Vantage API key - Get yours at https://www.alphavantage.co/support/#api-key
  ALPHA_VANTAGE_API_KEY: import.meta.env.VITE_ALPHA_VANTAGE_API_KEY || "",
  
  // Simli Avatar token
  SIMLI_AVATAR_TOKEN: import.meta.env.VITE_SIMLI_AVATAR_TOKEN || "gAAAAABn6jONT4yTT2C6rCGuWKzhN0gQJ-Vr3N2VK1h8aOy_G0bZ3s2GDJUyVhydj8IC-EdZRue60dniKe85s7scjscShsfwVbEvXMFVXDbPUSKjRw11lHs7BJfb4TXHWfgGnW6snFOmKqjp_h394hPoMgC9K2ZXtMqO5wT9ZWdnRkEmbnJOUU518z5sgRF83MRmsntMQqGRGFleXsBI9oXUQut6gtdDy879L0Mbrf9fSeDydZQQQ3e2BqQL0Djs_42wf24yWgEMo3ntuoVyHpHE9oZ0PdPmWCsyvdkfXkG2OJF0KI7KaS7B54vFQeBGYnGfe7KrMZle9wjbRjJOrSFHvLlwQs9FYF9rfgZxo809lNNFL5WT1G1MMaJsmWKXhbGHCI6trkPF9fpQrsmmR3k5JZseLprWyA==",
  
  // Simli API key
  SIMLI_API_KEY: import.meta.env.VITE_SIMLI_API_KEY || "sy105wgoenddakbuzsr97",
  
  // API URL for backend
  API_URL: import.meta.env.VITE_API_URL || "https://stashlybackendapp.azurewebsites.net",
};

// Debug environment configuration in development
if (import.meta.env.DEV) {
  console.log('Environment configuration loaded:', {
    ALPHA_VANTAGE_API_KEY: env.ALPHA_VANTAGE_API_KEY ? 'Set ✓' : 'Not set ✗',
    SIMLI_AVATAR_TOKEN: env.SIMLI_AVATAR_TOKEN ? 'Set ✓' : 'Not set ✗',
    SIMLI_API_KEY: env.SIMLI_API_KEY ? 'Set ✓' : 'Not set ✗',
    API_URL: env.API_URL ? 'Set ✓' : 'Not set ✗'
  });
}
