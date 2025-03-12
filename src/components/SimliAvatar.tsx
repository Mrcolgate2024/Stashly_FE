
import React from "react";
import { BaseAvatar, BaseAvatarProps } from "./BaseAvatar";

interface SimliAvatarProps {
  onMessageReceived: (message: string) => void;
  onError?: (error: string) => void;
  agentId: string;
  customText?: string;
}

export const SimliAvatar: React.FC<SimliAvatarProps> = ({
  onMessageReceived,
  onError,
  agentId,
  customText = "Financial Analyst",
}) => {
  const FINANCIAL_ANALYST_TOKEN = "gAAAAABn0dDXLk0o0H5uQWBU9jnpTDVUuukDGqMubTQfc6nF1rngpGJLQ9xctKg9iUVHC7IZYR8RHJ4Q5rLjnQRKHlWiYlN-VC3uazW1DMmpepV-MyVzVmCn8dncpRPs7ldyK7NbwRUOj1aNt96TkBHgd3pkfBdoe4po1zA0BIANvs11pbHNsROfAwbybnsY_lAtp4utAw7jk9jBLVOFiAVtaHup7loSqGdcGMGQOajIlA93oV7_hzdT1fQCULCYzMhBn-tlYCt2JBySSc7xxYdlzwqtne6q6QOND0-G72O35MfVm36cYpaKr7qQyphbqXo1KuB6YzR4Ynk6OyMhSrjJESr2htfEC7t7LUhygtt3mMDp0hNMOD_1ZS1-3O0bAKFMzKf_I0sEFiKV_-whEdvB1m_UP5-KNuAdisDryg8EVQcqIWogux5hsexCvJa4JxRi9vpnmZiz4wnWhQ0xg9Z7uLulX_1Oi-u2-2_jEDn6Ed2wi0D9Cv7J5yJ_KskEVog3BxGUJVhZ";
  const customImageUrl = "/lovable-uploads/c54ad77b-c6fd-43b7-8063-5803ecec8c64.png";

  return (
    <BaseAvatar
      onMessageReceived={onMessageReceived}
      onError={onError}
      agentId={agentId}
      customText={customText}
      token={FINANCIAL_ANALYST_TOKEN}
      eventName="simli:financial:message"
      position="right"
      bgColor="bg-blue-500"
      hoverColor="hover:bg-blue-600"
      imageUrl={customImageUrl}
    />
  );
};
