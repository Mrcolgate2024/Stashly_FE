
import React from "react";
import { BaseAvatar } from "./BaseAvatar";

interface FinancialAnalyst2AvatarProps {
  onMessageReceived: (message: string) => void;
  onError?: (error: string) => void;
  agentId: string;
  customText?: string;
}

export const FinancialAnalyst2Avatar: React.FC<FinancialAnalyst2AvatarProps> = ({
  onMessageReceived,
  onError,
  agentId,
  customText = "Portfolio Manager",
}) => {
  const FINANCIAL_ANALYST_2_TOKEN = "gAAAAABn0nj_GUR3dcHCghMNt6VRrEoK1nukAH4OwWLk1sKAopDy94GD6txmJcxjJIISJVtJa7d3DasU2sQLvp75H8gQRijJ25q9N_6fr2WMVB-lKmTS4fNjE0tP2aiJRTE3exC6V0FiHpB12Yw4Mgxqf-aani8rrIbt9zEXALkZdSUw7T1ZT5vrslmrPFnmiWedmKrYp80m3l2srEKgzMuNTzQCEBMYZR_rhO-2TTcPE4PYjPtN1Zd4zXN81nhmBLd9kW-27Pe7vledZhyJWsDVr4CgjQ6Kw_-ujnHBtFH_Q8s040lUB3ncsuY_c9iqX5uT6kgei1ZyoSsv3u0rEkiRvcxioOBwiwQlow2B8kMg_9NzMeAbSk-AlfV1Tpbd0TknR9RBxQZLGOyihzYsHcgipFL9a4oqxbbFPbZqVVrqVEadctXgQA0uvT4HWqCj4VDukh_toS5rfUBkcf-AGLIoPooKfx94Ct5fyzhKKVjBZ9jgv6uppNFE49nSOgsfeOeDnxtBw69t";

  // Create a wrapper for the onError callback
  const handleError = (error: string) => {
    console.error("Portfolio Manager avatar error:", error);
    
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
      token={FINANCIAL_ANALYST_2_TOKEN}
      eventName="simli:portfolio:message"
      position="right"
      bgColor="bg-purple-500"
      hoverColor="hover:bg-purple-600"
      initials="PM"
      disableTTS={false}
    />
  );
};
