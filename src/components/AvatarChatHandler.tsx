
import React from "react";
import { SimliAvatar } from "./SimliAvatar";

interface AvatarChatHandlerProps {
  onMessageReceived: (message: string) => void;
}

export const AvatarChatHandler = ({ onMessageReceived }: AvatarChatHandlerProps) => {
  // Simli credentials
  const token = "gAAAAABnzdaSAK9eo1dXkjVPB4_sVJG_nvq_ThvMivYcfoVrYJOusk52PhgOtaEvqhmFbXbkJp9W06_DP4NWnN7v_TWO7dGKmi92oeC1aMmIHky98JNaYF4fBMn-6JqaEy_act99q0g46P7C571b2Sa9oA9NuqS6qi0OhQx1zKG67JsKtGj0ECL5Xj_KksIeXjvnUMcDeiDQEE1mBQAA6yO_yRV1l--P4WJSrLMQffvMdwGS6i36EH184LHY-ZWo-spsrVhZaY-e2jQukFkS__Ydv2XPz5DnIdp6K92KC3qFVsIDUltHEeTVKwGklz67_AkQwkHClFDYHseeM301guXCvGxk0F7icSHFyAaryiKyfBsIirJ5UR8-rbBf-XSrgspGqwMG6ue6ZiLJYoCQ2qPNIzLKgMFyOQ==";
  const agentId = "1a996620-2dff-4464-8aae-866a6121876b";

  return (
    <SimliAvatar 
      onMessageReceived={onMessageReceived}
      token={token}
      agentId={agentId}
    />
  );
};
