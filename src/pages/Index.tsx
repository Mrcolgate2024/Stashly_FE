
import { Chat } from "@/components/Chat";

const Index = () => {
  return (
    <div 
      className="min-h-screen w-full bg-cover bg-center"
      style={{ 
        backgroundImage: "url('/lovable-uploads/759a1781-10b2-4f91-aa70-6d11509c72da.png')",
        backgroundSize: "cover", 
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      <div className="mx-auto max-w-4xl backdrop-blur-sm bg-white/40 min-h-screen">
        <Chat />
      </div>
    </div>
  );
};

export default Index;
