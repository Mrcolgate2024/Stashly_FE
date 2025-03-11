
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { useState } from "react";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export const ChatInput = ({ onSend, disabled }: ChatInputProps) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSend(message);
      setMessage("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full max-w-[75%] mx-auto">
      <div className="w-full relative flex">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          disabled={disabled}
          className="flex-1 min-h-[80px] resize-none pr-12"
          rows={2}
        />
        <Button 
          type="submit" 
          size="icon"
          disabled={disabled || !message.trim()}
          className="absolute right-2 bottom-2 h-8 w-8"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
};
