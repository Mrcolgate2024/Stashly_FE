
import { Chat } from "@/components/Chat";

const Index = () => {
  return (
    <div 
      className="min-h-screen w-full bg-cover bg-center"
      style={{ 
        backgroundImage: "url('/lovable-uploads/6c76bb89-2a82-41f2-aaf1-42a41717069c.png')",
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
