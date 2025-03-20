import React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCcw, Trash2 } from "lucide-react";

interface ChatControlsProps {
  isLoading: boolean;
  messagesExist: boolean;
  onRetry: () => void;
  onClear: () => void;
}

export const ChatControls = ({
  isLoading,
  messagesExist,
  onRetry,
  onClear
}: ChatControlsProps) => {
  return (
    <div className="flex items-center gap-2">
      {isLoading ? null : (
        <>
          <Button 
            size="icon"
            onClick={onRetry}
            disabled={!messagesExist}
            title="Retry last question"
            className={`h-8 w-8 ${
              !messagesExist 
                ? "bg-gray-100 text-gray-400" 
                : "bg-[#1e2a38] text-white hover:bg-[#2a3a4d]"
            }`}
          >
            <RefreshCcw className="h-4 w-4" />
          </Button>
          <Button 
            size="icon"
            onClick={onClear}
            disabled={!messagesExist}
            title="Clear chat history"
            className={`h-8 w-8 ${
              !messagesExist 
                ? "bg-gray-100 text-gray-400" 
                : "bg-[#1e2a38] text-white hover:bg-[#2a3a4d]"
            }`}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </>
      )}
    </div>
  );
};
