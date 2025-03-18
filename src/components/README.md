# Market Data Components

This directory contains components for displaying financial market data in the application.

## YahooMarketData.tsx (Current Implementation)

The `YahooMarketData` component is the current implementation used to display real-time market data. It fetches data from Yahoo Finance's API, which offers several advantages:

- No API key required
- Higher rate limits (no daily request limit)
- More reliable data availability
- Better support for international indices

The component displays:
- S&P 500 index
- OMX Stockholm 30 index
- USD/SEK currency exchange rate

Each index includes:
- Current value
- Daily percentage change
- Mini chart showing 30-day price history

The data automatically refreshes every 5 minutes, and users can manually refresh it using the "Refresh Data" button.

### Implementation Details

- Uses Yahoo Finance's chart API endpoint
- Fetches 30 days of daily data for each index
- Uses a CORS proxy to avoid cross-origin issues
- Includes detailed debug information for troubleshooting

## MarketData.tsx (Deprecated)

The `MarketData` component is the original implementation that used Alpha Vantage API. It has been deprecated due to limitations with the Alpha Vantage free tier:

- Limited to 25 API calls per day
- Requires an API key
- Less reliable for international indices

This file is kept for reference only and should not be used in production.

## Switching Between Implementations

The application currently uses `YahooMarketData` in the `Index.tsx` page. If you need to switch back to the Alpha Vantage implementation for any reason, you can modify the import in `Index.tsx`:

```tsx
// Current implementation (Yahoo Finance)
import { YahooMarketData } from "@/components/YahooMarketData";

// To switch to Alpha Vantage (not recommended)
// import { MarketData } from "@/components/MarketData";
```

Then replace `<YahooMarketData />` with `<MarketData />` in the JSX. 