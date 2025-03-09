
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RefreshCcw, User } from "lucide-react";

interface ChatControlsProps {
  userName: string;
  setUserName: (name: string) => void;
  isLoading: boolean;
  messagesExist: boolean;
  onRetry: () => void;
}

export const ChatControls = ({
  userName,
  setUserName,
  isLoading,
  messagesExist,
  onRetry
}: ChatControlsProps) => {
  const [showUserNameInput, setShowUserNameInput] = useState(false);

  const toggleUserNameInput = () => {
    setShowUserNameInput(!showUserNameInput);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="ml-auto flex items-center gap-2">
        {isLoading ? null : (
          <Button 
            variant="outline" 
            size="sm"
            onClick={onRetry}
            disabled={!messagesExist}
            title="Retry last question"
          >
            <RefreshCcw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={toggleUserNameInput}
        >
          <User className="mr-2 h-4 w-4" />
          {userName ? userName : "Set Name"}
        </Button>
        {showUserNameInput && (
          <div className="flex items-center gap-2">
            <Input
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter your name"
              className="h-9 w-40"
            />
            <Button 
              size="sm" 
              variant="secondary"
              onClick={() => setShowUserNameInput(false)}
            >
              Save
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
