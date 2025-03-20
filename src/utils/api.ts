import { MarketData } from '@/components/YahooMarketData';

const CORS_PROXY = "https://corsproxy.io/?";
const YAHOO_FINANCE_API = "https://query1.finance.yahoo.com/v8/finance/chart/";

export async function fetchMarketData(): Promise<MarketData[]> {
  const indices = [
    { symbol: "URTH", name: "Developed mkts" },
    { symbol: "MME=F", name: "Emerging mkts" },
    { symbol: "EWD", name: "Sweden" },
    { symbol: "SEK=X", name: "USD/SEK" },
    { symbol: "EURSEK=X", name: "EUR/SEK" },
    { symbol: "^TNX", name: "US 10Y" },
  ];

  const marketData: MarketData[] = [];
  
  // Get start of year for YTD calculation
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1); // January 1st of current year
  const startOfYearTimestamp = Math.floor(startOfYear.getTime() / 1000); // Convert to seconds

  for (const item of indices) {
    try {
      const yahooUrl = `${YAHOO_FINANCE_API}${item.symbol}?range=1y&interval=1d&includePrePost=false`;
      const url = `${CORS_PROXY}${encodeURIComponent(yahooUrl)}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.chart || !data.chart.result || data.chart.result.length === 0) {
        throw new Error(`No chart data available for ${item.symbol}`);
      }
      
      const chartData = data.chart.result[0];
      const timestamps = chartData.timestamp;
      const quotes = chartData.indicators.quote[0];
      
      if (!timestamps || !quotes || !quotes.close) {
        throw new Error(`Missing price data for ${item.symbol}`);
      }
      
      // Filter out any null values
      const validData = timestamps.map((ts: number, idx: number) => {
        return quotes.close[idx] !== null ? [ts, quotes.close[idx]] : null;
      }).filter(item => item !== null) as [number, number][];
      
      // Sort by timestamp to ensure chronological order
      validData.sort((a, b) => a[0] - b[0]);
      
      // Extract valid prices and timestamps
      const validPrices = validData.map(item => item[1]);
      const validTimestamps = validData.map(item => item[0]);
      
      const latestPrice = validPrices[validPrices.length - 1];
      const previousPrice = validPrices.length > 1 ? validPrices[validPrices.length - 2] : latestPrice;
      
      // Find the closest data point to start of year for YTD calculation
      let startOfYearPrice = latestPrice; // Default to latest if we can't find start of year
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
      }
      
      // Calculate the daily change
      const change = item.symbol === "^TNX" 
        ? (latestPrice - previousPrice) * 100  // Bond yields in basis points
        : (latestPrice - previousPrice);
        
      const changePercent = item.symbol === "^TNX"
        ? change  // Already in basis points
        : ((latestPrice - previousPrice) / previousPrice) * 100;
        
      // Calculate YTD change
      const ytdChange = item.symbol === "^TNX"
        ? (latestPrice - startOfYearPrice) * 100  // Bond yields in basis points
        : (latestPrice - startOfYearPrice);
        
      const ytdChangePercent = item.symbol === "^TNX"
        ? ytdChange  // Already in basis points
        : ((latestPrice - startOfYearPrice) / startOfYearPrice) * 100;
        
      // Get historical prices for the chart (last 30 days)
      const historicalPrices = validPrices.slice(-30);
      
      // Calculate if the overall trend is positive
      const isPositiveTrend = historicalPrices.length > 1 && 
        historicalPrices[historicalPrices.length - 1] > historicalPrices[0];
      
      marketData.push({
        index: item.symbol,
        name: item.name,
        price: latestPrice,
        change: change,
        changePercent: changePercent,
        isPositive: isPositiveTrend,
        ytdChangePercent: ytdChangePercent,
        isYtdPositive: ytdChangePercent > 0,
        historicalPrices: historicalPrices
      });
    } catch (error) {
      console.error(`Error fetching data for ${item.name}:`, error);
    }
  }
  
  return marketData;
} 