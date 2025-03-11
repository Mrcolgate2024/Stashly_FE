
import { Chat } from "@/components/Chat";

const Index = () => {
  return (
    <>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap" />
      <div 
        className="min-h-screen w-full bg-[#1e2a38]"
      >
        <div className="mx-auto max-w-4xl backdrop-blur-sm bg-white/40 min-h-screen">
          <Chat />
        </div>
      </div>
    </>
  );
};

export default Index;
