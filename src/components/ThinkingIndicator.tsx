import React from 'react';
import { Loader2 } from 'lucide-react';

interface ThinkingIndicatorProps {
  message?: string;
  className?: string;
}

export const ThinkingIndicator: React.FC<ThinkingIndicatorProps> = ({ 
  message = "AI Assistant is thinking...",
  className = ""
}) => {
  return (
    <div className="animate-slideIn opacity-0" style={{ animationFillMode: 'forwards' }}>
      <div className={`flex items-center gap-2 text-[#1e2a38] bg-white/80 backdrop-blur-sm rounded-lg p-4 max-w-[80%] ${className}`}>
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-[13px]">{message}</span>
      </div>
    </div>
  );
}; 