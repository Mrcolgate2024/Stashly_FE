
import { Chat } from "@/components/Chat";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    // Check if the Simli script is loaded
    if (window.simliScriptLoaded) {
      setScriptLoaded(true);
      return;
    }

    // If not already loaded, set up a check for when it does load
    const checkScriptLoaded = setInterval(() => {
      if (window.simliScriptLoaded) {
        setScriptLoaded(true);
        clearInterval(checkScriptLoaded);
      }
    }, 500);

    // Cleanup
    return () => clearInterval(checkScriptLoaded);
  }, []);

  return (
    <>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap" />
      <div className="min-h-screen w-full bg-[#1e2a38]">
        <div className="mx-auto max-w-4xl backdrop-blur-sm bg-white/40 min-h-screen p-6">
          <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/market-analyst">
              <Button className="w-full sm:w-auto bg-green-500 hover:bg-green-600">
                Market Analyst Avatar
              </Button>
            </Link>
            <Link to="/rogue-trader">
              <Button className="w-full sm:w-auto bg-red-500 hover:bg-red-600">
                Rogue Trader Avatar
              </Button>
            </Link>
          </div>
          <div className="bg-white/80 p-4 rounded-lg shadow-md mb-6">
            <h1 className="text-xl font-bold mb-3">Avatar Demo</h1>
            <p className="mb-2">This demo shows how to use Simli avatars in your React application.</p>
            <p className="mb-2">Select an avatar above to try it out.</p>
            {!scriptLoaded && (
              <p className="text-amber-700 bg-amber-100 p-2 rounded">Loading avatar service...</p>
            )}
          </div>
          <Chat />
        </div>
      </div>
    </>
  );
};

export default Index;
