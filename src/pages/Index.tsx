
import { Chat } from "@/components/Chat";

const Index = () => {
  return (
    <div 
      className="min-h-screen w-full bg-[#2c3e50]"
    >
      <div className="mx-auto max-w-4xl backdrop-blur-sm bg-white/40 min-h-screen">
        <Chat />
      </div>
    </div>
  );
};

export default Index;
