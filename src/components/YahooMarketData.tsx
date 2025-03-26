import { useEffect, useState, useRef } from "react";
import { fetchMarketData } from "@/utils/api";
import { formatPercentage, formatBasisPoints } from "@/utils/formatting";
import { RefreshCw } from "lucide-react";

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

export interface MarketData {
  index: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  isPositive: boolean;
  isYtdPositive: boolean;
  ytdChangePercent: number;
  historicalPrices: number[];
}

const MarqueeContent = ({ data }: { data: MarketData[] }) => (
  <span className="inline-flex items-center mr-6">
    {data.map((item) => (
      <span key={item.index} className="inline-flex items-center mr-6">
        <span className="font-semibold mr-2">{item.name}:</span>
        <span className="mr-1">{item.price.toFixed(2)}</span>
        <span className="mr-3">
          <span className="text-xs font-medium mr-1">TDY</span>
          <span 
            className={`${item.changePercent > 0 ? 'text-blue-400' : 'text-red-400'}`}
          >
            {item.index.includes("^TNX") 
              ? `${formatBasisPoints(item.change)} bp` 
              : formatPercentage(item.changePercent)}
          </span>
        </span>
        <span>
          <span className="text-xs font-medium mr-1">YTD</span>
          <span 
            className={`${item.ytdChangePercent > 0 ? 'text-blue-400' : 'text-red-400'}`}
          >
            {item.index.includes("^TNX") 
              ? `${formatBasisPoints(item.ytdChangePercent)} bp` 
              : formatPercentage(item.ytdChangePercent)}
          </span>
        </span>
      </span>
    ))}
  </span>
);

export const YahooMarketData = () => {
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [loading, setLoading] = useState(false);
  const marqueeRef = useRef<HTMLDivElement>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await fetchMarketData();
      // Update data without recreating the marquee element
      setMarketData(data);
    } catch (error) {
      console.error("Error fetching market data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 30000);
    return () => clearInterval(intervalId);
  }, []);

  if (loading && marketData.length === 0) {
    return <div className="text-center text-white">Loading market data...</div>;
  }

  return (
    <div className="fixed-top w-full bg-[#1e2a38] text-white text-[13px] font-medium py-1.5 px-4 border-b border-white/10 z-30">
      <div className="flex items-center justify-between">
        <div className="overflow-hidden whitespace-nowrap flex-1">
          <div ref={marqueeRef} className="animate-marquee inline-block text-white">
            <MarqueeContent data={marketData} />
            <MarqueeContent data={marketData} />
          </div>
        </div>
        <button 
          onClick={fetchData} 
          disabled={loading}
          className="text-white h-6 w-6 flex items-center justify-center rounded-full hover:bg-white/10 ml-2"
          title="Refresh market data"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>
    </div>
  );
}; 