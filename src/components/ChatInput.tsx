import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export const ChatInput = ({ onSend, disabled }: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-focus the textarea when component mounts or disabled state changes
  useEffect(() => {
    if (!disabled && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [disabled]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage("");
      // Re-focus the textarea after sending
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-[75%] ml-0">
      <div className="w-full relative flex">
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message... (Press Enter to send)"
          disabled={disabled}
          className="flex-1 min-h-[80px] resize-none pr-12 text-[13px]"
          rows={2}
        />
        <Button 
          type="submit" 
          size="icon"
          disabled={disabled || !message.trim()}
          className={`absolute right-2 bottom-2 h-8 w-8 ${
            disabled || !message.trim()
              ? "bg-gray-100 text-gray-400"
              : "bg-[#1e2a38] hover:bg-[#2a3a4d]"
          }`}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
};
