
import { useEffect, useRef, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { ChatInput } from "./ChatInput";
import { ChatMessage } from "./ChatMessage";
import { VideoAvatar } from "./VideoAvatar";
import { Message } from "@/types/chat";
import { sendMessage } from "@/lib/api";
import { nanoid } from "nanoid";
import { MessageSquare, User, Video } from "lucide-react";
import { Input } from "./ui/input";

type ChatMode = "text" | "avatar";

export const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [threadId, setThreadId] = useState("default");
  const [chatMode, setChatMode] = useState<ChatMode>("text");
  const [userName, setUserName] = useState("");
  const [showUserNameInput, setShowUserNameInput] = useState(false);
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
        user_name: userName || undefined,
      });

      const botMessage: Message = {
        id: nanoid(),
        content: response.response,
        sender: "bot",
        timestamp: new Date(),
        imageData: response.has_image ? response.image_data : undefined,
        metrics: response.metrics,
        suggestedQuestions: response.suggested_questions,
        tableHtml: response.has_table ? response.table_html : undefined,
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

  const handleSuggestedQuestionClick = (question: string) => {
    handleSendMessage(question);
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

  const toggleUserNameInput = () => {
    setShowUserNameInput(!showUserNameInput);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col gap-4 p-4">
      <div className="flex flex-wrap items-center gap-2">
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
        <div className="ml-auto flex items-center gap-2">
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
      <div className="flex-1 space-y-4 overflow-y-auto rounded-lg bg-background p-4 shadow-sm">
        {chatMode === "text" ? (
          <>
            {messages.map((message) => (
              <ChatMessage 
                key={message.id} 
                message={message} 
                onQuestionClick={handleSuggestedQuestionClick}
              />
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
