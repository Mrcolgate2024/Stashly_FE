import React from 'react';
import { MarketData } from '../types/marketData';
import { formatNumber } from '../utils/formatNumber';
import { formatPercentage } from '../utils/formatting';

interface MarqueeContentProps {
  data: MarketData;
}

export const MarqueeContent: React.FC<MarqueeContentProps> = ({ data }) => {
  return (
    <div className="flex items-center space-x-4">
      <span className="font-semibold">{data.name}</span>
      <span className="font-mono">{formatNumber(data.price)}</span>
      <span className={`font-mono ${data.isPositive ? 'text-green-500' : 'text-red-500'}`}>
        {data.isPositive ? '+' : ''}{formatNumber(data.change)} ({formatPercentage(data.changePercent)})
      </span>
    </div>
  );
}; 