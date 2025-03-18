import { useEffect, useState } from "react";

// Define types for our market data
interface MarketIndex {
  name: string;
  value: number;
  change: number;
  ytdChange: number; // Year-to-date change
  isPositive: boolean;
  isYtdPositive: boolean; // For YTD change
  symbol: string;
  currency: string; // Currency denomination
  chartData?: number[]; // Array of historical prices for mini chart
  isBond?: boolean; // Flag to identify bond yields
  ytdStartDate?: Date; // Start date for YTD calculation
  ytdStartValue?: number; // Start value for YTD calculation
}

// Yahoo Finance API endpoint with CORS proxy
// Using a public CORS proxy to avoid CORS issues
const CORS_PROXY = "https://corsproxy.io/?";
const YAHOO_FINANCE_API = "https://query1.finance.yahoo.com/v8/finance/chart/";

export const YahooMarketData = () => {
  const [marketData, setMarketData] = useState<MarketIndex[]>([
    { name: "Developed markets", value: 0, change: 0, ytdChange: 0, isPositive: false, isYtdPositive: false, symbol: "URTH", currency: "USD", chartData: [] }, // MSCI Developed Markets Index Futures
    { name: "Emerging markets", value: 0, change: 0, ytdChange: 0, isPositive: false, isYtdPositive: false, symbol: "MME=F", currency: "USD", chartData: [] }, // MSCI Emerging Markets Index Futures
    { name: "Sweden", value: 0, change: 0, ytdChange: 0, isPositive: false, isYtdPositive: false, symbol: "EWD", currency: "USD", chartData: [] }, // MSCI Sweden ETF as proxy for MSCI Sweden
    { name: "USD/SEK", value: 0, change: 0, ytdChange: 0, isPositive: false, isYtdPositive: false, symbol: "SEK=X", currency: "SEK", chartData: [] }, // USD/SEK currency pair
    { name: "US 10Y", value: 0, change: 0, ytdChange: 0, isPositive: false, isYtdPositive: false, symbol: "^TNX", currency: "USD", chartData: [], isBond: true }, // US 10-Year Treasury Yield
  ]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);

  // Function to fetch market data from Yahoo Finance
  const fetchMarketData = async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);
      setDebugInfo(null);
      
      // Create a copy of the initial market data
      const updatedMarketData = [...marketData];
      let apiSuccessCount = 0;
      let debugMessages: string[] = [];
      
      // Get current date and first day of year for YTD calculation
      const now = new Date();
      const startOfYear = new Date(now.getFullYear(), 0, 1); // January 1st of current year
      
      debugMessages.push(`YTD calculation start date: ${startOfYear.toISOString().split('T')[0]}`);
      
      // Fetch data for each index/currency
      for (let i = 0; i < updatedMarketData.length; i++) {
        const index = updatedMarketData[i];
        
        try {
          // Build Yahoo Finance API URL with parameters
          // Use 1y range to get YTD data
          const yahooUrl = `${YAHOO_FINANCE_API}${index.symbol}?range=1y&interval=1d&includePrePost=false`;
          // Add CORS proxy
          const url = `${CORS_PROXY}${encodeURIComponent(yahooUrl)}`;
          
          debugMessages.push(`Fetching ${index.name} from: ${yahooUrl} (via CORS proxy)`);
          console.log(`Fetching data for ${index.name} from ${url}`);
          
          // Fetch data
          const response = await fetch(url);
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const data = await response.json();
          
          // Log the response structure for debugging
          debugMessages.push(`Response structure for ${index.name}: ${Object.keys(data).join(', ')}`);
          
          // Check if we have valid chart data
          if (!data.chart || !data.chart.result || data.chart.result.length === 0) {
            throw new Error(`No chart data available for ${index.symbol}`);
          }
          
          const chartData = data.chart.result[0];
          
          // Get the latest price (last value in the array)
          const timestamps = chartData.timestamp;
          const quotes = chartData.indicators.quote[0];
          
          if (!timestamps || !quotes || !quotes.close) {
            throw new Error(`Missing price data for ${index.symbol}`);
          }
          
          // Filter out any null values and create pairs of [timestamp, price]
          const validData = timestamps.map((ts: number, idx: number) => {
            return quotes.close[idx] !== null ? [ts, quotes.close[idx]] : null;
          }).filter(item => item !== null) as [number, number][];
          
          // Sort by timestamp to ensure chronological order
          validData.sort((a, b) => a[0] - b[0]);
          
          // Extract valid prices and timestamps
          const validPrices = validData.map(item => item[1]);
          const validTimestamps = validData.map(item => item[0]);
          
          const latestPrice = validPrices[validPrices.length - 1];
          
          // Get the previous day's price for calculating change
          const previousPrice = validPrices.length > 1 ? validPrices[validPrices.length - 2] : latestPrice;
          
          // Find the first price of the year for YTD calculation
          let startOfYearPrice = latestPrice; // Default to latest if we can't find start of year
          let startOfYearDate = new Date();
          const startOfYearTimestamp = startOfYear.getTime() / 1000; // Convert to seconds for comparison
          
          // Find the closest data point to start of year
          let closestIndex = 0;
          let minDiff = Number.MAX_VALUE;
          
          for (let j = 0; j < validTimestamps.length; j++) {
            const diff = Math.abs(validTimestamps[j] - startOfYearTimestamp);
            if (diff < minDiff) {
              minDiff = diff;
              closestIndex = j;
            }
          }
          
          if (closestIndex < validPrices.length) {
            startOfYearPrice = validPrices[closestIndex];
            startOfYearDate = new Date(validTimestamps[closestIndex] * 1000); // Convert timestamp to date
          }
          
          // Calculate daily change
          let changeValue;
          let ytdChangeValue;
          
          if (index.isBond) {
            // For bonds, calculate change in basis points (1 bp = 0.01%)
            changeValue = (latestPrice - previousPrice) * 100; // Bond yields are already in %, multiply by 100 to get bp
            ytdChangeValue = (latestPrice - startOfYearPrice) * 100; // YTD change in basis points
            
            debugMessages.push(`${index.name} - Current: ${latestPrice.toFixed(2)}%, Daily Change: ${changeValue.toFixed(1)} bp, YTD Change: ${ytdChangeValue.toFixed(1)} bp`);
            debugMessages.push(`${index.name} - YTD start date: ${startOfYearDate.toISOString().split('T')[0]}, YTD start value: ${startOfYearPrice.toFixed(2)}%`);
          } else {
            // For indices and currency, calculate percentage change
            changeValue = ((latestPrice - previousPrice) / previousPrice) * 100; // Regular percentage change
            ytdChangeValue = ((latestPrice - startOfYearPrice) / startOfYearPrice) * 100; // YTD percentage change
            
            debugMessages.push(`${index.name} - Current: ${latestPrice.toFixed(2)}, Daily Change: ${changeValue.toFixed(2)}%, YTD Change: ${ytdChangeValue.toFixed(2)}%`);
            debugMessages.push(`${index.name} - YTD start date: ${startOfYearDate.toISOString().split('T')[0]}, YTD start value: ${startOfYearPrice.toFixed(2)}`);
          }
          
          // Get historical prices for the chart (up to 30 days)
          const historicalPrices = validPrices.slice(-30);
          
          updatedMarketData[i] = {
            ...index,
            value: latestPrice,
            change: changeValue,
            ytdChange: ytdChangeValue,
            isPositive: changeValue > 0,
            isYtdPositive: ytdChangeValue > 0,
            chartData: historicalPrices,
            isBond: index.isBond,
            ytdStartDate: startOfYearDate,
            ytdStartValue: startOfYearPrice
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
              ytdChange: 0,
              isPositive: false,
              isYtdPositive: false,
              chartData: [],
              isBond: index.isBond
            };
          }
        }
      }
      
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
    
    // Update data every 5 minutes
    const intervalId = setInterval(() => fetchMarketData(), 300000); // 5 minutes in milliseconds
    
    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  // Format the date for display
  const formatDate = (date: Date | null): string => {
    if (!date) return "";
    
    return new Intl.DateTimeFormat('en-US', {
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).format(date);
  };

  // Render mini sparkline chart
  const renderMiniChart = (data: number[] = [], isPositive: boolean) => {
    if (!data || data.length < 2) return null;
    
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min;
    const height = 16;
    const width = 40;
    
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

  // Handle manual refresh
  const handleRefresh = () => {
    fetchMarketData(true);
  };

  return (
    <div className="w-full bg-white/80 backdrop-blur-sm rounded-lg shadow-sm p-1 mb-1">
      <div className="flex flex-col items-end">
        {loading ? (
          <div className="w-full text-center py-0.5 text-xs">Loading...</div>
        ) : (
          <>
            <table className="w-full min-w-[350px] divide-y divide-gray-200 text-xs">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-1 py-0.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Index
                  </th>
                  <th scope="col" className="px-1 py-0.5 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Value
                  </th>
                  <th scope="col" className="px-1 py-0.5 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ccy
                  </th>
                  <th scope="col" className="px-1 py-0.5 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    TDY
                  </th>
                  <th scope="col" className="px-1 py-0.5 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    YTD
                  </th>
                  <th scope="col" className="px-1 py-0.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    30D
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {marketData.map((index) => (
                  <tr key={index.name} className="h-5">
                    <td className="px-1 py-0.5 whitespace-nowrap">
                      <div className="text-xs font-semibold text-gray-700">{index.name}</div>
                    </td>
                    <td className="px-1 py-0.5 whitespace-nowrap text-right">
                      <div className="text-xs font-bold">
                        {index.value === 0 ? "N/A" : (
                          index.isBond 
                            ? `${index.value.toFixed(2)}%` 
                            : index.name === "USD/SEK" 
                              ? index.value.toFixed(2) 
                              : index.value.toFixed(2)
                        )}
                      </div>
                    </td>
                    <td className="px-1 py-0.5 whitespace-nowrap text-center">
                      <div className="text-xs text-gray-500">{index.currency}</div>
                    </td>
                    <td className="px-1 py-0.5 whitespace-nowrap text-right">
                      {index.value > 0 && (
                        <span 
                          className={`text-xs font-medium ${
                            index.isPositive ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {index.isPositive ? "+" : ""}
                          {index.change.toFixed(2)}
                          {index.isBond ? " bp" : "%"}
                        </span>
                      )}
                    </td>
                    <td className="px-1 py-0.5 whitespace-nowrap text-right">
                      {index.value > 0 && (
                        <span 
                          className={`text-xs font-medium ${
                            index.isYtdPositive ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {index.isYtdPositive ? "+" : ""}
                          {index.ytdChange.toFixed(2)}
                          {index.isBond ? " bp" : "%"}
                        </span>
                      )}
                    </td>
                    <td className="px-1 py-0.5 whitespace-nowrap">
                      {index.value > 0 && renderMiniChart(index.chartData, index.isPositive)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <div className="flex justify-between items-center w-full mt-0.5">
              <div className="flex space-x-1">
                <button 
                  onClick={handleRefresh}
                  className="text-[10px] bg-blue-500 hover:bg-blue-600 text-white px-1 py-0.5 rounded"
                  disabled={loading}
                >
                  {loading ? "..." : "Refresh"}
                </button>
              </div>
              
              <div className="flex flex-col items-end">
                {error && (
                  <div className="text-[10px] text-amber-600 text-right">
                    {error}
                  </div>
                )}
                
                {lastUpdated && (
                  <div className="text-[10px] text-gray-500 text-right">
                    Updated: {formatDate(lastUpdated)}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}; 