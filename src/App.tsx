
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import MarketAnalyst from "./pages/MarketAnalyst";
import RogueTrader from "./pages/RogueTrader";
import RiskAnalyst from "./pages/RiskAnalyst";

// Create the query client
const queryClient = new QueryClient();

// Declare global type for the simli script loaded state
declare global {
  interface Window {
    simliScriptLoaded?: boolean;
    simliAvatarActive?: boolean;
  }
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/market-analyst" element={<MarketAnalyst />} />
          <Route path="/rogue-trader" element={<RogueTrader />} />
          <Route path="/risk-analyst" element={<RiskAnalyst />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
      <Sonner />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
