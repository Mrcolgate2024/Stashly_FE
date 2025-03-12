
import React, { useRef } from "react";
import { SimliErrorMessage } from "./SimliErrorMessage";

interface AvatarContainerProps {
  hasError: boolean;
  errorMessage: string;
  onRetry: () => void;
  isProcessing: boolean;
  containerRef: React.RefObject<HTMLDivElement>;
}

export const AvatarContainer: React.FC<AvatarContainerProps> = ({
  hasError,
  errorMessage,
  onRetry,
  isProcessing,
  containerRef
}) => {
  return (
    <div className="relative">
      {hasError && (
        <SimliErrorMessage 
          message={errorMessage}
          onRetry={onRetry}
          isProcessing={isProcessing}
        />
      )}
      <div ref={containerRef} className="min-h-[60px] min-w-[60px] bg-gray-100/30 rounded-full">
        {/* Simli widget will be inserted here programmatically */}
      </div>
    </div>
  );
};
