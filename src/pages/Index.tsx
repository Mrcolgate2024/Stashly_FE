
import { Chat } from "@/components/Chat";
import { Logo } from "@/components/Logo";

const Index = () => {
  return (
    <div 
      className="min-h-screen w-full bg-cover bg-center"
      style={{ 
        backgroundImage: "url('/lovable-uploads/ba9837c1-8fb3-4358-99a3-341f7db53f3c.png')",
        backgroundSize: "cover", 
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      <Logo />
      <div className="mx-auto max-w-4xl backdrop-blur-sm bg-white/40 min-h-screen">
        <Chat />
      </div>
    </div>
  );
};

export default Index;
