
import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Index from "./pages/Index";
import MarketAnalyst from "./pages/MarketAnalyst";
import RogueTrader from "./pages/RogueTrader";
import RiskAnalyst from "./pages/RiskAnalyst";
import NotFound from "./pages/NotFound";

function App() {
  const [count, setCount] = useState(0);

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/market-analyst" element={<MarketAnalyst />} />
      <Route path="/rogue-trader" element={<RogueTrader />} />
      <Route path="/risk-analyst" element={<RiskAnalyst />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
