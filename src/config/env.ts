
// Environment configuration
export const env = {
  // Alpha Vantage API key - Get yours at https://www.alphavantage.co/support/#api-key
  ALPHA_VANTAGE_API_KEY: import.meta.env.VITE_ALPHA_VANTAGE_API_KEY || "",
  
  // Simli Avatar token
  SIMLI_AVATAR_TOKEN: import.meta.env.VITE_SIMLI_AVATAR_TOKEN || "",
};

// Debug environment configuration in development
if (import.meta.env.DEV) {
  console.log('Environment configuration loaded:', {
    ALPHA_VANTAGE_API_KEY: env.ALPHA_VANTAGE_API_KEY ? 'Set ✓' : 'Not set ✗',
    SIMLI_AVATAR_TOKEN: env.SIMLI_AVATAR_TOKEN ? 'Set ✓' : 'Not set ✗'
  });
}
