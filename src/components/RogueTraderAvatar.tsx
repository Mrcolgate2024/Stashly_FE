
import React from "react";
import { BaseAvatar } from "./BaseAvatar";

interface RogueTraderAvatarProps {
  onMessageReceived: (message: string) => void;
  onError?: (error: string) => void;
  agentId: string;
  customText?: string;
}

export const RogueTraderAvatar: React.FC<RogueTraderAvatarProps> = ({
  onMessageReceived,
  onError,
  agentId,
  customText = "Rogue Trader",
}) => {
  // Update the token to the new one
  const ROGUE_TRADER_TOKEN = "gAAAAABn0nnD3-eQwdpKNWyMWFAOJHvQ_T2tfnRpQIlscOX3-NZ0ZOjQdSXfRa-rP1V7HK6lBhV4mz-JPZseP4TNSSXlLvtxamDDkbL313b9gLmUpvZsUVkTt8Bf80r3rFc8bgYTAAHH1lKVeixWPHI4cG5CVnFUEp7BkZdFqH6kB6YNOQye1scUcz9ZtWmfmfnHjQIvKYHprtcam7K5JMpNsDMZJorriguO5FCtmhcp7rXa3aFLuZR8RG7uQBxtZpBmYeI39BmZ88VWkxfbuYXghD2ri_fpj0MxR3ruu1GkZDzl9ssrx41AcWwiw2WdJmB486qasXPa9iZQ2YtOl_m4bjfSzkHUr12Z_aDXGo2scRP1UHYuwLKGXh8O-KqgmwJDEtPFhGBroQ5f_lYgr2JMp6eMrKYfGfMbzxj-pS-b-B0dMYmUGRREatxxjlgvMY5IgtiNmquPZVsPt769GQrw20Mluwn7Fngs52Cp50uYng730b-ArNMDljapADQlvtrd2jeqcjbc";

  // Create a wrapper for the onError callback
  const handleError = (error: string) => {
    console.error("Rogue Trader avatar error:", error);
    
    // Pass the error to the provided onError callback
    if (onError) {
      onError(error);
    }
  };

  return (
    <BaseAvatar
      onMessageReceived={onMessageReceived}
      onError={handleError}
      agentId={agentId}
      customText={customText}
      token={ROGUE_TRADER_TOKEN}
      eventName="simli:rogue:message"
      position="left"
      bgColor="bg-red-500"
      hoverColor="hover:bg-red-600"
      initials="RT"
      // Set disableTTS to true since we're getting TTS API Key errors
      disableTTS={true}
    />
  );
};
