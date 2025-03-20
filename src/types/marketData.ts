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