
import { Chat } from "@/components/Chat";

const Index = () => {
  return (
    <div 
      className="min-h-screen w-full bg-cover bg-center"
      style={{ 
        backgroundImage: "url('/lovable-uploads/750febca-8890-4420-820f-3d8c0d4d610e.png')",
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
