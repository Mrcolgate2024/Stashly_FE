
import { useEffect, useRef, useState } from "react";
import StreamingAvatar, {
  AvatarQuality,
  StreamingEvents,
  VoiceEmotion,
} from "@heygen/streaming-avatar";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useToast } from "./ui/use-toast";

interface VideoAvatarProps {
  onMessageReceived: (message: string) => void;
}

export const VideoAvatar = ({ onMessageReceived }: VideoAvatarProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [avatar, setAvatar] = useState<StreamingAvatar | null>(null);
  const [sessionData, setSessionData] = useState<any>(null);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [userInput, setUserInput] = useState("");
  const { toast } = useToast();

  const fetchAccessToken = async (): Promise<string> => {
    const apiKey = import.meta.env.VITE_HEYGEN_API_KEY;
    const response = await fetch(
      "https://api.heygen.com/v1/streaming.create_token",
      {
        method: "POST",
        headers: { "x-api-key": apiKey },
      }
    );

    const { data } = await response.json();
    return data.token;
  };

  const handleStreamReady = (event: any) => {
    if (event.detail && videoRef.current) {
      videoRef.current.srcObject = event.detail;
      videoRef.current.onloadedmetadata = () => {
        videoRef.current?.play().catch(console.error);
      };
    } else {
      console.error("Stream is not available");
    }
  };

  const handleStreamDisconnected = () => {
    console.log("Stream disconnected");
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsSessionActive(false);
  };

  const initializeAvatarSession = async () => {
    try {
      const token = await fetchAccessToken();
      const newAvatar = new StreamingAvatar({ token });

      const session = await newAvatar.createStartAvatar({
        quality: AvatarQuality.High,
        avatarName: "c20f4bdddbe041ecba98d93444f8b29b",
        language: "English",
        voice: {
          voiceId: "7436774c58f54875a90d11d371c9a2fd",
          rate: 1,
          emotion: VoiceEmotion.EXCITED,
        },
      });

      newAvatar.on(StreamingEvents.STREAM_READY, handleStreamReady);
      newAvatar.on(StreamingEvents.STREAM_DISCONNECTED, handleStreamDisconnected);

      setAvatar(newAvatar);
      setSessionData(session);
      setIsSessionActive(true);
    } catch (error) {
      console.error("Error initializing avatar:", error);
      toast({
        title: "Error",
        description: "Failed to initialize avatar session",
        variant: "destructive",
      });
    }
  };

  const terminateAvatarSession = async () => {
    if (!avatar || !sessionData) return;

    await avatar.stopAvatar();
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setAvatar(null);
    setSessionData(null);
    setIsSessionActive(false);
  };

  const handleSpeak = async () => {
    if (!avatar || !userInput.trim()) return;

    try {
      const response = await getChatResponse(userInput);
      onMessageReceived(response);
      await avatar.speak({
        text: response,
      });
      setUserInput("");
    } catch (error) {
      console.error("Error in handleSpeak:", error);
      toast({
        title: "Error",
        description: "Failed to process speech",
        variant: "destructive",
      });
    }
  };

  const getChatResponse = async (message: string): Promise<string> => {
    try {
      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: message,
          thread_id: "default",
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error("Error in getChatResponse:", error);
      throw error;
    }
  };

  useEffect(() => {
    return () => {
      if (avatar && sessionData) {
        terminateAvatarSession();
      }
    };
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          playsInline
        />
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex gap-2">
          <Button
            onClick={isSessionActive ? terminateAvatarSession : initializeAvatarSession}
            variant={isSessionActive ? "destructive" : "default"}
          >
            {isSessionActive ? "End Session" : "Start Session"}
          </Button>
        </div>
        <div className="flex gap-2">
          <Input
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type your message..."
            disabled={!isSessionActive}
          />
          <Button
            onClick={handleSpeak}
            disabled={!isSessionActive || !userInput.trim()}
          >
            Speak
          </Button>
        </div>
      </div>
    </div>
  );
};
