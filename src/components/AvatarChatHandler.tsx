
import React from "react";
import { VideoAvatar } from "./VideoAvatar";

interface AvatarChatHandlerProps {
  onMessageReceived: (message: string) => void;
}

export const AvatarChatHandler = ({ onMessageReceived }: AvatarChatHandlerProps) => {
  return (
    <VideoAvatar onMessageReceived={onMessageReceived} />
  );
};
