
import { useEffect, useRef, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { ChatInput } from "./ChatInput";
import { ChatMessage } from "./ChatMessage";
import { VideoAvatar } from "./VideoAvatar";
import { Message } from "@/types/chat";
import { sendMessage } from "@/lib/api";
import { nanoid } from "nanoid";
import { MessageSquare, Video } from "lucide-react";

type ChatMode = "text" | "avatar";

export const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [threadId, setThreadId] = useState("default");
  const [chatMode, setChatMode] = useState<ChatMode>("text");
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: nanoid(),
      content,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await sendMessage({
        message: content,
        thread_id: threadId,
      });

      const botMessage: Message = {
        id: nanoid(),
        content: response.response,
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
      setThreadId(response.thread_id);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarMessage = (response: string) => {
    const botMessage: Message = {
      id: nanoid(),
      content: response,
      sender: "bot",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, botMessage]);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col gap-4 p-4">
      <div className="flex gap-2">
        <Button
          variant={chatMode === "text" ? "default" : "outline"}
          onClick={() => setChatMode("text")}
        >
          <MessageSquare className="mr-2" />
          Text Chat
        </Button>
        <Button
          variant={chatMode === "avatar" ? "default" : "outline"}
          onClick={() => setChatMode("avatar")}
        >
          <Video className="mr-2" />
          Avatar Chat
        </Button>
      </div>
      <div className="flex-1 space-y-4 overflow-y-auto rounded-lg bg-background p-4 shadow-sm">
        {chatMode === "text" ? (
          <>
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </>
        ) : (
          <VideoAvatar onMessageReceived={handleAvatarMessage} />
        )}
      </div>
      {chatMode === "text" && (
        <div className="w-full">
          <ChatInput onSend={handleSendMessage} disabled={isLoading} />
        </div>
      )}
    </div>
  );
};
