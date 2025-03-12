
import { useState } from "react";
import { SimliAvatar } from "@/components/SimliAvatar";
import { Toaster } from "@/components/ui/toaster";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const FinancialAnalyst = () => {
  const [messages, setMessages] = useState<string[]>([]);

  const handleAvatarMessage = (message: string) => {
    setMessages(prev => [...prev, message]);
  };

  return (
    <div className="min-h-screen w-full bg-[#1e2a38] p-6">
      <div className="mx-auto max-w-4xl backdrop-blur-sm bg-white/40 min-h-screen p-6 rounded-lg">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Financial Analyst</h1>
          <Link to="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
        </div>
        
        <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-md mb-20 min-h-[400px]">
          {messages.length === 0 ? (
            <p className="text-gray-500 text-center my-10">
              Activate the avatar to start a conversation with the Financial Analyst
            </p>
          ) : (
            <div className="space-y-4">
              {messages.map((msg, index) => (
                <div key={index} className="p-3 bg-blue-50 rounded-lg">
                  <p>{msg}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <SimliAvatar 
          onMessageReceived={handleAvatarMessage}
          agentId="b36e9ae6-5a88-4235-9e7a-eab88fd52d7b"
          customText="Financial Analyst"
        />
      </div>
      <Toaster />
    </div>
  );
};

export default FinancialAnalyst;
