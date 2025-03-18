/**
 * DEPRECATED: This component uses Alpha Vantage API which has been replaced by YahooMarketData.tsx
 * This file is kept for reference only. Please use YahooMarketData.tsx instead.
 */

import { useEffect, useState } from "react";

// Define types for our market data
interface MarketIndex {
  name: string;
  value: number;
  change: number;
  isPositive: boolean;
  symbol: string;
  chartData?: number[]; // Array of historical prices for mini chart
}

// Get API key from environment variables
// If the environment variable is not set, fall back to the demo key
// Remove any quotes that might be in the .env file
const ALPHA_VANTAGE_API_KEY = (import.meta.env.VITE_ALPHA_VANTAGE_API_KEY || "demo").replace(/"/g, '');

// Log the API key (first few characters only) for debugging
console.log(`Using Alpha Vantage API key: ${ALPHA_VANTAGE_API_KEY.substring(0, 4)}...`);

// Track API usage to stay within the 25 requests per day limit
const API_USAGE_KEY = 'alphavantage_api_usage';
const API_USAGE_DATE_KEY = 'alphavantage_api_usage_date';

// Function to get today's date in YYYY-MM-DD format
const getTodayDate = () => {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
};

// Function to check if we've exceeded our daily API limit
const checkApiUsage = () => {
  const storedDate = localStorage.getItem(API_USAGE_DATE_KEY);
  const today = getTodayDate();
  
  // If it's a new day, reset the counter
  if (storedDate !== today) {
    localStorage.setItem(API_USAGE_DATE_KEY, today);
    localStorage.setItem(API_USAGE_KEY, '0');
    return 0;
  }
  
  // Get current usage count
  const usageCount = parseInt(localStorage.getItem(API_USAGE_KEY) || '0', 10);
  return usageCount;
};

// Function to increment API usage counter
const incrementApiUsage = (count: number) => {
  const currentUsage = checkApiUsage();
  localStorage.setItem(API_USAGE_KEY, String(currentUsage + count));
  return currentUsage + count;
};

export const MarketData = () => {
  const [marketData, setMarketData] = useState<MarketIndex[]>([
    { name: "S&P 500", value: 0, change: 0, isPositive: false, symbol: "SPY", chartData: [] }, // Using SPY ETF as proxy for S&P 500
    { name: "OMX", value: 0, change: 0, isPositive: false, symbol: "EWD", chartData: [] }, // Using EWD ETF (iShares MSCI Sweden) as proxy for OMX
    { name: "USD/SEK", value: 0, change: 0, isPositive: false, symbol: "SEK", chartData: [] },
  ]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);
  const [apiUsage, setApiUsage] = useState(checkApiUsage());

  // Function to fetch market data from Alpha Vantage
  const fetchMarketData = async (forceRefresh = false) => {
    try {
      // Check if we've exceeded our daily API limit (25 requests per day)
      const currentUsage = checkApiUsage();
      setApiUsage(currentUsage);
      
      // Each index requires 1 API call, so we need 3 calls total
      const requiredCalls = marketData.length;
      
      // If we're close to the limit, only fetch one index at a time to maximize value
      const remainingCalls = 25 - currentUsage;
      
      if (remainingCalls <= 0) {
        setError(`Daily API limit reached (${currentUsage}/25). Please try again tomorrow.`);
        setLoading(false);
        return;
      }
      
      if (!forceRefresh && remainingCalls < requiredCalls) {
        setError(`Near API limit (${currentUsage}/25). Click refresh to use ${requiredCalls} more calls.`);
        return;
      }
      
      setLoading(true);
      setError(null);
      setDebugInfo(null);
      
      // Create a copy of the initial market data
      const updatedMarketData = [...marketData];
      let apiSuccessCount = 0;
      let apiCallsMade = 0;
      let debugMessages: string[] = [];
      
      debugMessages.push(`API Key: ${ALPHA_VANTAGE_API_KEY.substring(0, 4)}...`);
      debugMessages.push(`API Usage: ${currentUsage}/25 calls today`);
      
      // Fetch data for each index/currency
      for (let i = 0; i < updatedMarketData.length; i++) {
        const index = updatedMarketData[i];
        
        try {
          let url;
          
          if (index.symbol === "SEK") {
            // For forex data - use currency exchange rate
            url = `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=USD&to_currency=SEK&apikey=${ALPHA_VANTAGE_API_KEY}`;
          } else {
            // For stock/ETF data - use TIME_SERIES_DAILY as requested
            url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${index.symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`;
          }
          
          debugMessages.push(`Fetching ${index.name} from: ${url}`);
          console.log(`Fetching data for ${index.name} from ${url}`);
          
          // Fetch current price data
          const response = await fetch(url);
          apiCallsMade++;
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const data = await response.json();
          
          // Log the full response for debugging
          debugMessages.push(`Full response for ${index.name}: ${JSON.stringify(data)}`);
          console.log(`Response for ${index.name}:`, data);
          
          // Check for Information message (often about rate limits)
          if (data["Information"]) {
            debugMessages.push(`API Information message: ${data["Information"]}`);
            console.warn(`API Information message: ${data["Information"]}`);
            
            // If we only get an Information message, report error
            if (Object.keys(data).length === 1) {
              throw new Error(`API returned information message: ${data["Information"]}`);
            }
          }
          
          // Check for API limit message
          if (data["Note"]) {
            debugMessages.push(`API limit message: ${data["Note"]}`);
            console.warn(`API limit message: ${data["Note"]}`);
            throw new Error(`API limit reached: ${data["Note"]}`);
          }
          
          // Check for error message
          if (data["Error Message"]) {
            debugMessages.push(`API error: ${data["Error Message"]}`);
            console.error(`API error: ${data["Error Message"]}`);
            throw new Error(`API error: ${data["Error Message"]}`);
          }
          
          // Process the data based on the type
          let price = 0;
          let changePercent = 0;
          let historicalPrices: number[] = [];
          
          if (index.symbol === "SEK" && data["Realtime Currency Exchange Rate"]) {
            // Handle forex data
            price = parseFloat(data["Realtime Currency Exchange Rate"]["5. Exchange Rate"]);
            debugMessages.push(`${index.name} price: ${price}`);
            
            // For forex, we don't have change data from this endpoint, so we'll calculate it
            // based on the previous value if available
            if (updatedMarketData[i].value > 0) {
              changePercent = ((price - updatedMarketData[i].value) / updatedMarketData[i].value) * 100;
            }
            
            // Add the current price to chart data
            historicalPrices = [...(updatedMarketData[i].chartData || [])];
            if (historicalPrices.length >= 30) {
              historicalPrices.shift();
            }
            historicalPrices.push(price);
          } else if (data["Time Series (Daily)"]) {
            // Handle TIME_SERIES_DAILY data
            const timeSeries = data["Time Series (Daily)"];
            const dates = Object.keys(timeSeries).sort().reverse(); // Most recent first
            
            if (dates.length > 0) {
              // Get the most recent price
              const latestDate = dates[0];
              const latestData = timeSeries[latestDate];
              price = parseFloat(latestData["4. close"]);
              
              debugMessages.push(`${index.name} latest price (${latestDate}): ${price}`);
              
              // Calculate percent change from previous day
              if (dates.length > 1) {
                const previousDate = dates[1];
                const previousData = timeSeries[previousDate];
                const previousPrice = parseFloat(previousData["4. close"]);
                changePercent = ((price - previousPrice) / previousPrice) * 100;
              }
              
              // Get historical prices for chart (up to 30 days)
              const chartDays = Math.min(dates.length, 30);
              historicalPrices = dates.slice(0, chartDays).map(date => 
                parseFloat(timeSeries[date]["4. close"])
              ).reverse(); // Oldest to newest for chart
            } else {
              throw new Error("No daily data available");
            }
          } else {
            // If we don't have the expected response format, report error
            debugMessages.push(`Unexpected API response format for ${index.name}. Available fields: ${Object.keys(data).join(', ')}`);
            throw new Error(`Invalid API response format for ${index.name}`);
          }
          
          debugMessages.push(`${index.name} - Current: ${price}, Change: ${changePercent.toFixed(2)}%`);
          console.log(`${index.name} - Current: ${price}, Change: ${changePercent.toFixed(2)}%`);
          
          updatedMarketData[i] = {
            ...index,
            value: price,
            change: changePercent,
            isPositive: changePercent > 0,
            chartData: historicalPrices.length > 0 ? historicalPrices : updatedMarketData[i].chartData
          };
          
          // Update last updated timestamp
          setLastUpdated(new Date());
          apiSuccessCount++;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          debugMessages.push(`Failed to fetch data for ${index.name}: ${errorMessage}`);
          console.error(`Failed to fetch data for ${index.name}:`, error);
          
          // Keep existing data if we have it, otherwise show zeros
          if (updatedMarketData[i].value === 0) {
            updatedMarketData[i] = {
              ...index,
              value: 0,
              change: 0,
              isPositive: false,
              chartData: []
            };
          }
        }
      }
      
      // Update API usage counter
      const newUsage = incrementApiUsage(apiCallsMade);
      setApiUsage(newUsage);
      debugMessages.push(`Updated API usage: ${newUsage}/25 calls today`);
      
      // Set debug info
      setDebugInfo(debugMessages.join('\n'));
      
      // Update the market data if at least one API call succeeded
      if (apiSuccessCount > 0) {
        setMarketData(updatedMarketData);
        if (apiSuccessCount < updatedMarketData.length) {
          setError(`Partial data loaded (${apiSuccessCount}/${updatedMarketData.length} sources)`);
        } else {
          setError(null);
        }
      } else {
        setError("Unable to fetch market data. Please try again later.");
      }
      
      setLoading(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error("Error fetching market data:", error);
      setLoading(false);
      setError(`Unable to fetch market data: ${errorMessage}`);
      setDebugInfo(`Global error: ${errorMessage}`);
    }
  };

  // Fetch data on component mount and set up interval for updates
  useEffect(() => {
    fetchMarketData();
    
    // Update data once per hour to conserve API calls (25 per day limit)
    // 3 calls per update × 8 updates = 24 calls per day
    const intervalId = setInterval(() => fetchMarketData(), 3600000); // 1 hour in milliseconds
    
    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  // Format the date for display
  const formatDate = (date: Date | null): string => {
    if (!date) return "";
    
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

  // Render mini sparkline chart
  const renderMiniChart = (data: number[] = [], isPositive: boolean) => {
    if (!data || data.length < 2) return null;
    
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min;
    const height = 20;
    const width = 50;
    
    // Create points for the sparkline
    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${x},${y}`;
    }).join(' ');
    
    return (
      <svg width={width} height={height} className="ml-1">
        <polyline
          points={points}
          fill="none"
          stroke={isPositive ? "#16a34a" : "#dc2626"}
          strokeWidth="1.5"
        />
      </svg>
    );
  };

  // Toggle debug info display
  const toggleDebugInfo = () => {
    if (debugInfo) {
      setDebugInfo(null);
    } else {
      setDebugInfo("Click 'Refresh Data' to see debug information");
    }
  };

  // Handle manual refresh with confirmation if near API limit
  const handleRefresh = () => {
    fetchMarketData(true);
  };

  return (
    <div className="w-full bg-white/80 backdrop-blur-sm rounded-lg shadow-sm p-2 mb-2">
      <div className="flex flex-col">
        <div className="flex flex-wrap justify-between items-center">
          {loading ? (
            <div className="w-full text-center py-1">Loading market data...</div>
          ) : (
            <>
              <div className="flex justify-between w-full">
                {marketData.map((index) => (
                  <div key={index.name} className="flex items-center space-x-2">
                    <div className="text-sm font-semibold text-gray-700">{index.name}</div>
                    <div className="text-sm font-bold">
                      {index.value === 0 ? "N/A" : (
                        index.name === "USD/SEK" 
                          ? index.value.toFixed(2) 
                          : index.value.toFixed(2)
                      )}
                    </div>
                    {index.value > 0 && (
                      <div className="flex items-center">
                        <span 
                          className={`text-xs font-medium ${
                            index.isPositive ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {index.isPositive ? "+" : ""}{index.change.toFixed(2)}%
                        </span>
                        {renderMiniChart(index.chartData, index.isPositive)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="flex justify-between items-center w-full mt-2">
                <div className="flex space-x-2">
                  <button 
                    onClick={handleRefresh}
                    className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
                    disabled={loading}
                  >
                    {loading ? "Refreshing..." : "Refresh Data"}
                  </button>
                  <button 
                    onClick={toggleDebugInfo}
                    className="text-xs bg-gray-500 hover:bg-gray-600 text-white px-2 py-1 rounded"
                  >
                    {debugInfo ? "Hide Debug" : "Show Debug"}
                  </button>
                  <div className="text-xs text-gray-600">
                    API Usage: {apiUsage}/25
                  </div>
                </div>
                
                <div className="flex flex-col items-end">
                  {error && (
                    <div className="text-xs text-amber-600 text-right">
                      {error}
                    </div>
                  )}
                  
                  {lastUpdated && (
                    <div className="text-xs text-gray-500 text-right">
                      Last updated: {formatDate(lastUpdated)}
                    </div>
                  )}
                </div>
              </div>
              
              {debugInfo && (
                <div className="mt-2 p-2 bg-gray-100 rounded text-xs font-mono whitespace-pre-wrap overflow-auto max-h-40">
                  {debugInfo}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};